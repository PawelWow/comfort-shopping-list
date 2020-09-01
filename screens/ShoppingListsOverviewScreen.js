import React, { useEffect } from 'react';
import  { useSelector, useDispatch } from 'react-redux';
import { View, StyleSheet, FlatList } from 'react-native';

import * as listsActions from '../store/lists-actions';
import MenuHeaderButton from '../components/MenuHeaderButton';
import List from '../components/List';

const ShoppingListsOverviewScreen = () => {
    const shoppingLists = useSelector(state => state.shoppingLists);
    
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listsActions.loadLists());
    }, [dispatch])


    return (
        <View style={styles.screen}>
            <FlatList
                data={shoppingLists}
                keyExtractor={item => item.id.toString()}
                renderItem={list => <List data={list.item} />   }
            />                  
        </View>
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