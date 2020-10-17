import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FlatList, View, Text, StyleSheet, Button, Alert } from 'react-native';

import ListItem from './Items/ListItem';
import { SCREEN_NAME as SCREEN_NAME_EDIT } from '../screens/EditList/EditShoppingListScreen';

import { saveListAsCurrent, setAsNotCurrentList, removeList, setItemDone } from '../store/lists-actions';

const List = props => {
    const [error, setError] = useState();
    const currentListId = useSelector(state => state.currentShoppingListId);

    const dispatch = useDispatch();

    const onDeleteListPress = useCallback(async id => {

        try {
            await dispatch(removeList(id));
        } catch (err) {
            setError(err.message);
        }
    }, [dispatch]);

    const onEditListPress = id => {
        props.navigation.navigate(SCREEN_NAME_EDIT, {listId: id});
    };

    const onSetListAsCurrent = useCallback(
        async listId => {
            try {
                await dispatch(saveListAsCurrent(listId));
            } catch (err) {
                setError(err.message);            
            }
        },
        [dispatch],
    );

    const onSetListNotCurrent = useCallback(
        async listId => {
            try {
                await dispatch(setAsNotCurrentList(listId));
            } catch (err) {
                setError(err.message);
            }
        },
        [dispatch],
    );

    const onItemDoneSet = useCallback(
        (listId, itemId, isDone) => {
            try {
                dispatch(setItemDone(listId, itemId, isDone))
            } catch (err) {
                setError(err.message);                
            }
        },
        [dispatch],
    )

    useEffect(() => {
        if(error) {
            Alert.alert('An error occured!', error, [{ text: 'OK' }]);
        }
    }, [error]);

    const showShoppingDate = timeOptions => {
        if(!timeOptions.isShoppingScheduled)
        {
            return;
        }

        return(
            <View>
                <Text>Shopping time: {timeOptions.shoppingDate.toString()}</Text>
                {showReminderOptions(timeOptions)}
            </View>
    
        );  
    };
    
    const showReminderOptions = timeOptions => {
        if(!timeOptions.isReminderSet) {
            return;
        }
    
        return (
            <View>
                <Text>Remind on time: {timeOptions.remindOnTime.toString()}</Text>
                <Text>Remind {timeOptions.reminderHours} hours and {timeOptions.reminderMinutes} before shopping date.</Text>
            </View>
        );
    };

    const showButtonSection = useCallback(() => {
        const listId = props.data.id;
        return (
            <View style={styles.buttonsContainer}>                
                <Button title="Delete" onPress={() => { onDeleteListPress(listId) }} />
                { listId === currentListId ? (
                    <Button color="red" title="Set not current" onPress={() => { onSetListNotCurrent(listId) }} />
                ) : (
                    <Button title="Set as current" onPress={() => { onSetListAsCurrent(listId) }} />
                )}
                <Button title="Edit" onPress={() => { onEditListPress(listId) }} />
            </View>
        );
    }, [currentListId]);

    const listId = props.data.id;
    return (
        <View style={styles.list}>
            <Text style={styles.title}>{props.data.title}</Text>
            <FlatList 
                    data={props.data.items}
                    keyExtractor={item => item.id.toString()}
                    renderItem={itemData => <ListItem
                            listId={listId}
                            id={itemData.item.id}
                            content={itemData.item.content}
                            isDone={itemData.item.isDone}
                            order={itemData.item.order}
                            onIsDoneChange={onItemDoneSet}
                            style={styles.listItem}
                        /> 
                    }
                />
            { showShoppingDate(props.data.shoppingTimeOptions) }
            {props.showButtons && listId === currentListId && <Text>Your current list.</Text>}
            {props.showButtons && showButtonSection()}
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
    },
    buttonsContainer: {
        flex: 1,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15,        
    },
    listItem: {
        backgroundColor: '#fefee3',
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
    },
});

export default List;