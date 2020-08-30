import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateTime = props => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [showPicker, setShowPicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    const PICKER_DATE = 'date';
    const PICKER_TIME = 'time';
    const [pickerMode, setPickerMode] = useState(PICKER_DATE);

    const [shoppingTime, setShoppingTime] = useState(new Date());


    const onShowDatePickerPress = () => {
        setShowPicker(true);
        setPickerMode(PICKER_DATE);
    };

    const onShowTimePickerPress = () => {
        setShowPicker(true);
        setPickerMode(PICKER_TIME);
    };

    const onDateChange = (event, selectedDate) => {
        // musiym najpierw schować picker, zanim zmienimy jakąś wartość, inaczej pokaże się 2x na Androidzie
        // Na iOS to nie jest modal, ale powinien się picker gdzieś niżej wysunąć/chować.
        // TODO to trzeba zobaczyć na iPhone jak to będzie wyglądało - prawodopodobnie będzie badziew
        setShowPicker(false);

        if(selectedDate) {
            setShoppingTime(selectedDate);
        }
        
    };
// TODO wyświetlanie godzin trzeba poprawić, bo po co sekundy
    const showDateTimePickerSection = () => {
        if(!isEnabled) {
            return;
        }

        return (
            <View style={styles.dateTimePickerContainer}>
                <View>
                    <Text>Date:</Text>
                    <Text onPress={onShowDatePickerPress}>
                        {!shoppingTime ? 'Pick date' : shoppingTime.toLocaleDateString()}
                    </Text> 
                </View>

                <View>
                    <Text>Hour: </Text>
                    <Text onPress={onShowTimePickerPress}>
                        {!shoppingTime ? 'Pick hour' : shoppingTime.toLocaleTimeString(
                            [], {hour: '2-digit', minute: '2-digit'}
                        )}
                    </Text> 
                </View>


                {showPicker && (
                    <DateTimePicker
                        value={shoppingTime}
                        mode={pickerMode}
                        onChange={onDateChange}
                    />
                )}
            </View>
        );
    } 

    return (
        <View style={styles.mainContainer}>
            <View stylsete={styles.enableCheckboxSection}>
                <View><Text>Set shopping list date and time:</Text></View>
                <View><Switch value={isEnabled} onValueChange={ () => setIsEnabled(!isEnabled) } /></View>
            </View>
            {showDateTimePickerSection()}
            
        </View>
    );   
};

const styles = StyleSheet.create({
    mainContainer: {
        flex: 1
    },
    enableCheckboxSection: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '80%',
        marginVertical: 15
    },
    dateTimePickerContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        width: '60%',
        marginVertical: 15
    }
});

export default DateTime;