import GlobalState from '@/engine/worker/states/GlobalState';
import Loop from '@/engine/renderer/Loop';
import CustomScene from '@/engine/scene/CustomScene';
import SetupPayload from '@/engine/worker/payloads/SetupPayload';
import WorldGenerator from '@/framework/world/generation/WorldGenerator';
import Settings from '@/shared/settings/Settings';
import WorldConfig from '@/shared/world-config/WorldConfig';
import World from '@/framework/world/World';

export default async function stepSetupGlobalState(payload: SetupPayload) {
    GlobalState.setConfig(WorldConfig.fromObject(payload.config as { uuid: string, seed: string, name: string }));
    GlobalState.setSettings(Settings.fromObject(payload.settings));
    GlobalState.setWorld(new World());
    GlobalState.setGenerator(new WorldGenerator());

    const scene = new CustomScene();
    GlobalState.setScene(scene);
    GlobalState.setLoop(new Loop(payload.canvas, scene));

}