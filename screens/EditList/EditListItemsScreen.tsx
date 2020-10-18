import React, { useEffect, useState } from 'react';
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

    const [items, setItems] = useState(existingItems);
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

    const onExistingItemsChange = (item: Item) =>
    {
        updatedEditedItems(item);

        const updatedCache = [...cachedItems];
        updatedCache.push(item);
        setCachedItems(updatedCache);

        const updatedItems = items.filter(i => i.id !== item.id);
        updatedItems.push(item);
        updatedItems.sort(sortItems);
        setItems(updatedItems);
    }

    const onRemoveExistingItem = (itemId: string) => {       
        const updateDeleted = [...deletedItems];
        updateDeleted.push(itemId);
        setDeletedItems(updateDeleted);

        const filterItem = (item: Item) => item.id !== itemId;

        const filteredItems = editedItems.filter(filterItem);
        setEditedItems(filteredItems);    
        
        const updatedItems = items.filter(filterItem);
        setItems(updatedItems);        
    }

    const onRestoreDeletedItem = (itemId: string) => {

        const cachedItem = cachedItems.find(item => item.id === itemId);
        if(cachedItem) {
            updatedEditedItems(cachedItem);
            const filteredCache = cachedItems.filter(item => item.id !== itemId);
            setCachedItems(filteredCache);

            const updatedItems = [...items];
            updatedItems.push(cachedItem);
            updatedItems.sort(sortItems);
            setItems(updatedItems);
        }

        const filteredDeletedItems = deletedItems.filter(id => id !== itemId);
        setDeletedItems(filteredDeletedItems);

        const missingItem = existingItems.find(item => item.id === itemId);

        const updatedItems = [...items];
        updatedItems.push(missingItem!);
        updatedItems.sort(sortItems);
        setItems(updatedItems);
    };

    const updatedEditedItems = (item: Item) => {
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
                        items={items}
                        deletedItems={deletedItems}
                        onChangeOrder={() => {/* TODO change order */}}
                        onButtonDonePress={() => setIsChangeOrderMode(false)}
                    />
                </View> 

            ) : (
                <ScrollView>
                    <ItemsEditor
                        items={items}
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