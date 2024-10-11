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

    getUserByUsername(username, callback) {
        const sql = "SELECT * FROM users WHERE username = ?";
        db.query(sql, [username], (error, result) => {
            if (error) {
                return callback(error, null);
            }
            if (result.length > 0) {
                return callback(null, result[0]);  // Return the first user found
            } else {
                return callback(null, null);  // No user found
            }
        });
    }
    

    addUser(request, res) {
        const userObject = new User(
            null,
            request.body.username,
            request.body.email,
            request.body.password  // Already hashed in the /register route
        );
    
        const sql = "INSERT INTO users (username, email, password) VALUES (?, ?, ?)";
        const values = [
            userObject.getUsername(),
            userObject.getEmail(),
            userObject.getPassword()  // Hashed password
        ];
    
        db.query(sql, values, (error, result) => {
            if (error) {
                console.error("Error inserting user into the database:", error);
                if (error.code === 'ER_DUP_ENTRY') {
                    // Handle duplicate email error
                    return res.status(409).json({ success: false, message: 'Email already exists' });
                } else {
                    // Handle other errors
                    return res.status(500).json({ success: false, message: 'Registration failed', error });
                }
            }
            // Successfully added user, return a success message
            res.status(200).json({ success: true, message: 'User registered successfully', result });
        });
    }
    

    updateUser(request, respond) {
        const userId = request.params.id;
        const newUsername = request.body.username;

        const sql = "UPDATE users SET username = ? WHERE user_id = ?";
        const values = [newUsername, userId];

        db.query(sql, values, (error, result) => {
            if (error) {
                throw error;
            }
            respond.status(200).json({ success: true, message: 'User updated successfully', result });
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
