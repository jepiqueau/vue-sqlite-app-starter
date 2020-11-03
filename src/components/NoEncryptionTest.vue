<template>
  <div id="no-encryption-container">
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
import { createTablesNoEncryption, importTwoUsers, importThreeMessages,
  dropTablesTablesNoEncryption } from '@/utils/utils-db-no-encryption';

export default defineComponent({
    name: 'NoEncryptionTest',
    async setup() {
        const log = ref("");
        const { openDB, close, execute, run, query} = useSQLite();
        // No Encryption Test
        const noEncryptionTest = async (): Promise<boolean>  => {
            log.value = log.value
                .concat("* Starting testDatabaseNoEncryption *\n"); 
            // open the database
            let result: any = await openDB("test-sqlite"); 
            if(!result.result) {
                log.value = log.value
                            .concat(" Failed to open the database\n");
                return false;
            }
            // Drop tables if exists
            result = await execute(dropTablesTablesNoEncryption);
            if(result.changes.changes !== 0 &&
                                    result.changes.changes !== 1) {
                log.value = log.value.concat(" Execute1 failed\n");
                return false;
            }
            // Create tables
            result = await execute(createTablesNoEncryption);
            if(result.changes.changes !== 0 &&
                                    result.changes.changes !== 1) {
                log.value = log.value.concat(" Execute2 failed\n");
                return false;
            }
            // Insert two users with execute method
            result = await execute(importTwoUsers);
            if(result.changes.changes !== 2) {
                log.value = log.value.concat(" Execute3 failed\n");
                return false;
            }
            // Select all Users
            result = await query("SELECT * FROM users");
            if(result.values.length !== 2 ||
            result.values[0].name !== "Whiteley" ||
                                    result.values[1].name !== "Jones") {
                log.value = log.value.concat(" Select1 failed\n");
                return false;
            }
            // add one user with statement and values              
            let sqlcmd = "INSERT INTO users (name,email,age) ";
            sqlcmd += "VALUES (?,?,?)";
            const values: any[]  = ["Simpson","Simpson@example.com",69];
            result = await run(sqlcmd,values);
            if(result.changes.changes !== 1 ||
                                        result.changes.lastId !== 3) {
                log.value = log.value.concat(" Run1 failed\n");
                return false;
            }
            // add one user with statement              
            sqlcmd = `INSERT INTO users (name,email,age) VALUES `;
            sqlcmd += `("Brown","Brown@example.com",15)`;
            result = await run(sqlcmd);
            if(result.changes.changes !== 1 ||
                                        result.changes.lastId !== 4) {
                log.value = log.value.concat(" Run2 failed\n");
                return false;
            }
            // Select all Users
            result = await query("SELECT * FROM users");
            if(result.values.length !== 4) {
                log.value = log.value.concat(" Select2 failed\n");
                return false;
            }
            // Select Users with age > 35
            sqlcmd = "SELECT name,email,age FROM users WHERE age > ?";
            const age: string[] = ["35"];
            result = await query(sqlcmd,age);
            if(result.values.length !== 2) {
                log.value = log.value
                        .concat(" Select with filter on age failed\n");
                return false;
            }
            // Import three messages
            result = await execute(importThreeMessages);
            if(result.changes.changes !== 3) {
                log.value = log.value
                                .concat(" Insert messages failed\n");
                return false;
            }
            // Select all Messages
            result = await query("SELECT * FROM messages");
            if(result.values.length !== 3 ||
                result.values[0].title !== "test post 1" 
                        || result.values[1].title !== "test post 2" 
                        || result.values[2].title !== "test post 3") {
                log.value = log.value
                                .concat(" Select messages failed\n");
                return false;    
            }
            // Close the Database
            result = await close("test-sqlite")
            if(!result.result) {
                log.value = log.value
                            .concat(" Failed to close the database\n");
                return false;    
            }       
            log.value = log.value
                    .concat("* Ending testDatabaseNoEncryption *\n");     
            return true;
        }
        const retNoEncryption: boolean = await noEncryptionTest();
        if(!retNoEncryption) {
        log.value = log.value
                    .concat("* testDatabaseNoEncryption failed*\n"); 
        log.value = log.value.concat("\n* The set of tests failed *\n");
        } else {
        log.value = log.value
                    .concat("\n* The set of tests was successful *\n");
        }
        return { log };
    },

});

</script>
