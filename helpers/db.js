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

// dodaje nową listę z itemami
export const insertList = (title, shopping_date, shopping_time, creation_datetime, items) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            tx.executeSql(
                'INSERT INTO lists (title, shopping_date, shopping_time, creation_datetime) VALUES (?, ?, ?, ?);', 
                [title, shopping_date, shopping_time, creation_datetime], 
                (_, result) => {
                    resolve(result);

                    const itemsCount = items.length;
                    if(itemsCount === 0) {
                        // pusta lista, bez itemów
                        return;
                    }

                    // teraz itemy listy
                    const insertQuery = buildInsertItemsQuery(itemsCount);
                    const insertValues = prepareInsertQueryValues(result.insertId, items, 0);
                    tx.executeSql(
                        insertQuery, 
                        insertValues, 
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
        });
    });

    return promise;
};

// dodaje itemy do istniejącej listy
export const insertItems = (listId, items) => {
    const promise = new Promise((resolve, reject) => {

        db.transaction(tx => {
            const insertQuery = buildInsertItemsQuery(items.length);
            const insertValues = prepareInsertQueryValues(listId, items, 0);
            tx.executeSql(
                insertQuery, 
                insertValues, 
                (_, result) => {
                    resolve(result)
                },
                (_, err) => {
                    reject(err);
                }
                );
        });

    });

    return promise;
}

export const updateList = (listId, newTitle, newShoppingDate, newShoppingTime) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            tx.executeSql(
                "UPDATE lists SET title='?', shopping_date='?', shopping_time='?' WHERE id=?;", 
                [newTitle, newShoppingDate, newShoppingTime, listId], 
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                }
                );
        });
    });

    return promise;
}

// Będzie raczej rzadko, ale będzie możliwe
export const updateItemContent = (itemId, newContent) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            tx.executeSql(
                "UPDATE items SET content='?' WHERE id=?;", 
                [newContent, itemId], 
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                }
                );
        });
    });

    return promise;    
}

// do zapisywania, że item jest zrobiony
export const updateItemDone = (itemId, isDone) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            tx.executeSql(
                "UPDATE items SET is_done='?' WHERE id=?;", 
                [isDone, itemId], 
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                }
            );
        });
    });

    return promise; 
}

// usuwa podane listy i wszystkie ich itemy
export const deleteLists = (listIds) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            const deleteItemsQuery = buildDeleteItemsQuery(listIds.length);
            tx.executeSql(
                deleteItemsQuery, 
                listIds, 
                (_, result) => {
                    resolve(result);

                    const deleteListsQuery = buildDeleteListQuery(listIds.length);
                    tx.executeSql(
                        deleteListsQuery, 
                        listIds, 
                        (_, result) => {
                            resolve(result);
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
        });
    });

    return promise; 
}

// usuwa itemy z podanej listy
export const deleteItems = listId => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            const deleteItemsQuery = buildDeleteItemsQuery(1);
            tx.executeSql(
                deleteItemsQuery, 
                listIds, 
                (_, result) => {
                    resolve(result);
                },
                (_, err) => {
                    reject(err);
                }
            );
        });
    });

    return promise;     
}

// buduje kwerendę usuwania itemów o podanej ilosći
const buildDeleteItemsQuery = itemsCount => {
    const placeholders = new Array(itemsCount).fill('list_id=?').join(' OR ');
    return `DELETE FROM items WHERE ${placeholders};`;
}

// buduje kwerendę usuwania list o podanej ilości
const buildDeleteListQuery = listsCount => {
    const placeholders = new Array(listsCount).fill('id=?').join(' OR ');
    return `DELETE FROM lists WHERE ${placeholders};`;
}

// buduje insert query dla pojedynczego wiersza - głównie chodzi o VALUES (id_listy, w1, is_done), (id_listy, w2, is_done)
const buildInsertItemsQuery = itemsCount => {
    const placeholders = new Array(itemsCount).fill('(?, ?, ?)').join(', ');
    return `INSERT INTO items (list_id, content, is_done) VALUES ${placeholders};`;
}

// rozszerza tablicę wartości zapytania o id listy, bo dodajemy wartości w postaci (id_listy, w1), (id_listy, w2)
const prepareInsertQueryValues = (listId, items, isDone) => {
    const values = items.map(item => [listId, item, isDone]);
    return values.flat();
}
