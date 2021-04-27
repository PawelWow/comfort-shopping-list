import React, { useState } from 'react';
import {
    Button,
    TouchableOpacity,    
    KeyboardAvoidingView
} from 'react-native';

import DraggableFlatList, { RenderItemParams } from "react-native-draggable-flatlist";
import { Item } from '../../../../models';
import Platform from '../../../../defs/Platform';
import ListItemView from '../../ListItemView';
import { ItemsOrderEditorProps } from './ItemsOrderEditorProps';
import { styles } from './ItemsOrderEditorStyles';


const ItemsOrderEditor: React.FC<ItemsOrderEditorProps> = ({items, deletedItems, onButtonDonePress}) => {
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

export default ItemsOrderEditor;