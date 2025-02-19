const recipeResultContainer = document.getElementById('recipe-result');
const selectIngredient = document.getElementById('ingredient-select');
const selectAppliance = document.getElementById('appliance-select');
const selectUstensil = document.getElementById('ustensil-select');

const listAppliance = [];
const listIngredient = [];
const listUstensils = [];

function getSelectElement() {
    recipes.forEach(item => {
        if(!listAppliance.includes(item.appliance))
        {
            listAppliance.push(item.appliance);
        }

        item.ustensils.forEach(ustensil => {
            if (!listUstensils.includes(ustensil)) {
                listUstensils.push(ustensil);
            }
        });

        item.ingredients.forEach(ingr => {
         if(!listIngredient.includes(ingr.ingredient))
         {
            listIngredient.push(ingr.ingredient);
         }
        });
            
    });
    fillSelectElement();
}
function fillSelectElement(){
    listIngredient.forEach(item => {
        const optionIngredient = document.createElement('option');
        optionIngredient.textContent = item;

        selectIngredient.appendChild(optionIngredient);
    });
    listAppliance.forEach(appl => {
        const optionAppliance = document.createElement('option');
        optionAppliance.textContent = appl;

        selectAppliance.appendChild(optionAppliance);
    });
    listUstensils.forEach(ust => {
        const optionUstensil = document.createElement('option');
        optionUstensil.textContent = ust;

        selectUstensil.appendChild(optionUstensil);
    });
}


function loadRecipe() {
    recipes.forEach(element => {
        const recipeContainer = document.createElement('div');
        recipeContainer.classList.add('col-md-4');
        recipeContainer.classList.add('p3');
        recipeContainer.classList.add('recipe');

        //time
        const timeCapsule = document.createElement('span');
        timeCapsule.classList.add('time');
        timeCapsule.textContent = element.time+"min";


        //image
        const recipeImage = document.createElement('img')
        recipeImage.src = `assets/recipes/${element.image}`;
        recipeImage.classList.add('image-recipe');

        const contentContainer = document.createElement('div');
        contentContainer.classList.add('recipe-content');

        //title
        const recipeTitle = document.createElement('h3');
        recipeTitle.textContent = element.name;

        // séparateur RECETTE
        const recipeSeparator = document.createElement('span');
        recipeSeparator.classList.add('separator');
        recipeSeparator.textContent = 'RECETTE';
        
        // description recette
        const recipeDescription = document.createElement('p');
        recipeDescription.classList.add('recipe-description');
        recipeDescription.textContent = element.description;

        // séparateur INGREDIENTS
        const ingredientSeparator = document.createElement('span');
        ingredientSeparator.classList.add('separator');
        ingredientSeparator.textContent = 'INGRÉDIENTS';

        //container des ingrédients
        const ingredientContainer = document.createElement('div');
        ingredientContainer.classList.add('row');
        ingredientContainer.classList.add('ingredient-container');

        element.ingredients.forEach(item => {
            const ingredientColumn = document.createElement('div');
            ingredientColumn.classList.add('col-md-6');
            ingredientColumn.classList.add('single-ingredient');

            const ingredientName = document.createElement('span');
            ingredientName.classList.add('nom-ingredient');
            ingredientName.textContent = item.ingredient;

            const ingredientDose = document.createElement('span');
            ingredientDose.classList.add('dose-ingredient');
            ingredientDose.textContent = item.quantity;
            if(item.unit)
            {
                ingredientDose.textContent = item.quantity+item.unit;
            }
            else if(!item.quantity)
            {
                ingredientDose.textContent = "-";
            }

            ingredientColumn.appendChild(ingredientName);
            ingredientColumn.appendChild(ingredientDose);

            ingredientContainer.appendChild(ingredientColumn);
        })

        recipeContainer.appendChild(timeCapsule);
        recipeContainer.appendChild(recipeImage);
        contentContainer.appendChild(recipeTitle);
        contentContainer.appendChild(recipeSeparator);
        contentContainer.appendChild(recipeDescription);
        contentContainer.appendChild(ingredientSeparator);
        contentContainer.appendChild(ingredientContainer);

        recipeContainer.appendChild(contentContainer);
        recipeResultContainer.appendChild(recipeContainer);
        
    });
}

function init() {
    loadRecipe();
    getSelectElement();
}

init();