import InputPayload from '@/core/engine/messages/InputPayload';

export default class InputMapper {
    private keyDownSubscribers: Map<string, Function> = new Map();
    private keyUpSubscribers: Map<string, Function> = new Map();
    private mouseMoveSubscriber: Function|null = null;
    private clickSubscriber: Function|null = null;
    private contextMenuSubscriber: Function|null = null;

    public subscribeKeyDown(code: string, callback: Function) {
        this.keyDownSubscribers.set(code, callback);
    }

    public subscribeKeyUp(code: string, callback: Function) {
        this.keyUpSubscribers.set(code, callback);
    }

    public subscribeMouseMove(callback: Function) {
        this.mouseMoveSubscriber = callback;
    }

    public subscribeClick(callback: Function) {
        this.clickSubscriber = callback;
    }

    public subscribeContextMenu(callback: Function) {
        this.contextMenuSubscriber = callback;
    }

    public dispatch(event: InputPayload) {
        switch (event.type) {
            case 'keydown':
                this.keyDownSubscribers.get(event.key!)?.(event.shiftKey);
                break;
            case 'keyup':
                this.keyUpSubscribers.get(event.key!)?.(event.shiftKey);
                break;
            case 'mousemove':
                this.mouseMoveSubscriber?.(event.movementX, event.movementY);
                break;
            case 'click':
                this.clickSubscriber?.(event.button, event.shiftKey);
                break;
            case 'contextmenu':
                this.contextMenuSubscriber?.(event.button, event.shiftKey);
                break;
        }
    }
}