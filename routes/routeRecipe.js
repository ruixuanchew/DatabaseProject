"use strict";

const RecipeDB = require('../models/recipeDB');
const recipeDBObject = new RecipeDB();

function routeRecipe(app) {
    app.route('/recipes')
       .post(recipeDBObject.addRecipe)
       .get(recipeDBObject.getAllRecipes);
    
    app.route('/recipes/:id')
      .get(recipeDBObject.getRecipeById)
       .put(recipeDBObject.updateRecipe)
       .delete(recipeDBObject.deleteRecipe);
}

module.exports = { routeRecipe };
