"use strict";

class Recipe {
    constructor(recipe_id, name, description, ingredients, ingredients_raw, serving_size, servings, steps, tags, search_terms) {
        this.recipe_id = recipe_id;
        this.name = name;
        this.description = description;
        this.ingredients = ingredients;
        this.ingredients_raw = ingredients_raw;
        this.serving_size = serving_size;
        this.servings = servings;
        this.steps = steps;
        this.tags = tags;
        this.search_terms = search_terms;
    }

    // Getter methods
    getId() {
        return this.recipe_id;
    }

    getName() {
        return this.name;
    }

    getDescription() {
        return this.description;
    }

    getIngredients() {
        return this.ingredients;
    }

    getIngredientsRaw() {
        return this.ingredients_raw;
    }

    getServingSize() {
        return this.serving_size;
    }

    getServings() {
        return this.servings;
    }

    getSteps() {
        return this.steps;
    }

    getTags() {
        return this.tags;
    }

    getSearchTerms() {
        return this.search_terms;
    }

    setName(name) {
        this.name = name;
    }

    setDescription(description) {
        this.description = description;
    }

    setIngredients(ingredients) {
        this.ingredients = ingredients;
    }

    setIngredientsRaw(ingredients_raw) {
        this.ingredients_raw = ingredients_raw;
    }

    setServingSize(serving_size) {
        this.serving_size = serving_size;
    }

    setServings(servings) {
        this.servings = servings;
    }

    setSteps(steps) {
        this.steps = steps;
    }

    setTags(tags) {
        this.tags = tags;
    }

    setSearchTerms(search_terms) {
        this.search_terms = search_terms;
    }
}

// Important make sure to export constructor
module.exports = Recipe;
