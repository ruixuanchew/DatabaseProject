"use strict";

const db = require('../js/db');
const User = require('./user');

class UserDB {

    getAllUsers(request, respond) {
        const sql = "SELECT * FROM users";
        db.query(sql, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }

    addUser(request, respond) {
        const userObject = new User(
            null,
            request.body.username,
            request.body.email,
            request.body.password
        );

        const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        const values = [
            userObject.getUsername(),
            userObject.getEmail(),
            userObject.getPassword() // Remember to hash the password before storing!
        ];

        db.query(sql, values, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }

    updateUser(request, respond) {
        const userObject = new User(
            request.params.id,
            request.body.username,
            request.body.email,
            request.body.password
        );

        const sql = "UPDATE users SET username = ?, email = ?, password = ? WHERE user_id = ?";
        const values = [
            userObject.getUsername(),
            userObject.getEmail(),
            userObject.getPassword(), // Again, consider hashing this
            userObject.getId()
        ];

        db.query(sql, values, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }

    deleteUser(request, respond) {
        const userId = request.params.id;
        const sql = "DELETE FROM users WHERE user_id = ?";

        db.query(sql, userId, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }
}

module.exports = UserDB;
