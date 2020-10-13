import { Database }  from 'expo-sqlite';

// usuwa podane listy i wszystkie ich itemy
export const deleteList = (db: Database, listId: number) => {

    // buduje kwerendę usuwania itemów o podanej ilosći
    const buildDeleteQuery = (tableName: string, columnConditionName: string) => {
        return `DELETE FROM ${tableName} WHERE ${columnConditionName}=?;`;
    }

    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            const listIdColumnName = 'list_id';
            const deleteItemsQuery = buildDeleteQuery('items', listIdColumnName);
            tx.executeSql(
                deleteItemsQuery, 
                [listId], 
                (_, result) => {
                    resolve(result);

                    const deleteOrder = buildDeleteQuery('items_order', listIdColumnName);
                    tx.executeSql(
                        deleteOrder, 
                        [listId], 
                        (_, result) => {
                            resolve(result);

                            const deleteList = buildDeleteQuery('lists', 'id');
                            tx.executeSql(
                                deleteList, 
                                [listId], 
                                (_, result) => {
                                    resolve(result);
                                },
                                (_, err) => {
                                    reject(err);
                                    return false;
                                }
                            );
                        },
                        (_, err) => {
                            reject(err);
                            return false;
                        }
                    );
                },
                (_, err) => {
                    reject(err);
                    return false;
                }
            );
        });
    });

    return promise; 
}

// items ids are unique so list id is not needed
export const deleteItems = (db: Database, itemsIds: string[]) => {

    const createDeleteQuery = (itemsCount: number, columnCondition: string, tableName: string) => {
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
                            return false;
                        }
                    );
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

