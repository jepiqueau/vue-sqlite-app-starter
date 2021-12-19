<template>
    <div id="nonconfdb-container">
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
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook';
import { Dialog } from '@capacitor/dialog';

export default defineComponent({
    name: 'NonConfDB',
    components: {
        LoadingSpinner
    },

    setup() {
        console.log('$$$ Start NonConfDB setup $$$')
        const [showSpinner, setShowSpinner] = useState(true);
        const [log, setLog] = useState("");
        const app = getCurrentInstance()
        const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;
        let errMess = "";
        const showAlert = async (message: string) => {
            await Dialog.alert({
            title: 'Error Dialog',
            message: message,
            });
        };
        const nonConfDB = async (): Promise<boolean>  => {
            try {
                console.log(' Starting nonConfDB')
                setLog(log.value
                    .concat("* Starting nonConfDB *\n"));
                const platform = (await sqlite.getPlatform()).platform;
                // Assuming non-conformed "testncbd.db" in the "directory" folder
                let directory =  "files/databases";
                if(platform === "ios") directory = "Applications/Files/Databases"
                if(platform === "android" ) directory = "files/databases";  
                if(platform === 'ios' || platform === 'android') {
                    const databasePath = (await sqlite.getNCDatabasePath(directory,"testncdb.db")).path;
                    if(databasePath !== undefined) {
                        const isNCDbExists = (await sqlite.isNCDatabase(databasePath)).result;
                        const ret = await sqlite.checkConnectionsConsistency();
                        const isConn = (await sqlite.isNCConnection(databasePath)).result;
                        let db: SQLiteDBConnection
                        if (ret.result && isConn && isNCDbExists) {
                          db = await sqlite.retrieveNCConnection(databasePath);
                        } else {
                          db = await sqlite.createNCConnection(databasePath, 1);
                        }
                        // open db testncdb.db
                        await db.open();
                        // get the database version
                        let retVer = await db.getVersion();
                        if (retVer.version !== 1) {
                            return Promise.reject(new Error("GetVersion: version failed"));
                        }
                        const isDbOpen = await db.isDBOpen();
                        if(!isDbOpen.result) {
                            return Promise.reject(new Error("IsDBOpen: database not opened"));
                        }
                        // check if the table "contacts" exists
                        const isTable = await db.isTable("contacts")
                        if(!isTable.result) {
                            return Promise.reject(new Error(`Table 'contacts' does not exist in ${databasePath}`));
                        }
                        // select all contacts in db
                        const retCts = await db.query("SELECT * FROM contacts;");
                        if(retCts !== undefined && retCts.values !== undefined) {
                            if(retCts.values.length !== 4 || 
                                    retCts.values[0].name !== "Simpson" ||
                                    retCts.values[1].name !== "Jones" ||
                                    retCts.values[2].name !== "Whiteley" ||
                                    retCts.values[3].name !== "Brown") {
                                return Promise.reject(new Error("Query Contacts failed"));
                            }
                            await sqlite.closeNCConnection(databasePath);     

                            setLog(log.value
                                .concat("> getMigratableDbList: successful *\n"));
                        } else {
                            return Promise.reject(new Error("result of Query Contacts undefined"));
                        }
                    } else {
                        return Promise.reject(new Error("databasePath undefined"));
                    }

                } else {
                    return Promise.reject(new Error(`Not available on ${platform} platform`));
                }                    
                return true;
            } catch (err) {
                errMess = `${err}`;
                return false;
            }
        };
        
        onMounted(async () => {
            // Running the test
            console.log('$$$ Start NonConfDB on Mounted $$$')
            const retNCDB: boolean = await nonConfDB ();
            console.log(`retMigrate ${retNCDB}`);
            setShowSpinner(false);
            if(!retNCDB) {
                setLog(log.value
                    .concat("* NonConfDB failed *\n"));
                setLog(log.value
                        .concat("\n* The set of tests failed *\n"));
                await showAlert(errMess);
            } else {
                setLog(log.value
                    .concat("\n* The set of tests was successful *\n"));
            }
            console.log('$$$ End NonConfDB on Mounted $$$')

        });
        console.log('$$$ End NonConfDB setup $$$')

        return { log, showSpinner, errMess };
    },
});
</script>