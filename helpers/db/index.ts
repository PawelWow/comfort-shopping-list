import * as SQLite from 'expo-sqlite';

import Item from '../../models/Item';
import { deleteItems, deleteList } from './delete';

import { init } from './init';
import { insertList, insertItems } from './insert';
import { selectItems, selectItemsOfList, selectLists } from './select';
import { updateItemDone, updateItems, updateItemsOrder, updateList } from './update';

const db = SQLite.openDatabase('shoppinglists.db');

export const initializeDatabase = () => {
    return init(db);
};

// dodaje nową listę z itemami (każdy item: id, content, isDone)
export const addNewList = (
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
    return insertList(
        db,
        title,
        items,
        creationDate,
        isShoppingScheduled,
        shoppingDate,
        isReminderSet,
        remindOnTime,
        reminderHours,
        reminderMinutes
    );
};

// dodaje itemy do istniejącej listy
export const addItems = (listId: number, items: Item[]) => {
    return insertItems(db, listId, items);
}

// aktualizuje podstawowe dane listy (bez itemów)
export const changeListData = (
    title: string,
    isShoppingScheduled: number,
    shoppingDate: string,
    isReminderSet: number,
    remindOnTime: number,
    reminderHours: number,
    reminderMinutes: number,
    id: number
) => {
    return updateList(
        db,
        title,
        isShoppingScheduled,
        shoppingDate,
        isReminderSet,
        remindOnTime,
        reminderHours,
        reminderMinutes,
        id
    );
};

export const changeItemsData = (items: Item[], listId: number) => {
    return updateItems(db, items, listId);    
}

// do zapisywania, że item jest zrobiony
export const changeItemDone = (itemId: string, isDone: number) => {
    return updateItemDone(db, itemId, isDone);
}

export const updateOrderOfItems = (listId: number, items: Item[]) => {
    return updateItemsOrder(db, listId, items);  
}

// usuwa podane listy i wszystkie ich itemy
export const removeList = (listId: number) => {
    return deleteList(db, listId);
}

// items ids are unique so list id is not needed
export const removeItems = (itemsIds: string[]) => {
    return deleteItems(db, itemsIds); 
};

export const fetchLists = () => {
    return selectLists(db); 
};

export const fetchItems = () => {
    return selectItems(db); 
};

export const fetchItemsOfList = (listId: number) => {
    return selectItemsOfList(db, listId);
};