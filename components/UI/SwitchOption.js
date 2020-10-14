import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';

const SwitchOption = props => {
    const [isEnabled, setIsEnabled] = useState(props.initialValue ? props.initialValue : false);

    useEffect(() => {
        props.onSwitchChange(props.id, isEnabled);
    }, [isEnabled]);

    useEffect(() => {
        if(!props.shouldReset) {
            return;
        }

        const initiallyEnabled = props.initialValue ? props.initialValue : false;
        setIsEnabled(initiallyEnabled);

    }, [props.shouldReset])    

    return (
        <View style={styles.controlsInLine}>
            <Text style={styles.label}>{props.label}</Text>
            <Switch {...props} value={isEnabled} onValueChange={() => setIsEnabled(!isEnabled)} />
        </View>
    );
}

const styles = StyleSheet.create({
    controlsInLine: {
        flex: 1,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15,
        
    },
    label: {
        marginRight: 8
    },
});

export default SwitchOption;
