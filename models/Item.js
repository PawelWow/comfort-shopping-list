// Klasa stanowiąca model wpisu (pozycji na liście)
class Item {
    constructor(id, content, isDone, order){
        this.id = id;
        this.content = content;
        this.isDone = isDone;
        this.order = order;
    }
}

export default Item;