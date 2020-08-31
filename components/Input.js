import React, {useReducer, useEffect} from 'react';
import { View, Text, TextInput, StyleSheet, Platform } from 'react-native';

import Colors from '../defs/Colors';

const INPUT_CHANGE = 'INPUT_CHANGE';
const INPUT_BLUR  = 'INPUT_BLUR';

const inputReducer = (state, action) => {
    switch(action.type) {
        case INPUT_CHANGE:
            return {
                ...state,
                value: action.value,
                isValid: action.isValid,
                isTouched: true
            }

        case INPUT_BLUR:
            return {
                ...state,
                isTouched: true
            }
        default:
            return state;
    }
};

const Input = props => {
    const [inputState, dispatch] = useReducer(inputReducer, {
        value: '',
        isValid: false,
        trouched: false
    });

    useEffect(() => {
        if(inputState.isTouched) {
            props.onInputChange(props.id, inputState.value, inputState.isValid);
        }
    }, [inputState]);
    
    // Przeprowadza walidację tekstu
    const onInputTextChange = text => {
        let isValid = true;
    
        // jeśli wymagany musi cos zawierać
        if( props.isRequired && text.trim().length === 0) {
            isValid = false;
        }

        if (props.min != null && +text < props.min) {
            isValid = false;
        }

        if (props.max != null && +text > props.max) {
            isValid = false;
        }
        
        dispatch({ type: INPUT_CHANGE, value: text, isValid: isValid});
    }
    
    const onInputFocusLost = () => {
        dispatch({ type: INPUT_BLUR });
    }   
    
    const showErrorMessage = () => {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}> {props.errorMessage } </Text>
            </View>
        );
    }

    return(
        <View style={styles.control, {...props.containerStyle} }>        
            <Text style={styles.label}>{props.label}</Text>
            <TextInput
                {...props}
                style={styles.input}
                value={inputState.value}
                onChangeText={onInputTextChange}
                onBlur={onInputFocusLost}
            />
            { !inputState.isValid && inputState.isTouched && showErrorMessage() }
        </View>
    );
};

const styles = StyleSheet.create({
    control: {
        width: '100%'
    },
    label: {
        marginVertical: 8
    },
    input: {
        paddingHorizontal: 2,
        paddingVertical: 5,
        borderBottomColor: Colors.inputBorder,
        borderBottomWidth: 1
    },
    errorContainer: {
        marginVertical: 5,
    },
    errorText: {
        color: Colors.error,
        fontSize: 13
    }
});

export default Input;