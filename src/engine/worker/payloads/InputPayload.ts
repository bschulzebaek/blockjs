export default interface InputPayload {
    type: 'keydown' | 'keyup' | 'mousemove' | 'click' | 'contextmenu';
    movementX?: number;
    movementY?: number;
    button?: number;
    shiftKey?: boolean;
    key?: string;
}