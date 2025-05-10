import type LifecycleEvent from './LifecycleEvent.ts';

export default class EventHelper {
    public static publish<T extends LifecycleEvent>(eventClass: new () => T): Promise<void[]> {
        console.debug(`[EventHelper.publish] ${eventClass.name}`);
        const event = new eventClass();
        window.dispatchEvent(event);

        return Promise.all(event.tasks);
    }
    
    public static subscribe(eventName: string, callback: () => (any | Promise<any>)): void {
        window.addEventListener(eventName, ((event: LifecycleEvent) => {
            event.tasks.push(callback());
        }) as EventListener);
    }
}