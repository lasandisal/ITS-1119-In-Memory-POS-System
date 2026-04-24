import { itemDB } from "../db/database.js";
import { Item } from "../dto/Item.js";

// Business Rules (Regex) stay in the Model
const nameRegex = /^[A-Za-z0-9 ]{3,20}$/;
const priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;
const qtyRegex = /^[0-9]+$/;

export function validate(name, price, qty, category) {
    if (!nameRegex.test(name)) return { valid: false, msg: "Invalid Name (3-20 alphanumeric chars)." };
    if (!priceRegex.test(price) || parseFloat(price) <= 0) return { valid: false, msg: "Invalid Price." };
    if (!qtyRegex.test(qty)) return { valid: false, msg: "Invalid Quantity." };
    if (!category || category === "Category") return { valid: false, msg: "Select a Category." };
    return { valid: true };
}

export function save(name, priceRaw, qtyRaw, category) {
    const price = parseFloat(priceRaw);
    const qty = parseInt(qtyRaw);
    const status = qty > 0 ? "Available" : "Out of Stock";
    const newId = `ITM-${(itemDB.length + 1).toString().padStart(3, '0')}`;

    const newItem = new Item(newId, name, price, qty, category, status);
    itemDB.push(newItem);
    return newItem;
}

export function updateStatus(id, isChecked) {
    const item = itemDB.find(i => i.id === id);
    if (item) {
        item.status = isChecked ? "Available" : "Unavailable";
        return item;
    }
    return null;
}

export function update(id, name, priceRaw, qtyRaw, category) {
    const index = itemDB.findIndex(item => item.id === id);
    if (index !== -1) {
        itemDB[index].name = name;
        itemDB[index].price = parseFloat(priceRaw);
        itemDB[index].qty = parseInt(qtyRaw);
        itemDB[index].category = category;
        itemDB[index].status = itemDB[index].qty > 0 ? "Available" : "Out of Stock";
        return itemDB[index];
    }
    return null;
}