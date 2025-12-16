<template>
    <div class="hotbar-container">
        <div class="hotbar">
            <div 
                v-for="(blockId, index) in inventory" 
                :key="index"
                class="slot"
                :class="{ active: selectedSlot === index }"
            >
                <div class="block-icon" :style="getBlockStyle(blockId)"></div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { BlockUV } from '../../../data/block-uv';

const inventory = ref<number[]>([]);
const selectedSlot = ref(0);
let intervalId: number | null = null;

function getBlockStyle(blockId: number) {
    if (!blockId) {
        return {};
    }

    const uvs = BlockUV[blockId];
    
    if (!uvs) {
        return {};
    }

    const u = uvs[0];
    const v = uvs[1];

    return {
        backgroundImage: 'url(/assets/textures.png)',
        backgroundPosition: `-${u * 100}% -${v * 100}%`,
        backgroundSize: '1600% 1600%',
        imageRendering: 'pixelated'
    } as any;
}

function updateState() {
    if (BlockJS.container && BlockJS.container.Player) {
        inventory.value = BlockJS.container.Player.inventory;
        selectedSlot.value = BlockJS.container.Player.selectedSlot;
    }
}

onMounted(() => {
    updateState();
    intervalId = window.setInterval(updateState, 100);
});

onUnmounted(() => {
    if (intervalId) {
        clearInterval(intervalId);
    }
});
</script>

<style scoped>
.hotbar-container {
    position: absolute;
    bottom: 20px;
    left: 50%;
    transform: translateX(-50%);
    z-index: 10;
}

.hotbar {
    display: flex;
    background-color: rgba(0, 0, 0, 0.5);
    padding: 3px;
    border-radius: 4px;
    gap: 2px;
}

.slot {
    width: 40px;
    height: 40px;
    border: 2px solid transparent;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: rgba(100, 100, 100, 0.2);
}

.slot.active {
    border-color: white;
    background-color: rgba(150, 150, 150, 0.4);
}

.block-icon {
    width: 32px;
    height: 32px;
}
</style>
