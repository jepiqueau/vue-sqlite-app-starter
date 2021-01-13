<template>
    <div id="execute-set-container">
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
import { createTablesExecuteSet, dropTablesTablesExecuteSet,
         setArrayUsers, setArrayMessages }
                                from '../utils/utils-db-execute-set';
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { Capacitor } from '@capacitor/core';

export default defineComponent({
    name: 'ExecuteSetTest',
    components: {
        LoadingSpinner
    },
    async setup() {
        const [showSpinner, setShowSpinner] = useState(true);
        const [log, setLog] = useState("");
        const { openDB, close, execute,  executeSet, run,
                        query} = useSQLite();


        // Execute Set Test
        const executeSetTest = async (): Promise<boolean>  => {
            setLog(log.value
                .concat("* Starting testDatabaseExecuteSet *\n")); 
            // open the database
            let result: any = await openDB("test-executeset"); 
            if(!result.result) {
                setLog(log.value
                        .concat(" Failed to open the database\n"));
                return false;
            }
            // Drop tables if exists
            result = await execute(dropTablesTablesExecuteSet);
            if(result.changes.changes !== 0 &&
                                    result.changes.changes !== 1) {
                setLog(log.value.concat(" Execute1 failed\n"));
                return false;
            }
            // Create tables
            result = await execute(createTablesExecuteSet);
            if(result.changes.changes !== 0 &&
                                    result.changes.changes !== 1) {
                setLog(log.value.concat(" Execute2 failed\n"));
                return false;
            }
            // executeSet an Array of Users
            result = await executeSet(setArrayUsers);
            if(result.changes.changes !== 5) {
                setLog(log.value.concat(" ExecuteSet1 failed\n"));
                return false;
            }
            // executeSet an Array of Messages
            result = await executeSet(setArrayMessages);
            if(result.changes.changes !== 3) {
                setLog(log.value.concat(" ExecuteSet2 failed\n"));
                return false;
            }
            // Select all Users
            result = await query("SELECT * FROM users");
            if(result.values.length !== 4) {
                setLog(log.value.concat(" Query1 failed\n"));
                return false;
            }
            // Select all Messages
            result = await query("SELECT * FROM messages;");
            if(result.values.length !== 3) {
                setLog(log.value.concat(" Query2 failed\n"));
                return false;
            }
            // Delete user with id = 1
            result = await run("DELETE FROM users WHERE id = 1;");
            if(result.changes.changes !== 3) {
                setLog(log.value
                            .concat(" Delete users failed\n"));
                return false;
            }
            // Select all Users
            result = await query("SELECT * FROM users");
            if(result.values.length !== 3) {
                setLog(log.value.concat(" Query3 failed\n"));
                return false;
            }
            // Select all messages
            result = await query("SELECT * FROM messages;");
            if(result.values.length !== 1) {
                setLog(log.value.concat(" Query4 failed\n"));
                return false;
            }
            // Close the Database
            result = await close("test-executeset")
            if(!result.result) {
                setLog(log.value
                    .concat(" Failed to close the database\n"));
                return false;    
            }       
            setLog(log.value
                .concat("* Ending testDatabaseExecuteSet *\n"));     
            return true;
        }

        onMounted(async () => {

            // Run the test
            const retExecuteSet: boolean = await executeSetTest();
            if(!retExecuteSet) {
                setLog(log.value
                        .concat("* testDatabaseExecuteSet failed*\n")); 
                setLog(log.value
                    .concat("\n* The set of tests failed *\n"));
                setShowSpinner(false);
                return { log, showSpinner };
            } else {
                setLog(log.value
                    .concat("\n* The set of tests was successful *\n"));
                setShowSpinner(false);
                return { log, showSpinner };
            }
        });
        return { log, showSpinner };
    },

});

</script>
