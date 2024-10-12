"use strict";

const NutritionDB = require('../models/nutritionDB');
const nutritionDBObject = new NutritionDB();

function routeNutrition(app) {
    app.route('/nutritions')
       .get(nutritionDBObject.getAllNutrition);
    
    app.route('/nutritions/:id')
      .get(nutritionDBObject.getNutritionById)
}

module.exports = { routeNutrition };
