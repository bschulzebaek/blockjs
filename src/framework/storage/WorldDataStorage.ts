import FileService from './FileService.ts';

interface WorldData {
    version: number;
    player?: {
        position: [number, number, number];
        rotationX: number;
        rotationY: number;
    };
    lastSaved?: number;
}

export class WorldDataStorage {
    private static readonly DATA_FILE = 'data.bin';
    private static readonly VERSION = 1;
    private static readonly SAVE_INTERVAL_MS = 5000; 
    private static readonly SAVE_DEBOUNCE_MS = 1000;

    private data: WorldData = { version: WorldDataStorage.VERSION };
    private saveInterval: number | null = null;
    private hasUnsavedChanges = false;
    private saveTimeout: number | null = null;
    private fileService: FileService;
    private worldId: string;

    constructor(fileService: FileService) {
        this.worldId = BlockJS.id!;
        this.fileService = fileService;
    }

    public async init(): Promise<void> {
        await this.fileService.init();
        await this.load();
        this.startAutoSave();
        this.setupPageUnloadHandlers();
    }

    private setupPageUnloadHandlers() {
        window.addEventListener('beforeunload', async () => {
            if (this.hasUnsavedChanges) {
                await this.executeSave();
            }
        });

        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'hidden' && this.hasUnsavedChanges) {
                this.executeSave();
            }
        });
    }

    private startAutoSave() {
        if (this.saveInterval !== null) {
            return;
        }

        this.saveInterval = window.setInterval(() => {
            if (this.hasUnsavedChanges) {
                this.executeSave();
            }
        }, WorldDataStorage.SAVE_INTERVAL_MS);
    }

    private debouncedSave() {
        if (this.saveTimeout !== null) {
            window.clearTimeout(this.saveTimeout);
        }
        
        this.saveTimeout = window.setTimeout(() => {
            this.executeSave();
            this.saveTimeout = null;
        }, WorldDataStorage.SAVE_DEBOUNCE_MS);
    }

    public updatePlayerState(
        position: { x: number, y: number, z: number },
        rotationX: number,
        rotationY: number
    ): void {
        this.data.player = {
            position: [position.x, position.y, position.z],
            rotationX: rotationX,
            rotationY: rotationY,
        };
        this.hasUnsavedChanges = true;
        this.debouncedSave();
    }

    public getPlayerData(): { position: [number, number, number], rotationX: number, rotationY: number } | null {
        return this.data.player || null;
    }

    private async load(): Promise<void> {
        try {
            const data = await this.fileService.readWorldFile(WorldDataStorage.DATA_FILE);

            if (data) {
                const decompressed = await this.decompressData(data);
                const parsedData = JSON.parse(decompressed);
                
                if (this.isValidWorldData(parsedData)) {
                    this.data = parsedData;
                } else {
                    console.warn('[WorldDataStorage] Invalid data format, using default');
                }
            }
        } catch (e) {
            console.debug('[WorldDataStorage] No saved world data found');
        }
    }

    private isValidWorldData(data: any): data is WorldData {
        return (
            typeof data === 'object' &&
            typeof data.version === 'number' &&
            (!data.player || (
                Array.isArray(data.player.position) &&
                data.player.position.length === 3 &&
                typeof data.player.rotationX === 'number' &&
                typeof data.player.rotationY === 'number'
            ))
        );
    }

    private async executeSave(): Promise<void> {
        try {
            this.data.lastSaved = Date.now();
            const jsonData = JSON.stringify(this.data);
            const compressed = await this.compressData(jsonData);
            await this.fileService.writeFile(
                WorldDataStorage.DATA_FILE,
                compressed,
                this.worldId
            );
            this.hasUnsavedChanges = false;
            console.debug('[WorldDataStorage] Saved world data');
        } catch (e) {
            console.error('[WorldDataStorage] Failed to save world data:', e);
            this.hasUnsavedChanges = true;
        }
    }

    private async compressData(data: string): Promise<string> {
        const compressed = new CompressionStream('gzip');
        const writer = compressed.writable.getWriter();
        const chunks: Uint8Array[] = [];
        
        writer.write(new TextEncoder().encode(data));
        writer.close();

        const reader = compressed.readable.getReader();
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }

        return btoa(String.fromCharCode(...result));
    }

    private async decompressData(base64: string): Promise<string> {
        const compressed = Uint8Array.from(atob(base64), c => c.charCodeAt(0));
        const decompressed = new DecompressionStream('gzip');
        const writer = decompressed.writable.getWriter();
        const chunks: Uint8Array[] = [];

        writer.write(compressed);
        writer.close();

        const reader = decompressed.readable.getReader();
        while (true) {
            const { value, done } = await reader.read();
            if (done) break;
            chunks.push(value);
        }

        const totalLength = chunks.reduce((sum, chunk) => sum + chunk.length, 0);
        const result = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of chunks) {
            result.set(chunk, offset);
            offset += chunk.length;
        }

        return new TextDecoder().decode(result);
    }

    public async forceSave(): Promise<void> {
        if (this.saveTimeout !== null) {
            window.clearTimeout(this.saveTimeout);
            this.saveTimeout = null;
        }
        await this.executeSave();
    }

    public dispose() {
        if (this.saveInterval !== null) {
            window.clearInterval(this.saveInterval);
            this.saveInterval = null;
        }
        if (this.saveTimeout !== null) {
            window.clearTimeout(this.saveTimeout);
            this.saveTimeout = null;
        }
        
        if (this.hasUnsavedChanges) {
            this.executeSave();
        }
    }
} 