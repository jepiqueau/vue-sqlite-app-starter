<template>
  <div id="execute-set-container">
    <div id="log">
        <pre>
          <p>{{log}}</p>
        </pre>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue';
import { useSQLite } from 'vue-sqlite-hook/dist';
import { createTablesExecuteSet, dropTablesTablesExecuteSet,
setArrayUsers, setArrayMessages } from '../utils/utils-db-execute-set';

export default defineComponent({
    name: 'ExecuteSetTest',
    async setup() {
        const log = ref("");
        const { openDB, close, execute,  executeSet, run,
                                        query} = useSQLite();
        // No Encryption Test
        const executeSetTest = async (): Promise<boolean>  => {
            log.value = log.value
                .concat("* Starting testDatabaseExecuteSet *\n"); 
            // open the database
            let result: any = await openDB("test-executeset"); 
            if(!result.result) {
                log.value = log.value
                            .concat(" Failed to open the database\n");
                return false;
            }
            // Drop tables if exists
            result = await execute(dropTablesTablesExecuteSet);
            if(result.changes.changes !== 0 &&
                                    result.changes.changes !== 1) {
                log.value = log.value.concat(" Execute1 failed\n");
                return false;
            }
            // Create tables
            result = await execute(createTablesExecuteSet);
            if(result.changes.changes !== 0 &&
                                    result.changes.changes !== 1) {
                log.value = log.value.concat(" Execute2 failed\n");
                return false;
            }
            // executeSet an Array of Users
            result = await executeSet(setArrayUsers);
            if(result.changes.changes !== 5) {
                log.value = log.value.concat(" ExecuteSet1 failed\n");
                return false;
            }
            // executeSet an Array of Messages
            result = await executeSet(setArrayMessages);
            if(result.changes.changes !== 3) {
                log.value = log.value.concat(" ExecuteSet2 failed\n");
                return false;
            }
            // Select all Users
            result = await query("SELECT * FROM users");
            if(result.values.length !== 4) {
                log.value = log.value.concat(" Query1 failed\n");
                return false;
            }
            // Select all Messages
            result = await query("SELECT * FROM messages;");
            if(result.values.length !== 3) {
                log.value = log.value.concat(" Query2 failed\n");
                return false;
            }
            // Delete user with id = 1
            result = await run("DELETE FROM users WHERE id = 1;");
            if(result.changes.changes !== 3) {
                log.value = log.value
                                .concat(" Delete users failed\n");
                return false;
            }
            // Select all Users
            result = await query("SELECT * FROM users");
            if(result.values.length !== 3) {
                log.value = log.value.concat(" Query3 failed\n");
                return false;
            }
            // Select all messages
            result = await query("SELECT * FROM messages;");
            if(result.values.length !== 1) {
                log.value = log.value.concat(" Query4 failed\n");
                return false;
            }
            // Close the Database
            result = await close("test-executeset")
            if(!result.result) {
                log.value = log.value
                            .concat(" Failed to close the database\n");
                return false;    
            }       
            log.value = log.value
                    .concat("* Ending testDatabaseExecuteSet *\n");     
            return true;
        }
        const retExecuteSet: boolean = await executeSetTest();
        if(!retExecuteSet) {
        log.value = log.value
                    .concat("* testDatabaseExecuteSet failed*\n"); 
        log.value = log.value.concat("\n* The set of tests failed *\n");
        } else {
        log.value = log.value
                    .concat("\n* The set of tests was successful *\n");
        }
        return { log };
    },

});

</script>
