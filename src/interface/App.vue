<template> 
    <router-view v-if="appReady" />
    <loading v-else class="center-absolute" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import Loading from './components/Loading.vue';
import EventHelper from '../events/EventHelper.ts';
import AppInitEvent from '../events/app/AppInitEvent.ts';

let appReady = ref(false);

onMounted(async () => {
    await EventHelper.publish(AppInitEvent);
    appReady.value = true;
});
</script>