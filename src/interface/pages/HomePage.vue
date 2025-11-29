<template>
    
    <div style="display: flex; flex-direction: column; gap 2rem; justify-content: center; align-items: center; height: 80%;">
        <h2>Main Menu</h2>

        <router-link to="/new">
            <button>New World</button>
        </router-link>
        <router-link to="/load">
            <button>Load World</button>
        </router-link>
        <router-link to="/settings">
            <button>Settings</button>
        </router-link>
    </div>
</template>

<style>

</style>
<script setup lang="ts">
</script>