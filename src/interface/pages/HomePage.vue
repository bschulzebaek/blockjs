<template>
    <div class="menu">
        <div class="logo">
            <img class="logo__image" src="/main_menu_logo.png">
            <div class="logo__label">
                Minecraft in JavaScript!
            </div>
        </div>

        <router-link to="/new">
            <button>New Game</button>
        </router-link>
        <router-link to="/load">
            <button>Load Game</button>
        </router-link>
        <router-link to="/settings">
            <button>Options</button>
        </router-link>
        <a href="https://github.com/bschulzebaek/blockjs" target="_blank">
            <button>About</button>
        </a>
    </div>
</template>

<style scoped>
.logo {
    position: relative;
    text-align: center;
    margin-bottom: 4rem;
    width: 100%;
}

.logo__image {
    width: 100%;
    height: auto;
}

.logo__label {
    position: absolute;
    right: 0;
    bottom: 0;
    transform: rotate(-12deg) translate(25%, 0);
    font-size: 16px;
    color: rgb(248, 248, 73);
    text-shadow: 0 0 10px rgb(0 0 0);
    animation: bumpLogo 3s 2s ease-in-out infinite;
}

@keyframes bumpLogo {
    0% {
        font-size: 16px;
    }
    10% {
        font-size: 17px;
    }
    20% {
        font-size: 16px;
    }
    100% {
        font-size: 16px;
    }
}

</style>