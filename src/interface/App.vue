<template> 
    <router-view v-if="appReady" />
    <loading v-else class="center-absolute" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Loading from './components/Loading.vue';

let appReady = ref(false);

onMounted(async () => {
    await StateMachine.waitForTransition();

    await StateMachine.transition('APP_READY');
    appReady.value = true;
});
</script>