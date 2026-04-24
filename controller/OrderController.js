import { ordersList, customerDB, usersDB } from "../db/database.js";

export function initializeOrders() {
    loadOrderTable();
}

export function loadOrderTable(filter = "") {
    const tableBody = $('#orderTableBody');
    const template = document.getElementById('order-row-template');
    tableBody.empty();

    // 1. Update Total Sales Count Card
    $('#total-sales-count').text(ordersList.length);

    // 2. Filter and Render
    ordersList.filter(order => order.id.includes(filter) || order.customerId.includes(filter))
    .forEach(order => {
        const clone = template.content.cloneNode(true);
        const row = $(clone).find('tr');

        const discountVal = order.discount || 0; // Fallback to 0 if missing
        row.find('.order-discount-cell').text(`LKR ${discountVal.toLocaleString(undefined, {minimumFractionDigits: 2})}`);

        // Find Customer and User Names
        const customer = customerDB.find(c => c.id === order.customerId);
        const admin = usersDB.find(u => u.userId === order.adminId);

        // Map Data
        row.find('.order-date-time').text(`${order.date}, ${order.time}`);
        row.find('.order-meta-info').text(`${order.customerId}, by ${admin ? admin.name : 'Unknown'}`);
        row.find('.order-id-cell').text(`#${order.id}`);
        row.find('.order-total-cell').text(order.total.toLocaleString(undefined, {minimumFractionDigits: 2}));

        // Store ID for modal
        row.attr('data-order-id', order.id);

        tableBody.append(row);
    });

    setupOrderRowClicks();
}

function setupOrderRowClicks() {
    $('.order-clickable-row').on('click', function() {
        const orderId = $(this).data('order-id');
        showOrderDetails(orderId);
    });
}

function showOrderDetails(id) {
    const order = ordersList.find(o => o.id === id);
    const container = $('#order-items-container');
    container.empty();

    order.orderDetails.forEach(item => {
        container.append(`
            <div class="d-flex justify-content-between small mb-2">
                <span>Item: ${item.itemId} (x${item.qty})</span>
                <span>LKR ${(item.qty * item.unitPrice).toFixed(2)}</span>
            </div>
        `);
    });

    $('#detail-grand-total').text(`LKR ${order.total.toFixed(2)}`);
    bootstrap.Modal.getOrCreateInstance(document.getElementById('orderDetailsModal')).show();
}