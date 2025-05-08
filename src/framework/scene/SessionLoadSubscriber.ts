import SessionLoadEvent from '../lifecycle/session/SessionLoadEvent.ts';
import Scene from './Scene.ts';
import demoScene from './demo-scene.ts';

window.addEventListener(SessionLoadEvent.NAME, (() => {
    const scene = new Scene();
    demoScene(scene);
    BlockJS.scene = scene;
}) as EventListener);
    
    