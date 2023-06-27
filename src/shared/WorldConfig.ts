export default class WorldConfig {
    constructor(
        private readonly uuid: string,
        private readonly name: string,
        private readonly seed: string,
    ) {
    }

    public getUUID(): string {
        return this.uuid;
    }

    public getName(): string {
        return this.name;
    }

    public getSeed(): string {
        return this.seed;
    }

    static fromObject(obj: { uuid: string, name: string, seed: string }): WorldConfig {
        return new WorldConfig(obj.uuid, obj.name, obj.seed);
    }
}