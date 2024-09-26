"use strict";

const NutritionDB = require('../models/nutritionDB');
const nutritionDBObject = new NutritionDB();

function routeNutrition(app) {
    app.route('/nutritions')
       .post(nutritionDBObject.addNutrition)
       .get(nutritionDBObject.getAllNutrition);
    
    app.route('/nutritions/:id')
      .get(nutritionDBObject.getNutritionById)
       .put(nutritionDBObject.updateNutrition)
       .delete(nutritionDBObject.deleteNutrition);
}

module.exports = { routeNutrition };
