document.addEventListener("DOMContentLoaded", () => {
    // Fetch user session data and display it on the dashboard
    fetch('/check-session', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            // Display user information
            document.getElementById('username').innerText = data.user.username;
            document.getElementById('user-info-username').innerText = data.user.username;
            document.getElementById('user-info-email').innerText = data.user.email; 

            // Check if user is admin
            if (data.user.email === 'admin@admin.com') {
                document.getElementById('admin-crud').style.display = 'block'; // Show CRUD table
                loadRecipes(1); // Load recipes for CRUD table
            } else {
                // Show the username edit option for non-admin users
                document.getElementById('edit-username-section').style.display = 'block';
            }
        } else {
            // Redirect to login if the user is not logged in
            window.location.href = 'login.html';
        }
    })
    .catch(error => {
        console.error('Error fetching session:', error);
        window.location.href = 'login.html'; // Redirect to login on error
    });

    // Handle username update for non-admin users
    document.getElementById('update-username-form').addEventListener('submit', function (e) {
        e.preventDefault();
        const newUsername = document.getElementById('new-username').value;

        fetch('/update-username', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ username: newUsername })
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                alert("Username updated successfully!");
                document.getElementById('user-info-username').innerText = newUsername;
                document.getElementById('username').innerText = newUsername;
            } else {
                alert("Failed to update username.");
            }
        })
        .catch(error => console.error('Error updating username:', error));
    });

    var current_page = 1;
    var records_per_page = 5;

    var totalrecipe = 0;

    // Load all recipes on page load
    function loadRecipes(page) {
        fetch('/recipes', { method: 'GET' })
            .then(response => response.json())
            .then(recipes => {

                totalrecipe = recipes.length;

                const recipeTableBody = document.getElementById('recipe-table-body');

                var btn_next = document.getElementById("btn_next");
                var btn_prev = document.getElementById("btn_prev");
                var page_span = document.getElementById("page");

                // Validate page
                if (page < 1) page = 1;
                if (page > numPages(totalrecipe)) page = numPages(totalrecipe);

                recipeTableBody.innerHTML = ''; // Clear the table
                
                for (var i = (page-1) * records_per_page; i < (page * records_per_page) && i < recipes.length; i++){
                    const row = document.createElement('tr');
                    row.innerHTML = 
                        `<td>${recipes[i].recipe_id}</td>
                        <td>${recipes[i].name}</td>
                        <td>${recipes[i].description}</td>
                        <td>${recipes[i].ingredients}</td>
                        <td>${recipes[i].serving_size}</td>
                        <td>${recipes[i].servings}</td>
                        <td>${recipes[i].steps}</td>
                        <td>${recipes[i].tags}</td>
                        <td>${recipes[i].search_terms}</td>
                        <td>
                            <button class="btn btn-warning btn-sm edit-button" data-recipe-id="${recipes[i].recipe_id}">Edit</button>
                            <button class="btn btn-danger btn-sm delete-button" data-recipe-id="${recipes[i].recipe_id}">Delete</button>
                        </td>`;
                    recipeTableBody.appendChild(row);
                }

                page_span.innerHTML = page;

                if (page == 1) {
                    btn_prev.style.visibility = "hidden";
                } else {
                    btn_prev.style.visibility = "visible";
                }

                if (page == numPages(totalrecipe)) {
                    btn_next.style.visibility = "hidden";
                } else {
                    btn_next.style.visibility = "visible";
                }



                // Attach event listeners to the edit and delete buttons
                document.querySelectorAll('.edit-button').forEach(button => {
                    button.addEventListener('click', function() {
                        const recipeId = this.getAttribute('data-recipe-id');
                        editRecipe(recipeId);
                    });
                });

                document.querySelectorAll('.delete-button').forEach(button => {
                    button.addEventListener('click', function() {
                        const recipeId = this.getAttribute('data-recipe-id');
                        deleteRecipe(recipeId);
                    });
                });

            })
            .catch(error => console.error('Error loading recipes:', error));
    }

    function prevPage()
    {
        if (current_page > 1) {
            current_page--;
            loadRecipes(current_page);
        }
    }

    function nextPage()
    {
        if (current_page < numPages(totalrecipe)) {
            current_page++;
            loadRecipes(current_page);
        }
    }


    function numPages(number)
    {
        return Math.ceil(number / records_per_page);
    }

    // Open the form to add or edit a recipe
    document.getElementById('add-button').onclick = function() {
        openRecipeForm();
    }

    document.getElementById('btn_prev').onclick = function() {
        prevPage();
    }
    document.getElementById('btn_next').onclick = function() {
        nextPage(totalrecipe);
    }

    function openRecipeForm(recipe = null) {
        document.getElementById('overlay').style.display = 'block'; // Show overlay
        document.getElementById('recipeFormModal').style.display = 'block'; // Show the form
        if (recipe) {
            document.getElementById('recipeId').value = recipe.recipe_id;
            document.getElementById('recipeName').value = recipe.name;
            document.getElementById('recipeDescription').value = recipe.description;
            document.getElementById('recipeIngredients').value = recipe.ingredients;
            document.getElementById('recipeIngredientsRaw').value = recipe.ingredients_raw;
            document.getElementById('recipeServingSize').value = recipe.serving_size;
            document.getElementById('recipeServings').value = recipe.servings;
            document.getElementById('recipeSteps').value = recipe.steps;
            document.getElementById('recipeTags').value = recipe.tags;
            document.getElementById('recipeSearchTerms').value = recipe.search_terms;
        } else {
            document.getElementById('recipeForm').reset();
        }
    }

    // Close the recipe form
    document.getElementById('cancel-button').onclick = function() {
        closeRecipeForm();
    }
    function closeRecipeForm() {
        document.getElementById('overlay').style.display = 'none'; // Hide overlay
        document.getElementById('recipeFormModal').style.display = 'none'; // Hide the form
    }
    // Save the recipe (create or update)
    document.getElementById('recipeForm').addEventListener('submit', function (e) {
        e.preventDefault();
        const recipeId = document.getElementById('recipeId').value;
        const name = document.getElementById('recipeName').value;
        const description = document.getElementById('recipeDescription').value;
        const ingredients = document.getElementById('recipeIngredients').value;
        const ingredients_raw = document.getElementById('recipeIngredientsRaw').value;
        const serving_size = document.getElementById('recipeServingSize').value;
        const servings = document.getElementById('recipeServings').value;
        const steps = document.getElementById('recipeSteps').value;
        const tags = document.getElementById('recipeTags').value;
        const search_terms = document.getElementById('recipeSearchTerms').value;

        const data = { name, description, ingredients, ingredients_raw, serving_size, servings, steps, tags, search_terms };

        const method = recipeId ? 'PUT' : 'POST';
        const endpoint = recipeId ? `/recipes/${recipeId}` : '/recipes';

        fetch(endpoint, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        })
        .then(response => response.json())
        .then(result => {
            alert("Recipe updated!");
            closeRecipeForm();
            loadRecipes(1); // Reload recipes after saving
        })
        .catch(error => console.error('Error saving recipe:', error));
    });

    // Edit a recipe: Fetch the recipe details and open the form
    function editRecipe(recipeId) {
        fetch(`/recipes/${recipeId}`, { method: 'GET' })
            .then(response => response.json())
            .then(recipe => openRecipeForm(recipe))  // Pre-fill the form with recipe details
            .catch(error => console.error('Error fetching recipe:', error));
    }

    // Delete a recipe
    function deleteRecipe(recipeId) {
        if (confirm('Are you sure you want to delete this recipe?')) {
            fetch(`/recipes/${recipeId}`, { method: 'DELETE' })
                .then(response => response.json())
                .then(result => {
                    alert("Recipe deleted!");
                    loadRecipes(1);
                })
                .catch(error => console.error('Error deleting recipe:', error));
        }
    }

    // Handle logout
    document.getElementById('logout-btn').addEventListener('click', function () {
        fetch('/logout', { method: 'GET' })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    alert('Logout successful!');
                    window.location.href = 'login.html'; // Redirect to login page
                }
            })
            .catch(error => console.error('Error logging out:', error));
    });

    // Close the overlay when clicked
    document.getElementById('overlay').addEventListener('click', closeRecipeForm);
})
