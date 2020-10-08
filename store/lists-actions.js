import {
    insertList,
    fetchLists,
    fetchItems,
    deleteList,
    updateListData,
    updateItemContent,
    updateItemDone,
    deleteSelectedItems,
    insertItems,    
 } from '../helpers/db';

 import { saveDataToLocalStorage, loadLocalStorageData, removeDataFromLocalStorage } from '../helpers/localStorage';
 import CurrentListSettings, {STORAGE_KEY_CURRENT_LIST} from '../models/CurrentListSettings';

import shortid from 'shortid';

import Item from '../models/Item';
import Separators from '../defs/Separators';

export const ADD_LIST = 'ADD_LIST';
export const SET_LISTS = 'SET_LISTS';
export const EDIT_LIST = 'EDIT_LIST';
export const DELETE_LIST = 'DELETE_LIST';
export const SET_LIST_CURRENT = 'SET_LIST_CURRENT';
export const LOAD_LIST_CURRENT = 'LOAD_LIST_CURRENT';
export const DISABLE_LIST_CURRENT = 'DISABLE_LIST_CURRENT';

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
            const insertResult = await insertList(
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

    return async dispatch => {
 
        try {
            const shoppingDateIso = shoppingDate.toISOString();

            await updateListData(
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
            const items = createItems(content);
            if(items.length > 0){
                await insertItems(id, items);
            }    
            
            // Check if itemId is marked for deletion
            const isDeletedItem = (currentId) => {
                const deletedItem = deletedItems.find(id => id === currentId);
                if(deletedItem){
                    return true;
                } else {
                    return false;
                }
            }

            await Promise.all(updatedItems.map(async item => {

                if(isDeletedItem(item.id))
                {
                    return;
                }

                await updateItemContent(item.id, item.content);
                await updateItemDone(item.id, +item.isDone);
            }));

            if(deletedItems.length > 0)
            {
                await deleteSelectedItems(deletedItems);
            }

            let itemsReduced = [];             
            existingItems.map(item => {
                // updated replace existing, deleted ones fall off
                const existingItem = updatedItems.find(i => i.id === item.id);
                if(!existingItem && !isDeletedItem(item.id)){
                    itemsReduced.push(item);
                }
            });
            
            const itemsResult = [...itemsReduced, ...updatedItems, ...items];

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

            const listsDbResult = await fetchLists();
            const itemsDbResult = await fetchItems();

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
            await deleteList(id);
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
        const loadedSettings = await loadLocalStorageData(STORAGE_KEY_CURRENT_LIST);
        const { id } = JSON.parse(loadedSettings);
        dispatch({type: SET_LIST_CURRENT, listId: id});
    } 
};

export const setAsNotCurrentList = id => {
    return async dispatch => {
        await removeDataFromLocalStorage(STORAGE_KEY_CURRENT_LIST);
        dispatch({ type: DISABLE_LIST_CURRENT, listId: id});
    }
}

// tworzy deskryptory itemów pochodzących z pola tekstowego użytkownika
const createItems = (itemsInput) => {    

    // TODO przemyśłeć tego regexa. W takiej postaci jest ok, ale moża da sie krócej zapisać, tylko czy czytelniej?
    const separators = new RegExp(
        `\\s${Separators.voice}|${Separators.words}\\s|\\s${Separators.voice}${Separators.words}|${Separators.words}${Separators.voice}\\s`,
        "gmi");

    // puste itemy nie będą tworzone
    const items = itemsInput.split(separators).filter(element => element.length !== 0);
        
    return items.map(itemContent => { 
        const id = shortid.generate();
        const content = itemContent.trim();
        return new Item(id, content, false); 
    });
}