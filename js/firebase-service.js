// Initialize Firebase
class FirebaseUserManager {
    constructor() {
        this.auth = firebase.auth();
        this.db = firebase.firestore();
        this.currentUser = null;
        this.isGuest = false;
        this.userData = null;
        this.setupAuthListeners();
    }

    setupAuthListeners() {
        // Use window.auth to ensure we're using the globally initialized Firebase auth
        this.auth.onAuthStateChanged(async (user) => {
            if (user) {
                console.log('User logged in:', user.uid);
                this.currentUser = user;
                try {
                    // Get user data from Firestore
                    const doc = await this.db.collection('users').doc(user.uid).get();
                    if (doc.exists) {
                        this.userData = doc.data();
                    } else {
                        // Create new user document if it doesn't exist
                        await this.createNewUser();
                    }
                    this.updateUI();
                } catch (error) {
                    console.error('Error loading user data:', error);
                }
            } else {
                console.log('User logged out');
                this.currentUser = null;
                this.userData = null;
                this.updateUI();
                
                // Dispatch resetGame event with preserveTiles flag
                const resetEvent = new CustomEvent('resetGame', { 
                    detail: { 
                        preserveTiles: true 
                    } 
                });
                document.dispatchEvent(resetEvent);
            }
        });
    }

    async loadUserData() {
        if (!this.currentUser) {
            this.userData = null;
            this.updateUI();
            return;
        }

        try {
            const userDoc = await this.db.collection('users').doc(this.currentUser.uid).get();
            if (userDoc.exists) {
                this.userData = userDoc.data();
                this.updateUI();
            } else {
                // Create new user document if it doesn't exist
                await this.createNewUser();
            }
        } catch (error) {
            console.error('Error loading user data:', error);
            // Still update UI even if there's an error
            this.updateUI();
        }
    }

    async createNewUser() {
        const userData = {
            username: this.currentUser.email.split('@')[0],
            email: this.currentUser.email,
            createdAt: firebase.firestore.FieldValue.serverTimestamp(),
            lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
            stats: {
                gamesPlayed: 0,
                highScore: 0,
                currentStreak: 0,  // Initialize at 0
                bestStreak: 0,     // Initialize at 0
                categoryStats: {}
            },
            gameHistory: []
        };

        await this.db.collection('users').doc(this.currentUser.uid).set(userData);
        this.userData = userData;
        this.updateUI();
    }

    async signup(email, password, username) {
        try {
            console.log('Starting signup process...', { email, username });
            
            // Check if Firebase is properly initialized
            if (!this.auth || !this.db) {
                console.error('Firebase not properly initialized:', { 
                    auth: !!this.auth, 
                    db: !!this.db 
                });
                throw new Error('Firebase initialization error');
            }

            // Create auth user first
            console.log('Creating auth user...');
            let userCredential;
            try {
                userCredential = await this.auth.createUserWithEmailAndPassword(email, password);
                console.log('User credential created:', userCredential);
            } catch (authError) {
                console.error('Auth creation error:', {
                    code: authError.code,
                    message: authError.message
                });
                throw authError;
            }

            if (!userCredential || !userCredential.user) {
                console.error('No user credential created');
                throw new Error('Failed to create user credential');
            }

            const user = userCredential.user;
            console.log('Auth user created:', user.uid);

            // Now check username uniqueness
            try {
                const usernameQuery = await this.db.collection('users')
                    .where('username', '==', username)
                    .get();
                
                if (!usernameQuery.empty) {
                    // Delete the auth user since username is taken
                    await user.delete();
                    throw { code: 'username-taken', message: 'This username is already taken' };
                }
            } catch (dbError) {
                if (dbError.code === 'username-taken') {
                    throw dbError;
                }
                console.error('Error during username check:', dbError);
                // Delete the auth user if username check fails
                await user.delete();
                throw dbError;
            }

            // Create user document in Firestore
            const userData = {
                username: username,
                email: email,
                createdAt: firebase.firestore.FieldValue.serverTimestamp(),
                lastLogin: firebase.firestore.FieldValue.serverTimestamp(),
                stats: {
                    gamesPlayed: 0,
                    highScore: 0,
                    currentStreak: 0,
                    bestStreak: 0,
                    categoryStats: {}
                },
                gameHistory: []
            };

            try {
                await this.db.collection('users').doc(user.uid).set(userData);
                console.log('User document created successfully');
            } catch (firestoreError) {
                console.error('Firestore document creation error:', firestoreError);
                // If Firestore fails, delete the auth user
                await user.delete().catch(deleteError => {
                    console.error('Failed to delete auth user after Firestore error:', deleteError);
                });
                throw firestoreError;
            }

            this.currentUser = user;
            this.userData = userData;
            this.updateUI();
            return true;
        } catch (error) {
            console.error('Detailed signup error:', {
                code: error.code,
                message: error.message,
                fullError: error
            });
            throw error;
        }
    }

    async login(identifier, password) {
        try {
            console.log('Starting login process with identifier:', identifier);
            let email = identifier;
            
            // If identifier doesn't look like an email, treat it as a username
            if (!identifier.includes('@')) {
                console.log('Identifier appears to be a username, looking up email...');
                try {
                    // Query Firestore to get the email for this username
                    const usersRef = this.db.collection('users');
                    const querySnapshot = await usersRef
                        .where('username', '==', identifier.toLowerCase().trim())
                        .get();
                    
                    if (querySnapshot.empty) {
                        console.log('No user found with username:', identifier);
                        throw new Error('Invalid username or password.');
                    }
                    
                    email = querySnapshot.docs[0].data().email;
                    console.log('Found email for username:', email);
                } catch (error) {
                    console.error('Error during username lookup:', error);
                    throw new Error('Invalid username or password.');
                }
            }
            
            // Now login with email
            console.log('Attempting login with email:', email);
            const userCredential = await this.auth.signInWithEmailAndPassword(email, password);
            console.log('Login successful, user:', userCredential.user.uid);
            
            this.currentUser = userCredential.user;
            
            // Update last login time
            if (this.currentUser) {
                await this.db.collection('users').doc(this.currentUser.uid).update({
                    lastLogin: firebase.firestore.FieldValue.serverTimestamp()
                }).catch(error => {
                    console.warn('Failed to update last login time:', error);
                });
                
                // Load user data
                await this.loadUserData();
            }
            
            return true;
        } catch (error) {
            console.error('Login error:', error);
            
            // Handle specific error cases
            if (error.code === 'auth/wrong-password' || 
                error.code === 'auth/user-not-found' ||
                error.code === 'auth/invalid-login-credentials') {
                throw new Error('Invalid username/email or password.');
            } else if (error.code === 'auth/too-many-requests') {
                throw new Error('Too many failed attempts. Please try again later.');
            } else if (error.code === 'auth/invalid-email') {
                throw new Error('Invalid email format.');
            }
            
            // For any other errors
            throw new Error(error.message || 'Error during login. Please try again.');
        }
    }

    async logout() {
        try {
            // Handle logout
            await this.auth.signOut();
            this.currentUser = null;
            this.userData = null;
            
            // Reset UI elements
            const usernameDisplay = document.getElementById('username-display');
            if (usernameDisplay) {
                usernameDisplay.textContent = 'Guest';
            }

            // Dispatch resetGame event with forceReset flag
            const resetEvent = new CustomEvent('resetGame', { 
                detail: { 
                    forceReset: true,
                    reinitializeTiles: true  // Add flag to reinitialize tiles
                } 
            });
            document.dispatchEvent(resetEvent);
            
            return true;
        } catch (error) {
            console.error('Logout error:', error);
            throw error;
        }
    }
    async saveGameResult(category, score, guesses) {
        if (!this.currentUser) return;

        const gameResult = {
            category,
            score,
            guesses,
            date: new Date().toISOString()
        };

        const userRef = this.db.collection('users').doc(this.currentUser.uid);
        
        try {
            // First get the current user data
            const userDoc = await userRef.get();
            if (!userDoc.exists) {
                console.error('User document does not exist');
                return;
            }
            const currentData = userDoc.data();
            
            // Step 1: Update basic stats
            await userRef.update({
                'stats.gamesPlayed': firebase.firestore.FieldValue.increment(1),
                'stats.highScore': Math.max(currentData.stats?.highScore || 0, score),
                'lastPlayedDate': new Date().toLocaleDateString()
            });

            // Step 2: Update category stats
            const categoryUpdate = {};
            if (!currentData.stats?.categoryStats) {
                categoryUpdate['stats.categoryStats'] = {};
            }
            categoryUpdate[`stats.categoryStats.${category}.gamesPlayed`] = firebase.firestore.FieldValue.increment(1);
            categoryUpdate[`stats.categoryStats.${category}.highScore`] = Math.max(
                currentData.stats?.categoryStats?.[category]?.highScore || 0,
                score
            );
            await userRef.update(categoryUpdate);

            // Step 3: Update streak
            let newStreak = 1;
            if (currentData.lastPlayedDate) {
                const lastPlayed = new Date(currentData.lastPlayedDate);
                const currentDate = new Date();
                lastPlayed.setHours(0, 0, 0, 0);
                currentDate.setHours(0, 0, 0, 0);
                const diffDays = Math.floor((currentDate - lastPlayed) / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    newStreak = (currentData.stats?.currentStreak || 0) + 1;
                } else if (diffDays === 0) {
                    newStreak = currentData.stats?.currentStreak || 1;
                }
            }
            const newBestStreak = Math.max(currentData.stats?.bestStreak || 0, newStreak);
            
            await userRef.update({
                'stats.currentStreak': newStreak,
                'stats.bestStreak': newBestStreak
            });

            // Step 4: Update game history
            await userRef.update({
                'gameHistory': firebase.firestore.FieldValue.arrayUnion(gameResult)
            });

            // Finally, reload user data
            const updatedDoc = await userRef.get();
            this.userData = updatedDoc.data();
            this.updateUI();

        } catch (error) {
            console.error('Error saving game result:', {
                error,
                errorCode: error.code,
                errorMessage: error.message,
                category,
                score,
                userId: this.currentUser.uid
            });
            throw error;
        }
    }

    updateUI() {
        // Get UI elements
        const usernameDisplay = document.getElementById('username-display');
        const profileToggle = document.getElementById('profile-toggle');
        const profileUsername = document.getElementById('profile-username');
        
        // Default values for guest/logged out state
        let displayName = 'Guest';
        let toggleHTML = `<i class="fas fa-user"></i> Login`;

        // Update if user is logged in and we have user data
        if (this.currentUser && this.userData) {
            displayName = this.userData.username || this.currentUser.email.split('@')[0];
            toggleHTML = `<i class="fas fa-user"></i> ${displayName}`;
            
            // Update profile username
            if (profileUsername) {
                profileUsername.textContent = displayName;
            }
            
            // Update profile stats if they exist
            this.updateProfileStats();
        }

        // Safely update UI elements
        if (usernameDisplay) usernameDisplay.textContent = displayName;
        if (profileToggle) profileToggle.innerHTML = toggleHTML;
    }

    updateProfileStats() {
        if (!this.userData || !this.userData.stats) return;

        const stats = this.userData.stats;
        
        // Update games played
        const gamesPlayedElement = document.getElementById('games-played');
        if (gamesPlayedElement) {
            gamesPlayedElement.textContent = stats.gamesPlayed || 0;
        }

        // Update high score and its category
        const highScoreElement = document.getElementById('high-score');
        const highScoreCategoryElement = document.getElementById('high-score-category');
        
        if (highScoreElement) {
            highScoreElement.textContent = stats.highScore || 0;
        }

        // Find category with highest score
        if (highScoreCategoryElement && stats.categoryStats) {
            let highestScoreCategory = '';
            let highestScore = 0;
            
            Object.entries(stats.categoryStats).forEach(([category, catStats]) => {
                if (catStats.highScore > highestScore) {
                    highestScore = catStats.highScore;
                    highestScoreCategory = category;
                }
            });

            if (highestScoreCategory) {
                // Map category keys to full names
                const categoryNames = {
                    'area': 'Top 100 Countries by Area',
                    'population': 'Top 100 Countries by Population',
                    'gdp': 'Top 100 Countries by GDP',
                    // Add more categories as needed
                };

                const fullCategoryName = categoryNames[highestScoreCategory] || highestScoreCategory;
                highScoreCategoryElement.textContent = `${fullCategoryName}`;
            }
        }

        // Update streaks
        const currentStreakElement = document.getElementById('current-streak');
        const bestStreakElement = document.getElementById('best-streak');
        
        if (currentStreakElement) {
            currentStreakElement.textContent = stats.currentStreak || 0;
        }
        if (bestStreakElement) {
            bestStreakElement.textContent = stats.bestStreak || 0;
        }
    }

    async updateStreak() {
        if (!this.currentUser) return;

        const userRef = this.db.collection('users').doc(this.currentUser.uid);
        await this.db.runTransaction(async (transaction) => {
            const userDoc = await transaction.get(userRef);
            const userData = userDoc.data();
            
            const today = new Date().toLocaleDateString();
            
            if (!userData.lastPlayedDate) {
                userData.lastPlayedDate = today;
                userData.currentStreak = 1;
                userData.bestStreak = 1;
            } else {
                const lastPlayed = new Date(userData.lastPlayedDate);
                const currentDate = new Date();
                const diffTime = Math.abs(currentDate - lastPlayed);
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    userData.currentStreak++;
                    userData.bestStreak = Math.max(userData.currentStreak, userData.bestStreak);
                } else if (diffDays > 1) {
                    userData.currentStreak = 1;
                }
            }

            userData.lastPlayedDate = today;
            transaction.update(userRef, userData);
        });

        await this.loadUserData();
    }

    playAsGuest() {
        this.isGuest = true;
        this.currentUser = null;
        this.updateUI();
    }

    async checkUserData() {
        if (!this.currentUser) {
            console.log('No user logged in');
            return;
        }
        
        try {
            const userDoc = await this.db.collection('users').doc(this.currentUser.uid).get();
            if (userDoc.exists) {
                console.log('User data:', userDoc.data());
            } else {
                console.log('No user document found');
            }
        } catch (error) {
            console.error('Error fetching user data:', error);
        }
    }

    async deleteAccount(password) {
        if (!this.currentUser) {
            throw new Error('No user logged in');
        }

        try {
            // Re-authenticate user before deletion
            const credential = firebase.auth.EmailAuthProvider.credential(
                this.currentUser.email,
                password
            );
            await this.currentUser.reauthenticateWithCredential(credential);

            // First delete the user document from Firestore
            await this.db.collection('users').doc(this.currentUser.uid).delete();

            // Then delete the user authentication account
            await this.currentUser.delete();

            // Clear local data
            this.currentUser = null;
            this.userData = null;

            // Update UI
            const usernameDisplay = document.getElementById('username-display');
            if (usernameDisplay) {
                usernameDisplay.textContent = 'Guest';
            }

            // Hide profile modal
            const profileModal = document.getElementById('profile-modal');
            if (profileModal) {
                profileModal.classList.add('hidden');
            }

            // Remove overlay
            const overlay = document.querySelector('.overlay');
            if (overlay) overlay.remove();

            return true;
        } catch (error) {
            console.error('Delete account error:', error);
            throw error;
        }
    }

    async checkAndUpdateStreak() {
        if (!this.currentUser || !this.userData?.lastPlayedDate) return;

        const lastPlayed = new Date(this.userData.lastPlayedDate);
        const currentDate = new Date();
        
        // Reset time part to compare just the dates
        lastPlayed.setHours(0, 0, 0, 0);
        currentDate.setHours(0, 0, 0, 0);
        
        const diffTime = currentDate - lastPlayed;
        const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

        // If more than 1 day has passed, reset streak to 0
        if (diffDays > 1) {
            const userRef = this.db.collection('users').doc(this.currentUser.uid);
            await userRef.update({
                'stats.currentStreak': 0
            });
            
            this.userData.stats.currentStreak = 0;
            this.updateUI();
        }
    }
}

// Initialize after DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.userManager = new FirebaseUserManager();
});

