export default class ChunkAddedEvent extends Event {
    static NAME = 'world/chunk-added';

    constructor() {
        super(ChunkAddedEvent.NAME);
    }
}