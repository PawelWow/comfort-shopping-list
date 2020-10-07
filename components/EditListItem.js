import React, { useState, useRef, useEffect } from 'react';

import { Text, StyleSheet } from 'react-native';

import Input from './Input';
import Item from '../models/Item';

const EditListItem = props => {
    const [isEditMode, setIsEditMode] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        if(isEditMode && inputRef){
            inputRef.current.focus();
        }
    }, [isEditMode, inputRef])

    const onInputChange = (itemId, itemValue, itemValidity) => {
        props.onChange(new Item(itemId, itemValue, props.isDone), itemValidity);
    };    

    if(isEditMode)
    {
        return (
            <Input
                ref={inputRef}
                id={props.id}
                initialValue={props.value}
                initiallyValid
                keyboardType="default"
                autoCapitalize="sentences"
                autoCorrect
                shouldReset={false}
                onInputChange={onInputChange}    
                onInputBlur={() => setIsEditMode(false)}                                         
            /> 
        );
    }

    return <Text style={props.isDone ? { ...styles.listItem, ...styles.listItemDone } : styles.listItem}
                onPress={() => setIsEditMode(true)}
            >{props.value}</Text>
};

const styles = StyleSheet.create({
    listItem: {
        borderColor: '#ccc',
        backgroundColor: '#fefee3',
        borderWidth: 1,
        padding: 5,
        margin: 2
    },
    listItemDone: {
        textDecorationLine: 'line-through'
    },  

});

export default EditListItem;