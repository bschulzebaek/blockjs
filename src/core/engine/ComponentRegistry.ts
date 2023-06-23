interface DynamicComponent {
    update(delta: number): void;
}

interface StaticComponent {

}

export default class ComponentRegistry {
    private readonly dynamic: Map<string, DynamicComponent> = new Map();
    private readonly static: Map<string, StaticComponent> = new Map();

    public addDynamic(name: string, component: DynamicComponent) {
        this.dynamic.set(name, component);
    }

    public iterateDynamic(callback: (component: DynamicComponent) => void) {
        this.dynamic.forEach(callback);
    }

    public addStatic(name: string, component: StaticComponent) {
        this.static.set(name, component);
    }

    public iterateStatic(callback: (component: StaticComponent) => void) {
        this.static.forEach(callback);
    }
}