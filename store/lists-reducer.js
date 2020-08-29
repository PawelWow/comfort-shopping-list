import { ADD_LIST, SET_LISTS } from './lists-actions';

import Item from '../models/Item';
import ShoppingList from '../models/ShoppingList';

const initialState = {
    shoppingLists: []
};

export default (state = initialState, action) => {
    switch(action.type) {
        case ADD_LIST:
            const shoppingList = new ShoppingList(
                action.id,
                action.title,
                action.items,
                action.shoppingDate,
                action.shoppingHour,
                action.creationDate
                );
            return {
                shoppingLists: state.shoppingLists.concat(shoppingList)
            };
        case SET_LISTS:

            const shoppingLists = action.listsData.map(list => {

                const dbListItems = action.itemsData.filter(item => item.list_id === list.id);
                const shoppingListItems = dbListItems.map(i => new Item(i.id, i.content, Boolean(i.is_done)));

                return new ShoppingList(
                    list.id,
                    list.title,
                    shoppingListItems,
                    list.shopping_date,
                    list.shopping_hour,
                    list.creation_datetime
                );

            });

            return {
                shoppingLists: shoppingLists
            };
        default:
            return state;
    }
}