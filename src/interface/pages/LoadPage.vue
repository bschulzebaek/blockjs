<template>
    <div style="display: flex; flex-direction: column; max-width: 23rem; margin: 0 auto; gap: 1rem;">
        <h1>Load World</h1>
        
        <div v-if="worlds.length === 0">
            <p>No worlds found.</p>
            <router-link :to="{ name: 'main-menu-new' }">Create a new world</router-link>
        </div>
        <div v-for="world in worlds">
            <router-link 
                :to="{ 
                    name: 'session', 
                    params: { 
                        id: world.id, 
                    },
                }"
                style="display: flex; flex-direction: column;"
            >
                <h2>{{ world.name }}</h2>
                <span>Created: {{ toDateStr(world.createdAt) }}</span>
                <span>Last played: {{ toDateStr(world.updatedAt) }}</span>
            </router-link>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue';
import type MetaInformation from '../../framework/storage/MetaInformation.ts';

const worlds: Ref<MetaInformation[]> = ref([]);

onMounted(() => {
    fetchWorlds();
});

async function fetchWorlds() {
    const files = await BlockJS.fs.getAllMetaFiles();

    worlds.value = files.sort((a, b) => {
        return b.updatedAt - a.updatedAt;
    });
}

function toDateStr(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}
</script>