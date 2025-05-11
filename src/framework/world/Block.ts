export type BlockType = 'air' | 'stone' | 'dirt' | 'grass' | 'bedrock' | 'water' | 'sand' | 'log' | 'leaves';

export class Block {
    constructor(public readonly type: BlockType) {}

    isSolid(): boolean {
        return this.type !== 'air' && this.type !== 'water';
    }

    isTransparent(): boolean {
        return this.type === 'air' || this.type === 'water' || this.type === 'leaves';
    }
} 