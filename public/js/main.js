/* Votre JavaScript ici */

/* Ingrédient API */
// URL de l'API à appeler
const apiUrl = 'http://localhost:8000/api/ingredients';
const apiDetailUrl = 'http://localhost:8000/api/recettes'

var ingredientsList = [];

searchIngredients = [];

function reussiteGetIngredient ( data ) 
{
    data.data.forEach(i => {
        ingredientsList[i.name] = i.img;
    });
    console.log(Object.keys(ingredientsList));
    autoCompleteIngredients(ingredientsList);
}
function reussite ( data ) 
{
    console.log(data);
     // Traitement des données de la réponse
    let recipes = data.data.recettes; // 7 recupere la reponse 
    console.log('recipes');
    console.log(recipes);
    let divName = document.getElementById( "listRecette" );
    let htmlContent = '';
    recipes.forEach(recipe => {
    htmlContent += `<div class="card" style="width: 15rem; margin-bottom: 1rem;">
    <img src="https://img.cuisineaz.com/1024x768/2013/12/20/i18391-poule-au-pot-et-riz-long.jpeg"
        class="imgA" alt="poule au pot l'ancienne">
    <div class="card-body">
        <h5 class="card-title titre">${recipe.nom}</h5>
        
        <a href="" class="btn btn-primary"> Voir recette </a>
    </div>
    </div>`;
    });
    divName.innerHTML = htmlContent;
    $('#formIngredient').hide();
    $('#listRecette').show();
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
                    <button class="btn btn-primary details"> Voir recette </button>
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

function echec (error) 
{
    // Gestion des erreurs
    console.error('Erreur lors de la récupération des données:', error.response);
    $('#loader').hide();
}

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

// Ajouter un gestionnaire d'événements au bouton "Voir la liste des recettes"
$(document).on('click', '#voirListeRecettes', function() {
    $('#listRecette').show();
    $('#detailRecette').hide();
    $('#voirListeRecettes').hide();
    $('#modifierFormBtn').show();
});

function errorDetails (error) 
{
    // Gestion des erreurs
    console.error('Erreur lors de la récupération des détails de la recette:', error.response);
    $('#loader').hide();
}



$(document).on('click', '#modifierFormBtn', function() {
    $('#formIngredient').show();
    $('#listRecette').hide();
    $(this).hide();
});

function autoCompleteIngredients(ingredientsList) {
    console.log(ingredientsList);
    if (ingredientsList != null) {
        var isSelected = false; // Flag to check if a valid option is selected

        $("#autocompleteSearch").autocomplete({
            position: { my : "left top", at: "left bottom", collision: "flip" },
            source: Object.keys(ingredientsList),
            select: function(event, ui) {
                isSelected = true; // Set flag to true when a valid option is selected
                $("#selectedOptions").append("<li class='list-group-item' style='background-size: cover; background-image:url(" + ingredientsList[ui.item.value] + ")'><span class='ingredient-item'>" + ui.item.value + " </span><button type='button' class='btn btn-sm btn-danger remove-item'>X</button></li>");
                searchIngredients.push(ui.item.value);
                if (searchIngredients.length > 2) {
                    $("#searchIngredientButton").show();
                }
                $(this).val('');
                return false;
            },
            change: function(event, ui) {
                if (!isSelected && ingredientsList != null) {
                    $(this).val(""); // Clear the input if the value is not from the list
                }
                isSelected = false; // Reset the flag for the next selection
            }
        });
    } else {
        $("#autocompleteSearch").autocomplete({disabled: true});
    }
}


/* Fonction pour faire la liste des ingrédients renseignés dans le formulaire d'ingrédient */
$(document).ready(function() {

    axios.get(apiUrl).then(reussiteGetIngredient).catch(echec);

    $("#selectedOptions").on("click", ".remove-item", function(){
        li = $(this).closest('li');
        searchIngredients.splice(searchIngredients.indexOf(li.text) - 1, 1);
        li.remove(); // Supprime l'élément de liste
        if (searchIngredients.length <= 2) {
            $("#searchIngredientButton").hide();
        }
    });
        
    $("#searchType").select2({
        minimumResultsForSearch: Infinity
    });
    $("#searchType").on('select2:select', function() {
        if ($(this).val() === "ingredients") {
            // Activer l'autocomplétion pour les ingrédients
            autoCompleteIngredients(ingredientsList);
        } else {
            // Désactiver l'autocomplétion pour les recettes
            autoCompleteIngredients(null);
        }
    });   

    $('#listRecette').hide();

    var listeIngredients = [];
    var listeMotsCles = [];

    // Fonction pour ajouter un ingrédient à la liste visuelle et à la liste JavaScript
    function ajouterIngredient(ingredient, quantite, unite) {
        // Création de la structure HTML de l'ingrédient avec les boutons Supprimer et Modifier
        var nouvelIngredient = $('<div class="ingredient flex"><p>' + ingredient + ' ' + quantite + ' ' + unite + '</p></div>');

        var boutonSupprimer = $('<button class="btn btn-primary">Supprimer</button>').click(function() {
            // Suppression visuelle de l'ingrédient et suppression de l'élément correspondant dans la liste JavaScript
            var index = $(this).parent().index();
            $(this).parent().remove();
            listeIngredients.splice(index, 1);
        });

        var boutonModifier = $('<button class="btn btn-primary" data-toggle="modal" data-target="#modal">Modifier</button>').click(function() {
            ingredientAModifierIndex = $(this).parent().index(); // Stocke l'index de l'ingrédient à modifier

            // Affiche une modale pour modifier l'ingrédient
            $('#modal').modal('show');
            $('#modifierIngredient').val(listeIngredients[ingredientAModifierIndex].ingredient);
            $('#modifierQuantite').val(listeIngredients[ingredientAModifierIndex].quantite);
            $('#modifierUnite').val(listeIngredients[ingredientAModifierIndex].unite);
        });

        // Ajout des boutons à l'élément d'ingrédient et ajout à la liste visuelle
        nouvelIngredient.append(boutonSupprimer).append(boutonModifier);
        $('#liste_ingredients').append(nouvelIngredient);

    }

    function actualiserListeIngredients() {
        $('#liste_ingredients').empty(); // Vider la liste visuelle

        // Reconstruire la liste visuelle à partir des données dans listeIngredients
        listeIngredients.forEach(function(ingredient) {
            ajouterIngredient(ingredient.ingredient, ingredient.quantite, ingredient.unite);
        });
    }
    function actualiserListeMotsCles() {
        $('#liste_mots_cles').empty();

        listeMotsCles.forEach(function(motCle) {
            var nouvelElement = $('<div class="mot-cle"><p>' + motCle + '</p><button class="supprimer btn btn-primary">Supprimer</button></div>');

            nouvelElement.find('.supprimer').click(function() {
                var index = $(this).parent().index();
                $(this).parent().remove();
                listeMotsCles.splice(index, 1);
            });

            $('#liste_mots_cles').append(nouvelElement);
        });
    }
    $('#ajouterMotCle').on('click', function() {
        var motCle = $('#mots_cles').val();

        if (motCle !== '') {
            listeMotsCles.push(motCle);
            $('#mots_cles').val('');
            actualiserListeMotsCles();
        } else {
            alert('Veuillez entrer un mot-clé.');
        }
    });


    // Gestionnaire d'événement pour le bouton "Ajouter"
    $('#ajouter').on('click', function() {
        var ingredient = $('#ingredient').val();
        var quantite = $('#quantite').val();
        var unite = $('#unite').val();

        if (ingredient !== '' && quantite !== '') {
            // Appel de la fonction pour ajouter l'ingrédient à la liste visuelle et à la liste JavaScript
            ajouterIngredient(ingredient, quantite, unite);

            // Ajout de l'ingrédient à la liste JavaScript
            var nouvelIngredientObj = {
                ingredient: ingredient,
                quantite: quantite,
                unite: unite
            };
            listeIngredients.push(nouvelIngredientObj);

            // Réinitialisation des champs après l'ajout de l'ingrédient
            $('#ingredient').val('');
            $('#quantite').val('');
            $('#unite').val('grammes');
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
            portions: $('#portions').val(),
            mots_cles: listeMotsCles,
        };
        const params = {
            ingredients: formData.ingredient.map(item => {
                return {
                    "label": item.ingredient,
                    "quantity": parseFloat(item.quantite), // Convertir en nombre si nécessaire
                    "unit": item.unite
                };
            }),
            portions: formData.portions,
            motscles: formData.mots_cles.map(item => {
                return {
                    "nom": item,
                }
            })
        };
        console.log('params');
        console.log(params);
        $('#loader').show();
        axios.post(apiUrl, params).then(reussite).catch(echec);
    });

    $('#searchIngredientButton').click(function(event) {
        event.preventDefault(); // Empêche l'envoi du formulaire par défaut

        if (searchIngredients.length > 2) {
            // Récupération des valeurs du formulaire
            var formData = {
                ingredient: searchIngredients,
            };
            const params = {
                ingredients: formData.ingredient.map(item => {
                    return {
                        "label": item
                    };
                }),
            };
            console.log('params');
            console.log(params);
            axios.post(apiUrl, params).then(reussite).catch(echec);
        }
    });

    $('#btnModifier').on('click', function() {
        ingredientAModifierIndex = $(this).parent().index();
        $('#modifierIngredient').val(listeIngredients[ingredientAModifierIndex].ingredient);
        $('#modifierQuantite').val(listeIngredients[ingredientAModifierIndex].quantite);
        $('#modifierUnite').val(listeIngredients[ingredientAModifierIndex].unite);
        $('#modal').modal('show'); // Utilisation de la méthode Bootstrap pour afficher la modale
    });

    // Gestionnaire d'événement pour la soumission du formulaire de modification
    $('#modifierForm').submit(function(event) {
        event.preventDefault();
        var nouvelIngredient = {
            ingredient: $('#modifierIngredient').val(),
            quantite: $('#modifierQuantite').val(),
            unite: $('#modifierUnite').val()
        };
        listeIngredients[ingredientAModifierIndex] = nouvelIngredient;
        $('#modal').modal('hide'); // Utilisation de la méthode Bootstrap pour cacher la modale après la modification
        actualiserListeIngredients();
    });
});
