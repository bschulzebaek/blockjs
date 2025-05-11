import type { BlockJSContainer } from "../../container";
import Scene from "./Scene";

export default function SceneFactory(container: BlockJSContainer) {
    const scene = new Scene(container.Camera);

    // const world = container.World;
    scene.add(container.World);

    const player = container.PlayerContainer;
    player.position.set(0, 20, 0);

    const cube = container.Cube;

    cube.position.set(0, 22, -8);

    scene.addDynamicEntity(cube);
    scene.addDynamicEntity(container.PlayerContainer);
    scene.addDynamicEntity(container.Cursor);

    return scene;
}