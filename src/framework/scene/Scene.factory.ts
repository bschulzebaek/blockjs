import type { BlockJSContainer } from "../../container";
import Scene from "./Scene";

export default function SceneFactory(container: BlockJSContainer) {
    const scene = new Scene(container.Camera);

    scene.add(container.World);
    scene.addDynamicEntity(container.Cursor);

    return scene;
}