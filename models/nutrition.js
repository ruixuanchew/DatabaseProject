class Nutrition {
    constructor(measure, grams, calories, protein, fat, fiber, carbs, category) {
        this.measure = measure;  
        this.grams = grams;          
        this.calories = calories;    
        this.protein = protein;     
        this.fat = fat;              
        this.fiber = fiber;         
        this.carbs = carbs;         
        this.category = category;    
    }

    // Getter methods
    getMeasure() {
        return this.measure;
    }

    getGrams() {
        return this.grams;
    }

    getCalories() {
        return this.calories;
    }

    getProtein() {
        return this.protein;
    }

    getFat() {
        return this.fat;
    }

    getFiber() {
        return this.fiber;
    }

    getCarbs() {
        return this.carbs;
    }

    getCategory() {
        return this.category;
    }

    // Setter methods (if needed)
    setMeasure(measure) {
        this.measure = measure;
    }

    setGrams(grams) {
        this.grams = grams;
    }

    setCalories(calories) {
        this.calories = calories;
    }

    setProtein(protein) {
        this.protein = protein;
    }

    setFat(fat) {
        this.fat = fat;
    }

    setFiber(fiber) {
        this.fiber = fiber;
    }

    setCarbs(carbs) {
        this.carbs = carbs;
    }

    setCategory(category) {
        this.category = category;
    }
}

module.exports = Nutrition;
