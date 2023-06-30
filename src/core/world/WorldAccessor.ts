import Block from '@/core/world/block/Block';

type WorldAccessor = (x: number, y: number, z: number) => Block | undefined;

export default WorldAccessor;