import { CustomerModel } from "../model/CustomerModel.js";
import { customerDB } from "../db/database.js";
import { loadCustomerDropdown } from "../controller/PosController.js";

const CustModel = new CustomerModel();

export function initializeCustomers() {
    loadCustomerTable();
    setupEventListeners();
}

// STEP 6: The data arrives from the navigation file into the 'filter' parameter
// The (= "") means if nothing is passed, 'filter' automatically becomes a blank string ""
export function loadCustomerTable(filter = "") {
    const tableBody = $('#customerTableBody');
    const template = document.getElementById('customer-row-template');

    // Always clear out the existing HTML rows so we don't duplicate data on screen
    tableBody.empty();

    // ========================================================================
    // FILTERING MECHANISM 
    // ========================================================================
    const filtered = customerDB.filter(c =>
        // SCENARIO A: If you searched "John":
        // 1. It converts the database name (e.g., "JOHN SMITH") to lowercase ("john smith").
        // 2. It checks if it .includes() your lowercase query ("john").
        // 3. If the name or the contact matches, it returns TRUE and keeps the customer.
        
        // SCENARIO B: If the search is empty (""):
        // 1. JavaScript evaluates: c.name.toLowerCase().includes("")
        // 2. RULE: In JavaScript, EVERY text string automatically includes an empty string ("").
        // 3. This means it returns TRUE for EVERY single customer in the database! 
        c.name.toLowerCase().includes(filter.toLowerCase()) || c.contact.includes(filter)
    );
    // RESULT: 
    // Scenario A: 'filtered' contains ONLY the matching customers (e.g., just John).
    // Scenario B: 'filtered' becomes a perfect, full clone of your entire 'customerDB'.

    // STEP 7: REDRAW THE UI SCREEN
    // Loop through our results array (whether it has 1 customer or all of them)
    filtered.forEach(cust => {
        // Clone the HTML blueprint row template
        const clone = template.content.cloneNode(true);
        const row = $(clone).find('tr');

        // Fill the blank template HTML cells with the customer's actual data
        row.find('.customer-id-cell').text(cust.id);
        row.find('.customer-name').text(cust.name);
        row.find('.customer-contact').text(cust.contact);
        row.find('.customer-address').text(cust.address);
        
        // Apply styling colors based on whether they are Active or Inactive
        if (cust.status === "Inactive") {
            row.addClass('customer-row-inactive');
        } else {
        row.removeClass('customer-row-inactive');
      }

      // Set up the checkbox toggle switch data attributes
        const toggle = row.find('.customer-status-toggle');
        toggle.attr('data-id', cust.id);
        toggle.prop('checked', cust.status === "Active");

        // Inject the newly created row onto your visible webpage table body
        tableBody.append(row);
    });
}

function setupEventListeners() {
    // ========================================================================
    // FLOW A: PREPARING FOR A NEW INSERT (SAVE)
    // ========================================================================
    $('.btn-add-customer').on('click', () => {
        // 1. Change the modal title to let the user know they are registering someone new
        $('#customerModalLabel').text("Register Customer");
        
        // 2.Remove any old 'data-edit-id' attribute.
        // This ensures handleSave() knows there is NO existing customer ID being edited.
        $('#customerModal').removeAttr('data-edit-id');
        // 3. Wipe the input fields clean so the user starts with an empty form
        $('#customerForm')[0].reset();
    });

    // ========================================================================
    // FLOW B: PREPARING FOR AN UPDATE
    // ========================================================================
    $(document).on('click', '#customerTableBody tr', function() {
        // 1. Grab the customer ID text string from the clicked table row's ID cell
        const id = $(this).find('.customer-id-cell').text().trim();
        // 2. If an ID was successfully found, pass it to the setup function below
        if(id) fillModalForUpdate(id);
    });

    // The shared Save button inside the modal
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
    // 1. Look through the database array to find the customer matching this ID
    const cust = customerDB.find(c => c.id === id);
    if (!cust) return; // if customer doesn't exist, stop here

    // 2. Change the modal title to let the user know they are editing someone
    $('#customerModalLabel').text("Update Customer");

    // 3. Pre-populate the input fields with the customer's current data from the DB
    $('#custName').val(cust.name);
    $('#custContact').val(cust.contact);
    $('#custAddress').val(cust.address);

    // 4. Stamp the customer's ID onto the modal element as a 'data-edit-id' attribute.
    // This acts as a flag so handleSave() knows exactly WHICH customer to modify later.
    $('#customerModal').attr('data-edit-id', id);

    // 5. Open the modal container on screen
    bootstrap.Modal.getOrCreateInstance(document.getElementById('customerModal')).show();
}

function handleSave() {
    // 1. Check if the modal has a 'data-edit-id' attribute stamped on it
    const editId = $('#customerModal').attr('data-edit-id');

    // 2. Extract values typed into the text inputs and trim trailing whitespaces
    const name = $('#custName').val().trim();
    const contact = $('#custContact').val().trim();
    const address = $('#custAddress').val().trim();

    // 3. Data Validation
    const validation = CustModel.validate(name, contact, address);
    if (!validation.valid) { alert(validation.msg); return; }

    // ========================================================================
    // 4. DECIDING BETWEEN UPDATE VS SAVE
    // ========================================================================
    if (editId) {
        // PATH B (UPDATE): If editId exists, the user came from clicking a table row.
        // Tell the model to locate 'editId' in the database and overwrite its values.
        CustModel.update(editId, name, contact, address);
    } else {
        // PATH A (SAVE): If editId is null/undefined, the user clicked "Add Customer".
        // Tell the model to generate a new ID and push a brand new record into the database.
        CustModel.save(name, contact, address);
    }

    // Hide the modal window
    bootstrap.Modal.getOrCreateInstance(document.getElementById('customerModal')).hide();

    // 6. Refresh the UI 
    loadCustomerTable();
    loadCustomerDropdown();
}