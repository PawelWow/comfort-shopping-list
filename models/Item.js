// Klasa stanowiąca model wpisu (pozycji na liście)
class Item {
    constructor(id, content, isDone){
        this.id = id;
        this.content = content;
        this.isDone = isDone;
    }
}

export default Item;