<template>
  <div id="upgrade-version-container">
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
import { schemaVersion1, dataVersion1, schemaVersion2,
        dataVersion2 } from '../utils/utils-update-version';
//1234567890123456789012345678901234567890123456789012345678901234567890
export default defineComponent({
    name: 'UpgradeVersionTest',
    async setup() {
        const log = ref("");
        const { openDB, execute, query, isDBExists, deleteDB,
                createSyncTable, addUpgradeStatement } = useSQLite();
         /**
         * Check if database already exists and delete it
         */
        const testIsDBExists = async(): Promise<boolean> => {
            log.value = log.value
                        .concat("* Starting testIsDBExists *\n");
            // open the database
            const result: any = await isDBExists("test-updversion"); 
            if(result.result) {
                // from previous run version = 2
                const resOpen: any = await openDB("test-updversion",
                                                 false,
                                                "no-encryption",2);  
                if(resOpen.result) {
                  const resDel: any = await deleteDB("test-updversion");
                  if(!resDel) {
                    log.value = log.value
                    .concat("* testIsDBExists: Delete DB Failed *\n");
                    return false;
                  }
                } else {
                    log.value = log.value
                        .concat("* testIsDBExists: Open DB Failed *\n");
                    return false;
                }
            }
            log.value = log.value.concat("* Ending testIsDBExists *\n");
            return true;
        };
        /**
         * Create version 1 of the database
         */
        const testVersion1 =  async (): Promise<boolean> => {
            log.value = log.value.concat("* Starting testVersion1 *\n");
            const resOpen: any = await openDB("test-updversion");  
            if(!resOpen.result) {
                log.value = log.value.concat(
                    "* testVersion1: Open DB Failed *\n");
                return false;
            }
            let result: any = await createSyncTable();
            if(result.changes.changes !== 1) {
                log.value = log.value.concat(
                    "* testVersion1: createSyncTable Failed *\n");
                return false;    
            }
            result = await execute(schemaVersion1);
            if(result.changes.changes !== 0 &&
                            result.changes.changes !== 1) {
                log.value = log.value.concat(
                    "* testVersion1: schemaVersion1 Failed *\n");
                return false;    
            }
            result = await execute(dataVersion1);
            if(result.changes.changes !== 2) {
                log.value = log.value.concat(
                    "* testVersion1: dataVersion1 Failed *\n");
                return false;    
            }
            result = await query("SELECT * FROM users;");
            if(result.values.length !== 2 ||
                        result.values[0].name !== "Whiteley" || 
                        result.values[1].name !== "Jones") {
                log.value = log.value.concat(
                    "* testVersion1: queryVersion1 Failed *\n");
                return false;    
            }
            log.value = log.value
                            .concat("* Ending testVersion1 *\n");
            return true;  
        };
        /**
         * Upgrade database to version 2
         */
        const testVersion2 =  async (): Promise<boolean> => {
            log.value = log.value.concat("* Starting testVersion2 *\n");
            // Upgrade Statement
            console.log("* Starting testVersion2 ")
            let result: any = await addUpgradeStatement(
                "test-updversion", {fromVersion: 1, toVersion: 2,
                    statement: schemaVersion2, set: dataVersion2});     
            console.log("* testVersion2: addUpgradeStatement result " + result.result)
            if(!result.result) {
                log.value = log.value.concat(
                    "* testVersion2: addUpgradeStatement Failed *\n");
                return false;    
            }
            // open the database
            result = await openDB("test-updversion", false,
                                "no-encryption",2);
            if(!result.result) {
                log.value = log.value.concat(
                            "* testVersion2: openDB Failed *\n");
                return false;
            }
            result = await query("SELECT name,country FROM users;");
            if(result.values.length !== 2 ||
                        result.values[0].name !== "Whiteley" ||
                        result.values[0].country !== "United Kingdom" || 
                        result.values[1].name !== "Jones" ||
                        result.values[1].country !== "Australia") {
                log.value = log.value.concat(
                    "* testVersion1: queryVersion2 Failed *\n");
                return false;    
            }

            log.value = log.value
                            .concat("* Ending testVersion2 *\n");
            return true;  
        };

        // Running set of tests
        log.value = log.value
                .concat("* Starting testDatabaseUpgradeVersion *\n"); 

        const retisDBExists: boolean = await testIsDBExists();
        if(!retisDBExists) {
        log.value = log.value
                    .concat("* testDatabaseUpgradeVersion failed*\n"); 
        log.value = log.value.concat("\n* The set of tests failed *\n");
        }
        const retVersion1: boolean = await testVersion1();
        if(!retVersion1) {
        log.value = log.value
                    .concat("* testDatabaseUpgradeVersion failed*\n"); 
        log.value = log.value.concat("\n* The set of tests failed *\n");
        }
        const retVersion2: boolean = await testVersion2();
        if(!retVersion2) {
        log.value = log.value
                    .concat("* testDatabaseUpgradeVersion failed*\n"); 
        log.value = log.value.concat("\n* The set of tests failed *\n");
        }

        log.value = log.value
                    .concat("\n* The set of tests was successful *\n");
        return { log };
    },

});

</script>
