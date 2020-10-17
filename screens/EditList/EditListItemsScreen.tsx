import React, { useState } from 'react';
import {
    ScrollView,
    KeyboardAvoidingView,
    Text
} from 'react-native';

import Platform from '../../defs/Platform';

import Item, {sortItems} from '../../models/Item';
import ItemsEditor from '../../components/Items/Lists/ItemsEditor';
import ItemsOrderEditor from '../../components/Items/Lists/ItemsOrderEditor';

interface IProps {
    listId: number;
    existingItems: Item[];
}

const EditListItemsScreen: React.FC<IProps> = ({listId, existingItems}) => {
    const [isChangeOrderMode, setIsChangeOrderMode] = useState(false);
    const [editedItems, setEditedItems] = useState<Item[]>([]);    
    const [deletedItems, setDeletedItems] = useState<string[]>([]);

    // cached edited items
    const [cachedItems, setCachedItems] = useState<Item[]>([]);

    const OnEditionSave = () => {
        // event(editedItems, deletedItems, listId)
    }

    const onExistingItemsChange = (item: Item) =>
    {
        updatedEditedItems(item);

        const updatedCache = [...cachedItems];
        updatedCache.push(item);
        setCachedItems(updatedCache);
    }

    const onRemoveExistingItem = (itemId: string) => {       
        const updateDeleted = [...deletedItems];
        updateDeleted.push(itemId);
        setDeletedItems(updateDeleted);

        const filteredItems = editedItems.filter(i => i.id === itemId);
        setEditedItems(filteredItems);        
    }

    const onRestoreDeletedItem = (itemId: string) => {
        
        const findItem = (item: Item) => item.id === itemId;

        const cachedItem = cachedItems.find(findItem);
        if(cachedItem) {
            updatedEditedItems(cachedItem);
            const filteredCache = cachedItems.filter(findItem);
            setCachedItems(filteredCache);
        }

        const filteredDeletedItems = deletedItems.filter(id => id === itemId);
        setDeletedItems(filteredDeletedItems);
    };

    const updatedEditedItems = (item: Item) => {
        const updatedItems = editedItems.filter(i => i.id === item.id);
        updatedItems.push(item);
        updatedItems.sort(sortItems); 

        setEditedItems(updatedItems);        
    }

    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.isAndroid ? 'height' : 'padding'}
            keyboardVerticalOffset={30}
        >
            {isChangeOrderMode ? (
                <ItemsOrderEditor
                    items={editedItems}
                    deletedItems={deletedItems}
                    onChangeOrder={() => {/* TODO change order */}}
                    onButtonDonePress={() => setIsChangeOrderMode(false)}
                />
            ) : (
                <ScrollView>
                    <ItemsEditor
                        items={editedItems}
                        deletedItems={deletedItems}                    
                        onChange={onExistingItemsChange}
                        onItemRemove={onRemoveExistingItem}
                        onItemRestore={onRestoreDeletedItem}
                        onItemLongPress={ () => setIsChangeOrderMode(true) }
                    />
                </ScrollView>
            )}

        </KeyboardAvoidingView>
    );
};

export const ScreenOptions = () => {
    return {
        headerTitle: 'Manage list items',
        headerRight: () => <Text>Save</Text>
    }
};

export const SCREEN_NAME = 'EditListItemsScreen';

export default EditListItemsScreen;