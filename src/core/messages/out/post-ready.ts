import CoreWorkerMessages from '@/shared/CoreWorkerMessages';

export default function postReady() {
    postMessage({
        action: CoreWorkerMessages.READY,
    });
}