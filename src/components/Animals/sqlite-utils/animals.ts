import { createAnimalsTable, createAnimalsData } from '@/components/Animals/sqlite-utils/init-db';
import { deleteDatabase } from '@/utils/utils-delete-db';
import { Animal } from '@/components/Animals/model/Animal';
import { SQLiteDBConnection } from 'vue-sqlite-hook/dist';
import { filterSize } from '@/components/Animals/sqlite-utils/filters';

export const getAllAnimals = async (sqlite: any, filter?: string): Promise<Animal[]> => {

    let animals: Animal[] = [];

    const getDBReady = async (): Promise<SQLiteDBConnection | null> => {
        let db: SQLiteDBConnection;
        let ret: any = await sqlite.isConnection("vdb");
        if(!ret.result) {
            db = await sqlite
            .createConnection("vdb", false, "no-encryption", 1); 

            ret = await deleteDatabase(db); //TODO: remove Line when RELEASE

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
        let ret: any = await db.execute(createAnimalsTable);
        if (ret.changes.changes < 0) {
            return false;
        }
        // add three animals in db
        ret = await db.execute(createAnimalsData);
        if (ret.changes.changes < 0) {
            return false;
        }
        return true;
    }
   
    const loadAnimals = async () => {
        const db = await getDBReady();
        if (db == null) return ;
        let ret: any = await db.isTable("animals");
        if(!ret.result) {
            await initVDB();
            ret = await db.query("SELECT * FROM animals");
            if (ret.values.length === 3) { 
                animals = ret.values;
                    return;
            } else {
                console.log("!!! in loadAnimals error loading animals !!!");
                return;
            }
        } else {
            ret = await db.query("SELECT * FROM animals");
            animals = ret.values;
            return;
        }
    }

    const filterAnimal= async (filter: string) => {
        const db = await getDBReady();
        if (db == null) return;
        let where = "";
        if (filter !== "00") {
            where = ` WHERE ${filterSize[filter]}` ;
        } 

        const ret: any = await db.query(`SELECT * FROM animals${where};`);
            animals = ret.values;
            return;

   }

    if(filter == undefined) {
        await loadAnimals();
    } else {
        await filterAnimal(filter);
    }
    return Promise.resolve(animals);
}
