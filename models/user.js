"use strict";

class User {
    constructor(user_id, username, email, password) {
        this.user_id = user_id;
        this.username = username;
        this.email = email;
        this.password = password; 
    }

    // Getter methods
    getId() {
        return this.user_id;
    }

    getUsername() {
        return this.username;
    }

    getEmail() {
        return this.email;
    }

    getPassword() {
        return this.password; // Be cautious about exposing passwords
    }

    // Setter methods
    setUsername(username) {
        this.username = username;
    }

    setEmail(email) {
        this.email = email;
    }

    setPassword(password) {
        this.password = password; // Consider hashing this for security
    }
}

module.exports = User;
