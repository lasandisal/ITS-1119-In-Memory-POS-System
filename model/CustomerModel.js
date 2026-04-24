import { customerDB } from "../db/database.js";
import { Customer } from "../dto/Customer.js";

export function validate(name, contact, address) {
    const contactRegex = /^(?:0|94|\+94)?(?:(11|21|23|24|25|26|27|31|32|33|34|35|36|37|38|41|45|47|51|52|54|55|57|63|65|66|67|81|91)(0|2|3|4|5|7|9)|7(0|1|2|4|5|6|7|8)\d)\d{6}$/;

    if (name.length < 3) return { valid: false, msg: "Name is too short!" };
    if (!contactRegex.test(contact)) return { valid: false, msg: "Invalid Sri Lankan contact number!" };
    if (address.length < 5) return { valid: false, msg: "Please enter a valid address." };

    return { valid: true };
}

export function save(name, contact, address) {
    const newId = `CUS-00${customerDB.length + 1}`;
    const newCustomer = new Customer(newId, name, contact, address, "Active");
    customerDB.push(newCustomer);
}

export function update(id, name, contact, address) {
    const index = customerDB.findIndex(c => c.id === id);
    if (index !== -1) {
        customerDB[index].name = name;
        customerDB[index].contact = contact;
        customerDB[index].address = address;
    }
}

export function remove(id) {
    const index = customerDB.findIndex(c => c.id === id);
    if (index !== -1) customerDB.splice(index, 1);
}


export function updateStatus(id, isChecked) {
    const customer = customerDB.find(c => c.id === id);
    if (customer) {
        customer.status = isChecked ? "Active" : "Inactive";
        console.log(`Customer ${id} is now ${customer.status}`);
    }
}