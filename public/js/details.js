// Function to get the recipe ID from the URL
function getRecipeIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id');
}

// Function to dynamically display recipe details
function displayRecipeDetails() {
    const recipeId = getRecipeIdFromUrl();
    
    if (!recipeId) {
        console.error('No recipe ID found in the URL');
        return;
    }

    // Fetch the recipe details from your server using the recipe ID
    fetch(`/recipes/${recipeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Recipe not found');
            }
            return response.json();
        })
        .then(recipe => {
            // Populate the Ingredients section
            const ingredientsList = document.getElementById('recipeIngredients');
            ingredientsList.innerHTML = '';
            recipe.ingredients_raw.split(',').forEach(ingredient => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = ingredient;
                ingredientsList.appendChild(li);
            });

            // Populate the Steps section
            const stepsList = document.getElementById('recipeSteps');
            stepsList.innerHTML = '';
            recipe.steps.split(',').forEach(step => {
                const li = document.createElement('li');
                li.className = 'list-group-item';
                li.textContent = step;
                stepsList.appendChild(li);
            });

            // Populate the Nutritional Information section
            const nutritionTable = document.getElementById('recipeNutrition');
            nutritionTable.innerHTML = `
                <tr><td>Calories</td><td>${recipe.calories}</td></tr>
                <tr><td>Protein</td><td>${recipe.protein} g</td></tr>
                <tr><td>Fat</td><td>${recipe.fat} g</td></tr>
                <tr><td>Carbs</td><td>${recipe.carbs} g</td></tr>
            `;
        })
        .catch(error => console.error('Error fetching recipe details:', error));
}

// Call the function when the page loads
document.addEventListener('DOMContentLoaded', displayRecipeDetails);
