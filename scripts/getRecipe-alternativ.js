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

    let filteredRecipes = [];

    // on parcours toutes les recettes
    for (let i = 0; i<recipes.length; i++){
        let recipe = recipes[i];

        // on vérifie si la recheche match
        let matchSearch = searchText === '' || recipe.name.toLowerCase().includes(searchText);
        if (!matchSearch)
        {
            let j = 0;
            while (j < recipe.ingredients.length && !matchSearch)
            {
                if (recipe.ingredients[j].ingredient.toLowerCase().includes(searchText))
                {
                    matchSearch = true;
                }
                j++;
            }
        }

        // on vérifie si les ingredient match
        let matchIngredients = selectedIngredients.length === 0;
        if (!matchIngredients) {
            let allIngredientsMatch = true;
            for (let k = 0; k < selectedIngredients.length && allIngredientsMatch; k++)
            {
                let ing = selectedIngredients[k];
                let found = false;
                let m = 0;
                while (m < recipe.ingredients.length && !found)
                {
                    if (recipe.ingredients[m].ingredient === ing)
                    {
                        found = true;
                    }
                m++;
                }
                allIngredientsMatch = found;
            }
            matchIngredients = allIngredientsMatch;
        }

        // on vérifie si les appliances match
        let matchAppliance = selectedAppliances.length === 0;
        if(!matchAppliance) {
            for (let n = 0; n < selectedAppliances.length; n++)
            {
                if (selectedAppliances[n] === recipe.appliance)
                {
                    matchAppliance = true;
                    break;
                }
            }
        }

        //on vérifie sir les ustensiles match
        let matchUstensils = selectedUstensils.length === 0;
        if (!matchUstensils)
        {
            let allUstensilsMatch = true;
            for(let u = 0; u < selectedUstensils.length && allUstensilsMatch; u++)
            {
                let ust = selectedUstensils[u];
                let found = false;
                let q = 0;
                while (q < recipe.ustensils.length && !found) {
                    if (recipe.ustensils[q] === ust)
                    {
                        found =true;
                    }
                    q++;
                }
                allUstensilsMatch = found;
            }
            matchUstensils = allUstensilsMatch;
        }

        // si tout est vérifié, on ajouter la recette dans les recettes filtrées
        if (matchSearch && matchIngredients && matchAppliance && matchUstensils) {
            filteredRecipes.push(recipe);
        }

    }
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
