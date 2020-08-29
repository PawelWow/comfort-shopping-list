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

import shortid from 'shortid';

import * as listActions from '../store/lists-actions';

import MenuHeaderButton from '../components/MenuHeaderButton';
import SaveHeaderButton from '../components/SaveHeaderButton';

import Input from '../components/Input';
import Platform from '../defs/Platform';
import Item from '../models/Item';

const FORM_INPUT_UPDATE = 'FORM_INPUT_UPDATE';

const formReducer = (state, action ) => {
    if(action.type !== FORM_INPUT_UPDATE){
        return state;
    }

    const updatedValues = { ...state.inputValues, [action.input]: action.value };
    const updatedValidities = { ...state.inputValidities, [action.input]: action.isValid };

    let updatedFormIsValid = true;
    for( const key in updatedValidities) {
        updatedFormIsValid = updatedFormIsValid && updatedValidities[key];
    }

    return {
        formIsValid: updatedFormIsValid,
        inputValidities: updatedValidities,
        inputValues: updatedValues
    }
};


const NewShoppingListScreen = props => {
    const [error, setError] = useState();

    const dispatch = useDispatch();

    const [formState, dispatchFormState] = useReducer(formReducer, {
        inputValues: {
            title: '',
            content: '',
            shoppingDate: '',
            shoppingHour: ''
        },
        inputValidities: {
            title: false,
            content: false
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
    const onFormSubmit = () => {

        if(!formState.formIsValid){
            Alert.alert('Wrong data', 'Check the error in the form.', [ {text: 'OK '}]);
            return;
        }

        dispatch(listActions.addList(            
            formState.inputValues.title,
            formState.inputValues.shoppingDate,
            formState.inputValues.shoppingHour,
            new Date().toISOString(),
            formState.inputValues.content
        ));
        

        props.navigation.goBack();
    };

    // Dzieli cały tekst na wpisy
    const splitContentToEntries = (text, separator) => {
        const values = String(text).split(separator);

        const entries = values.map( value => {
                const id = shortid.generate();

                return new Item(id, value)}
            );

        return entries;
    }

    // Przycisk zapisywania po prawej w headerze
    // TODO - useEffect, bo kliknięcie spowoduje zapis do bazy
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

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.isAndroid ? 'height' : 'padding'}
            keyboardVerticalOffset={30}
        >
            <ScrollView>
                <View style={styles.screen}>
                    <Input
                        id="title"
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
                        id="content"
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