import React from 'react';
import {
    View,
    StyleSheet,
    Button,
    Text,
    TouchableOpacity    
} from 'react-native';

import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";

import Item from '../../../models/Item';
import ListItemView from '../ListItemView';

interface IProps {
    items: Item[];
    deletedItems: string[];
    onChangeOrder: (items: Item[]) => void;
    onButtonDonePress: () => void;
}

const ItemsOrderEditor: React.FC<IProps> = ({items, deletedItems, onChangeOrder, onButtonDonePress}) => {

    const renderItem: React.FC<RenderItemParams<Item>> = ({ item, drag, isActive }) => {
        //const { item, drag, isActive } = data;

        return (
            <TouchableOpacity
                style={{
                    backgroundColor: isActive ? '#fafafa' : 'transparent',
                }}
                onLongPress={drag}
            >
                <ListItemView
                    key={item.id}
                    style={styles.listItem}
                    content={item.content}
                    isDone={item.isDone}
                    order={item.order}
                    isDeleted={!!deletedItems.find(id => id === item.id)}
                />
            </TouchableOpacity>
        );
      };
      // TODO out of scroll view /!\
    return (
        <View style={{marginTop: 20}}>
            <Text>Change items order</Text>
            <DraggableFlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id}
                onDragEnd={({ data }) => onChangeOrder(data)}
            />
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