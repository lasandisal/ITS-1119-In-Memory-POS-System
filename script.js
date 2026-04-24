import { initializeLogin } from "./controller/LoginController.js";
import { initNavigation, setupGlobalSearch } from "./controller/NavigationController.js";
import { initializePos } from "./controller/PosController.js";
import { initializeItems } from "./controller/ItemController.js";
import { initializeCustomers } from "./controller/CustomerController.js";
import { initializeEmployees } from "./controller/UserController.js";
import { initializeOrders } from "./controller/OrderController.js";
import { loadDashboard } from "./controller/DashboardController.js";

$(document).ready(function() {
    initializeLogin();
    initNavigation();
    initializePos();
    initializeItems();
    initializeCustomers();
    initializeEmployees();
    initializeOrders();
    loadDashboard();
    setupGlobalSearch();
});

// $('#globalSearch').on('input', function() {
//     if ($(this).val().length > 0) {
//         $('#btnClearSearch').fadeIn(200);
//     } else {
//         $('#btnClearSearch').fadeOut(200);
//     }
// });

// $('#btnClearSearch').on('click', function() {
//     $('#globalSearch').val('');
//     $(this).fadeOut(200);
    
//     executeSearch(""); 
// });

    