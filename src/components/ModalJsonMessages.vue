<template>
  <ion-modal
    :is-open="isOpen"
    show-backdrop="false"
    css-class="my-modal-class"
    @onDidDismiss="handleDidDismmiss(true)"
  >
    <ion-page>
      <ion-header>
        <ion-toolbar>
            <ion-buttons slot="start">
                <ion-button @click="handleDidDismmiss(false)"> Close</ion-button>
            </ion-buttons>
          <ion-title>{{ title }}</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content class="ion-padding">
        {{ message }}
      </ion-content>
    </ion-page>
  </ion-modal>
</template>

<script lang="ts">
import { IonPage, IonContent, IonHeader, IonTitle, IonToolbar, IonButtons,
         IonButton, IonModal } from '@ionic/vue';
import { defineComponent, SetupContext } from 'vue';


export default defineComponent({
  name: 'ModalJsonMessages',
  props: {
    title: { type: String, default: '' },
    message: { type: String, default: '' },
    isOpen: {type: Boolean, default: false, required: true},
  },
  setup (props: any, ctx: SetupContext) {

    const handleDidDismmiss = (isCancelled: boolean) => {
      if(!props.isOpen) {
        // this is to ignore the onDidDismiss
        // if we are closed from a screen click
        return;
      }
      console.log(`in handleDidDismiss isCancelled ${isCancelled}`);
      ctx.emit('modal-closed', {isCancelled});
    }
    return { handleDidDismmiss }
  },
  components: { IonPage,IonContent, IonHeader, IonTitle, IonToolbar,
                IonButtons, IonButton, IonModal }
});
</script>
<style>

.my-modal-class {
  --background: #D3D3D3;
  --border-radius: 25px;
  --border-style: solid;
  --border-width: 3px;
  --border-color: #979797;
  top: 10%;
  left: 2%;
  right: 2%;
  bottom: 10%;
  --width: 100%;
  --height: 100%;
  --white-space: pre-wrap;
  --overflow-wrap: break-word;
  --word-wrap: break-word;
  --hyphens: auto;
}

</style>