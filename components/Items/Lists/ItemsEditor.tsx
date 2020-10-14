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
    onChange: (item: Item, itemValidity: boolean) => void;
    onRemove: (itemId: string) => void;
    onRestore: (itemId: string) => void;
}

const ItemsEditor: React.FC<IProps> = ({items, onChange, onRemove, onRestore}) => {

    return (
        <View style={styles.itemsContainer}>
            <Text>Items</Text>
            { items.map(item => <EditListItem
                    key={item.id}
                    id={item.id}
                    value={item.content}
                    isDone={item.isDone}
                    order={item.order}
                    onChange={onChange}
                    onRemove={() => onRemove(item.id)}
                    onRestore={() => onRestore(item.id)}
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