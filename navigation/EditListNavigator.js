import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import EditShoppingListScreen, {
    ScreenOptions as editShoppingListScreenOptions,
    SCREEN_NAME as SCREEN_NAME_EDIT, 
} from '../screens/EditList/EditShoppingListScreen';

import EditListItemsScreen, { 
    ScreenOptions as editListItemsScreenOptions, 
    SCREEN_NAME as SCREEN_NAME_EDIT_ITEMS 
} from '../screens/EditList/EditListItemsScreen';

const EditShoppingListStackNavigator = createStackNavigator();

export const EditShoppingListNavigator = () => {
    return(
        <EditShoppingListStackNavigator.Navigator>
            <EditShoppingListStackNavigator.Screen
                name={SCREEN_NAME_EDIT}
                component={EditShoppingListScreen}
                options={editShoppingListScreenOptions}
            />
            <EditShoppingListStackNavigator.Screen
                name={SCREEN_NAME_EDIT_ITEMS}
                component={EditListItemsScreen}
                options={editListItemsScreenOptions}
            />
        </EditShoppingListStackNavigator.Navigator>
    );
}

const ShoppingListsStackNavigator = createStackNavigator();