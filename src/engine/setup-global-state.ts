import GlobalState from '@/engine/worker/states/GlobalState';
import CustomRenderer from '@/engine/renderer/CustomRenderer';
import Loop from '@/engine/renderer/Loop';
import CustomScene from '@/engine/scene/CustomScene';
import SetupPayload from '@/engine/worker/payloads/SetupPayload';
import Settings from '@/shared/settings/Settings';
import WorldConfig from '@/shared/world-config/WorldConfig';
import World from '@/world/World';


export default function setupGlobalState(payload: SetupPayload) {
    GlobalState.setConfig(WorldConfig.fromObject(payload.config as { uuid: string, seed: string, name: string }));
    GlobalState.setSettings(Settings.fromObject(payload.settings));
    GlobalState.setWorld(new World());

    const scene = new CustomScene();

    const renderer = new CustomRenderer(payload.canvas);
    const loop = new Loop(renderer, scene);

    GlobalState.setScene(scene);
    GlobalState.setRenderer(renderer);
    GlobalState.setLoop(loop);

}