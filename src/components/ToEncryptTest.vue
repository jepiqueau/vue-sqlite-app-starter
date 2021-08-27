<template>
    <div id="to-encrypt-container">
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
import { createTablesNoEncryption, importTwoUsers/*,
  dropTablesTablesNoEncryption*/ } from '@/utils/utils-db-no-encryption';
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { deleteDatabase } from '@/utils/utils-delete-db';
import { Dialog } from '@capacitor/dialog';
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';

export default defineComponent({
    name: 'ToEncryptTest',
    components: {
        LoadingSpinner
    },
    setup() {
        const [showSpinner, setShowSpinner] = useState(true);
        const [log, setLog] = useState("");
        const app = getCurrentInstance()
        const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;
        let errMess = "";
        onMounted(async () => {
            const showAlert = async (message: string) => {
                await Dialog.alert({
                title: 'Error Dialog',
                message: message,
                });
            };
            const toEncryptTest = async (): Promise<boolean>  => {
                try {
                    setLog(log.value
                        .concat("* Starting testDatabaseToEncrypt *\n"));
                    // test the plugin with echo
                    let res: any = await sqlite.echo("Hello from echo");
                    if(res.value !== "Hello from echo"){
                        errMess = `Echo not returning "Hello from echo"`;
                        return false;
                    }
                    setLog(log.value.concat("> Echo successful\n"));

                    // ************************************************
                    // Create Database No Encryption
                    // ************************************************

                    // create a connection for NoEncryption
                    const db: SQLiteDBConnection = await sqlite.createConnection("toEncrypt");
                    setLog(log.value.concat("> createConnection " +
                                                " 'ToEncrypt' successful\n"));
                    // open ToEncrypt database
                    await db.open();
                    setLog(log.value.concat("> open 'ToEncrypt' successful\n"));
                    
                    // Create tables
                    res = await db.execute(createTablesNoEncryption);
                    if (res.changes.changes < 0) {
                        errMess = `Execute createTablesToEncrypt changes < 0`;
                        return false;
                    }
                    setLog(log.value.concat(" Execute2 successful\n"));

                    // create synchronization table 
                    res = await db.createSyncTable();
                    if (res.changes.changes < 0) {
                        errMess = `CreateSyncTable changes < 0`;
                        return false;
                    }
                    setLog(log.value.concat(" CreateSyncTable successful\n"));
            
                    // set the synchronization date
                    const syncDate = "2020-11-25T08:30:25.000Z";
                    await db.setSyncDate(syncDate);
                    setLog(log.value.concat(" SetSyncDate successful\n"));

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

                    // Close Connection ToEncrypt        
                    await sqlite.closeConnection("toEncrypt");

                    // ************************************************
                    // Encrypt the existing database
                    // ************************************************
                    // initialize the connection
                    const db1 = await sqlite.createConnection("toEncrypt", true, "encryption", 1);
                    setLog(log.value.concat("> createConnection for encryption " +
                                                " 'ToEncrypt' successful\n"));

                    // open db toEncrypt
                    await db1.open();
                
                    // add one user with statement and values              
                    sqlcmd = 
                            "INSERT INTO users (name,email,age) VALUES (?,?,?)";
                    values = ["Jackson","Jackson@example.com",32];
                    res = await db1.run(sqlcmd,values);
                    if(res.changes.changes !== 1 ||
                                res.changes.lastId !== 5) {
                        errMess = `Run lastId != 5`;
                        return false;
                    }
                    setLog(log.value.concat(" Run3 successful\n"));

                    // Select all Users
                    res = await db1.query("SELECT * FROM users");
                    if(res.values.length !== 5|| res.values[0].name !== "Whiteley" ||
                                                res.values[1].name !== "Jones" ||
                                                res.values[2].name !== "Simpson" ||
                                                res.values[3].name !== "Brown" ||
                                                res.values[4].name !== "Jackson") {
                        errMess = `Query Encryption not returning 5 values`;
                        return false;
                    }
                    setLog(log.value.concat(" Select2 successful\n"));

                    // Close Connection toEncrypt        
                    await sqlite.closeConnection("toEncrypt");

                    // ************************************************
                    // Open the encrypted database
                    // ************************************************
                    // initialize the connection
                    const db2 = await sqlite.createConnection("toEncrypt", true, "secret", 1);
                    setLog(log.value.concat("> createConnection with secret " +
                                                " 'ToEncrypt' successful\n"));
                    // open db toEncrypt
                    await db2.open();
                    // Select all Users
                    res = await db2.query("SELECT * FROM users");
                    if(res.values.length !== 5|| res.values[0].name !== "Whiteley" ||
                                                res.values[1].name !== "Jones" ||
                                                res.values[2].name !== "Simpson" ||
                                                res.values[3].name !== "Brown" ||
                                                res.values[4].name !== "Jackson") {
                        errMess = `Query encrypted not returning 5 values`;
                        return false;
                    }
                    setLog(log.value.concat(" Select3 successful\n"));

                    // delete it for multiple successive tests
                    await deleteDatabase(db2);

                    // Close Connection toEncrypt        
                    await sqlite.closeConnection("toEncrypt");
                            
                    setLog(log.value
                        .concat("* Ending testDatabaseToEncrypt *\n"));
                    return true;
                } catch (err) {
                    errMess = `${err.message}`;
                    return false;
                }
            }
            // Running the test
            const retNoEncryption: boolean = await toEncryptTest();
            setShowSpinner(false);
            if(!retNoEncryption) {
                setLog(log.value
                    .concat("* testDatabaseToEncryptfailed *\n"));
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