"use strict";

const UserDB = require('../models/userDB');
const userDBObject = new UserDB();
const bcrypt = require('bcrypt');  // Use bcrypt for password hashing

function routeUser(app) {
    // Existing routes for CRUD operations on users
    app.route('/users')
       .post(userDBObject.addUser)
       .get(userDBObject.getAllUsers);
    
    app.route('/users/:id')
       .put(userDBObject.updateUser)
       .delete(userDBObject.deleteUser);

    // Route for registration
    app.post('/register', async (req, res) => {
        try {
            // Hash the password before storing
            const hashedPassword = await bcrypt.hash(req.body.password, 10);

            // Modify the request body to include the hashed password
            const newUser = {
                username: req.body.username,
                email: req.body.email,
                password: hashedPassword // Replace with hashed password
            };

            // Manually pass the modified user to the `addUser` function
            userDBObject.addUser({
                body: newUser  // Pass the new user object with the hashed password
            }, res);
        } catch (error) {
            res.status(500).json({ success: false, message: 'Registration failed', error: error.message });
        }
    });

    // Route for login
    app.post('/login', (req, res) => {
        const { username, password } = req.body;

        // Fetch the user by username
        userDBObject.getUserByUsername(username, (err, user) => {
            if (err || !user) {
                return res.status(400).json({ success: false, message: 'User not found' });
            }

            // Compare provided password with the stored (hashed) password
            bcrypt.compare(password, user.password, (err, isMatch) => {
                if (err || !isMatch) {
                    return res.status(401).json({ success: false, message: 'Invalid credentials' });
                }

                // Store user info in the session
                req.session.user = {
                    id: user.user_id,
                    username: user.username,
                    email: user.email
                };

                res.status(200).json({ success: true, message: 'Login successful' });
            });
        });
    });

    // Logout route to destroy the session
    app.get('/logout', (req, res) => {
        req.session.destroy((err) => {
            if (err) {
                return res.status(500).json({ success: false, message: 'Logout failed' });
            }
            res.status(200).json({ success: true, message: 'Logout successful' });
        });
    });

    // Check if the user is logged in
    app.get('/check-session', (req, res) => {
        if (req.session.user) {
            res.json({ loggedIn: true, user: req.session.user });
        } else {
            res.json({ loggedIn: false });
        }
    });
}

module.exports = { routeUser };
