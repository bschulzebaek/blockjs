import WorkerContext from '@/core/engine/WorkerContext';
import '@/core/engine/load-subscriber';

onmessage = WorkerContext.messageHandler.onMessage;