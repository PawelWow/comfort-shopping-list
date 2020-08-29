import React from 'react';
import  { useSelector } from 'react-redux';
import { View, Text, StyleSheet, FlatList } from 'react-native';

import MenuHeaderButton from '../components/MenuHeaderButton';

const ShoppingListsOverviewScreen = () => {
    const shoppingLists = useSelector(state => state.shoppingLists);
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
                                console.log('inside flat list') ;
                                console.log(itemData.item);
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