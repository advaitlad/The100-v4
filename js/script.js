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

let selectedCategoryIndex = -1;

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
        
        // If modal is already visible, close it
        if (!tutorialModal.classList.contains('hidden')) {
            closeTutorialModal();
            return;
        }
        
        // Remove any existing overlays
        const existingOverlays = document.querySelectorAll('.overlay');
        existingOverlays.forEach(overlay => overlay.remove());
        
        // Create new overlay
        const overlay = document.createElement('div');
        overlay.className = 'overlay active';
        document.body.appendChild(overlay);
        tutorialModal.classList.remove('hidden');
        tutorialModal.scrollTop = 0;

        overlay.addEventListener('click', closeTutorialModal);
        
        const escapeListener = (e) => {
            if (e.key === 'Escape') {
                closeTutorialModal();
                document.removeEventListener('keydown', escapeListener);
            }
        };
        document.addEventListener('keydown', escapeListener);
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
        const animationDelay = result.position ? 2000 : 1000; // Longer delay for correct guesses
        
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

function showGameOver() {
    // Save game results if user is logged in and userManager exists
    if (window.userManager?.currentUser) {
        const gameResults = [];
        // Safely get guesses from the list
        const guessList = guessesList?.children || [];
        Array.from(guessList).forEach(li => {
            const nameSpan = li.querySelector('span:first-child');
            const scoreSpan = li.querySelector('span:last-child');
            if (nameSpan && scoreSpan) {
                gameResults.push({
                    name: nameSpan.textContent,
                    score: parseInt(scoreSpan.textContent) || 0
                });
            }
        });
        
        // Update streak before saving game result
        window.userManager.updateStreak();
        window.userManager.saveGameResult(currentCategory, currentScore, gameResults);
    }

    // Create game over div if it doesn't exist
    if (!gameOverDiv) {
        gameOverDiv = document.createElement('div');
        gameOverDiv.id = 'game-over';
        document.body.appendChild(gameOverDiv);
    }

    // Set game over content with added Show Answers button and No option
    gameOverDiv.innerHTML = `
        <h2>Game Over!</h2>
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

    // Create and show overlay
    const overlay = document.createElement('div');
    overlay.className = 'overlay';
    document.body.appendChild(overlay);

    // Show overlay and game over popup
    setTimeout(() => {
        overlay.classList.add('active');
        gameOverDiv.classList.remove('hidden');
    }, 50);

    // Add event listeners for buttons
    const showAnswersBtn = document.querySelector('.show-answers-btn');
    const playAgainBtn = document.querySelector('.play-again-btn');
    const noPlayBtn = document.querySelector('.no-play-btn');

    if (showAnswersBtn) {
        showAnswersBtn.addEventListener('click', showAllAnswers);
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
        noPlayBtn.addEventListener('click', () => {
            if (overlay && overlay.parentNode) {
                overlay.remove();
            }
            if (gameOverDiv) {
                gameOverDiv.classList.add('hidden');
            }
            // Create floating play again button
            createFloatingPlayAgainButton();
        });
    }
}

function createFloatingPlayAgainButton() {
    // Remove existing floating buttons if they exist
    const existingBtn = document.getElementById('floating-play-again');
    const existingAnswersBtn = document.getElementById('floating-show-answers');
    if (existingBtn) existingBtn.remove();
    if (existingAnswersBtn) existingAnswersBtn.remove();

    // Create container for floating buttons
    const buttonsContainer = document.createElement('div');
    buttonsContainer.className = 'floating-buttons-container';
    
    // Create show answers button
    const showAnswersBtn = document.createElement('button');
    showAnswersBtn.className = 'floating-btn show-answers-btn';
    showAnswersBtn.innerHTML = '<i class="fas fa-list"></i> Show Answers';
    
    // Create play again button
    const playAgainBtn = document.createElement('button');
    playAgainBtn.className = 'floating-btn play-again-btn';
    playAgainBtn.innerHTML = '<i class="fas fa-redo"></i> Play Again';
    
    // Add click events
    showAnswersBtn.addEventListener('click', () => {
        showAllAnswers();
        // After showing answers, when closed, recreate the floating buttons
        const closeAnswersBtn = document.getElementById('close-answers');
        if (closeAnswersBtn) {
            const originalClickHandler = closeAnswersBtn.onclick;
            closeAnswersBtn.onclick = () => {
                if (originalClickHandler) originalClickHandler();
                createFloatingPlayAgainButton();
            };
        }
        buttonsContainer.remove();
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

function showAllAnswers() {
    // Hide game over screen
    if (gameOverDiv) {
        gameOverDiv.classList.add('hidden');
    }
    
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
        if (overlay && overlay.parentNode) {
            overlay.remove();
        }
        if (answersModal && answersModal.parentNode) {
            answersModal.remove();
        }
        if (gameOverDiv) {
            gameOverDiv.classList.remove('hidden');
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
            <button class="confirm-btn cancel">No, Continue Playing</button>
            <button class="confirm-btn confirm">Yes, Switch Category</button>
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

function toggleSidePanel() {
    sidePanel.classList.toggle('active');
    document.querySelector('.game-container').classList.toggle('side-panel-active');
}

function initializeCategoriesList() {
    const categoriesContainer = document.getElementById('categories-container');
    if (!categoriesContainer) return;

    categoriesContainer.innerHTML = '';
    const freeCategories = ['area', 'population'];
    const isGuest = !window.userManager?.currentUser;

    Object.entries(gameCategories).forEach(([key, category]) => {
        const item = document.createElement('div');
        item.className = `category-item${key === currentCategory ? ' active' : ''}${!freeCategories.includes(key) && isGuest ? ' locked' : ''}`;
        item.setAttribute('tabindex', '0');
        item.innerHTML = `
            <div class="icon">
                <i class="fas ${category.icon || 'fa-globe'}"></i>
            </div>
            <div class="info">
                <h3>${category.title}</h3>
            </div>
            ${!freeCategories.includes(key) && isGuest ? '<i class="fas fa-lock"></i>' : ''}
        `;

        item.addEventListener('click', () => {
            if (key !== currentCategory) {
                handleCategorySelection(key);
            }
        });

        categoriesContainer.appendChild(item);
    });
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

function handleCategorySelection(category) {
    // Check if category is locked for guest users
    const freeCategories = ['area', 'population'];
    const isLocked = !freeCategories.includes(category) && (!window.userManager?.currentUser);
    
    if (isLocked) {
        // Show login prompt
        const overlay = document.createElement('div');
        overlay.className = 'overlay active';
        
        const loginPrompt = document.createElement('div');
        loginPrompt.className = 'confirm-modal';
        loginPrompt.innerHTML = `
            <div class="confirm-content">
                <div class="modal-header">
                    <div class="warning-icon">
                        <i class="fas fa-lock"></i>
                    </div>
                    <h2>Premium Category</h2>
                    <p>This category is only available for registered users. Sign up or log in to unlock all categories! 🎮</p>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn cancel">
                        <i class="fas fa-times"></i>
                        Maybe Later
                    </button>
                    <button class="modal-btn confirm">
                        <i class="fas fa-sign-in-alt"></i>
                        Login / Sign Up
                    </button>
                </div>
            </div>
        `;
        
        document.body.appendChild(overlay);
        document.body.appendChild(loginPrompt);
        
        // Add event listeners
        const cancelBtn = loginPrompt.querySelector('.cancel');
        const confirmBtn = loginPrompt.querySelector('.confirm');
        
        const closePrompt = () => {
            overlay.remove();
            loginPrompt.remove();
        };
        
        cancelBtn.addEventListener('click', closePrompt);
        overlay.addEventListener('click', closePrompt);
        
        confirmBtn.addEventListener('click', () => {
            closePrompt();
            document.getElementById('profile-toggle').click();
        });
        
        return;
    }

    // If category is not locked or user is logged in, proceed with selection
    if (isGameInProgress()) {
        showConfirmationDialog((confirmed) => {
            if (confirmed) {
                selectCategory(category);
            }
        });
    } else {
        selectCategory(category);
    }
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
    const overlay = document.querySelector('.overlay');
    tutorialModal.classList.add('hidden');
    if (overlay) overlay.remove();
    // Reset scroll position
    tutorialModal.scrollTop = 0;
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
