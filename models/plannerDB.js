"use strict";

const db = require('../js/db');
const Planner = require('./planner');

class PlannerDB {

    getAllPlans(request, respond) {
        const sql = "SELECT * FROM planners";
        db.query(sql, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }

    getPlansByDate(request, respond) {
        const date = request.params.date;
        const sql = "SELECT * FROM planners WHERE date = ?";
        
        db.query(sql, [date], (error, result) => {
            if (error) {
                console.error('Database query error:', error);
                throw error;
            }
            respond.json(result);
        });
    }
    getPlanById(request, respond) {
        const plannerId = request.params.id;
        const sql = "SELECT * FROM planners WHERE planner_id = ?";

        db.query(sql, [plannerId], (error, result) => {
            if (error) {
                throw error;
            }
            // Check if a recipe was found
            if (result.length > 0) {
                respond.json(result[0]); 
            } else {
                respond.status(404).json({ message: 'Planner not found' });
            }
        });
    }
    getPlansGroupedByDate(request, respond) {
        const userId = request.params.id;
        const sql = `
            SELECT 
                date, 
                COUNT(*) AS total_plans 
            FROM planners
            WHERE user_id = ?
            GROUP BY date;
        `;
    
        db.query(sql, [userId], (error, result) => {
            if (error) {
                return respond.status(500).json({ error: error.message });
            }
            respond.json(result);
        });
    }
    getPlansGroupedByWeek(request, respond) {
        const userId = request.params.id; 
        const selectedDate = decodeURIComponent(request.params.date);
        const sql = `
           SELECT 
            DATE_FORMAT(STR_TO_DATE(date, '%W, %b %e, %Y'), '%Y-%u') AS year_week, 
            COUNT(*) AS total_plans 
            FROM planners
            WHERE user_id = ?
            GROUP BY year_week
            HAVING year_week = DATE_FORMAT(STR_TO_DATE(?, '%W, %b %e, %Y'), '%Y-%u');
        `;
        db.query(sql, [userId, selectedDate], (error, result) => {
            if (error) {
                return respond.status(500).json({ error: error.message });
            }
            respond.json(result); // Return total plans per week
        });
    }

    addPlan(request, respond) {
        const plannerObject = new Planner(
            null, 
            request.body.user_id,
            request.body.recipe_id,
            request.body.title,
            request.body.description,
            request.body.time,
            request.body.date
        );

        const sql = "INSERT INTO planners (user_id, recipe_id, title, description, time, date) VALUES (?, ?, ?, ?, ?, ?)";
        const values = [
            plannerObject.getUserId(),
            plannerObject.getRecipeId(),
            plannerObject.getTitle(),
            plannerObject.getDescription(),
            plannerObject.getTime(),
            plannerObject.getDate()
        ];

        db.query(sql, values, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }

    updatePlan(request, respond) {
        const plannerId = request.params.id;
        // Prepare an array to hold the fields that need to be updated and their values
        const fieldsToUpdate = [];
        const values = [];

        if (request.body.recipe_id) {
            fieldsToUpdate.push("recipe_id = ?");
            values.push(request.body.recipe_id);
        }

        if (request.body.title) {
            fieldsToUpdate.push("title = ?");
            values.push(request.body.title);
        }

        if (request.body.description) {
            fieldsToUpdate.push("description = ?");
            values.push(request.body.description);
        }

        // Add more fields if necessary (e.g., time, date, etc.)
        if (request.body.time) {
            fieldsToUpdate.push("time = ?");
            values.push(request.body.time);
        }

        if (request.body.date) {
            fieldsToUpdate.push("date = ?");
            values.push(request.body.date);
        }

        // Ensure the fields are present, otherwise return an error
        if (fieldsToUpdate.length === 0) {
            return respond.status(400).json({ message: "No fields to update" });
        }

        // Add the planner ID at the end for the WHERE clause
        values.push(plannerId);

        // Build the dynamic SQL query with only the fields to be updated
        const sql = `UPDATE planners SET ${fieldsToUpdate.join(', ')} WHERE planner_id = ?`;

        console.log(plannerId, fieldsToUpdate);
        // Execute the query
        db.query(sql, values, (error, result) => {
            if (error) {
                return respond.status(500).json({ error: error.message });
            }
            respond.json(result);
        });
    }

    deletePlan(request, respond) {
        const plannerId = request.params.id;
        const sql = "DELETE FROM planners WHERE planner_id = ?";

        db.query(sql, plannerId, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }
}

module.exports = PlannerDB;
