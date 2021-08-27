<template>
  <ion-app>
    <template v-if="platform === 'web'">
      <jeep-sqlite />
    </template>
    <ion-router-outlet />
  </ion-app>
</template>

<script lang="ts">
import { IonApp, IonRouterOutlet } from '@ionic/vue';
import { defineComponent, getCurrentInstance, onMounted} from 'vue';
import { useSQLite} from 'vue-sqlite-hook/dist';
import { Capacitor } from '@capacitor/core';

export default defineComponent({
  name: 'App',
  components: {
    IonApp,
    IonRouterOutlet,
  },
  setup() {
    const platform = Capacitor.getPlatform();
    const app = getCurrentInstance();
    const isModalOpen = app?.appContext.config.globalProperties.$isModalOpen;
    const contentMessage = app?.appContext.config.globalProperties.$messageContent;
    const jsonListeners = app?.appContext.config.globalProperties.$isJsonListeners;

    onMounted(async () => {
      console.log(' in App on Mounted')

      const ionAppEl = document.querySelector('ion-app');
      if(ionAppEl != null) {
        console.log(`ionAppEl ${JSON.stringify(ionAppEl)}`);
      } else {
        console.log(' ionAppEl is null');
      }
      const onProgressImport = async (progress: string) => {
        if(jsonListeners.jsonListeners.value) {
          if(!isModalOpen.isModal.value) isModalOpen.setIsModal(true);
          contentMessage.setMessage(
              contentMessage.message.value.concat(`${progress}\n`));
        }
      }
      const onProgressExport = async (progress: string) => {
        if(jsonListeners.jsonListeners.value) {
          if(!isModalOpen.isModal.value) isModalOpen.setIsModal(true);
          contentMessage.setMessage(
            contentMessage.message.value.concat(`${progress}\n`));
        }
      }
      if( app != null) {  
        app.appContext.config.globalProperties.$sqlite = useSQLite({
          onProgressImport,
          onProgressExport
        });
        if(platform === "web") {
          await customElements.whenDefined('jeep-sqlite');
          const jeepSqliteEl = document.querySelector('jeep-sqlite');
          if(jeepSqliteEl != null) {
            console.log(`$$ jeepSqliteEl ${JSON.stringify(jeepSqliteEl)}`);
          } else {
            console.log('$$ jeepSqliteEl is null');
          }
        }
          console.log('after useSQLite')
      }
    });
    return {platform}
  }
});
</script>
