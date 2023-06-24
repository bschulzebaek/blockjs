import { Context, createContext } from 'react';

// @ts-ignore
const WorkerContext: Context<Worker> = createContext(null);

export {
    WorkerContext as default,
}