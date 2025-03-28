// Use the categories data from the external file
const gameCategories = window.gameData;

// Global variables
let currentCategory = 'area';
let currentScore = 0;
let chancesLeft = 5;
let guessedCountries = [];

// Global DOM element references
let guessInput, submitButton, chanceSpan, scoreSpan, guessesList;
let gameOverDiv, finalScoreSpan, playAgainButton, tilesWrapper;
let sidePanel, categoriesToggle, categoriesList, categorySearch;
let profileToggle, loginModal, profileModal;

let selectedCategoryIndex = -1;

// Global variables for modal event listeners
let tutorialEscapeListener;
let profileEscapeListener;
let loginEscapeListener;

// Initialize DOM elements
function initializeDOMElements() {
    // Get DOM element references
    guessInput = document.getElementById('guess-input');
    submitButton = document.getElementById('submit-guess');
    chanceSpan = document.getElementById('chances');
    scoreSpan = document.getElementById('score');
    guessesList = document.getElementById('guesses-list');
    gameOverDiv = document.getElementById('game-over');
    finalScoreSpan = document.getElementById('final-score');
    playAgainButton = document.getElementById('play-again');
    tilesWrapper = document.querySelector('.tiles-wrapper');
    sidePanel = document.querySelector('.side-panel');
    categoriesToggle = document.getElementById('categories-toggle');
    categoriesList = document.querySelector('.categories-list');
    categorySearch = document.getElementById('category-search');
    profileToggle = document.getElementById('profile-toggle');
    loginModal = document.getElementById('login-modal');
    profileModal = document.getElementById('profile-modal');

    // Initialize game elements after DOM elements are available
    if (!tilesWrapper) {
        console.error('Tiles wrapper not found');
        return;
    }
    
    // Initialize tiles first
    initializeTiles();
    
    // Then initialize categories
    initializeCategoriesList();
    
    // Add event listeners
    submitButton?.addEventListener('click', () => {
        const guess = guessInput.value.trim();
        if (!guess) return;
        
        const result = checkGuess(guess);
        updateUI(guess, result);
        guessInput.value = '';
    });

    guessInput?.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            submitButton?.click();
        }
    });

    // Tutorial modal events
    const tutorialBtn = document.getElementById('tutorial-btn');
    tutorialBtn?.addEventListener('click', () => {
        const tutorialModal = document.getElementById('tutorial-modal');
        if (!tutorialModal) return;
        
        // If tutorial modal is already visible, just close it
        if (!tutorialModal.classList.contains('hidden')) {
            closeTutorialModal();
            return;
        }
        
        // Close all other modals before showing tutorial
        closeAllModals();
        
        // Show tutorial modal
        const overlay = document.createElement('div');
        overlay.className = 'overlay active';
        document.body.appendChild(overlay);
        tutorialModal.classList.remove('hidden');
        tutorialModal.scrollTop = 0;

        // Set up event listeners
        overlay.addEventListener('click', closeTutorialModal);
        
        tutorialEscapeListener = (e) => {
            if (e.key === 'Escape') {
                closeTutorialModal();
            }
        };
        document.addEventListener('keydown', tutorialEscapeListener);
    });

    const closeTutorialBtn = document.getElementById('close-tutorial');
    closeTutorialBtn?.addEventListener('click', closeTutorialModal);

    // Side panel events
    categoriesToggle?.addEventListener('click', toggleSidePanel);
    document.querySelector('.close-side-panel')?.addEventListener('click', toggleSidePanel);
    
    // Category search
    categorySearch?.addEventListener('input', filterCategories);
    categorySearch?.addEventListener('keydown', handleCategoryKeyboard);
}

// Wait for DOM to be ready before initializing
document.addEventListener('DOMContentLoaded', () => {
    // Initialize game data first
    if (!window.gameData) {
        console.error('Game data not found');
        return;
    }
    
    // Then initialize DOM elements
    initializeDOMElements();
});

function initializeTiles() {
    const tilesWrapper = document.querySelector('.tiles-wrapper');
    if (!tilesWrapper) {
        console.error('Tiles wrapper not found');
        return;
    }
    
    tilesWrapper.innerHTML = '';
    tilesWrapper.style.transform = 'translateY(0)'; // Reset scroll position
    
    for (let i = 1; i <= 100; i++) {
        const tile = document.createElement('div');
        tile.className = 'country-tile';
        tile.dataset.position = i;
        tile.innerHTML = `
            <span class="position">#${i}</span>
            <span class="name">🔒</span>
            <span class="area">—</span>
        `;
        tilesWrapper.appendChild(tile);
    }
}

function checkGuess(guess) {
    const normalizedGuess = guess.trim().toLowerCase()
        .normalize('NFKD') // Normalize special characters
        .replace(/[\u0300-\u036f]/g, '') // Remove diacritics
        .replace(/['"]/g, '') // Remove quotes
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, ''); // Remove punctuation
    
    const categoryData = gameCategories[currentCategory].data.slice(0, 100); // Only check first 100 items
    
    const countryIndex = categoryData.findIndex(
        item => item.name.toLowerCase()
            .normalize('NFKD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/['"]/g, '')
            .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '') === normalizedGuess
    );

    if (countryIndex === -1) {
        return { score: 0, message: currentCategory === 'spotify' ? 
            "This song is not in the top 100!" : 
            "This country is not in the top 100!" 
        };
    }

    const position = countryIndex + 1;
    const score = position;
    
    return {
        score,
        position,
        message: `Position: ${position}! ${score} points!`
    };
}

function updateUI(guess, result) {
    // Check for duplicate guess first
    if (guessedCountries.includes(guess.toLowerCase())) {
        showPopup('duplicate');
        return;
    }

    // Decrease chances and update UI for both correct and incorrect guesses
    chancesLeft--;
    chanceSpan.textContent = chancesLeft;

    if (result.position) {
        // Correct guess
        revealTile(result.position);
        guessedCountries.push(guess.toLowerCase());
        
        const listItem = document.createElement('li');
        const progressBar = document.createElement('div');
        progressBar.className = 'guess-progress';
        progressBar.style.background = getColorForScore(result.score);
        
        listItem.innerHTML = `
            <span>${guess}</span>
            <span>${result.score} points</span>
        `;
        
        listItem.appendChild(progressBar);
        guessesList.prepend(listItem);
        
        setTimeout(() => {
            progressBar.style.width = `${result.score}%`;
        }, 50);

        // Update score
        const oldScore = currentScore;
        currentScore += result.score;
        animateScore(oldScore, currentScore);
    } else {
        // Incorrect guess - add to list with 0 points
        const listItem = document.createElement('li');
        const progressBar = document.createElement('div');
        progressBar.className = 'guess-progress';
        progressBar.style.background = getColorForScore(0);
        
        listItem.innerHTML = `
            <span>${guess}</span>
            <span>0 points</span>
        `;
        
        listItem.appendChild(progressBar);
        guessesList.prepend(listItem);
        
        // Show the "not in top 100" popup
        showPopup('notTop100');
    }

    // Check if game is over
    if (chancesLeft === 0) {
        // Disable input during animations
        guessInput.disabled = true;
        submitButton.disabled = true;

        // Wait for all animations to complete before showing game over
        const animationDelay = result.position ? 2000 : 1000; // 2s for correct guesses to show tile reveal and score animations
        setTimeout(() => {
            showGameOver();
        }, animationDelay);
    }
}

function formatValue(value, unit) {
    if (unit.includes('billion')) {
        return value.toFixed(3) + ' billion';
    } else if (unit.includes('million')) {
        return value.toFixed(1) + ' million';
    }
    return value.toLocaleString() + ' ' + unit;
}

function revealTile(position) {
    const categoryData = gameCategories[currentCategory].data;
    const country = categoryData[position - 1];
    const tile = tilesWrapper?.children[position - 1];
    
    // Guard clause - if tile doesn't exist, log error and return
    if (!tile) {
        console.error(`Tile at position ${position} not found`);
        return;
    }
    
    tile.className = 'country-tile revealed success-animation';
    
    const value = formatValue(country.value, gameCategories[currentCategory].unit);
    
    tile.innerHTML = `
        <span class="position">#${position}</span>
        <span class="name">${country.name}</span>
        <span class="area">${value}</span>
    `;
    
    setTimeout(() => {
        tile.classList.remove('success-animation');
    }, 1500);
    
    const tileHeight = 60;
    const containerHeight = 300;
    const scrollPosition = (position - 1) * tileHeight;
    const maxScroll = (100 * tileHeight) - containerHeight;
    
    const finalScroll = Math.min(
        Math.max(0, scrollPosition - (containerHeight / 2) + (tileHeight / 2)),
        maxScroll
    );
    
    if (tilesWrapper) {
        tilesWrapper.style.transform = `translateY(-${finalScroll}px)`;
    }
}

function getColorForScore(score) {
    if (score === 0) {
        return 'rgba(220, 0, 0, 0.8)'; // Increased opacity for wrong guesses
    }
    
    // Adjust color scale with increased opacity and adjusted brightness
    if (score <= 33) {
        // Red range - darker and more visible
        const brightness = 25 + (score * 1);
        return `hsla(0, 100%, ${brightness}%, 0.8)`;
    } else if (score <= 66) {
        // Red through yellow - more saturated
        const hue = (score - 33) * (60 / 33); // 0 to 60 (red to yellow)
        return `hsla(${hue}, 100%, 45%, 0.8)`;
    } else {
        // Yellow to green - darker and more saturated
        const hue = 60 + ((score - 66) * (60 / 34)); // 60 to 120 (yellow to green)
        return `hsla(${hue}, 100%, 45%, 0.8)`;
    }
}

function showPopup(type) {
    const popupId = type === 'invalid' ? 'invalid-popup' : 
                    type === 'notTop100' ? 'popup' :
                    'duplicate-popup';
    
    const popup = document.getElementById(popupId);
    popup.classList.remove('hidden');
    
    // Remove the popup after animation completes
    setTimeout(() => {
        popup.classList.add('hidden');
    }, 2000);
}

function animateScore(startScore, endScore) {
    const duration = 1000; // 1 second animation
    const steps = 60; // 60 steps for smooth animation
    const increment = (endScore - startScore) / steps;
    let currentStep = 0;
    
    const animation = setInterval(() => {
        currentStep++;
        const currentValue = Math.round(startScore + (increment * currentStep));
        scoreSpan.textContent = currentValue;
        
        if (currentStep >= steps) {
            clearInterval(animation);
            scoreSpan.textContent = endScore; // Ensure we end on the exact number
        }
    }, duration / steps);
}

async function showGameOver() {
    // Create game over div if it doesn't exist
    if (!gameOverDiv) {
        gameOverDiv = document.createElement('div');
        gameOverDiv.id = 'game-over';
        document.body.appendChild(gameOverDiv);
    }

    // Set game over content immediately but keep it hidden
    gameOverDiv.innerHTML = `
        <div class="game-over-header">
            <h2>Game Over!</h2>
            <button class="close-game-over-btn" aria-label="Close game over screen">&times;</button>
        </div>
        <div class="final-score-container">
            <div class="final-score-label">FINAL SCORE</div>
            <div class="final-score-value">${currentScore}</div>
        </div>
        <p class="play-again-text">Want to try again?</p>
        <div class="game-over-buttons">
            <button class="game-over-btn show-answers-btn">Show Answers</button>
            <button class="game-over-btn play-again-btn">Yes, Play Again</button>
            <button class="game-over-btn no-play-btn">No, Thanks</button>
        </div>
    `;

    // Create overlay but keep it hidden initially
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Add a small delay to ensure all animations are complete
    await new Promise(resolve => setTimeout(resolve, 500));

    // Show overlay and game over screen
    overlay.classList.add('active');
    gameOverDiv.classList.remove('hidden');

    // Save game results if user is logged in and userManager exists
    if (window.userManager?.currentUser) {
        try {
            // Prepare game results
            const gameResults = [];
            const guessList = guessesList?.children || [];
            Array.from(guessList).forEach(li => {
                const nameSpan = li.querySelector('span:first-child');
                const scoreSpan = li.querySelector('span:last-child');
                if (nameSpan && scoreSpan) {
                    gameResults.push({
                        name: nameSpan.textContent,
                        score: parseInt(scoreSpan.textContent.split(' ')[0]) || 0
                    });
                }
            });

            // Run these operations in parallel but handle errors separately
            await Promise.allSettled([
                window.userManager.updateStreak().catch(error => {
                    console.error('Error updating streak:', error);
                }),
                window.userManager.saveGameResult(currentCategory, currentScore, gameResults).catch(error => {
                    console.error('Error saving game result:', error);
                })
            ]);
        } catch (error) {
            console.error('Error in game over operations:', error);
            // Continue with the game over screen even if saving fails
        }
    }

    // Function to handle closing the game over screen
    const closeGameOver = () => {
        // Remove all overlays
        document.querySelectorAll('.overlay').forEach(overlay => {
            if (overlay && overlay.parentNode) {
                overlay.remove();
            }
        });
        
        if (gameOverDiv) {
            gameOverDiv.classList.add('hidden');
        }
        // Create floating play again button
        createFloatingPlayAgainButton();
    };

    // Add keyboard support
    const handleKeydown = (e) => {
        if (e.key === 'Escape' && !gameOverDiv.classList.contains('hidden')) {
            closeGameOver();
            document.removeEventListener('keydown', handleKeydown);
        }
    };
    document.addEventListener('keydown', handleKeydown);

    // Add event listeners for buttons
    const closeBtn = document.querySelector('.close-game-over-btn');
    const showAnswersBtn = document.querySelector('.show-answers-btn');
    const playAgainBtn = document.querySelector('.play-again-btn');
    const noPlayBtn = document.querySelector('.no-play-btn');

    if (closeBtn) {
        closeBtn.addEventListener('click', () => {
            closeGameOver();
            document.removeEventListener('keydown', handleKeydown);
        });
    }
    
    if (showAnswersBtn) {
        showAnswersBtn.addEventListener('click', () => showAllAnswers(true));
    }
    
    if (playAgainBtn) {
        playAgainBtn.addEventListener('click', () => {
            if (overlay && overlay.parentNode) {
                overlay.remove();
            }
            if (gameOverDiv) {
                gameOverDiv.classList.add('hidden');
            }
            // Remove floating play again button if it exists
            const floatingBtn = document.getElementById('floating-play-again');
            if (floatingBtn) {
                floatingBtn.remove();
            }
            resetGame();
        });
    }

    if (noPlayBtn) {
        noPlayBtn.addEventListener('click', closeGameOver);
    }
}

function createFloatingPlayAgainButton() {
    // Remove any existing floating buttons
    const existingContainer = document.querySelector('.floating-buttons-container');
    if (existingContainer) {
        existingContainer.remove();
    }

    // Create container for floating buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'floating-buttons-container';
    
    // Create show answers button
    const showAnswersBtn = document.createElement('button');
    showAnswersBtn.id = 'floating-show-answers';
    showAnswersBtn.className = 'floating-btn show-answers-btn';
    showAnswersBtn.innerHTML = '<i class="fas fa-list"></i> Show Answers';
    
    // Create play again button
    const playAgainBtn = document.createElement('button');
    playAgainBtn.id = 'floating-play-again';
    playAgainBtn.className = 'floating-btn play-again-btn';
    playAgainBtn.innerHTML = '<i class="fas fa-redo"></i> Play Again';
    
    // Add click events
    showAnswersBtn.addEventListener('click', () => {
        // Remove the floating buttons before showing answers
        buttonsContainer.remove();
        showAllAnswers(false); // Explicitly pass false to indicate not from game over
    });
    
    playAgainBtn.addEventListener('click', () => {
        buttonsContainer.remove();
        resetGame();
    });

    // Add buttons to container
    buttonsContainer.appendChild(showAnswersBtn);
    buttonsContainer.appendChild(playAgainBtn);

    // Add container to body
    document.body.appendChild(buttonsContainer);
}

function showAllAnswers(fromGameOver = false) {
    // Hide game over screen
    if (gameOverDiv) {
        gameOverDiv.classList.add('hidden');
    }
    
    // Remove any existing overlays first
    document.querySelectorAll('.overlay').forEach(overlay => {
        if (overlay && overlay.parentNode) {
            overlay.remove();
        }
    });
    
    // Create answers modal
    const answersModal = document.createElement('div');
    answersModal.className = 'answers-modal';
    
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay active';
    
    // Get current category data (limit to top 100 and reverse for descending order)
    const categoryData = gameCategories[currentCategory]?.data?.slice(0, 100).reverse() || [];
    const categoryUnit = gameCategories[currentCategory]?.unit || '';
    const categoryTitle = gameCategories[currentCategory]?.title || 'Results';
    
    answersModal.innerHTML = `
        <div class="answers-content">
            <h2>${categoryTitle}</h2>
            <div class="answers-tiles-container">
                ${categoryData.map((item, index) => {
                    const position = 100 - index; // This will go from 100 down to 1
                    const formattedValue = formatValue(item.value, categoryUnit);
                    return `
                        <div class="answer-tile">
                            <span class="position">#${position}</span>
                            <span class="name">${item.name}</span>
                            <span class="area">${formattedValue}</span>
                        </div>
                    `;
                }).join('')}
            </div>
            <button id="close-answers" class="close-answers-btn">Close</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(answersModal);
    
    // Function to close answers modal
    const closeAnswersModal = () => {
        // Remove all overlays first
        document.querySelectorAll('.overlay').forEach(overlay => {
            if (overlay && overlay.parentNode) {
                overlay.remove();
            }
        });

        if (answersModal && answersModal.parentNode) {
            answersModal.remove();
        }

        if (fromGameOver && gameOverDiv) {
            // If we came from game over, show it again
            gameOverDiv.classList.remove('hidden');
            const gameOverOverlay = document.createElement('div');
            gameOverOverlay.className = 'overlay active';
            document.body.appendChild(gameOverOverlay);
        } else {
            // If we came from floating buttons, recreate them
            createFloatingPlayAgainButton();
        }
    };
    
    // Add event listeners for closing
    const closeButton = document.getElementById('close-answers');
    if (closeButton) {
        closeButton.addEventListener('click', closeAnswersModal);
    }
    
    overlay.addEventListener('click', closeAnswersModal);
    
    // Add escape key listener
    const escapeListener = (e) => {
        if (e.key === 'Escape') {
            closeAnswersModal();
            document.removeEventListener('keydown', escapeListener);
        }
    };
    document.addEventListener('keydown', escapeListener);
}

function resetGame() {
    // Reset game state
    chancesLeft = 5;
    currentScore = 0;
    guessedCountries = [];
    
    // Reset UI
    chanceSpan.textContent = chancesLeft;
    scoreSpan.textContent = currentScore;
    guessesList.innerHTML = '';
    guessInput.value = '';
    guessInput.disabled = false;
    submitButton.disabled = false;

    // Reset tiles
    initializeTiles();
}

function isGameInProgress() {
    return chancesLeft < 5 || currentScore > 0 || guessedCountries.length > 0;
}

function showConfirmationDialog(callback) {
    const overlay = document.createElement('div');
    overlay.className = 'overlay active';
    
    const confirmDialog = document.createElement('div');
    confirmDialog.className = 'confirm-dialog';
    confirmDialog.innerHTML = `
        <h3>End Current Game?</h3>
        <p>Switching categories will end your current game. Are you sure?</p>
        <div class="confirm-buttons">
            <button class="confirm-btn cancel">Cancel</button>
            <button class="confirm-btn confirm">Switch Category</button>
        </div>
    `;
    
    document.body.appendChild(overlay);
    document.body.appendChild(confirmDialog);
    
    const closeDialog = () => {
        overlay.remove();
        confirmDialog.remove();
    };
    
    confirmDialog.querySelector('.cancel').addEventListener('click', () => {
        closeDialog();
        callback(false);
    });
    
    confirmDialog.querySelector('.confirm').addEventListener('click', () => {
        closeDialog();
        callback(true);
    });
    
    // Close on overlay click
    overlay.addEventListener('click', () => {
        closeDialog();
        callback(false);
    });
    
    // Close on Escape key
    const escapeListener = (e) => {
        if (e.key === 'Escape') {
            closeDialog();
            callback(false);
            document.removeEventListener('keydown', escapeListener);
        }
    };
    document.addEventListener('keydown', escapeListener);
}

// Function to close all active modals
function closeAllModals() {
    // Close tutorial modal if it's open
    const tutorialModal = document.getElementById('tutorial-modal');
    if (tutorialModal && !tutorialModal.classList.contains('hidden')) {
        closeTutorialModal();
    }

    // Close profile modal if it's open
    const profileModal = document.getElementById('profile-modal');
    if (profileModal && !profileModal.classList.contains('hidden')) {
        closeProfileModal();
    }

    // Close login modal if it's open
    const loginModal = document.getElementById('login-modal');
    if (loginModal && !loginModal.classList.contains('hidden')) {
        closeLoginModal();
    }

    // Close signup modal if it's open
    const signupModal = document.getElementById('signup-modal');
    if (signupModal && !signupModal.classList.contains('hidden')) {
        if (typeof closeSignupModal === 'function') {
            closeSignupModal();
        } else {
            signupModal.classList.add('hidden');
        }
    }

    // Close categories panel if it's open
    const sidePanel = document.querySelector('.side-panel');
    if (sidePanel && sidePanel.classList.contains('active')) {
        sidePanel.classList.remove('active');
        document.querySelector('.game-container').classList.remove('side-panel-active');
    }

    // Remove any existing overlays
    const existingOverlays = document.querySelectorAll('.overlay');
    existingOverlays.forEach(overlay => overlay.remove());
}

function toggleSidePanel() {
    // If the side panel is already active, just close it
    const sidePanel = document.querySelector('.side-panel');
    if (sidePanel.classList.contains('active')) {
        sidePanel.classList.remove('active');
        document.querySelector('.game-container').classList.remove('side-panel-active');
        return;
    }

    // Close all other modals before opening categories
    closeAllModals();

    // Now open the side panel
    sidePanel.classList.add('active');
    document.querySelector('.game-container').classList.add('side-panel-active');
}

function initializeCategoriesList() {
    const categoriesContainer = document.getElementById('categories-container');
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = '';
    const freeCategories = ['area', 'population'];
    const isGuest = !window.userManager?.currentUser;

    Object.entries(gameCategories).forEach(([key, category]) => {
        const item = createCategoryItem(key, category, !freeCategories.includes(key) && isGuest);
        item.setAttribute('tabindex', '0');

        item.addEventListener('click', () => {
            if (key !== currentCategory) {
                handleCategorySelection(key);
            }
        });

        categoriesContainer.appendChild(item);
    });
}

function createCategoryItem(categoryKey, category, isLocked = false) {
    const item = document.createElement('div');
    item.className = `category-item${isLocked ? ' locked' : ''}`;
    
    const info = document.createElement('div');
    info.className = 'info';
    
    const icon = document.createElement('div');
    icon.className = 'icon';
    
    // Set icon based on category
    let iconContent;
    switch(categoryKey) {
        case 'instagram':
            iconContent = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M7.8,2H16.2C19.4,2 22,4.6 22,7.8V16.2A5.8,5.8 0 0,1 16.2,22H7.8C4.6,22 2,19.4 2,16.2V7.8A5.8,5.8 0 0,1 7.8,2M7.6,4A3.6,3.6 0 0,0 4,7.6V16.4C4,18.39 5.61,20 7.6,20H16.4A3.6,3.6 0 0,0 20,16.4V7.6C20,5.61 18.39,4 16.4,4H7.6M17.25,5.5A1.25,1.25 0 0,1 18.5,6.75A1.25,1.25 0 0,1 17.25,8A1.25,1.25 0 0,1 16,6.75A1.25,1.25 0 0,1 17.25,5.5M12,7A5,5 0 0,1 17,12A5,5 0 0,1 12,17A5,5 0 0,1 7,12A5,5 0 0,1 12,7M12,9A3,3 0 0,0 9,12A3,3 0 0,0 12,15A3,3 0 0,0 15,12A3,3 0 0,0 12,9Z"/></svg>';
            break;
        case 'spotify':
            iconContent = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M17.9,10.9C14.7,9 9.35,8.8 6.3,9.75C5.8,9.9 5.3,9.6 5.15,9.15C5,8.65 5.3,8.15 5.75,8C9.3,6.95 15.15,7.15 18.85,9.35C19.3,9.6 19.45,10.2 19.2,10.65C18.95,11 18.35,11.15 17.9,10.9M17.8,13.7C17.55,14.05 17.1,14.2 16.75,13.95C14.05,12.3 9.95,11.8 6.8,12.8C6.4,12.9 5.95,12.7 5.85,12.3C5.75,11.9 5.95,11.45 6.35,11.35C10,10.25 14.5,10.8 17.6,12.7C17.9,12.85 18.05,13.35 17.8,13.7M16.6,16.45C16.4,16.75 16.05,16.85 15.75,16.65C13.4,15.2 10.45,14.9 6.95,15.7C6.6,15.8 6.3,15.55 6.2,15.25C6.1,14.9 6.35,14.6 6.65,14.5C10.45,13.65 13.75,14 16.35,15.6C16.7,15.75 16.75,16.15 16.6,16.45M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>';
            break;
        case 'population':
            iconContent = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,5.5A3.5,3.5 0 0,1 15.5,9A3.5,3.5 0 0,1 12,12.5A3.5,3.5 0 0,1 8.5,9A3.5,3.5 0 0,1 12,5.5M5,8C5.56,8 6.08,8.15 6.53,8.42C6.38,9.85 6.8,11.27 7.66,12.38C7.16,13.34 6.16,14 5,14A3,3 0 0,1 2,11A3,3 0 0,1 5,8M19,8A3,3 0 0,1 22,11A3,3 0 0,1 19,14C17.84,14 16.84,13.34 16.34,12.38C17.2,11.27 17.62,9.85 17.47,8.42C17.92,8.15 18.44,8 19,8M5.5,18.25C5.5,16.18 8.41,14.5 12,14.5C15.59,14.5 18.5,16.18 18.5,18.25V20H5.5V18.25M0,20V18.5C0,17.11 1.89,15.94 4.45,15.6C3.86,16.28 3.5,17.22 3.5,18.25V20H0M24,20H20.5V18.25C20.5,17.22 20.14,16.28 19.55,15.6C22.11,15.94 24,17.11 24,18.5V20Z"/></svg>';
            break;
        case 'area':
            iconContent = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M21 6H3c-1.1 0-2 .9-2 2v8c0 1.1.9 2 2 2h18c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2zm0 10H3V8h2v4h2V8h2v4h2V8h2v4h2V8h2v8z"/></svg>';
            break;
        case 'netflix':
            iconContent = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M5 2v20h2v-7l2-2v9h2V11l2-2v13h2V7l2-2v17h2V3h-2l-2 2V2H13L11 4V2H9L7 4V2z"/></svg>';
            break;
        default:
            iconContent = '<svg viewBox="0 0 24 24"><path fill="currentColor" d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z"/></svg>';
    }
    
    icon.innerHTML = iconContent;
    
    const title = document.createElement('h3');
    title.textContent = category.title;
    
    info.appendChild(icon);
    info.appendChild(title);
    
    if (isLocked) {
        const loginLabel = document.createElement('div');
        loginLabel.className = 'login-required';
        loginLabel.textContent = 'Login Required';
        info.appendChild(loginLabel);
    }
    
    item.appendChild(info);
    return item;
}

function filterCategories() {
    const searchTerm = categorySearch.value.toLowerCase().trim();
    const categoryItems = document.querySelectorAll('.category-item');
    const noResults = document.getElementById('no-results');

    // Reset selection when filter changes
    selectedCategoryIndex = -1;

    // Guard clause - if no-results element doesn't exist, return
    if (!noResults) {
        console.error('No results element not found');
        return;
    }

    let hasVisibleCategories = false;
    let visibleItems = [];

    categoryItems.forEach(item => {
        const categoryTitle = item.querySelector('h3');
        // Guard clause - if h3 doesn't exist, skip this item
        if (!categoryTitle) return;

        const categoryName = categoryTitle.textContent.toLowerCase();
        if (categoryName.includes(searchTerm)) {
            item.style.display = 'flex';
            hasVisibleCategories = true;
            visibleItems.push(item);
        } else {
            item.style.display = 'none';
        }
        
        // Remove any existing selection styling
        item.classList.remove('keyboard-selected');
    });

    // Show/hide no results message based on whether we found any matches
    if (searchTerm === '') {
        noResults.classList.add('hidden');
        categoryItems.forEach(item => item.style.display = 'flex');
    } else {
        noResults.classList.toggle('hidden', hasVisibleCategories);
    }
}

// Add keyboard navigation
function handleCategoryKeyboard(e) {
    const visibleItems = Array.from(document.querySelectorAll('.category-item'))
        .filter(item => item.style.display !== 'none');
    
    if (visibleItems.length === 0) return;

    // Remove current selection if exists
    if (selectedCategoryIndex >= 0 && selectedCategoryIndex < visibleItems.length) {
        visibleItems[selectedCategoryIndex].classList.remove('keyboard-selected');
    }

    switch (e.key) {
        case 'ArrowDown':
            e.preventDefault();
            // If no selection, select first item, otherwise move to next
            if (selectedCategoryIndex === -1) {
                selectedCategoryIndex = 0;
            } else {
                selectedCategoryIndex = selectedCategoryIndex < visibleItems.length - 1 ? 
                    selectedCategoryIndex + 1 : 0;
            }
            break;
        case 'ArrowUp':
            e.preventDefault();
            // If no selection, select last item, otherwise move to previous
            if (selectedCategoryIndex === -1) {
                selectedCategoryIndex = visibleItems.length - 1;
            } else {
                selectedCategoryIndex = selectedCategoryIndex > 0 ? 
                    selectedCategoryIndex - 1 : visibleItems.length - 1;
            }
            break;
        case 'Enter':
            if (selectedCategoryIndex >= 0 && selectedCategoryIndex < visibleItems.length) {
                e.preventDefault();
                const selectedItem = visibleItems[selectedCategoryIndex];
                selectedItem.click();
                // Clear the search and close the panel after selection
                categorySearch.value = '';
                filterCategories();
                return;
            } else if (visibleItems.length === 1) {
                // If there's only one visible item, select it even if not keyboard-selected
                e.preventDefault();
                visibleItems[0].click();
                categorySearch.value = '';
                filterCategories();
                return;
            }
            break;
        default:
            return;
    }

    // Apply new selection
    if (selectedCategoryIndex >= 0 && selectedCategoryIndex < visibleItems.length) {
        const selectedItem = visibleItems[selectedCategoryIndex];
        selectedItem.classList.add('keyboard-selected');
        selectedItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
}

function removeAllModals() {
    // Remove all modal-related elements
    document.querySelectorAll('.overlay, .confirm-modal, .confirm-content, .modal-header, .modal-footer, .confirm-dialog').forEach(element => {
        // If the element is still in the DOM, remove it
        if (element && element.parentNode) {
            element.parentNode.removeChild(element);
        }
    });
}

async function handleCategorySelection(category) {
    // Check if category is locked for guest users
    if (isGuestLockedCategory(category) && (!window.userManager?.currentUser)) {
        // First, remove any existing modals
        removeAllModals();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.style.zIndex = '1000'; // Ensure overlay is on top

        // Show login prompt
        const loginPrompt = document.createElement('div');
        loginPrompt.className = 'confirm-modal';
        loginPrompt.style.zIndex = '1001'; // Ensure modal is above overlay
        loginPrompt.innerHTML = `
            <div class="confirm-content">
                <div class="modal-header">
                    <div class="warning-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <h2>Login Required <span class="info-icon" style="display: inline-block; font-size: 16px; margin-left: 8px; cursor: pointer; color: #6b7280; position: relative; top: -2px;"><i class="fas fa-info-circle"></i></span></h2>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn cancel">
                        <i class="fas fa-times"></i>
                        Maybe Later
                    </button>
                    <button class="modal-btn confirm">
                        <i class="fas fa-sign-in-alt"></i>
                        Login / Sign Up (Free)
                    </button>
                </div>
            </div>
        `;

        // Add CSS styles for the tooltip only if they don't exist
        if (!document.getElementById('login-tooltip-styles')) {
            const style = document.createElement('style');
            style.id = 'login-tooltip-styles';
            style.textContent = `
                .modal-header {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    gap: 16px;
                    padding: 20px;
                    text-align: center;
                    position: relative;
                }

                .warning-icon {
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    width: 48px;
                    height: 48px;
                    background: #f3f4f6;
                    border-radius: 50%;
                    margin-bottom: 8px;
                }

                .warning-icon i {
                    font-size: 24px;
                    color: #374151;
                }

                .info-icon {
                    display: inline-block;
                    position: relative;
                    transition: color 0.15s ease;
                }

                .info-icon:hover {
                    color: #3b82f6;
                }

                .info-icon::after {
                    content: 'This category is available for registered users only. Create an account or log in to unlock all categories 🎮';
                    position: absolute;
                    left: calc(100% + 12px);
                    top: 50%;
                    transform: translateY(-50%);
                    background: #1a1a1a;
                    color: #fff;
                    padding: 8px 12px;
                    border-radius: 6px;
                    font-size: 11px !important;
                    width: max-content;
                    max-width: 200px;
                    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
                    z-index: 1002;
                    text-align: left;
                    line-height: 1.4;
                    font-weight: normal;
                    white-space: normal;
                    opacity: 0;
                    visibility: hidden;
                    pointer-events: none;
                    transition: all 0.2s ease;
                }

                .info-icon::before {
                    content: '';
                    position: absolute;
                    left: calc(100% + 8px);
                    top: 50%;
                    transform: translateY(-50%) rotate(45deg);
                    width: 8px;
                    height: 8px;
                    background: #1a1a1a;
                    opacity: 0;
                    visibility: hidden;
                    transition: all 0.2s ease;
                    z-index: 1002;
                }

                .info-icon:hover::after,
                .info-icon:hover::before {
                    opacity: 1;
                    visibility: visible;
                }

                .modal-footer {
                    display: flex;
                    gap: 12px;
                    padding: 16px;
                }

                .modal-btn {
                    display: flex;
                    align-items: center;
                    gap: 8px;
                    padding: 8px 16px;
                    border-radius: 6px;
                    border: none;
                    font-size: 0.95em;
                    cursor: pointer;
                    transition: all 0.2s ease;
                }

                .modal-btn.cancel {
                    background: #f3f4f6;
                    color: #374151;
                }

                .modal-btn.cancel:hover {
                    background: #e5e7eb;
                }

                .modal-btn.confirm {
                    background: #3b82f6;
                    color: white;
                }

                .modal-btn.confirm:hover {
                    background: #2563eb;
                }
            `;
            document.head.appendChild(style);
        }

        document.body.appendChild(overlay);
        document.body.appendChild(loginPrompt);

        // Add event listeners
        const cancelBtn = loginPrompt.querySelector('.cancel');
        const confirmBtn = loginPrompt.querySelector('.confirm');

        const closePrompt = () => {
            removeAllModals();
        };

        cancelBtn.addEventListener('click', closePrompt);
        overlay.addEventListener('click', closePrompt);

        confirmBtn.addEventListener('click', () => {
            closePrompt();
            // Show the login modal instead of profile modal
            const loginModal = document.getElementById('login-modal');
            if (loginModal) {
                loginModal.classList.remove('hidden');
                // Create a new overlay for the login modal
                const loginOverlay = document.createElement('div');
                loginOverlay.className = 'overlay active';
                document.body.appendChild(loginOverlay);
            }
        });

        // Don't close the panel since category didn't change
        return;
    }

    // If it's the same category and not a guest-locked category, no need to do anything
    if (currentCategory === category) {
        return;
    }

    // If a game is in progress, show custom confirmation dialog
    if (isGameInProgress() && currentCategory !== category) {
        // Remove any existing modals first
        removeAllModals();

        // Create overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay';
        overlay.style.zIndex = '1000';

        // Create confirmation modal
        const confirmModal = document.createElement('div');
        confirmModal.className = 'confirm-modal';
        confirmModal.style.zIndex = '1001';
        confirmModal.innerHTML = `
            <div class="confirm-content">
                <div class="modal-header">
                    <div class="warning-icon">
                        <i class="fas fa-exclamation-triangle"></i>
                    </div>
                    <h2>Switch Category?</h2>
                    <p>Starting a new category will reset your current game progress.</p>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn cancel">
                        <i class="fas fa-times"></i>
                        Continue Playing
                    </button>
                    <button class="modal-btn confirm">
                        <i class="fas fa-check"></i>
                        Switch Category
                    </button>
                </div>
            </div>
        `;

        document.body.appendChild(overlay);
        document.body.appendChild(confirmModal);

        // Create a promise to handle the user's choice
        const userChoice = new Promise((resolve) => {
            const cancelBtn = confirmModal.querySelector('.cancel');
            const confirmBtn = confirmModal.querySelector('.confirm');

            const closeModal = (result) => {
                removeAllModals();
                resolve(result);
            };

            cancelBtn.addEventListener('click', () => closeModal(false));
            confirmBtn.addEventListener('click', () => closeModal(true));
            overlay.addEventListener('click', () => closeModal(false));

            // Add keyboard support
            const handleKeydown = (e) => {
                if (e.key === 'Escape') {
                    closeModal(false);
                    document.removeEventListener('keydown', handleKeydown);
                }
            };
            document.addEventListener('keydown', handleKeydown);
        });

        // Wait for user's choice
        const shouldSwitch = await userChoice;
        if (!shouldSwitch) {
            return;
        }
    }

    // Switch to the selected category
    await switchCategory(category);

    // Close the side panel since the category actually changed
    const sidePanel = document.querySelector('.side-panel');
    if (sidePanel) {
        sidePanel.classList.remove('active');
        // Also remove the side panel active class from game container

        const gameContainer = document.querySelector('.game-container');
        if (gameContainer) {
            gameContainer.classList.remove('side-panel-active');
        }
    }
}

function isGuestLockedCategory(category) {
    const freeCategories = ['area', 'population'];
    return !freeCategories.includes(category);
}

function switchCategory(category) {
    currentCategory = category;
    document.getElementById('current-category').textContent = gameCategories[category].title;
    resetGame();
    initializeCategoriesList();
}

function getCategoryIcon(category) {
    const icons = {
        area: '<i class="fas fa-ruler-combined"></i>',
        population: '<i class="fas fa-users"></i>',
        instagram: '<i class="fab fa-instagram"></i>',
        spotify: '<i class="fab fa-spotify"></i>'
    };
    return icons[category] || '<i class="fas fa-globe"></i>';
}

function closeTutorialModal() {
    const tutorialModal = document.getElementById('tutorial-modal');
    if (tutorialModal) {
        tutorialModal.classList.add('hidden');
        tutorialModal.scrollTop = 0;
    }
    const overlay = document.querySelector('.overlay');
    if (overlay) overlay.remove();
    // Remove escape key listener
    if (tutorialEscapeListener) {
        document.removeEventListener('keydown', tutorialEscapeListener);
    }
}

// Close profile modal function
function closeProfileModal() {
    if (profileModal) {
        profileModal.classList.add('hidden');
    }
    const overlay = document.querySelector('.overlay');
    if (overlay) overlay.remove();
    // Remove escape key listener
    if (profileEscapeListener) {
        document.removeEventListener('keydown', profileEscapeListener);
    }
}

// Close login modal function
function closeLoginModal() {
    if (loginModal) {
        loginModal.classList.add('hidden');
    }
    const overlay = document.querySelector('.overlay');
    if (overlay) overlay.remove();
    // Remove escape key listener
    if (loginEscapeListener) {
        document.removeEventListener('keydown', loginEscapeListener);
    }
}

// Add event listener for game reset
document.addEventListener('resetGame', (event) => {
    // Reset game state variables
    currentScore = 0;
    chancesLeft = 5;
    guessedCountries = [];
    
    // Reset score and chances display
    const scoreSpan = document.getElementById('score');
    const chanceSpan = document.getElementById('chances');
    if (scoreSpan) scoreSpan.textContent = '0';
    if (chanceSpan) chanceSpan.textContent = '5';
    
    // Clear guesses list
    const guessesList = document.getElementById('guesses-list');
    if (guessesList) guessesList.innerHTML = '';
    
    // Only reinitialize tiles if preserveTiles flag is not set
    if (!event.detail?.preserveTiles) {
        initializeTiles();
    }

    // Clear input field
    const guessInput = document.getElementById('guess-input');
    if (guessInput) {
        guessInput.value = '';
        guessInput.disabled = false;
    }

    // Enable submit button
    const submitButton = document.getElementById('submit-guess');
    if (submitButton) submitButton.disabled = false;

    // Hide game over modal if visible
    const gameOverModal = document.getElementById('game-over');
    if (gameOverModal) gameOverModal.classList.add('hidden');

    // Reset any popups
    const popups = document.querySelectorAll('.popup');
    popups.forEach(popup => popup.classList.add('hidden'));
});

// Add a listener for auth state changes to update category locks
document.addEventListener('DOMContentLoaded', () => {
    if (window.userManager) {
        const originalUpdateUI = window.userManager.updateUI;
        window.userManager.updateUI = function() {
            originalUpdateUI.call(this);
            initializeCategoriesList(); // Refresh categories when auth state changes
        };
    }
}); 
