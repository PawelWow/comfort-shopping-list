import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Switch } from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';

const DateTime = props => {
    const [isEnabled, setIsEnabled] = useState(false);
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimePicker, setShowTimePicker] = useState(false);

    // będziemy mieć osobno czas i osobno datę
    const [date, setDate] = useState('');
    const [hour, setHour] = useState('');



    const onDateChange = (event, selectedDate) => {
        // musiym najpierw schować picker, zanim zmienimy jakąś wartość, inaczej pokaże się 2x
        // TODO na iOS to chyab nie jest modal, więc trzeba będzie zrobic na 2 sposoby
        setShowDatePicker(false);

        if(selectedDate) {
            setDate(selectedDate.toLocaleDateString());
        }
        
    };

    const showDateTimePickerSection = () => {
        if(!isEnabled) {
            return;
        }

        return (
            <View style={styles.dateTimePickerContainer}>
                <Text>Date:</Text>
                <Text onPress={ () => setShowDatePicker(true) }>
                    {!date ? 'Pick date' : date}
                </Text> 

                {showDatePicker && (
                    <DateTimePicker
                        value={() => { 
                            return (
                                !date ? new Date() : new Date(date)
                            );
                        }}
                        mode='date'
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