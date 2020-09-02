import React, { useCallback, useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';

import { FlatList, View, Text, StyleSheet, Button, Alert } from 'react-native';

import ListItem from './ListItem';

import { removeList } from '../store/lists-actions';

const List = props => {
    const [error, setError] = useState();

    const dispatch = useDispatch();

    const onDeleteListPress = useCallback(async id => {

        try {
            await dispatch(removeList(id));
        } catch (err) {
            setError(err.message);
        }
    }, [dispatch]);

    useEffect(() => {
        if(error) {
            Alert.alert('An error occured!', error, [{ text: 'OK' }]);
        }
    }, [error])

    const showShoppingDate = timeOptions => {
        if(!timeOptions.isShoppingScheduled)
        {
            return;
        }

        return(
            <View>
                <Text>Shopping time: {timeOptions.shoppingDate}</Text>
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

    return (
        <View style={styles.list}>
            <Text style={styles.title}>{props.data.title}</Text>
            <FlatList 
                    data={props.data.items}
                    keyExtractor={item => item.id.toString()}
                    renderItem={ itemData =>  <ListItem content={itemData.item.content} /> }
                />
            { showShoppingDate(props.data.shoppingTimeOptions) }
            <View style={styles.buttonsContainer}>
                <Button title="Delete" onPress={() => { onDeleteListPress(props.data.id) }} />
                <Button title="Set as current" onPress={() => {}} />
                <Button title="Edit" onPress={() => {}} />
            </View>
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
    }
});

export default List;