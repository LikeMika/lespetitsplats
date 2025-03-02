const recipeResultContainer = document.getElementById('recipe-result');
const searchInput = document.querySelector('.search .form-control');
const selectIngredient = document.getElementById('ingredient-select');
const selectAppliance = document.getElementById('appliance-select');
const selectUstensil = document.getElementById('ustensil-select');
const recipeCount = document.querySelector('.count-recette span');

let selectedIngredients = [];
let selectedAppliances = [];
let selectedUstensils = [];

function updateRecipeDisplay(filteredRecipes) {
    recipeResultContainer.innerHTML = '';
    filteredRecipes.forEach(recipe => createRecipeCard(recipe));
    recipeCount.textContent = `${filteredRecipes.length} recettes`;
}

function createRecipeCard(recipe) {
    const recipeContainer = document.createElement('div');
    recipeContainer.classList.add('col-md-4', 'p3', 'recipe');

    const timeCapsule = document.createElement('span');
    timeCapsule.classList.add('time');
    timeCapsule.textContent = recipe.time + "min";

    const recipeImage = document.createElement('img');
    recipeImage.src = `assets/recipes/${recipe.image}`;
    recipeImage.classList.add('image-recipe');

    const contentContainer = document.createElement('div');
    contentContainer.classList.add('recipe-content');

    const recipeTitle = document.createElement('h3');
    recipeTitle.textContent = recipe.name;

    const recipeDescription = document.createElement('p');
    recipeDescription.classList.add('recipe-description');
    recipeDescription.textContent = recipe.description;

    const ingredientSeparator = document.createElement('span');
    ingredientSeparator.classList.add('separator');
    ingredientSeparator.textContent = 'INGRÉDIENTS';

    const ingredientContainer = document.createElement('div');
    ingredientContainer.classList.add('row', 'ingredient-container');

    recipe.ingredients.forEach(item => {
        const ingredientColumn = document.createElement('div');
        ingredientColumn.classList.add('col-md-6', 'single-ingredient');

        const ingredientName = document.createElement('span');
        ingredientName.classList.add('nom-ingredient');
        ingredientName.textContent = item.ingredient;

        const ingredientDose = document.createElement('span');
        ingredientDose.classList.add('dose-ingredient');
        ingredientDose.textContent = item.quantity ? `${item.quantity} ${item.unit || ''}` : '-';

        ingredientColumn.appendChild(ingredientName);
        ingredientColumn.appendChild(ingredientDose);
        ingredientContainer.appendChild(ingredientColumn);
    });

    contentContainer.appendChild(recipeTitle);
    contentContainer.appendChild(recipeDescription);
    contentContainer.appendChild(ingredientSeparator);
    contentContainer.appendChild(ingredientContainer);

    recipeContainer.appendChild(timeCapsule);
    recipeContainer.appendChild(recipeImage);
    recipeContainer.appendChild(contentContainer);
    recipeResultContainer.appendChild(recipeContainer);
}

function filterRecipes() {
    let searchText = searchInput.value.toLowerCase();
    if (searchText.length > 0 && searchText.length < 3) return;
    
    let filteredRecipes = recipes.filter(recipe => {
        let matchSearch = searchText === '' || recipe.name.toLowerCase().includes(searchText) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(searchText));
        
        let matchIngredients = selectedIngredients.length === 0 ||
            selectedIngredients.every(ing => recipe.ingredients.some(i => i.ingredient === ing));
        
        let matchAppliance = selectedAppliances.length === 0 || selectedAppliances.includes(recipe.appliance);
        
        let matchUstensils = selectedUstensils.length === 0 ||  
            selectedUstensils.every(ust => recipe.ustensils.includes(ust));
        
        return matchSearch && matchIngredients && matchAppliance && matchUstensils;
    });
    
    updateRecipeDisplay(filteredRecipes);
    updateSelectOptions(filteredRecipes);
}

function updateSelectOptions(filteredRecipes) {
    let ingredients = new Set();
    let appliances = new Set();
    let ustensils = new Set();
    
    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => ingredients.add(ing.ingredient));
        appliances.add(recipe.appliance);
        recipe.ustensils.forEach(ust => ustensils.add(ust));
    });
    
    updateSelectElement(selectIngredient, ingredients, 'Ingrédients');
    updateSelectElement(selectAppliance, appliances, 'Appareils');
    updateSelectElement(selectUstensil, ustensils, 'Ustensiles');
}

function updateSelectElement(selectElement, items, defaultLabel) {
    selectElement.innerHTML = '';
    
    const defaultOption = document.createElement('option');
    defaultOption.textContent = defaultLabel;
    defaultOption.selected = true;
    defaultOption.disabled = true;
    selectElement.appendChild(defaultOption);

    items.forEach(item => {
        const option = document.createElement('option');
        option.textContent = item;
        option.value = item;
        selectElement.appendChild(option);
    });
}

searchInput.addEventListener('input', filterRecipes);
selectIngredient.addEventListener('change', e => {
    selectedIngredients = e.target.value ? [e.target.value] : [];
    filterRecipes();
});
selectAppliance.addEventListener('change', e => {
    selectedAppliances = e.target.value ? [e.target.value] : [];
    filterRecipes();
});
selectUstensil.addEventListener('change', e => {
    selectedUstensils = e.target.value ? [e.target.value] : [];
    filterRecipes();
});

function init() {
    updateRecipeDisplay(recipes);
    updateSelectOptions(recipes);
}

init();
