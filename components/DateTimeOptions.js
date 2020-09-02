import React, { useState, useCallback } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import Input from './Input';
import SwitchOption from './SwitchOption';

import ControlsIds from '../defs/ControlsIds';

const DateTimeOptions = props => {
    const [showPicker, setShowPicker] = useState(false);
    const [shoppingDateTime, setShoppingDateTime] = useState(new Date());

    // do remindera
    const [isReminderSet, setIsRemminderSet] = useState(false);
   
    const PICKER_MODE_DATE = 'date';
    const PICKER_MODE_TIME = 'time';
    const [pickerMode, setPickerMode] = useState(PICKER_MODE_DATE);   

    // picker ustawienia daty zakupów
    const onShowDatePickerPress = () => {
        setShowPicker(true);
        setPickerMode(PICKER_MODE_DATE);
    };

    // picker ustawienia godziny zakupów
    const onShowTimePickerPress = () => {
        setShowPicker(true);
        setPickerMode(PICKER_MODE_TIME);
    };

    const onDateTimeChanged = (event, selectedDate) => {
        // musiym najpierw schować picker, zanim zmienimy jakąś wartość, inaczej pokaże się 2x na Androidzie
        // Na iOS to nie jest modal, ale powinien się picker gdzieś niżej wysunąć/chować.
        // TODO to trzeba zobaczyć na iPhone jak to będzie wyglądało - prawodopodobnie będzie badziew
        setShowPicker(false);

        if(selectedDate) {
            setShoppingDateTime(selectedDate);
            //inputIdentifier, inputValue, inputValidity
            props.onDataChange(ControlsIds.shoppingDate, selectedDate, true);
        }
        
    };

    const onReminderSwitchValueChange = useCallback((switchId, switchValue) => {
        props.onOptionsChange(switchId, switchValue);
        setIsRemminderSet(switchValue);
    }, [isReminderSet]);

    return (
        <View style={styles.mainContainer}>


                <View style={styles.dateTimePickerContainer}>
                        <Text>Date:</Text>
                        <Text style={styles.dateTimeLinkText} onPress={onShowDatePickerPress}>
                            {!shoppingDateTime ? 'Pick date' : shoppingDateTime.toLocaleDateString()}
                        </Text> 

                        <Text style={{marginLeft: 15}}>Hour:</Text>
                        <Text style={styles.dateTimeLinkText} onPress={onShowTimePickerPress}>
                            {!shoppingDateTime ? 'Pick hour' : shoppingDateTime.toLocaleTimeString([], 
                                {hour: '2-digit', minute: '2-digit'})}
                        </Text> 


                    {showPicker && (
                        <DateTimePicker
                            value={shoppingDateTime}
                            mode={pickerMode}
                            onChange={onDateTimeChanged}
                        />

                        
                    )}
                </View>

                <SwitchOption
                    id={ControlsIds.isReminderSet}
                    label="Remind me shopping:"
                    initialValue={props.initialValues.isReminderSet}
                    onSwitchChange={onReminderSwitchValueChange}
                />

                {isReminderSet && (
                    <View>
                        <SwitchOption
                            id={ControlsIds.remindOnTime}
                            label="Remind me on time:"
                            initialValue={props.initialValues.remindOnTime}
                            onSwitchChange={props.onOptionsChange}
                        />

                        <View style={styles.controlsInLine}>
                            <Input 
                                containerStyle={styles.controlsInLine}
                                id={ControlsIds.reminderHours}
                                label="Hour"
                                errorMessage="0-24 hours"
                                keyboardType="number-pad"
                                returnKeyType="next"
                                onInputChange={props.onDataChange} 
                                required={isReminderSet}
                                min={0}
                                max={24}                                  
                            />
                            <Input 
                                containerStyle={styles.controlsInLine}
                                id={ControlsIds.reminderMinutes}
                                label="Minutes"
                                errorMessage="0-60 minutes"
                                keyboardType="number-pad"
                                returnKeyType="next"
                                onInputChange={props.onDataChange} 
                                required={isReminderSet} 
                                min={0}
                                max={60}                                  
                            />                            
                        </View>
                    </View>

                )}
            
        </View>
    );   
};

const styles = StyleSheet.create({
    mainContainer: {
        margin: 20
    },
    controlsInLine: {
        flex: 1,
        flexDirection:'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15,
        
    },
    dateTimePickerContainer: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginVertical: 15,
        width: '80%'

    },
    dateTimeLinkText: {
        color: 'blue',
        textDecorationLine: 'underline',
        fontStyle: 'italic'
    },
    reminderContainer: {

    }
});

export default DateTimeOptions;