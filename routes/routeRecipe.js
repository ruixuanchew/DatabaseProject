"use strict";

const RecipeDB = require('../models/recipeDB');
const recipeDBObject = new RecipeDB();

function routeRecipe(app) {
  app.route('/recipes')
    .post(recipeDBObject.addRecipe)
    .get(recipeDBObject.getAllRecipes);

  app.route('/recipesNameId')
    .get(recipeDBObject.getRecipeIdAndName);

  app.route('/recipes/:id')
    .get(recipeDBObject.getRecipeById)
    .put(recipeDBObject.updateRecipe)
    .delete(recipeDBObject.deleteRecipe);

  app.route('/search')
    .get(recipeDBObject.getRecipeBySearch);

    app.route('/recipes/sorted/:page/:limit')
    .get(recipeDBObject.getSortedRecipes);
}

module.exports = { routeRecipe };
