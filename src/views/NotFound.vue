<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
            <ion-back-button default-href="/"></ion-back-button>
        </ion-buttons>
        <ion-title>NotFound</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">NotFound</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-card>
        <ion-card-content>
          Oops, it looks like the page you're looking for doesn't exist.
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script>
import { IonPage, IonButtons, IonHeader, IonToolbar, IonBackButton,
        IonTitle, IonContent, IonCard, IonCardContent } from '@ionic/vue';
import { defineComponent } from 'vue';

export default defineComponent({
  name: "NotFound",
  components: { IonPage, IonButtons, IonHeader, IonToolbar, IonBackButton,
        IonTitle, IonContent, IonCard, IonCardContent }
});
</script>
<style>
  ion-card-content {
    font-size: 1.5rem !important;
  }
</style>