import React from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';

import EditListItem from '../../EditListItem/EditListItem';
import { ItemsEditorProps } from './ItemsEditorProps';

const ItemsEditor: React.FC<ItemsEditorProps> = ({items, deletedItems, onChange, onItemRemove, onItemRestore, onItemLongPress}) => {

    return (
        <View style={styles.itemsContainer}>
            <Text>Items</Text>
            { items.map(item => <EditListItem
                    key={item.id}
                    id={item.id}
                    value={item.content}
                    isDone={item.isDone}
                    order={item.order}
                    isDeleted={!!deletedItems.find(id => id === item.id)}
                    onChange={onChange}
                    onRemove={() => onItemRemove(item.id)}
                    onRestore={() => onItemRestore(item.id)}
                    onItemLongPress={onItemLongPress}
                /> )
            }
        </View>
    );
};

const styles = StyleSheet.create({
    itemsContainer: {
        marginTop: 20
    }
});

export default ItemsEditor;