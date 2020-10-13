/**
 * Model of a list item
 */
class Item {
    constructor(id, content, isDone, order){
        this.id = id;
        this.content = content;
        this.isDone = isDone;
        this.order = order;
    }
}

export default Item;

/**
 * @description Sort items by specified order
 * @param {*} itemA - order property of item
 * @param {*} itemB - order property of item to compare
 */
export const sortItems = (itemA, itemB) => {
    return itemA.order - itemB.order;
}