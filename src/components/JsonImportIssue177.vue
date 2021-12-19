<template>
    <div id="json-importexport-container">
        <div v-if="showSpinner">
            <br>
            <LoadingSpinner />
            <div>
                <span class="spinner">Running tests ...</span>
            </div>
        </div>
        <div v-else id="log">
            <pre>
                <p>{{log}}</p>
            </pre>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, getCurrentInstance } from 'vue';
import { fullImport177 } from '@/utils/utils-import-from-json';
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { Dialog } from '@capacitor/dialog';

export default defineComponent({
    name: 'JsonImportIssue177',
    components: {
        LoadingSpinner
    },
    setup() {
        const [showSpinner, setShowSpinner] = useState(true);
        const [log, setLog] = useState("");
        const app = getCurrentInstance()
        const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;
        const showAlert = async (message: string) => {
            await Dialog.alert({
            title: 'Error Dialog',
            message: message,
            });
        };
        const jsonImportIssue177 = async (): Promise<void>  => {
            /**
             * testJsonImportIssue177
             */
            try {
                // test the plugin with echo
                let res: any = await sqlite.echo("Hello from echo");
                if(res.value !== "Hello from echo") return Promise.reject("failed in echo");
                setLog(log.value.concat("> Echo successful\n"));
                setLog(log.value.concat("* Starting testJsonImportIssue177 *\n"));
                // test Json object validity
                res = await sqlite.isJsonValid(JSON.stringify(fullImport177));
                if(!res.result) return Promise.reject("isJsonValid is returning false");
                setLog(log.value.concat("> isJsonValid successful\n"));
                // test import from Json Object
                res = await sqlite.importFromJson(JSON.stringify(fullImport177)); 
                if(res.changes.changes === -1 ) return Promise.reject("importFromJson changes < 0");
                setLog(log.value.concat("> importFromJson successful\n"));
                // create a connection for "db-from-json"
                const db: SQLiteDBConnection = await sqlite.createConnection("consumer_plangei_", false, "no-encryption", 1);
                setLog(log.value.concat("> createConnection " +
                                            " 'consumer_plangei_' successful\n"));
                // open db "db-from-json"
                await db.open();
                setLog(log.value.concat("> open " +
                                            " 'consumer_plangei_' successful\n"));
                // create synchronization table 
                res = await db.createSyncTable();
                if (res.changes.changes < 0) return Promise.reject("createSyncTable changes < 0 ");
                setLog(log.value.concat("> createSyncTable " +
                                            " 'consumer_plangei_' successful\n"));
                // get the synchronization date
                res = await db.getSyncDate();
                if(res.syncDate === 0) return Promise.reject("getSyncDate return 0 ");
                setLog(log.value.concat("> getSyncDate " +
                                            " 'consumer_plangei_' successful\n"));
                // close the connection
                await sqlite.closeConnection("consumer_plangei_"); 
                setLog(log.value.concat("> closeConnection successful\n"));
                setLog(log.value.concat("* Ending testJsonImportIssue177 *\n"));
                return Promise.resolve();
            } catch (err: any) {
                console.log(`&&&& Erreur: ${JSON.stringify(err)}`)
                return Promise.reject(err.message);
            }
        }
        onMounted(async () => {
            // Running the test
            setLog(log.value
                .concat("* Starting testJsonImportIssue177 *\n"));
            try {
                await jsonImportIssue177();
                setShowSpinner(false);
                setLog(log.value
                    .concat("\n* The set of tests was successful *\n"));
            }
            catch (err: any) {
                setShowSpinner(false);
                setLog(log.value
                    .concat(`> Error: ${err} \n`));
                setLog(log.value
                    .concat("* testJsonImportIssue177 failed *\n"));
                setLog(log.value
                        .concat("\n* The set of tests failed *\n"));
                console.log(`&&&& Erreur before Alert: ${err}`)
                await showAlert(err);
            }
        });
        return { log, showSpinner };
    },
});
</script>