import React from 'react';
import {View, Text, StyleSheet } from 'react-native';
import { useSelector } from 'react-redux';

import MenuHeaderButton from '../components/MenuHeaderButton';

const CurrentShoppingListScreen = () => {
    const currentList = useSelector(state => state.shoppingLists.find(list => list.id === state.currentShoppingListId));

    if(!currentList){
        return <View style={styles.screen}><Text>No current list set yet. Go to your lists and set one.</Text></View>
    }

    return (
        <View style={styles.screen}><Text>Current shopping list '{currentList.title}'</Text></View>
    );
};

const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
});

export const ScreenOptions = navData => {
    return {
        headerTitle: 'Current shopping list',
        headerLeft: () => <MenuHeaderButton onPress={() => navData.navigation.toggleDrawer() } />
    }
};

export default CurrentShoppingListScreen;
