let recipes = [];
const recipesPerPage = 20;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
    // On page load, check if the URL contains a page number and a query
    const urlParams = new URLSearchParams(window.location.search);
    const query = urlParams.get('query'); // Get the search query from the URL
    const page = parseInt(urlParams.get('page')) || 1; // Get the page number or default to 1

    currentPage = page; // Set the current page based on URL parameter

    if (query) {
        document.getElementById('searchInput').value = query; // Set search input value
        searchRecipes(query); // If there's a search query, perform the search
    } else {
        getRecipes(); // Otherwise, load all recipes
    }

    document.getElementById('searchInput').addEventListener('keypress', function (event) {
        if (event.key === 'Enter') {
            searchRecipes();
        }
    });
    document.getElementById('searchButton').addEventListener('click', function (event) {
        searchRecipes();         // Execute the search
    });
    document.getElementById('sortOptions').addEventListener('change', function() {
        const selectedSort = this.value;
        let sortBy = 'default';
        let sortDirection = 'ASC';
    
        // Update sortBy and sortDirection based on selection
        switch (selectedSort) {
            case 'name_asc':
                sortBy = 'name';
                sortDirection = 'ASC';
                break;
            case 'name_desc':
                sortBy = 'name';
                sortDirection = 'DESC';
                break;
            case 'serving_size_asc':
                sortBy = 'serving_size';
                sortDirection = 'ASC';
                break;
            case 'serving_size_desc':
                sortBy = 'serving_size';
                sortDirection = 'DESC';
                break;
            default:
                sortBy = null; // For "Default", reset to null
                break;
        }
    
        // Update URL parameters only if sortBy is not null
        const urlParams = new URLSearchParams(window.location.search);
        if (sortBy) {
            urlParams.set('sortBy', sortBy);
            urlParams.set('sortDirection', sortDirection);
        } else {
            urlParams.delete('sortBy'); // Remove sorting params if "Default" is selected
            urlParams.delete('sortDirection');
        }
    
        const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
        history.pushState({ sortBy, sortDirection, page: currentPage }, '', newUrl); // Update the URL without reloading

        getRecipes();
        
    });

});

// Future for optimisation 
// function getRecipes(){
//     fetch(`/recipes/${currentPage}/${recipesPerPage}`, {
//         method: 'GET'
//     })
//     .then(response => response.json())
//     .then(data => {
//         recipes = data; // Store fetched recipes
//         console.log(recipes);
//         displayRecipes(currentPage);
//         setupPagination();
//     })
//     .catch(error => console.error('Error fetching recipes:', error));
// }
function getRecipes() {
    const urlParams = new URLSearchParams(window.location.search);
    const sortBy = urlParams.get('sortBy') || null; // Get sortBy from URL
    const sortDirection = urlParams.get('sortDirection') || null; // Get sortDirection from URL
    const page = currentPage || 1; // Ensure the current page is set
    const limit = recipesPerPage || 20; // Set the limit to 20 by default

    // Fetch sorted recipes if sort parameters exist
    if (sortBy) {
        fetch(`/recipes/sorted/${page}/${limit}?sortBy=${sortBy}&sortDirection=${sortDirection}`)
            .then(response => response.json())
            .then(data => {
                recipes = data; // Store fetched recipes
                displayRecipes(currentPage); // Display them on the page
                setupPagination(); // Setup pagination
            })
            .catch(error => console.error('Error fetching sorted recipes:', error));
    } else {
        // Fetch all recipes if no sort is applied
        fetch('/recipes')
            .then(response => response.json())
            .then(data => {
                recipes = data; // Store fetched recipes
                displayRecipes(currentPage); // Display them on the page
                setupPagination(); // Setup pagination
            })
            .catch(error => console.error('Error fetching recipes:', error));
    }
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

    if (recipesToDisplay.length === 0) {
        list.innerHTML = '<p>No recipes found matching your search.</p>'; // Inform the user if no recipes found
        return;
    }

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
    if (totalPages === 0) {
        paginationContainer.innerHTML = '<p>No results to display.</p>'; // Handle case where there are no results
        return;
    }
    const maxButtonsToShow = 10; // Maximum number of page buttons to display
    const ellipsis = '...';

    // Helper function to create a pagination button
    const createButton = (pageNum, isActive = false) => {
        const button = document.createElement('a');
        button.classList.add('py-3', 'px-5', 'paginationButton');
        if (isActive) {
            button.classList.add('active'); // Add active class for the current page
        }
        button.innerText = pageNum;
        button.href = '#'; // Prevent default link behavior
        button.addEventListener('click', (e) => {
            //e.preventDefault(); // Prevent page jump
            currentPage = pageNum; // Update current page
            displayRecipes(currentPage); // Display recipes for the current page

            // Update pagination display
            setupPagination();

             // Update the URL with the new page number
            const urlParams = new URLSearchParams(window.location.search);
            urlParams.set('page', pageNum); // Set the new page parameter
            const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
            history.pushState({ page: pageNum }, '', newUrl); // Update the URL without reloading
        });
        return button;
    };

    // Show first page button
    paginationContainer.appendChild(createButton(1, currentPage === 1));

    if (totalPages > maxButtonsToShow) {
        // Check if currentPage is near the start
        if (currentPage < 5) {
            // Show pages 2-10
            for (let i = 2; i <= Math.min(maxButtonsToShow, totalPages); i++) {
                paginationContainer.appendChild(createButton(i, currentPage === i));
            }
        } else if (currentPage > totalPages - 4) {
            // Show pages totalPages-9 to totalPages-1
            for (let i = Math.max(totalPages - maxButtonsToShow + 1, 2); i < totalPages; i++) {
                paginationContainer.appendChild(createButton(i, currentPage === i));
            }
        } else {
            // Show pages currentPage-4 to currentPage+5
            for (let i = currentPage - 4; i <= currentPage + 5; i++) {
                if (i > 1 && i < totalPages) {
                    paginationContainer.appendChild(createButton(i, currentPage === i));
                }
            }
        }

        // Add ellipsis
        paginationContainer.appendChild(document.createTextNode(ellipsis));

        // Show the last page button
        paginationContainer.appendChild(createButton(totalPages, currentPage === totalPages));
    } else {
        // If total pages are less than or equal to maxButtonsToShow, show all page numbers
        for (let i = 2; i <= totalPages; i++) {
            paginationContainer.appendChild(createButton(i, currentPage === i));
        }
    }
}

// function filterRecipes() {
//     // Filter query
//     const query = document.getElementById('searchInput').value.toLowerCase();
//     if (query) {
//         searchRecipes(query);  // Use search function when there's input
//     } else {
//         getRecipes();  // Reset to all recipes if search field is cleared
//     } 
// }

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

function searchRecipes(query) {
    const searchInput = document.getElementById('searchInput').value.trim();
    const searchQuery = query || searchInput; // Use the query from URL or input field

    // Check if the search query has changed to reset the current page to 1
    const urlParams = new URLSearchParams(window.location.search);
    const currentQuery = urlParams.get('query');

    if (searchQuery && searchQuery !== currentQuery) {
        currentPage = 1; // Reset to the first page for a new search
    }

    fetch(`/search?query=${encodeURIComponent(searchQuery)}&page=${currentPage}`)
        .then(response => response.json())
        .then(data => {
            recipes = data; // Store fetched recipes
            displayRecipes(currentPage); // Display recipes for the current page
            setupPagination(); // Setup pagination buttons
        })
        .catch(error => {
            console.error('Error fetching recipes:', error);
            // Optionally handle errors (e.g., display an error message)
        });

    // Update the URL with the search query
    urlParams.set('query', searchQuery); // Set the new query parameter
    urlParams.set('page', currentPage); // Update the page parameter
    const newUrl = `${window.location.pathname}?${urlParams.toString()}`;
    history.pushState({ query: searchQuery, page: currentPage }, '', newUrl); // Update the URL without reloading
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
