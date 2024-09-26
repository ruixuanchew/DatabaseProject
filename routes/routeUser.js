"use strict";

const UserDB = require('../models/userDB');
const userDBObject = new UserDB();

function routeUser(app) {
    app.route('/users')
       .post(userDBObject.addUser)
       .get(userDBObject.getAllUsers);
    
    app.route('/users/:id')
    //   .get(plannerDBObject.getRecipeById)
       .put(userDBObject.updateUser)
       .delete(userDBObject.deleteUser);
}

module.exports = { routeUser };
