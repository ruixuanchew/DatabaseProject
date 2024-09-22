"use strict";

const db = require('../js/db');
const Recipe = require('./recipe');

class RecipeDB {

    getAllRecipes(request, respond) {
        const sql = "SELECT * FROM recipes";
        db.query(sql, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }

    getRecipeById(request, respond) {
        const recipeId = request.params.id;
        const sql = "SELECT * FROM recipes WHERE recipe_id = ?";

        db.query(sql, [recipeId], (error, result) => {
            if (error) {
                throw error;
            }
            // Check if a recipe was found
            if (result.length > 0) {
                respond.json(result[0]); 
            } else {
                respond.status(404).json({ message: 'Recipe not found' });
            }
        });
    }

    addRecipe(request, respond) {
        const recipeObject = new Recipe(
            null,
            request.body.name,
            request.body.description,
            request.body.ingredients,
            request.body.ingredients_raw,
            request.body.serving_size,
            request.body.servings,
            request.body.steps,
            request.body.tags,
            request.body.search_terms
        );
        
        const sql = "INSERT INTO recipes (name, description, ingredients, ingredients_raw, serving_size, servings, steps, tags, search_terms) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
            recipeObject.getName(),
            recipeObject.getDescription(),
            recipeObject.getIngredients(),
            recipeObject.getIngredientsRaw(),
            recipeObject.getServingSize(),
            recipeObject.getServings(),
            recipeObject.getSteps(),
            recipeObject.getTags(),
            recipeObject.getSearchTerms()
        ];

        db.query(sql, values, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }

    updateRecipe(request, respond) {
        const recipeObject = new Recipe(
            request.params.id,
            request.body.name,
            request.body.description,
            request.body.ingredients,
            request.body.ingredients_raw,
            request.body.serving_size,
            request.body.servings,
            request.body.steps,
            request.body.tags,
            request.body.search_terms
        );

        const sql = "UPDATE recipes SET name = ?, description = ?, ingredients = ?, ingredients_raw = ?, serving_size = ?, servings = ?, steps = ?, tags = ?, search_terms = ? WHERE recipe_id = ?";
        const values = [
            recipeObject.getName(),
            recipeObject.getDescription(),
            recipeObject.getIngredients(),
            recipeObject.getIngredientsRaw(),
            recipeObject.getServingSize(),
            recipeObject.getServings(),
            recipeObject.getSteps(),
            recipeObject.getTags(),
            recipeObject.getSearchTerms(),
            recipeObject.getId()
        ];

        db.query(sql, values, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }

    deleteRecipe(request, respond) {
        const recipeId = request.params.id;
        const sql = "DELETE FROM recipes WHERE recipe_id = ?";

        db.query(sql, recipeId, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }
}

module.exports = RecipeDB;
