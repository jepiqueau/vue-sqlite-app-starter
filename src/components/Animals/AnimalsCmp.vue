<template>
    <div id="animals-container">
        <ion-card>
            <ion-item>
                <ion-label>Size</ion-label>
                <ion-select multiple="false" value="filterSize.value" cancel-text="back" ok-text="ok" v-model="filterSize" @ionChange="onChange($event, filterSize)">
                    <ion-select-option value="00">all</ion-select-option>
                    <ion-select-option value="01">small</ion-select-option>
                    <ion-select-option value="02">medium</ion-select-option>
                    <ion-select-option value="03">large</ion-select-option>
                </ion-select>
            </ion-item>
        </ion-card>
        <ion-list>
         <ion-item :key="animal.id" v-for="animal in animals">
           <ion-label>
                <h2>{{ animal.name_dt }}</h2> 
              </ion-label>
         </ion-item>
        </ion-list>
    </div>
</template>

<script lang="ts">
import { getCurrentInstance } from 'vue';
import { IonCard, IonSelect, IonSelectOption, IonList, IonItem,
           IonLabel } from '@ionic/vue';
import { defineComponent, ref } from 'vue';
import { getAllAnimals } from '@/components/Animals/sqlite-utils/animals';
import { Animal } from '@/components/Animals/model/Animal';

export default defineComponent({
    name: 'AnimalsCmp',
    components: { IonCard, IonSelect, IonSelectOption, IonList, IonItem,
    IonLabel },
    async setup() {
        const app = getCurrentInstance();
        const sqlite = app?.appContext.config.globalProperties.$sqlite;
        const animals= ref<Animal[]>([]);
        console.log("Animals setup");
        animals.value = await getAllAnimals(sqlite);
        const filterSize = ref("00");
        const onChange = async (e: any, filter: any) => {
            filterSize.value = filter;
            animals.value = await getAllAnimals(sqlite, filterSize.value);
        }
        return{ filterSize, onChange, animals };
    },
});
</script>