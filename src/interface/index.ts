import { createApp } from 'vue';
import App from './App.vue';
import router from './pages/router';

createApp(App)
    .use(router)
    .mount('body');
