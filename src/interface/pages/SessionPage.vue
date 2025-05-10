<template>
    <canvas ref="canvas"/>
    <loading-view v-if="state === SceneStates.LOADING"/>
    <default-view v-else-if="state === SceneStates.DEFAULT"/>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import LoadingView from '../views/LoadingView.vue';
import DefaultView from '../views/DefaultView.vue';
import { useSceneState, SceneStates } from '../composables/scene-state.ts';
import EventHelper from '../../events/EventHelper.ts';
import SceneLoadEvent from '../../events/scene/SceneLoadEvent.ts';
import SceneStartEvent from '../../events/scene/SceneStartEvent.ts';
import SceneDestroyEvent from '../../events/scene/SceneDestroyEvent.ts';
import SceneCollectEvent from '../../events/scene/SceneCollectEvent.ts';

const canvas = useTemplateRef('canvas')
const route = useRoute();
const { state } = useSceneState();

onMounted(async () => {
    BlockJS.id = route.params.id as string;
    BlockJS.canvas = canvas.value as HTMLCanvasElement;

    await EventHelper.publish(SceneLoadEvent);
    await EventHelper.publish(SceneCollectEvent);
    await EventHelper.publish(SceneStartEvent);
});

onUnmounted(async () => {
    await EventHelper.publish(SceneDestroyEvent);

    BlockJS.canvas = null;
    BlockJS.id = null;
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