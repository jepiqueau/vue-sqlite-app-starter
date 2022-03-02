<template>
    <div id="migratedb-container">
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
import { SQLiteDBConnection, SQLiteHook } from 'vue-sqlite-hook/dist';
import { Dialog } from '@capacitor/dialog';

export default defineComponent({
    name: 'MigrateDB',
    components: {
        LoadingSpinner
    },

    setup() {
        console.log('$$$ Start MigrateDB setup $$$')
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
        const migrateDB = async (): Promise<boolean>  => {
            try {
                console.log(' Starting migrateDB')
                setLog(log.value
                    .concat("* Starting migrateDB *\n"));
                const platform = (await sqlite.getPlatform()).platform;
                // test if the cordova databases where not at the "default" directory
                // here we assume that they were stored at "Files/Databases"
                // and there are at least two databases "testcopy.db" and "testfromfile.db"
                // in that directory, that we want to migrate
                let directory =  "Files/Databases";
                let cordDbList: string[] = ["testcopy.db","testfromfile.db"];
                if(platform === "ios") directory = "Applications/Files/Databases"
                if(platform === "android" ) directory = "files/databases";  
                if(platform === 'ios' || platform === 'android') {
                    // get the database list from folder
                    const dbList = await sqlite.getMigratableDbList(directory);
                    console.log(`dbList ${JSON.stringify(dbList)}`)
                    if(dbList.values && dbList.values.length !== 4) {
                        errMess = `GetMigratableDbList failed`;
                        return false;
                    }
                    if(dbList.values && !dbList.values.includes(cordDbList[0])) {
                        errMess = `GetMigratableDbList no ${cordDbList[0]} in folder`;
                        return false;
                    }
                    if(dbList.values && !dbList.values.includes(cordDbList[1])) {
                        errMess = `GetMigratableDbList no ${cordDbList[1]} in folder`;
                        return false;
                    }
                    setLog(log.value
                        .concat("> getMigratableDbList: successful *\n"));

                    // if database exist add suffix and move them to the right folder
                    await sqlite.addSQLiteSuffix(directory, cordDbList);

                    // check if database "testcopy" exists
                    let result = await sqlite.isDatabase(cordDbList[0]);
                    if(!result.result) {
                        errMess = `Database ${cordDbList[0]} does not exist`;
                        return false;
                    }
                    // check if database "testfromfile" exists
                    result = await sqlite.isDatabase(cordDbList[1]);
                    if(!result.result) {
                        errMess = `Database ${cordDbList[1]} does not exist`;
                        return false;
                    }
                    setLog(log.value
                        .concat("> addSQLiteSuffix: successful *\n"));

                    // ************************************************
                    // Query the databases
                    // ************************************************

                    // create the connection to the database cordDbList[0]
                    const db: SQLiteDBConnection = await sqlite
                                        .createConnection(cordDbList[0], false,
                                                        "no-encryption", 1);
                    if(db === null) {
                        errMess = `CreateConnection ${cordDbList[0]} failed`;
                        return false;
                    }
                    // open db testcopy
                    await db.open();
                    setLog(log.value
                        .concat(`> open: db ${cordDbList[0]} opens successfully *\n`));

                    // check if the table "users" exists
                    result = await db.isTable("users");
                    if(!result.result) {
                        errMess = `Table 'users' does not exist in ${cordDbList[0]}`;
                        return false;
                    }

                    // check if the table "messages" exists
                    result = await db.isTable("messages");
                    if(!result.result) {
                        errMess = `Table 'messages' does not exist in ${cordDbList[0]}`;
                        return false;
                    }

                    // check if the table "images" exists
                    result = await db.isTable("images");
                    if(!result.result) {
                        errMess = `Table 'images' does not exist in ${cordDbList[0]}`;
                        return false;
                    }                    // 
                    // select all users in db
                    const users  = (await db.query("SELECT * FROM users;")).values;
                    let mUsers: any;
                    if(users) mUsers = users
                    if(mUsers.length !== 7) {
                        errMess = `Query Users failed in ${cordDbList[0]}`;
                        return false;
                    }
                    if(mUsers[0].name !== "Whiteley"
                            || mUsers[1].name !== "Jones"
                            || mUsers[2].name !== "Simpson"
                            || mUsers[3].name !== "Brown"
                            || mUsers[4].name !== "Jackson"
                            || mUsers[5].name !== "Kennedy"
                            || mUsers[6].name !== "Bush") {
                        errMess = `Query Users failed in ${cordDbList[0]}`;
                        return false;
                    }
                    setLog(log.value
                        .concat(`> query: users in db ${cordDbList[0]} successful *\n`));
 
                    // create the connection to the database cordDbList[1]
                    const db1: SQLiteDBConnection = await sqlite
                                        .createConnection(cordDbList[1], false,
                                                        "no-encryption", 1);
                    if(db1 === null) {
                        errMess = `CreateConnection ${cordDbList[1]} failed`;
                        return false;
                    }
                    // open db testcopy
                    await db1.open();
                    setLog(log.value
                        .concat(`> open: db ${cordDbList[1]} opens successfully *\n`));
                    // check if the table "users" exists
                    result = await db1.isTable("users");
                    if(!result.result) {
                        errMess = `Table 'users' does not exist in ${cordDbList[1]}`;
                        return false;
                    }
                    // select all users in db1
                    const users1  = (await db1.query("SELECT * FROM users;")).values;
                    let mUsers1: any;
                    if(users1) mUsers1 = users1
                    if(mUsers1.length !== 7) {
                        errMess = `Query Users failed in ${cordDbList[1]}`;
                        return false;
                    }
                    if(mUsers1[0].name !== "Whiteley"
                            || mUsers1[1].name !== "Jones"
                            || mUsers1[2].name !== "Simpson"
                            || mUsers1[3].name !== "Brown"
                            || mUsers1[4].name !== "Jackson"
                            || mUsers1[5].name !== "Kennedy"
                            || mUsers1[6].name !== "Bush") {
                        errMess = `Query Users failed in ${cordDbList[1]}`;
                        return false;
                    }
                    setLog(log.value
                        .concat(`> query: users in db ${cordDbList[1]} successful *\n`));

                    // delete old databases
                    await sqlite.deleteOldDatabases(directory, cordDbList);
                    const oldDbList = (await sqlite.getMigratableDbList(directory)).values;
                    if(oldDbList && oldDbList.length !== 2) {
                        errMess = "GetMigratableDbList failed after deleteOldDatabases";
                        return false;
                    }
                    setLog(log.value
                        .concat(`> deleteOldDatabases: successful *\n`));
                    // close the connection "testcopy"
                    await sqlite.closeConnection(cordDbList[0]); 
                    // close the connection "testfromfile"
                    await sqlite.closeConnection(cordDbList[1]); 
                    setLog(log.value
                        .concat(`> closeConnection: successful *\n`));

                } else {
                   console.log(`Not available on ${platform} platform`);
                }                    
                return true;
            } catch (err: any) {
                errMess = err.message ? `${err.message}` : err;
                return false;
            }
        };
        
        onMounted(async () => {
            // Running the test
            console.log('$$$ Start MigrateDB on Mounted $$$')
            const retMigrate: boolean = await migrateDB();
            console.log(`retMigrate ${retMigrate}`);
            setShowSpinner(false);
            if(!retMigrate) {
                setLog(log.value
                    .concat("* MigrateDB failed *\n"));
                setLog(log.value
                        .concat("\n* The set of tests failed *\n"));
                await showAlert(errMess);
            } else {
                setLog(log.value
                    .concat("\n* The set of tests was successful *\n"));
            }
            console.log('$$$ End MigrateDB on Mounted $$$')

        });
        console.log('$$$ End MigrateDB setup $$$')

        return { log, showSpinner, errMess };
    },
});
</script>