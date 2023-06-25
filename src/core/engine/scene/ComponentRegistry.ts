interface DynamicComponent {
    name: string;
    update(delta: number): void;
}

interface StaticComponent {
    name: string;
}

export default class ComponentRegistry {
    private readonly dynamic: Map<string, DynamicComponent> = new Map();
    private readonly static: Map<string, StaticComponent> = new Map();

    public addDynamic(component: DynamicComponent) {
        this.dynamic.set(component.name, component);
    }

    public iterateDynamic(callback: (component: DynamicComponent) => void) {
        this.dynamic.forEach(callback);
    }

    public addStatic(component: StaticComponent) {
        this.static.set(component.name, component);
    }

    public iterateStatic(callback: (component: StaticComponent) => void) {
        this.static.forEach(callback);
    }
}