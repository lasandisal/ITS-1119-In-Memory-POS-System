import { customerDB } from "../db/database.js";
import { Customer } from "../dto/Customer.js";

export class CustomerModel {

    validate(name, contact, address) {
        const contactRegex = /^(?:0|94|\+94)?7\d{8}$/;

        if (name.length < 3) return { valid: false, msg: "Name too short" };
        if (!contactRegex.test(contact)) return { valid: false, msg: "Invalid contact" };
        if (address.length < 5) return { valid: false, msg: "Invalid address" };

        return { valid: true };
    }

    save(name, contact, address) {
        const id = `CUS-${(customerDB.length + 1).toString().padStart(3, '0')}`;
        const customer = new Customer(id, name, contact, address, "Active");

        customerDB.push(customer);
        return customer;
    }

    update(id, name, contact, address) {
        const customer = customerDB.find(c => c.id === id);
        if (!customer) return null;

        customer.name = name;
        customer.contact = contact;
        customer.address = address;

        return customer;
    }

    delete(id) {
        const index = customerDB.findIndex(c => c.id === id);
        if (index !== -1) customerDB.splice(index, 1);
    }

    toggleStatus(id, status) {
        const customer = customerDB.find(c => c.id === id);
        if (customer) customer.status = status ? "Active" : "Inactive";
    }

    getAll() {
        return customerDB;
    }
}