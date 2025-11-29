export type BlockType = 'air' | 'stone' | 'dirt' | 'grass' | 'bedrock' | 'water' | 'sand' | 'log' | 'leaves';

export class Block {
    readonly type: BlockType;
    
    constructor(type: BlockType) {
        this.type = type;
    }

    isSolid(): boolean {
        return this.type !== 'air' && this.type !== 'water';
    }

    isTransparent(): boolean {
        return this.type === 'air' || this.type === 'water' || this.type === 'leaves';
    }
} 