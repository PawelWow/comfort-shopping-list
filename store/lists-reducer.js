import {
    ADD_LIST,
    SET_LISTS,
    DELETE_LIST,
    EDIT_LIST,
    SET_LIST_CURRENT,
    DISABLE_LIST_CURRENT
 } from './lists-actions';

import Item from '../models/Item';
import ShoppingList from '../models/ShoppingList';
import ShoppingTimeOptions from '../models/ShoppingTimeOptions';

const initialState = {
    shoppingLists: [],
    currentShoppingListId: null
};

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_LIST:
            const reminderOptions = new ShoppingTimeOptions(
                action.isShoppingScheduled, 
                action.shoppingDateIso,
                action.isReminderSet,
                action.remindOnTime,
                action.reminderHours.toString(),
                action.reminderMinutes.toString()
            );

            const shoppingList = new ShoppingList(
                    action.id,
                    action.title,
                    action.items,
                    action.creationDateIso,
                    reminderOptions
                );
            return {
                shoppingLists: state.shoppingLists.concat(shoppingList),
                currentShoppingListId: state.currentShoppingListId
            };
        case SET_LISTS:

            const shoppingLists = action.listsData.map(list => {

                const dbListItems = action.itemsData.filter(item => item.list_id === list.id);
                const shoppingListItems = dbListItems.map(i => new Item(i.id, i.content, Boolean(i.is_done)));

                const reminderOptions = new ShoppingTimeOptions(
                    Boolean(list.is_shopping_scheduled),
                    list.shopping_datetime,
                    Boolean(list.is_reminder_set),
                    Boolean(list.remind_on_time),
                    list.reminder_hours.toString(),
                    list.reminder_minutes.toString()
                );

                return new ShoppingList(
                    list.id,
                    list.title,
                    shoppingListItems,
                    list.creation_datetime,
                    reminderOptions,                    
                );

            });

            return {
                shoppingLists: shoppingLists,
                currentShoppingListId: state.currentShoppingListId
            };
        case EDIT_LIST: 
            const updatedReminderOptions = new ShoppingTimeOptions(
                action.isShoppingScheduled,
                action.shoppingDateIso,
                action.isReminderSet,
                action.remindOnTime,
                action.reminderHours,
                action.reminderMinutes
            );

            const updatedShoppingList = new ShoppingList(
                action.id,
                action.title,
                action.items,
                action.creationDateIso,
                updatedReminderOptions,                    
            );

            const updatedShoppingLists = state.shoppingLists.filter(list => list.id !== updatedShoppingList.id);
            updatedShoppingLists.push(updatedShoppingList);

            return {
                shoppingLists: updatedShoppingLists,
                currentShoppingListId: state.currentShoppingListId
            };
        case DELETE_LIST:
            const reducedShoppingLists = state.shoppingLists.filter(list => list.id !== action.deletedListId);
            return {
                shoppingLists: reducedShoppingLists,
                currentShoppingListId: state.currentShoppingList === action.deletedListId ? null : state.currentShoppingListId
            };

        case SET_LIST_CURRENT:
            return {
                shoppingLists: state.shoppingLists,
                currentShoppingListId: action.listId
            };
        case DISABLE_LIST_CURRENT:

            return {
                shoppingLists: state.shoppingLists,
                currentShoppingListId: null
            };
        default:
            return state;
    }
}