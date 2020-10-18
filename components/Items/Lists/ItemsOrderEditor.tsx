import React, { useState } from 'react';
import {
    StyleSheet,
    Button,
    TouchableOpacity,    
    KeyboardAvoidingView
} from 'react-native';

import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import Platform from '../../../defs/Platform';

import Item from '../../../models/Item';
import ListItemView from '../ListItemView';

interface IProps {
    items: Item[];
    deletedItems: string[];
    onButtonDonePress: (items: Item[]) => void;
}

const ItemsOrderEditor: React.FC<IProps> = ({items, deletedItems, onButtonDonePress}) => {
    const [reorderedItems, setReorderedItems] = useState<Item[]>(items);
    const [isTouched, setIsTouched] = useState(false);

    const onOrderChange = (data: Item[]) => {
        setIsTouched(true);
        setReorderedItems(data);
    }

    const onSave = () =>{
        if (isTouched) {
            onButtonDonePress(reorderedItems);    
        }
    }

    const renderItem: React.FC<RenderItemParams<Item>> = ({ item, drag, isActive }) => {

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

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1 }}
            behavior={Platform.isAndroid ? 'height' : 'padding'}
            keyboardVerticalOffset={30}
        >
            <DraggableFlatList
                data={reorderedItems}
                renderItem={renderItem}
                keyExtractor={(item, index) => item.id}
                onDragEnd={({ data }) => onOrderChange(data)}
                scrollEnabled
            />
            <Button title="Done" onPress={onSave} />
        </KeyboardAvoidingView>
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
    itemsContainer: {
        marginTop: 20,
        flex: 1
    },
});

export default ItemsOrderEditor;