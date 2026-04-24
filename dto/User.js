export class User {
    constructor(userId, username, name, password, role, status = "Active") {
        this.userId = userId;
        this.username = username;
        this.name = name;
        this.password = password;
        this.role = role;
        this.status = status;
    }
}