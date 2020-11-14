<template>
    <div id="from-to-json-container">
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
import { useSQLite, isPermissions } from 'vue-sqlite-hook/dist';
import { dataToImport, partialImport1, tableTwoImports,
         dataTwoImports } from '../utils/utils-import-from-json';
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { Capacitor } from '@capacitor/core';

export default defineComponent({
    name: 'FromToJsonTest',
    components: {
        LoadingSpinner
    },
    async setup() {
        const [showSpinner, setShowSpinner] = useState(true);
        const [log, setLog] = useState("");
        const { openDB, close, deleteDB, isDBExists, importFromJson,
                createSyncTable, exportToJson,
                isJsonValid, requestPermissions} = useSQLite();
        const platform = Capacitor.getPlatform();


        // Import From Json Test
        const importJsonTest = async (): Promise<boolean>  => {
            setLog(log.value
                .concat("* Starting testDatabaseFromJson *\n")); 
            if(platform === "android") {
                const perm: any = await requestPermissions();
                if(!perm.result) {
                    setLog(log.value
                            .concat(" Failed Permissions not granted\n"));
                    return false;
                }
            }
            setLog(log.value
                    .concat(` isPermissions ${isPermissions.granted} \n`));

            // Test if "db-from-json" exists and 
            // delete it for multiple test runs
            let result: any = await isDBExists("db-from-json"); 
            if(result.result) {
                // open the DB
                const resOpen: any = await openDB("db-from-json"); 
                if(resOpen.result) {
                    await deleteDB("db-from-json");
                }
            }
            // Full importFromJson
            result = await importFromJson(
                                    JSON.stringify(dataToImport));    
            if(result.changes.changes === -1 ) {
                setLog(log.value
                            .concat(" Import Full failed\n"));
                return false;
            }
            // Partial ImportFromJson
            result = await importFromJson(
                                    JSON.stringify(partialImport1));
            if(result.changes.changes === -1 ) {
                setLog(log.value
                        .concat(" Import Partial 1 failed\n"));
                return false;
            }
            // create the async table
            result = await openDB("db-from-json"); 
            if(!result.result) {
                setLog(log.value
                            .concat(" Import openDB failed\n"));
                return false;
            }
            result = await createSyncTable();
            if(result.changes.changes === 0 ) {
                setLog(log.value
                        .concat(" Create Sync Table failed\n"));
                return false;
            }
            // Close the Database
            result = await close("db-from-json")
            if(!result.result) {
                setLog(log.value
                    .concat(" Failed to close the database\n"));
                return false;    
            }       
            setLog(log.value
                    .concat("* Ending testDatabaseFromJson *\n"));     
            return true;
        };
        // Test Full Export To Json
        const fullExportJsonTest = async (): Promise<boolean>  => {
            setLog(log.value
            .concat("* Starting testDatabaseFullExportJson *\n"));
            // Open the database
            let result: any = await openDB("db-from-json"); 
            if(!result.result) {
                setLog(log.value
                            .concat(" Export openDB failed\n"));
                return false;
            }
            result = await exportToJson("full");    
            if (Object.keys(result.export).length === 0) {
                setLog(log.value
                    .concat(" Return Json Object has no keys\n"));
                return false;
            } 
            const jsObj: string = JSON.stringify(result.export); 
            result = await isJsonValid(jsObj);
            if(!result.result) {
                setLog(log.value
                    .concat(" Return Json Object not valid\n"));
                return false;
            }                 
            setLog(log.value
                .concat("* Ending testDatabaseFullExportJson *\n"));     
            return true;
        };
        // Test Two successives imports
        const twoImportsTest = async (): Promise<boolean>  => {
            setLog(log.value
                .concat("* Starting testDatabaseTwoImports *\n"));
            // first import tables definition
            let result: any = await importFromJson(
                                JSON.stringify(tableTwoImports));
            if(result.changes.changes === -1 ) {
                setLog(log.value
                            .concat(" First import failed\n"));
                return false;    
            }
            // second import data
            result = await importFromJson(
                                JSON.stringify(dataTwoImports));
            if(result.changes.changes === -1 ) {
                setLog(log.value
                            .concat(" Second import failed\n"));
                return false;    
            }
            setLog(log.value
                .concat("* Ending testDatabaseTwoImports *\n"));     
            return true;
        };

        onMounted(async () => {

            // Running set of tests
            setLog(log.value
                    .concat("* Starting testDatabaseFromToJson *\n")); 

            const retimportJson: boolean = await importJsonTest();
            if(!retimportJson) {
                setLog(log.value
                        .concat("* testDatabaseFromToJson failed*\n")); 
                setLog(log.value
                        .concat("\n* The set of tests failed *\n"));
                setShowSpinner(false);
                return { log, showSpinner };
            }
            const retfullexportJson: boolean = await fullExportJsonTest();
            if(!retfullexportJson) {
                setLog(log.value
                        .concat("* testDatabaseFromToJson failed*\n")); 
                setLog(log.value
                        .concat("\n* The set of tests failed *\n"));
                setShowSpinner(false);
                return { log, showSpinner };
            }
            const rettwoimports: boolean = await twoImportsTest();
            if(!rettwoimports) {
                setLog(log.value
                        .concat("* testDatabaseFromToJson failed*\n")); 
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
