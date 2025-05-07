<template>
    <canvas ref="canvas"/>
    <loading-view v-if="state === SessionStates.LOADING"/>
    <default-view v-else-if="state === SessionStates.DEFAULT"/>
</template>

<script setup lang="ts">
import { onMounted, onUnmounted, useTemplateRef } from 'vue';
import { useRoute } from 'vue-router';
import LoadingView from '../views/LoadingView.vue';
import DefaultView from '../views/DefaultView.vue';
import { useSessionState, SessionStates } from '../composables/session-state.ts';
import Lifecycle from '../../framework/lifecycle/Lifecycle.ts';

const canvas = useTemplateRef('canvas')
const route = useRoute();
const { state } = useSessionState();

onUnmounted(() => {
    Lifecycle.destroySession();
});

onMounted(() => {
    Lifecycle.initSession(route.params.id, canvas.value);
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