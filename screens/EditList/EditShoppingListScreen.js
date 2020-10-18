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
import ItemsEditor from '../../components/Items/Lists/ItemsEditor';
import ItemsOrderEditor from '../../components/Items/Lists/ItemsOrderEditor';
import SwitchOption from '../../components/UI/SwitchOption';
import Platform from '../../defs/Platform';

import {SCREEN_NAME as SCREEN_NAME_EDIT_ITEMS} from './EditListItemsScreen';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const FORM_SWITCH_UPDATE = 'FORM_SWITCH_UPDATE';
const FORM_EXISTING_ITEMS_UPDATE = 'FORM_EXISTING_ITEMS_UPDATE';
const FORM_EXISTING_ITEMS_DELETE = 'FORM_EXISTING_ITEMS_DELETE';
const FORM_DELETED_ITEM_RESTORE = 'FORM_DELETED_ITEM_RESTORE';

// cached because we can delete edited items and restore them
const EDITED_ITEMS_CACHE = 'editedItemsCache';

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
            const filteredCachedItems = state.inputUpdatedItems[EDITED_ITEMS_CACHE].filter(item => item.id !== action.item.id);

            return {
                formIsValid: state.formIsValid,
                inputValidities: state.inputValidities,
                inputValues: state.inputValues,
                inputUpdatedItems: {
                    ...state.inputUpdatedItems,
                    [EDITED_ITEMS_CACHE]: [...filteredCachedItems, action.item],
                    [ControlsIds.editedItems]: [...filteredItems, action.item]
                },
                switchValues: state.switchValues
            }
        case FORM_EXISTING_ITEMS_DELETE: 
            const itemsToDelete  = [...state.inputUpdatedItems[ControlsIds.deletedItems], action.itemId];
            const itemsToUpdate = state.inputUpdatedItems[ControlsIds.editedItems].filter(item => item.id !== action.itemId);
            return {
                formIsValid: state.formIsValid,
                inputValidities: state.inputValidities,
                inputValues: state.inputValues,
                inputUpdatedItems: {
                    ...state.inputUpdatedItems,
                    [ControlsIds.editedItems]: itemsToUpdate,
                    [ControlsIds.deletedItems]: itemsToDelete
                },
                switchValues: state.switchValues                
            }
        case FORM_DELETED_ITEM_RESTORE:
            const deletedItems = state.inputUpdatedItems[ControlsIds.deletedItems].filter(itemId => itemId !== action.itemId);
            const removedEditedItem = state.inputUpdatedItems[EDITED_ITEMS_CACHE].find(item => item.id === action.itemId);
            const editedItemsCache = state.inputUpdatedItems[EDITED_ITEMS_CACHE].filter(itemId => itemId !== action.itemId);

            let updatedItemsState;
            if(removedEditedItem){
                const updatedItems = [...state.inputUpdatedItems[ControlsIds.editedItems], removedEditedItem];
                updatedItemsState =  {
                    ...state.inputUpdatedItems, 
                    [ControlsIds.editedItems]: updatedItems,
                    [EDITED_ITEMS_CACHE]: editedItemsCache,
                    [ControlsIds.deletedItems]: deletedItems,
                }
            }else {
                updatedItemsState = {
                    ...state.inputUpdatedItems,
                    [ControlsIds.deletedItems]: deletedItems
                }
            }

            return {
                formIsValid: state.formIsValid,
                inputValidities: state.inputValidities,
                inputValues: state.inputValues,
                inputUpdatedItems: updatedItemsState,
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
    const [changeItemsOrderMode, setChangeItemsOrderMode] = useState(false);

    const listId = props.route.params ? props.route.params.listId : null;
    const editedList = useSelector(state => state.shoppingLists.find(list => list.id === listId));
    const anyCurrentList = useSelector(state => !!state.currentShoppingListId);
    
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
            [EDITED_ITEMS_CACHE]: [], // array of Item()
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
                    formState.inputValues.reminderMinutes,
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

    const getItemsView = (items) => {
        
        if(changeItemsOrderMode){
            return <ItemsOrderEditor
                        items={items}
                        deletedItems={formState.inputUpdatedItems[ControlsIds.deletedItems]}
                        onChangeOrder={() => {/* TODO change order */}}
                        onButtonDonePress={() => setChangeItemsOrderMode(false)}
                    />
        }

        return <ItemsEditor
                    items={items}
                    deletedItems={formState.inputUpdatedItems[ControlsIds.deletedItems]}                    
                    onChange={onExistingItemsChange}
                    onItemRemove={onRemoveExistingItem}
                    onItemRestore={onRestoreDeletedItem}
                    onItemLongPress={ () => setChangeItemsOrderMode(true) }
                />
        };

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
                            props.navigation.navigate(SCREEN_NAME_EDIT_ITEMS, {listId: editedList.id, existingItems: editedList.items});
                        }} />
                    )}

                    {editedList && getItemsView(editedList.items) }                   

                                   
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