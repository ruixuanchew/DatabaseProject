"use strict";

const db = require('../js/db');
const Recipe = require('./recipe');

class RecipeDB {

    getAllRecipes(request, respond) {
        const sql = "SELECT * FROM recipes LIMIT 100";
        db.query(sql, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }

    // For future reference when optimising 
    countAllRecipes(request, respond) {
        const sql = "SELECT COUNT(*) as total FROM recipes";
        db.query(sql, (error, result) => {
            if (error) {
                return respond.status(500).json({ error: "Database query error" });
            }
            respond.json(result[0].total); // Send back the total count
        });
    }

    // Do in the future for optimisation (:D)
    getRecipesByPage(request, respond) {
        console.log('Gets here');
        const page = parseInt(request.params.page) || 1;
        const limit = parseInt(request.params.limit) || 20;
        const offset = (page - 1) * limit;
        console.log(page, limit);

        const sql = `
            WITH recipe_pages AS (
                SELECT *, ROW_NUMBER() OVER (ORDER BY recipe_id) as row_num
                FROM recipes
            )
            SELECT *
            FROM recipe_pages
            WHERE row_num BETWEEN ? AND ?;`;

        const startRow = offset + 1;
        const endRow = offset + limit;

        db.query(sql, [startRow, endRow], (error, result) => {
            if (error) {
                return respond.status(500).json({ error: "Database query error" });
            }
            respond.json(result);
        });
    }

    getSortedRecipes(request, respond) {
        const page = parseInt(request.params.page) || 1;
        const limit = parseInt(request.params.limit) || 20;
        const offset = (page - 1) * limit;
    
        const searchQuery = request.query.query ? request.query.query.toLowerCase() : ''; // Optional search query
        const sortBy = request.query.sortBy || 'recipe_id'; // Default sorting by recipe_id
        const sortDirection = request.query.sortDirection === 'DESC' ? 'DESC' : 'ASC'; // Default sort direction
    
        // Construct the SQL query
        let sql = `SELECT * FROM recipes WHERE 1=1`;
        const values = [];
    
        // If a search query exists, add filtering condition
        if (searchQuery) {
            sql +=  ` AND (LOWER(name) LIKE ? OR LOWER(search_terms) LIKE ?)`;
            values.push(`%${searchQuery}%`, `%${searchQuery}%`);
        }
    
        // Append sorting and pagination
        sql +=  ` ORDER BY ${db.escapeId(sortBy)} ${sortDirection}`;
        sql +=  ` LIMIT 100 OFFSET ?`;
        values.push(offset);
    
        // Log the constructed query and values
        console.log('Executing SQL Query:', sql);
        console.log('With values:', values);
    
        db.query(sql, values, (error, result) => {
            if (error) {
                return respond.status(500).json({ error: "Database query error" });
            }
            respond.json(result);
        });
    }    
    getRecipeIdAndName(request, respond) {
        const sql = "SELECT recipe_id, name FROM recipes";
        db.query(sql, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }

    getRecipeBySearch(request, respond) {
        const searchQuery = request.query.query ? request.query.query.toLowerCase() : '';
        const filters = request.query.filters ? request.query.filters.split(',') : [];
        const sortBy = request.query.sortBy || 'recipe_id';
        const sortDirection = request.query.sortDirection === 'DESC' ? 'DESC' : 'ASC';
        const page = parseInt(request.query.page) || 1;
        const limit = 20;
        const offset = (page - 1) * limit;
    
        // Construct the query to handle both search and sort
        let query = `SELECT * FROM recipes WHERE 1=1`;
        const values = [];
    
        if (searchQuery) {
            query += ` AND (LOWER(name) LIKE ? OR LOWER(search_terms) LIKE ?)`;
            values.push(`%${searchQuery}%`, `%${searchQuery}%`);
        }
    
        // Handle filters
        if (filters.length) {
            filters.forEach(filter => {
                query += ` AND LOWER(search_terms) LIKE ?`;
                values.push(`%${filter.toLowerCase()}%`);
            });
        }
    
        // Append sorting and pagination
        query += ` ORDER BY ${db.escapeId(sortBy)} ${sortDirection}`;
        query += ` LIMIT 100 OFFSET ?`;
        values.push(offset);
    
        console.log('Executing SQL Query:', query);
        console.log('With values:', values);
    
        db.query(query, values, (error, results) => {
            if (error) {
                return respond.status(500).json({ error: 'Error searching and sorting recipes' });
            }
    
            if (results.length === 0) {
                return respond.status(404).json({ message: 'No recipes found' });
            }
    
            respond.status(200).json(results);  // Return the found recipes
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