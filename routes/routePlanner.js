"use strict";

const PlannerDB = require('../models/plannerDB');
const plannerDBObject = new PlannerDB();

function routePlanner(app) {
    app.route('/planner')
       .post(plannerDBObject.addPlan)
       .get(plannerDBObject.getAllPlans);
    
    app.route('/recipes/:id')
    //   .get(plannerDBObject.getRecipeById)
       .put(plannerDBObject.updatePlan)
       .delete(plannerDBObject.deletePlan);
}

module.exports = { routePlanner };
