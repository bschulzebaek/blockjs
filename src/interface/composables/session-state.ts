import { ref, type Ref } from 'vue'
import SessionLoadEvent from '../../framework/lifecycle/session/SessionLoadEvent.ts';
import SessionStartEvent from '../../framework/lifecycle/session/SessionStartEvent.ts';

export const SessionStates = {
    LOADING: 'loading',
    DEFAULT: 'default',
};

type SessionState = typeof SessionStates[keyof typeof SessionStates];

export function useSessionState() {
    const state: Ref<SessionState> = ref(SessionStates.LOADING);
    
    window.addEventListener(SessionLoadEvent.NAME, () => { state.value = SessionStates.LOADING; });
    window.addEventListener(SessionStartEvent.NAME, () => { state.value = SessionStates.DEFAULT; });
    
    return {
        state,
    }
}