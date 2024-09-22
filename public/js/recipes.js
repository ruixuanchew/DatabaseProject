let recipes = [];
const recipesPerPage = 30;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    getRecipes();
    document.getElementById('searchInput').addEventListener('input', filterRecipes);
});

function getRecipes() {
    fetch('/recipes')  
        .then(response => response.json())
        .then(data => {
            recipes = data; // Store fetched recipes
            displayRecipes(currentPage);
            setupPagination();
        })
        .catch(error => console.error('Error fetching recipes:', error));
}

function displayRecipes(page) {
    const list = document.getElementById('recipeContainer');
    if (!list) {
        console.error("Element with id 'recipeContainer' not found");
        return;
    }

    // Clear any previous content
    list.innerHTML = '';

    // Calculate the start and end index for slicing the recipes array
    const startIndex = (page - 1) * recipesPerPage;
    const endIndex = Math.min(startIndex + recipesPerPage, recipes.length);
    const recipesToDisplay = recipes.slice(startIndex, endIndex);

    // Array of image URLs
    const images = [
        'img/food-1.jpg',
        'img/food-2.jpg',
        'img/food-3.jpg',
        'img/food-4.jpg'
    ];

    recipesToDisplay.forEach((recipe, index) => {
        const item = document.createElement('div');
        item.classList.add('col-xl-3', 'col-lg-4', 'col-md-6', 'wow', 'fadeInUp');
        item.setAttribute('data-wow-delay', '0.1s');

        const imageUrl = images[(startIndex + index) % images.length]; // Use index based on the current page

        item.innerHTML = `
            <div class="product-item">
                <div class="position-relative bg-light overflow-hidden">
                    <div class="bg-secondary rounded text-white position-absolute start-0 top-0 m-4 py-1 px-3">New</div>
                </div>
                <div class="text-center p-4">
                    <img class="img-fluid w-100" src="${imageUrl}" alt="">
                    <a class="d-block h5 mb-2" href="">${recipe.name}</a>
                    <span class="text-primary me-1">${recipe.serving_size}</span>
                    <span class="text-body">${recipe.servings}</span>
                </div>
                <div class="d-flex border-top">
                    <small class="w-100 text-center py-2">
                        <a class="text-body" href="details.html?id=${recipe.recipe_id}"><i class="fa fa-eye text-primary me-2"></i>View detail</a>
                    </small>
                </div>

            </div>
        `;

        list.appendChild(item);
    });
}

function setupPagination() {
    const paginationContainer = document.getElementById('paginationContainer');
    paginationContainer.innerHTML = ''; // Clear any previous content

    const totalPages = Math.ceil(recipes.length / recipesPerPage);

    for (let i = 1; i <= totalPages; i++) {
        const button = document.createElement('a');
        button.classList.add('py-3', 'px-5', 'paginationButton');
        button.innerText = i;
        button.href = '#'; // Prevent default link behavior
        button.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent page jump
            currentPage = i; // Update current page
            displayRecipes(currentPage); // Display recipes for the current page
        });

        paginationContainer.appendChild(button);
    }
}

function filterRecipes() {
    // Filter query 
}

function addRecipe() {
    const recipe = {
        name: document.getElementById('recipeName').value,
        description: document.getElementById('recipeDescription').value,
        ingredients: document.getElementById('recipeIngredients').value,
        ingredients_raw: document.getElementById('recipeIngredientsRaw').value,
        serving_size: document.getElementById('recipeServingSize').value,
        servings: document.getElementById('recipeServings').value,
        steps: document.getElementById('recipeSteps').value,
        tags: document.getElementById('recipeTags').value,
        search_terms: document.getElementById('recipeSearchTerms').value
    };

    fetch('/recipes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipe)
    })
    .then(response => response.json())
    .then(() => {
        getRecipes();
        document.getElementById('recipeForm').reset();
    });
}

function updateRecipe() {
    const recipeId = document.getElementById('recipeId').value;
    const recipe = {
        name: document.getElementById('recipeName').value,
        description: document.getElementById('recipeDescription').value,
        ingredients: document.getElementById('recipeIngredients').value,
        ingredients_raw: document.getElementById('recipeIngredientsRaw').value,
        serving_size: document.getElementById('recipeServingSize').value,
        servings: document.getElementById('recipeServings').value,
        steps: document.getElementById('recipeSteps').value,
        tags: document.getElementById('recipeTags').value,
        search_terms: document.getElementById('recipeSearchTerms').value
    };

    fetch(`/recipes/${recipeId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(recipe)
    })
    .then(response => response.json())
    .then(() => {
        getRecipes();
        document.getElementById('recipeForm').reset();
    });
}

function deleteRecipe() {
    const recipeId = document.getElementById('recipeId').value;

    fetch(`/recipes/${recipeId}`, {
        method: 'DELETE'
    })
    .then(response => response.json())
    .then(() => {
        getRecipes();
        document.getElementById('recipeForm').reset();
    });
}
