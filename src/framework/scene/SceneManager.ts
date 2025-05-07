import SessionStartEvent from '../lifecycle/session/SessionStartEvent.ts';
import demoScene from './demo-scene.ts';

export default class SceneManager {
   constructor() {
       window.addEventListener(SessionStartEvent.NAME, this.initDemoScene.bind(this));
   } 
   
   private initDemoScene() {
       demoScene();
   }
}