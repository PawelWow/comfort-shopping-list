import { insertList, fetchItems, fetchItemsOfList } from '../helpers/db';

import shortid from 'shortid';

import ShoppingList from '../models/ShoppingList';
import Item from '../models/Item';
import Separators from '../defs/Separators';

export const ADD_LIST = 'ADD_LIST';
export const SET_LIST = 'SET_LIST';



export const addList = (title, shoppingDate, shoppingHours, creationDate, itemsInput) => {
    return async dispatch => {

        try {

            // TODO poprawić query, które przyjmują itemy, żeby były traktowane po tablicy obiektów, nie po tablicy stringów
            const items = createItems(itemsInput);
            const insertResult = await insertList(title, shoppingDate, shoppingTime, ncreationDateTime, items);

            const listData = new ShoppingList( insertResult.insertId, title, items, shoppingDate, shoppingHours, creationDate )


            dispatch({
                type: ADD_LIST, listData = listData
            })
        } catch (error) {
            throw(error);
        }

    }
}

const createItems = (itemsInput) => {
    

    // TODO przemyśłeć tego regexa. W takiej postaci jest ok, ale moża da sie krócej zapisać.
    const separators = new RegExp(
        `\\s${Separators.voice}|${Separators.words}\\s|\\s${Separators.voice}${Separators.words}|${Separators.words}${Separators.voice}\\s`,
         "gmi");

    const items = itemsInput.split(separators);
        
    return items.map(itemContent => { 
        const content = itemContent.trim();
        if(content.length === 0) {
            // pustych nie chcemy
            return;
        }
        const id = shortid.generate();
        return new Item(id, content, false); 
    });
}

