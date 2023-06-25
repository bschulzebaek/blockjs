import { Context, createContext } from 'react';
import WorkerAdapter from '@/app/(game)/[uuid]/WorkerAdapter';

// @ts-ignore
const WorkerAdapterContext: Context<WorkerAdapter> = createContext(null);

export {
    WorkerAdapterContext as default,
}