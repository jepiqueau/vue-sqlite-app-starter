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

/* SQLite imports */
import { useSQLite } from 'vue-sqlite-hook/dist';
import { useState } from '@/composables/state';

const app = createApp(App)
  .use(IonicVue)
  .use(router);

/* SQLite Global Variables and Hook */
const [jsonListeners, setJsonListeners] = useState(false);
const [isModal, setIsModal] = useState(false);
const [message, setMessage] = useState("");
app.config.globalProperties.$isModalOpen = {isModal: isModal, setIsModal: setIsModal};
app.config.globalProperties.$isJsonListeners = {jsonListeners: jsonListeners, setJsonListeners: setJsonListeners};
app.config.globalProperties.$messageContent = {message: message, setMessage: setMessage};
  
const onProgressImport = async (progress: string) => {
  if(app.config.globalProperties.$isJsonListeners.jsonListeners.value) {
    if(!app.config.globalProperties.$isModalOpen.isModal.value) app.config.globalProperties.$isModalOpen.setIsModal(true);
    app.config.globalProperties.$messageContent.setMessage(
        app.config.globalProperties.$messageContent.message.value.concat(`${progress}\n`));
  }
}
const onProgressExport = async (progress: string) => {
  if(app.config.globalProperties.$isJsonListeners.jsonListeners.value) {
    if(!app.config.globalProperties.$isModalOpen.isModal.value) app.config.globalProperties.$isModalOpen.setIsModal(true);
    app.config.globalProperties.$messageContent.setMessage(
      app.config.globalProperties.$messageContent.message.value.concat(`${progress}\n`));
  }
}
  
// SQLite Hook  
const {echo, getPlatform, createConnection, closeConnection,
  retrieveConnection, retrieveAllConnections, closeAllConnections,
  isConnection, addUpgradeStatement, importFromJson, isJsonValid,
  isDatabase, getDatabaseList, addSQLiteSuffix, deleteOldDatabases,
  copyFromAssets, checkConnectionsConsistency, removeListeners,
  isSecretStored, setEncryptionSecret, changeEncryptionSecret,isAvailable} = useSQLite({
    onProgressImport,
    onProgressExport
  });
  
  // Singleton SQLite Hook  
  app.config.globalProperties.$sqlite = {echo: echo, getPlatform: getPlatform,
    createConnection: createConnection,
    closeConnection: closeConnection,
    retrieveConnection: retrieveConnection,
    retrieveAllConnections: retrieveAllConnections,
    closeAllConnections: closeAllConnections,
    isConnection: isConnection,
    isDatabase: isDatabase,
    getDatabaseList: getDatabaseList,
    addSQLiteSuffix: addSQLiteSuffix,
    deleteOldDatabases: deleteOldDatabases,
    addUpgradeStatement: addUpgradeStatement,
    importFromJson: importFromJson,
    isJsonValid: isJsonValid,
    copyFromAssets: copyFromAssets,
    checkConnectionsConsistency: checkConnectionsConsistency,
    removeListeners: removeListeners,
    isSecretStored: isSecretStored,
    setEncryptionSecret: setEncryptionSecret,
    changeEncryptionSecret: changeEncryptionSecret,
    isAvailable:isAvailable
  };
  
  //  Existing Connections Store
  const [existConn, setExistConn] = useState(false);
  app.config.globalProperties.$existingConn = {existConn: existConn, setExistConn: setExistConn};
    
router.isReady().then(() => {
  app.mount('#app');
});
