export class Order {
    constructor(id, date, time, customerId, adminId, discount, total, orderDetails) {
        this.id = id;
        this.date = date;
        this.time = time;
        this.customerId = customerId;
        this.adminId = adminId;
        this.discount = discount;
        this.total = total;
        this.orderDetails = orderDetails;
    }
}