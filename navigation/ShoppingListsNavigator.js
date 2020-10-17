import React from 'react';
import { View, SafeAreaView } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList  } from '@react-navigation/drawer';

import CurrentShoppingListScreen, {ScreenOptions as currentShoppingListScreenOptions} from '../screens/CurrentShoppingListScreen';
import EditShoppingListScreen, {
    ScreenOptions as editShoppingListScreenOptions,
    SCREEN_NAME as EDIT_SCREEN_NAME, 
} from '../screens/EditList/EditShoppingListScreen';
import ShoppingListsOverviewScreen, {ScreenOptions as shoppingListOverviewScreenOptions} from '../screens/ShoppingListsOverviewScreen';

import EditShoppingListNavigator from './EditListNavigator';

import IconsNames from '../defs/IconsNames';

export const ShoppingListsNavigator = () => {
    return (
        <ShoppingListsStackNavigator.Navigator>
            <ShoppingListsStackNavigator.Screen
                name="CurrentShoppingList"
                component={CurrentShoppingListScreen}
                options={currentShoppingListScreenOptions}
            />
            <ShoppingListsStackNavigator.Screen
                name={EDIT_SCREEN_NAME}
                component={EditShoppingListScreen}
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
                name={EDIT_SCREEN_NAME}
                component={EditShoppingListScreen}
                options={editShoppingListScreenOptions}
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