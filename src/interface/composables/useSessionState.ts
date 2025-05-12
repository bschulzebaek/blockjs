import { ref } from 'vue';

const state = ref<string>('SCENE_INIT');

export function useSessionState() {
    const setState = (newState: string) => {
        state.value = newState;
    };

    return {
        state,
        setState,
    };
} 
