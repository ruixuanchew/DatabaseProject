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

  app.route('/recipes/:page/:limit')
    .get(recipeDBObject.getRecipesByPage);

  app.route('/recipes/count')
    .get(recipeDBObject.countAllRecipes);

  app.route('/search')
    .get(recipeDBObject.getRecipeBySearch);
}

module.exports = { routeRecipe };
