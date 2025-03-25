const recipeResultContainer = document.getElementById('recipe-result');
const searchInput = document.querySelector('.search .form-control');
const recipeCount = document.querySelector('.count-recette span');
const clearIconInput = document.querySelector('.clear-input-icon');

// Sélections actives
let selectedIngredients = [];
let selectedAppliances = [];
let selectedUstensils = [];

// Références dropdowns
const dropdowns = {
    ingredient: document.getElementById('ingredient-list'),
    appliance: document.getElementById('appliance-list'),
    ustensil: document.getElementById('ustensil-list')
};

function init() {
    updateRecipeDisplay(recipes);
    updateDropdownOptions(recipes);
    setupDropdownSearchHandlers();
    searchInput.addEventListener('input', updateFilters);
}

// Met à jour l'affichage des recettes
function updateRecipeDisplay(filteredRecipes) {
    recipeResultContainer.innerHTML = '';
    filteredRecipes.forEach(createRecipeCard);
    recipeCount.textContent = `${filteredRecipes.length} recettes`;
}

// Crée une carte de recette
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

// Mise à jour des options des dropdowns
function updateDropdownOptions(filteredRecipes) {
    const ingredients = new Set();
    const appliances = new Set();
    const ustensils = new Set();

    filteredRecipes.forEach(recipe => {
        recipe.ingredients.forEach(ing => ingredients.add(ing.ingredient));
        appliances.add(recipe.appliance);
        recipe.ustensils.forEach(ust => ustensils.add(ust));
    });

    populateDropdown('ingredient', ingredients, selectedIngredients);
    populateDropdown('appliance', appliances, selectedAppliances);
    populateDropdown('ustensil', ustensils, selectedUstensils);
}

// Remplit un dropdown avec les options
function populateDropdown(type, items, selected) {
    const list = dropdowns[type];
    list.innerHTML = '';

    items.forEach(item => {
        const li = document.createElement('li');
        //li.textContent = item;
        li.classList.add('dropdown-item');
        const itemList = document.createElement('span');
        itemList.classList.add('item-list');
        itemList.textContent = item;

        if (selected.includes(item)) {
            li.classList.add('selected');
            itemList.innerHTML += ` <i class="bi bi-x-circle remove-option"></i>`;
        }

        li.addEventListener('click', (e) => {
            if (e.target.classList.contains('remove-option')) {
                removeSelection(type, item);
            } else {
                addSelection(type, item);
            }
        });
        li.appendChild(itemList);
        list.appendChild(li);
    });
}

// Recherche dans chaque dropdown
function setupDropdownSearchHandlers() {
    document.querySelectorAll('.filter-input').forEach(input => {
        const wrapper = input.closest('.search-container');
        const clearIcon = wrapper.querySelector('.clear-icon');
        input.addEventListener('input', function () {
            const filterValue = input.value.toLowerCase();
            const list = input.closest('.dropdown-menu').querySelector('ul');
            // Ajout de la modification de class de l'icon supprimer ICI
            if (filterValue.length > 0) {  
                clearIcon.classList.remove('d-none');
            }
            else {
                clearIcon.classList.add('d-none');
            }
            Array.from(list.children).forEach(li => {
                li.style.display = li.textContent.toLowerCase().includes(filterValue) ? '' : 'none';
            });
        });
        clearIcon.addEventListener('click', function () {
            input.value = '';
            clearIcon.classList.add('d-none');
            Array.from(list.children).forEach(li => {
                li.style.display = '';
            });
        });
    });
}

// Ajoute une sélection
function addSelection(type, item) {
    if (type === 'ingredient' && !selectedIngredients.includes(item)) {
        selectedIngredients.push(item);
    }
    if (type === 'appliance' && !selectedAppliances.includes(item)) {
        selectedAppliances.push(item);
    }
    if (type === 'ustensil' && !selectedUstensils.includes(item)) {
        selectedUstensils.push(item);
    }
    updateFilters();
}

// Supprime une sélection
function removeSelection(type, item) {
    if (type === 'ingredient') {
        selectedIngredients = selectedIngredients.filter(i => i !== item);
    }
    if (type === 'appliance') {
        selectedAppliances = selectedAppliances.filter(i => i !== item);
    }
    if (type === 'ustensil') {
        selectedUstensils = selectedUstensils.filter(i => i !== item);
    }
    updateFilters();
}

// Mise à jour complète des filtres
function updateFilters() {
    updateSelectedTags();
    applyFilters();
}

// Affiche les tags globaux sous les dropdowns
function updateSelectedTags() {
    const container = document.getElementById('selected-tags');
    container.innerHTML = '';

    [...selectedIngredients, ...selectedAppliances, ...selectedUstensils].forEach(tag => {
        const span = document.createElement('span');
        span.classList.add('filter-tag');
        span.innerHTML = `${tag} <i class="bi bi-x"></i>`;
        span.querySelector('i').addEventListener('click', () => removeFromAllSelections(tag));
        container.appendChild(span);
    });

    updateDropdownOptions(applyFilters(true));
}

// Supprime un tag global (quel que soit le filtre concerné)
function removeFromAllSelections(tag) {
    selectedIngredients = selectedIngredients.filter(i => i !== tag);
    selectedAppliances = selectedAppliances.filter(i => i !== tag);
    selectedUstensils = selectedUstensils.filter(i => i !== tag);
    updateFilters();
}

// Applique les filtres combinés (recherche + filtres)
function applyFilters(onlyReturnFiltered = false) {
    const searchText = searchInput.value.trim().toLowerCase();
    if (searchText.length > 0 && searchText.length < 3) return;
    if (searchText.length > 0)
        {
            clearIconInput.classList.remove('d-none');
        }  
        else
        {
            clearIconInput.classList.add('d-none');
        }

    const filteredRecipes = recipes.filter(recipe => {
        const matchSearch = searchText === '' ||
            recipe.name.toLowerCase().includes(searchText) ||
            recipe.description.toLowerCase().includes(searchText) ||
            recipe.ingredients.some(ing => ing.ingredient.toLowerCase().includes(searchText));

        const matchIngredients = selectedIngredients.every(ing =>
            recipe.ingredients.some(i => i.ingredient === ing)
        );

        const matchAppliance = selectedAppliances.length === 0 ||
            selectedAppliances.includes(recipe.appliance);

        const matchUstensils = selectedUstensils.every(ust =>
            recipe.ustensils.includes(ust)
        );

        return matchSearch && matchIngredients && matchAppliance && matchUstensils;
    });

    if (onlyReturnFiltered) return filteredRecipes;

    updateRecipeDisplay(filteredRecipes);
    return filteredRecipes;

}

// Au click sur la croix dans le main search, on retire le contenu du form et on relance le filtrage
clearIconInput.addEventListener('click', function () {
    searchInput.value = '';
    clearIconInput.classList.add('d-none');
    applyFilters();
});


// Démarrage
init();
