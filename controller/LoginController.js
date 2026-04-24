import { usersDB } from "../db/database.js";
import { loadUserSession } from "./PosController.js";

export function initializeLogin() {
    $('#btn-login-submit').on('click', function() {
        handleLogin();
    });

    // Allow "Enter" key to login
    $('.login-input').on('keypress', function(e) {
        if (e.which === 13) handleLogin();
    });

    $('#btn-logout').on('click', function() {
        handleLogout();
    });
}

// controller/LoginController.js

function handleLogin() {
    const usernameInput = $('#username').val().trim();
    const passwordInput = $('#password').val().trim();

    const user = usersDB.find(u => u.username === usernameInput && u.password === passwordInput);

    if (user) {
        // 1. Load user data into header
        loadUserSession(user);

        // 2. Reveal the main application
        $('body').addClass('logged-in');

        // --- THE FIX: RESET NAVIGATION TO POS ---
        
        // Remove 'active' class from everything (especially the red Log Out button)
        $('.nav-item').removeClass('active'); 
        
        // Set the POS menu item as active
        $('.nav-item[data-section="pos"]').addClass('active'); 
        
        // Hide all views and show ONLY the POS section
        $('.view-section').hide(); 
        $('#pos-view').fadeIn(300); 

        console.log(`Login successful: Welcome ${user.name}`);
    } else {
        alert("Invalid Username or Password!");
        $('#password').val('');
    }
}

function handleLogout() {
    // Hide the app
    $('body').removeClass('logged-in');

    // Remove the red highlight from the Logout button immediately
    $('.nav-item').removeClass('active');

    // Clear inputs
    $('#username').val('');
    $('#password').val('');
}