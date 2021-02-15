<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 2</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 2</ion-title>
        </ion-toolbar>
      </ion-header>
        <IonList>
          <IonItem>
            <ion-button  @click="() => router.push('/databasenoencryption')">SQLite NoEncryption</ion-button>
          </IonItem>
          <IonItem>
            <ion-button @click="() => router.push('/databasetwodbs')">SQLite TwoDbs</ion-button>
          </IonItem>
          <IonItem v-if="existingConn.existConn.value">
            <ion-button @click="() => router.push('/databaseexistingconnection')">SQLite Existing Connection</ion-button>
          </IonItem>
          <IonItem>
            <ion-button @click="() => router.push('/databasecopyfromassets')">SQLite CopyFromAssets</ion-button>
          </IonItem> 
          <IonItem>
            <ion-button @click="() => router.push('/databasejsonimportexport')">SQLite JsonImportExport</ion-button>
          </IonItem> 
          <IonItem>
            <ion-button @click="() => router.push('/databaseanimals')">SQLite Animals</ion-button>
          </IonItem> 
        </IonList>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
           IonButton, IonList, IonItem } from '@ionic/vue';
  import { defineComponent, onMounted, ref, getCurrentInstance } from 'vue';
  import { useRouter } from 'vue-router';
  export default defineComponent({
    name: 'Tab2',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,
                  IonButton, IonList, IonItem },
    setup() {
      const router = useRouter();
      const app = getCurrentInstance()
      const existingConn = app?.appContext.config.globalProperties.$existingConn;
      console.log(`>>>> existingConn ${existingConn.existConn.value}`)
      return { router, existingConn };
    }
  })
</script>