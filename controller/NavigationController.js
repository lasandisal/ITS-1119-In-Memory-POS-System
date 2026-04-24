import { loadProductGrid } from "./PosController.js"; 
import { loadItemTable } from "./ItemController.js";
import { loadCustomerTable } from "./CustomerController.js";
import { loadEmployeeTable } from "./UserController.js"; 
import { loadOrderTable } from "./OrderController.js";
import { loadDashboard } from "./DashboardController.js";

export function initNavigation() {
    $('.nav-item').on('click', function() {
        $('.nav-item').removeClass('active');
        $(this).addClass('active');

        const targetSection = $(this).data('section'); 
        
        $('.view-section').hide();
        $(`#${targetSection}-view`).fadeIn(300);

        if (targetSection === 'pos') {
            $('body').addClass('pos-active');
            loadProductGrid(); 
        } else if (targetSection === 'products') {
            $('body').removeClass('pos-active');
            loadItemTable(); 
        } else if (targetSection === 'customers') {
            $('body').removeClass('pos-active');
            loadCustomerTable();
        } else if (targetSection === 'employee') { 
            $('body').removeClass('pos-active');
            loadEmployeeTable();
        } else if(targetSection === 'reports'){
            $('body').removeClass('pos-active');
            loadOrderTable();
        } else if (targetSection === 'reports') {
            $('body').removeClass('pos-active');
            loadOrderTable();
        } else{
            $('body').removeClass('pos-active');
        }
    });
}

export function setupGlobalSearch() {
    const searchInput = $('#globalSearch');
    const clearBtn = $('#btnClearSearch');

    // Listener for typing
    searchInput.on('input', function() {
        const query = $(this).val().toLowerCase();
        
        // Show/Hide X button
        if (query.length > 0) {
            clearBtn.fadeIn(200);
        } else {
            clearBtn.fadeOut(200);
        }

        // Context-Aware Search
        executeSearch(query);
    });

    // Listener for Clear Button Click
    clearBtn.on('click', function() {
        searchInput.val(''); // Empty the input
        $(this).fadeOut(200); // Hide the X
        executeSearch("");    // Reset the view to show all data
    });
}

export function executeSearch(query) {
    if ($('#pos-view').is(':visible')) {
        loadProductGrid(query);
    } else if ($('#products-view').is(':visible')) {
        loadItemTable(query);
    } else if ($('#customers-view').is(':visible')) {
        loadCustomerTable(query);
    } else if ($('#employee-view').is(':visible')) { 
        loadEmployeeTable(query);
    } else if ($('#reports-view').is(':visible')) { 
        loadOrderTable(query);
    }
}