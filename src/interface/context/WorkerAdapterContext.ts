import { Context, createContext } from 'react';
import WorkerAdapter from '../WorkerAdapter';

// @ts-ignore
const WorkerAdapterContext: Context<WorkerAdapter> = createContext(null);

export {
    WorkerAdapterContext as default,
}