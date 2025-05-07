<template>
    <div style="display: flex; flex-direction: column; max-width: 23rem; margin: 0 auto; gap: 0.5rem;">
        <h1 style="text-align: center;">Create new World</h1>
        <input v-model="name" type="text" placeholder="Name">
        <input v-model="seed" type="text" placeholder="Seed">

        <button @click="onSubmit">Create</button>
    </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { ref } from 'vue';
import type MetaInformation from '../../framework/storage/MetaInformation.ts';
import generateSeed from '../../lib/generate-seed.ts';
import ReservedFileNames from '../../framework/storage/reserved-file-names.ts';

const router = useRouter();
const name = ref('New World');
const seed = ref('');

async function onSubmit() {
    if (!name.value) {
        return;
    }
    
    const createdAt = Date.now(); 
    const meta: MetaInformation = {
        name: name.value,
        seed: seed.value || generateSeed(),
        id: crypto.randomUUID(),
        createdAt,
        updatedAt: createdAt,
    };
    
    await BlockJS.fs.writeFile(ReservedFileNames.META, JSON.stringify(meta), meta.id);
    
    router.push({
        name: 'session',
        params: {
            id: meta.id,
        },
    });
}
</script>
