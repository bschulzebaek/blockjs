import SessionStartEvent from '../lifecycle/session/SessionStartEvent.ts';

window.addEventListener(SessionStartEvent.NAME, (() => {
    BlockJS.scene?.start();
}) as EventListener);
    
    
