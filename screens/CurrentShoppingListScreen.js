import React, {useEffect} from 'react';
import {View, Text, StyleSheet } from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { loadCurrentList, loadLists } from '../store/lists-actions';
import List from '../components/List';

import MenuHeaderButton from '../components/MenuHeaderButton';

const CurrentShoppingListScreen = () => {
    const currentShoppingListId = useSelector(state => state.currentShoppingListId);
    const shoppingLists = useSelector(state => state.shoppingLists);
    const dispatch = useDispatch();

    useEffect(() => {

        if(shoppingLists.length > 0){
            return;
        }

        dispatch(loadLists());
        dispatch(loadCurrentList());

    }, [dispatch]);

    const currentList = shoppingLists.find(list => list.id === currentShoppingListId);

    if(!currentList){
        return <View style={styles.screen}><Text>No current list set yet. Go to your lists and set one.</Text></View>
    }

    return (
        <View style={styles.screen}><List data={currentList} /></View>
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
