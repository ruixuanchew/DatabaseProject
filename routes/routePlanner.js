"use strict";

const PlannerDB = require('../models/plannerDB');
const plannerDBObject = new PlannerDB();

function routePlanner(app) {
    app.route('/planners')
       .post(plannerDBObject.addPlan)
       .get(plannerDBObject.getAllPlans);
    
    app.route('/planners/:id')
      .get(plannerDBObject.getPlanById)
       .put(plannerDBObject.updatePlan)
       .delete(plannerDBObject.deletePlan);

   app.route('/planners/:date')
       .get(plannerDBObject.getPlansByDate);

   app.route('/plannersUser/:user_id')
       .get(plannerDBObject.getPlanByUserId);
    
    app.route('/plannersGroup/:id')
        .get(plannerDBObject.getPlansGroupedByDate);
}

module.exports = { routePlanner };
