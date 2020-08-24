import React from 'react';
import {View, Text, StyleSheet } from 'react-native';

import MenuHeaderButton from '../components/MenuHeaderButton';

const ShoppingListsOverviewScreen = () => {
    return (
        <View style={styles.screen}><Text>Shopping lists</Text></View>
    );
};

const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
});

export const ScreenOptions = navData => {
    return {
        headerTitle: 'Your shopping lists',
        headerLeft: () => <MenuHeaderButton onPress={() => navData.navigation.toggleDrawer() } />
    }
};

export default ShoppingListsOverviewScreen;