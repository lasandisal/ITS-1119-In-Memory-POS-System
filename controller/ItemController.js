import * as ItemModel from "../model/ItemModel.js";
import { loadProductGrid } from "./PosController.js";
import { itemDB } from "../db/database.js";
import { Item } from "../dto/Item.js";

const nameRegex = /^[A-Za-z0-9 ]{3,20}$/;        
const priceRegex = /^[0-9]+(\.[0-9]{1,2})?$/;   
const qtyRegex = /^[0-9]+$/;

export function initializeItems() {
    loadItemTable();
    setupEventListeners();
}

// controller/ItemController.js
export function loadItemTable(filter = "") {
    const tableBody = $('#itemTableBody');
    const template = document.getElementById('item-row-template');
    tableBody.empty();

    itemDB.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(item => {
        // 1. Clone the template
        const clone = template.content.cloneNode(true);
        const row = $(clone).find('tr');

        // 2. Set Data (The Controller just maps data to the View)
        row.find('.product-icon').addClass(item.category === "Drinks" ? "fa-glass-whiskey" : "fa-cookie-bite");
        row.find('.product-id-cell').text(item.id);
        row.find('.product-name').text(item.name);
        row.find('.product-category').text(item.category);
        row.find('.product-price').text(`LKR ${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}`);

        // 3. Logic for Badge
        const qtyBadge = row.find('.qty-badge');
        qtyBadge.text(item.qty);
        qtyBadge.addClass(item.qty > 10 ? 'bg-light text-dark' : 'bg-danger-subtle text-danger');

        // 4. Logic for Toggle
        const toggle = row.find('.status-toggle');
        toggle.attr('data-id', item.id);
        toggle.prop('checked', item.status === "Available");

        // 5. Append to Table
        tableBody.append(row);
    });
}

function setupEventListeners() {
    // 1. ADD THIS: Listener for the main "Add Product" button
    $('.btn-add-product').on('click', function() {
        // Reset Modal to "Add" Mode
        $('#itemModalLabel').text("Add Product"); // Reset Title
        $('#itemModal').removeAttr('data-edit-id'); // Remove the "Hidden Tag"
        $('#itemForm')[0].reset(); // Clear all input fields
    });

    // 2. EXISTING: Open for Update (when clicking a row)
    $(document).on('click', '#itemTableBody tr', function() {
        const itemId = $(this).find('.product-id-cell').text().trim();
        if(itemId) fillModalForUpdate(itemId);
    });

    // 3. EXISTING: Save Button
    $('#btnSaveItem').on('click', () => handleSave());

    // 4. EXISTING: Search
    $('#itemSearch').on('input', function() {
        loadItemTable($(this).val());
    });

    // 5. EXISTING: Status Toggle
    $(document).on('change', '.status-toggle', function(e) {
        e.stopPropagation(); // Stops the modal from opening when toggling
        const itemId = $(this).data('id');
        const isChecked = $(this).prop('checked');

        ItemModel.updateStatus(itemId, isChecked);
        loadProductGrid(); 
    });
}

function fillModalForUpdate(id) {
    const item = itemDB.find(i => i.id === id);
    if (!item) return;

    // 1. Fill the form fields as usual
    $('#itemModalLabel').text("Update Product");
    $('#itemName').val(item.name);
    $('#itemPrice').val(item.price);
    $('#itemQty').val(item.qty);
    $('#itemCategory').val(item.category);
    
    // 2. Store the ID for the update logic
    $('#itemModal').attr('data-edit-id', id);

    // 3. THE FIX: Use getOrCreateInstance
    const modalElement = document.getElementById('itemModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement); 
    modal.show();
}

function handleSave() {
    const editId = $('#itemModal').attr('data-edit-id'); // Check if we are editing
    const category = $('#itemCategory').val();
    const name = $('#itemName').val().trim();
    const priceRaw = $('#itemPrice').val();
    const qtyRaw = $('#itemQty').val();

    const validation = ItemModel.validate(name, priceRaw, qtyRaw, category);
    if (!validation.valid) {
        alert(validation.msg);
        return;
    }

    if (editId) {
        // --- UPDATE MODE ---
        ItemModel.update(editId, name, priceRaw, qtyRaw, category);
        alert("Product updated successfully!");
    } else {
        // --- ADD MODE ---
        ItemModel.save(name, priceRaw, qtyRaw, category);
        alert("New product added!");
    }

    // Cleanup
    $('#itemModal').removeAttr('data-edit-id'); // Clear edit state
    $('#itemModalLabel').text("Add Product"); // Reset title
    bootstrap.Modal.getInstance(document.getElementById('itemModal')).hide();
    $('#itemForm')[0].reset();
    
    loadItemTable();
    loadProductGrid();
}

