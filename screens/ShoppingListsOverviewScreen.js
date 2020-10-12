import React, { useEffect } from 'react';
import  { useSelector, useDispatch } from 'react-redux';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import * as listsActions from '../store/lists-actions';
import MenuHeaderButton from '../components/MenuHeaderButton';
import List from '../components/List';

const ShoppingListsOverviewScreen = props => {
    const shoppingLists = useSelector(state => state.shoppingLists);
    
    const dispatch = useDispatch();

    useEffect(() => {
        if(shoppingLists.length > 0){
            return;
        }

        dispatch(listsActions.loadLists());
            
    }, [dispatch])

    const showShoppingListsSection = () => {
        if(shoppingLists.length > 0)
        {
            return(
                <FlatList
                    data={shoppingLists}
                    keyExtractor={item => item.id.toString()}
                    renderItem={list => <List data={list.item} navigation={props.navigation} showButtons />   }
                />  
            );
        }

        return (
            <View>
                <Text>No list created yet.</Text>
            </View>
        );
    }

    return (
        <View style={styles.screen}>
                {showShoppingListsSection()}
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