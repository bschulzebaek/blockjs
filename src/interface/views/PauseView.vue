
<template>
    <div class="pause-view">
        <div class="menu">
            <h1>Pause</h1>

            <div v-if="resuming">
                <p>Resuming...</p>
            </div>
            <template v-else>
                <button @click="onResume">Resume</button>
                
                <button @click="onFullscreen">Fullscreen</button>

                <button @click="onExit">Exit</button>
            </template>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';

import { STATES } from '@/framework/state-machine/states.ts';

const router = useRouter();

const resuming = ref(false);

const onResume = async () => {
    resuming.value = true;
    await StateMachine.transition(STATES.SCENE_ACTIVE);
    resuming.value = false;
}

const onExit = async () => {
    router.push('/');
}

const onFullscreen = async () => {
    if (!document.fullscreenElement) {
        await BlockJS.canvas?.parentElement?.requestFullscreen();
    } else {
        await document.exitFullscreen();
    }
}
</script>

<style scoped>
.pause-view:before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: -1;
}
</style>