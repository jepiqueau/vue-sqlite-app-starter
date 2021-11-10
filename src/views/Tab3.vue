<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Tab 3</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tab 3</ion-title>
        </ion-toolbar>
      </ion-header>
      <div id="container">
        <div id="tests">
          <ul id="test-with-index">
            <li v-for="(test, index) in tests" :key="test.id">
              {{ index }} - {{ test.name }}
            </li>
          </ul>
        </div>
      </div>
    </ion-content>
  </ion-page>
</template>

<script lang="ts">
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import { defineComponent, onMounted, getCurrentInstance, ref } from 'vue';
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook';

export default defineComponent({ 
  name: 'Tab3',
  components: { IonHeader, IonToolbar, IonTitle, IonContent, IonPage },
  setup() {
    const initTests: any[] = [];
    const tests = ref(initTests);
    const errMess = ref("");
    const app = getCurrentInstance()
    const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;
    const tab3Test = async (): Promise<boolean>  => {
      try {
        let db: SQLiteDBConnection = await sqlite.createConnection("db_tab3");
        await db.open();
        let randomText = (Math.random() + 1).toString(36).substring(7);
        await db.run("INSERT INTO test (name) VALUES (?)", [randomText]);
        let res: any = await db.query("SELECT * FROM test");
        console.log(`query ${JSON.stringify(res)}`);
        tests.value = res.values;
        console.log(`tests ${JSON.stringify(tests.value)}`);

        let isTable = await db.isTable("test");
        console.log(`isTable test: ${JSON.stringify(isTable)}`)
        await db.close();
        await sqlite.closeConnection("db_tab3");
        return true;
      } catch(err: any) {
        console.log(`Error: ${err}`)
        errMess.value = err;
        return false;
      }
    }

    onMounted(async () => {
        // Running the test
        console.log('$$$ Start Tab3Test on Mounted $$$')
        const retTab3: boolean = await tab3Test();
        console.log(`retTab3: ${retTab3}`)
        if(retTab3) {
          console.log('$$$ Tab3Test successful $$$')
        } else {
          console.log(`Tab3Test failed: ${errMess.value}`)
        }
    });

    return {tests, errMess};
  },
});
</script>
<style scoped>
#container {
  position: absolute;
  left: 0;
  right: 0;
  top: 0;
  bottom: 0;
}
#tests {
  position: relative;
  left: 5%;
  top: 150px;
}
#test-with-index {
  font-size: 16px;
  line-height: 22px;
}
</style>