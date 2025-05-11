<template>
    <canvas ref="canvas"/>
    <loading-view v-if="state === SceneStates.LOADING"/>
    <default-view v-else-if="state === SceneStates.DEFAULT"/>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import LoadingView from '../views/LoadingView.vue';
import DefaultView from '../views/DefaultView.vue';

const SceneStates = {
    LOADING: 'loading',
    DEFAULT: 'default'
} as const;

const router = useRouter();
const canvas = useTemplateRef('canvas');
const route = useRoute();
const state = ref(SceneStates.LOADING);

onMounted(async () => {
    BlockJS.id = route.params.id as string;
    BlockJS.canvas = canvas.value as HTMLCanvasElement;

    await StateMachine.transition('SCENE_INIT');
    await StateMachine.transition('SCENE_ACTIVE');
    state.value = SceneStates.DEFAULT;
});

onUnmounted(async () => {
    BlockJS.id = null;

    await StateMachine.transition('SCENE_DESTROY');
    await StateMachine.transition('APP_READY');

    router.push('/');
});
</script>

<style scoped>
canvas,
.ui-container {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
}

canvas {
    z-index: 0;
    width: 100vw;
    height: 100vh;
}

.ui-container {
    z-index: 1;
}
</style>