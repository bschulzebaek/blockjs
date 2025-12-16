<template>
    <div class="menu">
        <h1>Settings</h1>
        <label for="renderDistance">Render Distance</label>
        <input v-model="settings.renderDistance" id="renderDistance" type="number" min="1" max="32" step="1">
        
        <button @click="onSave">Save</button>
    </div>
</template>

<script setup lang="ts">
import ReservedFileNames from '../../framework/storage/reserved-file-names.ts';
import type Settings from '../../framework/storage/Settings.ts';
import { defaultSettings } from '../../framework/storage/Settings.ts';
import { ref, onMounted } from 'vue';
let settings = ref<Settings>(defaultSettings);

onMounted(async () => {
    settings.value = BlockJS.settings || defaultSettings;
});

function onSave() {
    BlockJS.settings = settings.value as Settings;
    BlockJS.container.FileService.writeFile(ReservedFileNames.SETTINGS, JSON.stringify(settings.value));
}
</script>