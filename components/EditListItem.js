import React, { useState} from 'react';

import { View, Text, StyleSheet } from 'react-native';

import Input from './Input';

const EditListItem = props => {
    const [isEditMode, setIsEditMode] = useState(false)

    // TODO on input blur should disable edit mode
    return (
        <View>
            { isEditMode ? (
                <Input
                    id={props.id}
                    initialValue={props.value}
                    initiallyValid
                    keyboardType="default"
                    autoCapitalize="sentences"
                    autoCorrect
                    shouldReset={false}
                    onInputChange={props.onChange}                                             
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