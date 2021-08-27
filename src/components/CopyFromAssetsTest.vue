<template>
    <div id="copy-from-assets-container">
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
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { Dialog } from '@capacitor/dialog';

export default defineComponent({
    name: 'CopyFromAssetsTest',
    components: {
        LoadingSpinner
    },
    setup() {
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
        const copyFromAssetsTest = async (): Promise<boolean>  => {
            try {
                setLog(log.value
                    .concat("* Starting testDatabaseCopyFromAssets *\n"));
                console.log(`sqlite ${JSON.stringify(sqlite)}`);
                await sqlite.copyFromAssets();
                setLog(log.value.concat("> copyFromAssets successful\n"));

                // create a connection for myDB
                let db: SQLiteDBConnection = await sqlite.createConnection("myDB");
                setLog(log.value.concat("> createConnection " +
                                            " 'myDb' successful\n"));
                await db.open();
                setLog(log.value.concat("> open 'myDb' successful\n"));
                // Select all Users
                let res: any = await db.query("SELECT * FROM users");
                console.log(`@@@ res.values.length ${res.values.length}`)
                if(res.values.length !== 7 ||
                    res.values[0].name !== "Whiteley" ||
                    res.values[1].name !== "Jones" ||
                    res.values[2].name !== "Simpson" ||
                    res.values[3].name !== "Brown" ||
                    res.values[4].name !== "Jackson" ||
                    res.values[5].name !== "Kennedy" ||
                    res.values[6].name !== "Bush") {
                        errMess = `Query not returning 7 values`;
                        return false;
                    }

                setLog(log.value.concat("> query 'myDb' successful\n"));

            
                // Close Connection MyDB        
                await sqlite.closeConnection("myDB"); 
                setLog(log.value.concat("> closeConnection 'myDb' successful\n"));

                // create a connection for dbForCopy
                db = await sqlite.createConnection("dbForCopy");
                setLog(log.value.concat("> createConnection " +
                                            " 'dbForCopy' successful\n"));
                await db.open();
                setLog(log.value.concat("> open 'dbForCopy' successful\n"));
                // Select all Users
                res = await db.query("SELECT * FROM areas");
                console.log(`@@@ res.values.length ${res.values.length}`)
                if(res.values.length !== 3 ||
                        res.values[0].name !== "Access road" ||
                        res.values[1].name !== "Accessway" ||
                        res.values[2].name !== "Air handling system"){
                    errMess = `Query Users not returning 3 values`;
                    return false;
                }

                setLog(log.value.concat("> query 'dbForCopy' successful\n"));
                // Close Connection dbForCopy       
                await sqlite.closeConnection("dbForCopy"); 
                setLog(log.value.concat("> closeConnection 'dbForCopy' successful\n"));
                        
                setLog(log.value
                    .concat("* Ending testDatabaseCopyFromAssets *\n"));
                return true;
            } catch (err) {
                errMess = `${err}`;
                return false;
            }
        }
        
        onMounted(async () => {
            // Running the test
            console.log('$$$ Start CopyFromAssets on Mounted $$$')
            const retCopyFromAssets: boolean = await copyFromAssetsTest();
            console.log(`retCopyFromAssets: ${retCopyFromAssets}`)
            setShowSpinner(false);
            if(!retCopyFromAssets) {
                setLog(log.value
                    .concat("* testDatabaseCopyFromAssets failed *\n"));
                setLog(log.value
                        .concat("\n* The set of tests failed *\n"));
                await showAlert(errMess);
            } else {
                setLog(log.value
                    .concat("\n* The set of tests was successful *\n"));
            }
            console.log('$$$ End CopyFromAssetsTest on Mounted $$$')
        });
        return { log, showSpinner, errMess };
    },
});
</script>