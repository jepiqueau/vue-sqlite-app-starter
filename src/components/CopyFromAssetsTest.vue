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
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, getCurrentInstance } from 'vue';
import { createTablesNoEncryption, importTwoUsers,
  dropTablesTablesNoEncryption } from '@/utils/utils-db-no-encryption';
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { SQLiteDBConnection, isPermissions } from 'vue-sqlite-hook/dist';
import { deleteDatabase } from '@/utils/utils-delete-db';
export default defineComponent({
    name: 'CopyFromAssetsTest',
    components: {
        LoadingSpinner
    },
    async setup() {
        const [showSpinner, setShowSpinner] = useState(true);
        const [log, setLog] = useState("");
        const app = getCurrentInstance()
        const sqlite = app?.appContext.config.globalProperties.$sqlite;
        const copyFromAssetsTest = async (): Promise<boolean>  => {
 
            setLog(log.value
                .concat("* Starting testDatabaseCopyFromAssets *\n"));
            setLog(log.value
                    .concat(` isPermissions ${isPermissions.granted} \n`));
            let res: any = await sqlite.copyFromAssets();
            if(!res.result) return false;
            setLog(log.value.concat("> copyFromAssets successful\n"));

            // create a connection for myDB
            res = await sqlite.createConnection("myDB");
            if(res == null ) return false;
            if((Object.keys(res)).includes("result") && !res.result) return false;
            setLog(log.value.concat("> createConnection " +
                                        " 'myDb' successful\n"));
            let db: SQLiteDBConnection = res; 
            res = await db.open();
            if(!res.result) return false;
            setLog(log.value.concat("> open 'myDb' successful\n"));
            // Select all Users
            res = await db.query("SELECT * FROM users");
            console.log(`@@@ res.values.length ${res.values.length}`)
            if(res.values.length !== 7 ||
                res.values[0].name !== "Whiteley" ||
                res.values[1].name !== "Jones" ||
                res.values[2].name !== "Simpson" ||
                res.values[3].name !== "Brown" ||
                res.values[4].name !== "Jackson" ||
                res.values[5].name !== "Kennedy" ||
                res.values[6].name !== "Bush") return false;

            setLog(log.value.concat("> query 'myDb' successful\n"));

            
            // Close Connection MyDB        
            res = await sqlite.closeConnection("myDB"); 
            if(!res.result) {
                return false; 
            }
            setLog(log.value.concat("> closeConnection 'myDb' successful\n"));

            // create a connection for dbForCopy
            res = await sqlite.createConnection("dbForCopy");
            if(res == null ) return false;
            if((Object.keys(res)).includes("result") && !res.result) return false;
            setLog(log.value.concat("> createConnection " +
                                        " 'dbForCopy' successful\n"));
            db = res;
            res = await db.open();
            if(!res.result) return false;
            setLog(log.value.concat("> open 'dbForCopy' successful\n"));
            // Select all Users
            res = await db.query("SELECT * FROM areas");
            console.log(`@@@ res.values.length ${res.values.length}`)
            if(res.values.length !== 3 ||
                res.values[0].name !== "Access road" ||
                res.values[1].name !== "Accessway" ||
                res.values[2].name !== "Air handling system") return false;

            setLog(log.value.concat("> query 'dbForCopy' successful\n"));
            // Close Connection dbForCopy       
            res = await sqlite.closeConnection("dbForCopy"); 
            if(!res.result) {
                return false; 
            }
            setLog(log.value.concat("> closeConnection 'dbForCopy' successful\n"));
                    
            setLog(log.value
                .concat("* Ending testDatabaseCopyFromAssets *\n"));
            return true;
        }
        onMounted(async () => {
            // Running the test
            const retCopyFromAssets: boolean = await copyFromAssetsTest();
            if(!retCopyFromAssets) {
                setLog(log.value
                    .concat("* testDatabaseCopyFromAssets failed *\n"));
                setLog(log.value
                        .concat("\n* The set of tests failed *\n"));
            } else {
                setLog(log.value
                    .concat("\n* The set of tests was successful *\n"));
            }
            setShowSpinner(false);
        });
        return { log, showSpinner };
    },
});
</script>