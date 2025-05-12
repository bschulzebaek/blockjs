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
import { PerspectiveCamera } from 'three';
import ChunkWorkerAdapter from './worker/chunk/ChunkWorkerAdapter.ts';
import Player from './content/player/Player.ts';
import EntityManager from './framework/scene/EntityManager.ts';
import Cube from './content/demo/Cube.ts';
import FollowCube from './content/demo/FollowCube.ts';

const bottle = new Bottle();

bottle.service('ChunkWorker', ChunkWorkerAdapter);

bottle.service('InputMapper', InputMapper);
bottle.service('PointerLockHelper', PointerLockHelper);
bottle.service('AssetService', AssetService);
bottle.service('FileService', FileService);
bottle.service('EntityManager', EntityManager, 'Scene', 'FileService');

bottle.service('Skybox', Skybox, 'Scene');
bottle.service('Cursor', Cursor, 'BlockRaycaster');
bottle.service('BlockRaycaster', BlockRaycaster, 'World', 'Camera');
bottle.service('World', World, 'ChunkWorker');
bottle.service('Camera', function() {
    return new PerspectiveCamera(90, window.innerWidth / window.innerHeight, 0.01, 1000);
});
bottle.factory('Scene', SceneFactory);
bottle.service('Player', Player, 'Camera', 'Cursor', 'InputMapper', 'World');

bottle.instanceFactory('Cube', function() {
    return new Cube();
});

bottle.instanceFactory('FollowCube', function(container) {
    return new FollowCube(container.Player);
});

// bottle.service('WorldDataStorage', function(_) {
//     const worldDataStorage = new WorldDataStorage(bottle.container.FileService);

//     return worldDataStorage;
// });

export type BlockJSContainer = typeof bottle.container;

export default bottle;