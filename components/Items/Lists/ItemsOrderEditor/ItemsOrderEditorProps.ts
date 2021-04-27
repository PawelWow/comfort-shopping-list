import { Item } from '../../../../models';

export interface ItemsOrderEditorProps {
    items: Item[];
    deletedItems: string[];
    onButtonDonePress: (items: Item[]) => void;
}
