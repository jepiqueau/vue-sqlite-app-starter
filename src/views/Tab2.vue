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
          <ion-button @click="() => router.push('/databasejsonlisteners')">SQLite Json Listeners</ion-button>
        </IonItem> 
        <IonItem>
          <ion-button @click="() => router.push('/databasetoencrypt')">SQLite Encryption</ion-button>
        </IonItem> 
      </IonList>
      <ModalJsonMessages :is-open="isModalOpen.isModal.value"
                         :message="contentMessage.message.value" 
                         @modal-closed="handleModalClosed">
      </ModalJsonMessages>

    </ion-content>
  </ion-page>
</template>

<script lang="ts">
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,
           IonButton, IonList, IonItem } from '@ionic/vue';
  import { defineComponent, getCurrentInstance, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import ModalJsonMessages from '@/components/ModalJsonMessages.vue';

  export default defineComponent({
    name: 'Tab2',
    components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage,
                  IonButton, IonList, IonItem, ModalJsonMessages },
    setup() {
      const router = useRouter();
      const app = getCurrentInstance();
      const existingConn = app?.appContext.config.globalProperties.$existingConn;
      const isModalOpen = app?.appContext.config.globalProperties.$isModalOpen;
      const contentMessage = app?.appContext.config.globalProperties.$messageContent;
      const sqlite = app?.appContext.config.globalProperties.$sqlite;

      const handleModalClosed = () => {
        isModalOpen.setIsModal(false);
        contentMessage.setMessage("");
      }
      onMounted(async () => {
        // Deal with the secure secret if you need it
        // by using an input form
        // here i used a constant
        const secretPhrase = 'abbey clammy gird night test';
        const isSet = await sqlite.isSecretStored()
        if(!isSet.result) {
          await sqlite.setEncryptionSecret(secretPhrase);
        }

      });

      return { router, existingConn, handleModalClosed, isModalOpen, contentMessage};
    }
  })
</script>
