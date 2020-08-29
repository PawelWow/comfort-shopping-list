import React, { useEffect } from 'react';
import  { useSelector, useDispatch } from 'react-redux';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import * as listsActions from '../store/lists-actions';
import MenuHeaderButton from '../components/MenuHeaderButton';

const ShoppingListsOverviewScreen = () => {
    const shoppingLists = useSelector(state => state.shoppingLists);
    
    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(listsActions.loadLists());
    }, [dispatch])


    return (
        <View style={styles.screen}><Text>Shopping lists</Text>
        <FlatList
            data={shoppingLists}
            keyExtractor={item => item.id.toString()}
            renderItem={ listData => {

                return (
                    <View>
                        <Text>Title: {listData.item.title}</Text>
                        <Text>Items:</Text>
                        <FlatList 
                            data={listData.item.items}
                            keyExtractor={item => item.id.toString()}
                            renderItem={ itemData => {

                                return (
                                    <View><Text>{itemData.item.content}</Text></View>
                                    
                                    );
                                 } }
                        />
                    </View>
                );
            } }            
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