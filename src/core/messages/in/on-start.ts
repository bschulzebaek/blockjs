import GlobalState from '@/core/GlobalState';

export default function onStart() {
    GlobalState.getLoop().start();
}