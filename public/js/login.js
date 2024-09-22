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
});
