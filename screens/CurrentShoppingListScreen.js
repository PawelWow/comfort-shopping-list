import React, {useEffect} from 'react';
import {View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadCurrentList, loadLists } from '../store/lists-actions';

import MenuHeaderButton from '../components/MenuHeaderButton';

const CurrentShoppingListScreen = () => {
    const areListsLoaded = useSelector(state => state.shoppingLists.length > 0 );
    const currentList = useSelector(state => state.shoppingLists.find(list => list.id === state.currentShoppingListId));

    const dispatch = useDispatch();

    useEffect(() => {
        if(!areListsLoaded){
            dispatch(loadLists());
        }

        if(!currentList){
            dispatch(loadCurrentList());
        }
    }, [currentList, areListsLoaded, dispatch]);

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
