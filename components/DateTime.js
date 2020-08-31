import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

import Input from './Input';

const DateTime = props => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [shoppingDateTime, setShoppingDateTime] = useState(new Date());

    // do remindera
    const [isReminderSet, setIsRemminderSet] = useState(false);
    const [remindOnTime, setRemindOnTime] = useState(true);

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
            props.onDataChange('shoppingDate', selectedDate, true);
        }
        
    };

    // TODO do tych switchy trzeba dorobić komponent, bo teraz po kilkukroć walić muszę te handlery

    const onSwitchShoppingOptionsValueChange = () => {
        setIsEnabled(!isEnabled);
        props.onDataChange('isShoppingScheduled', isEnabled, true);
    }

    const onSwitchReminderSetValueChange = () => {
        setIsRemminderSet(!isReminderSet);
        props.onDataChange('isReminderSet', isReminderSet, true);
    }

    const onSwitchRemindOnTime = () => {
        setRemindOnTime(!remindOnTime);
        props.onDataChange('remindOnTime', remindOnTime, true);
    }

// TODO wyświetlanie godzin trzeba poprawić, bo po co sekundy
    const showDateTimePickerSection = () => {
        if(!isEnabled) {
            return;
        }

        return (
            <View>
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

                <View style={styles.controlsInLine}>
                    <Text>Remind me shopping:</Text>
                    <Switch value={isReminderSet} onValueChange={ onSwitchReminderSetValueChange } />
                </View>
                {isReminderSet && (
                    <View>
                        <View style={styles.controlsInLine}>
                            <Text>Remind me on time:</Text>
                            <Switch value={remindOnTime} onValueChange={ onSwitchRemindOnTime } />
                        </View>

                        <View style={styles.controlsInLine}>
                            <Input 
                                containerStyle={styles.controlsInLine}
                                id="reminderHour"
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
                                id="reminderHour"
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
    } 

    return (
        <View style={styles.mainContainer}>

            <View style={styles.controlsInLine}>
                <Text>Set shopping time options:</Text>
                <Switch value={isEnabled} onValueChange={onSwitchShoppingOptionsValueChange} />
            </View>

            {showDateTimePickerSection()}
            
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

export default DateTime;