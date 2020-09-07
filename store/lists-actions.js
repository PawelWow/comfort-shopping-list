import { insertList, fetchLists, fetchItems, deleteList, updateListData, insertItems } from '../helpers/db';

import shortid from 'shortid';

import Item from '../models/Item';
import Separators from '../defs/Separators';

export const ADD_LIST = 'ADD_LIST';
export const SET_LISTS = 'SET_LISTS';
export const EDIT_LIST = 'EDIT_LIST';
export const DELETE_LIST = 'DELETE_LIST';

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
/*
            TODO:
            - update danych
             - zmiany w istniejących itemach,
             - usunięcie itemów ze stanu i z bazy
*/

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

            const updatedItems = existingItems.concat(items);


            dispatch({
                type: EDIT_LIST,
                id: id,
                title: title, 
                items: updatedItems,               
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



