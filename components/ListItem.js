import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

const ListItem = props => {
    const  getItemStyle = () => {
        if(props.isDeleted){
            return {...styles.container, ...props.style, ...styles.listItemDeleted};
        }
    
        return {...styles.container, ...props.style};
    }
    
    // get text style accorrding to input state
    const getItemTextStyle = () => {
        if(props.isDeleted) {
            return styles.listItemTextDeleted;
        }
    
        if(props.isDone) {
            return styles.listItemTextDone;
        }
    
        return {flex: 1};
    }


    return (
        <View style={getItemStyle()}>
            <Text style={getItemTextStyle()} onPress={props.onTextPress}>{props.content}</Text>
            { props.isDeleted && <Text style={styles.listItemTextDeletedMarkup}>  (deleted)</Text>}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        
    },
    listItemDeleted: {
        backgroundColor: '#eee',
    },

    listItemTextDone: {
        textDecorationLine: 'line-through'
    }, 
    listItemTextDeleted: {
        textDecorationLine: 'line-through',
        borderColor: '#ccc',
        color: 'red',
        fontStyle: 'italic',
    },
    listItemTextDeletedMarkup: {
        color: 'red',
        fontStyle: 'italic',        
        flex: 1
    }
});

export default ListItem;