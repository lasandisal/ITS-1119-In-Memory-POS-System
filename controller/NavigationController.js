import { loadProductGrid } from "./PosController.js";
import { loadItemTable } from "./ItemController.js";
import { loadCustomerTable } from "./CustomerController.js";
import { loadEmployeeTable } from "./UserController.js";
import { loadOrderTable } from "./OrderController.js";
import { loadDashboard } from "./DashboardController.js";

/* ===================== NAVIGATION ===================== */

export function initNavigation() {
    $('.nav-item').on('click', function () {

        $('.nav-item').removeClass('active');
        $(this).addClass('active');

        const targetSection = $(this).data('section');

        $('.view-section').hide();
        $(`#${targetSection}-view`).fadeIn(300);

        if (targetSection === 'pos') {
            $('body').addClass('pos-active');
            loadProductGrid();

        } else {
            $('body').removeClass('pos-active');
        }

        switch (targetSection) {
            case 'pos':
                loadProductGrid();
                break;

            case 'products':
                loadItemTable();
                break;

            case 'customers':
                loadCustomerTable();
                break;

            case 'employee':
                loadEmployeeTable();
                break;

            case 'reports':
                loadOrderTable();
                break;

            case 'dashboard':
                loadDashboard();
                break;
        }
    });
}

/* ===================== VIEW CONFIG ===================== */

const viewConfig = {
    pos: {
        searchable: true,
        handler: loadProductGrid
    },
    products: {
        searchable: true,
        handler: loadItemTable
    },
    customers: {
        searchable: true,
        handler: loadCustomerTable
    },
    employee: {
        searchable: true,
        handler: loadEmployeeTable
    },
    reports: {
        searchable: true,
        handler: loadOrderTable
    },
    dashboard: {
        searchable: false
    }
};

/* ===================== GLOBAL SEARCH ===================== */

export function setupGlobalSearch() {
    const searchInput = $('#globalSearch');
    const clearBtn = $('#btnClearSearch');

    searchInput.on('input', function () {
        const query = $(this).val().toLowerCase();

        query.length > 0
            ? clearBtn.fadeIn(200)
            : clearBtn.fadeOut(200);

        executeSearch(query);
    });

    clearBtn.on('click', function () {
        searchInput.val('');
        $(this).fadeOut(200);
        executeSearch('');
    });
}

/* ===================== EXECUTE SEARCH ===================== */

export function executeSearch(query) {

    const activeSection = $('.view-section:visible').attr('id');

    if (!activeSection) return;

    const viewName = activeSection.replace('-view', '');

    const config = viewConfig[viewName];

    // dashboard or non-searchable views
    if (!config || !config.searchable) return;

    // run correct handler
    config.handler(query);
}