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
      <ion-button v-if="isGranted" @click="() => router.push('/databasenoencryption')">DB NoEncryption</ion-button>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
                               IonButton } from '@ionic/vue';
  import { defineComponent, onMounted, ref } from 'vue';
  import { useRouter } from 'vue-router';
  import { usePermissions } from '@/composables/usePermissions'
  /*
      <ion-button @click="() => router.push('/databaseexecuteset')">DB ExecuteSet</ion-button>
      <ion-button v-if="native" @click="() => router.push('/databasetoencrypt')">DB ToEncrypt</ion-button>
      <ion-button v-if="native" @click="() => router.push('/databaseencrypted')">DB Encrypted</ion-button>
      <ion-button @click="() => router.push('/databasefromtojson')">DB FromToJson</ion-button>
      <ion-button @click="() => router.push('/databaseupgradeversion')">DB UpgradeVersion</ion-button>

  */

  export default defineComponent({
    name: 'Tab2',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,
                  IonButton },
    setup() {
      const router = useRouter();
      const isGranted = ref(true);
      onMounted(async () => {
        isGranted.value = await usePermissions();
      });
      return { router, isGranted };
    }
  })
</script>

