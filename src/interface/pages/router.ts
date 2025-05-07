import { createWebHistory, createRouter } from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'main-menu',
        component: () => import('./HomePage.vue'),
    },
    {
        path: '/new',
        name: 'main-menu-new',
        component: () => import('./NewPage.vue'),
        meta: {
            title: 'New | BlockJS'  
        },
    },
    {
        path: '/load',
        name: 'main-menu-load',
        component: () => import('./LoadPage.vue'),
        meta: {
            title: 'Load | BlockJS'
        },
    },
    {
        path: '/settings',
        name: 'main-menu-settings',
        component: () => import('./SettingsPage.vue'),
        meta: {
            title: 'Settings | BlockJS'
        },
    },
    {
        path: '/world/:id',
        name: 'session',
        component: () => import('./SessionPage.vue'),
    },
    {
        path: '/:catchAll(.*)/',
        redirect: '/',
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

router.beforeEach((to) => {
    document.title = to.meta?.title as string ?? 'BlockJS'
});

export default router;