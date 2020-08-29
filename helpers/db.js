import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppinglists.db');

export const init = () => {
    const promise = new Promise((resolve, reject) => {

        db.transaction(query => {

            // TODO usunąć dropy
            query.executeSql(
                'DROP TABLE IF EXISTS lists;', 
                [],
                () => {
                    resolve()
                }, 
                (_, err) => {
                    reject(err);
                }
            );

            query.executeSql(
                'DROP TABLE IF EXISTS items;',
                [],
                () => {
                    resolve()
                }, 
                (_, err) => {
                    reject(err);
                }
            );

            // o ID listy baza sama ma sobie dbać
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

            // o unikalność ID musimy zadbać sami, w ktracie tworzenia nowego itema przez usera
            query.executeSql(
                'CREATE TABLE IF NOT EXISTS items (id TEXT PRIMARY KEY NOT NULL, list_id INTEGER NOT NULL, content TEXT NOT NULL, is_done TEXT NOT NULL DEFAULT 0);',
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

// dodaje nową listę z itemami (każdy item: id, content, isDone)
export const insertList = (title, shoppingDate, shoppingHour, creationDateTime, items) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            tx.executeSql(
                'INSERT INTO lists (title, shopping_date, shopping_time, creation_datetime) VALUES (?, ?, ?, ?);', 
                [title, shoppingDate, shoppingHour, creationDateTime], 
                (_, result) => {
                    resolve(result);

                    const itemsCount = items.length;
                    if(itemsCount === 0) {
                        // pusta lista, bez itemów
                        return;
                    }

                    // teraz itemy listy
                    const insertQuery = buildInsertItemsQuery(itemsCount);
                    const insertValues = prepareInsertItemQueryValues(result.insertId, items);

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
            const insertValues = prepareInsertItemQueryValues(listId, items);
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

// aktualizuje podstawowe dane listy (bez itemów)
export const updateListData = (listId, newTitle, newShoppingDate, newShoppingTime) => {
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
                listId, 
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

export const fetchLists = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                    'SELECT * FROM lists', 
                    [], 
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
};

export const fetchItems = () => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                    'SELECT * FROM items', 
                    [], 
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
};

export const fetchItemsOfList = (listId) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                    'SELECT * FROM items WHERE list_id=?', 
                    [listId], 
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
};


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

// buduje insert query dla wierszy itemów
// - głównie chodzi o VALUES (id, list_id, content1, is_done), (id, list_id, content2, is_done)
const buildInsertItemsQuery = itemsCount => {
    const placeholders = new Array(itemsCount).fill('(?, ?, ?, ?)').join(', ');
    return `INSERT INTO items (id, list_id, content, is_done) VALUES ${placeholders};`;
}

// buduje tablicę dla wartości w kwerendzie insert
const prepareInsertItemQueryValues = (listId, items) => {
    const values = items.map(item => [item.id, listId, item.content, item.isDone]);
    return values.flat();
}
