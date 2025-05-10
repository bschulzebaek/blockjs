<template>
    <div style="display: flex; flex-direction: column; max-width: 23rem; margin: 0 auto; gap: 0.5rem;">
        <h1 style="text-align: center;">Create new World</h1>
        <input v-model="name" type="text" placeholder="Name">
        <input v-model="seed" type="text" placeholder="Seed">

        <button @click="onSubmit">Create</button>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import type MetaInformation from '../../framework/storage/MetaInformation.ts';
import ReservedFileNames from '../../framework/storage/reserved-file-names.ts';

const router = useRouter();
const name = ref('New World');
const seed = ref('');

const CHARACTERS = 'abcdef01234567890123456789';
const SEED_LENGTH = 16;

function generateSeed(): string {
    let seed = '';

    for (let i = 0; i < SEED_LENGTH; i++) {
        seed += CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length));
    }

    return seed;
}

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
