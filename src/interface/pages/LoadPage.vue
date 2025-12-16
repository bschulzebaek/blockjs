<template>
    <MenuBackground />

    <div class="menu">
        <h1>Load World</h1>

        <div v-if="worlds.length === 0">
            <p>No worlds found.</p>
            <router-link :to="{ name: 'main-menu-new' }">Create a new world</router-link>
        </div>

        <div
            v-for="world in worlds"
            class="world-entry"
        >
            <router-link
                :to="{ 
                    name: 'session', 
                    params: { 
                        id: world.id, 
                    },
                }"
            >
                <div>
                    <div>{{ world.name }}</div>
                    <br>
                    <div>Created: {{ toDateStr(world.createdAt) }}</div>
                    <div>Last played: {{ toDateStr(world.updatedAt) }}</div>
                </div>
            </router-link>

            <div 
                class="world-entry__delete"
                @click="onClickDelete(world)"
            >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                    <path d="M5.5 5.5A.5.5 0 0 1 6 6v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m2.5 0a.5.5 0 0 1 .5.5v6a.5.5 0 0 1-1 0V6a.5.5 0 0 1 .5-.5m3 .5a.5.5 0 0 0-1 0v6a.5.5 0 0 0 1 0z"/>
                    <path d="M14.5 3a1 1 0 0 1-1 1H13v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V4h-.5a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1H6a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1h3.5a1 1 0 0 1 1 1zM4.118 4 4 4.059V13a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V4.059L11.882 4zM2.5 3h11V2h-11z"/>
                </svg>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, type Ref, onMounted } from 'vue';
import type MetaInformation from '../../framework/storage/MetaInformation.ts';
import MenuBackground from '@/interface/components/MenuBackground.vue';

const worlds: Ref<MetaInformation[]> = ref([]);

onMounted(() => {
    fetchWorlds();
});

async function fetchWorlds() {
    const files = await BlockJS.container.FileService.getAllMetaFiles();

    worlds.value = files.sort((a: MetaInformation, b: MetaInformation) => {
        return b.updatedAt - a.updatedAt;
    });
}

function toDateStr(timestamp: number): string {
    const date = new Date(timestamp);
    return date.toLocaleDateString() + ' ' + date.toLocaleTimeString();
}

function onClickDelete(world: MetaInformation) {
    const confirmed = confirm(`Are you sure you want to delete the world "${world.name}"? This action cannot be undone.`);
    
    if (!confirmed) {
        return;
    }

    BlockJS.container.FileService.deleteWorldFiles(world.id).then(() => {
        fetchWorlds();
    });
}
</script>

<style scoped>
.world-entry {
    text-align: left;

    position: relative;

    display: flex;
    flex-direction: row;
    gap: 1rem;
    justify-content: space-between;
    align-items: center;
}

.world-entry > a {
    border-color: #AAA #565656 #565656 #AAA;
    border: 1px solid;
    padding: 0.5rem;
    color: #fff;
    transition: all 0.1s ease;
    flex-grow: 1;
}

.world-entry > a:hover {
    border-color: #BDC6FF #59639A #59639A #BDC6FF;
}
</style>