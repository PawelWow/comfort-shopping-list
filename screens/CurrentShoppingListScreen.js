import React from 'react';
import {View, Text, StyleSheet } from 'react-native';

import MenuHeaderButton from '../components/MenuHeaderButton';

const CurrentShoppingListScreen = () => {
    return (
        <View style={styles.screen}><Text>Current shopping list</Text></View>
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
