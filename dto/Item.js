export class Item {
    constructor(id, name, price, qty, category, status = "Available") {
        this.id = id;
        this.name = name;
        this.price = price;
        this.qty = qty;
        this.category = category; 
        this.status = status;    
    }
}