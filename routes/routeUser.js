"use strict";

const UserDB = require('../models/userDB');
const plannerDBObject = new UserDB();

function routeUser(app) {
    app.route('/user')
       .post(plannerDBObject.addUser)
       .get(plannerDBObject.getAllUsers);
    
    app.route('/recipes/:id')
    //   .get(plannerDBObject.getRecipeById)
       .put(plannerDBObject.updateUser)
       .delete(plannerDBObject.deleteUser);
}

module.exports = { routeUser };
