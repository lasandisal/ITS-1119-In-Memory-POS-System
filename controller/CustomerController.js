import * as CustModel from "../model/CustomerModel.js";
import { customerDB } from "../db/database.js";
import { loadCustomerDropdown } from "../controller/PosController.js";

export function initializeCustomers() {
    loadCustomerTable();
    setupEventListeners();
}

export function loadCustomerTable(filter = "") {
    const tableBody = $('#customerTableBody');
    const template = document.getElementById('customer-row-template');
    tableBody.empty();

    const filtered = customerDB.filter(c => 
        c.name.toLowerCase().includes(filter.toLowerCase()) || c.contact.includes(filter)
    );

    filtered.forEach(cust => {
        const clone = template.content.cloneNode(true);
        const row = $(clone).find('tr');

        row.find('.customer-id-cell').text(cust.id);
        row.find('.customer-name').text(cust.name);
        row.find('.customer-contact').text(cust.contact);
        row.find('.customer-address').text(cust.address);
        
        if (cust.status === "Inactive") {
            row.addClass('customer-row-inactive');
        } else {
        row.removeClass('customer-row-inactive');
      }

        const toggle = row.find('.customer-status-toggle');
        toggle.attr('data-id', cust.id);
        toggle.prop('checked', cust.status === "Active");

        tableBody.append(row);
    });
}

function setupEventListeners() {
    $('.btn-add-customer').on('click', () => {
        $('#customerModalLabel').text("Register Customer");
        $('#customerModal').removeAttr('data-edit-id');
        $('#customerForm')[0].reset();
    });

    $(document).on('click', '#customerTableBody tr', function() {
        const id = $(this).find('.customer-id-cell').text().trim();
        if(id) fillModalForUpdate(id);
    });

    $('#btnSaveCustomer').on('click', () => handleSave());

    $(document).on('change', '.customer-status-toggle', function(e) {
    const id = $(this).data('id');
    const isChecked = $(this).prop('checked');

    CustModel.updateStatus(id, isChecked);
    
    const row = $(this).closest('tr');
    if (!isChecked) {
        row.addClass('customer-row-inactive');
    } else {
        row.removeClass('customer-row-inactive');
    }

    loadCustomerDropdown(); 
});
}

function fillModalForUpdate(id) {
    const cust = customerDB.find(c => c.id === id);
    if (!cust) return;

    $('#customerModalLabel').text("Update Customer");
    $('#custName').val(cust.name);
    $('#custContact').val(cust.contact);
    $('#custAddress').val(cust.address);
    $('#customerModal').attr('data-edit-id', id);

    bootstrap.Modal.getOrCreateInstance(document.getElementById('customerModal')).show();
}

function handleSave() {
    const editId = $('#customerModal').attr('data-edit-id');
    const name = $('#custName').val().trim();
    const contact = $('#custContact').val().trim();
    const address = $('#custAddress').val().trim();

    const validation = CustModel.validate(name, contact, address);
    if (!validation.valid) { alert(validation.msg); return; }

    if (editId) {
        CustModel.update(editId, name, contact, address);
    } else {
        CustModel.save(name, contact, address);
    }

    bootstrap.Modal.getOrCreateInstance(document.getElementById('customerModal')).hide();
    loadCustomerTable();
    loadCustomerDropdown();
}