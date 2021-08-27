<template>
    <div id="json-listeners-container">
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
import { createSchema112, firstTeachers, partialImport112} from '@/utils/utils-import-from-json';
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { deleteDatabase } from '@/utils/utils-delete-db';
import { Dialog } from '@capacitor/dialog';

export default defineComponent({
    name: 'JsonListenersTest',
    components: {
        LoadingSpinner
    },
    setup() {
        const [showSpinner, setShowSpinner] = useState(true);
        const [log, setLog] = useState("");
        const app = getCurrentInstance()
        const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;
        app?.appContext.config.globalProperties.$isJsonListeners.setJsonListeners(true);
        let jsonObj: any;
        const showAlert = async (message: string) => {
            await Dialog.alert({
            title: 'Error Dialog',
            message: message,
            });
        };
        const setDatabase = async (): Promise<void>  => { 
            /**
             * initial set-up of the database 'testListeners'
             */
            try {
                // test the plugin with echo
                const res: any = await sqlite.echo("Hello from echo");
                if(res.value !== "Hello from echo") return Promise.reject("failed in echo");
                setLog(log.value.concat("> Echo successful\n"));
                setLog(log.value.concat("* Starting setDatabase *\n"));
                // initialize the connection
                let db: SQLiteDBConnection;
                if((await sqlite.isConnection("testListeners")).result) {
                    db = await sqlite.retrieveConnection("testListeners");
                } else {
                    db = await sqlite
                    .createConnection("testListeners", false, "no-encryption", 1);
                }
                setLog(log.value.concat("> CreateConnection successful\n"));

                // check if the databases exist 
                // and delete it for multiple successive tests
                await deleteDatabase(db);

                // open db testNew
                await db.open();

                // create tables in db
                let ret: any = await db.execute(createSchema112,false);
                if (ret.changes.changes < 0) {
                    return Promise.reject("Execute 1: createSchema failed");
                }

                // create synchronization table 
                ret = await db.createSyncTable();
                console.log('$$$ createSyncTable ret.changes.changes in db ' + ret.changes.changes)
                
                // set the synchronization date
                const syncDate = "2020-11-25T08:30:25.000Z";
                await db.setSyncDate(syncDate);
                setLog(log.value.concat("> CreateSchema successful\n"));

                // add first teachers in db
                ret = await db.execute(firstTeachers, false);
                if (ret.changes.changes !== 20) {
                    return Promise.reject("Execute 2: teachers failed");
                }
                // select all teachers in db
                ret = await db.query("SELECT * FROM teachers;");
                if(ret.values.length !== 20) {
                    return Promise.reject("Query 1: teachers failed");
                }
                // update age with statement and values              
                let sqlcmd = "UPDATE teachers SET age = ?, office = ? WHERE id = ?;";
                let values: Array<any>  = [41,"ABC",1];
                ret = await db.run(sqlcmd, values, false);
                console.log(`xxxx changes ${ret.changes.changes}`);
                values = [23,"AEF",2];
                ret = await db.run(sqlcmd, values, false);
                console.log(`xxxx changes ${ret.changes.changes}`);
                // select teachers where age > 40 in db
                sqlcmd = "SELECT name,email,age FROM teachers WHERE age > ?";
                ret = await db.query(sqlcmd,[40]);
                if(ret.values.length !== 1 || ret.values[0].name !== "Name1" ) {
                    return Promise.reject("Query 2: teachers failed");
                }
                setLog(log.value.concat("> Create Data successful\n"));
                // close the connection
                await sqlite.closeConnection("testListeners"); 
                setLog(log.value.concat("> closeConnection successful\n"));
                setLog(log.value.concat("* Ending setDatabase *\n"));
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
                setLog(log.value.concat("* Starting jsonImportPartialTest *\n"));
                let res: any = await sqlite.isJsonValid(JSON.stringify(partialImport112));
                if(!res.result) return Promise.reject("isJsonValid Partial is returning false ");
                setLog(log.value.concat("> isJsonValid successful\n"));
                // partial import
                res = await sqlite.importFromJson(JSON.stringify(partialImport112));
                if(res.changes.changes === -1 ) return Promise.reject("importFromJson Partial changes < 0 ");
                setLog(log.value.concat("> importFromJson successful\n"));
                // create a connection for "testListeners"
                const db: SQLiteDBConnection = await sqlite.createConnection("testListeners", false, "no-encryption", 1);
                setLog(log.value.concat("> createConnection " +
                                            " 'testListeners' successful\n"));
                // open db "testListeners"
                await db.open();
                setLog(log.value.concat("> open " +
                                            " 'testListeners' successful\n"));
                // select all users in db
                const sqlcmd = "SELECT * FROM teachers where office IS NULL;";

                res = await db.query(sqlcmd);
                if(res.values.length !== 31) {
                    return Promise.reject("Query 3: Teachers failed");
                }
                setLog(log.value.concat("> Office is Null successful\n"));

                setLog(log.value.concat("* Ending jsonImportPartialTest *\n"));
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
                setLog(log.value.concat("* Starting jsonExportFullTest *\n"));
                // retrieve the connection
                const db = await sqlite.retrieveConnection("testListeners");
                // export to json full
                jsonObj = await db.exportToJson('full');
                // test Json object validity
                const res: any = await sqlite.isJsonValid(JSON.stringify(jsonObj.export));
                if(!res.result) {
                    setLog(log.value.concat(`> isJsonValid ${res.message}\n`));
                    return Promise.reject("IsJsonValid export 'full' failed")
                }
                if( jsonObj.export.database !== "testListeners" || jsonObj.export.version !== 1 
                    || jsonObj.export.mode !== "full" || jsonObj.export.tables.length !== 2) {
                        return Promise.reject("Export Json failed");
                }

                setLog(log.value.concat("> Export 'full' successful\n"));    
                setLog(log.value.concat("* Ending jsonExportFullTest \n"));
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(err.message);
            }
        }
        const jsonImportFullTest = async (): Promise<void>  => {
            /**
             * testFullImportFromJson
             */
            try {
                setLog(log.value.concat("* Starting jsonImportFullTest\n"));
                jsonObj.export.database = "testListenersImported";

                // test import from Json Object
                let res: any = await sqlite.importFromJson(JSON.stringify(jsonObj.export)); 
                if(res.changes.changes === -1 ) return Promise.reject("ImportFromJson 'full' failed");
                setLog(log.value.concat("> importFromJson successful\n"));

                // create a connection for "testListenersImported"
                const db: SQLiteDBConnection = await sqlite.createConnection("testListenersImported", false, "no-encryption", 1);
                setLog(log.value.concat("> createConnection " +
                                            " 'testListenersImported' successful\n"));
                // open db "testListenersImported"
                await db.open();
                setLog(log.value.concat("> open " +
                                            " 'testListenersImported' successful\n"));
                // create synchronization table 
                res = await db.createSyncTable();
                if (res.changes.changes < 0) return Promise.reject("createSyncTable changes < 0 ");
                setLog(log.value.concat("> createSyncTable " +
                                            " 'testListenersImported' successful\n"));
                // get the synchronization date
                res = await db.getSyncDate();
                if(res.syncDate === 0) return Promise.reject("getSyncDate return 0 ");
                setLog(log.value.concat("> getSyncDate " +
                                            " 'testListenersImported' successful\n"));
                // select all teachers in db
                res = await db.query("SELECT * FROM teachers;");
                if(res.values.length !== 40) {
                    return Promise.reject("Query 4: Teachers failed");
                }
                // select all classes in db
                res = await db.query("SELECT * FROM classes;");
                if(res.values.length !== 12) {
                    return Promise.reject("Query 5: Classes failed");
                }
                setLog(log.value.concat("* Ending jsonImportFullTest *\n"));
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(err.message);
            }

        }
        const checkConsistencyTest = async (): Promise<void>  => {
            /**
             * testCheckConnectionsConsistency
             */
            try {
                setLog(log.value.concat("* Starting checkConsistencyTest\n"));
                const ret: any = await sqlite.checkConnectionsConsistency();
                console.log(`$$$ checkConnectionsConsistency ${ret.result}`)
                if(!ret.result) {
                    console.log("You must redefined your connections")
                }
                setLog(log.value.concat("> checkConnectionsConsistency successful\n"));
                let result: any = await sqlite.isConnection("testListeners");
                if(result.result) {
                    // close the connection testListeners
                    await sqlite.closeConnection("testListeners"); 
                }    

                result = await sqlite.isConnection("testListenersImported");
                if(result.result) {
                    // close the connection testListenersImported
                    await sqlite.closeConnection("testListenersImported");      
                }    
                setLog(log.value.concat("> closeConnections successful\n"));

                setLog(log.value.concat("* Ending jsonImportFullTest *\n"));
                return Promise.resolve();
            } catch (err) {
                return Promise.reject(err.message);
            }
        }
        onMounted(async () => {
            // Running the test
            setLog(log.value
                .concat("* Starting testDatabaseJsonListeners *\n"));
            try {
                await setDatabase();
                await jsonImportPartialTest();
                await jsonExportFullTest();
                await jsonImportFullTest();
                await checkConsistencyTest();
                app?.appContext.config.globalProperties.$isJsonListeners.setJsonListeners(false);
                setShowSpinner(false);
                setLog(log.value
                    .concat("\n* The set of tests was successful *\n"));
            }
            catch (err) {
                app?.appContext.config.globalProperties.$isJsonListeners.setJsonListeners(false);
                setShowSpinner(false);
                setLog(log.value
                    .concat(`> Error: ${err} \n`));
                setLog(log.value
                    .concat("* testDatabaseJsonListeners failed *\n"));
                setLog(log.value
                        .concat("\n* The set of tests failed *\n"));
                await showAlert(err);

            }
        });
        return { log, showSpinner };
    },
});
</script>