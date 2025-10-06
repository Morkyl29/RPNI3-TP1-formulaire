"use strict";
// variables globale 
let etape = 0;
let btnSuivant;
let btnPrecedent;
let btnSoumettre;
let section;
let navEtapes;
let messagesJSON;
//  Afficher l'étape sinon mettre la classe cacher 
function afficherEtape(etape) {
    const etapes = document.querySelectorAll('section');
    // console.log(etapes);
    cacherSection();
    if (etape >= 0 && etape < etapes.length) {
        etapes[etape].classList.remove('cacher');
    }
    if (etape === 0) {
        btnPrecedent?.classList.add('cacher');
        btnSuivant?.classList.remove('cacher');
        btnSoumettre?.classList.add('cacher');
    }
    else if (etape === 1) {
        btnPrecedent?.classList.remove('cacher');
        btnSuivant?.classList.remove('cacher');
        btnSoumettre?.classList.add('cacher');
    }
    else if (etape === 2) {
        btnPrecedent?.classList.remove('cacher');
        btnSuivant?.classList.remove('cacher');
        btnSoumettre?.classList.add('cacher');
    }
    else if (etape === 3) {
        btnPrecedent?.classList.remove('cacher');
        btnSuivant?.classList.add('cacher');
        btnSoumettre?.classList.remove('cacher');
    }
}
//  Cacher les étapes 
function cacherSection() {
    section?.forEach((maSection) => {
        maSection.classList.add('cacher');
    });
}
// etape 4 avec les confirmations 
function confirmerEtape() {
    const ul = document.querySelector('.etape4__ul');
    const formulaire = document.getElementById("formulaire");
    if (!ul || !formulaire)
        return;
    // Vider la liste avant de la remplir
    ul.innerHTML = "";
    // Récupérer tous les champs du formulaire
    const champs = formulaire.querySelectorAll("input, select, textarea");
    champs.forEach((champ) => {
        let valeur = "";
        // savoir si le champ est selectionné
        if (champ.type === "checkbox" || champ.type === "radio") {
            if (!champ.checked)
                return; // on saute ceux non cochés
            valeur = champ.value;
        }
        else {
            valeur = champ.value;
        }
        // On ignore les champs cachés
        if (champ.classList.contains("cacher"))
            return;
        // créer un li pour le récapitulatif 
        let li = document.createElement("li");
        li.textContent = `${champ.name || champ.id} : ${valeur}`;
        ul.appendChild(li);
    });
}
// Naviguer à l'étape suivant 
function naviguerSuivant(event) {
    event.preventDefault(); // ne pas rafraichir la page 
    if (validerEtape(etape)) {
        const lien = navEtapes[etape + 1].querySelector('a');
        const lienPrecedent = navEtapes[etape].querySelector('a');
        console.log(lien);
        // si le lien n'est pas precedent alors tu rajoute des class et tu enlève inactive
        if (lien) {
            lien.ariaDisabled = "true";
            lien.classList.remove("etapes__item--inactive");
            lien.classList.remove("inactive");
            lien.classList.add("etapes__item--active");
        }
        // si le lien peut aller au precedent alors tu rajoute des class inactive
        else if (lienPrecedent) {
            lienPrecedent.ariaDisabled = "false";
            lienPrecedent.classList.add("etapes__item--inactive");
            lienPrecedent.classList.remove("etapes__item--active");
        }
        etape++; //etape suivante 
        // si etape est a la dernière alors tu confirme 
        if (etape === 3) {
            confirmerEtape();
        }
        afficherEtape(etape);
    }
}
// Naviguer à l'étape précédente 
function naviguerPrecedent(event) {
    console.log('naviguerPrecedent');
    // si l'étape est plus grand que 0 alors tu peut réduire 
    if (etape > 0) {
        etape--; //etape précédente 
        navEtapes.forEach((li, event) => {
            const lien = li.querySelector('a');
            if (event > etape) {
                lien.ariaDisabled = "true";
                lien.classList.add("inactive");
                lien.classList.remove("etapes__item--active");
                lien.classList.add("etapes__item--inactive");
            }
            else {
                lien.ariaDisabled = "false";
                lien.classList.remove("inactive");
                lien.classList.add("etapes__item--active");
                lien.classList.remove("etapes__item--inactive");
            }
        });
        afficherEtape(etape);
    }
}
// chercher les messages dans le Json 
async function obtenirMessage() {
    const response = await fetch('objJSONMessages.json');
    messagesJSON = await response.json();
}
;
// Valider les champs 
// si il y a une erreur alors tu affiche un message dans le span 
function validerChamps(champ) {
    let valide = false;
    const id = champ.id; // email
    const idMessageErreur = "erreur-" + id; // erreur-email
    const labelErreur = "label-" + id;
    const erreurElement = document.getElementById(idMessageErreur);
    const erreurLabel = document.getElementById(labelErreur);
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesJSON[id]?.vide) {
        console.log('erreur', id);
        valide = false;
        erreurElement.innerText = messagesJSON[id]?.vide;
        erreurLabel.classList.add("erreur");
    }
    else if (champ.validity.typeMismatch && messagesJSON[id].type) {
        // Type de données incorrect (email, url, tel, etc.)
        valide = false;
        erreurElement.innerText = messagesJSON[id]?.type;
        erreurLabel.classList.add("erreur");
    }
    else if (champ.validity.patternMismatch && messagesJSON[id]?.pattern) {
        // Ne correspond pas au pattern regex défini
        valide = false;
        erreurElement.innerText = messagesJSON[id]?.pattern;
        erreurLabel.classList.add("erreur");
    }
    else {
        // La validation n'a pas d'erreur, donc on assigne la variable vraie
        valide = true;
        erreurElement.innerText = "";
    }
    return valide;
}
function validerEmail(champ) {
    let valide = false;
    const id = "email";
    const leEmail = champ.value;
    const idMessageErreur = "erreur-" + id; // erreur-email
    const erreurElement = document.getElementById(idMessageErreur);
    // adresse email suspicieux 
    const tldSuspicieux = [
        '.ru',
        '.cn',
        'click',
        '.party',
    ];
    // corrige les erreur commune
    const erreursCommune = {
        'hotnail': 'hotmail',
    };
    const tldValide = tldSuspicieux.some((tld) => {
        const contientSuspect = leEmail.toLowerCase().endsWith(tld);
        return contientSuspect;
    });
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesJSON[id]?.vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
        erreurElement.innerText = messagesJSON[id]?.vide; //message s'affiche selon l'id
    }
    else if (champ.validity.typeMismatch && messagesJSON[id]?.type) {
        // Type de données incorrect (email, url, tel, etc.)
        valide = false;
        erreurElement.innerText = messagesJSON[id]?.type; //message s'affiche selon l'id
    }
    else if (champ.validity.patternMismatch && messagesJSON[id]?.pattern) {
        // Ne correspond pas au pattern regex défini
        valide = false;
        erreurElement.innerText = messagesJSON[id]?.pattern; //message s'affiche selon l'id
    }
    else if (tldValide && messagesJSON[id].tldSuspicieux) {
        valide = false;
        erreurElement.innerText = messagesJSON[id].tldSuspicieux; //message s'affiche selon l'id
    }
    else {
        const erreursCles = Object.keys(erreursCommune);
        const erreurCle = erreursCles.find((domaine) => {
            return leEmail.toLowerCase().includes(domaine);
        });
        valide = true;
    }
    return valide;
}
// cocher Entreprise pour afficher un champs 
function cocherEntreprise() {
    let entreprise = document.getElementById('entreprise');
    let champEntreprise = document.getElementById('entrepriseInput');
    let labelEntreprise = document.getElementById('label-entreprise');
    console.log(entreprise.checked);
    // si entreprise est check alors on enlève la class cacher sinon on la met
    if (entreprise && entreprise.checked) {
        // console.log('La case est cochée !');
        champEntreprise.classList.remove('cacher');
        labelEntreprise.classList.remove('cacher');
    }
    else {
        // console.log('La case n\'est pas cochée.');
        champEntreprise.classList.add('cacher');
        labelEntreprise.classList.add('cacher');
    }
}
// on valide l'étape pour aller a la suivante 
function validerEtape(etape) {
    let etapeValide = false;
    switch (etape) {
        case 0: //etape 1
            const montantElement = document.getElementById('montant');
            etapeValide =
                validerChamps(montantElement);
            break;
        case 1: //etape 2
            const prenomElement = document.getElementById('prenom');
            const nomElement = document.getElementById('nom');
            const telephoneElement = document.getElementById('telephone');
            const emailElement = document.getElementById('email');
            const villeElement = document.getElementById('ville');
            const nCiviqueElement = document.getElementById('nCivique');
            const nRueElement = document.getElementById('nRue');
            const cPostalElement = document.getElementById('cPostal');
            // on va vérifier chaque élément du formulaire pour la valider 
            etapeValide =
                validerChamps(prenomElement)
                    && validerChamps(nomElement)
                    && validerChamps(telephoneElement)
                    && validerEmail(emailElement)
                    && validerChamps(villeElement)
                    && validerChamps(nCiviqueElement)
                    && validerChamps(nRueElement)
                    && validerChamps(cPostalElement);
            break;
        case 2: //etape 3
            let titulaireElement = document.getElementById('titulaire');
            ;
            let numCarteElement = document.getElementById('numCarte');
            let dateExpirationElement = document.getElementById('expiration');
            let cvcElement = document.getElementById('codeSecurite');
            etapeValide =
                validerChamps(titulaireElement)
                    && validerChamps(numCarteElement)
                    && validerChamps(dateExpirationElement)
                    && validerChamps(cvcElement);
            break;
    }
    return etapeValide; //retourne l'étape si elle est valide avec true 
}
;
// on initialise le formulaire
function initialiser() {
    const formulaire = document.getElementById("formulaire");
    navEtapes = document.querySelectorAll('.etapes__li');
    // pour chaque etape de la navigation on vas vérifier si il est clickable ou non 
    navEtapes.forEach((li, event) => {
        const lien = li.querySelector('a');
        if (event === 0) {
            lien.ariaDisabled = "false";
            lien.classList.remove("inactive");
        }
        else {
            lien.ariaDisabled = "true";
            lien.classList.add("inactive");
        }
    });
    if (formulaire) {
        formulaire.noValidate = true;
    }
    // on va cacher les sections 
    section = document.querySelectorAll('section');
    cacherSection();
    btnSuivant = document.getElementById('bouton-suivant');
    btnPrecedent = document.getElementById('bouton-precedent');
    btnSoumettre = document.getElementById('bouton-soumettre');
    // chaque bouton est clickable et appel la fonction associé
    if (btnPrecedent) {
        btnPrecedent.addEventListener('click', naviguerPrecedent);
    }
    ;
    if (btnSuivant) {
        btnSuivant.addEventListener('click', naviguerSuivant);
    }
    ;
    let entreprise = document.getElementById('entreprise');
    if (entreprise) {
        entreprise.addEventListener("click", cocherEntreprise);
    }
    let personnel = document.getElementById('personnel');
    if (personnel) {
        personnel.addEventListener("click", cocherEntreprise);
    }
    // on affiche l'étape 
    afficherEtape(0);
    // on affiche le message si besoin 
    obtenirMessage();
}
// on initialise le formulaire au chaegement de la page 
document.addEventListener('DOMContentLoaded', () => {
    initialiser();
});
