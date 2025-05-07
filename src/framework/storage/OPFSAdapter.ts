export default class OPFSAdapter {
    private root: FileSystemDirectoryHandle | null = null;
    
    public async init() {
        this.root = await navigator.storage.getDirectory();
    }
    
    public async getDirectory(id?: string, create = true) {
        if (!this.root) {
            throw new Error("Root directory not initialized");
        }
        
        if (!id) {
            return this.root;
        }
        
        return await this.root.getDirectoryHandle(id, { 
            create, 
        });
    }

    public async getDirectories() {
        if (!this.root) {
            throw new Error("Root directory not initialized");
        }
        
        const dirs = [];
        
        for await (const entry of this.root.values()) {
            if (entry instanceof FileSystemDirectoryHandle) {
                dirs.push(entry);
            }
        }
        
        return dirs;
    }
    
    public async readFile(name: string, directory: FileSystemDirectoryHandle) {
        if (!directory) {
            throw new Error("Missing parameter: directory");
        }
        
        const handle = await directory.getFileHandle(name);
        return handle.getFile();
    }
}