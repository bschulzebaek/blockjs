import { ref, type Ref } from 'vue'
import SceneLoadEvent from '../../events/scene/SceneLoadEvent.ts';
import SceneStartEvent from '../../events/scene/SceneStartEvent.ts';
import EventHelper from '../../events/EventHelper.ts';

export const SceneStates = {
    LOADING: 'loading',
    DEFAULT: 'default',
};

type SceneState = typeof SceneStates[keyof typeof SceneStates];

export function useSceneState() {
    const state: Ref<SceneState> = ref(SceneStates.LOADING);
    
    EventHelper.subscribe(SceneLoadEvent.NAME, () => { state.value = SceneStates.LOADING; });
    EventHelper.subscribe(SceneStartEvent.NAME, () => { state.value = SceneStates.DEFAULT; });
    
    return {
        state,
    }
}