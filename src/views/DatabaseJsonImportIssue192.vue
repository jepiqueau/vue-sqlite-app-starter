<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-back-button default-href="/tabs/tab2"></ion-back-button>
        </ion-buttons>
        <ion-title>SQLite JsonImportIssue192</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">SQLite JsonImportIssue192</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-card>
        <ion-card-content>
          <JsonImportIssue192 />
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script lang="ts">
import { IonPage, IonButtons, IonHeader, IonToolbar, IonBackButton,
        IonTitle, IonContent, IonCard,
        IonCardContent } from '@ionic/vue';
import { defineComponent } from 'vue';
import JsonImportIssue192 from '@/components/JsonImportIssue192.vue';
export default defineComponent({
  name: 'DatabaseJsonImportIssue192',
  components: { IonPage, IonButtons, IonHeader, IonToolbar,
                IonBackButton, IonTitle, IonContent, IonCard,
                IonCardContent, JsonImportIssue192 }
});
</script>
<style>
h1 {
    text-align: center;
}
</style>