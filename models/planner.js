"use strict";

class Planner {
    constructor(planner_id, user_id, recipe_id, title, description, time, date) {
        this.planner_id = planner_id;
        this.user_id = user_id;
        this.recipe_id = recipe_id;
        this.title = title;
        this.description = description;
        this.time = time;
        this.date = date;
    }

    // Getter methods
    getId() {
        return this.planner_id;
    }

    getUserId() {
        return this.user_id;
    }

    getRecipeId() {
        return this.recipe_id;
    }

    getTitle() {
        return this.title;
    }

    getDescription() {
        return this.description;
    }

    getTime() {
        return this.time;
    }

    getDate() {
        return this.date;
    }

    // Setter methods
    setUserId(user_id) {
        this.user_id = user_id;
    }

    setRecipeId(recipe_id) {
        this.recipe_id = recipe_id;
    }

    setTitle(title) {
        this.title = title;
    }

    setDescription(description) {
        this.description = description;
    }

    setTime(time) {
        this.time = time;
    }

    setDate(date) {
        this.date = date;
    }
}

module.exports = Planner;
