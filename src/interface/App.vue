<template> 
    <router-view v-if="appReady" />
    <loading v-else class="center-absolute" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Loading from './components/Loading.vue';
import Lifecycle from '../framework/lifecycle/Lifecycle.ts';

let appReady = ref(false);

onMounted(async () => {
    await Lifecycle.initApp();
    appReady.value = true;
});
</script>