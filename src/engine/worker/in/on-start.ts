import GlobalState from '@/engine/worker/states/GlobalState';

export default function onStart() {
    GlobalState.getLoop().start();
}