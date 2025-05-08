import type MetaInformation from './MetaInformation.ts';
import OPFSAdapter from './OPFSAdapter.ts';
import ReservedFileNames from './reserved-file-names.ts';
import AppInitEvent from '../lifecycle/app/AppInitEvent.ts';

export default class FileService {
    private adapter = new OPFSAdapter();
    
    constructor() {
        window.addEventListener(AppInitEvent.NAME, ((event: AppInitEvent) => {
            event.tasks.push(this.init());
        }) as EventListener);
    }

    private init = async () => {
        await this.adapter.init();
    }
    
    public async readFile(name: string, directoryId?: string, create = false) {
        const dir = await this.adapter.getDirectory(directoryId, false);
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