import { usersDB } from "../db/database.js";

export class UserModel {

    validate(name, username, password) {
        if (name.length < 3) {
            return { valid: false, msg: "Name must be at least 3 characters" };
        }

        if (username.length < 4) {
            return { valid: false, msg: "Username must be at least 4 characters" };
        }

        if (password.length < 3) {
            return { valid: false, msg: "Password must be at least 3 characters" };
        }

        return { valid: true };
    }

    save(name, username, password, role) {
        const id = `USR-${(usersDB.length + 1).toString().padStart(3, '0')}`;

        const user = {
            userId: id,
            name,
            username,
            password,
            role,
            status: "Active"
        };

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

    toggleStatus(id, isActive) {
        const user = usersDB.find(u => u.userId === id);
        if (user) {
            user.status = isActive ? "Active" : "Inactive";
        }
    }

    getAll() {
        return usersDB;
    }
}