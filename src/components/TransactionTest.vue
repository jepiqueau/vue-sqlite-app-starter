<template>
    <div id="transaction-container">
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
            <div v-if="errMess.length > 0">
                <p>{{errMess}}</p>}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, getCurrentInstance } from 'vue';
import { createSchemaIssue230 } from '@/utils/utils-db-no-encryption';
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { deleteDatabase } from '@/utils/utils-delete-db';
import { Dialog } from '@capacitor/dialog';

export default defineComponent({
    name: 'TransactionTest',
    components: {
        LoadingSpinner
    },

    setup() {
        console.log('$$$ Start TransactionTest setup $$$')
        const [showSpinner, setShowSpinner] = useState(true);
        const [log, setLog] = useState("");
        const app = getCurrentInstance()
        const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;
        let errMess = "";
        const showAlert = async (message: string) => {
            await Dialog.alert({
            title: 'Error Dialog',
            message: message,
            });
        };
        const Issue230Test = async (): Promise<boolean>  => {
            try {
                console.log(' Starting testTransaction')
                setLog(log.value
                    .concat("* Starting testTransaction *\n"));
                // test the plugin with echo
                let res: any = await sqlite.echo("Hello from echo");
                if(res.value !== "Hello from echo"){
                    errMess = `Echo not returning "Hello from echo"`;
                    return false;
                }
                console.log(`after echo ${JSON.stringify(res)}`);
                setLog(log.value.concat("> Echo successful\n"));
                // create a connection for NoEncryption
                const db: SQLiteDBConnection = await sqlite.createConnection("testIssue230");
                setLog(log.value.concat("> createConnection " +
                                            " 'testIssue230' successful\n"));
                console.log("after createConnection")
                // check if the databases exist 
                // and delete it for multiple successive tests
                await deleteDatabase(db);         
                // open testIssue230 database
                await db.open();
                setLog(log.value.concat("> open 'testIssue230' successful\n"));

                const transaction: any = [
                    {statement : createSchemaIssue230},
                    {statement: "INSERT INTO DemoTable VALUES (?,?)",
                        values: ["Alice",101]},
                    {statement: "INSERT INTO DemoTable VALUES (?,?)",
                        values: ["Betty",202]}
                ]
                setLog(log.value.concat(`>>>>>> transaction: ${JSON.stringify(transaction)}`));
                await db.executeTransaction(transaction);
                setLog(log.value.concat("> executeTransaction " +
                                            " 'testIssue230' successful\n"));
                // Close Connection testIssue230        
                await sqlite.closeConnection("testIssue230"); 
                        
                setLog(log.value
                    .concat("* Ending testDatabaseTransaction *\n"));
                return true;
            } catch (err: any) {
                errMess = err.message ? `${err.message}` : err;
                return false;
            }
        };
        
        onMounted(async () => {
            // Running the test
            console.log('$$$ Start TransactionTest on Mounted $$$')
            const retIssue230: boolean = await Issue230Test();
            console.log(`retIssue230 ${retIssue230}`);
            setShowSpinner(false);
            if(!retIssue230) {
                setLog(log.value
                    .concat("* testDatabaseTransaction failed *\n"));
                setLog(log.value
                        .concat("\n* The set of tests failed *\n"));
                await showAlert(errMess);
            } else {
                setLog(log.value
                    .concat("\n* The set of tests was successful *\n"));
            }
            console.log('$$$ End TransactionTest on Mounted $$$')

        });
        console.log('$$$ End TransactionTest setup $$$')

        return { log, showSpinner, errMess };
    },
});
</script>