import { insertList, fetchLists, fetchItems, fetchItemsOfList } from '../helpers/db';

import shortid from 'shortid';

import Item from '../models/Item';
import Separators from '../defs/Separators';

export const ADD_LIST = 'ADD_LIST';
export const SET_LISTS = 'SET_LISTS';

export const addList = (title, shoppingDate, shoppingReminderTime, isShoppingScheduled, creationDate, itemsInput) => {
    return async dispatch => {

        try {

            // new Item() dla każdego
            const items = createItems(itemsInput);

            // O ID listy dba DB, więc tak zostawiamy (nic nie kosztuje, bo po insercie i tak to ID wraca)
            const insertResult = await insertList(title, shoppingDate, shoppingReminderTime, isShoppingScheduled, creationDate, items);

            dispatch({
                type: ADD_LIST,
                id: insertResult.insertId,
                title: title,                
                shoppingDate: shoppingDate,
                shoppingReminderTime: shoppingReminderTime,
                isShoppingScheduled: isShoppingScheduled,
                creationDate: creationDate,
                items: items
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

