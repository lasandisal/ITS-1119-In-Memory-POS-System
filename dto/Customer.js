export class Customer {
    constructor(id, name, contact, address, status = "Active") {
        this.id = id;
        this.name = name;
        this.contact = contact;
        this.address = address;
        this.status = status;
    }
}