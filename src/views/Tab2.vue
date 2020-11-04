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
      <ion-button @click="() => router.push('/databasenoencryption')">DB NoEncryption</ion-button>
      <ion-button @click="() => router.push('/databaseexecuteset')">DB ExecuteSet</ion-button>
      <ion-button v-if="native" @click="() => router.push('/databasetoencrypt')">DB ToEncrypt</ion-button>
      <ion-button v-if="native" @click="() => router.push('/databaseencrypted')">DB Encrypted</ion-button>
      <ion-button @click="() => router.push('/databasefromtojson')">DB FromToJson</ion-button>
      <ion-button @click="() => router.push('/databaseupgradeversion')">DB UpgradeVersion</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
                                          IonButton } from '@ionic/vue';
  import { defineComponent } from 'vue';
  import { useRouter } from 'vue-router';
  import { Capacitor } from '@capacitor/core';

  export default defineComponent({
    name: 'Tab2',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,
                  IonButton },
    setup() {
      const router = useRouter();
      const platform = Capacitor.getPlatform();
      const native: boolean = platform === "ios" 
                            || platform === "android" ? true : false;

      return { router, native };
    }
  })
</script>