<template>
    <div id="existing-conn-container">
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
import { setUsers } from '@/utils/utils-db-no-encryption';
import { createSchemaMessages, setMessages } from '@/utils/utils-db-encrypted-set';
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import { Dialog } from '@capacitor/dialog';
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';

export default defineComponent({
    name: 'ExistingConnTest',
    components: {
        LoadingSpinner
    },
    setup() {
        const [showSpinner, setShowSpinner] = useState(true);
        const [log, setLog] = useState("");
        const app = getCurrentInstance()
        const sqlite: SQLiteHook = app?.appContext.config.globalProperties.$sqlite;
        let errMess = "";
        onMounted(async () => {
            const showAlert = async (message: string) => {
                await Dialog.alert({
                title: 'Error Dialog',
                message: message,
                });
            };
            const existingConnTest = async (): Promise<boolean>  => {
    
                setLog(log.value
                    .concat("* Starting testDatabaseExistingConn *\n"));
                try {
                    // test the plugin with echo
                    const res: any = await sqlite.echo("Hello from echo");
                    if(res.value !== "Hello from echo") return false;
                    setLog(log.value.concat("> Echo successful\n"));
                    const db: SQLiteDBConnection = await sqlite.retrieveConnection("testNew")
                    const db1: SQLiteDBConnection = await sqlite.retrieveConnection("testSet")

                    // load setUsers in db
                    let ret: any = await db.executeSet(setUsers);
                    console.log('$$$ ret.changes.changes in db ' + ret.changes.changes)
                    if (ret.changes.changes !== 3) {
                        errMess = `ExecuteSet setUsers changes != 3`;
                        return false;
                    }
                    // select all users in db
                    ret = await db.query("SELECT * FROM users;");
                    if(ret.values.length !== 7 || ret.values[0].name !== "Whiteley" ||
                                                ret.values[1].name !== "Jones" ||
                                                ret.values[2].name !== "Simpson" ||
                                                ret.values[3].name !== "Brown" ||
                                                ret.values[4].name !== "Jackson" ||
                                                ret.values[5].name !== "Kennedy" ||
                                                ret.values[6].name !== "Bush"
                                                ) {
                        errMess = `Query users not returning 7 values`;
                        return false;
                    }
    
                    // create table messages in db1
                    ret = await db1.execute(createSchemaMessages);
                    console.log('$$$ ret.changes.changes in db1 ' + ret.changes.changes)
                    if (ret.changes.changes < 0) {
                        errMess = `Execute createSchemaMessages changes < 0`;
                        return false;
                    }

                    // load setMessages in db1
                    ret = await db1.executeSet(setMessages);
                    console.log('$$$ ret.changes.changes in db1 ' + ret.changes.changes)
                    if (ret.changes.changes !== 3) {
                        errMess = `ExecuteSet setMessages changes < 0`;
                        return false;
                    }
                    // select all users in db
                    ret = await db1.query("SELECT * FROM messages;");
                    if(ret.values.length !== 3 || ret.values[0].title !== "message 1" ||
                                                ret.values[1].title !== "message 2" ||
                                                ret.values[2].title !== "message 3"
                                                ) {
                        errMess = `Query messages not returning 3 values`;
                        return false;
                    }

                    // test retrieve all connections
                    const retDict: Map<string, any> = await 
                                        sqlite.retrieveAllConnections();
                    if(retDict.size !== 2) {
                        errMess = `retrieveAllConnections not returning 2 values`;
                        return false;
                    }
                    if(!retDict.has("RW_testNew") || retDict.get("RW_testNew") !== db) {
                        errMess = `retrieveAllConnections not returning "RW_testNew"`;
                        return false;
                    }
                    if(!retDict.has("RW_testSet") || retDict.get("RW_testSet") !== db1) {
                        errMess = `retrieveAllConnections not returning "RW_testSet"`;
                        return false;
                    }
                    // close all connections
                    await sqlite.closeAllConnections();
                            
                    app?.appContext.config.globalProperties.$existingConn.setExistConn(false);                   
                    setLog(log.value
                        .concat("* Ending testDatabaseExistingConn *\n"));
                    return true;
                } catch (err: any) {
                    errMess = err.message ? `${err.message}` : err;
                    return false;
                }
            }
            // Running the test
            const retExistConn: boolean = await existingConnTest();
            setShowSpinner(false);
            if(!retExistConn) {
                setLog(log.value
                    .concat("* testDatabaseExistingConnfailed *\n"));
                setLog(log.value
                        .concat("\n* The set of tests failed *\n"));
                await showAlert(errMess);
            } else {
                setLog(log.value
                    .concat("\n* The set of tests was successful *\n"));
            }
        });
        return { log, showSpinner, errMess };
    },
});
</script>