import FileService from './FileService.ts';

interface WorldData {
    version: number;
    player?: {
        position: [number, number, number];  // [x, y, z]
        rotation: [number, number];          // [x, y]
    };
    // Future: Add more world data here (time, weather, etc.)
}

export class WorldDataStorage {
    private static readonly DATA_FILE = 'data.bin';
    private static readonly VERSION = 1;
    private static readonly SAVE_INTERVAL_MS = 1000;

    private data: WorldData = { version: WorldDataStorage.VERSION };
    private isDirty = false;
    private saveInterval: number | null = null;

    constructor(
        private readonly fileService: FileService,
        private readonly worldId: string
    ) {}

    public async init(): Promise<void> {
        await this.fileService.init();
        await this.load();
        this.startAutoSave();

        // Set up page unload handler
        window.addEventListener('beforeunload', this.onBeforeUnload);
    }

    private onBeforeUnload = () => {
        if (this.isDirty) {
            this.executeSave();
        }
    }

    private startAutoSave() {
        if (this.saveInterval !== null) {
            return;
        }

        this.saveInterval = window.setInterval(() => {
            if (this.isDirty) {
                this.executeSave();
            }
        }, WorldDataStorage.SAVE_INTERVAL_MS);
    }

    public updatePlayerState(
        position: { x: number, y: number, z: number },
        rotation: { x: number, y: number }
    ): void {
        this.data.player = {
            position: [position.x, position.y, position.z],
            rotation: [rotation.x, rotation.y]
        };
        this.isDirty = true;
    }

    public getPlayerData(): { position: [number, number, number], rotation: [number, number] } | null {
        return this.data.player || null;
    }

    private async load(): Promise<void> {
        try {
            const data = await this.fileService.readFile(WorldDataStorage.DATA_FILE, this.worldId);
            if (data) {
                const decompressed = await this.decompressData(data);
                this.data = JSON.parse(decompressed);
                console.debug('[WorldDataStorage] Loaded world data');
            }
        } catch (e) {
            console.debug('[WorldDataStorage] No saved world data found');
        }
    }

    private async executeSave(): Promise<void> {
        try {
            const jsonData = JSON.stringify(this.data);
            const compressed = await this.compressData(jsonData);
            await this.fileService.writeFile(
                WorldDataStorage.DATA_FILE,
                compressed,
                this.worldId
            );
            this.isDirty = false;
            console.debug('[WorldDataStorage] Saved world data');
        } catch (e) {
            console.error('[WorldDataStorage] Failed to save world data:', e);
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

    public dispose() {
        window.removeEventListener('beforeunload', this.onBeforeUnload);
        if (this.saveInterval !== null) {
            window.clearInterval(this.saveInterval);
            this.saveInterval = null;
        }
    }
} 