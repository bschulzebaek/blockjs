<template>
    <h1>Settings</h1>
    
    <div style="display: flex; flex-direction: column; gap: 0.5rem; padding: 1rem;">
        <label for="renderDistance">Render Distance</label>
        <input v-model="settings.renderDistance" id="renderDistance" type="number" min="1" max="32" step="1">
        
        <button @click="onSave">Save</button>
    </div>
</template>

<script setup lang="ts">
import ReservedFileNames from '../../framework/storage/reserved-file-names.ts';

const settings = BlockJS.settings;

function onSave() {
    BlockJS.settings = settings;
    BlockJS.fs.writeFile(ReservedFileNames.SETTINGS, JSON.stringify(settings));
}
</script>