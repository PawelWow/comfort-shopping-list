import React, { useState, useRef, useEffect } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import Input from '../../UI/Input';
import { Item } from '../../../models/Item';
import IconsNames from '../../../defs/IconsNames';
import Colors from '../../../defs/Colors';
import Platform from '../../../defs/Platform';

import ListItem from '../ListItem';

import { styles } from './EditListItemStyles';

const EditListItem = props => {
    const [isEditMode, setIsEditMode] = useState(false);
    const [itemContent, setItemContent] = useState(props.value);
    const [itemDone, setItemDone] = useState(props.isDone);
    const [isValid, setIsValid] = useState(true);

    const inputRef = useRef();

    const isDeleted = useRef(props.isDeleted);
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
        setIsValid(itemValidity);
        if(itemValidity){
            props.onChange(new Item(itemId, itemValue, itemDone, props.order), itemValidity);
        }        
    };

    const onItemDoneChange = (itemId, isDone) => {
        setItemDone(isDone);
        if(isValid) {
            props.onChange(new Item(itemId, itemContent, isDone, props.order));
        }
    };

    const onBlur = () => {
        if(!isValid){
            // TODO ERROR
            console.log('item is not valid...');
            return;
        }

        setIsEditMode(false);
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
                onInputBlur={onBlur}                                         
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
                onItemLongPress={props.onItemLongPress}
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

export default EditListItem;