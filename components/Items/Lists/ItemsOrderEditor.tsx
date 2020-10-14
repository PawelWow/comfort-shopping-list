import React from 'react';
import {
    View,
    StyleSheet,
    Text,
    Button
} from 'react-native';

import Item from '../../../models/Item';

interface IProps {
    items: Item[];
    onButtonDonePress: () => void;
}

const ItemsOrderEditor: React.FC<IProps> = ({items, onButtonDonePress}) => {
    return (
        <View style={{marginTop: 20}}>
            {items.map(item => <Text key={item.id} style={{marginBottom: 10}}>{item.order +1}. {item.content}</Text>)}
            <Button title="Done" onPress={onButtonDonePress} />
        </View>
    );
};

export default ItemsOrderEditor;