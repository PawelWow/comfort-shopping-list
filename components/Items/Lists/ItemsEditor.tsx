import React from 'react';
import {
    View,
    StyleSheet,
    Text
} from 'react-native';

import Item from '../../../models/Item';
import EditListItem from '../EditListItem';

interface IProps {
    items: Item[];
    deletedItems: string[];
    onChange: (item: Item, itemValidity: boolean) => void;
    onItemRemove: (itemId: string) => void;
    onItemRestore: (itemId: string) => void;
    onItemLongPress: () => void;
}

const ItemsEditor: React.FC<IProps> = ({items, deletedItems, onChange, onItemRemove, onItemRestore, onItemLongPress}) => {

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