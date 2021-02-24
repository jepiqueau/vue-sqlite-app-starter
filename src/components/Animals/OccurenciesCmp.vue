<template>
    <div id="occurencies-container">
        <ion-list>
         <ion-item :key="occurence.id" v-for="occurence in occurencies">
           <ion-label>
                <h2>{{ occurence.sample_nr }} {{ occurence.animal_nr }} {{ occurence.datetime }}</h2> 
              </ion-label>
         </ion-item>
        </ion-list>
    </div>
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import { IonList, IonItem, IonLabel } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { getAllOccurencies } from '@/components/Animals/sqlite-utils/occurencies';
import { Occurence } from '@/components/Animals/model/Occurence';

export default defineComponent({
    name: 'OccurenciesCmp',
    components: { IonList, IonItem, IonLabel },
    async setup() {
        const app = getCurrentInstance();
        const sqlite = app?.appContext.config.globalProperties.$sqlite;
        const occurencies= ref<Occurence[]>([]);
        console.log("Occurencies setup");
        occurencies.value = await getAllOccurencies(sqlite);
        return{ occurencies };
    },
});
</script>