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
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, onMounted, getCurrentInstance } from 'vue';
import { setUsers } from '@/utils/utils-db-no-encryption';
import { createSchemaMessages, setMessages } from '@/utils/utils-db-encrypted-set';
import { useState } from '@/composables/state';
import LoadingSpinner from '@/components/LoadingSpinner.vue'
export default defineComponent({
    name: 'ExistingConnTest',
    components: {
        LoadingSpinner
    },
    async setup() {
        const [showSpinner, setShowSpinner] = useState(true);
        const [log, setLog] = useState("");
        const app = getCurrentInstance()
        const sqlite = app?.appContext.config.globalProperties.$sqlite;
        const existingConnTest = async (): Promise<boolean>  => {
 
            setLog(log.value
                .concat("* Starting testDatabaseExistingConn *\n"));
            // test the plugin with echo
            let res: any = await sqlite.echo("Hello from echo");
            if(res.value !== "Hello from echo") return false;
            setLog(log.value.concat("> Echo successful\n"));
            const db = await sqlite.retrieveConnection("testNew")
            const db1 = await sqlite.retrieveConnection("testSet")

            // load setUsers in db
            var ret: any = await db.executeSet(setUsers);
            console.log('$$$ ret.changes.changes in db ' + ret.changes.changes)
            if (ret.changes.changes !== 3) {
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
            return false;
            }
  
            // create table messages in db1
            ret = await db1.execute(createSchemaMessages);
            console.log('$$$ ret.changes.changes in db1 ' + ret.changes.changes)
            if (ret.changes.changes < 0) {
            return false;
            }

            // load setMessages in db1
            ret = await db1.executeSet(setMessages);
            console.log('$$$ ret.changes.changes in db1 ' + ret.changes.changes)
            if (ret.changes.changes !== 3) {
            return false;
            }
            // select all users in db
            ret = await db1.query("SELECT * FROM messages;");
            if(ret.values.length !== 3 || ret.values[0].title !== "message 1" ||
                                        ret.values[1].title !== "message 2" ||
                                        ret.values[2].title !== "message 3"
                                        ) {
            return false;
            }

            // test retrieve all connections
            var retDict: Map<string, any> = await 
                                sqlite.retrieveAllConnections();
            if(retDict.size !== 2) return false;
            if(!retDict.has("testNew") || retDict.get("testNew") !== db) {
                return false;
            }
            if(!retDict.has("testSet") || retDict.get("testSet") !== db1) {
                return false;
            }
            // close all connections
            ret = await sqlite.closeAllConnections();
                    
            app?.appContext.config.globalProperties.$existingConn.setExistConn(false);                   
            setLog(log.value
                .concat("* Ending testDatabaseExistingConn *\n"));
            return true;
        }
        onMounted(async () => {
            // Running the test
            const retExistConn: boolean = await existingConnTest();
            if(!retExistConn) {
                setLog(log.value
                    .concat("* testDatabaseExistingConnfailed *\n"));
                setLog(log.value
                        .concat("\n* The set of tests failed *\n"));
            } else {
                setLog(log.value
                    .concat("\n* The set of tests was successful *\n"));
            }
            setShowSpinner(false);
        });
        return { log, showSpinner };
    },
});
</script>