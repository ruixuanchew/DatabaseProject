"use strict";

const PlannerDB = require('../models/plannerDB');
const plannerDBObject = new PlannerDB();

function routePlanner(app) {
    app.route('/planners')
       .post(plannerDBObject.addPlan)
       .get(plannerDBObject.getAllPlans);
    
    app.route('/planners/:id')
    //   .get(plannerDBObject.getRecipeById)
       .put(plannerDBObject.updatePlan)
       .delete(plannerDBObject.deletePlan);
}

module.exports = { routePlanner };
