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
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue';
import { useSQLite } from 'vue-sqlite-hook/dist';
import { createTablesNoEncryption, importTwoUsers,
         importThreeMessages } from '../utils/utils-db-no-encryption';
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'

export default defineComponent({
    name: 'ToEncryptTest',
    components: {
        LoadingSpinner
    },
    async setup() {
        const [showSpinner, setShowSpinner] = useState(true);
        const [log, setLog] = useState("");
        const { openDB, close, execute, run, query, isDBExists,
                deleteDB} = useSQLite();
        // To Encrypt Test
        const toEncryptTest = async (): Promise<boolean>  => {
            setLog(log.value
                .concat("* Starting testDatabaseToEncrypt *\n")); 
            // Test if "test-encryption" exists and delete it 
            // for multiple test runs
            let result: any = await isDBExists("test-encryption");
            if(result.result) {
                // Delete the database if it exists              
                result = await openDB("test-encryption",true,"secret"); 
                if(result.result) {
                await deleteDB("test-encryption");
                }
            }
 
            // open the database
            result = await openDB("test-encryption"); 
            if(!result.result) {
                setLog(log.value
                            .concat(" Failed to open the database\n"));
                return false;
            }
            // Create tables
            result = await execute(createTablesNoEncryption);
            if(result.changes.changes !== 0 &&
                                    result.changes.changes !== 1) {
                setLog(log.value.concat(" Execute2 failed\n"));
                return false;
            }
            // Insert two users with execute method
            result = await execute(importTwoUsers);
            if(result.changes.changes !== 2) {
                setLog(log.value.concat(" Execute3 failed\n"));
                return false;
            }
            // Select all Users
            result = await query("SELECT * FROM users");
            if(result.values.length !== 2 ||
                        result.values[0].name !== "Whiteley" ||
                        result.values[1].name !== "Jones") {
                setLog(log.value.concat(" Select1 users failed\n"));
                return false;
            }
            // add one user with statement and values              
            let sqlcmd = "INSERT INTO users (name,email,age) ";
            sqlcmd += "VALUES (?,?,?)";
            const values: any[]  = ["Simpson","Simpson@example.com",69];
            result = await run(sqlcmd,values);
            if(result.changes.changes !== 1 ||
                                        result.changes.lastId !== 3) {
                setLog(log.value
                        .concat(" Run1 insert a user failed\n"));
                return false;
            }
            // Import three messages
            result = await execute(importThreeMessages);
            if(result.changes.changes !== 3) {
                setLog(log.value
                        .concat(" Run2 insert messages failed\n"));
                return false;
            }

            // Select all Messages
            result = await query("SELECT * FROM messages");
            if(result.values.length !== 3) {
                setLog(log.value
                        .concat(" Select2 messages failed\n"));
                return false;
            }
            // Close the Database
            result = await close("test-encryption")
            if(!result.result) {
                setLog(log.value
                        .concat(" Failed to close the database\n"));
                return false;    
            }
            // do the encryption when opening the database
            result = await openDB("test-encryption",true,"encryption");
            if(!result.result) {
                setLog(log.value
                        .concat(" Failed to encrypt the database\n"));
                return false;
            }
            // Select all Users
            result = await query("SELECT * FROM users");
            if(result.values.length !== 3 ||
                result.values[0].name !== "Whiteley"
                    || result.values[1].name !== "Jones"
                    || result.values[2].name !== "Simpson") {
                setLog(log.value.concat(" Select Users failed\n"));
                return false;
            }
            // Select all Messages
            result = await query("SELECT * FROM messages");
            if(result.values.length !== 3 ||
                result.values[0].title !== "test post 1"
                    || result.values[1].title !== "test post 2" 
                    || result.values[2].title !== "test post 3") {
                setLog(log.value
                        .concat(" Select Messages failed\n"));
                return false;
            }
            // Close the Database
            result = await close("test-encryption")
            if(!result.result) {
                setLog(log.value
                        .concat(" Failed to close the database\n"));
                return false;    
            }

            setLog(log.value
                    .concat("* Ending testDatabaseToEncrypt *\n"));     
            return true;
        }
        onMounted(async () => {
            
            // Running the test
            const retToEncrypt: boolean = await toEncryptTest();
            if(!retToEncrypt) {
                setLog(log.value
                        .concat("* testDatabaseToEncrypt failed*\n")); 
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
