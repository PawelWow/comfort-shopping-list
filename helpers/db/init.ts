import { Database }  from 'expo-sqlite';

export const init = (db: Database) => {
    const promise = new Promise((resolve, reject) => {

        db.transaction(query => {         

            // o ID listy baza sama ma sobie dbać
            query.executeSql(
                'CREATE TABLE IF NOT EXISTS lists (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, creation_datetime TEXT NOT NULL, is_shopping_scheduled INTEGER NOT NULL DEFAULT 0, shopping_datetime TEXT NULL, is_reminder_set INTEGER NOT NULL DEFAULT 0, remind_on_time INTEGER NOT NULL DEFAULT 0, reminder_hours INT NOT NULL DEFAULT 0,  reminder_minutes INT NOT NULL DEFAULT 0);', 
                [],
                () => {

                    resolve()
                }, 
                (_, err) => {
                    reject(err);
                    return false;
                }
            );

            // o unikalność ID musimy zadbać sami, w trakcie tworzenia nowego itema przez usera
            query.executeSql(
                'CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY NOT NULL, list_id INTEGER NOT NULL, content TEXT NOT NULL, is_done INTEGER NOT NULL DEFAULT 0);',
                [],
                () => {
                    resolve()
                }, 
                (_, err) => {
                    reject(err);
                    return false;
                }
            );

            // one-to-one in relationship to items table, many to many to list
            query.executeSql(
                'CREATE TABLE IF NOT EXISTS items_order (item_id TEXT PRIMARY KEY NOT NULL, list_id INTEGER NOT NULL, order_index INTEGER NOT NULL);',
                [],
                () => {
                    resolve()
                }, 
                (_, err) => {
                    reject(err);
                    return false;
                }
            );
      
        });      
    });

    return promise;
};