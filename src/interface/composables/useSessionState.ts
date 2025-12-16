import { ref } from 'vue';
import { STATES } from '../../framework/state-machine/states.ts';

const state = ref<string>(STATES.SCENE_INIT);

export function useSessionState() {
    const setState = (newState: string) => {
        state.value = newState;
    };

    return {
        state,
        setState,
    };
} 
