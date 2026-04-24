import { ordersList, itemDB, customerDB } from "../db/database.js";

export function loadDashboard() {
    // 1. Calculate Total Revenue
    const revenue = ordersList.reduce((acc, order) => acc + order.total, 0);
    $('#dash-revenue').text(`LKR ${revenue.toLocaleString(undefined, {minimumFractionDigits: 2})}`);

    // 2. Total Order Count
    $('#dash-orders').text(ordersList.length);

    // 3. Active Customer Count
    const activeCust = customerDB.filter(c => c.status === "Active").length;
    $('#dash-customers').text(activeCust);

    // 4. Low Stock Items (Items with qty less than 10)
    const lowStockCount = itemDB.filter(item => item.qty < 10).length;
    $('#dash-low-stock').text(lowStockCount);
}