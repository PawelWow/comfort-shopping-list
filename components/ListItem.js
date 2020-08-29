import React from 'react';

import { View, Text, StyleSheet } from 'react-native';

const ListItem = props => {
    return (
        <View style={styles.listItem}>
            <Text>{props.content}</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    listItem: {
        borderBottomColor: '#ccc',
        borderBottomWidth: 1,
        paddingVertical: 15,
        paddingHorizontal: 10,
    }
});

export default ListItem;