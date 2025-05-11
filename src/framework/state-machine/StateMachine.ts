export type StateConfig<T extends string> = {
    [K in T]: {
        transitions: T[];
        onEnter?: () => void | Promise<void>;
        onExit?: () => void | Promise<void>;
    };
};

export class StateMachine<T extends string> {
    private readonly config: StateConfig<T> = {} as StateConfig<T>;
    private currentState!: T;
    private isTransitioning: boolean = false;
    private currentTransition: Promise<boolean> | null = null;
    private currentTransitionState: { from: T, to: T } | null = null;

    constructor(initialState: T, config: StateConfig<T>) {
        StateMachine.validateConfig(config);
        Object.assign(this.config, config);
        
        // Start the initial state transition
        this.isTransitioning = true;
        this.currentTransitionState = { from: initialState, to: initialState };
        
        // Setup initial transition
        this.currentTransition = (async () => {
            try {
                console.groupCollapsed(`[StateMachine] Initializing with state "${initialState}"`);
                // Only run onEnter for initial state
                console.debug(`[StateMachine] Initializing with state "${initialState}"`);
                this.currentState = initialState;
                await this.config[initialState].onEnter?.();
                console.debug(`[StateMachine] Initialized with state "${initialState}"`);
                return true;
            } catch (error) {
                console.error(`[StateMachine] Error during initialization:`, error);
                return false;
            } finally {
                this.isTransitioning = false;
                this.currentTransitionState = null;
                this.currentTransition = null;
                console.groupEnd();
            }
        })();
    }

    private static validateConfig<T extends string>(config: StateConfig<T>): void {
        for (const state in config) {
            const transitions = config[state].transitions;
            for (const transition of transitions) {
                if (!config[transition]) {
                    throw new Error(
                        `Invalid transition state "${transition}" specified in state "${state}". ` +
                        'All transition states must be defined in the configuration.'
                    );
                }
            }
        }
    }

    public getState(): T {
        return this.currentState;
    }

    public isInTransition(): boolean {
        return this.isTransitioning;
    }

    public getCurrentTransition(): { from: T, to: T } | null {
        return this.currentTransitionState;
    }

    public async waitForTransition(): Promise<void> {
        if (this.currentTransition) {
            await this.currentTransition;
        }
    }

    private async executeTransition(fromState: T, toState: T): Promise<boolean> {
        const startTime = performance.now();
        try {
            console.debug(`[StateMachine] Executing exit handler for "${fromState}"`);
            await this.config[fromState].onExit?.();

            const previousState = fromState;
            this.currentState = toState;

            try {
                console.debug(`[StateMachine] Executing enter handler for "${toState}"`);
                await this.config[toState].onEnter?.();
                const duration = (performance.now() - startTime).toFixed(2);
                console.debug(`[StateMachine] Transition complete (${duration}ms)`);
                return true;
            } catch (error) {
                console.error(`[StateMachine] Error in enter handler for "${toState}":`, error);
                this.currentState = previousState;
                return false;
            }
        } catch (error) {
            console.error(`[StateMachine] Error during transition:`, error);
            return false;
        }
    }

    public transition(newState: T): Promise<boolean> {
        if (this.isTransitioning) {
            console.warn(`[StateMachine] Transition already in progress (${this.currentTransitionState?.from} -> ${this.currentTransitionState?.to})`);
            return Promise.resolve(false);
        }

        const currentStateConfig = this.config[this.currentState];
        
        if (!currentStateConfig.transitions.includes(newState)) {
            console.warn(`[StateMachine] Invalid transition: ${this.currentState} -> ${newState}. `);
            return Promise.resolve(false);
        }

        this.isTransitioning = true;
        this.currentTransitionState = { from: this.currentState, to: newState };
        console.groupCollapsed(`[StateMachine] Transitioning from "${this.currentState}" to "${newState}"`);

        this.currentTransition = this.executeTransition(this.currentState, newState)
            .catch(() => {
                return Promise.reject(false);
            })
            .finally(() => {
                this.isTransitioning = false;
                this.currentTransitionState = null;
                this.currentTransition = null;
                console.groupEnd();
            });

        return this.currentTransition;
    }

    public canTransitionTo(state: T): boolean {
        return this.config[this.currentState].transitions.includes(state);
    }

    public getAllowedTransitions(): T[] {
        return [...this.config[this.currentState].transitions];
    }
}