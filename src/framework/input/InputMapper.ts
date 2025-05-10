import EventHelper from '../../events/EventHelper.ts';
import SceneStopEvent from '../../events/scene/SceneStopEvent.ts';
import SceneStartEvent from '../../events/scene/SceneStartEvent.ts';

type KeyDownHandler = (event: KeyboardEvent) => void;
type KeyUpHandler = (event: KeyboardEvent) => void;
type MouseEventHandler = (event: MouseEvent) => void;

const InputAction = {
    MOVE_FORWARD: 'move_forward',
    MOVE_BACKWARD: 'move_backward',
    MOVE_LEFT: 'move_left',
    MOVE_RIGHT: 'move_right',
    MOVE_UP: 'move_up',
    MOVE_DOWN: 'move_down',
}

type InputActionName = typeof InputAction[keyof typeof InputAction];

const defaultKeyMapping: Record<InputActionName, string> = {
    [InputAction.MOVE_FORWARD]: 'KeyW',
    [InputAction.MOVE_BACKWARD]: 'KeyS',
    [InputAction.MOVE_LEFT]: 'KeyA',
    [InputAction.MOVE_RIGHT]: 'KeyD',
    [InputAction.MOVE_UP]: 'Space',
    [InputAction.MOVE_DOWN]: 'ShiftLeft',
};

/**
 * A helper for binding specific in-game actions to a configurable user input.
 * Actions are only called if the scene is active and the pointer is locked to the main canvas.
 */
class InputMapper {
    private leftClickHandler: MouseEventHandler | null = null;
    private rightClickHandler: MouseEventHandler | null = null;
    private mouseMoveHandler = new Map<string, MouseEventHandler | null>();
    private actionStartHandler = new Map<InputActionName, KeyDownHandler | null>();
    private actionEndHandler = new Map<InputActionName, KeyUpHandler | null>();
    private actionInputMap = new Map<string, InputActionName>();

    private sceneActive = false;
    private lockActive = false;

    constructor() {
        Object.entries(defaultKeyMapping).forEach(([action, key]) => {
            this.actionStartHandler.set(action as InputActionName, null);
            this.actionEndHandler.set(action as InputActionName, null);
            this.actionInputMap.set(key, action as InputActionName);
        });
        
        document.addEventListener('pointerlockchange', () => {
            this.lockActive = document.pointerLockElement !== null;
            this.updateListeners();
        });

        EventHelper.subscribe(SceneStartEvent.NAME, () => {
            this.start();
        });
    
        EventHelper.subscribe(SceneStopEvent.NAME, () => {
            this.stop();
        });
    }

    public bindAction(
        name: InputActionName,
        start: KeyDownHandler | null = null,
        end: KeyUpHandler | null = null,
    ) {
        this.actionStartHandler.set(name, start);
        this.actionEndHandler.set(name, end);
    }

    public bindActionKey(
        action: InputActionName,
        keyCode: string,
    ) {
        this.actionInputMap.set(keyCode, action);
    }

    public bindMouseMove(name: string, handler: MouseEventHandler | null = null) {
        this.mouseMoveHandler.set(name, handler);
    }

    public bindLeftClick(handler: MouseEventHandler | null = null) {
        this.leftClickHandler = handler;
    }

    public bindRightClick(handler: MouseEventHandler | null = null) {
        this.rightClickHandler = handler;
    }

    private start = () => {
        this.sceneActive = true;
        this.updateListeners();
    }

    private stop = () => {
        this.sceneActive = false;
        this.updateListeners();
    }

    /**
     * Instead of permanently listening for events, we only listen when the game is active and the pointer is locked.
     * This way we don't need to check for the active state in every event handler during scene updates.
     */
    private updateListeners() {
        if (this.sceneActive && this.lockActive) {
            addEventListener('keydown', this._onKeyDown);
            addEventListener('keyup', this._onKeyUp);
            addEventListener('mousemove', this._onMouseMove);
            addEventListener('click', this._onMouseClick);
        } else {
            removeEventListener('keydown', this._onKeyDown);
            removeEventListener('keyup', this._onKeyUp);
            removeEventListener('mousemove', this._onMouseMove);
            removeEventListener('click', this._onMouseClick);
        }
    }

    private _onKeyDown = (event: KeyboardEvent) => {
        const action = this.actionInputMap.get(event.code);

        if (!action) {
            return;
        }

        const handler = this.actionStartHandler.get(action);

        if (!handler) {
            return;
        }

        handler(event);
    }

    private _onKeyUp = (event: KeyboardEvent) => {
        const action = this.actionInputMap.get(event.code);

        if (!action) {
            return;
        }

        const handler = this.actionEndHandler.get(action);

        if (!handler) {
            return;
        }

        handler(event);
    }

    private _onMouseMove = (event: MouseEvent) => {
        this.mouseMoveHandler.forEach((handler) => {
            handler?.(event);
        });
    }

    private _onMouseClick = (event: MouseEvent) => {
        if (event.button === 0) {
            this.leftClickHandler?.(event);
        } else if (event.button === 2) {
            this.rightClickHandler?.(event);
        }
    }
}


export {
    InputMapper as default,
    InputAction,
}
