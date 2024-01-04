/* Votre JavaScript ici */

/* Ingrédient API */
// URL de l'API à appeler
const apiUrl = 'http://localhost:8000/api/ingredients'; //2 changer url openai

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
    })
    divName.innerHTML = htmlContent;
    $('#formIngredient').hide();
    $('#listRecette').show();
    $('#modifierFormBtn').show();
}

function echec (error) 
{
    // Gestion des erreurs
    console.error('Erreur lors de la récupération des données:', error.response);
}

$(document).on('click', '#modifierFormBtn', function() {
    $('#formIngredient').show();
    $('#listRecette').hide();
    $(this).hide();
});

/* Fonction pour faire la liste des ingrédients renseignés dans le formulaire d'ingrédient */
$(document).ready(function() {

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

        axios.post(apiUrl, params).then(reussite).catch(echec);
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


/**
 * Partie pour la liste des recettes
 */






/**
 * Partie pour le détail des recettes
 */