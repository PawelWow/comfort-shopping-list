import * as SQLite from 'expo-sqlite';

const db = SQLite.openDatabase('shoppinglists.db');

export const init = () => {
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
                }
            );
      
        });      
    });

    return promise;
};

// dodaje nową listę z itemami (każdy item: id, content, isDone)
export const insertList = (
    title,
    items,
    creationDate,
    isShoppingScheduled, shoppingDate,
    isReminderSet,
    remindOnTime,
    reminderHours,
    reminderMinutes
) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            tx.executeSql(
                'INSERT INTO lists (title, creation_datetime, is_shopping_scheduled, shopping_datetime, is_reminder_set, remind_on_time, reminder_hours, reminder_minutes ) VALUES (?, ?, ?, ?, ?, ?, ?, ?);', 
                [
                    title,
                    creationDate,                    
                    isShoppingScheduled, 
                    shoppingDate,
                    isReminderSet,
                    remindOnTime,
                    reminderHours,
                    reminderMinutes
                ], 
                (_, result) => {

                    resolve(result);
                    const listId = result.insertId;

                    const itemsCount = items.length;
                    if(itemsCount === 0) {
                        // pusta lista, bez itemów
                        return;
                    }
                    // teraz itemy listy
                    const insertQuery = buildInsertItemsQuery(itemsCount);
                    const insertValues = prepareInsertItemQueryValues(listId, items);

                    tx.executeSql(
                        insertQuery, 
                        insertValues, 
                        (_, result) => {
                            const insertItemsOrderQuery = buildInsertItemsOrderQuery(itemsCount);
                            const insertOrderValues = prepareInsertItemsOrderQueryValues(listId, items);

                            tx.executeSql(
                                insertItemsOrderQuery, 
                                insertOrderValues, 
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
        
        const itemsCount = items.length;

        db.transaction(tx => {
            const insertQuery = buildInsertItemsQuery(itemsCount);
            const insertValues = prepareInsertItemQueryValues(listId, items);
            tx.executeSql(
                insertQuery, 
                insertValues, 
                (_, result) => {
                    resolve(result);

                    
                    const insertItemsOrderQuery = buildInsertItemsOrderQuery(itemsCount);
                    const insertOrderValues = prepareInsertItemsOrderQueryValues(listId, items);
                    tx.executeSql(
                        insertItemsOrderQuery, 
                        insertOrderValues, 
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

// aktualizuje podstawowe dane listy (bez itemów)
export const updateListData = (title, isShoppingScheduled, shoppingDate, isReminderSet, remindOnTime, reminderHours, reminderMinutes, id) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            tx.executeSql(
                "UPDATE lists SET title=?, is_shopping_scheduled=?, shopping_datetime=?, is_reminder_set=?, remind_on_time=?, reminder_hours=?, reminder_minutes=? WHERE id=?;", 
                [title, isShoppingScheduled, shoppingDate, isReminderSet, remindOnTime, reminderHours, reminderMinutes, id], 
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

// isDone should be a number [0,1] - as true or false
// TODO research: multirows: CASE WHEN THEN END WHERE /!\
export const updateItem = (itemId, newContent, isDone) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            tx.executeSql(
                "UPDATE items SET content=?, is_done=?, WHERE id=?;", 
                [newContent, isDone, itemId], 
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
                "UPDATE items SET is_done=? WHERE id=?;", 
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

export const updateItemsOrder = (listId, items) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            const updateQuery = createUpdateItemsOrderQuery(items.length);
            const values = prepareUpdateItemsOrderQueryValues(items, listId);

            tx.executeSql(
                updateQuery, 
                [...values, listId], 
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
export const deleteList = listId => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            const deleteItemsQuery = buildDeleteItemsQuery();
            tx.executeSql(
                deleteItemsQuery, 
                [listId], 
                (_, result) => {
                    resolve(result);

                    tx.executeSql(
                        'DELETE FROM items_order WHERE list_id=?;', 
                        [listId], 
                        (_, result) => {
                            resolve(result);

                            tx.executeSql(
                                'DELETE FROM lists WHERE id=?;', 
                                [listId], 
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
                },
                (_, err) => {
                    reject(err);
                }
            );
        });
    });

    return promise; 
}

// items ids are unique so list id is not needed
export const deleteSelectedItems = (itemsIds) => {

    const createDeleteQuery = (itemsCount, columnCondition, tableName) => {
        const placeholders = new Array(itemsCount).fill(`${columnCondition}=?`).join(' OR ');
        return `DELETE FROM ${tableName} WHERE ${placeholders}`;
    }

    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            const deleteItemsQuery = createDeleteQuery(itemsIds.length, 'id', 'items');
            tx.executeSql(
                deleteItemsQuery, 
                [...itemsIds], 
                (_, result) => {
                    resolve(result);

                    const deleteItemsOrderQuery = createDeleteQuery(itemsIds.length, 'item_id', 'items_order');
                    tx.executeSql(
                        deleteItemsOrderQuery, 
                        [...itemsIds], 
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
};

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
                    'SELECT items.*, items_order.order_index FROM items INNER JOIN items_order ON items_order.item_id = items.id', 
                    [], 
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
};

export const fetchItemsOfList = (listId) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            tx.executeSql(
                    'SELECT items.*, items_order.order_index FROM items INNER JOIN items_order ON items_order.item_id = items.id WHERE list_id=?', 
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
const buildDeleteItemsQuery = () => {
    return 'DELETE FROM items WHERE list_id=?;';
}

// buduje insert query dla wierszy itemów
// - głównie chodzi o VALUES (id, list_id, content1, is_done), (id, list_id, content2, is_done)
const buildInsertItemsQuery = itemsCount => {
    const placeholders = new Array(itemsCount).fill('(?, ?, ?, ?)').join(', ');
    return `INSERT INTO items (id, list_id, content, is_done) VALUES ${placeholders};`;
}

// buduje tablicę dla wartości w kwerendzie insert
const prepareInsertItemQueryValues = (listId, items) => {
    const values = items.map(item => [item.id, listId, item.content, +item.isDone]);
    return values.flat();
}

const buildInsertItemsOrderQuery = itemsCount => {
    const placeholders = new Array(itemsCount).fill('(?, ?, ?)').join(', ');
    return `INSERT INTO items_order (item_id, list_id, order_index) VALUES ${placeholders};`;
}

const prepareInsertItemsOrderQueryValues = (listId, items) => {
    const values = items.map(item => [item.id, listId, item.order]);
    return values.flat();
}

//UPDATE items_order SET order_index=CASE WHEN item_id='a1' THEN 6 WHEN item_id='a2' THEN 7 ELSE order_index END WHERE list_id=1;
const createUpdateItemsOrderQuery = (itemsCount) => {
    const placeholders = new Array(itemsCount).fill('WHEN item_id=? THEN ?').join(' ');
    return `UPDATE items_order SET order_index=CASE ${placeholders} ELSE order_index END WHERE list_id=?;`;
}

const prepareUpdateItemsOrderQueryValues = items => {
    const values = items.map(item => [item.id, item.order]);
    return values.flat();
}
