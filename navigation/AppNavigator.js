import React from 'react';

import { NavigationContainer } from '@react-navigation/native';

import { MenuNavigator } from './ShoppingListsNavigator';

const AppNavigator = () => {

    return (
        <NavigationContainer>
            <MenuNavigator />
        </NavigationContainer>
    );
};

export default AppNavigator;