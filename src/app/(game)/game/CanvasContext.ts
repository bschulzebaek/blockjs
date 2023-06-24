import { Context, createContext } from 'react';

const CanvasContext: Context<HTMLCanvasElement> = createContext(
    null as unknown as HTMLCanvasElement
);

export {
    CanvasContext as default,
};