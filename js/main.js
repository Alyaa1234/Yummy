// API URLs
const BASE_URL = 'https://www.themealdb.com/api/json/v1/1/';
const SEARCH_BY_NAME_URL = `${BASE_URL}search.php?s=`;
const SEARCH_BY_LETTER_URL = `${BASE_URL}search.php?f=`;
const CATEGORIES_URL = `${BASE_URL}categories.php`;
const FILTER_BY_CATEGORY_URL = `${BASE_URL}filter.php?c=`;
const AREAS_URL = `${BASE_URL}list.php?a=list`;
const FILTER_BY_AREA_URL = `${BASE_URL}filter.php?a=`;
const INGREDIENTS_URL = `${BASE_URL}list.php?i=list`;
const FILTER_BY_INGREDIENT_URL = `${BASE_URL}filter.php?i=`;
const MEAL_DETAILS_URL = `${BASE_URL}lookup.php?i=`;

// DOM Elements
const searchByNameInput = document.getElementById('searchByName');
const searchByFirstLetterInput = document.getElementById('searchByFirstLetter');
const searchResultsContainer = document.getElementById('searchResults');
const mealsContainer = document.getElementById('mealsContainer');
const categoriesContainer = document.getElementById('categoriesContainer');
const areaContainer = document.getElementById('areaContainer');
const ingredientsContainer = document.getElementById('ingredientsContainer');
const mealDetailsContent = document.getElementById('mealDetailsContent');
const loadingSpinner = document.getElementById('loadingSpinner');
const contactForm = document.getElementById('contactForm');

// Sections
const homeSection = document.getElementById('home');
const searchSection = document.getElementById('search');
const mealsSection = document.getElementById('meals');
const categoriesSection = document.getElementById('categories');
const areaSection = document.getElementById('area');
const ingredientsSection = document.getElementById('ingredients');
const contactSection = document.getElementById('contact');
const mealDetailsSection = document.getElementById('mealDetails');

// Sidebar Elements
const sidebar = document.querySelector('.sidebar');
const sidebarToggle = document.querySelector('.sidebar-toggle');
const openIcon = document.querySelector('.open-icon');
const closeIcon = document.querySelector('.close-icon');
const sidebarLinks = document.querySelectorAll('.sidebar a');


// Initialize the app
document.addEventListener('DOMContentLoaded', function() {
    getRandomMeals();
    setupEventListeners();
});

// Setup all event listeners
function setupEventListeners() {
    sidebarToggle.addEventListener('click', toggleSidebar);
    searchByNameInput.addEventListener('input', handleSearchByName);
    searchByFirstLetterInput.addEventListener('input', handleSearchByFirstLetter);
    sidebarLinks.forEach(link => {
        link.addEventListener('click', handleNavigation);
    });
    // header section button
    document.querySelector('.hero-content .btn').addEventListener('click', function(e) {
        e.preventDefault();
        if(mealsSection.classList.contains('d-none')){
            mealsSection.classList.remove('d-none');
            mealsSection.querySelector('h2').innerText = 'Random Meals';
            getRandomMeals();
        }
        else{
            window.scrollTo({
             top: mealsSection.offsetTop,
             behavior: 'smooth'
            });
        }
    });
    if (contactForm) {
        setupContactFormValidation();
    }
}

// Toggle sidebar
function toggleSidebar() {
    sidebar.classList.toggle('open');
    openIcon.classList.toggle('d-none');
    closeIcon.classList.toggle('d-none');
}

// Handle navigation between sections
function handleNavigation(e) {
    e.preventDefault();
    hideAllSections();// Hide all sections
    // Show the target section
    const targetId = e.target.getAttribute('href').substring(1);
    switch (targetId) {
        case 'search':
            searchSection.classList.remove('d-none');
            break;
        case 'categories':
            categoriesSection.classList.remove('d-none');
            getCategories();
            break;
        case 'area':
            areaSection.classList.remove('d-none');
            getAreas();
            break;
        case 'ingredients':
            ingredientsSection.classList.remove('d-none');
            getIngredients();
            break;
        case 'contact':
            contactSection.classList.remove('d-none');
            break;
    }
}

// Hide all sections
function hideAllSections() {
    searchSection.classList.add('d-none');
    mealsSection.classList.add('d-none');
    categoriesSection.classList.add('d-none');
    areaSection.classList.add('d-none');
    ingredientsSection.classList.add('d-none');
    contactSection.classList.add('d-none');
    mealDetailsSection.classList.add('d-none');
}

// loading spinner status
function showLoading() {
    loadingSpinner.classList.remove('d-none');
}
function hideLoading() {
    loadingSpinner.classList.add('d-none');
}

// Fetch data from API
async function fetchData(url) {
    showLoading();
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    } finally {
        hideLoading();
    }
}


//20 random meals for home / initial section
async function getRandomMeals() {
    const data = await fetchData(`${SEARCH_BY_NAME_URL}`);
    if (data && data.meals) {
        displayMeals(data.meals.slice(0, 20), mealsContainer);
    }
}


// searching functionality  
async function handleSearchByName() {
    const searchTerm = searchByNameInput.value.trim();
    
    if(searchTerm.length > 0){
        const data = await fetchData(`${SEARCH_BY_NAME_URL}${searchTerm}`);
        
        if (data && data.meals) {
            displayMeals(data.meals, searchResultsContainer);
        } else {
            searchResultsContainer.innerHTML = '<div class="col-12 text-center"><p>No meals found. Try another search term.</p></div>';
        }
    } 
    else{
        searchResultsContainer.innerHTML = '';
    }
}
async function handleSearchByFirstLetter() {
    const letter = searchByFirstLetterInput.value.trim();
    
    if(letter.length === 1){
        const data = await fetchData(`${SEARCH_BY_LETTER_URL}${letter}`);
        
        if (data && data.meals){
            displayMeals(data.meals, searchResultsContainer);
        } 
        else{
            searchResultsContainer.innerHTML = '<div class="col-12 text-center"><p>No meals found for this letter.</p></div>';
        }
    } 
    else{
        searchResultsContainer.innerHTML = '';
    }
}


// meals functionality
function displayMeals(meals, container) {
    container.innerHTML = '';
    
    meals.forEach(meal => {
        const mealCard = document.createElement('div');
        mealCard.className = 'col-md-6 col-lg-3';
        mealCard.innerHTML = `
            <div class="meal-card" data-id="${meal.idMeal}">
                <img src="${meal.strMealThumb}" alt="${meal.strMeal}">
                <div class="overlay">
                    <h3 class="meal-name">${meal.strMeal}</h3>
                </div>
            </div>
        `;
        
        mealCard.querySelector('.meal-card').addEventListener('click', () => {
            getMealDetails(meal.idMeal);
        });
        
        container.appendChild(mealCard);
    });
}
async function getMealDetails(mealId) {
    const data = await fetchData(`${MEAL_DETAILS_URL}${mealId}`);
    
    if(data && data.meals && data.meals.length > 0){
        displayMealDetails(data.meals[0]);
    }
}
function displayMealDetails(meal) {
    hideAllSections();
    mealDetailsSection.classList.remove('d-none');
    
    // Get ingredients and measures
    const ingredients = [];
    for (let i = 1; i <= 20; i++) {
        const ingredient = meal[`strIngredient${i}`];
        const measure = meal[`strMeasure${i}`];
        
        if(ingredient && ingredient.trim() !== ''){
            ingredients.push(`${measure} ${ingredient}`);
        }
    }
    
    // Get tags
    let tagsHtml = '';
    if (meal.strTags) {
        const tags = meal.strTags.split(',');
        tagsHtml = `
            <div class="meal-tags">
                ${tags.map(tag => `<span class="meal-tag">${tag.trim()}</span>`).join('')}
            </div>
        `;
    }
    
    mealDetailsContent.innerHTML = `
        <div class="col-12 mb-4">
            <button class="btn btn-outline-danger" onclick="goBack()">
                <i class="fas fa-arrow-left"></i> Back
            </button>
        </div>
        <div class="col-md-4">
            <img src="${meal.strMealThumb}" alt="${meal.strMeal}" class="meal-details-img">
            <h2 class="mt-3">${meal.strMeal}</h2>
            ${tagsHtml}
        </div>
        <div class="col-md-8">
            <h3>Instructions</h3>
            <p>${meal.strInstructions}</p>
            
            <h3>Area: ${meal.strArea}</h3>
            <h3>Category: ${meal.strCategory}</h3>
            
            <h3>Ingredients:</h3>
            <div class="ingredients-list">
                ${ingredients.map(ingredient => `<span class="ingredient-item">${ingredient}</span>`).join('')}
            </div>
            
            <div class="mt-4">
                ${meal.strSource ? `<a href="${meal.strSource}" target="_blank" class="btn btn-success me-2">Source</a>` : ''}
                ${meal.strYoutube ? `<a href="${meal.strYoutube}" target="_blank" class="btn btn-danger">Youtube</a>` : ''}
            </div>
        </div>
    `;
    
    // Scroll to bottom of the meal details section
    window.scrollTo({
        top: mealDetailsSection.offsetTop,
        behavior: 'smooth'
    });
}


// Go back btn functionality for meal details page
function goBack() {
    hideAllSections();
    mealsSection.classList.remove('d-none');
}


// categories section functionality//
async function getCategories() {
    const data = await fetchData(CATEGORIES_URL);
    
    if (data && data.categories) {
        displayCategories(data.categories);
    }
}
function displayCategories(categories) {
    categoriesContainer.innerHTML = '';
    
    categories.forEach(category => {
        const categoryCard = document.createElement('div');
        categoryCard.className = 'col-md-6 col-lg-3';
        categoryCard.innerHTML = `
            <div class="category-card" data-category="${category.strCategory}">
                <img src="${category.strCategoryThumb}" alt="${category.strCategory}" class="w-100">
                <div class="overlay">
                    <h3>${category.strCategory}</h3>
                    <p>${category.strCategoryDescription}</p>
                </div>
            </div>
        `;
        
        categoryCard.querySelector('.category-card').addEventListener('click', () => {
            getMealsByCategory(category.strCategory);
        });
        
        categoriesContainer.appendChild(categoryCard);
    });
}
async function getMealsByCategory(category) {
    const data = await fetchData(`${FILTER_BY_CATEGORY_URL}${category}`);
    
    if (data && data.meals) {
        categoriesSection.classList.add('d-none');        
        mealsSection.classList.remove('d-none');
        mealsSection.querySelector('h2').innerText = `Popular Meals in ${category}`;        
        displayMeals(data.meals, mealsContainer);
    }
}



// areas section functionality
async function getAreas() {
    const data = await fetchData(AREAS_URL);
    
    if (data && data.meals) {
        displayAreas(data.meals);
    }
}
function displayAreas(areas) {
    areaContainer.innerHTML = '';
    
    areas.forEach(area => {
        const areaCard = document.createElement('div');
        areaCard.className = 'col-md-6 col-lg-3';
        areaCard.innerHTML = `
            <div class="area-card" data-area="${area.strArea}">
                <i class="fas fa-house-flag"></i>
                <h3>${area.strArea}</h3>
            </div>
        `;
        
        areaCard.querySelector('.area-card').addEventListener('click', () => {
            getMealsByArea(area.strArea);
        });
        
        areaContainer.appendChild(areaCard);
    });
}
async function getMealsByArea(area) {
    const data = await fetchData(`${FILTER_BY_AREA_URL}${area}`);
    
    if (data && data.meals) {
        areaSection.classList.add('d-none');
        mealsSection.classList.remove('d-none');
        mealsSection.querySelector('h2').innerText = `Popular meals in ${area}`;
        displayMeals(data.meals, mealsContainer);
    }
}



// ingredients section functionality
async function getIngredients() {
    const data = await fetchData(INGREDIENTS_URL);
    
    if (data && data.meals) {
        displayIngredients(data.meals.slice(0, 20));
    }
}
function displayIngredients(ingredients) {
    ingredientsContainer.innerHTML = '';
    
    ingredients.forEach(ingredient => {
        const ingredientCard = document.createElement('div');
        ingredientCard.className = 'col-md-6 col-lg-3';
        ingredientCard.innerHTML = `
            <div class="ingredient-card" data-ingredient="${ingredient.strIngredient}">
                <i class="fas fa-drumstick-bite"></i>
                <h3>${ingredient.strIngredient}</h3>
                <p>${ingredient.strDescription ? ingredient.strDescription.substring(0, 100) + '...' : 'No description available'}</p>
            </div>
        `;
        
        ingredientCard.querySelector('.ingredient-card').addEventListener('click', () => {
            getMealsByIngredient(ingredient.strIngredient);
        });
        
        ingredientsContainer.appendChild(ingredientCard);
    });
}
async function getMealsByIngredient(ingredient) {
    const data = await fetchData(`${FILTER_BY_INGREDIENT_URL}${ingredient}`);
    
    if (data && data.meals) {
        ingredientsSection.classList.add('d-none');
        mealsSection.classList.remove('d-none');
        mealsSection.querySelector('h2').innerText = `Popular meals with ${ingredient}`;
        displayMeals(data.meals, mealsContainer);
    }
}



//contact us section form validation
function setupContactFormValidation() {
    const nameInput = document.getElementById('name');
    const emailInput = document.getElementById('email');
    const phoneInput = document.getElementById('phone');
    const ageInput = document.getElementById('age');
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const submitButton = contactForm.querySelector('button[type="submit"]');
    
    // patterns
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phonePattern = /^\d{10,}$/;
    const passwordPattern = /^(?=.*[a-zA-Z])(?=.*[0-9]).{6,}$/; 
    
    // Validation function
    function validateForm() {
        let isValid = true;
        
        // name validation
        if (nameInput.value.trim() === '') {
            nameInput.classList.add('is-invalid');
            isValid = false;
        } else {
            nameInput.classList.remove('is-invalid');
            nameInput.classList.add('is-valid');
        }
        
        // email validation
        if (!emailPattern.test(emailInput.value)) {
            emailInput.classList.add('is-invalid');
            isValid = false;
        } else {
            emailInput.classList.remove('is-invalid');
            emailInput.classList.add('is-valid');
        }
        
        // phone validation
        if (!phonePattern.test(phoneInput.value)) {
            phoneInput.classList.add('is-invalid');
            isValid = false;
        } else {
            phoneInput.classList.remove('is-invalid');
            phoneInput.classList.add('is-valid');
        }
        
        // age validation
        if (ageInput.value < 1) {
            ageInput.classList.add('is-invalid');
            isValid = false;
        } else {
            ageInput.classList.remove('is-invalid');
            ageInput.classList.add('is-valid');
        }
        
        // password validation
        if (!passwordPattern.test(passwordInput.value)) {
            passwordInput.classList.add('is-invalid');
            isValid = false;
        } else {
            passwordInput.classList.remove('is-invalid');
            passwordInput.classList.add('is-valid');
        }
        
        // confirm password validation
        if (confirmPasswordInput.value !== passwordInput.value) {
            confirmPasswordInput.classList.add('is-invalid');
            isValid = false;
        } else {
            confirmPasswordInput.classList.remove('is-invalid');
            confirmPasswordInput.classList.add('is-valid');
        }
        
        // Enable/disable submit button
        submitButton.disabled = !isValid;
        
        return isValid;
    }
    
    // Add event listeners to all inputs
    const inputs = [nameInput, emailInput, phoneInput, ageInput, passwordInput, confirmPasswordInput];
    inputs.forEach(input => {
        input.addEventListener('input', validateForm);
    });
    
    // Form submit
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        if (validateForm()) {
            alert('Form submitted successfully!');
            contactForm.reset();
            inputs.forEach(input => {
                input.classList.remove('is-valid');
            });
            submitButton.disabled = true;
        }
    });
}
