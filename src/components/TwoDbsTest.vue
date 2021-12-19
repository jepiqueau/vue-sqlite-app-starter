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
            <div v-if="errMess.length > 0">
                <p>{{errMess}}</p>}
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, getCurrentInstance } from 'vue';
import { createTablesNoEncryption, importTwoUsers } from '@/utils/utils-db-no-encryption';
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { deleteDatabase } from '@/utils/utils-delete-db';
import { createSchemaContacts, setContacts } from '@/utils/utils-db-encrypted-set';
import { Dialog } from '@capacitor/dialog';
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';

export default defineComponent({
    name: 'TwoDbsTest',
    components: {
        LoadingSpinner
    },
    setup() {
        console.log('$$$ Start TwoDbsTest setup $$$')
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
        const twoDbsTest = async (): Promise<boolean>  => {
            try {
                setLog(log.value
                    .concat("* Starting testDatabaseTwoDbs *\n"));

                // initialize the connection
                const db: SQLiteDBConnection = await sqlite
                    .createConnection("testNew", false, "no-encryption", 1);
                const db1: SQLiteDBConnection = await sqlite
                    .createConnection("testSet", true, "secret", 1);

                // check if the databases exist 
                // and delete it for multiple successive tests
                await deleteDatabase(db);
                await deleteDatabase(db1);

                // open db testNew
                await db.open();

                // create tables in db
                let ret: any = await db.execute(createTablesNoEncryption);
                if (ret.changes.changes < 0) {
                    errMess = `Execute changes < 0`;
                    return false;
                }

                // create synchronization table 
                ret = await db.createSyncTable();
                if (ret.changes.changes < 0) {
                    errMess = `CreateSyncTable changes < 0`;
                    return false;
                }

                // set the synchronization date
                const syncDate = "2020-11-25T08:30:25.000Z";
                await db.setSyncDate(syncDate);

                // add two users in db
                ret = await db.execute(importTwoUsers);
                if (ret.changes.changes !== 2) {
                    errMess = `Execute importTwoUsers changes != 2`;
                    return false;
                }
                // select all users in db
                ret = await db.query("SELECT * FROM users;");
                if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones") {
                    errMess = `Query not returning 2 values`;
                    return false;
                }

                // open db testSet
                await db1.open();

                // create tables in db1
                ret = await db1.execute(createSchemaContacts);
                if (ret.changes.changes < 0) {
                    errMess = `Execute createSchemaContacts changes < 0`;
                    return false;
                }
                // load setContacts in db1
                ret = await db1.executeSet(setContacts);
                if (ret.changes.changes !== 5) {
                    errMess = `ExecuteSet setContacts changes != 5`;
                    return false;
                }

                // select users where company is NULL in db
                ret = await db.query("SELECT * FROM users WHERE company IS NULL;");
                if(ret.values.length !== 2 || ret.values[0].name !== "Whiteley" ||
                                    ret.values[1].name !== "Jones") {
                    errMess = `Query Company is NULL not returning 2 values`;
                    return false;
                }
                // add one user with statement and values              
                let sqlcmd = 
                    "INSERT INTO users (name,email,age) VALUES (?,?,?)";
                const values: Array<any>  = ["Simpson","Simpson@example.com",69];
                ret = await db.run(sqlcmd,values);
                if(ret.changes.lastId !== 3) {
                    errMess = `Run lastId != 3`;
                    return false;
                }
                // add one user with statement              
                sqlcmd = `INSERT INTO users (name,email,age) VALUES ` + 
                                `("Brown","Brown@example.com",15)`;
                ret = await db.run(sqlcmd);
                if(ret.changes.lastId !== 4) {
                    errMess = `Run lastId != 4`;
                    return false;
                }

                app?.appContext.config.globalProperties.$existingConn.setExistConn(true);                   
                setLog(log.value
                    .concat("* Ending testDatabaseTwoDbs *\n"));
                return true;
            } catch (err: any) {
                errMess = `${err.message}`;
                return false;
            }
        }
        
        onMounted(async () => {
            // Running the test
            console.log('$$$ Start TwoDbsTest on Mounted $$$')
            const retTwoDbs: boolean = await twoDbsTest();
            console.log(`retTwoDbs: ${retTwoDbs}`)
            setShowSpinner(false);
            if(!retTwoDbs) {
                setLog(log.value
                    .concat("* testDatabaseTwoDbsfailed *\n"));
                setLog(log.value
                        .concat("\n* The set of tests failed *\n"));
                await showAlert(errMess);
            } else {
                setLog(log.value
                    .concat("\n* The set of tests was successful *\n"));
            }
            console.log('$$$ End TwoDbsTest on Mounted $$$')

        });
        console.log('$$$ End TwoDbsTest setup $$$')
        return { log, showSpinner, errMess };
    },
});
</script>