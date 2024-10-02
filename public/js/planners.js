let recipes = [];
let selectedRecipeId = null;

// Get and display the current date
const currentDate = new Date();
const currentDayElem = document.getElementById('currentDay');

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
}

// Function to move to the next day
function nextDay() {
    currentDate.setDate(currentDate.getDate() + 1);
    updateCurrentDay(currentDate);
    getPlans(); 
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

// Function to create the backdrop element
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

// Function to show the "View Details" button and update its href
function initializeViewDetailsButton() {
    const recipeDropdown = document.getElementById('recipeSelect');
    const viewDetailsButton = document.getElementById('viewDetailsButton');

    recipeDropdown.addEventListener('change', function() {
        selectedRecipeId = this.value; // Update the selected recipe ID

        // Find the selected recipe object
        const selectedRecipe = recipes.find(recipe => recipe.recipe_id == selectedRecipeId);

        if (selectedRecipe) {
            // Show the "View Details" button
            viewDetailsButton.style.display = 'inline-block';

            // Update the href for the "View Details" button with the selected recipe's ID
            viewDetailsButton.addEventListener('click', function() {
                window.location.href = `details.html?id=${selectedRecipe.recipe_id}`;
            });
        } else {
            // Hide the "View Details" button if no valid recipe is selected
            viewDetailsButton.style.display = 'none';
        }
    });
}
function initializeUpdateViewDetailsButton() {
    const recipeDropdown = document.getElementById('updateRecipeSelect');
    const viewDetailsButton = document.getElementById('viewUpdateDetailsButton');

    recipeDropdown.addEventListener('change', function() {
        selectedRecipeId = this.value; // Update the selected recipe ID

        // Find the selected recipe object
        const selectedRecipe = recipes.find(recipe => recipe.recipe_id == selectedRecipeId);

        if (selectedRecipe) {
            // Show the "View Details" button
            viewDetailsButton.style.display = 'inline-block';

            // Update the href for the "View Details" button with the selected recipe's ID
            viewDetailsButton.addEventListener('click', function() {
                window.location.href = `details.html?id=${selectedRecipe.recipe_id}`;
            });
        } else {
            // Hide the "View Details" button if no valid recipe is selected
            viewDetailsButton.style.display = 'none';
        }
    });
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

// Function to handle clicks on "Add" buttons
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

    const recipeDropdown = document.getElementById('recipeSelect');
    recipeDropdown.addEventListener('change', function() {
        selectedRecipeId = this.value; // Update the selected recipe ID
    });

    modal.querySelector('.btn-close').addEventListener('click', closeModal);
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });

    // Set up the save button listener only once
    const saveButton = document.getElementById('savePlanButton');

    // Define the save plan handler function
    function savePlanHandler() {
        addPlan(currentTime); // Use the current time when saving
    }

    // Remove any existing listener before adding a new one
    saveButton.removeEventListener('click', savePlanHandler); // Remove old listener
    saveButton.addEventListener('click', savePlanHandler);
}

// Function to handle the update button click
function initializeUpdateButton() {
    const updateButton = document.getElementById('saveUpdatePlanButton');
    const deleteButton = document.getElementById('deletePlanButton');

    updateModal.querySelector('.btn-close').addEventListener('click', closeUpdateModal);
    
    window.addEventListener('click', (event) => {
        if (event.target === updateModal) {
            closeUpdateModal();
        }
    });

    function updatePlanHandler() {
        const updatedTitle = document.getElementById('updatePlanTitle').value;
        const updatedDescription = document.getElementById('updatePlanDescription').value;

        const updatedRecipeId = document.getElementById('updateRecipeSelect').value;
        const updatedPlan = {
            recipe_id: updatedRecipeId,
            title: updatedTitle,
            description: updatedDescription,
        };

        fetch(`/planners/${selectedPlanId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedPlan)
        })
        .then(response => response.json())
        .then(() => {
            selectedEventDiv.textContent = `${updatedTitle}: ${updatedDescription}`;

            closeUpdateModal();
            getPlans(); 
        })
        .catch(error => console.error('Error updating plan:', error));
    }
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
        })
        .catch(error => console.error('Error updating plan:', error));
    }

    updateButton.addEventListener('click', updatePlanHandler);
    deleteButton.addEventListener('click', deletePlanHandler);
}

function displayPlan(plan) {
    const maxTitleLength = 30; // Set the max length for the title
    const maxDescriptionLength = 30; // Set the max length for the description
    
    const truncatedTitle = plan.title.length > maxTitleLength 
        ? plan.title.slice(0, maxTitleLength) + '...' 
        : plan.title;

    const truncatedDescription = plan.description.length > maxDescriptionLength 
        ? plan.description.slice(0, maxDescriptionLength) + '...' 
        : plan.description;

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
                openUpdateModal(plan); // Open the update modal with plan details
            });

            timeSlotContainer.appendChild(eventDiv);
        }
    });
}

function getPlans() {
    fetch('/planners')
        .then(response => response.json())
        .then(plans => {
            // Clear existing events before displaying new ones
            const existingEvents = document.querySelectorAll('.event-title');
            existingEvents.forEach(event => event.remove());

            plans.forEach(plan => {
                displayPlan(plan); // Display each plan
            });
        })
        .catch(error => console.error('Error fetching plans:', error));
}

// Function to submit the plan form
    function addPlan(time) {
    const currentDayElem = document.getElementById('currentDay').textContent;
    const plan = {
        user_id: 1,
        recipe_id: selectedRecipeId,
        title: document.getElementById('planTitle').value,
        description: document.getElementById('planDescription').value,
        time: time,
        date: currentDayElem
    };

    fetch('/planners', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(plan)
    })
    .then(response => response.json())
    .then(() => {
        // Reset form or perform actions after success
        closeModal();
        document.getElementById('addPlanForm').reset();
        selectedRecipeId = null;
        getPlans();
    });
}

function getRecipes() {
    fetch('/recipes')  
        .then(response => response.json())
        .then(data => {
            recipes = data;
            populateRecipeDropdown(recipes);
        })
        .catch(error => console.error('Error fetching recipes:', error));
}

// Inside populateRecipeDropdown function
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
        if (selectedRecipe) {
            initializeViewDetailsButton();
            
            // document.getElementById('planTitle').value = selectedRecipe.title; // Update title based on selection
        }
    });
    updateDropdown.addEventListener('change', function() {
        selectedRecipeId = this.value; // Update the selected recipe ID
        const selectedRecipe = recipes.find(recipe => recipe.recipe_id == selectedRecipeId);
        if (selectedRecipe) {
            initializeUpdateViewDetailsButton();
            
            // document.getElementById('planTitle').value = selectedRecipe.title; // Update title based on selection
        }
    });
}

// Nutrition Cases and Calories Here

// Initialize the app
function initializeApp() {
    initializeDate();
    initializeAddButtonListeners();
    initializeUpdateButton();
    getPlans();
    getRecipes();
}

// Call to initialize everything when the page loads
initializeApp();
