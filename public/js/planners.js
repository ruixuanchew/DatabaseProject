// Get the current date
const currentDate = new Date();
const currentDayElem = document.getElementById('currentDay');

// Function to update the displayed current day
function updateCurrentDay(date) {
    const options = { weekday: 'long', year: 'numeric', month: 'short', day: 'numeric' };
    currentDayElem.textContent = date.toLocaleDateString('en-US', options);
}

// Initialize with today's date
updateCurrentDay(currentDate);

// Move to the previous day when clicking the left arrow
document.getElementById('prevDay').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() - 1);
    updateCurrentDay(currentDate);
});

// Move to the next day when clicking the right arrow
document.getElementById('nextDay').addEventListener('click', () => {
    currentDate.setDate(currentDate.getDate() + 1);
    updateCurrentDay(currentDate);
});

// Modal handling
const modal = document.getElementById('addPlanModal'); // Use the correct modal ID
const addButtons = document.querySelectorAll('.add-btn'); // Select all add buttons
const backdrop = document.createElement('div'); // Create backdrop element
backdrop.className = 'modal-backdrop'; // Set class for styling
document.body.appendChild(backdrop); // Append to body

// Open the modal when any add button is clicked
addButtons.forEach(button => {
    button.addEventListener('click', () => {
        modal.classList.add('show'); // Show the modal
        modal.style.display = 'block'; // Ensure the modal is displayed
        backdrop.classList.add('show'); // Show the backdrop
    });
});

// Close the modal when the user clicks the close button
modal.querySelector('.btn-close').addEventListener('click', () => {
    modal.style.display = 'none';
    backdrop.classList.remove('show'); // Remove the backdrop
});

// Close the modal when the user clicks outside of the modal
window.addEventListener('click', (event) => {
    if (event.target === modal) {
        modal.style.display = 'none';
        backdrop.classList.remove('show'); // Remove the backdrop
    }
});
