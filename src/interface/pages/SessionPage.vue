<template>
    <canvas ref="canvas"/>
    <loading-view v-if="state === STATES.SCENE_LOADING"/>
    <default-view v-else-if="state === STATES.SCENE_ACTIVE"/>
    <pause-view v-else-if="state === STATES.SCENE_PAUSED"/>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import LoadingView from '../views/LoadingView.vue';
import DefaultView from '../views/DefaultView.vue';
import PauseView from '../views/PauseView.vue';
import { useSessionState } from '../composables/useSessionState';
import { STATES } from '../../framework/state-machine';

const canvas = useTemplateRef('canvas');
const route = useRoute();
const { state } = useSessionState();

function handlePointerLockChange() {
    if (document.pointerLockElement === null && state.value === STATES.SCENE_ACTIVE) {
        StateMachine.transition(STATES.SCENE_PAUSED);
    } 
}

// Block Tab forces pointer lock off
addEventListener('keydown', (event: KeyboardEvent) => {
    if (event.code === 'Tab') {
        event.preventDefault();
    }
})

onMounted(async () => {
    BlockJS.id = route.params.id as string;
    BlockJS.canvas = canvas.value as HTMLCanvasElement;
    await StateMachine.transition(STATES.SCENE_INIT);
    await StateMachine.transition(STATES.SCENE_PAUSED);

    document.addEventListener('pointerlockchange', handlePointerLockChange);
});

onUnmounted(async () => {
    document.removeEventListener('pointerlockchange', handlePointerLockChange);
    await StateMachine.transition(STATES.SCENE_DESTROY);
    await StateMachine.transition(STATES.APP_READY);
});
</script>

<style scoped>
canvas {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    width: 100vw;
    height: 100vh;
    pointer-events: none;
    z-index: -1;
}
</style>