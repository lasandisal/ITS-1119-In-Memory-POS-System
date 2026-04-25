import { UserModel } from "../model/UserModel.js";
import { usersDB } from "../db/database.js";

const userModel = new UserModel();

export function initializeEmployees() {
    loadEmployeeTable();
    setupEventListeners();
}

export function loadEmployeeTable(filter = "") {
    const tableBody = $('#employeeTableBody');
    const template = document.getElementById('employee-row-template');
    tableBody.empty();

    usersDB
        .filter(u =>
            u.name.toLowerCase().includes(filter.toLowerCase()) ||
            u.username.includes(filter)
        )
        .forEach(emp => {
            const clone = template.content.cloneNode(true);
            const row = $(clone).find('tr');

            row.find('.emp-id-cell').text(emp.userId);
            row.find('.emp-name').text(emp.name);
            row.find('.emp-username').text(`@${emp.username}`);

            const badge = row.find('.role-badge');
            badge
                .text(emp.role)
                .addClass(emp.role === "Manager" ? "role-manager" : "role-cashier");

            if (emp.status === "Inactive") {
                row.addClass('customer-row-inactive');
            } else {
                row.removeClass('customer-row-inactive');
            }

            const toggle = row.find('.emp-status-toggle');
            toggle
                .attr('data-id', emp.userId)
                .prop('checked', emp.status === "Active");

            tableBody.append(row);
        });
}

function setupEventListeners() {

    $('.btn-add-employee').on('click', () => {
        $('#employeeModalLabel').text("Add Employee");
        $('#employeeModal').removeAttr('data-edit-id');
        $('#employeeForm')[0].reset();
    });

    $(document).on('click', '#employeeTableBody tr', function () {
        const id = $(this).find('.emp-id-cell').text().trim();
        if (id) fillModalForUpdate(id);
    });

    $('#btnSaveEmployee').on('click', () => handleSave());

    $(document).on('change', '.emp-status-toggle', function () {
        const id = $(this).data('id');
        const isChecked = $(this).prop('checked');

        userModel.toggleStatus(id, isChecked);

        $(this).closest('tr').toggleClass('customer-row-inactive', !isChecked);
    });
}

function fillModalForUpdate(id) {
    const emp = usersDB.find(u => u.userId === id);
    if (!emp) return;

    $('#employeeModalLabel').text("Update Employee");
    $('#empName').val(emp.name);
    $('#empUsername').val(emp.username);
    $('#empRole').val(emp.role);
    $('#empPassword').val(emp.password);

    $('#employeeModal').attr('data-edit-id', id);

    bootstrap.Modal
        .getOrCreateInstance(document.getElementById('employeeModal'))
        .show();
}

function handleSave() {
    const editId = $('#employeeModal').attr('data-edit-id');

    const name = $('#empName').val().trim();
    const username = $('#empUsername').val().trim();
    const password = $('#empPassword').val();
    const role = $('#empRole').val();

    const validation = userModel.validate(name, username, password);

    if (!validation.valid) {
        alert("Invalid input! Please check fields.");
        return;
    }

    if (editId) {
        userModel.update(editId, name, username, password, role);
    } else {
        userModel.save(name, username, password, role);
    }

    bootstrap.Modal
        .getOrCreateInstance(document.getElementById('employeeModal'))
        .hide();

    loadEmployeeTable();
}