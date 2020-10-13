import * as db from '../helpers/db';

 import { saveDataToLocalStorage, loadLocalStorageData, removeDataFromLocalStorage } from '../helpers/localStorage';
 import CurrentListSettings, {STORAGE_KEY_CURRENT_LIST} from '../models/CurrentListSettings';

import shortid from 'shortid';

import Item, { sortItems } from '../models/Item';
import Separators from '../defs/Separators';

export const ADD_LIST = 'ADD_LIST';
export const SET_LISTS = 'SET_LISTS';
export const EDIT_LIST = 'EDIT_LIST';
export const DELETE_LIST = 'DELETE_LIST';
export const SET_LIST_CURRENT = 'SET_LIST_CURRENT';
export const LOAD_LIST_CURRENT = 'LOAD_LIST_CURRENT';
export const DISABLE_LIST_CURRENT = 'DISABLE_LIST_CURRENT';
export const UPDATE_ITEM_DONE = 'UPDATE_ITEM_DONE';

// TODO tutaj powinien być obiekt listy dodany, bo za dużo tych parametrów
export const addList = (
    title,
    content,
    isShoppingScheduled,
    shoppingDate,
    isReminderSet,
    remindOnTime,
    reminderHours,
    reminderMinutes
) => {
    return async dispatch => {
 
        try {

            // new Item() dla każdego
            const items = createItems(content);

            const creationDateIso = new Date().toISOString();
            const shoppingDateIso = shoppingDate.toISOString();

            // O ID listy dba DB, więc tak zostawiamy (nic nie kosztuje, bo po insercie i tak to ID wraca)
            const insertResult = await db.insertList(
                title,
                items,
                creationDateIso,
                +isShoppingScheduled, 
                shoppingDateIso,
                +isReminderSet,
                +remindOnTime,
                +reminderHours,
                +reminderMinutes
            );            

            dispatch({
                type: ADD_LIST,
                id: insertResult.insertId,
                title: title, 
                items: items,               
                creationDateIso: creationDateIso,
                isShoppingScheduled: isShoppingScheduled,
                shoppingDateIso: shoppingDateIso,
                isReminderSet: isReminderSet,
                remindOnTime: remindOnTime,
                reminderHours: reminderHours,
                reminderMinutes: reminderMinutes

            });
            
        } catch (error) {
            throw(error);
        }

    }
}

export const editList = (
    id,
    title,
    content,
    existingItems,
    updatedItems,
    deletedItems,
    creationDateIso,
    isShoppingScheduled,
    shoppingDate,
    isReminderSet,
    remindOnTime,
    reminderHours,
    reminderMinutes
) => {

    /** @description if some items are deleted, ordering might be broken. Function outpus [0, 2, 5] => [0, 1, 2]
     *  @param {*} items items array
     */
    const updateItemsOrder = items => {
        const updatedItems = items.sort(sortItems);
        for(i = 0; i < items.length; i++){
            updatedItems[i].order = i;
        }

        return updatedItems;
    };

    /**
     * @description Check if itemId is marked for deletion
     * @param {*} currentId id of item to check
     */
    const isDeletedItem = (currentId) => {
        const deletedItem = deletedItems.find(id => id === currentId);
        return !!deletedItem;
    };

    /**
     * @description returns not updated and to deleted items from overall items collection
     */
    const reduceItems = () => {
        const itemsReduced = [];             
        existingItems.map(item => {
            // updated replace existing, deleted ones fall off
            const existingItem = updatedItems.find(i => i.id === item.id);
            if(!existingItem && !isDeletedItem(item.id)){
                itemsReduced.push(item);
            }
        });   
        
        return itemsReduced;
    };   

    return async dispatch => {
 
        try {
            const shoppingDateIso = shoppingDate.toISOString();

            await db.updateListData(
                title,
                +isShoppingScheduled,
                shoppingDateIso,
                +isReminderSet,
                +remindOnTime,
                +reminderHours,
                +reminderMinutes,
                id
            );

            // new Item() dla każdego
            const items = createItems(content, existingItems.length);
            if(items.length > 0){
                await db.insertItems(id, items);
            }    
            
            if(updatedItems.length > 0 ){
                await db.updateItems(updatedItems, id);
            }

            const itemsReduced = reduceItems();
            let itemsResult = [...itemsReduced, ...updatedItems, ...items];

            if(deletedItems.length > 0)
            {
                await db.deleteSelectedItems(deletedItems);

                const itemsUpdatedOrder = updateItemsOrder(itemsResult);
                await db.updateItemsOrder(id, itemsUpdatedOrder);

                itemsResult = itemsUpdatedOrder;
            }

            dispatch({
                type: EDIT_LIST,
                id: id,
                title: title, 
                items: itemsResult,               
                creationDateIso: creationDateIso,
                isShoppingScheduled: isShoppingScheduled,
                shoppingDateIso: shoppingDateIso,
                isReminderSet: isReminderSet,
                remindOnTime: remindOnTime,
                reminderHours: reminderHours,
                reminderMinutes: reminderMinutes

            });
            
        } catch (error) {
            throw(error);
        }

    }
}

export const loadLists = () => {
    return async dispatch => {

        try {

            const listsDbResult = await db.fetchLists();
            const itemsDbResult = await db.fetchItems();

            dispatch({
                type: SET_LISTS, listsData: listsDbResult.rows._array, itemsData: itemsDbResult.rows._array
            });


        } catch (error) {
            throw (error);
        }
    }
}

export const removeList = id => {
    return async dispatch => {
        try {
            await db.deleteList(id);
            dispatch({ type: DELETE_LIST, deletedListId: id });
            
        } catch (error) {
            throw( error);
        }
    }
}

export const saveListAsCurrent = id => {

    return async dispatch => {
        try {
            await saveDataToLocalStorage(
                STORAGE_KEY_CURRENT_LIST,
                JSON.stringify(new CurrentListSettings(id))
            );
    
            dispatch({ type: SET_LIST_CURRENT, listId: id})
        } catch (error) {
            throw( error);
        }
    };
};

export const loadCurrentList = () => {
    return async dispatch => {
        try {
            const loadedSettings = await loadLocalStorageData(STORAGE_KEY_CURRENT_LIST);
            if(!loadedSettings)
            {
                return;
            }
            
            const { id } = JSON.parse(loadedSettings);
            dispatch({type: SET_LIST_CURRENT, listId: id});
        } catch (error) {
            throw(error)
        }
    }
};

export const setAsNotCurrentList = id => {
    return async dispatch => {
        await removeDataFromLocalStorage(STORAGE_KEY_CURRENT_LIST);
        dispatch({ type: DISABLE_LIST_CURRENT, listId: id});
    }
}

export const setItemDone = (listId, itemId, isDone) => {
    return async dispatch => {

        await db.updateItemDone(itemId, isDone);
        dispatch({ type: UPDATE_ITEM_DONE, listId: listId, itemId: itemId, isDone: isDone});
    };
};

// tworzy deskryptory itemów pochodzących z pola tekstowego użytkownika
const createItems = (itemsInput, startIndex = 0) => {    

    // TODO przemyśłeć tego regexa. W takiej postaci jest ok, ale moża da sie krócej zapisać, tylko czy czytelniej?
    const separators = new RegExp(
        `\\s${Separators.voice}|${Separators.words}\\s|\\s${Separators.voice}${Separators.words}|${Separators.words}${Separators.voice}\\s`,
        "gmi");

    // puste itemy nie będą tworzone
    const items = itemsInput.split(separators).filter(element => element.length !== 0);
        
    const itemsCreated = [];
    for(itemIndex = 0, order = startIndex; itemIndex < items.length; itemIndex++, order++){
        const id = shortid.generate();
        const content = items[itemIndex].trim();
        itemsCreated.push(new Item(id, content, false, order));
    }

    return itemsCreated; 

}