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

// TODO doczytaj jak z tymi resolvami, czy to czasem nie lepiej dać 1 resolve() na końcu

export const insertList = (title, shopping_date, shopping_time, creation_datetime, items) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            tx.executeSql(
                'INSERT INTO lists (title, shopping_date, shopping_time, creation_datetime) VALUES (?, ?, ?, ?);', 
                [title, shopping_date, shopping_time, creation_datetime], 
                (_, result) => {
                    resolve(result);

                    const itemsCount = items.length();
                    if(itemsCount === 0) {
                        // pusta lista, bez itemów
                        return;
                    }

                    // teraz itemy listy
                    const insertQuery = buildInsertItemsQuery(itemsCount);
                    tx.executeSql(
                        insertQuery, 
                        [items], 
                        (_, result) => {
                            resolve(result)
                        },
                        (_, err) => {
                            reject(err);
                        }
                        );
                },
                (_, err) => {
                    reject(err);
                }
                );

                console.log('data' + listId);
        });
    });

    return promise;
};

// buduje insert query dla pojedynczego wiersza lub wielu
const buildInsertItemsQuery = itemsCount => {
    const placeholders = new Array(itemsCount).fill('?').join(', ');
    return `INSERT INTO items (content) VALUES ${placeholders};`;
}
