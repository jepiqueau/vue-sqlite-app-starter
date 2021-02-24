import { createOccurenciesTable, createOccurenceData } from '@/components/Animals/sqlite-utils/init-db';
import { Occurence } from '@/components/Animals/model/Occurence';
import { SQLiteDBConnection } from 'vue-sqlite-hook/dist';

export const getAllOccurencies = async (sqlite: any, filter?: string): Promise<Occurence[]> => {

    let occurencies: Occurence[] = [];

    const getDBReady = async (): Promise<SQLiteDBConnection | null> => {
        let db: SQLiteDBConnection;
        let ret: any = await sqlite.isConnection("vdb");
        if(!ret.result) {
            db = await sqlite
            .createConnection("vdb", false, "no-encryption", 1); 

        } else {
            db = await sqlite.retrieveConnection("vdb");
        }
        // Check if the database is already opened
        ret = await db.isDBOpen();
        if(!ret.result) {
            // open it
            ret = await db.open();
            if (!ret.result) {
                console.log("error opening DB");
                return null;
            }    
        }
        return db;

    }
    const initVDB = async () => {
        const db = await getDBReady();
        if (db == null) return false;
        // create tables in db
        let ret: any = await db.execute(createOccurenciesTable);
        if (ret.changes.changes < 0) {
            return false;
        }
        // add occurencies in db
        let values: Array<any> = [1, 1, 10, 20, new Date().toISOString() ];

        ret = await db.run(createOccurenceData, values);
        if (ret.changes.changes < 0) {
            return false;
        }
        console.log(`$$$ lastId first run: ${ret.changes.lastId}`)
        values = [5, 2, 30, 50, new Date().toISOString() ];
        ret = await db.run(createOccurenceData, values);
        if (ret.changes.changes < 0) {
            return false;
        }
        console.log(`$$$ lastId second run: ${ret.changes.lastId}`)
        return true;
    }
   
    const loadOccurencies = async () => {
        const db = await getDBReady();
        if (db == null) return ;
        let ret: any = await db.isTable("occurencies");
        if(!ret.result) {
            await initVDB();
            ret = await db.query("SELECT * FROM occurencies");
            if (ret.values.length === 2) { 
                occurencies = ret.values;
                    return;
            } else {
                console.log("!!! in loadOccurencies error loading occurencies !!!");
                return;
            }
        } else {
            ret = await db.query("SELECT * FROM aoccurencies");
            occurencies = ret.values;
            return;
        }
    }

    await loadOccurencies();
    return Promise.resolve(occurencies);
}
