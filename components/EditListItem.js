import React, { useState, useRef, useEffect } from 'react';

import { View, Text, StyleSheet } from 'react-native';

import Input from './Input';

const EditListItem = props => {
    const [isEditMode, setIsEditMode] = useState(false);
    const inputRef = useRef();

    useEffect(() => {
        if(isEditMode && inputRef){
            inputRef.current.focus();
        }
    }, [isEditMode, inputRef])

    return (
        <View>
            { isEditMode ? (
                <Input
                    ref={inputRef}
                    id={props.id}
                    initialValue={props.value}
                    initiallyValid
                    keyboardType="default"
                    autoCapitalize="sentences"
                    autoCorrect
                    shouldReset={false}
                    onInputChange={props.onChange}    
                    onInputBlur={() => setIsEditMode(false)}                                         
                /> 
            ) : (
                <Text style={styles.listItem} onPress={() => setIsEditMode(true)}>{props.value}</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    listItem: {
        borderColor: '#ccc',
        backgroundColor: '#fefee3',
        borderWidth: 1,
        padding: 5,
        margin: 2
    },

});

export default EditListItem;