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

    // Get nutrition entry by ID
    getNutritionById(request, respond) {
        const nutritionId = request.params.id;
        const sql = "SELECT * FROM nutrition WHERE nutrition_id = ?";

        db.query(sql, [nutritionId], (error, result) => {
            if (error) {
                throw error;
            }
            if (result.length > 0) {
                respond.json(result[0]);
            } else {
                respond.status(404).json({ message: 'Nutrition entry not found' });
            }
        });
    }

    // Add a new nutrition entry
    addNutrition(request, respond) {
        const nutritionObject = new Nutrition(
            request.body.measure,
            request.body.grams,
            request.body.calories,
            request.body.protein,
            request.body.fat,
            request.body.fiber,
            request.body.carbs,
            request.body.category
        );

        const sql = "INSERT INTO nutrition (measure, grams, calories, protein, fat, fiber, carbs, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        const values = [
            nutritionObject.getMeasure(),
            nutritionObject.getGrams(),
            nutritionObject.getCalories(),
            nutritionObject.getProtein(),
            nutritionObject.getFat(),
            nutritionObject.getFiber(),
            nutritionObject.getCarbs(),
            nutritionObject.getCategory()
        ];

        db.query(sql, values, (error, result) => {
            if (error) {
                throw error;
            }
            respond.status(201).json({ message: 'Nutrition entry added', id: result.insertId });
        });
    }

    // Update an existing nutrition entry
    updateNutrition(request, respond) {
        const nutritionId = request.params.id;
        const nutritionObject = new Nutrition(
            request.body.measure,
            request.body.grams,
            request.body.calories,
            request.body.protein,
            request.body.fat,
            request.body.fiber,
            request.body.carbs,
            request.body.category
        );

        const sql = "UPDATE nutrition SET measure = ?, grams = ?, calories = ?, protein = ?, fat = ?, fiber = ?, carbs = ?, category = ? WHERE nutrition_id = ?";
        const values = [
            nutritionObject.getMeasure(),
            nutritionObject.getGrams(),
            nutritionObject.getCalories(),
            nutritionObject.getProtein(),
            nutritionObject.getFat(),
            nutritionObject.getFiber(),
            nutritionObject.getCarbs(),
            nutritionObject.getCategory(),
            nutritionId
        ];

        db.query(sql, values, (error, result) => {
            if (error) {
                throw error;
            }
            if (result.affectedRows > 0) {
                respond.json({ message: 'Nutrition entry updated' });
            } else {
                respond.status(404).json({ message: 'Nutrition entry not found' });
            }
        });
    }

    // Delete a nutrition entry
    deleteNutrition(request, respond) {
        const nutritionId = request.params.id;
        const sql = "DELETE FROM nutrition WHERE nutrition_id = ?";

        db.query(sql, [nutritionId], (error, result) => {
            if (error) {
                throw error;
            }
            if (result.affectedRows > 0) {
                respond.json({ message: 'Nutrition entry deleted' });
            } else {
                respond.status(404).json({ message: 'Nutrition entry not found' });
            }
        });
    }
}

module.exports = NutritionDB;
