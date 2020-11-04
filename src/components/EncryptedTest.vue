<template>
  <div id="encrypted-container">
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
import { createTablesEncrypted,
         createDataEncrypted } from '../utils/utils-db-encrypted';

export default defineComponent({
    name: 'EncryptedTest',
    async setup() {
        const log = ref("");
        const { openDB, close, execute, query, deleteDB} = useSQLite();
        /**
         * Test an encrypted database
         */
        const encryptedTest = async (): Promise<boolean>  => {
            log.value = log.value
                .concat("* Starting testDBEncrypted *\n"); 
            // open the database
            let result: any = await openDB( "test-encrypted", true,
                                            "secret"); 
            if(!result.result) {
                log.value = log.value
                            .concat(" Failed to open the database\n");
                return false;
            }
            // create tables
            result = await execute(createTablesEncrypted);
            if (result.changes.changes !== 0 && 
                                    result.changes.changes !== 1) {
                log.value = log.value
                        .concat(" createTablesEncrypted failed\n");
                return false;
            }
            // Insert some Contacts
            result = await execute(createDataEncrypted);
            if(result.changes.changes !== 2) {
                log.value = log.value
                            .concat(" createDataEncrypted failed\n");
                return false; 
            }
            // Select all Contacts
            result = await query("SELECT * FROM contacts;");
            if(result.values.length !== 2
                || result.values[0].name !== "Whiteley" 
                || result.values[1].name !== "Jones") {
                log.value = log.value
                                .concat(" Select Contacts failed\n");
                return false;   
            }
            // Close the Database
            result = await close("test-encrypted")
            if(!result.result) {
                log.value = log.value
                            .concat(" Failed to close the database\n");
                return false;    
            }       
            log.value = log.value
                    .concat("* Ending testDBEncrypted *\n");     
            return true;
        };
        /**
         * Try opening an encrypted database with wrong secret
         */
        const wrongSecretTest = async (): Promise<boolean>  => {
            log.value = log.value
                .concat("* Starting testWrongSecret *\n"); 
            const result: any = await openDB("test-encrypted", true,
                                             "wrongsecret"); 
            if(result.result) {
                log.value = log.value
                        .concat("* testWrongSecret failed *\n");
                return false;
            }
            log.value = log.value
                    .concat("* Ending testWrongSecret *\n");     
            return true;
        };
        /**
         * Change the secret of an encrypted database
         */
        const changePasswordTest = async (): Promise<boolean>  => {
            log.value = log.value
                .concat("* Starting testChangePassword *\n");
            // open the database
            let result: any = await openDB("test-encrypted", true,
                                           "newsecret"); 
            if(!result.result) {
                log.value = log.value
                            .concat(" Failed to open the database\n");
                return false;
            }
            // select all Contacts
            result = await query("SELECT * FROM contacts;");
            if( result.values.length !== 2
                    || result.values[0].name !== "Whiteley" 
                    || result.values[1].name !== "Jones") {
                log.value = log.value
                            .concat(" Select Contacts failed\n");
                return false;   
            }
            // Close the Database
            result = await close("test-encrypted")
            if(!result.result) {
                log.value = log.value
                            .concat(" Failed to close the database\n");
                return false;    
            }       

            log.value = log.value
                    .concat("* Ending testChangePassword *\n");     
            return true;
        };
        /**
         * Open an encrypted database after having change the secret
         */
        const newPasswordTest = async (): Promise<boolean>  => {
            log.value = log.value
                .concat("* Starting testChangePassword *\n"); 
            // open the database
            let result: any = await openDB("test-encrypted",true,"secret"); 
            if(!result.result) {
                log.value = log.value
                            .concat(" Failed to open the database\n");
                return false;
            }
            result = await deleteDB("test-encrypted");
            if(!result.result) {         
                log.value = log.value
                            .concat(" Failed to delete the database\n");
                return false;
            }

            log.value = log.value
                    .concat("* Ending testChangePassword *\n");     
            return true;
        };

        // Running set of tests
        log.value = log.value
                .concat("* Starting testDatabaseEncrypted *\n"); 

        const retEncrypted: boolean = await encryptedTest();
        if(!retEncrypted) {
            log.value = log.value
                    .concat("* testDatabaseEncrypted failed*\n"); 
            log.value = log.value
            .concat("\n* The set of tests failed *\n");
        }
        const retWrongSecret: boolean = await wrongSecretTest();
        if(!retWrongSecret) {
            log.value = log.value
                    .concat("* testDatabaseEncrypted failed*\n"); 
            log.value = log.value
            .concat("\n* The set of tests failed *\n");
        }
        const retChangePassword: boolean = await changePasswordTest();
        if(!retChangePassword) {
            log.value = log.value
                    .concat("* testDatabaseEncrypted failed*\n"); 
            log.value = log.value
            .concat("\n* The set of tests failed *\n");
        }
        const retNewPassword: boolean = await newPasswordTest();
        if(!retNewPassword) {
            log.value = log.value
                    .concat("* testDatabaseEncrypted failed*\n"); 
            log.value = log.value
            .concat("\n* The set of tests failed *\n");
        }

        log.value = log.value
                    .concat("\n* The set of tests was successful *\n");
        return { log };
    },

});

</script>
