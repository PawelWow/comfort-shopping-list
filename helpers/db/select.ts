import { Database }  from 'expo-sqlite';

export const selectLists = (db: Database) => {
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
                        return false;
                    }
                );
        });
    });

    return promise;    
};

export const selectItems = (db: Database) => {
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
                        return false;
                    }
                );
        });
    });

    return promise;    
};

export const selectItemsOfList = (db: Database, listId: number) => {
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
                        return false;
                    }
                );
        });
    });

    return promise;    
};