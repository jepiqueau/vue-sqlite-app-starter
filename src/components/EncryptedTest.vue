<template>
    <div id="encrypted-container">
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
import { createTablesEncrypted,
         createDataEncrypted } from '@/utils/utils-db-encrypted';
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { Capacitor } from '@capacitor/core';

export default defineComponent({
    name: 'EncryptedTest',
    components: {
        LoadingSpinner
    },
    async setup() {
        const [showSpinner, setShowSpinner] = useState(true);
        const [log, setLog] = useState("");
        const { openDB, close, execute, query, deleteDB} = useSQLite();

        /**
         * Test an encrypted database
         */
        const encryptedTest = async (): Promise<boolean>  => {
            setLog(log.value.concat("* Starting testDBEncrypted *\n"));
            // open the database
            let result: any = await openDB( "test-encrypted", true,
                                            "secret"); 
            if(!result.result) {
                setLog(log.value
                        .concat(" Failed to open the database\n"));
                return false;
            }
            // create tables
            result = await execute(createTablesEncrypted);
            if (result.changes.changes !== 0 && 
                                    result.changes.changes !== 1) {
                setLog(log.value
                        .concat(" createTablesEncrypted failed\n"));
                return false;
            }
            // Insert some Contacts
            result = await execute(createDataEncrypted);
            if(result.changes.changes !== 2) {
                setLog(log.value
                        .concat(" createDataEncrypted failed\n"));
                return false; 
            }
            // Select all Contacts
            result = await query("SELECT * FROM contacts;");
            if(result.values.length !== 2
                || result.values[0].name !== "Whiteley" 
                || result.values[1].name !== "Jones") {
                setLog(log.value
                        .concat(" Select Contacts failed\n"));
                return false;   
            }
            // Close the Database
            result = await close("test-encrypted")
            if(!result.result) {
                setLog(log.value
                    .concat(" Failed to close the database\n"));
                return false;    
            }       
            setLog(log.value
                    .concat("* Ending testDBEncrypted *\n"));
            return true;
        };
        /**
         * Try opening an encrypted database with wrong secret
         */
        const wrongSecretTest = async (): Promise<boolean>  => {
            setLog(log.value
                .concat("* Starting testWrongSecret *\n"));
            const result: any = await openDB("test-encrypted", true,
                                            "wrongsecret"); 
            if(result.result) {
                setLog(log.value
                        .concat("* testWrongSecret failed *\n"));
                return false;
            }
            setLog(log.value
                        .concat("* Ending testWrongSecret *\n"));
            return true;
        };
        /**
         * Change the secret of an encrypted database
         */
        const changePasswordTest = async (): Promise<boolean>  => {
            setLog(log.value
                .concat("* Starting testChangePassword *\n"));
            // open the database
            let result: any = await openDB("test-encrypted", true,
                                        "newsecret"); 
            if(!result.result) {
                setLog(log.value
                        .concat(" Failed to open the database\n"));
                return false;
            }
            // select all Contacts
            result = await query("SELECT * FROM contacts;");
            if( result.values.length !== 2
                    || result.values[0].name !== "Whiteley" 
                    || result.values[1].name !== "Jones") {
                setLog(log.value
                            .concat(" Select Contacts failed\n"));
                return false;   
            }
            // Close the Database
            result = await close("test-encrypted")
            if(!result.result) {
                setLog(log.value
                    .concat(" Failed to close the database\n"));
                return false;    
            }       
            setLog(log.value
                    .concat("* Ending testChangePassword *\n"));
            return true;
        };
        /**
         * Open an encrypted database after having change the secret
         */
        const newPasswordTest = async (): Promise<boolean>  => {
            setLog(log.value
                    .concat("* Starting testNewPassword *\n"));
            // open the database
            let result: any = await openDB("test-encrypted", true,
                                            "secret"); 
            if(!result.result) {
                setLog(log.value
                    .concat(" Failed to open the database\n"));
                return false;
            }
            result = await deleteDB("test-encrypted");
            if(!result.result) {         
                setLog(log.value
                    .concat(" Failed to delete the database\n"));
                return false;
            }
            setLog(log.value
                    .concat("* Ending testNewPassword *\n"));

            return true;
        };

        onMounted(async () => {

            // Running set of tests
            setLog(log.value
                    .concat("* Starting testDatabaseEncrypted *\n"));
            const retEncrypted: boolean = await encryptedTest();
            if(!retEncrypted) {
                setLog(log.value
                    .concat("* testDatabaseEncrypted failed*\n"));
                setLog(log.value
                    .concat("\n* The set of tests failed *\n"));
                setShowSpinner(false);
                return { log, showSpinner };
            }
            const retWrongSecret: boolean = await wrongSecretTest();
            if(!retWrongSecret) {
                setLog(log.value
                    .concat("* testDatabaseEncrypted failed*\n"));
                setLog(log.value
                    .concat("\n* The set of tests failed *\n"));
                setShowSpinner(false);
                return { log, showSpinner };
            }
            const retChangePassword: boolean = 
                                        await changePasswordTest();
            if(!retChangePassword) {
                setLog(log.value
                    .concat("* testDatabaseEncrypted failed*\n"));
                setLog(log.value
                    .concat("\n* The set of tests failed *\n"));
                setShowSpinner(false);
                return { log, showSpinner };
            }
            const retNewPassword: boolean = await newPasswordTest();
            if(!retNewPassword) {
                setLog(log.value
                    .concat("* testDatabaseEncrypted failed*\n"));
                setLog(log.value
                    .concat("\n* The set of tests failed *\n"));
                setShowSpinner(false);
                return { log, showSpinner };
            }
            setLog(log.value
                .concat("\n* The set of tests was successful *\n"));
            setShowSpinner(false);
            return { log, showSpinner };
        });
        return { log, showSpinner };
    },

});

</script>
