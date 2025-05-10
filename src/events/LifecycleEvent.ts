export default class LifecycleEvent extends Event {
    public tasks: (Promise<any>|Function)[] = [];
    
    constructor(name: string) {
        super(name);
    }
    
    public run() {
        return Promise.all(this.tasks);
    }
}