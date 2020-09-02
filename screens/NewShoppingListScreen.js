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
    KeyboardAvoidingView
} from 'react-native';

import { useDispatch } from 'react-redux';

import ControlsIds from '../defs/ControlsIds';
import * as listActions from '../store/lists-actions';

import MenuHeaderButton from '../components/MenuHeaderButton';
import SaveHeaderButton from '../components/SaveHeaderButton';
import DateTimeOptions from '../components/DateTimeOptions';
import Input from '../components/Input';
import SwitchOption from '../components/SwitchOption';
import Platform from '../defs/Platform';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';
const FORM_SWITCH_UPDATE = 'FORM_SWITCH_UPDATE';

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
                switchValues: state.switchValues,
            }
        case FORM_SWITCH_UPDATE:
            return {
                formIsValid: state.formIsValid,
                inputValidities: state.inputValidities,
                inputValues: state.inputValues,
                switchValues: { ...state.switchValues, [action.switch]: action.value }
            }
        default:
            return state;
    }
};


const NewShoppingListScreen = props => {
    const [error, setError] = useState();

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            [ControlsIds.title]: '',
            [ControlsIds.content]: '',
            [ControlsIds.shoppingDate]: new Date(),
            [ControlsIds.reminderHours]: 0,
            [ControlsIds.reminderMinutes]: 0,
        },
        inputValidities: {
            [ControlsIds.title]: false,
            [ControlsIds.content]: false
        },
        switchValues: {
            [ControlsIds.isShoppingScheduled]: false,
            [ControlsIds.isReminderSet]: false,
            [ControlsIds.remindOnTime]: true,
        },

        formIsValid: false
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
    
            props.navigation.goBack();            
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
                        errorMessage="Enter a title"
                        keyboardType="default"
                        autCapitalize="sentences"
                        autoCorrect
                        returnKeyType="next"
                        onInputChange={onInputChange}
                        required
                    />

                    <Input
                        id={ControlsIds.content}
                        label="Content"
                        errorMessage="Enter shopping list content"
                        keyboardType="default"
                        autoCapitalize="sentences"
                        autoCorrect
                        multiline
                        numberOfLines={5}
                        onInputChange={onInputChange}
                        required
                     
                    />
                                   
                </View>
                <SwitchOption
                    id={ControlsIds.isShoppingScheduled}
                    label="Set shopping time options:"
                    initialValue={formState.switchValues.isShoppingScheduled}
                    onSwitchChange={onSwitchChange}
                />
                { formState.switchValues.isShoppingScheduled 
                    && <DateTimeOptions onDataChange={onInputChange} onOptionsChange={onSwitchChange} initialValues={{
                        isReminderSet: formState.switchValues.isReminderSet,
                        remindOnTime: formState.switchValues.remindOnTime
                    }} />
                }
                
            </ScrollView>

        </KeyboardAvoidingView>

    );
};

const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
});

export const ScreenOptions = navData => {
    return {
        headerTitle: 'Create a new list',
        headerLeft: () => <MenuHeaderButton onPress={() => navData.navigation.toggleDrawer() } />
    }
};

export default NewShoppingListScreen;