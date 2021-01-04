import { createApp } from 'vue'
import App from './App.vue'
import router from './router';

import { IonicVue } from '@ionic/vue';

/* Core CSS required for Ionic components to work properly */
import '@ionic/vue/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/vue/css/normalize.css';
import '@ionic/vue/css/structure.css';
import '@ionic/vue/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/vue/css/padding.css';
import '@ionic/vue/css/float-elements.css';
import '@ionic/vue/css/text-alignment.css';
import '@ionic/vue/css/text-transformation.css';
import '@ionic/vue/css/flex-utils.css';
import '@ionic/vue/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { useSQLite } from 'vue-sqlite-hook/dist';
import { useState } from '@/composables/state';

// SQLite Hook  
const {echo, getPlatform, createConnection, closeConnection,
  retrieveConnection, retrieveAllConnections, closeAllConnections,
  addUpgradeStatement, importFromJson, isJsonValid, requestPermissions, 
  copyFromAssets, isAvailable} = useSQLite();
//Existing Connections
const [existConn, setExistConn] = useState(false);

const app = createApp(App)
  .use(IonicVue)
  .use(router);

// Singleton SQLite Hook  
app.config.globalProperties.$sqlite = {echo: echo, getPlatform: getPlatform,
  createConnection: createConnection,
  closeConnection: closeConnection,
  retrieveConnection: retrieveConnection,
  retrieveAllConnections: retrieveAllConnections,
  closeAllConnections: closeAllConnections,
  addUpgradeStatement: addUpgradeStatement,
  importFromJson: importFromJson,
  isJsonValid: isJsonValid,
  requestPermissions: requestPermissions,
  copyFromAssets: copyFromAssets,
  isAvailable:isAvailable};

//  Existing Connections Store
app.config.globalProperties.$existingConn = {existConn: existConn, setExistConn: setExistConn};
  
router.isReady().then(() => {
  app.mount('#app');
});
