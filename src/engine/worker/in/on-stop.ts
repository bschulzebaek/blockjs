import GlobalState from '@/engine/worker/states/GlobalState';

export default function onStop() {
    GlobalState.getLoop().stop();
}