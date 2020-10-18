import React, {
    useReducer,
    useState,
    useEffect,
    useCallback
 } from 'react';
import {
    View,
    StyleSheet,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Button,
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import ControlsIds from '../../defs/ControlsIds';
import * as listActions from '../../store/lists-actions';

import MenuHeaderButton from '../../components/UI/Buttons/MenuHeaderButton';
import SaveHeaderButton from '../../components/UI/Buttons/SaveHeaderButton';
import DateTimeOptions from '../../components/DateTimeOptions';
import Input from '../../components/UI/Input';
import SwitchOption from '../../components/UI/SwitchOption';
import Platform from '../../defs/Platform';

import {SCREEN_NAME as SCREEN_NAME_EDIT_ITEMS} from './EditListItemsScreen';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const FORM_SWITCH_UPDATE = 'FORM_SWITCH_UPDATE';
const EXISTING_ITEMS_CHANGE = 'EXISTING_ITEMS_CHANGE';

const editListReducer = (state, action ) => {
    switch(action.type) {
        case FORM_INPUT_UPDATE:
            const updatedValues = { ...state.inputValues, [action.input]: action.value };
            const updatedValidities = { ...state.inputValidities, [action.input]: action.isValid };
        
            let updatedFormIsValid = true;
            for( const key in updatedValidities) {
                updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
            }
        
            return {
                formIsValid: updatedFormIsValid,
                inputValidities: updatedValidities,
                inputValues: updatedValues,
                inputUpdatedItems: state.inputUpdatedItems,
                switchValues: state.switchValues
            }
        case EXISTING_ITEMS_CHANGE:
            return {
                formIsValid: state.formIsValid,
                inputValidities: state.inputValidities,
                inputValues: state.inputValues,
                inputUpdatedItem: {
                    ...state.inputUpdatedItems,
                    [ControlsIds.editedItems]: action[ControlsIds.editedItems],
                    [ControlsIds.deletedItems]: action[ControlsIds.deletedItems]
                },
                switchValues: state.switchValues
            }         
        case FORM_SWITCH_UPDATE:
            return {
                formIsValid: state.formIsValid,
                inputValidities: state.inputValidities,
                inputValues: state.inputValues,
                inputUpdatedItems: state.inputUpdatedItems,
                switchValues: { ...state.switchValues, [action.switch]: action.value }
            }
        default:
            return state;
    }
};


const EditShoppingListScreen = props => {
    const [error, setError] = useState();

    const listId = props.route.params ? props.route.params.listId : null;
    const editedList = useSelector(state => state.shoppingLists.find(list => list.id === listId));
    const anyCurrentList = useSelector(state => !!state.currentShoppingListId);
    
    // Czy mamy resetować formularz? 
    const [shouldReset, setShouldReset] = useState(false);

    const dispatch = useDispatch();

    const [listState, dispatchListState] = useReducer(editListReducer, {
        inputValues: {
            [ControlsIds.title]: editedList ? editedList.title : '',
            [ControlsIds.content]: '',
            [ControlsIds.shoppingDate]: editedList ? new Date(editedList.shoppingTimeOptions.shoppingDate) : new Date(),
            [ControlsIds.reminderHours]: editedList ? editedList.shoppingTimeOptions.reminderHours : '0',
            [ControlsIds.reminderMinutes]: editedList ? editedList.shoppingTimeOptions.reminderMinutes : '0',
        },
        inputUpdatedItems: {            
            [ControlsIds.editedItems]:  [], // array of Item()
            [ControlsIds.deletedItems]: [], // ids of deleted items
        },
        inputValidities: {
            [ControlsIds.title]: !!editedList,
            [ControlsIds.content]: !!editedList
        },
        switchValues: {
            [ControlsIds.isShoppingScheduled]: editedList ? editedList.shoppingTimeOptions.isShoppingScheduled : false,
            [ControlsIds.isReminderSet]: editedList ? editedList.shoppingTimeOptions.isReminderSet : false,
            [ControlsIds.remindOnTime]: editedList ? editedList.shoppingTimeOptions.remindOnTime : true,
        },

        formIsValid: !!editedList
    });

    useEffect(() => {
        if(error) {
            Alert.alert('An error occured!', error, [{ text: 'OK' }]);            
        }
    }, [error]);

    // Wykonuje akcję dodawania nowej listy
    const onFormSubmit = useCallback(async () => {

        if(!listState.formIsValid){
            Alert.alert('Wrong data', 'Check the error in the form.', [ {text: 'OK '}]);
            return;
        }

        try {

            if(editedList) {
                await dispatch(listActions.editList(
                    editedList.id,
                    listState.inputValues.title,
                    listState.inputValues.content,
                    editedList.items,
                    listState.inputUpdatedItems[ControlsIds.editedItems],
                    listState.inputUpdatedItems[ControlsIds.deletedItems],
                    editedList.creationDate,
                    listState.switchValues.isShoppingScheduled,
                    listState.inputValues.shoppingDate,
                    listState.switchValues.isReminderSet,
                    listState.switchValues.remindOnTime,
                    listState.inputValues.reminderHours,
                    listState.inputValues.reminderMinutes
                ));
            }
            else 
            {
                // add new one
                await dispatch(listActions.addList(            
                    listState.inputValues.title,
                    listState.inputValues.content,
       
                    listState.switchValues.isShoppingScheduled,
                    listState.inputValues.shoppingDate,
                    listState.switchValues.isReminderSet,
                    listState.switchValues.remindOnTime,
                    listState.inputValues.reminderHours,
                    listState.inputValues.reminderMinutes,
                    anyCurrentList
                ));  
            }

            
            setShouldReset(true); 

            props.navigation.goBack();
            
            // TODO needed?
            setShouldReset(false);         
            
        } catch (err) {
            setError(err.message);
        }


    }, [dispatch, listState]);

    // Przycisk zapisywania po prawej w headerze
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => <SaveHeaderButton onPress={onFormSubmit} />
        });
    }), [onFormSubmit];
    
    const onInputChange = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            
            dispatchListState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            });
        },
        [dispatchListState]
    );

    React.useEffect(() => {
        if (props.route.params?.itemsEdition) {
            console.log('goo');
            console.log('edited');
            console.log(itemsEdition.editedItems);
            console.log('deleted');
            console.log(itemsEdition.deletedItems);
            dispatchListState({
                type: EXISTING_ITEMS_CHANGE,
                [ControlsIds.editedItems]: itemsEdition.editedItems,
                [ControlsIds.deletedItems]: itemsEdition.deletedItems
             });
         }
      }, [props.route.params?.itemsEdition, dispatchListState]);    

    const onSwitchChange = useCallback((switchId, switchValue) => {
        dispatchListState({
            type: FORM_SWITCH_UPDATE,
            value: switchValue,
            switch: switchId
        });
    }, [dispatchListState]);

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.isAndroid ? 'height' : 'padding'}
            keyboardVerticalOffset={30}
        >
            <ScrollView>
                <View style={styles.screen}>
                    <Input
                        id={ControlsIds.title}
                        label="Title"
                        initialValue={editedList ? editedList.title : ''}
                        initiallyValid={!!editedList}
                        errorMessage="Enter a title"
                        keyboardType="default"
                        autCapitalize="sentences"
                        autoCorrect
                        returnKeyType="next"
                        shouldReset={shouldReset}
                        onInputChange={onInputChange}
                        required
                    />

                    <Input
                        id={ControlsIds.content}
                        label={editedList ? "Additional content" : 'Content'}
                        initialValue=''
                        initiallyValid={true}
                        keyboardType="default"
                        autoCapitalize="sentences"
                        autoCorrect
                        multiline
                        shouldReset={shouldReset}
                        numberOfLines={5}
                        onInputChange={onInputChange}                                             
                    />

                    {editedList && editedList.items.length > 0 && (
                        <Button title="Manage existing items" onPress={() => {
                            props.navigation.navigate(SCREEN_NAME_EDIT_ITEMS, {
                                existingItems: editedList.items,
                                goBackScreenName: SCREEN_NAME
                            });
                        }} />
                    )}

                                   
                </View>
                <SwitchOption
                    id={ControlsIds.isShoppingScheduled}
                    label="Set shopping time options:"
                    initialValue={editedList ? editedList.shoppingTimeOptions.isShoppingScheduled : false}
                    onSwitchChange={onSwitchChange}
                    shouldReset={shouldReset}
                />
                { listState.switchValues.isShoppingScheduled 
                    && <DateTimeOptions
                        onDataChange={onInputChange}
                        onOptionsChange={onSwitchChange}
                        initialValues={{
                            shoppingDate: editedList ? new Date(editedList.shoppingTimeOptions.shoppingDate) : new Date(),
                            isReminderSet: editedList ? editedList.shoppingTimeOptions.isReminderSet : false,
                            remindOnTime: editedList ? editedList.shoppingTimeOptions.remindOnTime : true,
                            reminderHours: editedList ? editedList.shoppingTimeOptions.reminderHours.toString() : '0',
                            reminderMinutes:  editedList ? editedList.shoppingTimeOptions.reminderMinutes.toString() : '0'
                        }} 
                        editMode={!!editedList}
                        shouldReset={shouldReset}
                    />
                }
                
            </ScrollView>

        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    screen: {
        margin: 20
    }
});

export const ScreenOptions = navData => {
    const routeParams = navData.route.params ? navData.route.params : {};

    if( routeParams.listId ){
        return {
            headerTitle: 'Edit list'
        }
    }

    return {
        headerTitle: 'Create a new list',
        headerLeft: () => <MenuHeaderButton onPress={() => navData.navigation.toggleDrawer() } />
    }
};

export const SCREEN_NAME = 'EditShoppingList';

export default EditShoppingListScreen;