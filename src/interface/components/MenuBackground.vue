<template>
   <div class="menu-background">
       <img src="/main_menu_background.jpg">
   </div> 
</template>

<style scoped>
.menu-background {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    overflow: hidden;
    z-index: -1;
}

.menu-background:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.3);
}

img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    filter: blur(5px);
}
</style>