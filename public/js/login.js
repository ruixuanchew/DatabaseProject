document.addEventListener("DOMContentLoaded", () => {
    const loginCard = document.querySelector('.login-card');
    const registerCard = document.querySelector('.register-card');

    document.querySelector('.create-account').addEventListener('click', () => {
        loginCard.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'; // Add opacity transition
        loginCard.style.transform = 'translateX(-100%)'; // Move out to the left
        loginCard.style.opacity = '0'; // Start fading out

        setTimeout(() => {
            loginCard.style.display = 'none'; // Hide the login card completely
            registerCard.style.display = 'block'; // Show register card
            registerCard.style.transform = 'translateX(100%)'; // Start position from the right
            registerCard.style.opacity = '0'; // Start faded

            // Trigger a reflow to apply the initial transform
            void registerCard.offsetWidth; // This forces a reflow

            setTimeout(() => {
                registerCard.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'; // Set transition
                registerCard.style.transform = 'translateX(0)'; // Move in from the right
                registerCard.style.opacity = '1'; // Fade in
            }, 50); // Short delay to allow for initial position setting
        }, 500); // Wait for the transition to finish
    });

    document.querySelector('.login-link').addEventListener('click', () => {
        registerCard.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'; // Add opacity transition
        registerCard.style.transform = 'translateX(100%)'; // Move out to the right
        registerCard.style.opacity = '0'; // Start fading out

        setTimeout(() => {
            registerCard.style.display = 'none'; // Hide the register card completely
            loginCard.style.display = 'block'; // Show login card
            loginCard.style.transform = 'translateX(-100%)'; // Move in from the left
            loginCard.style.opacity = '0'; // Start faded

            // Trigger a reflow to apply the initial transform
            void loginCard.offsetWidth; // This forces a reflow

            setTimeout(() => {
                loginCard.style.transition = 'transform 0.5s ease-in-out, opacity 0.5s ease-in-out'; // Set transition
                loginCard.style.transform = 'translateX(0)'; // Final position
                loginCard.style.opacity = '1'; // Fade in
            }, 50); // Short delay to allow for initial position setting
        }, 500); // Wait for the transition to finish
    });
    checkUser();
});

// Handle Registration when the "Create Account" button is clicked in the register form
document.querySelector('.register-card .create-account').addEventListener('click', function () {
    const username = document.getElementById('regUsername').value;
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
    }

    fetch('/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, email, password })
    })
    .then(response => {
        if (response.status === 409) {
            return response.json().then(data => { throw new Error(data.message); });
        }
        if (!response.ok) {
            return response.json().then(data => { throw new Error(data.message); });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Registration successful!');
            window.location.href = 'login.html'; // Redirect on success
        } else {
            alert('Registration failed: ' + data.message);
        }
    })
    .catch(error => {
        alert('Error: ' + error.message); // Catch any errors from the server or network
    });
});

// Handle Login when the login button is clicked in the login form
document.querySelector('.login-card .btn-primary').addEventListener('click', function () {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    fetch('/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password })
    })
    .then(response => {
        if (!response.ok) {
            return response.json().then(data => { throw new Error(data.message); });
        }
        return response.json();
    })
    .then(data => {
        if (data.success) {
            alert('Login successful!');
            window.location.href = 'dashboard.html'; // Redirect on success
        } else {
            alert('Login failed: ' + data.message);
        }
    })
    .catch(error => {
        alert('Error: ' + error.message); // Catch any errors from the server or network
    });
});

function checkUser() {
    fetch('/check-session', {
        method: 'GET'
    })
        .then(response => response.json())
        .then(data => {
            const plannerNav = document.getElementById('planner_nav');

            if (data.loggedIn) {
                // User is logged in, set the href to planner.html
                plannerNav.setAttribute('href', 'planner.html');
            } else {
                // User is not logged in, set the href to login.html
                plannerNav.setAttribute('href', 'login.html');
                console.error('User not logged in');
            }
        })
        .catch(error => {
            console.error('Error checking session:', error);
        });
}