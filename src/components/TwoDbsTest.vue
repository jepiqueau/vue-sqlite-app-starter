<template>
    <div id="two-dbs-container">
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
import { createTablesNoEncryption, importTwoUsers, importThreeMessages,
  dropTablesTablesNoEncryption } from '@/utils/utils-db-no-encryption';
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { SQLiteDBConnection, Result, isPermissions } from 'vue-sqlite-hook/dist';
import { deleteDatabase } from '@/utils/utils-delete-db';
import { createSchemaContacts, setContacts } from '@/utils/utils-db-encrypted-set';

export default defineComponent({
    name: 'TwoDbsTest',
    components: {
        LoadingSpinner
    },
    async setup() {
        const [showSpinner, setShowSpinner] = useState(true);
        const [log, setLog] = useState("");
        const app = getCurrentInstance()
        const sqlite = app?.appContext.config.globalProperties.$sqlite;
        const twoDbsTest = async (): Promise<boolean>  => {
 
            setLog(log.value
                .concat("* Starting testDatabaseTwoDbs *\n"));
            setLog(log.value
                    .concat(` isPermissions ${isPermissions.granted} \n`));

            // initialize the connection
            const db = await sqlite
                .createConnection("testNew", false, "no-encryption", 1);
            const db1 = await sqlite
                .createConnection("testSet", true, "secret", 1);

            // check if the databases exist 
            // and delete it for multiple successive tests
            let ret: any = await deleteDatabase(db);
            ret = await deleteDatabase(db1);

            // open db testNew
            ret = await db.open();
            if (!ret.result) {
                return false;
            }

            // create tables in db
            ret = await db.execute(createTablesNoEncryption);
            if (ret.changes.changes < 0) {
                return false;
            }

            // create synchronization table 
            ret = await db.createSyncTable();
                if (ret.changes.changes < 0) {
            return false;
            }

            // set the synchronization date
            const syncDate = "2020-11-25T08:30:25.000Z";
                ret = await db.setSyncDate(syncDate);
            if(!ret.result) return false;

            // add two users in db
            ret = await db.execute(importTwoUsers);
            if (ret.changes.changes !== 2) {
                return false;
            }
            // select all users in db
            ret = await db.query("SELECT * FROM users;");
            if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                ret.values[1].name !== "Jones") {
            return false;
            }

            // open db testSet
            ret = await db1.open();
            if (!ret.result) {
                return false;
            }
            // create tables in db1
            ret = await db1.execute(createSchemaContacts);
            if (ret.changes.changes < 0) {
                return false;
            }
            // load setContacts in db1
            ret = await db1.executeSet(setContacts);
            if (ret.changes.changes !== 5) {
                return false;
            }

            // select users where company is NULL in db
            ret = await db.query("SELECT * FROM users WHERE company IS NULL;");
            if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                ret.values[1].name !== "Jones") {
                return false;
            }
            // add one user with statement and values              
            let sqlcmd = 
                "INSERT INTO users (name,email,age) VALUES (?,?,?)";
            let values: Array<any>  = ["Simpson","Simpson@example.com",69];
            ret = await db.run(sqlcmd,values);
            if(ret.changes.lastId !== 3) {
                return false;
            }
            // add one user with statement              
            sqlcmd = `INSERT INTO users (name,email,age) VALUES ` + 
                            `("Brown","Brown@example.com",15)`;
            ret = await db.run(sqlcmd);
            if(ret.changes.lastId !== 4) {
                return false;
            }

            app?.appContext.config.globalProperties.$existingConn.setExistConn(true);                   
            setLog(log.value
                .concat("* Ending testDatabaseTwoDbs *\n"));
            return true;
        }
        onMounted(async () => {
            // Running the test
            const retTwoDbs: boolean = await twoDbsTest();
            if(!retTwoDbs) {
                setLog(log.value
                    .concat("* testDatabaseTwoDbsfailed *\n"));
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