import React, { useState } from 'react';
import {
    ScrollView,
    KeyboardAvoidingView,
    Text,
    StyleSheet, 
    View
} from 'react-native';

import Platform from '../../defs/Platform';

import Item, {sortItems} from '../../models/Item';
import ItemsEditor from '../../components/Items/Lists/ItemsEditor';
import ItemsOrderEditor from '../../components/Items/Lists/ItemsOrderEditor';

interface IParams {
    listId: number;
    existingItems: Item[];
}

interface IRoute {
    params: IParams;
}

interface IProps  {
    route: IRoute;
}

const EditListItemsScreen: React.FC<IProps> = ({route}) => {
    const {listId, existingItems} = route.params;
    
    const [isChangeOrderMode, setIsChangeOrderMode] = useState(false);
    const [editedItems, setEditedItems] = useState<Item[]>(existingItems);    
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
            style={styles.screen}
            behavior={Platform.isAndroid ? 'height' : 'padding'}
            keyboardVerticalOffset={30}
        >
            {isChangeOrderMode ? ( 
                <View style={{height: '100%'}}>
                    <Text>Change items order</Text>
                    <ItemsOrderEditor
                        items={editedItems}
                        deletedItems={deletedItems}
                        onChangeOrder={() => {/* TODO change order */}}
                        onButtonDonePress={() => setIsChangeOrderMode(false)}
                    />
                </View> 

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

const styles = StyleSheet.create({
    screen: {
        margin: 20
    }
});

export const ScreenOptions = () => {
    return {
        headerTitle: 'Manage list items',
        headerRight: () => <Text>Save</Text>
    }
};

export const SCREEN_NAME = 'EditListItemsScreen';

export default EditListItemsScreen;