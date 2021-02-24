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
        const noEncryptionTest = async (): Promise<boolean>  => {
 
            setLog(log.value
                .concat("* Starting testDatabaseNoEncryption *\n"));
            // test the plugin with echo
            let res: any = await sqlite.echo("Hello from echo");
            if(res.value !== "Hello from echo") return false;
            setLog(log.value.concat("> Echo successful\n"));
            // create a connection for NoEncryption
            res = await sqlite.createConnection("NoEncryption");
            if(res == null ) return false;
            if((Object.keys(res)).includes("result") && !res.result) return false;
            setLog(log.value.concat("> createConnection " +
                                        " 'NoEncryption' successful\n"));
            let db: SQLiteDBConnection = res; 
            // check if the databases exist 
            // and delete it for multiple successive tests
            res = await deleteDatabase(db);         
            // open NoEncryption database
            res = await db.open();
            if(!res.result) return false;
            setLog(log.value.concat("> open 'NoEncryption' successful\n"));
            res = await db.isDBOpen();
            if(!res.result) return false;
            setLog(log.value.concat("> isDBOpen 'NoEncryption' successful\n"));

            // Drop tables if exists
            res = await db.execute(dropTablesTablesNoEncryption);
            if(res.changes.changes !== 0 &&
                         res.changes.changes !== 1) return false;
            setLog(log.value.concat(" Execute1 successful\n"));
            
            // Create tables
            res = await db.execute(createTablesNoEncryption);
            if(res.changes.changes !== 0 &&
                res.changes.changes !== 1) return false;
            setLog(log.value.concat(" Execute2 successful\n"));
            // Insert two users with execute method
            res = await db.execute(importTwoUsers);
            if(res.changes.changes !== 2) return false;
            setLog(log.value.concat(" Execute3 successful\n"));
            // Select all Users
            res = await db.query("SELECT * FROM users");
            if(res.values.length !== 2 ||
            res.values[0].name !== "Whiteley" ||
                        res.values[1].name !== "Jones") return false;
            setLog(log.value.concat(" Select1 successful\n"));
            // add one user with statement and values              
            let sqlcmd = "INSERT INTO users (name,email,age) VALUES (?,?,?)";
            let values: Array<any>  = ["Simpson","Simpson@example.com",69];
            res = await db.run(sqlcmd,values);
            if(res.changes.changes !== 1 ||
                            res.changes.lastId !== 3) return false;
            setLog(log.value.concat(" Run1 successful\n"));
            // add one user with statement              
            sqlcmd = `INSERT INTO users (name,email,age) VALUES `+
                            `("Brown","Brown@example.com",15)`;
            res = await db.run(sqlcmd);
            if(res.changes.changes !== 1 ||
                        res.changes.lastId !== 4) return false;
            setLog(log.value.concat(" Run2 successful\n"));
            // Select all Users
            res = await db.query("SELECT * FROM users");
            console.log(`**** all users ${JSON.stringify(res.values)} `)
            if(res.values.length !== 4) return false;
            setLog(log.value.concat(" Select2 successful\n"));
            // Select Users with age > 35
            sqlcmd = "SELECT name,email,age FROM users WHERE age > ?";
            values = ["35"];
            res = await db.query(sqlcmd,values);
            if(res.values.length !== 2) return false;
            setLog(log.value
                    .concat(" Select with filter on age successful\n"));
            // Close Connection NoEncryption        
            res = await sqlite.closeConnection("NoEncryption"); 
            if(!res.result) {
                return false; 
            }
                    
            setLog(log.value
                .concat("* Ending testDatabaseNoEncryption *\n"));
            return true;
        }
        onMounted(async () => {
            // Running the test
            const retNoEncryption: boolean = await noEncryptionTest();
            if(!retNoEncryption) {
                setLog(log.value
                    .concat("* testDatabaseNoEncryption failed *\n"));
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