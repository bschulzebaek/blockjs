import type MetaInformation from './MetaInformation.ts';
import OPFSAdapter from './OPFSAdapter.ts';
import ReservedFileNames from './reserved-file-names.ts';

export default class FileService {
    private adapter = new OPFSAdapter();
    private worldId: string | null = null;

    public init = async () => {
        await this.adapter.init();
    }
    
    public setWorldId = (worldId: string) => {
        this.worldId = worldId;
    }

    public async readFile(name: string, create = false) {
        const dir = await this.adapter.getDirectory(undefined, false);
        const fileHandle = await dir.getFileHandle(name, {
            create,
        });
        
        const file = await fileHandle.getFile();
        return file.text();
    }

    public async readWorldFile(name: string, create = false) {
        const dir = await this.adapter.getDirectory(this.worldId!, false);
        const fileHandle = await dir.getFileHandle(name, {
            create,
        });
        
        const file = await fileHandle.getFile();
        return file.text();
    }

    public async writeFile(name: string, content: string, directoryId?: string) {
        const directory = await this.adapter.getDirectory(directoryId);
        const metaFile = await directory.getFileHandle(name, {
            create: true
        });
        const writable = await metaFile.createWritable();
        await writable.write(content);
        await writable.close();
    }
    
    public async getAllMetaFiles() {
        const directories = await this.adapter.getDirectories();
        const metaFiles: MetaInformation[] = [];
        
        for (const directory of directories) {
            try {
                const file = await this.adapter.readFile(ReservedFileNames.META, directory);
               
                const text = await file.text();
                const meta: MetaInformation = JSON.parse(text);
                
                metaFiles.push(meta);
            } catch (e) {
                console.error(`Failed to read meta file for ${directory.name}`, e);
            }
        }
        
        return metaFiles;
    }
}