import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Input from './Input';
import Item from '../models/Item';
import IconsNames from '../defs/IconsNames';
import Colors from '../defs/Colors';
import Platform from '../defs/Platform';

import ListItem from './ListItem';

const EditListItem = props => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [itemContent, setItemContent] = useState(props.value);
    const [isDeleted, setIsDeleted] = useState(false);

    const inputRef = useRef();

    useEffect(() => {
        if(isEditMode && inputRef){
            inputRef.current.focus();
        }
    }, [isEditMode, inputRef]);

    const onTextPress = () => {
        if(isDeleted){
            // cannot edit deleted items
            return;
        }

        setIsEditMode(true);
    };

    const onInputChange = (itemId, itemValue, itemValidity) => {
        setItemContent(itemValue);
        props.onChange(new Item(itemId, itemValue, props.isDone), itemValidity);
    };
    
    const onRemove = () => {
        setIsDeleted(true);
        props.onRemove();
    }

    const onRestore = () => {
        setIsDeleted(false);
        props.onRestore();
    }

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
                editable={!isDeleted}
                shouldReset={false}
                onInputChange={onInputChange}    
                onInputBlur={() => setIsEditMode(false)}                                         
            /> 
        );
    }

    return (
        <View style={styles.container}>
            <ListItem
                content={itemContent}
                style={styles.listItem}
                isDeleted={isDeleted}
                isDone={props.isDone}
                onTextPress={onTextPress}
            />

            { isDeleted ? (
                <Ionicons
                    name={IconsNames.add}
                    size={23}
                    color={Platform.isAndroid ? 'green' : Colors.primary}
                    onPress={onRestore}
                />
            ) : (
                <Ionicons
                    name={IconsNames.remove}
                    size={23}
                    color={Platform.isAndroid ? 'red' : Colors.accent}
                    onPress={onRemove}
                />
            )}

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
        margin: 5,
    },
});

export default EditListItem;