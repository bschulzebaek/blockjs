import SessionDestroyEvent from '../lifecycle/session/SessionDestroyEvent.ts';

window.addEventListener(SessionDestroyEvent.NAME, (() => {
    BlockJS.scene?.stop();
    BlockJS.scene = null;
}) as EventListener);
    
    
