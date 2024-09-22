"use strict";

const db = require('../js/db');
const Planner = require('./planner');

class PlannerDB {

    getAllPlans(request, respond) {
        const sql = "SELECT * FROM planner";
        db.query(sql, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }

    addPlan(request, respond) {
        const plannerObject = new Planner(
            null, // planner_id will be auto-incremented
            request.body.user_id,
            request.body.recipe_id,
            request.body.title,
            request.body.description,
            request.body.time,
            request.body.date
        );

        const sql = "INSERT INTO planner (user_id, recipe_id, title, description, time, date) VALUES (?, ?, ?, ?, ?, ?)";
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
        const plannerObject = new Planner(
            request.params.id,
            request.body.user_id,
            request.body.recipe_id,
            request.body.title,
            request.body.description,
            request.body.time,
            request.body.date
        );

        const sql = "UPDATE planner SET user_id = ?, recipe_id = ?, title = ?, description = ?, time = ?, date = ? WHERE planner_id = ?";
        const values = [
            plannerObject.getUserId(),
            plannerObject.getRecipeId(),
            plannerObject.getTitle(),
            plannerObject.getDescription(),
            plannerObject.getTime(),
            plannerObject.getDate(),
            plannerObject.getId()
        ];

        db.query(sql, values, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }

    deletePlan(request, respond) {
        const plannerId = request.params.id;
        const sql = "DELETE FROM planner WHERE planner_id = ?";

        db.query(sql, plannerId, (error, result) => {
            if (error) {
                throw error;
            }
            respond.json(result);
        });
    }
}

module.exports = PlannerDB;
