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
          <IonItem v-if="isGranted">
            <ion-button  @click="() => router.push('/databasenoencryption')">SQLite NoEncryption</ion-button>
          </IonItem>
          <IonItem v-if="isGranted">
            <ion-button @click="() => router.push('/databasetwodbs')">SQLite TwoDbs</ion-button>
          </IonItem>
          <IonItem v-if="isGranted && existingConn.existConn.value">
            <ion-button @click="() => router.push('/databaseexistingconnection')">SQLite Existing Connection</ion-button>
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
  import { usePermissions } from '@/composables/usePermissions'
  /*
      <ion-button v-if="isGranted && existingConn.existConn.value" >SQLite Existing Connection</ion-button>

      <ion-button @click="() => router.push('/databaseexecuteset')">DB ExecuteSet</ion-button>
      <ion-button v-if="native" @click="() => router.push('/databasetoencrypt')">DB ToEncrypt</ion-button>
      <ion-button v-if="native" @click="() => router.push('/databaseencrypted')">DB Encrypted</ion-button>
      <ion-button @click="() => router.push('/databasefromtojson')">DB FromToJson</ion-button>
      <ion-button @click="() => router.push('/databaseupgradeversion')">DB UpgradeVersion</ion-button>
  */
  export default defineComponent({
    name: 'Tab2',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,
                  IonButton, IonList, IonItem },
    setup() {
      const router = useRouter();
      const isGranted = ref(true);
      const app = getCurrentInstance()
      const existingConn = app?.appContext.config.globalProperties.$existingConn;
      console.log(`>>>> existingConn ${existingConn.existConn.value}`)
      onMounted(async () => {
        isGranted.value = await usePermissions();
      });
      return { router, isGranted, existingConn };
    }
  })
</script>