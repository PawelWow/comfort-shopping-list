import React, { useEffect, useState } from 'react';
import {
    ScrollView,
    KeyboardAvoidingView,
    Text,
    StyleSheet, 
    View
} from 'react-native';

import Platform from '../../defs/Platform';

import { Item, sortItems } from '../../models/Item';
import ItemsEditor from '../../components/Items/Lists/ItemsEditor/ItemsEditor';
import ItemsOrderEditor from '../../components/Items/Lists/ItemsOrderEditor/ItemsOrderEditor';
import SaveHeaderButton from '../../components/UI/Buttons/SaveHeaderButton';

interface IParams {
    existingItems: Item[];
    goBackScreenName: string;
}

interface IRoute {
    params: IParams;
}

interface INavigation {
    navigate: (screen: string, {}) => void;
    setOptions: ({}) => void;
}

interface IProps  {
    route: IRoute;
    navigation: INavigation;
}

const EditListItemsScreen: React.FC<IProps> = ({route, navigation}) => {
    const {existingItems, goBackScreenName} = route.params;
    const [isChangeOrderMode, setIsChangeOrderMode] = useState(false);

    // TODO deep copy needed - don't change initial state!
    const copyExistingItems = () => {
        const copiedItems = [];
        const items = [...existingItems];
        for (let i = 0; i < items.length; i++) {
            const item = items[i];

            copiedItems.push(new Item(item.id, item.content, item.isDone, item.order));            
        }

        return copiedItems;
    }

    const [itemsPreview, setItemsPreview] = useState(copyExistingItems());
    const [editedItems, setEditedItems] = useState<Item[]>([]);    
    const [deletedItems, setDeletedItems] = useState<string[]>([]);

    // cached edited items
    const [cachedItems, setCachedItems] = useState<Item[]>([]);


    // Przycisk zapisywania po prawej w headerze
    useEffect(() => {
        navigation.setOptions({
            headerRight: () => <SaveHeaderButton onPress={() => {
                                        navigation.navigate(goBackScreenName, {itemsEdition: {
                                            editedItems: editedItems,
                                            deletedItems: deletedItems
                                        }})
                                    }} />
        });
    }), [editedItems, deletedItems];    

    /**
     * 
     * @param reorderedItems collection of all items (including edited and deleted)
     */
    const onOrderSave = (reorderedItems: Item[]) => {
        setItemsPreview(reorderedItems);

        const items = prepareEditedItemsToSave(reorderedItems);
        setEditedItems(items);

        setIsChangeOrderMode(false);
    }

    /**
     * @description creates collection of all reordered items included previously edited ones.
     * @param reorderedItems collection of all items (including edited and deleted)
     */
    const prepareEditedItemsToSave = (reorderedItems: Item[]): Item[] => {
        const existingEditedItems = [...editedItems];

        // every is edited but deleted is deleted
        const itemsWithoutDeleted = reorderedItems.filter( item => !deletedItems.find(itemId => itemId === item.id));

        const itemsToReorder = [];
        for (let i = 0; i < itemsWithoutDeleted.length; i++) {   

            const item = itemsWithoutDeleted[i]; 
            item.order = i;
            
            const existingItem = existingEditedItems.find(i => i.id === item.id);

            if(existingItem){
                existingItem.order = item.order;
                itemsToReorder.push(existingItem);
            }else {
                itemsToReorder.push(item);
            }   
        }        
        
        return itemsToReorder;
    }

    const onExistingItemsChange = (item: Item) =>
    {
        updateEditedItems(item);

        const updatedCache = [...cachedItems];
        updatedCache.push(item);
        setCachedItems(updatedCache);

        const preview = itemsPreview.filter(i => i.id !== item.id);
        preview.push(item);
        preview.sort(sortItems);
        setItemsPreview(preview);
    }

    const onRemoveExistingItem = (itemId: string) => {       
        const updateDeleted = [...deletedItems];
        updateDeleted.push(itemId);
        setDeletedItems(updateDeleted);

        const filterItem = (item: Item) => item.id !== itemId;

        const filteredItems = editedItems.filter(filterItem);
        setEditedItems(filteredItems);    
    }

    const onRestoreDeletedItem = (itemId: string) => {

        const cachedItem = cachedItems.find(item => item.id === itemId);
        if(cachedItem) {
            updateEditedItems(cachedItem);
            const filteredCache = cachedItems.filter(item => item.id !== itemId);
            setCachedItems(filteredCache);

            const updatedItems = [...itemsPreview];
            updatedItems.push(cachedItem);
            updatedItems.sort(sortItems);
            setItemsPreview(updatedItems);
        }

        const filteredDeletedItems = deletedItems.filter(id => id !== itemId);
        setDeletedItems(filteredDeletedItems);
    };

    const updateEditedItems = (item: Item) => {
        const updatedItems = editedItems.filter(i => i.id !== item.id);
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
                        items={itemsPreview}
                        deletedItems={deletedItems}
                        onButtonDonePress={onOrderSave}
                    />
                </View> 

            ) : (
                <ScrollView>
                    <ItemsEditor
                        items={itemsPreview}
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
    }
};

export const SCREEN_NAME = 'EditListItemsScreen';

export default EditListItemsScreen;