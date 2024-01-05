/* Votre JavaScript ici */

/* Ingrédient API */
// URL de l'API à appeler
const apiUrl = 'http://localhost:8000/api/ingredients';
const apiDetailUrl = 'http://localhost:8000/api/recettes'

/* Fonction pour faire la liste des ingrédients renseignés dans le formulaire d'ingrédient */
$(document).ready(function() {

    $('#listRecette').hide();

    const ingredients = ["comcombre", "courgette", "confiture", "carotte", "chou-fleur", "citron", "ciboulette", "coriandre", "cumin", "curcuma"];
    var listeIngredients = [];

    document.getElementById('suggestions').addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion')) {
            ajouterIngredient(e.target.textContent);
            document.getElementById('ingredient').value = '';
            document.getElementById('suggestions').innerHTML = '';
        }
    });
    
    document.getElementById('ingredient').addEventListener('input', function() {
        const input = this.value.toLowerCase();
        if (input.length > 0) {
            const suggestions = ingredients.filter(ingredient => ingredient.toLowerCase().startsWith(input));
            document.getElementById('suggestions').innerHTML = suggestions.map(suggestion => `<div class="suggestion">${suggestion}</div>`).join('');
        } else {
            document.getElementById('suggestions').innerHTML = ''; // Vide les suggestions
        }
    });
    // Fonction pour ajouter un ingrédient à la liste visuelle et à la liste JavaScript
    function ajouterIngredient(ingredient) {
        // Création de la structure HTML de l'ingrédient avec les boutons Supprimer et Modifier
        var nouvelIngredient = $('<div class="ingredient flex"><p>' + ingredient + '</p></div>');

        var boutonSupprimer = $('<button class="btn btn-primary">Supprimer</button>').click(function() {
            // Suppression visuelle de l'ingrédient et suppression de l'élément correspondant dans la liste JavaScript
            var index = $(this).parent().index();
            $(this).parent().remove();
            listeIngredients.splice(index, 1);
        });

        // Ajout des boutons à l'élément d'ingrédient et ajout à la liste visuelle
        nouvelIngredient.append(boutonSupprimer);
        $('#liste_ingredients').append(nouvelIngredient);
    }

    function actualiserListeIngredients() {
        $('#liste_ingredients').empty(); // Vider la liste visuelle

        // Reconstruire la liste visuelle à partir des données dans listeIngredients
        listeIngredients.forEach(function(ingredient) {
            ajouterIngredient(ingredient.ingredient);
        });
    }
    


    // Gestionnaire d'événement pour le bouton "Ajouter"
    $('#ajouter').on('click', function() {
        var ingredient = $('#ingredient').val();

        if (ingredient !== '') {
            // Appel de la fonction pour ajouter l'ingrédient à la liste visuelle et à la liste JavaScript
            ajouterIngredient(ingredient);

            // Ajout de l'ingrédient à la liste JavaScript
            var nouvelIngredientObj = {
                ingredient: ingredient,
            };
            listeIngredients.push(nouvelIngredientObj);

            // Réinitialisation des champs après l'ajout de l'ingrédient
            $('#ingredient').val('');
        } else {
            alert('Veuillez remplir tous les champs.');
        }
    });

    // Gestionnaire d'événement pour la soumission du formulaire
    $('#formIngredient').submit(function(event) {
        event.preventDefault(); // Empêche l'envoi du formulaire par défaut

        // Récupération des valeurs du formulaire
        var formData = {
            ingredient: listeIngredients,
        };
        const params = {
            ingredients: formData.ingredient.map(item => {
                return {
                    "label": item.ingredient,
                };
            }),
        };
        console.log('params');
        console.log(params);
        $('#loader').show();
        axios.post(apiUrl, params).then(reussite).catch(echec);
    });


    // Ajoutez d'autres ingrédients ici

    /*document.getElementById('ingredient').addEventListener('input', function() {
        const input = this.value.toLowerCase();
        const suggestions = ingredients.filter(ingredient => ingredient.toLowerCase().startsWith(input));
        document.getElementById('suggestions').innerHTML = suggestions.map(suggestion => `<div class="suggestion">${suggestion}</div>`).join('');
        if (!suggestions.includes(input)) {
            document.getElementById('suggestions').innerHTML += `<button id="ajouterIngredient">Ajouter</button>`;
        }
    });
    
    document.getElementById('suggestions').addEventListener('click', function(e) {
        if (e.target.classList.contains('suggestion')) {
            document.getElementById('liste_ingredients').innerHTML += `<div>${e.target.textContent}</div>`;
            document.getElementById('ingredient').value = '';
            document.getElementById('suggestions').innerHTML = ''; // Vide les suggestions
        } else if (e.target.id === 'ajouterIngredient') {
            document.getElementById('liste_ingredients').innerHTML += `<div>${document.getElementById('ingredient').value}</div>`;
            document.getElementById('ingredient').value = '';
            document.getElementById('suggestions').innerHTML = ''; // Vide les suggestions
        }
    });
    */

});





/* Traitement du formulaire INGREDIENT si réussite*/
function reussite ( data ) 
{
    if (data.data.includes("1. ")) {
        // Traitement des données pour extraire les noms de recettes
        let listStart = data.data.indexOf("1. ");
        let listEnd = data.data.indexOf("\n\n", listStart);
        let list = data.data.slice(listStart, listEnd);
        let recipes = list.split("\n").map(recipe => recipe.replace(/(\w+\.\s|- )/, '').replace(/[^a-zA-Z\sœŒÉÈÊËÀÂÄÔÖÙÛÜÇ'éèêëàâäôöùûüç]/g, ''));
        console.log('recipes');
        console.log(recipes);
        let divName = document.getElementById( "listRecette" );
        let htmlContent = '';
        recipes.forEach(recipe => {
            htmlContent += `<div class="card" style="width: 15rem;">
                <img src="https://img.cuisineaz.com/1024x768/2013/12/20/i18391-poule-au-pot-et-riz-long.jpeg"
                    class="imgA" alt="poule au pot l'ancienne">
                <div class="card-body">
                    <h5 class="card-title titre">${recipe}</h5>
                    <p class="card-text">calorie</p>
                    <p class="card-text">CO2</p>
                    <button class="btn btn-primary details" onclick="_paq.push(['trackEvent', 'Click Link', 'Voir le detail de la recette']);"> Voir recette </button>
                </div>
            </div>`;
        })
        divName.innerHTML = htmlContent;
        $('#formIngredient').hide();
        $('#listRecette').show();
        $('#modifierFormBtn').show();
        $('#loader').hide();
    } else {
        // Afficher un message d'erreur
        let divName = document.getElementById( "listRecette" );
        divName.innerHTML = "Aucune recette trouvée";
        $('#formIngredient').hide();
        $('#listRecette').show();
        $('#modifierFormBtn').show();
        $('#loader').hide();
    }
}

/* Traitement du formulaire INGREDIENT si echec*/
function echec (error) 
{
    // Gestion des erreurs
    console.error('Erreur lors de la récupération des données:', error.response);
    $('#loader').hide();
}

/* Voir le detail de la recette */
$(document).on('click', '.details', function() {
    const parameters = {
        text: $(this).siblings('.card-title.titre').text()
    };
    console.log('parameters');
    console.log(parameters);
    axios.get(apiDetailUrl + '?text=' + parameters.text).then((data) => {
        successDetails.call(this, data); // Utiliser une fonction fléchée pour conserver la portée de "this"
    }).catch(errorDetails);
    
});

/* Traitement du DETAIL si réussite*/
function successDetails(data) {
    const recipeName = $(this).siblings('.card-title.titre').text();
    console.log('Nom de la recette:');
    console.log(recipeName);
    const recipeText = data.data;

    // Extraction des ingrédients
    const ingredientsRegex = /Ingrédients :([\s\S]*?)(?=Étapes de préparation|Préparation|Portion|Temps de préparation|Calories|CO2 moyen|$)/;
    const ingredientsMatch = recipeText.match(ingredientsRegex);
    const ingredients = ingredientsMatch ? ingredientsMatch[1].trim() : '';

    // Extraction des étapes de préparation
    const preparationRegex = /(?:Étapes de préparation|Préparation) :([\s\S]*?)(?=Portion|Temps de préparation|Calories|CO2 moyen|$)/;
    const preparationMatch = recipeText.match(preparationRegex);
    const preparations = preparationMatch ? preparationMatch[1].trim() : '';

    // Extraction de la portion
    const portionRegex = /Portion :([\s\S]*?)(?=Temps de préparation|Calories|CO2 moyen|$)/;
    const portionMatch = recipeText.match(portionRegex);
    const portion = portionMatch ? portionMatch[1].trim() : '';

    // Extraction du temps de préparation
    const preparationTimeRegex = /Temps de préparation :([\s\S]*?)(?=Calories|CO2 moyen|$)/;
    const preparationTimeMatch = recipeText.match(preparationTimeRegex);
    const preparationTime = preparationTimeMatch ? preparationTimeMatch[1].trim() : '';

    // Extraction des calories
    const caloriesRegex = /Calories :([\s\S]*?)(?=CO2 moyen|$)/;
    const caloriesMatch = recipeText.match(caloriesRegex);
    const calories = caloriesMatch ? caloriesMatch[1].trim() : '';

    // Extraction du CO2 moyen
    const co2Regex = /CO2 moyen :([\s\S]*?)(?=Bon appétit|\n|$)/;
    const co2Match = recipeText.match(co2Regex);
    const co2 = co2Match ? co2Match[1].trim() : '';

    // Affichage des résultats
    console.log('Ingrédients:');
    console.log(ingredients);
    console.log('Étapes de préparation:');
    console.log(preparations);
    console.log('Portion:');
    console.log(portion);
    console.log('Temps de préparation:');
    console.log(preparationTime);
    console.log('Calories:');
    console.log(calories);
    console.log('CO2 moyen:');
    console.log(co2);

    let detailName = document.getElementById("detailRecette");
    let contentHtml = '';
    contentHtml += `<div class="content">
        <div class="recetteHeader">
            <img class="image-recette" src="https://img.cuisineaz.com/660x660/2015/10/01/i38134-tarte-fine-poire-et-roquefort.webp" alt="Image de la recette">
            <h2>${recipeName}</h2>
        </div>

        <div class="recetteInfo">
            <div class="sidebar">
                <div class="recetteDetail">
                    <div class="styleA">
                        <p>${calories}</p>
                        <p>${co2}</p>
                    </div>
                    <div class="styleA">
                        <p>${portion}</p>
                        <p>${preparationTime}</p>
                    </div>
                </div>
                <ul class="listIngredient">`;
    ingredients.split('\n').forEach(ingredient => {
        contentHtml += `
            <li class="ingredient">
                <p>${ingredient}</p>
            </li>
        `;
    });
    contentHtml += `</ul>
            </div>
            <ul class="recetteEtapes">`;
    preparations.split('\n').forEach(preparationStep => {
        contentHtml += `<li class="etape">
                            <p>${preparationStep}</p>
                        </li>`;
    });
    contentHtml += `</ul>
                </div>
            </div>`;
    detailName.innerHTML = contentHtml;
    $('#listRecette').hide();
    $('#detailRecette').show();
    $('#voirListeRecettes').show();
    $('#modifierFormBtn').hide();
    $('#loader').hide();
}
/* Traitement du DETAIL si echec*/
function errorDetails (error) 
{
    // Gestion des erreurs
    console.error('Erreur lors de la récupération des détails de la recette:', error.response);
    $('#loader').hide();
}

// Ajouter un gestionnaire d'événements au bouton "Voir la liste des recettes"
$(document).on('click', '#voirListeRecettes', function() {
    $('#listRecette').show();
    $('#detailRecette').hide();
    $('#voirListeRecettes').hide();
    $('#modifierFormBtn').show();
});

// Ajouter un gestionnaire d'événements au bouton "Modifier le formulaire"
$(document).on('click', '#modifierFormBtn', function() {
    $('#formIngredient').show();
    $('#listRecette').hide();
    $(this).hide();
});

/* Matomo */
  var _paq = window._paq = window._paq || [];
  /* tracker methods like "setCustomDimension" should be called before "trackPageView" */
  _paq.push(['trackPageView']);
  _paq.push(['enableLinkTracking']);
  (function() {
    var u="//localhost/matomo/";
    _paq.push(['setTrackerUrl', u+'matomo.php']);
    _paq.push(['setSiteId', '1']);
    var d=document, g=d.createElement('script'), s=d.getElementsByTagName('script')[0];
    g.async=true; g.src=u+'matomo.js'; s.parentNode.insertBefore(g,s);
  })();
/* End Matomo Code */
