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
    const closeLogin = document.getElementById('close-login');
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

    // Function to handle escape key for login modal
    const escapeKeyListener = (e) => {
        if (e.key === 'Escape') {
            closeLoginModal();
        }
    };

    // Function to handle escape key for profile modal
    const profileEscapeListener = (e) => {
        if (e.key === 'Escape' && profileModal && !profileModal.classList.contains('hidden')) {
            closeProfileModal();
        }
    };

    // Function to close login modal
    function closeLoginModal() {
        loginModal?.classList.add('hidden');
        const overlay = document.querySelector('.overlay');
        if (overlay) overlay.remove();
        // Remove the escape key listener
        document.removeEventListener('keydown', escapeKeyListener);
    }

    // Function to close profile modal
    function closeProfileModal() {
        profileModal?.classList.add('hidden');
        const overlay = document.querySelector('.overlay');
        if (overlay) overlay.remove();
        // Remove the escape key listener
        document.removeEventListener('keydown', profileEscapeListener);
    }

    // Close login modal when X is clicked
    closeLogin?.addEventListener('click', closeLoginModal);

    // Close profile modal
    closeProfile?.addEventListener('click', closeProfileModal);

    // Function to show login modal
    function showLoginModal() {
        // Close all other modals first
        window.closeAllModals();
        
        // Show login modal
        loginModal?.classList.remove('hidden');
        
        // Add new overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay active';
        document.body.appendChild(overlay);
        
        // Close on overlay click
        overlay.addEventListener('click', closeLoginModal);
        
        // Add escape key listener
        document.addEventListener('keydown', escapeKeyListener);
    }

    // Function to show signup modal
    function showSignupModal() {
        // Close all other modals first
        window.closeAllModals();
        
        signupModal?.classList.remove('hidden');
        
        // Add new overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay active';
        document.body.appendChild(overlay);
        
        // Close on overlay click
        overlay.addEventListener('click', closeSignupModal);
        
        // Add escape key listener
        document.addEventListener('keydown', signupEscapeListener);
    }

    // Show signup modal
    showSignup?.addEventListener('click', (e) => {
        e.preventDefault();
        showSignupModal();
    });

    // Add back arrow to signup modal if it doesn't exist
    const signupModalHeader = signupModal?.querySelector('.modal-header');
    if (signupModalHeader && !signupModalHeader.querySelector('.back-arrow')) {
        const backArrow = document.createElement('button');
        backArrow.className = 'back-arrow';
        backArrow.innerHTML = '<i class="fas fa-arrow-left"></i>';
        backArrow.style.cssText = `
            position: absolute;
            left: 16px;
            top: 50%;
            transform: translateY(-50%);
            background: none;
            border: none;
            color: #6b7280;
            cursor: pointer;
            padding: 8px;
            border-radius: 50%;
            transition: all 0.2s ease;
        `;
        
        // Add hover styles
        const style = document.createElement('style');
        style.textContent = `
            .back-arrow:hover {
                background: #f3f4f6;
                color: #374151;
            }
            .back-arrow:active {
                transform: translateY(-50%) scale(0.95);
            }
        `;
        document.head.appendChild(style);
        
        // Add click handler
        backArrow.addEventListener('click', (e) => {
            e.preventDefault();
            closeSignupModal();
            showLoginModal();
        });
        
        signupModalHeader.appendChild(backArrow);
    }

    // Show login modal from signup
    showLogin?.addEventListener('click', (e) => {
        e.preventDefault();
        closeSignupModal(); // Use the dedicated close function
        showLoginModal();
    });

    // Handle login form submission
    loginForm?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const identifier = document.getElementById('login-identifier').value.trim();
        const password = document.getElementById('login-password').value;
        const loginError = document.getElementById('login-error');
        const loginButton = loginForm.querySelector('button[type="submit"]');

        // Disable the login button and show loading state
        if (loginButton) {
            loginButton.disabled = true;
            loginButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
        }

        // Hide any previous error messages
        if (loginError) {
            loginError.classList.add('hidden');
            loginError.textContent = '';
        }

        try {
            await window.userManager.login(identifier, password);
            
            // Login successful
            loginModal?.classList.add('hidden');
            loginForm.reset();
            const overlay = document.querySelector('.overlay');
            if (overlay) overlay.remove();
            
        } catch (error) {
            console.error('Login error:', error);
            
            // Show error message
            if (loginError) {
                loginError.textContent = error.message || 'Error logging in. Please try again.';
                loginError.classList.remove('hidden');
            }
            
            // Clear password field but keep the identifier
            document.getElementById('login-password').value = '';
        } finally {
            // Re-enable the login button and restore its text
            if (loginButton) {
                loginButton.disabled = false;
                loginButton.innerHTML = 'Login';
            }
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
            closeSignupModal(); // Use the dedicated close function
            signupForm.reset();
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

    // Profile toggle click handler
    profileToggle?.addEventListener('click', () => {
        console.log('Profile toggle clicked'); // Debug log

        if (!window.userManager?.currentUser) {
            // If login modal is visible, close it
            if (loginModal && !loginModal.classList.contains('hidden')) {
                closeLoginModal();
                return;
            }
            showLoginModal();
        } else {
            // If profile modal is already visible, just close it
            if (profileModal && !profileModal.classList.contains('hidden')) {
                closeProfileModal();
                return;
            }
            
            // Close all other modals before showing profile
            window.closeAllModals();
            
            // Show profile modal
            if (profileModal) {
                profileModal.style.display = 'block'; // Ensure it's displayed
                profileModal.classList.remove('hidden');
                
                // Add new overlay
                const overlay = document.createElement('div');
                overlay.className = 'overlay active';
                document.body.appendChild(overlay);
                
                // Add escape key listener for profile modal
                document.addEventListener('keydown', profileEscapeListener);
                
                // Close on overlay click
                overlay.addEventListener('click', closeProfileModal);
            } else {
                console.error('Profile modal element not found');
            }
        }
    });
}); 