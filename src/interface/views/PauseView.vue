
<template>
  <div class="pause-view">
    <div class="center-absolute" style="display: flex; flex-direction: column; align-items: center;">
      <h1 style="text-align: center;">Pause</h1>

      <div v-if="resuming">
        <p>Resuming...</p>
      </div>
      <template v-else>
        <button @click="onResume">Resume</button>

        <button @click="onExit">Exit</button>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useSessionState } from '../composables/useSessionState';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const resuming = ref(false);

const onResume = async () => {
  resuming.value = true;
  await StateMachine.transition('SCENE_ACTIVE');
  resuming.value = false;
}

const onExit = async () => {
  router.push('/');
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
}
</style>