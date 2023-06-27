import GlobalState from '@/core/GlobalState';
import SetupPayload from '@/core/messages/payloads/SetupPayload';
import WorldConfig from '@/shared/WorldConfig';
import FeatureFlags from '@/shared/FeatureFlags';
import applySchema from '@/core/engine/storage/apply-schema';
import WorldService from '@/core/world/WorldService';
import CustomScene from '@/core/engine/scene/CustomScene';
import SceneService from '@/core/engine/scene/SceneService';
import CustomRenderer from '@/core/engine/renderer/CustomRenderer';
import Loop from '@/core/engine/helper/Loop';
import postReady from '@/core/messages/out/post-ready';

export default async function onSetup(payload: SetupPayload) {
    FeatureFlags.setFromSearchParams(new URLSearchParams(payload.parameters));

    const config = WorldConfig.fromObject(payload.config as { uuid: string, seed: string, name: string });

    const uuid = config.getUUID();
    const seed = config.getSeed();

    await applySchema(uuid);

    const renderer = new CustomRenderer(payload.canvas);
    const scene = new CustomScene();
    const loop = new Loop(renderer, scene);

    await WorldService.setupWorld(uuid, seed);
    await SceneService.setupScene(scene, WorldService.getWorld());

    GlobalState.setConfig(config);
    GlobalState.setRenderer(renderer);
    GlobalState.setScene(scene);
    GlobalState.setLoop(loop);

    import('@/core/engine/load-subscriber');

    loop.frame();

    postReady();
}