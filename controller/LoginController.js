import { usersDB } from "../db/database.js";
import { loadUserSession } from "./PosController.js";

export function initializeLogin() {
    $('#btn-login-submit').on('click', function() {
        handleLogin();
    });

    $('.login-input').on('keypress', function(e) {
        if (e.which === 13) handleLogin();
    });

    $('#btn-logout').on('click', function() {
        handleLogout();
    });
}

function handleLogin() {
    const usernameInput = $('#username').val().trim();
    const passwordInput = $('#password').val().trim();

    const user = usersDB.find(u => u.username === usernameInput && u.password === passwordInput);

    if (user) {
        loadUserSession(user);

        $('body').addClass('logged-in');
        $('.nav-item').removeClass('active'); 
        $('.nav-item[data-section="pos"]').addClass('active'); 
        $('.view-section').hide(); 
        $('#pos-view').fadeIn(300); 

        console.log(`Login successful: Welcome ${user.name}`);
    } else {
        alert("Invalid Username or Password!");
        $('#password').val('');
    }
}

function handleLogout() {
    $('body').removeClass('logged-in');
    $('.nav-item').removeClass('active');
    $('#username').val('');
    $('#password').val('');
}