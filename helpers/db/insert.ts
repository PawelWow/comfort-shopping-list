import { Database }  from 'expo-sqlite';
import Item from '../../models/Item';

// dodaje nową listę z itemami (każdy item: id, content, isDone)
export const insertList = (
    db: Database,
    title: string,
    items: Item[],
    creationDate: string,
    isShoppingScheduled: number, 
    shoppingDate: string,
    isReminderSet: number,
    remindOnTime: number,
    reminderHours: number,
    reminderMinutes: number
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
};

// dodaje itemy do istniejącej listy
export const insertItems = (db: Database, listId: number, items: Item[]) => {
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

// buduje insert query dla wierszy itemów
// - głównie chodzi o VALUES (id, list_id, content1, is_done), (id, list_id, content2, is_done)
const buildInsertItemsQuery = (itemsCount: number) => {
    const placeholders = new Array(itemsCount).fill('(?, ?, ?, ?)').join(', ');
    return `INSERT INTO items (id, list_id, content, is_done) VALUES ${placeholders};`;
}

// buduje tablicę dla wartości w kwerendzie insert
const prepareInsertItemQueryValues = (listId: number, items: Item[]) => {
    const values = items.map(item => [item.id, listId, item.content, +item.isDone]);
    return values.flat();
}

const buildInsertItemsOrderQuery = (itemsCount: number) => {
    const placeholders = new Array(itemsCount).fill('(?, ?, ?)').join(', ');
    return `INSERT INTO items_order (item_id, list_id, order_index) VALUES ${placeholders};`;
}

const prepareInsertItemsOrderQueryValues = (listId: number, items: Item[]) : (string | number)[] => {
    const values = items.map(item => [item.id, listId, item.order]);
    return values.flat();
}