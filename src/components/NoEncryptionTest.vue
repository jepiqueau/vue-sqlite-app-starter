<template>
    <div id="no-encryption-container">
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
import { createTablesNoEncryption, importTwoUsers,
  dropTablesTablesNoEncryption } from '@/utils/utils-db-no-encryption';
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { SQLiteDBConnection } from 'vue-sqlite-hook/dist';
import { deleteDatabase } from '@/utils/utils-delete-db';
import { Dialog } from '@capacitor/dialog';

export default defineComponent({
    name: 'NoEncryptionTest',
    components: {
        LoadingSpinner
    },
    async setup() {
        const [showSpinner, setShowSpinner] = useState(true);
        const [log, setLog] = useState("");
        const app = getCurrentInstance()
        const sqlite = app?.appContext.config.globalProperties.$sqlite;
        let errMess = "";
        const showAlert = async (message: string) => {
            await Dialog.alert({
            title: 'Error Dialog',
            message: message,
            });
        };
        const noEncryptionTest = async (): Promise<boolean>  => {
            try {
                setLog(log.value
                    .concat("* Starting testDatabaseNoEncryption *\n"));
                // test the plugin with echo
                let res: any = await sqlite.echo("Hello from echo");
                if(res.value !== "Hello from echo"){
                    errMess = `Echo not returning "Hello from echo"`;
                    return false;
                }
                setLog(log.value.concat("> Echo successful\n"));
                // create a connection for NoEncryption
                let db: SQLiteDBConnection = await sqlite.createConnection("NoEncryption");
                setLog(log.value.concat("> createConnection " +
                                            " 'NoEncryption' successful\n"));
                // check if the databases exist 
                // and delete it for multiple successive tests
                await deleteDatabase(db);         
                // open NoEncryption database
                await db.open();
                setLog(log.value.concat("> open 'NoEncryption' successful\n"));
                // Drop tables if exists
                res = await db.execute(dropTablesTablesNoEncryption);
                if(res.changes.changes !== 0 &&
                            res.changes.changes !== 1){
                    errMess = `Execute dropTablesTablesNoEncryption changes < 0`;
                    return false;
                } 
                setLog(log.value.concat(" Execute1 successful\n"));
                
                // Create tables
                res = await db.execute(createTablesNoEncryption);
                if (res.changes.changes < 0) {
                    errMess = `Execute createTablesNoEncryption changes < 0`;
                    return false;
                }
                setLog(log.value.concat(" Execute2 successful\n"));
                // Insert two users with execute method
                res = await db.execute(importTwoUsers);
                if (res.changes.changes !== 2) {
                    errMess = `Execute importTwoUsers changes != 2`;
                    return false;
                }
                setLog(log.value.concat(" Execute3 successful\n"));
                // Select all Users
                res = await db.query("SELECT * FROM users");
                if(res.values.length !== 2 ||
                res.values[0].name !== "Whiteley" ||
                            res.values[1].name !== "Jones") {
                    errMess = `Query not returning 2 values`;
                    return false;
                }
                setLog(log.value.concat(" Select1 successful\n"));
                // add one user with statement and values              
                let sqlcmd = "INSERT INTO users (name,email,age) VALUES (?,?,?)";
                let values: Array<any>  = ["Simpson","Simpson@example.com",69];
                res = await db.run(sqlcmd,values);
                if(res.changes.changes !== 1 ||
                                res.changes.lastId !== 3) {
                    errMess = `Run lastId != 3`;
                    return false;
                }
                setLog(log.value.concat(" Run1 successful\n"));
                // add one user with statement              
                sqlcmd = `INSERT INTO users (name,email,age) VALUES `+
                                `("Brown","Brown@example.com",15)`;
                res = await db.run(sqlcmd);
                if(res.changes.changes !== 1 ||
                            res.changes.lastId !== 4) {
                    errMess = `Run lastId != 4`;
                    return false;
                }
                setLog(log.value.concat(" Run2 successful\n"));
                // Select all Users
                res = await db.query("SELECT * FROM users");
                if(res.values.length !== 4) {
                    errMess = `Query not returning 4 values`;
                    return false;
                }
                setLog(log.value.concat(" Select2 successful\n"));
                // Select Users with age > 35
                sqlcmd = "SELECT name,email,age FROM users WHERE age > ?";
                values = ["35"];
                res = await db.query(sqlcmd,values);
                if(res.values.length !== 2) {
                    errMess = `Query > 35 not returning 2 values`;
                    return false;
                }
                setLog(log.value
                        .concat(" Select with filter on age successful\n"));
                // Close Connection NoEncryption        
                await sqlite.closeConnection("NoEncryption"); 
                        
                setLog(log.value
                    .concat("* Ending testDatabaseNoEncryption *\n"));
                return true;
            } catch (err) {
                errMess = `${err.message}`;
                return false;
            }
        }
        onMounted(async () => {
            // Running the test
            const retNoEncryption: boolean = await noEncryptionTest();
            setShowSpinner(false);
            if(!retNoEncryption) {
                setLog(log.value
                    .concat("* testDatabaseNoEncryption failed *\n"));
                setLog(log.value
                        .concat("\n* The set of tests failed *\n"));
                await showAlert(errMess);
            } else {
                setLog(log.value
                    .concat("\n* The set of tests was successful *\n"));
            }
        });
        return { log, showSpinner, errMess };
    },
});
</script>