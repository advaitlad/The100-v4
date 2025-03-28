// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const signupForm = document.getElementById('signup-form');
    const showSignup = document.getElementById('show-signup');
    const showLogin = document.getElementById('show-login');
    const loginModal = document.getElementById('login-modal');
    const signupModal = document.getElementById('signup-modal');
    const profileToggle = document.getElementById('profile-toggle');
    const profileModal = document.getElementById('profile-modal');
    const closeProfile = document.getElementById('close-profile');
    const logoutButton = document.getElementById('logout-button');
    const usernameDisplay = document.getElementById('username-display');
    const errorModal = document.getElementById('error-modal');
    const errorMessage = document.getElementById('error-message');
    const errorOkBtn = document.getElementById('error-ok-btn');

    // Function to show error modal
    function showError(message) {
        // Remove any existing overlays
        const existingOverlays = document.querySelectorAll('.overlay');
        existingOverlays.forEach(overlay => overlay.remove());
        
        // Create and add new overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay active';
        document.body.appendChild(overlay);
        
        // Set error message and show modal
        errorMessage.textContent = message;
        errorModal.classList.remove('hidden');
        
        // Close on overlay click
        overlay.addEventListener('click', () => {
            errorModal.classList.add('hidden');
            overlay.remove();
        });
    }

    // Error modal OK button handler
    errorOkBtn?.addEventListener('click', () => {
        errorModal.classList.add('hidden');
        const overlay = document.querySelector('.overlay');
        if (overlay) overlay.remove();
    });

    // Profile toggle click handler
    profileToggle?.addEventListener('click', () => {
        console.log('Profile toggle clicked'); // Debug log
        if (!window.userManager?.currentUser) {
            loginModal?.classList.remove('hidden');
        } else {
            // If profile modal is visible, close it
            if (!profileModal?.classList.contains('hidden')) {
                profileModal?.classList.add('hidden');
                const overlay = document.querySelector('.overlay');
                if (overlay) overlay.remove();
                return;
            }
            
            // Remove any existing overlays first
            const existingOverlays = document.querySelectorAll('.overlay');
            existingOverlays.forEach(overlay => overlay.remove());
            
            // Show profile modal
            profileModal?.classList.remove('hidden');
            // Add new overlay
            const overlay = document.createElement('div');
            overlay.className = 'overlay active';
            document.body.appendChild(overlay);
            
            // Close on overlay click
            overlay.addEventListener('click', () => {
                profileModal?.classList.add('hidden');
                overlay.remove();
            });
        }
    });

    // Close profile modal
    closeProfile?.addEventListener('click', () => {
        profileModal?.classList.add('hidden');
        // Remove overlay
        const overlay = document.querySelector('.overlay');
        if (overlay) overlay.remove();
    });

    // Show signup modal
    showSignup?.addEventListener('click', (e) => {
        e.preventDefault();
        loginModal?.classList.add('hidden');
        signupModal?.classList.remove('hidden');
    });

    // Show login modal
    showLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        signupModal?.classList.add('hidden');
        loginModal?.classList.remove('hidden');
    });

    // Handle login form submission
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;

        try {
            await window.userManager.login(email, password);
            loginModal?.classList.add('hidden');
            loginForm.reset();
            const overlay = document.querySelector('.overlay');
            if (overlay) overlay.remove();
        } catch (error) {
            // Don't log expected errors
            if (!['auth/invalid-login-credentials', 
                  'auth/wrong-password', 
                  'auth/user-not-found'].includes(error.code)) {
                console.error('Unexpected login error:', error);
            }
            
            // Show user-friendly error message
            let errorMsg = 'Invalid email or password';
            switch (error.code) {
                case 'auth/invalid-login-credentials':
                case 'auth/wrong-password':
                case 'auth/user-not-found':
                    errorMsg = 'Invalid email or password. Please try again.';
                    break;
                case 'auth/too-many-requests':
                    errorMsg = 'Too many failed attempts. Please try again later.';
                    break;
                default:
                    errorMsg = error.message || 'Error logging in';
            }
            showError(errorMsg);
            
            // Clear password field
            document.getElementById('login-password').value = '';
        }
    });

    // Helper function to convert Firebase error codes to user-friendly messages
    function getErrorMessage(errorCode) {
        switch (errorCode) {
            case 'auth/invalid-email':
                return 'Please enter a valid email address.';
            case 'auth/user-disabled':
                return 'This account has been disabled. Please contact support.';
            case 'auth/user-not-found':
                return 'No account found with this email. Please sign up first.';
            case 'auth/wrong-password':
                return 'Incorrect password. Please try again.';
            case 'auth/invalid-login-credentials':
                return 'Invalid email or password. Please try again.';
            case 'auth/too-many-requests':
                return 'Too many failed attempts. Please try again later.';
            default:
                return 'An error occurred. Please try again.';
        }
    }

    // Add this to clear error when switching between login/signup
    document.getElementById('show-signup')?.addEventListener('click', () => {
        const loginError = document.getElementById('login-error');
        loginError?.classList.add('hidden');
    });

    document.getElementById('show-login')?.addEventListener('click', () => {
        const loginError = document.getElementById('login-error');
        loginError?.classList.add('hidden');
    });

    // Handle signup form submission
    signupForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const username = document.getElementById('signup-username').value;
        const email = document.getElementById('signup-email').value;
        const password = document.getElementById('signup-password').value;
        const confirmPassword = document.getElementById('signup-confirm-password').value;

        if (password !== confirmPassword) {
            showError('Passwords do not match');
            return;
        }

        try {
            await window.userManager.signup(email, password, username);
            signupModal?.classList.add('hidden');
            signupForm.reset();
            // Remove overlay after signup
            const overlay = document.querySelector('.overlay');
            if (overlay) overlay.remove();
        } catch (error) {
            console.error('Signup error:', error);
            let errorMsg = 'Error creating account';
            
            // Custom error messages
            switch (error.code) {
                case 'username-taken':
                    errorMsg = 'This username is already taken. Please choose another.';
                    break;
                case 'auth/email-already-in-use':
                    errorMsg = 'This email address is already registered.';
                    break;
                case 'auth/weak-password':
                    errorMsg = 'Password should be at least 6 characters long.';
                    break;
                case 'auth/invalid-email':
                    errorMsg = 'Please enter a valid email address.';
                    break;
                default:
                    errorMsg = error.message || 'Error creating account';
            }
            
            showError(errorMsg);
        }
    });

    // Handle logout
    logoutButton?.addEventListener('click', async () => {
        try {
            await window.userManager.logout();
            profileModal?.classList.add('hidden');
            if (usernameDisplay) {
                usernameDisplay.textContent = 'Guest';
            }
            const overlay = document.querySelector('.overlay');
            if (overlay) overlay.remove();
        } catch (error) {
            console.error('Logout error:', error);
            alert(error.message || 'Error logging out');
        }
    });

    // Delete account handling
    const deleteAccountButton = document.getElementById('delete-account-button');
    const deleteConfirmModal = document.getElementById('delete-confirm-modal');
    const cancelDeleteButton = document.getElementById('cancel-delete');
    const confirmDeleteButton = document.getElementById('confirm-delete');
    const deletePasswordInput = document.getElementById('delete-confirm-password');

    // Show delete confirmation modal
    deleteAccountButton?.addEventListener('click', () => {
        deleteConfirmModal?.classList.remove('hidden');
        // Add overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay active';
        document.body.appendChild(overlay);
        
        // Focus on password input
        deletePasswordInput?.focus();
    });

    // Cancel delete
    cancelDeleteButton?.addEventListener('click', () => {
        deleteConfirmModal?.classList.add('hidden');
        deletePasswordInput.value = ''; // Clear password
        // Remove overlay
        const overlay = document.querySelector('.overlay');
        if (overlay) overlay.remove();
    });

    // Confirm delete
    confirmDeleteButton?.addEventListener('click', async () => {
        const password = deletePasswordInput?.value;
        
        if (!password) {
            // Show error if password is empty
            const errorMessage = deleteConfirmModal.querySelector('.error-message') || 
                document.createElement('div');
            errorMessage.className = 'error-message visible';
            errorMessage.textContent = 'Please enter your password';
            if (!deleteConfirmModal.querySelector('.error-message')) {
                deleteConfirmModal.querySelector('.confirm-content').appendChild(errorMessage);
            }
            return;
        }

        try {
            await window.userManager.deleteAccount(password);
            // Hide all modals
            deleteConfirmModal?.classList.add('hidden');
            const profileModal = document.getElementById('profile-modal');
            profileModal?.classList.add('hidden');
            
            // Remove overlays
            const overlays = document.querySelectorAll('.overlay');
            overlays.forEach(overlay => overlay.remove());
            
            // Reload page
            window.location.reload();
        } catch (error) {
            // Show error message
            const errorMessage = deleteConfirmModal.querySelector('.error-message') || 
                document.createElement('div');
            errorMessage.className = 'error-message visible';
            errorMessage.textContent = error.code === 'auth/wrong-password' ? 
                'Incorrect password. Please try again.' : 
                'Failed to delete account. Please try again.';
            if (!deleteConfirmModal.querySelector('.error-message')) {
                deleteConfirmModal.querySelector('.confirm-content').appendChild(errorMessage);
            }
        }
    });

    // Close modal when clicking overlay
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('overlay')) {
            deleteConfirmModal?.classList.add('hidden');
            deletePasswordInput.value = ''; // Clear password
            // Remove overlay
            const overlay = document.querySelector('.overlay');
            if (overlay) overlay.remove();
        }
    });
}); 