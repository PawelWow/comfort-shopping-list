import { ADD_LIST, SET_LISTS, DELETE_LIST, EDIT_LIST } from './lists-actions';

import Item from '../models/Item';
import ShoppingList from '../models/ShoppingList';
import ShoppingTimeOptions from '../models/ShoppingTimeOptions';

const initialState = {
    shoppingLists: []
};

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_LIST:
            const reminderOptions = new ShoppingTimeOptions(
                Boolean(action.isShoppingScheduled), 
                action.shoppingDate.toISOString(),
                Boolean(action.isReminderSet),
                Boolean(action.remindOnTime),
                +action.reminderHours,
                +action.reminderMinutes
            );

            const shoppingList = new ShoppingList(
                action.id,
                action.title,
                action.items,
                action.creationDate.toISOString(),
                reminderOptions
                );
            return {
                shoppingLists: state.shoppingLists.concat(shoppingList)
            };
        case SET_LISTS:

            const shoppingLists = action.listsData.map(list => {

                const dbListItems = action.itemsData.filter(item => item.list_id === list.id);
                const shoppingListItems = dbListItems.map(i => new Item(i.id, i.content, Boolean(i.is_done)));

                const reminderOptions = new ShoppingTimeOptions(
                    Boolean(list.is_shopping_scheduled),
                    new Date(list.shopping_datetime),
                    Boolean(list.is_reminder_set),
                    Boolean(list.remind_on_time),
                    list.reminder_hours.toString(),
                    list.reminder_minutes.toString()
                );

                return new ShoppingList(
                    list.id,
                    list.title,
                    shoppingListItems,
                    new Date(list.creation_datetime),
                    reminderOptions,                    
                );

            });

            return {
                shoppingLists: shoppingLists
            };
        case EDIT_LIST: 
            // TODO
            return state;
        case DELETE_LIST:
            return {
                shoppingLists: state.shoppingLists.filter(list => list.id !== action.deletedListId)
            };

        default:
            return state;
    }
}