import Bottle from 'bottlejs';
import InputMapper from './framework/input/InputMapper';
import PointerLockHelper from './framework/input/PointerLockHelper';
import AssetService from './framework/asset/AssetService';
import FileService from './framework/storage/FileService';
import World from './framework/world/World';
import Cursor from './content/player/Cursor';
import Skybox from './content/environment/Skybox';
import BlockRaycaster from './framework/world/BlockRaycaster';
import SceneFactory from './framework/scene/Scene.factory';
import CubeFactory from './content/demo/Cube.factory';
import { PerspectiveCamera } from 'three';
import PlayerContainer from './content/player/PlayerContainer';
import ChunkWorkerAdapter from './worker/chunk/ChunkWorkerAdapter.ts';

const bottle = new Bottle();

bottle.service('ChunkWorker', ChunkWorkerAdapter);

bottle.service('InputMapper', InputMapper);
bottle.service('PointerLockHelper', PointerLockHelper);
bottle.service('AssetService', AssetService);
bottle.service('FileService', FileService);
bottle.service('Skybox', Skybox, 'Scene');
bottle.service('Cursor', Cursor, 'BlockRaycaster');
bottle.service('BlockRaycaster', BlockRaycaster, 'World', 'Camera');
bottle.service('World', World, 'ChunkWorker');
bottle.service('Camera', function() {
    return new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 1000);
});
bottle.service('PlayerContainer', PlayerContainer, 'Camera', 'Cursor', 'InputMapper', 'World');

bottle.factory('Scene', SceneFactory);
bottle.factory('Cube', CubeFactory);

// bottle.service('WorldDataStorage', function(_) {
//     const worldDataStorage = new WorldDataStorage(bottle.container.FileService);

//     return worldDataStorage;
// });

export type BlockJSContainer = typeof bottle.container;

export default bottle;