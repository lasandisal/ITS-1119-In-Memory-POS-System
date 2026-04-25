import { itemDB, customerDB, usersDB } from "../db/database.js";
import { loadOrderTable } from "./OrderController.js";

import { ItemModel } from "../model/ItemModel.js";
import { OrderModel } from "../model/OrderModel.js";
import { OrderDetailModel } from "../model/OrderDetailModel.js";
import { CustomerModel } from "../model/CustomerModel.js";

const itemModel = new ItemModel();
const orderModel = new OrderModel();
const orderDetailModel = new OrderDetailModel();
const customerModel = new CustomerModel();

let cart = [];

let orderCounter = 1;

export function initializePos() {
    loadProductGrid();
    loadCustomerDropdown();
    setupEventListeners();
    updateHeaderInfo();
    setInterval(updateHeaderInfo, 1000);
    generateNewOrder();

    $(document).on('keydown', function(e) {
        if (e.key === "Tab") {
            e.preventDefault();
        }
    });
}

/* ===================== PRODUCT GRID ===================== */

export function loadProductGrid(filter = "") {
    const itemGrid = $('.item-grid');
    const itemTemplate = document.getElementById('pos-item-template');
    const emptyTemplate = document.getElementById('no-results-template');

    itemGrid.empty();

    const filteredItems = itemModel.getAll().filter(item =>
        item.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredItems.length === 0) {
        const clone = emptyTemplate.content.cloneNode(true);

        $(clone).find('.no-results-msg').html(
            `We couldn't find anything matching "<strong>${filter}</strong>".`
        );

        itemGrid.append(clone);
        return;
    }

    filteredItems.forEach(item => {
        const cartItem = cart.find(c => c.id === item.id);
        const reservedQty = cartItem ? cartItem.orderQty : 0;

        const displayQty = item.qty - reservedQty;
        const isUnavailable = item.status !== "Available" || displayQty <= 0;

        const icon = item.category === "Drinks"
            ? "fa-glass-whiskey"
            : "fa-cookie-bite";

        const clone = itemTemplate.content.cloneNode(true);
        const card = $(clone).find('.item-card');

        card.attr('data-id', item.id);
        card.find('.product-icon').addClass(icon);
        card.find('.item-name').text(item.name);
        card.find('.item-price').text(`LKR ${item.price.toFixed(2)}`);
        card.find('.qty-stock').text(displayQty);

        if (isUnavailable) {
            card.addClass('out-of-stock');
            card.append('<div class="status-overlay">UNAVAILABLE</div>');
        }

        itemGrid.append(card);
    });
}

/* ===================== CUSTOMER ===================== */

export function loadCustomerDropdown() {
    const customerSelect = $('.customer-selector select');
    customerSelect.empty();

    customerSelect.append('<option value="" selected disabled>Select Customer</option>');
    customerSelect.append('<option value="CUS-000">CUS-000 - Walk-in Guest</option>');

    const activeCustomers = customerModel.getAll().filter(c => c.status === "Active");

    activeCustomers.forEach(customer => {
        customerSelect.append(
            `<option value="${customer.id}">${customer.id} - ${customer.name}</option>`
        );
    });

}

/* ===================== HEADER ===================== */

function updateHeaderInfo() {
    const now = new Date();

    $('#js-clock').text(now.toLocaleTimeString());
    $('#js-date').text(now.toLocaleDateString());
}

export function loadUserSession(user) {
    if (user) {
        $('.user-name').text(user.name);
        $('.user-role').text(user.role);
    }
}

/* ===================== EVENTS ===================== */

function setupEventListeners() {

    $(document).on('click', '.item-card', function () {
        const itemId = $(this).data('id');
        addToCart(itemId);
    });

    $(document).on('click', '.qty-btn', function () {
        const itemId = $(this).closest('.cart-row').data('id');
        const action = $(this).text();
        updateCartQty(itemId, action);
    });

    $('.btn-proceed').on('click', function () {
        placeOrder();
    });

    $('#pos-discount-input').on('input', function () {
        renderCart();
    });

    $(document).on('click', '.remove-btn', function () {
        const id = $(this).closest('.cart-row').data('id');
        cart = cart.filter(i => i.id !== id);
        renderCart();
    });

    $(document).on('change', '.customer-selector select', function () {
        const id = $(this).val();

        if (id === "CUS-000") {
            $('#cust-name').text("Walk-in Customer");
            $('#cust-contact').text("-");
            return;
        }

        const cust = customerModel.getAll().find(c => c.id === id);

        if (cust) {
            $('#cust-name').text(cust.name);
            $('#cust-contact').text(cust.contact);
        }
    });

    $('#cash-input').on('input', function () {
    calculateBalance();

    $(this).removeClass('is-invalid');
    $('.cash-error').remove();
    });
}

/* ===================== CART ===================== */

function addToCart(itemId) {
    const item = itemModel.findById(itemId);

    if (item.status !== "Available" || item.qty <= 0) {
        alert("Item unavailable!");
        return;
    }

    const existingItem = cart.find(c => c.id === itemId);

    if (existingItem) {
        if (existingItem.orderQty < item.qty) {
            existingItem.orderQty++;
        } else {
            alert("Max stock reached");
        }
    } else {
        cart.push({
            id: item.id,
            name: item.name,
            price: item.price,
            orderQty: 1
        });
    }

    renderCart();
}

function updateCartQty(itemId, action) {
    const cartItem = cart.find(i => i.id === itemId);
    const stockItem = itemModel.findById(itemId);

    if (action === '+') {
        if (cartItem.orderQty < stockItem.qty) {
            cartItem.orderQty++;
        }
    } else {
        cartItem.orderQty--;
        if (cartItem.orderQty === 0) {
            cart = cart.filter(i => i.id !== itemId);
        }
    }

    renderCart();
}

/* ===================== CART RENDER ===================== */

function renderCart() {
    const cartList = $('.cart-list');
    const template = document.getElementById('cart-item-template');

    cartList.empty();

    let total = 0;

    cart.forEach(item => {
        total += item.price * item.orderQty;

        const clone = template.content.cloneNode(true);
        const row = $(clone).find('.cart-row');

        row.attr('data-id', item.id);
        row.find('.cart-item-name').text(item.name);
        row.find('.qty-val').text(item.orderQty);

        cartList.append(row);
    });

    let discount = parseFloat($('#pos-discount-input').val()) || 0;
    if (discount < 0) discount = 0;
    if (discount > 100) discount = 100;

    const netTotal = orderModel.calculateNetTotal(total, discount);

    $('#pos-subtotal').text(`LKR ${total.toFixed(2)}`);
    $('.total-amount').text(`LKR ${netTotal.toFixed(2)}`);

    loadProductGrid();
    calculateBalance();
}

/* ===================== BALANCE ===================== */

function calculateBalance() {
    const total = parseFloat($('.total-amount').text().replace(/[^0-9.]/g, "")) || 0;
    const cash = parseFloat($('#cash-input').val()) || 0;

    const balance = cash - total;
    $('#balance').text("LKR " + balance.toFixed(2));
}

/* ===================== ORDER ===================== */

function generateNewOrder() {
    const id = "ORD-" + String(orderCounter++).padStart(3, '0');
    $('#pos-order-id').text(id);
    $('#pos-order-date').text(new Date().toLocaleDateString());
}

function placeOrder() {

    const validation = orderModel.validate(cart, $('.customer-selector select').val());

    if (!validation.valid) {
        alert(validation.msg);
        return;
    }

    const total = parseFloat($('.total-amount').text().replace(/[^0-9.]/g, "")) || 0;
    const cash = parseFloat($('#cash-input').val()) || 0;

    if (cash <= 0) {
        showCashError("Enter cash amount");
        return;
    }

    if (cash < total) {
        showCashError("Insufficient cash");
        return;
    }

    const orderId = $('#pos-order-id').text();

    const subTotal = cart.reduce((acc, item) => acc + (item.price * item.orderQty), 0);

    let discount = parseFloat($('#pos-discount-input').val()) || 0;

    const orderDetails = cart.map(item =>
        orderDetailModel.create(item.id, item.orderQty, item.price)
    );

    orderModel.save({
        id: orderId,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        customerId: $('.customer-selector select').val(),
        adminId: usersDB[0].userId,
        discount,
        total: orderModel.calculateNetTotal(subTotal, discount),
        orderDetails
    });

    cart.forEach(cartItem => {
        const item = itemModel.findById(cartItem.id);
        item.qty -= cartItem.orderQty;
        if (item.qty <= 0) item.status = "Out of Stock";
    });

    cart = [];
    $('#pos-discount-input').val('');
    $('#cash-input').val('');
    $('#balance').text("LKR 0.00");
    $('#cust-name').text('');
    $('#cust-contact').text('');

    generateNewOrder(); 
    renderCart();
    loadOrderTable();

    alert("Order Placed Successfully!");
}

/* ===================== HELPERS ===================== */

function showCashError(message) {
    const input = $('#cash-input');

    input.addClass('is-invalid');

    $('.cash-error').remove();

    input.after(`<div class="text-danger small mt-1 cash-error">${message}</div>`);
}