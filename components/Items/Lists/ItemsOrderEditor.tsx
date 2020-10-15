import React from 'react';
import {
    View,
    StyleSheet,
    Button,
    Text
} from 'react-native';

import Item from '../../../models/Item';
import ListItemView from '../ListItemView';

interface IProps {
    items: Item[];
    deletedItems: string[];
    onButtonDonePress: () => void;
}

const ItemsOrderEditor: React.FC<IProps> = ({items, deletedItems, onButtonDonePress}) => {

    return (
        <View style={{marginTop: 20}}>
            <Text>Change items order</Text>
            {items.map(item => <ListItemView
                    key={item.id}
                    style={styles.listItem}
                    content={item.content}
                    isDone={item.isDone}
                    order={item.order}
                    isDeleted={!!deletedItems.find(id => id === item.id)}
                />
            )}
            <Button title="Done" onPress={onButtonDonePress} />
        </View>
    );
};

const styles = StyleSheet.create({
    screen: {
        margin: 20
    },
    listItem: {
        borderColor: 'red',
        backgroundColor: '#fefee3',
        borderWidth: 1,
        borderStyle: 'dashed',
        borderRadius: 1,
        padding: 5,
        marginHorizontal: 5,
        marginVertical: 10,
    },
});

export default ItemsOrderEditor;