"use strict";

const db = require('../js/db'); // Assuming you have a db.js file to handle database connection
const Nutrition = require('./nutrition');

class NutritionDB {

    // Get all nutrition entries
    getAllNutrition(request, respond) {
        const sql = "SELECT * FROM nutrition";
        db.query(sql, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }

    // Get all nutrition entry by recipe ID
    getNutritionById(request, respond) {
        const recipeId = request.params.id;
        const sql = `SELECT n.food, n.calories, n.protein, n.fat, n.fiber, n.carbs
        FROM recipes r
        JOIN nutrition n
        ON r.ingredients REGEXP CONCAT('(^|[^a-zA-Z])', n.food, '([^a-zA-Z]|$)')
        WHERE r.recipe_id = ?`;

        db.query(sql, [recipeId], (error, result) => {
            if (error) {
                throw error;
            }
            if (result.length > 0) {
                respond.json(result);
            } else {
                respond.status(404).json({ message: 'Nutrition entry not found' });
            }
        });
    }
}

module.exports = NutritionDB;
