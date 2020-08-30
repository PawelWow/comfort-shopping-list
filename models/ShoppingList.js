class ShoppingList {
    constructor(id, title, items, shoppingDate, shoppingReminderTime, isShoppingScheduled, creationDate){
        this.id = id,
        this.title = title,
        this.items = items,
        this.shoppingDate = shoppingDate,
        this.shoppingReminderTimes = shoppingReminderTime,
        this.isShoppingScheduled = isShoppingScheduled,
        this.creationDate = creationDate
    }
}

export default ShoppingList;