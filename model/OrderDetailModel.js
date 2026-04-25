import { OrderDetail } from "../dto/OrderDetail.js";

export class OrderDetailModel {

    create(itemId, qty, unitPrice) {
        if (!itemId) return null;
        if (qty <= 0) return null;
        if (unitPrice <= 0) return null;

        return new OrderDetail(itemId, qty, unitPrice);
    }

    calculateTotal(orderDetails) {
        return orderDetails.reduce((total, detail) => {
            return total + (detail.qty * detail.unitPrice);
        }, 0);
    }
}