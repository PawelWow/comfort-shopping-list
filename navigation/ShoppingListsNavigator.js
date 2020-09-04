import React from 'react';
import { View, SafeAreaView } from 'react-native';

import { Ionicons } from '@expo/vector-icons';

import { createStackNavigator } from '@react-navigation/stack';
import { createDrawerNavigator, DrawerItemList  } from '@react-navigation/drawer';

import CurrentShoppingListScreen, {ScreenOptions as currentShoppingListScreenOptions, ScreenOptions} from '../screens/CurrentShoppingListScreen';
import EditShoppingListScreen, {ScreenOptions as editShoppingListScreenOptions} from '../screens/EditShoppingListScreen';
import ShoppingListsOverviewScreen, {ScreenOptions as shoppingListOverviewScreenOptions} from '../screens/ShoppingListsOverviewScreen';

import IconsNames from '../defs/IconsNames';

const NewShoppingListStackNavigator = createStackNavigator();

export const NewShoppingListNavigator = () => {
    return(
        <NewShoppingListStackNavigator.Navigator>
            <NewShoppingListStackNavigator.Screen
                name="NewShoppingList"
                component={EditShoppingListScreen}
                options={editShoppingListScreenOptions}
            />
        </NewShoppingListStackNavigator.Navigator>
    );
}

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
                name="NewShoppingList"
                component={NewShoppingListNavigator}
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
                name="NewShoppingList"
                component={NewShoppingListNavigator}
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
                name="Latest list"
                component={ShoppingListsNavigator}
                options={() => createDrawerIcon(IconsNames.paper)} 
                />
            <MenuDrawerNavigator.Screen
                name="New shopping list"
                component={NewShoppingListNavigator}
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