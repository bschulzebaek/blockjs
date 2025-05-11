class PointerLockHelper {
    static LOCK_LIMIT_MS = 1400; // Chrome prevents too frequent requests, 1 per ~1400ms is the limit
    static LOCK_RETRY_DELAY_MS = 200;

    private lastChange = 0;
    private lockPromise: Promise<void> | null = null;
    private requestTimeout = 0;

    constructor() {
        document.addEventListener('pointerlockchange', () => {
            this.lastChange = Date.now();
            this.lockPromise = null;
        });
    }

    public init = () => {
        BlockJS.canvas!.addEventListener('click', this.request);
    }
    
    private request = async () => {
        const canvas = BlockJS.canvas as HTMLCanvasElement;
        
        clearTimeout(this.requestTimeout);

        switch (true) {
            case document.pointerLockElement === canvas:
                break;
            case !!this.lockPromise: // Request promise pending
                break;
            case Date.now() - this.lastChange < PointerLockHelper.LOCK_LIMIT_MS:
                this.retryWithDelay();
                break;
            default:
                this.lockPromise = canvas.requestPointerLock();
                await this.lockPromise;
        }
    }
    
    private retryWithDelay() {
        this.requestTimeout = setTimeout(this.request, PointerLockHelper.LOCK_RETRY_DELAY_MS);
    }
}

export default PointerLockHelper;