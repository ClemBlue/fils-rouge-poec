/* Votre JavaScript ici */

/* Fonction pour faire la liste des ingrédients renseignés dans le formulaire d'ingrédient */
$(document).ready(function() {
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

        var boutonModifier = $('<button class="btn btn-primary">Modifier</button>').click(function() {
            ingredientAModifierIndex = $(this).parent().index(); // Stocke l'index de l'ingrédient à modifier

            // Affiche une modale pour modifier l'ingrédient
            $('#modal').show();
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
            co2: $('#co2').is(':checked'),
            calorie: $('#calorie').is(':checked')
        };

        // Affichage des données dans la console
        console.log(formData);
    });

    //Modal pour modifier l'ingrédient
    $('#modifierForm').submit(function(event) {
        event.preventDefault();
        var nouvelIngredient = {
            ingredient: $('#modifierIngredient').val(),
            quantite: $('#modifierQuantite').val(),
            unite: $('#modifierUnite').val()
        };
        listeIngredients[ingredientAModifierIndex] = nouvelIngredient; // Mise à jour de l'ingrédient dans la liste
        $('#modal').hide(); // Cache la modale après la modification
        actualiserListeIngredients(); // Actualise la liste visuelle des ingrédients
    });
});
