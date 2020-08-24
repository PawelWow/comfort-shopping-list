import React from 'react';
import {View, Text, StyleSheet } from 'react-native';

import MenuHeaderButton from '../components/MenuHeaderButton';

const NewShoppingListScreen = () => {
    return (
        <View style={styles.screen}><Text>Create new list</Text></View>
    );
};

const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
});

export const ScreenOptions = navData => {
    return {
        headerTitle: 'Create a new list',
        headerLeft: () => <MenuHeaderButton onPress={() => navData.navigation.toggleDrawer() } />
    }
};

export default NewShoppingListScreen;