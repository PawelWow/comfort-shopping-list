import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Input from '../UI/Input';
import Item from '../../models/Item';
import IconsNames from '../../defs/IconsNames';
import Colors from '../../defs/Colors';
import Platform from '../../defs/Platform';

import ListItem from './ListItem';

const EditListItem = props => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [itemContent, setItemContent] = useState(props.value);
    const [itemDone, setItemDone] = useState(props.isDone);

    const inputRef = useRef();

    const isDeleted = useRef(false);
    const setIsDeleted = data => {
        isDeleted.current = data;
    }

    useEffect(() => {
        if(isEditMode && inputRef){
            inputRef.current.focus();
        }
    }, [isEditMode, inputRef]);

    const onItemPress = () => {
        if(isDeleted.current){
            // cannot edit deleted items
            return;
        }

        setIsEditMode(true);
    };

    const onInputChange = (itemId, itemValue, itemValidity) => {
        setItemContent(itemValue);
        props.onChange(new Item(itemId, itemValue, itemDone, props.order), itemValidity);
    };

    const onItemDoneChange = (itemId, isDone) => {
        setItemDone(isDone);
        props.onChange(new Item(itemId, itemContent, isDone, props.order));
    }
    
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
                editable={!isDeleted.current}
                shouldReset={false}
                onInputChange={onInputChange}    
                onInputBlur={() => setIsEditMode(false)}                                         
            /> 
        );
    }

    return (
        <View style={styles.container}>
            <ListItem
                id={props.id}
                content={itemContent}
                style={styles.listItem}
                isDeleted={isDeleted.current}
                isDone={itemDone}
                order={props.order}
                onItemPress={onItemPress}
                onIsDoneChange={onItemDoneChange}
            />

            { isDeleted.current ? (
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