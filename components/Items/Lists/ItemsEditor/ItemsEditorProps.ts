import { Item } from '../../../../models';

export interface ItemsEditorProps {
    items: Item[];
    deletedItems: string[];
    onChange: (item: Item, itemValidity: boolean) => void;
    onItemRemove: (itemId: string) => void;
    onItemRestore: (itemId: string) => void;
    onItemLongPress: () => void;
}