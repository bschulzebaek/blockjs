class PointerLockHelper {
    static LOCK_LIMIT_MS = 1400; // Chrome prevents too frequent requests, 1 per ~1400ms is the limit
    static LOCK_RETRY_DELAY_MS = 200;

    private lastChange = 0;
    private lockPromise: Promise<void> | null = null;
    private requestTimeout = 0;
    private resolvePointerLock: (() => void) | null = null;
    private rejectPointerLock: ((error: Error) => void) | null = null;

    constructor() {
        document.addEventListener('pointerlockchange', () => {
            this.lastChange = Date.now();
            if (document.pointerLockElement === BlockJS.canvas) {
                this.resolvePointerLock?.();
            } else {
                this.rejectPointerLock?.(new Error('Pointer lock was released'));
            }
            this.resolvePointerLock = null;
            this.rejectPointerLock = null;
            this.lockPromise = null;
        });

        document.addEventListener('pointerlockerror', () => {
            this.rejectPointerLock?.(new Error('Failed to acquire pointer lock'));
            this.resolvePointerLock = null;
            this.rejectPointerLock = null;
            this.lockPromise = null;
        });
    }

    public init = () => {
        BlockJS.canvas!.addEventListener('click', this.request);
    }

    public lock = () => {
        return this.request();
    }
    
    private request = async () => {
        const canvas = BlockJS.canvas as HTMLCanvasElement;
        
        clearTimeout(this.requestTimeout);

        if (document.pointerLockElement === canvas) {
            return Promise.resolve();
        }

        if (this.lockPromise) {
            return this.lockPromise;
        }

        if (Date.now() - this.lastChange < PointerLockHelper.LOCK_LIMIT_MS) {
            return new Promise<void>((resolve, reject) => {
                this.requestTimeout = setTimeout(() => {
                    this.request().then(resolve).catch(reject);
                }, PointerLockHelper.LOCK_RETRY_DELAY_MS);
            });
        }

        // Create a new lock request
        this.lockPromise = new Promise<void>((resolve, reject) => {
            this.resolvePointerLock = resolve;
            this.rejectPointerLock = reject;
            try {
                canvas.requestPointerLock();
            } catch (error) {
                this.rejectPointerLock(error as Error);
                this.resolvePointerLock = null;
                this.rejectPointerLock = null;
                this.lockPromise = null;
            }
        });

        return this.lockPromise;
    }
}

export default PointerLockHelper;