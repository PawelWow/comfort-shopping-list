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
    Text
} from 'react-native';

import { useDispatch, useSelector } from 'react-redux';

import ControlsIds from '../defs/ControlsIds';
import * as listActions from '../store/lists-actions';

import MenuHeaderButton from '../components/MenuHeaderButton';
import SaveHeaderButton from '../components/SaveHeaderButton';
import DateTimeOptions from '../components/DateTimeOptions';
import Input from '../components/Input';
import EditListItem from '../components/EditListItem';
import SwitchOption from '../components/SwitchOption';
import Platform from '../defs/Platform';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const FORM_SWITCH_UPDATE = 'FORM_SWITCH_UPDATE';
const FORM_EXISTING_ITEMS_UPDATE = 'FORM_EXISTING_ITEMS_UPDATE';
const FORM_EXISTING_ITEMS_DELETE = 'FORM_EXISTING_ITEMS_DELETE';
const FORM_DELETED_ITEM_RESTORE = 'FORM_DELETED_ITEM_RESTORE';

const formReducer = (state, action ) => {
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
        case FORM_EXISTING_ITEMS_UPDATE: 
            const filteredItems = state.inputUpdatedItems[ControlsIds.editedItems].filter(item => item.id !== action.item.id);
            return {
                formIsValid: state.formIsValid,
                inputValidities: state.inputValidities,
                inputValues: state.inputValues,
                inputUpdatedItems: { ...state.inputUpdatedItems, [ControlsIds.editedItems]: [...filteredItems, action.item]},
                switchValues: state.switchValues
            }
        case FORM_EXISTING_ITEMS_DELETE: 
            const itemsToDelete  = [...state.inputUpdatedItems[ControlsIds.deletedItems], action.itemId];
            return {
                formIsValid: state.formIsValid,
                inputValidities: state.inputValidities,
                inputValues: state.inputValues,
                inputUpdatedItems: { ...state.inputUpdatedItems,  [ControlsIds.deletedItems]: itemsToDelete },
                switchValues: state.switchValues                
            }
        case FORM_DELETED_ITEM_RESTORE:
            const deletedItems = state.inputUpdatedItems[ControlsIds.deletedItems].filter(itemId => itemId !== action.itemId);
            return {
                formIsValid: state.formIsValid,
                inputValidities: state.inputValidities,
                inputValues: state.inputValues,
                inputUpdatedItems: { ...state.inputUpdatedItems,  [ControlsIds.deletedItems]: deletedItems },
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
    
    // Czy mamy resetować formularz? 
    const [shouldReset, setShouldReset] = useState(false);

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
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
    // TODO - na razie tylko wraca do poprzedniej strony
    const onFormSubmit = useCallback(async () => {

        if(!formState.formIsValid){
            Alert.alert('Wrong data', 'Check the error in the form.', [ {text: 'OK '}]);
            return;
        }

        try {

            if(editedList) {
                await dispatch(listActions.editList(
                    editedList.id,
                    formState.inputValues.title,
                    formState.inputValues.content,
                    editedList.items,
                    formState.inputUpdatedItems[ControlsIds.editedItems],
                    formState.inputUpdatedItems[ControlsIds.deletedItems],
                    editedList.creationDate,
                    formState.switchValues.isShoppingScheduled,
                    formState.inputValues.shoppingDate,
                    formState.switchValues.isReminderSet,
                    formState.switchValues.remindOnTime,
                    formState.inputValues.reminderHours,
                    formState.inputValues.reminderMinutes
                ));
            }
            else 
            {
                // add new one
                await dispatch(listActions.addList(            
                    formState.inputValues.title,
                    formState.inputValues.content,
       
                    formState.switchValues.isShoppingScheduled,
                    formState.inputValues.shoppingDate,
                    formState.switchValues.isReminderSet,
                    formState.switchValues.remindOnTime,
                    formState.inputValues.reminderHours,
                    formState.inputValues.reminderMinutes
                ));  
            }

            
            setShouldReset(true); 
            props.navigation.goBack(); 
            setShouldReset(false);         
            
        } catch (err) {
            setError(err.message);
        }


    }, [dispatch, formState]);

    // Przycisk zapisywania po prawej w headerze
    useEffect(() => {
        props.navigation.setOptions({
            headerRight: () => <SaveHeaderButton onPress={onFormSubmit} />
        });
    }), [onFormSubmit];
    
    const onInputChange = useCallback(
        (inputIdentifier, inputValue, inputValidity) => {
            
            dispatchFormState({
                type: FORM_INPUT_UPDATE,
                value: inputValue,
                isValid: inputValidity,
                input: inputIdentifier
            });
        },
        [dispatchFormState]
    );

    // 
    const onExistingItemsChange = useCallback(
        (item, itemValidity) => {
            dispatchFormState({
                type: FORM_EXISTING_ITEMS_UPDATE,
                item: item,
                isValid: itemValidity,
            });
        },
        [dispatchFormState]
    );

    const onRemoveExistingItem = useCallback(itemId => {
        dispatchFormState({
            type: FORM_EXISTING_ITEMS_DELETE,
            itemId: itemId
        });
    }, [dispatchFormState]);

    const onRestoreDeletedItem = useCallback(itemId => {
        dispatchFormState({
            type: FORM_DELETED_ITEM_RESTORE,
            itemId: itemId
        });
    }, [dispatchFormState]);

    const onSwitchChange = useCallback((switchId, switchValue) => {
        dispatchFormState({
            type: FORM_SWITCH_UPDATE,
            value: switchValue,
            switch: switchId
        });
    }, [dispatchFormState]);

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

                    {editedList && (
                        <View style={styles.itemsContainer}>
                            <Text>Items</Text>
                            { editedList.items.map(item => <EditListItem
                                    key={item.id}
                                    id={item.id}
                                    value={item.content}
                                    isDone={item.isDone}
                                    onChange={onExistingItemsChange}
                                    onRemove={() => { onRemoveExistingItem(item.id) }}
                                    onRestore={() => { onRestoreDeletedItem(item.id)  }}
                                /> )
                            }
                        </View>
                    )}                   

                                   
                </View>
                <SwitchOption
                    id={ControlsIds.isShoppingScheduled}
                    label="Set shopping time options:"
                    initialValue={editedList ? editedList.shoppingTimeOptions.isShoppingScheduled : false}
                    onSwitchChange={onSwitchChange}
                    shouldReset={shouldReset}
                />
                { formState.switchValues.isShoppingScheduled 
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
    },
    itemsContainer: {
        marginTop: 20
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