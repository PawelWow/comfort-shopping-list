import React from 'react';

import { FlatList, View, Text, StyleSheet } from 'react-native';

import ListItem from './ListItem';

const List = props => {
    return (
        <View style={styles.list}>
            <Text style={styles.title}>{props.title}</Text>
            <FlatList 
                    data={props.items}
                    keyExtractor={item => item.id.toString()}
                    renderItem={ itemData =>  <ListItem content={itemData.item.content} /> }
                />
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        borderColor: '#ccc',
        borderWidth: 1,
        backgroundColor: '#fefee3',
        paddingVertical: 15,
        paddingHorizontal: 5,        
        marginBottom: 20,

        shadowColor: 'black',
        shadowOpacity: 0.26,
        shadowOffset: {width: 0, height: 2},
        shadowRadius: 8,
        elevation: 5,        
    },
    title: {
        color: 'black',
        fontSize: 18,
        marginBottom: 5
    }
});

export default List;