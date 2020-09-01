class ShoppingList {
    constructor(id, title, items, creationDate, shoppingTimeOptions){
        this.id = id;
        this.title = title;
        this.items = items;
        this.creationDate = creationDate;
        this.shoppingTimeOptions = shoppingTimeOptions;
    };
    // Tworzy deksryptor z nieustawionym id
    static CreateDescriptor(title, items, creationDate, shoppingTimeOptions){
        return new ShoppingList(null, title, items, creationDate, shoppingTimeOptions)
    }
}

export default ShoppingList;