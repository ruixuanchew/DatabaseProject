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
}

// Function to move to the next day
function nextDay() {
    currentDate.setDate(currentDate.getDate() + 1);
    updateCurrentDay(currentDate);
}

// Initialize with today's date
function initializeDate() {
    updateCurrentDay(currentDate);
    document.getElementById('prevDay').addEventListener('click', prevDay);
    document.getElementById('nextDay').addEventListener('click', nextDay);
}

// Modal handling
const modal = document.getElementById('addPlanModal'); // Use the correct modal ID
const addButtons = document.querySelectorAll('.add-btn'); // Select all add buttons
const backdrop = createBackdrop();

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

// Function to close the modal
function closeModal() {
    modal.style.display = 'none';
    backdrop.classList.remove('show');
}

// Function to handle clicks on "Add" buttons
function initializeAddButtonListeners() {
    addButtons.forEach(button => {
        button.addEventListener('click', function(){
            const time = this.getAttribute('data-time');
            openModal();
            document.getElementById('savePlanButton').addEventListener('click', function() {
                addPlan(time);
            }, { once: true });
        });
    });

    modal.querySelector('.btn-close').addEventListener('click', closeModal);
    
    window.addEventListener('click', (event) => {
        if (event.target === modal) {
            closeModal();
        }
    });
}

// Function to submit the plan form
    function addPlan(time) {
    const currentDayElem = document.getElementById('currentDay').textContent;
    console.log(time, currentDayElem);
    const recipe = {
        user_id: 1,
        recipe_id: 3,
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
        body: JSON.stringify(recipe)
    })
    .then(response => response.json())
    .then(() => {
        // Reset form or perform actions after success
        // document.getElementById('recipeForm').reset();
    });
}

// Initialize the app
function initializeApp() {
    initializeDate();
    initializeAddButtonListeners();
}

// Call to initialize everything when the page loads
initializeApp();
