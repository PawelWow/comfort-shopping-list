import { insertList, fetchItems, fetchItemsOfList } from '../helpers/db';

import shortid from 'shortid';

import ShoppingList from '../models/ShoppingList';
import Item from '../models/Item';
import Separators from '../defs/Separators';

export const ADD_LIST = 'ADD_LIST';
export const SET_LIST = 'SET_LIST';

export const addList = (title, shoppingDate, shoppingHour, creationDate, itemsInput) => {
    return async dispatch => {

        try {

            // TODO poprawić query, które przyjmują itemy, żeby były traktowane po tablicy obiektów, nie po tablicy stringów
            const items = createItems(itemsInput);

            // O ID listy dba DB, więc tak zostawiamy (nic nie kosztuje, bo po insercie i tak to ID wraca)
            const insertResult = await insertList(title, shoppingDate, shoppingHour, creationDate, items);
            const shoppingList = new ShoppingList(insertResult.insertId, title, items, shoppingDate, shoppingHour, creationDate);

            dispatch({
                type: ADD_LIST, newList: shoppingList
            })
        } catch (error) {
            throw(error);
        }

    }
}

// tworzy deskryptor pustego itemu
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

