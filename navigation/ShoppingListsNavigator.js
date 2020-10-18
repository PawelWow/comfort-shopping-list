import React from 'react';
import { View, SafeAreaView } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList  } from '@react-navigation/drawer';

import CurrentShoppingListScreen, {ScreenOptions as currentShoppingListScreenOptions} from '../screens/CurrentShoppingListScreen';
import EditShoppingListScreen, {
    ScreenOptions as editShoppingListScreenOptions,
    SCREEN_NAME as SCREEN_NAME_EDIT, 
} from '../screens/EditList/EditShoppingListScreen';

import EditListItemsScreen, { 
    ScreenOptions as editListItemsScreenOptions, 
    SCREEN_NAME as SCREEN_NAME_EDIT_ITEMS 
} from '../screens/EditList/EditListItemsScreen';

import ShoppingListsOverviewScreen, {ScreenOptions as shoppingListOverviewScreenOptions} from '../screens/ShoppingListsOverviewScreen';


import IconsNames from '../defs/IconsNames';

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
};

const ShoppingListsStackNavigator = createStackNavigator();

export const ShoppingListsNavigator = () => {
    return (
        <ShoppingListsStackNavigator.Navigator>
            <ShoppingListsStackNavigator.Screen
                name="CurrentShoppingList"
                component={CurrentShoppingListScreen}
                options={currentShoppingListScreenOptions}
            />
            <ShoppingListsStackNavigator.Screen
                name={SCREEN_NAME_EDIT}
                component={EditShoppingListNavigator}
                options={editShoppingListScreenOptions}
            />
            <ShoppingListsStackNavigator.Screen
                name="ShoppingListsOverview"
                component={ShoppingListsOverviewScreen}
                options={shoppingListOverviewScreenOptions}
            />
        </ShoppingListsStackNavigator.Navigator>
    );
};

const ManageShoppingListsStackNavigator = createStackNavigator();

export const ManageShoppingListsNavigator = () => {
    return (
        <ManageShoppingListsStackNavigator.Navigator>
            <ManageShoppingListsStackNavigator.Screen
                name="ShoppingListsOverview"
                component={ShoppingListsOverviewScreen}
                options={shoppingListOverviewScreenOptions}
            />               
            <ManageShoppingListsStackNavigator.Screen
                name={SCREEN_NAME_EDIT}
                component={EditShoppingListScreen}
                options={editShoppingListScreenOptions}
            />   
            <EditShoppingListStackNavigator.Screen
                name={SCREEN_NAME_EDIT_ITEMS}
                component={EditListItemsScreen}
                options={editListItemsScreenOptions}
            />     
        </ManageShoppingListsStackNavigator.Navigator>
    );
}

const MenuDrawerNavigator = createDrawerNavigator();

export const MenuNavigator = () => {
    const createDrawerIcon = name => {
        return {
            drawerIcon: props => <Ionicons name={name} size={23} color={props.color} />
        };
    }

    return(
        <MenuDrawerNavigator.Navigator 
            drawerContent={ props => {
                return (
                    <View style={{flex: 1, padding: 20}}>
                        <SafeAreaView forceInset={{top: 'always', horizontal: 'never'}}>
                            <DrawerItemList {...props} />
                        </SafeAreaView>
                    </View>
                );
            }}>
            <MenuDrawerNavigator.Screen
                name="Current list"
                component={ShoppingListsNavigator}
                options={() => createDrawerIcon(IconsNames.paper)} 
                />
                
            <MenuDrawerNavigator.Screen
                name="New shopping list"
                component={EditShoppingListNavigator}
                options={() => createDrawerIcon(IconsNames.create)}
                />
            <MenuDrawerNavigator.Screen
                name="All lists"
                component={ManageShoppingListsNavigator}
                options={() => createDrawerIcon(IconsNames.list)}
                />

        </MenuDrawerNavigator.Navigator>
    );
}