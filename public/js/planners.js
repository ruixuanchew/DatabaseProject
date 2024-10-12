let recipes = []; // Array to store recipes
let plansArr = []; // Array to store plans
let selectedRecipeId = null; 
let selectedPlanId = null;

// Date variables
const currentDate = new Date();
const currentDayElem = document.getElementById('currentDay');

let currentUser;
let totalCalories = 0;
let caloriesCalculated = false;

// Function to update the displayed current day
function updateCurrentDay(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    currentDayElem.textContent = date.toLocaleDateString('en-US', options);
}

// Function to move to the previous day
function prevDay() {
    currentDate.setDate(currentDate.getDate() - 1);
    updateCurrentDay(currentDate);
    getPlans(); 
    caloriesCalculated = false;
}

// Function to move to the next day
function nextDay() {
    currentDate.setDate(currentDate.getDate() + 1);
    updateCurrentDay(currentDate);
    getPlans(); 
    caloriesCalculated = false;
}

// Initialize with today's date
function initializeDate() {
    updateCurrentDay(currentDate);
    document.getElementById('prevDay').addEventListener('click', prevDay);
    document.getElementById('nextDay').addEventListener('click', nextDay);
}

// Modal handling
const modal = document.getElementById('addPlanModal'); // Use the correct modal ID
const updateModal = document.getElementById('updatePlanModal');
const addButtons = document.querySelectorAll('.add-btn'); // Select all add buttons
const backdrop = createBackdrop();
let currentTime;

// Function to create the backdrop element for modal
function createBackdrop() {
    const backdropElem = document.createElement('div');
    backdropElem.className = 'modal-backdrop'; // Set class for styling
    document.body.appendChild(backdropElem);
    return backdropElem;
}

// Function to open the modal
function openModal() {
    modal.classList.add('show');
    modal.style.display = 'block';
    backdrop.classList.add('show');
}

// Function to open the update modal
function openUpdateModal(plan) {
    updateModal.classList.add('show');
    updateModal.style.display = 'block';
    backdrop.classList.add('show');
    
    // Populate the fields with the selected plan's data
    document.getElementById('updatePlanTitle').value = plan.title;
    document.getElementById('updatePlanDescription').value = plan.description;
    // Set the recipe dropdown based on the selected plan's recipe_id
    const recipeDropdown = document.getElementById('updateRecipeSelect');
    
    // Make sure the dropdown is populated with recipes before setting the value
    if (recipes.length > 0) {
        // Find the recipe with the matching recipe_id and set it as the selected option
        recipeDropdown.value = plan.recipe_id;
    } else {
        console.error('Recipes not loaded yet.');
    }

    // Store the current plan ID for updating
    selectedPlanId = plan.planner_id;
}

// Function to close the modal
function closeModal() {
    modal.style.display = 'none';
    backdrop.classList.remove('show');
}

// Function to close the update modal
function closeUpdateModal() {
    updateModal.style.display = 'none';
    backdrop.classList.remove('show');
}

// Function to handle buttons in add modal
function initializeAddButtonListeners() {
    addButtons.forEach(button => {
        button.addEventListener('click', function() {
            currentTime = this.getAttribute('data-time'); // Store the current time
            openModal();

            // Reset the input fields
            document.getElementById('planTitle').value = '';
            document.getElementById('planDescription').value = '';
            document.getElementById('recipeSelect').value = '';
        });
    });

    // Get user selected recipe dropdown value
    const recipeDropdown = document.getElementById('recipeSelect');
    recipeDropdown.addEventListener('change', function() {
        selectedRecipeId = this.value; 
    });

    modal.querySelector('.btn-close').addEventListener('click', closeModal);
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    const saveButton = document.getElementById('savePlanButton');

    function savePlanHandler() {
        addPlan(currentTime); 
    }

    saveButton.removeEventListener('click', savePlanHandler); // Remove old listener
    saveButton.addEventListener('click', savePlanHandler); 
}

// Function to handle buttons in update modal
function initializeUpdateButton() {
    const updateButton = document.getElementById('saveUpdatePlanButton');
    const deleteButton = document.getElementById('deletePlanButton');

    updateModal.querySelector('.btn-close').addEventListener('click', closeUpdateModal);
    
    window.addEventListener('click', (event) => {
        if (event.target === updateModal) {
            closeUpdateModal();
        }
    });

    // Function that handles update 
    function updatePlanHandler() {
        const updatedTitle = document.getElementById('updatePlanTitle').value;
        const updatedDescription = document.getElementById('updatePlanDescription').value;

        const updatedRecipeId = document.getElementById('updateRecipeSelect').value;
        selectedRecipeId = updatedRecipeId;

        // Create a new JSON for the updated values
        const updatedPlan = {
            recipe_id: updatedRecipeId,
            title: updatedTitle,
            description: updatedDescription,
        };

        // Update plan API call
        fetch(`/planners/${selectedPlanId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPlan)
        })
        .then(response => response.json())
        .then(() => {
            // Update content in front end
            selectedEventDiv.textContent = `${updatedTitle}: ${updatedDescription}`;
            closeUpdateModal();
            getPlans(); 
            calculateCalories(selectedPlanId, 'update'); // Re calculate calories upon updating
            selectedRecipeId = null; 
        })
        .catch(error => console.error('Error updating plan:', error));
    }

    // Function that handles delete
    function deletePlanHandler() {
        fetch(`/planners/${selectedPlanId}`, {
            method: 'DELETE', 
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then(response => response.json())
        .then(() => {
            closeUpdateModal();
            getPlans(); 
            calculateCalories(selectedPlanId, 'delete'); // Re calculate calories upon deleting
        })
        .catch(error => console.error('Error updating plan:', error));
    }

    updateButton.addEventListener('click', updatePlanHandler);
    deleteButton.addEventListener('click', deletePlanHandler);
}

// Display of plan in calender
function displayPlan(plan) {
    const maxTitleLength = 30; // Set the max length for the title
    const maxDescriptionLength = 30; // Set the max length for the description
    
    // Replaces too long values with ellipses 
    const truncatedTitle = plan.title.length > maxTitleLength 
        ? plan.title.slice(0, maxTitleLength) + '...' 
        : plan.title;

    const truncatedDescription = plan.description.length > maxDescriptionLength 
        ? plan.description.slice(0, maxDescriptionLength) + '...' 
        : plan.description;

    // Populate time slots in planner
    const timeSlots = document.querySelectorAll('.time-slot');
    timeSlots.forEach(slot => {
        if (slot.textContent.trim().includes(plan.time) && plan.date === currentDayElem.textContent) {
            const timeSlotContainer = slot.querySelector('.time-slot-container');
            const eventDiv = document.createElement('div');
            eventDiv.className = 'event-title';
            
            // Set the content with the truncated title and description
            eventDiv.textContent = `${truncatedTitle}: ${truncatedDescription}`;

            eventDiv.addEventListener('click', function() {
                selectedEventDiv = eventDiv; // Store the reference to the clicked event div
                openUpdateModal(plan); // Open the update modal with plan details when clicked on event
            });

            timeSlotContainer.appendChild(eventDiv);
        }
    });
}

// Get plans for specific user
function getPlans() {
    fetch(`/plannersUser/${currentUser}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    return [];
                }
                throw new Error('Failed to fetch plans');
            }
            return response.json();
        })
        .then(plans => {
            plansArr = plans || []; // Ensure plans is always an array
            
            // Clear existing events
            const existingEvents = document.querySelectorAll('.event-title');
            existingEvents.forEach(event => event.remove());

            // Display plans if they exist
            if (plansArr.length > 0) {
                plansArr.forEach(displayPlan);
            }

            // Only calculate calories if it hasn't been done yet
            if (!caloriesCalculated) {
                displayRecipeDetails();
                caloriesCalculated = true;
            }

            calculateTotalMeals();
        })
        .catch(error => console.error('Error fetching plans:', error));
}

// Function to handle adding a plan
function addPlan(time) {
    const currentDayElem = document.getElementById('currentDay').textContent;

    // Check if a recipe has been selected
    if (!selectedRecipeId) {
        // Highlight the recipe dropdown in red
        const recipeDropdown = document.getElementById('recipeSelect');
        recipeDropdown.style.border = '2px solid red';
        
        // Display an error message
        const errorMessage = document.getElementById('recipeError');
        errorMessage.textContent = 'Please select a recipe';
        errorMessage.style.display = 'block'; // Ensure it's visible

        return; // Stop the function if no recipe is selected
    }

    // Reset any previous error styles if a recipe is selected
    const recipeDropdown = document.getElementById('recipeSelect');
    recipeDropdown.style.border = ''; // Remove red border

    const errorMessage = document.getElementById('recipeError');
    errorMessage.textContent = '';
    errorMessage.style.display = 'none';

    // Create new JSON for adding the plan
    const plan = {
        user_id: currentUser,
        recipe_id: selectedRecipeId,
        title: document.getElementById('planTitle').value,
        description: document.getElementById('planDescription').value,
        time: time,
        date: currentDayElem
    };

    // Fetch request to add the plan
    fetch('/planners', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(plan)
    })
    .then(response => response.json())
    .then(() => {
        closeModal();
        document.getElementById('addPlanForm').reset();
        caloriesCalculated = false; 
        getPlans(); 
        selectedRecipeId = null;
    });
}


// Check if user is logged in
function checkedUser(){
    fetch('/check-session', {
        method: 'GET'
    })
    .then(response => response.json())
    .then(data => {
        if (data.loggedIn) {
            const userLink = document.getElementById('user-link');
            currentUser = data.user.id;
            getPlans();
            userLink.href = 'dashboard.html';
        } else {
            console.error('User not logged in');
            userLink.href = 'login.html';
        }
    })
    .catch(error => {
        console.error('Error checking session:', error);
    });
}

// Get recipes by name and id for the dropdown 
function getRecipes() {
    fetch('/recipesNameId')  
        .then(response => response.json())
        .then(data => {
            recipes = data;
            populateRecipeDropdown(recipes);
        })
        .catch(error => console.error('Error fetching recipes:', error));
}

// Populate recipe dropdown
function populateRecipeDropdown(recipes) {
    const dropdown = document.getElementById('recipeSelect');
    const updateDropdown = document.getElementById('updateRecipeSelect');

    dropdown.innerHTML = ''; // Clear any existing options
    updateDropdown.innerHTML = '';

    // Add a default option
    const defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.disabled = true;
    defaultOption.selected = true;
    defaultOption.textContent = 'Select a recipe';
    dropdown.appendChild(defaultOption);
    updateDropdown.appendChild(defaultOption.cloneNode(true));

    // Loop through the recipes and create options for each
    recipes.forEach(recipe => {
        const option = document.createElement('option');
        option.value = recipe.recipe_id; // Use recipe ID for later use
        
        // Limit the length of the recipe name
        const maxLength = 30;
        const recipeName = recipe.name.length > maxLength 
            ? recipe.name.slice(0, maxLength) + '...' 
            : recipe.name;

        option.textContent = recipeName; 
        option.className = 'recipe-option';
        dropdown.appendChild(option.cloneNode(true));
        updateDropdown.appendChild(option);
    });

    dropdown.style.display = 'block';

    // Add change event listener for the dropdown
    dropdown.addEventListener('change', function() {
        selectedRecipeId = this.value; // Update the selected recipe ID
        const selectedRecipe = recipes.find(recipe => recipe.recipe_id == selectedRecipeId);
    });
    updateDropdown.addEventListener('change', function() {
        selectedRecipeId = this.value; // Update the selected recipe ID
        const selectedRecipe = recipes.find(recipe => recipe.recipe_id == selectedRecipeId);
    });
}

// Calories Functions
// Remove Calories
function removeCalories(id) {
    const matchedPlan = plansArr.find(plan => plan.planner_id === id);
    const recipeId = matchedPlan.recipe_id; // Get the recipe_id from the matched plan

    if (!matchedPlan) {
        console.error('Plan not found for the given planner_id:', id);
        return;
    }
    fetch(`/recipes/${recipeId}`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Recipe not found');
            }
            return response.json();
        })
        .then(recipe => {
            // Fetch nutrition value for each ingredient in the recipe
            fetch(`/nutritions/${recipeId}`)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`Nutritional data for recipe ID ${recipeId} not found`);
                    }
                    return response.json();
                })
                .then(nutrition => {
                    if (nutrition.length > 0) {
                        nutrition.forEach(item => {
                            totalCalories -= parseInt(item.calories); // Decrement calories
                        });
                    } else {
                        console.error(`No nutritional data found for recipe ID ${recipeId}.`);
                    }
                    
                    const caloriesElement = document.getElementById('total-calories');
                    caloriesElement.textContent = totalCalories;
                })
                .catch(error => {
                    console.error(`Error fetching nutrition data for recipe ID ${recipeId}:`, error);
                });
        })
        .catch(error => console.error('Error fetching recipe details:', error));
}

// Add calories
function addCalories(){
    const recipeId = selectedRecipeId;
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
             //Fetch nutrition value for each ingridient in recipe
            fetch(`/nutritions/${recipeId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Nutritional data for ${recipe} not found`);
                }
                return response.json();
            })
            .then(nutrition => {
                for(let i = 0; i<nutrition.length; i++){
                    totalCalories += parseInt(nutrition[i].calories); // Increment calories
                }
                const calories = document.getElementById('total-calories');
                calories.textContent = totalCalories;
            })
            .catch(error => {
                console.error(`Error fetching nutrition data for ${recipe}:`, error);
            });
        })
        .catch(error => console.error('Error fetching recipe details:', error));
}

// Calculate calories based on type and ID
function calculateCalories(id, type) {
    if(id != null && type == 'update'){
        removeCalories(id); // Remove first
        addCalories(); // Add calories 
    }
    else if(id != null && type == 'delete'){
        removeCalories(id);
    }
    else if(id == null && type == 'add'){
        addCalories();
    }
}

function displayRecipeDetails() {
    // Reset totalCalories for the new calculation
    totalCalories = 0;

    // Get the current date string to match with plansArr
    const currentDateString = currentDayElem.textContent;

    // Filter plansArr to only include the plans for the current date
    const todayPlans = plansArr.filter(plan => plan.date === currentDateString);

    if (todayPlans.length > 0) {
        // Iterate through each plan for today
        todayPlans.forEach(plan => {
            const currRecipeId = plan.recipe_id; // Get the recipe ID from the plan

            fetch(`/nutritions/${currRecipeId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Nutritional data for ${currRecipeId} not found`);
                }
                return response.json();
            })
            .then(nutrition => {
                nutrition.forEach(item => {
                    totalCalories += parseInt(item.calories);
                });

                // Update the total calories display
                const calories = document.getElementById('total-calories');
                calories.textContent = totalCalories;
            })
            .catch(error => {
                console.error(`Error fetching nutrition data for ${currRecipeId}:`, error);
            });
        });
    } else {
        // If there are no plans for today, reset the calories display
        totalCalories = 0;
        const calories = document.getElementById('total-calories');
        calories.textContent = '0'; 
    }
}

// Calculate meals by grouping same day count of plans
function calculateTotalMeals() {
    fetch(`/plannersGroup/${currentUser}`)
        .then(response => {
            if (!response.ok) {
                if (response.status === 404) {
                    return []; 
                }
                throw new Error('Failed to fetch plans'); 
            }
            return response.json(); 
        })
        .then(plans => {
            const mealElem = document.getElementById('total-meal');
            const currentDateDisplayed = currentDayElem ? currentDayElem.textContent : '';

            if (!mealElem || !currentDateDisplayed) {
                console.error('Error: Meal element or current date is not defined.');
                return;
            }

            const mealsToday = plans.find(plan => plan.date === currentDateDisplayed);

            mealElem.textContent = mealsToday ? mealsToday.total_plans : 0;
        })
        .catch(error => console.error('Error fetching plans:', error));
}

// Initialize the app
function initializeApp() {
    checkedUser();
    initializeDate();
    initializeAddButtonListeners();
    initializeUpdateButton();
    getRecipes();
}

// Call to initialize everything when the page loads
initializeApp();
