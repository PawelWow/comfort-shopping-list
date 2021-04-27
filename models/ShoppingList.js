export class ShoppingList {
    constructor(id, title, items, creationDate, shoppingTimeOptions){
        this.id = id;
        this.title = title;
        this.items = items;
        this.creationDate = creationDate; // isostring
        this.shoppingTimeOptions = shoppingTimeOptions;
    };
}
