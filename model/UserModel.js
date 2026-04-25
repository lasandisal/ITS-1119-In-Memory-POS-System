// import { usersDB } from "../db/database.js";

// export function validate(name, username, password) {
//     if (name.length < 3) return { valid: false, msg: "Name is too short!" };
//     if (username.length < 4) return { valid: false, msg: "Username must be at least 4 characters." };
//     if (password.length < 3) return { valid: false, msg: "Password is too weak!" };
//     return { valid: true };
// }

// export function save(name, username, password, role) {
//     const newId = `USR-${(usersDB.length + 1).toString().padStart(3, '0')}`;
//     usersDB.push({ userId: newId, name, username, password, role, status: "Active" });
// }

// export function update(id, name, username, password, role) {
//     const index = usersDB.findIndex(u => u.userId === id);
//     if (index !== -1) {
//         usersDB[index].name = name;
//         usersDB[index].username = username;
//         if(password) usersDB[index].password = password; // Only update if typed
//         usersDB[index].role = role;
//     }
// }

// export function updateStatus(id, isChecked) {
//     const user = usersDB.find(u => u.userId === id);
//     if (user) user.status = isChecked ? "Active" : "Inactive";
// }

import { usersDB } from "../db/database.js";

export class UserModel {

    validate(name, username, password) {
        if (name.length < 3) return { valid: false };
        if (username.length < 4) return { valid: false };
        if (password.length < 3) return { valid: false };

        return { valid: true };
    }

    save(name, username, password, role) {
        const id = `USR-${(usersDB.length + 1).toString().padStart(3, '0')}`;

        const user = { userId: id, name, username, password, role, status: "Active" };
        usersDB.push(user);

        return user;
    }

    update(id, name, username, password, role) {
        const user = usersDB.find(u => u.userId === id);
        if (!user) return null;

        user.name = name;
        user.username = username;
        if (password) user.password = password;
        user.role = role;

        return user;
    }

    toggleStatus(id, status) {
        const user = usersDB.find(u => u.userId === id);
        if (user) user.status = status ? "Active" : "Inactive";
    }

    getAll() {
        return usersDB;
    }
}