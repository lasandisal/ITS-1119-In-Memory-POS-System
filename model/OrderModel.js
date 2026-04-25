import { ordersList } from "../db/database.js";
import { Order } from "../dto/Order.js";

export class OrderModel {

    validate(cart, customerId) {
        if (!cart || cart.length === 0) {
            return { valid: false, msg: "Cart is empty!" };
        }

        if (!customerId) {
            return { valid: false, msg: "Select a customer!" };
        }

        return { valid: true };
    }

    generateId() {
        return `ORD-${(ordersList.length + 1).toString().padStart(3, '0')}`;
    }

    save(orderData) {
        const id = this.generateId();

        const newOrder = new Order(
            id,
            orderData.date,
            orderData.time,
            orderData.customerId,
            orderData.adminId,
            orderData.discount,
            orderData.total,
            orderData.orderDetails
        );

        ordersList.push(newOrder);
        return newOrder;
    }

    getAll() {
        return ordersList;
    }

    getById(id) {
        return ordersList.find(order => order.id === id);
    }

    delete(id) {
        const index = ordersList.findIndex(o => o.id === id);
        if (index !== -1) ordersList.splice(index, 1);
    }

    calculateNetTotal(subTotal, discount) {
        return subTotal - (discount || 0);
    }
}