import { Database }  from 'expo-sqlite';
import Item from '../../models/Item';

// aktualizuje podstawowe dane listy (bez itemów)
export const updateList = (
    db: Database,
    title: string,
    isShoppingScheduled: number,
    shoppingDate: string,
    isReminderSet: number,
    remindOnTime: number,
    reminderHours: number,
    reminderMinutes: number,
    listId: number
) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            tx.executeSql(
                "UPDATE lists SET title=?, is_shopping_scheduled=?, shopping_datetime=?, is_reminder_set=?, remind_on_time=?, reminder_hours=?, reminder_minutes=? WHERE id=?;", 
                [title, isShoppingScheduled, shoppingDate, isReminderSet, remindOnTime, reminderHours, reminderMinutes, listId], 
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
}

export const updateItems = (db: Database, items: Item[], listId: number) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {

            const query = createUpdateItemsQuery(items.length);
            const values = prepareUpdateItemsQueryValues(items);

            tx.executeSql(
                query, 
                [...values, listId], 
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
}

// do zapisywania, że item jest zrobiony
export const updateItemDone = (db: Database, itemId: string, isDone: number) => {
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
                    return false;
                }
            );
        });
    });

    return promise; 
}

export const updateItemsOrder = (db: Database, listId: number, items: Item[]) => {
    const promise = new Promise((resolve, reject) => {
        db.transaction(tx => {
            const updateQuery = createUpdateItemsOrderQuery(items.length);
            const values = prepareUpdateItemsOrderQueryValues(items);

            tx.executeSql(
                updateQuery, 
                [...values, listId], 
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
}

//UPDATE items SET content=?, is_done=?, WHERE id=?;",
const createUpdateItemsQuery = (itemsCount: number) => {
    const placeholders = new Array(itemsCount).fill('WHEN id=? THEN ?').join(' ');
    return `UPDATE items SET content=CASE ${placeholders} ELSE content END, is_done=CASE ${placeholders} ELSE is_done END WHERE list_id=?;`;
}

const prepareUpdateItemsQueryValues = (items: Item[]) => {

    const contents = [];
    const dones = [];
    for (let i = 0; i < items.length; i++) {
        const item = items[i];
        contents.push(item.id);
        contents.push(item.content);

        dones.push(item.id);
        dones.push(+item.isDone);
    }

    const values = [...contents.flat(), ...dones.flat()];
    return values;
}

//UPDATE items_order SET order_index=CASE WHEN item_id='a1' THEN 6 WHEN item_id='a2' THEN 7 ELSE order_index END WHERE list_id=1;
const createUpdateItemsOrderQuery = (itemsCount: number) => {
    const placeholders = new Array(itemsCount).fill('WHEN item_id=? THEN ?').join(' ');
    return `UPDATE items_order SET order_index=CASE ${placeholders} ELSE order_index END WHERE list_id=?;`;
}

const prepareUpdateItemsOrderQueryValues = (items: Item[]) => {
    const values = items.map(item => [item.id, item.order]);
    return values.flat();
}