<template>
    <div id="json-importexport-container">
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
import { defineComponent, onMounted, getCurrentInstance } from 'vue';
import { dataToImport, partialImport1 } from '@/utils/utils-import-from-json';
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { deleteDatabase } from '@/utils/utils-delete-db';
import { Dialog } from '@capacitor/dialog';

export default defineComponent({
    name: 'JsonImportExportTest',
    components: {
        LoadingSpinner
    },
    async setup() {
        const [showSpinner, setShowSpinner] = useState(true);
        const [log, setLog] = useState("");
        const app = getCurrentInstance()
        const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;
        const showAlert = async (message: string) => {
            await Dialog.alert({
            title: 'Error Dialog',
            message: message,
            });
        };
        const jsonImportFullTest = async (): Promise<void>  => {
            /**
             * testFullImportFromJson
             */
            try {
                // test the plugin with echo
                let res: any = await sqlite.echo("Hello from echo");
                if(res.value !== "Hello from echo") return Promise.reject("failed in echo");
                setLog(log.value.concat("> Echo successful\n"));
                setLog(log.value.concat("* Starting testFullImportFromJson *\n"));
                // test Json object validity
                res = await sqlite.isJsonValid(JSON.stringify(dataToImport));
                if(!res.result) return Promise.reject("isJsonValid is returning false");
                setLog(log.value.concat("> isJsonValid successful\n"));

                // test import from Json Object
                res = await sqlite.importFromJson(JSON.stringify(dataToImport)); 
                if(res.changes.changes === -1 ) return Promise.reject("importFromJson changes < 0");
                setLog(log.value.concat("> importFromJson successful\n"));

                // create a connection for "db-from-json"
                const db: SQLiteDBConnection = await sqlite.createConnection("db-from-json", false, "no-encryption", 1);
                setLog(log.value.concat("> createConnection " +
                                            " 'db-from-json' successful\n"));
                // open db "db-from-json"
                await db.open();
                setLog(log.value.concat("> open " +
                                            " 'db-from-json' successful\n"));
                // create synchronization table 
                res = await db.createSyncTable();
                if (res.changes.changes < 0) return Promise.reject("createSyncTable changes < 0 ");
                setLog(log.value.concat("> createSyncTable " +
                                            " 'db-from-json' successful\n"));
                // get the synchronization date
                res = await db.getSyncDate();
                if(res.syncDate === 0) return Promise.reject("getSyncDate return 0 ");
                setLog(log.value.concat("> getSyncDate " +
                                            " 'db-from-json' successful\n"));
                // select all users in db
                res = await db.query("SELECT * FROM users;");
                if(res.values.length !== 4 || 
                            res.values[0].name !== "Whiteley" ||
                            res.values[1].name !== "Jones" ||
                            res.values[2].name !== "Simpson" ||
                            res.values[3].name !== "Brown"  ) {
                    return Promise.reject("Query users not returning 4 values");
                }
                // close the connection
                await sqlite.closeConnection("db-from-json"); 
                setLog(log.value.concat("> closeConnection successful\n"));
                setLog(log.value.concat("* Ending testFullImportFromJson *\n"));
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(err.message);
            }

        }
        const jsonImportPartialTest = async (): Promise<void>  => {
            /**
             * testPartialImportFromJson
             */
            try {
                setLog(log.value.concat("* Starting testPartialImportFromJson *\n"));
                let res: any = await sqlite.isJsonValid(JSON.stringify(partialImport1));
                if(!res.result) return Promise.reject("isJsonValid Partial is returning false ");
                setLog(log.value.concat("> isJsonValid successful\n"));
                // partial import
                res = await sqlite.importFromJson(JSON.stringify(partialImport1));
                if(res.changes.changes === -1 ) return Promise.reject("importFromJson Partial changes < 0 ");
                setLog(log.value.concat("> importFromJson successful\n"));
                // create a connection for "db-from-json"
                const db: SQLiteDBConnection = await sqlite.createConnection("db-from-json", false, "no-encryption", 1);
                setLog(log.value.concat("> createConnection " +
                                            " 'db-from-json' successful\n"));
                // open db "db-from-json"
                await db.open();
                setLog(log.value.concat("> open " +
                                            " 'db-from-json' successful\n"));
                // select all users in db
                res = await db.query("SELECT * FROM users;");
                if(res.values.length !== 6 || 
                            res.values[0].name !== "Whiteley" ||
                            res.values[1].name !== "Jones" ||
                            res.values[2].name !== "Simpson" ||
                            res.values[3].name !== "Brown" ||
                            res.values[4].name !== "Addington" ||
                            res.values[5].name !== "Bannister" ) {
                    return Promise.reject("Query users not returning 6 values");
                }
                setLog(log.value.concat("> query " +
                                            " 'users' successful\n"));

                // select all messages in db
                res = await db.query("SELECT * FROM messages;");
                if(res.values.length !== 4|| 
                            res.values[0].title !== "test post 1" ||
                            res.values[1].title !== "test post 2" ||
                            res.values[2].title !== "test post 3" ||
                            res.values[3].title !== "test post 4" ) {
                    return Promise.reject("Query messages not returning 4 values");
                }
                setLog(log.value.concat("> query " +
                                            " 'messages' successful\n"));

                // select all images in db
                res = await db.query("SELECT * FROM images;");
                if(res.values.length !== 2 || 
                            res.values[0].name !== "feather" ||
                            res.values[1].name !== "meowth" ) {
                    return Promise.reject("Query images not returning 2 values");
                }
                setLog(log.value.concat("> query " +
                                        " 'images' successful\n"));

                // close the connection
                await sqlite.closeConnection("db-from-json"); 
                setLog(log.value.concat("> closeConnection successful\n"));
                setLog(log.value.concat("* Ending testPartialImportFromJson *\n"));
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(err.message);
            }
        }
        const jsonExportFullTest = async (): Promise<void>  => {
            /**
             * testFullExportToJson
             */
            try {
                setLog(log.value.concat("* Starting testFullExportToJson *\n"));
                // create a connection for "db-from-json"
                const db: SQLiteDBConnection = await sqlite.createConnection("db-from-json", false, "no-encryption", 1);
                setLog(log.value.concat("> createConnection " +
                                            " 'db-from-json' successful\n"));
                // open db "db-from-json"
                await db.open();
                setLog(log.value.concat("> open " +
                                            " 'db-from-json' successful\n"));
                // export to json full
                const jsonObj: any = await db.exportToJson('full');
                // test Json object validity
                const res: any = await sqlite.isJsonValid(JSON.stringify(jsonObj.export));
                if(!res.result) {
                    setLog(log.value.concat(`> isJsonValid ${res.message}\n`));
                    return Promise.reject("isJsonValid Full returns false")
                }
                setLog(log.value.concat("> Export Json Object is valid\n"));    
                // close the connection
                await sqlite.closeConnection("db-from-json"); 
                setLog(log.value.concat("> closeConnection successful\n"));
                setLog(log.value.concat("* Ending testFullExportToJson \n"));
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(err.message);
            }
        }
        const jsonExportPartialTest = async (): Promise<void>  => {
            /**
             * testPartialExportToJson
             */
            try {
                setLog(log.value.concat("* Starting testPartialExportToJson *\n"));
                // create a connection for "db-from-json"
                const db: SQLiteDBConnection = await sqlite.createConnection("db-from-json", false, "no-encryption", 1);
                 setLog(log.value.concat("> createConnection " +
                                            " 'db-from-json' successful\n"));
                // open db "db-from-json"
                await db.open();
                setLog(log.value.concat("> open " +
                                            " 'db-from-json' successful\n"));
                // Set the synchronization date
                await db.setSyncDate("2020-05-20T18:40:00.000Z");
                setLog(log.value.concat("> setSyncDate successful\n"));    
                // export to json partial
                const jsonObj: any = await db.exportToJson('partial');
                // test Json object validity
                const res: any = await sqlite.isJsonValid(JSON.stringify(jsonObj.export));
                if(!res.result) {
                    setLog(log.value.concat(`> isJsonValid ${res.message}\n`));
                return Promise.reject("isJsonValid Export Partial returns false");
                }
                setLog(log.value.concat("> Export Partial Json Object is valid\n"));    
                if(jsonObj.export.tables.length !== 3 || jsonObj.export.tables[0].name !== 'users'
                        || jsonObj.export.tables[1].name !== 'messages' || jsonObj.export.tables[2].name !== 'images' 
                        || jsonObj.export.tables[0].values.length !== 4 || jsonObj.export.tables[1].values.length !== 3
                        || jsonObj.export.tables[2].values.length !== 1) {
                    return Promise.reject("Export Partial tables.length != 3");
                }
                setLog(log.value.concat("> Export Json Object successful\n")); 
                // Delete "db-from-json" for multiple successive tests
                await deleteDatabase(db);
                setLog(log.value.concat("> deleteDatabase successful\n"));
    
                // close the connection
                await sqlite.closeConnection("db-from-json"); 
                setLog(log.value.concat("> closeConnection successful\n"));
                setLog(log.value.concat("* Ending testPartialExportToJson \n"));
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(err.message);
            }
        }

        onMounted(async () => {
            // Running the test
            setLog(log.value
                .concat("* Starting testDatabaseJsonImportExport *\n"));
            try {
                await jsonImportFullTest();
                await jsonImportPartialTest();
                await jsonExportFullTest();
                await jsonExportPartialTest();
                setShowSpinner(false);
                setLog(log.value
                    .concat("\n* The set of tests was successful *\n"));
            }
            catch (err) {
                setShowSpinner(false);
                setLog(log.value
                    .concat(`> Error: ${err} \n`));
                setLog(log.value
                    .concat("* testDatabaseJsonImportExport failed *\n"));
                setLog(log.value
                        .concat("\n* The set of tests failed *\n"));
                await showAlert(err);

            }
        });
        return { log, showSpinner };
    },
});
</script>