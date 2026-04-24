import { itemDB, customerDB, usersDB, ordersList } from "../db/database.js";
import { loadOrderTable } from "./OrderController.js";

let cart = [];

export function initializePos() {
    loadProductGrid(); // Fixed name
    loadCustomerDropdown();
    setupEventListeners();
    updateHeaderInfo(); 
    setInterval(updateHeaderInfo, 1000);
}

export function loadProductGrid(filter = "") {
    const itemGrid = $('.item-grid');
    const itemTemplate = document.getElementById('pos-item-template');
    const emptyTemplate = document.getElementById('no-results-template');
    
    itemGrid.empty(); 

    const filteredItems = itemDB.filter(item => 
        item.name.toLowerCase().includes(filter.toLowerCase())
    );

    if (filteredItems.length === 0) {
        const clone = emptyTemplate.content.cloneNode(true);
        
        $(clone).find('.no-results-msg').html(
            `We couldn't find anything matching "<strong>${filter}</strong>". <br> Try a different keyword!`
        );
        
        itemGrid.append(clone);
        return; 
    }

    filteredItems.forEach(item => {
        const cartItem = cart.find(c => c.id === item.id);
        const reservedQty = cartItem ? cartItem.orderQty : 0;
        const displayQty = item.qty - reservedQty;
        const isUnavailable = item.status !== "Available" || displayQty <= 0;
        const icon = item.category === "Drinks" ? "fa-glass-whiskey" : "fa-cookie-bite";

        const clone = itemTemplate.content.cloneNode(true);
        const card = $(clone).find('.item-card');

        card.attr('data-id', item.id);
        card.find('.product-icon').addClass(icon);
        card.find('.item-name').text(item.name);
        card.find('.item-price').text(`LKR ${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
        card.find('.qty-stock').text(displayQty);

        if (isUnavailable) {
            card.addClass('out-of-stock');
            card.append('<div class="status-overlay">UNAVAILABLE</div>');
        }

        itemGrid.append(card);
    });
}

export function loadCustomerDropdown() {
    const customerSelect = $('.customer-selector select');
    customerSelect.empty();

    customerSelect.append('<option value="" selected disabled>Select Customer</option>');
    customerSelect.append('<option value="CUS-000">CUS-000 - Walk-in Guest</option>');
    const activeCustomers = customerDB.filter(cust => cust.status === "Active");

    activeCustomers.forEach(customer => {
        const option = `<option value="${customer.id}">${customer.id} - ${customer.name}</option>`;
        customerSelect.append(option);
    });
}

function updateHeaderInfo() {
    const now = new Date();
    
    const timeOptions = { hour12: true, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const dateOptions = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };

    $('#js-clock').text(now.toLocaleTimeString('en-US', timeOptions).replace(/:/g, ' : '));
    $('#js-date').text(now.toLocaleDateString('en-US', dateOptions));
}

export function loadUserSession(user) {
    if (user) {
        $('.user-name').text(user.name); 
        $('.user-role').text(user.role); 
    }
}

function setupEventListeners() {

    $(document).on('click', '.item-card', function() {
        const itemId = $(this).data('id');
        addToCart(itemId);
    });

    $(document).on('click', '.qty-btn', function() {
        const itemId = $(this).closest('.cart-row').data('id');
        const action = $(this).text();
        updateCartQty(itemId, action);
    });

    $('.btn-proceed').on('click', function() {
        placeOrder();
    });
}

function addToCart(itemId) {
    const item = itemDB.find(i => i.id === itemId);
    
    if (item.status !== "Available" || item.qty <= 0) {
        alert("This item is currently unavailable or out of stock!");
        return;
    }

    const existingItem = cart.find(cartItem => cartItem.id === itemId);
    const reservedQty = existingItem ? existingItem.orderQty : 0;

    if (reservedQty < item.qty) {
        if (existingItem) {
            existingItem.orderQty++;
        } else {
            cart.push({
                id: item.id,
                name: item.name,
                price: item.price,
                orderQty: 1
            });
        }
        renderCart();
    } else {
        alert("Not enough stock available!");
    }
}

function updateCartQty(itemId, action) {
    const cartItem = cart.find(i => i.id === itemId);
    if (!cartItem) return;

    if (action === '+') {
        const stockItem = itemDB.find(i => i.id === itemId);
        if (cartItem.orderQty < stockItem.qty) {
            cartItem.orderQty++;
        } else {
            alert("Max stock reached");
        }
    } else {
        cartItem.orderQty--;
        if (cartItem.orderQty === 0) {
            cart = cart.filter(i => i.id !== itemId);
        }
    }
    renderCart();
}

$('#pos-discount-input').on('input', function() {
    renderCart(); 
});

function renderCart() {
    const cartList = $('.cart-list');
    const itemTemplate = document.getElementById('cart-item-template');
    const emptyTemplate = document.getElementById('empty-cart-template');
    
    cartList.empty(); 
    let total = 0; 
    if (cart.length === 0) {
        const clone = emptyTemplate.content.cloneNode(true);
        cartList.append(clone);
    } 
    else {
        cart.forEach(item => {
            const itemSubtotal = item.price * item.orderQty; 
            total += itemSubtotal; 

            const clone = itemTemplate.content.cloneNode(true);
            const row = $(clone).find('.cart-row');

            row.attr('data-id', item.id);
            row.find('.cart-item-name').text(item.name);
            row.find('.qty-val').text(item.orderQty);

            cartList.append(row);
        });
    }

    const discount = parseFloat($('#pos-discount-input').val()) || 0;
    const netTotal = total - discount; 

    $('#pos-subtotal').text(`LKR ${total.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
    $('.total-amount').text(`LKR ${netTotal.toLocaleString(undefined, {minimumFractionDigits: 2})}`);
    
    loadProductGrid();
}

function placeOrder() {
    if (cart.length === 0) {
        alert("Cart is empty!");
        return;
    }

    const selectedCustomerId = $('.customer-selector select').val();
    const subTotal = cart.reduce((acc, item) => acc + (item.price * item.orderQty), 0);
    const discount = parseFloat($('#pos-discount-input').val()) || 0;

    const newOrder = {
        id: `ORD-${(ordersList.length + 1).toString().padStart(3, '0')}`,
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        customerId: selectedCustomerId,
        adminId: usersDB[0].userId,
        discount: discount,
        total: subTotal - discount, 
        orderDetails: cart.map(item => ({
            itemId: item.id,
            qty: item.orderQty,
            unitPrice: item.price
        }))
    };

    ordersList.push(newOrder);
    $('#pos-discount-input').val('');

    cart.forEach(cartItem => {
        const item = itemDB.find(i => i.id === cartItem.id);
        
        item.qty -= cartItem.orderQty;

        if (item.qty <= 0) {
            item.status = "Out of Stock";
        }
    });

    cart = [];
    renderCart();
    loadOrderTable();
    alert("Order Placed Successfully!");
    console.log("Updated Orders List:", ordersList);
}

