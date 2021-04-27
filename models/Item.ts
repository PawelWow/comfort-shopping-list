/**
 * Model of a list item
 */
export class Item {
    id: string;
    content: string;
    isDone: boolean;
    order: number;
    
    constructor(id: string, content: string, isDone: boolean, order: number){
        this.id = id;
        this.content = content;
        this.isDone = isDone;
        this.order = order;
    }
}

/**
 * @description Sort items by specified order
 * @param {*} itemA - order property of item
 * @param {*} itemB - order property of item to compare
 */
export const sortItems = (itemA: Item, itemB: Item) => {
    return itemA.order - itemB.order;
}