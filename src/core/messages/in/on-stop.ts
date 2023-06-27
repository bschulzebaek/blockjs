import GlobalState from '@/core/GlobalState';

export default function onStop() {
    GlobalState.getLoop().stop();
}