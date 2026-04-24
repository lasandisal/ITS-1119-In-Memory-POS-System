import { ordersList, itemDB, customerDB } from "../db/database.js";

export function loadDashboard() {
    const revenue = ordersList.reduce((acc, order) => acc + order.total, 0);
    $('#dash-revenue').text(`LKR ${revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
    $('#dash-orders').text(ordersList.length);

    const activeCust = customerDB.filter(c => c.status === "Active").length;
    $('#dash-customers').text(activeCust);

    const lowStockCount = itemDB.filter(item => item.qty < 10).length;
    $('#dash-low-stock').text(lowStockCount);
}