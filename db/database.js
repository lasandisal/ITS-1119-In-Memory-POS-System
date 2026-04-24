import { Customer } from "../dto/Customer.js";
import { Item } from "../dto/Item.js";
import { User } from "../dto/User.js";


export const customerDB = [
    new Customer("CUS-001", "Lasandi Uvindya", "0771234567", "Ahangama", "Active"),
    new Customer("CUS-002", "Nilmi Rathnayake", "0712233445", "Galle", "Active"),
    new Customer("CUS-003", "Ranudi Kaveesha", "0765544332", "Matara", "Active"),
    new Customer("CUS-004", "Dasuni Mallawa", "0708899776", "Colombo", "Inactive"),
    new Customer("CUS-005", "Niruni Fonseka", "0751122334", "Kandy", "Active")
];


export const itemDB = [
    new Item("ITM-001", "Butter Croissant", 600.00, 25, "Foods", "Available"),
    new Item("ITM-002", "Hot Macchiato", 1500.00, 50, "Drinks", "Available"),
    new Item("ITM-003", "French Bread", 800.00, 15, "Foods", "Available"),
    new Item("ITM-004", "Iced Americano", 1200.00, 40, "Drinks", "Available"),
    new Item("ITM-005", "Chocolate Muffin", 450.00, 0, "Foods", "Out of Stock"),
    new Item("ITM-006", "Blueberry Cheesecake", 1800.00, 10, "Foods", "Available")
];


export const usersDB = [
    {
        userId: "USR-001",
        name: "Selin Ercel",
        username: "admin",
        password: "123",
        role: "Cashier",
        status: "Active"
    },
    {
        userId: "USR-002",
        name: "Lasandi Salwathura",
        username: "lasandi",
        password: "456",
        role: "Manager",
        status: "Active"
    }
];


export const ordersList = [
    { 
        id: "ORD-001", 
        date: "2026-04-20", 
        time: "09:15 AM", 
        customerId: "CUS-001", 
        adminId: "USR-001", 
        total: 2700.00, 
        orderDetails: [
            { itemId: "ITM-001", qty: 2, unitPrice: 600.00 }, 
            { itemId: "ITM-002", qty: 1, unitPrice: 1500.00 }
        ] 
    },
    { 
        id: "ORD-002", 
        date: "2026-04-22", 
        time: "02:30 PM", 
        customerId: "CUS-002", 
        adminId: "USR-001", 
        total: 1600.00, 
        orderDetails: [
            { itemId: "ITM-003", qty: 2, unitPrice: 800.00 }
        ] 
    },
    { 
        id: "ORD-003", 
        date: "2026-04-24", 
        time: "10:00 AM", 
        customerId: "CUS-003", 
        adminId: "USR-003", 
        total: 1200.00, 
        orderDetails: [
            { itemId: "ITM-004", qty: 1, unitPrice: 1200.00 }
        ] 
    }
];