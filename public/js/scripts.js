"use strict";
console.log("halloooooooo");
let etape = 0;
let btnSuivant;
let btnPrecedent;
let btnSoumettre;
let section;
let messagesJSON = {};
function afficherEtape(etape) {
    const etapes = document.querySelectorAll('section');
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
        btnSuivant?.classList.add('cacher');
        btnSoumettre?.classList.remove('cacher');
    }
}
function cacherSection() {
    section?.forEach((maSection) => {
        maSection.classList.add('cacher');
    });
}
function naviguerSuivant(event) {
    etape++;
    afficherEtape(etape);
}
function naviguerPrecedent(event) {
    console.log('naviguerPrecedent');
    if (etape > 0) {
        etape--;
        afficherEtape(etape);
    }
}
async function obtenirMessage() {
    const response = await fetch('objJSONMessages.json');
    messagesJSON = await response.json();
}
;
function validerChamps(champ) {
    let valide = false;
    // Vérifie chaque type d'erreur de validation
    if (champ.validity.valueMissing && messagesJSON?.vide) {
        // Champ obligatoire vide (attribut required)
        valide = false;
    }
    else if (champ.validity.typeMismatch && messagesJSON?.typeMismatch) {
        // Type de données incorrect (email, url, tel, etc.)
        valide = false;
    }
    else if (champ.validity.patternMismatch && messagesJSON?.patternMismatch) {
        // Ne correspond pas au pattern regex défini
        valide = false;
    }
    else if (champ.validity.valid === false) {
        // Catch-all pour toute autre erreur de validation non spécifique
        valide = false;
    }
}
function validerEtape(etape) {
    let etapeValide = false;
    switch (etape) {
        case 0:
            const prenomElement = document.getElementById('prenom');
            const nomElement = document.getElementById('nom');
            const telephoneElement = document.getElementById('telephone');
            const emailElement = document.getElementById('email');
            etapeValide;
            etapeValide = validerChamps(prenomElement) && validerChamps(nomElement) && validerChamps(nomElement);
            if (etapeValide) {
                etapeValide = validerChamps(nomElement);
            }
            if (etapeValide) {
                etapeValide = validerChamps(telephoneElement);
            }
            if (etapeValide) {
                etapeValide = validerChamps(emailElement);
            }
            break;
    }
    return etapeValide;
}
;
function initialiser() {
    const formulaire = document.getElementById("formulaire");
    if (formulaire) {
        formulaire.noValidate = true;
    }
    section = document.querySelectorAll('section');
    cacherSection();
    btnSuivant = document.getElementById('bouton-suivant');
    btnPrecedent = document.getElementById('bouton-precedent');
    btnSoumettre = document.getElementById('bouton-soumettre');
    if (btnPrecedent) {
        btnPrecedent.addEventListener('click', naviguerPrecedent);
    }
    ;
    if (btnSuivant) {
        btnSuivant.addEventListener('click', naviguerSuivant);
    }
    ;
    afficherEtape(0);
    obtenirMessage();
}
document.addEventListener('DOMContentLoaded', () => {
    initialiser();
});
