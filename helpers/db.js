import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppinglists.db');

export const init = () => {
    const promise = new Promise((resolve, reject) => {

        db.transaction(query => {
            query.executeSql(
                'CREATE TABLE IF NOT EXISTS lists (id INTEGER PRIMARY KEY NOT NULL, title TEXT NOT NULL, shopping_date TEXT NULL, shopping_time TEXT NULL, creation_datetime TEXT NOT NULL);', 
                [],
                () => {
                    resolve()
                }, 
                (_, err) => {
                    reject(err);
                }
            );

            query.executeSql(
                'CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY NOT NULL, list_id INTEGER NOT NULL, content TEXT NOT NULL, is_done TEXT NOT NULL DEFAULT 0);',
                [],
                () => {
                    resolve()
                }, 
                (_, err) => {
                    reject(err);
                }
            );
      
        });      
    });

    return promise;
};
