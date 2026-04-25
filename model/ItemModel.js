import { itemDB } from "../db/database.js";
import { Item } from "../dto/Item.js";

export class ItemModel {

    validate(name, price, qty, category) {
        if (name.length < 3) return { valid: false, msg: "Invalid name" };
        if (price <= 0) return { valid: false, msg: "Invalid price" };
        if (qty < 0) return { valid: false, msg: "Invalid qty" };
        if (!category) return { valid: false, msg: "Select category" };

        return { valid: true };
    }

    save(name, price, qty, category) {
        const id = `ITM-${(itemDB.length + 1).toString().padStart(3, '0')}`;
        const status = qty > 0 ? "Available" : "Out of Stock";

        const item = new Item(id, name, price, qty, category, status);
        itemDB.push(item);

        return item;
    }

    update(id, name, price, qty, category) {
        const item = itemDB.find(i => i.id === id);
        if (!item) return null;

        item.name = name;
        item.price = price;
        item.qty = qty;
        item.category = category;
        item.status = qty > 0 ? "Available" : "Out of Stock";

        return item;
    }

    toggleStatus(id, status) {
        const item = itemDB.find(i => i.id === id);
        if (item) item.status = status ? "Available" : "Unavailable";
    }

    getAll() {
        return itemDB;
    }

    findById(id) {
        return itemDB.find(i => i.id === id);
    }
}
