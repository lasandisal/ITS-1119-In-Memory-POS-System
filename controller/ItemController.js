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

export function loadItemTable(filter = "") {
    const tableBody = $('#itemTableBody');
    const template = document.getElementById('item-row-template');
    tableBody.empty();

    itemDB.filter(item => item.name.toLowerCase().includes(filter.toLowerCase()))
    .forEach(item => {
        const clone = template.content.cloneNode(true);
        const row = $(clone).find('tr');

        row.find('.product-icon').addClass(item.category === "Drinks" ? "fa-glass-whiskey" : "fa-cookie-bite");
        row.find('.product-id-cell').text(item.id);
        row.find('.product-name').text(item.name);
        row.find('.product-category').text(item.category);
        row.find('.product-price').text(`LKR ${item.price.toLocaleString(undefined, {minimumFractionDigits: 2})}`);

        const qtyBadge = row.find('.qty-badge');
        qtyBadge.text(item.qty);
        qtyBadge.addClass(item.qty > 10 ? 'bg-light text-dark' : 'bg-danger-subtle text-danger');

        const toggle = row.find('.status-toggle');
        toggle.attr('data-id', item.id);
        toggle.prop('checked', item.status === "Available");

        tableBody.append(row);
    });
}

function setupEventListeners() {
    $('.btn-add-product').on('click', function() {
        $('#itemModalLabel').text("Add Product"); 
        $('#itemModal').removeAttr('data-edit-id');
        $('#itemForm')[0].reset(); 
    });

    $(document).on('click', '#itemTableBody tr', function() {
        const itemId = $(this).find('.product-id-cell').text().trim();
        if(itemId) fillModalForUpdate(itemId);
    });

    $('#btnSaveItem').on('click', () => handleSave());

    $('#itemSearch').on('input', function() {
        loadItemTable($(this).val());
    });

    $(document).on('change', '.status-toggle', function(e) {
        e.stopPropagation(); 
        const itemId = $(this).data('id');
        const isChecked = $(this).prop('checked');

        ItemModel.updateStatus(itemId, isChecked);
        loadProductGrid(); 
    });
}

function fillModalForUpdate(id) {
    const item = itemDB.find(i => i.id === id);
    if (!item) return;

    $('#itemModalLabel').text("Update Product");
    $('#itemName').val(item.name);
    $('#itemPrice').val(item.price);
    $('#itemQty').val(item.qty);
    $('#itemCategory').val(item.category);
    $('#itemModal').attr('data-edit-id', id);

    const modalElement = document.getElementById('itemModal');
    const modal = bootstrap.Modal.getOrCreateInstance(modalElement); 
    modal.show();
}

function handleSave() {
    const editId = $('#itemModal').attr('data-edit-id'); 
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
        ItemModel.update(editId, name, priceRaw, qtyRaw, category);
        alert("Product updated successfully!");
    } else {
        ItemModel.save(name, priceRaw, qtyRaw, category);
        alert("New product added!");
    }

    // Cleanup
    $('#itemModal').removeAttr('data-edit-id');
    $('#itemModalLabel').text("Add Product"); 
    bootstrap.Modal.getInstance(document.getElementById('itemModal')).hide();
    $('#itemForm')[0].reset();
    
    loadItemTable();
    loadProductGrid();
}

