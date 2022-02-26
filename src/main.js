import { createApp } from 'vue';
import VueAuth0Plugin from 'vue-auth0-plugin';
import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';
import './reset.css';
import '@vueform/multiselect/themes/default.css';

import redirectUrl from './api/redirectUrl';

createApp(App)
   .use(VueAuth0Plugin, {
      domain: process.env.VUE_APP_AUTH0_DOMAIN,
      client_id: process.env.VUE_APP_AUTH0_CLIENT_ID,
      redirect_uri: redirectUrl,
   })
   .use(store)
   .use(router)
   .mount('#app');
