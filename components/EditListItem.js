import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Input from './Input';
import Item from '../models/Item';
import IconsNames from '../defs/IconsNames';
import Colors from '../defs/Colors';
import Platform from '../defs/Platform';

const EditListItem = props => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [itemContent, setItemContent] = useState(props.value);
    const inputRef = useRef();

    useEffect(() => {
        if(isEditMode && inputRef){
            inputRef.current.focus();
        }
    }, [isEditMode, inputRef])

    const onInputChange = (itemId, itemValue, itemValidity) => {
        setItemContent(itemValue);
        props.onChange(new Item(itemId, itemValue, props.isDone), itemValidity);
    };    

    if(isEditMode)
    {
        return (
            <Input
                ref={inputRef}
                id={props.id}
                initialValue={itemContent}
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

    return (
        <View style={styles.container}>
            <Text style={props.isDone ? { ...styles.listItem, ...styles.listItemDone } : styles.listItem}
                onPress={() => setIsEditMode(true)}
            >{itemContent}</Text>
            <Ionicons
                name={IconsNames.remove}
                size={23}
                color={Platform.isAndroid ? 'black' : Colors.primary}
                onPress={props.onRemove}
            />
        </View>
)
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        
    },
    listItem: {
        borderColor: '#ccc',
        backgroundColor: '#fefee3',
        borderWidth: 1,
        padding: 5,
        margin: 2,
        flex: 1,
    },
    listItemDone: {
        textDecorationLine: 'line-through'
    }, 
});

export default EditListItem;