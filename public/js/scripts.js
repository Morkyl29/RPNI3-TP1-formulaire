"use strict";
console.log("halloooooooo");
let etape = 0;
let btnSuivant;
let btnPrecedent;
let btnSoumettre;
let section;
let messagesJSON;
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
    event.preventDefault();
    if (validerEtape(etape)) {
        etape++;
        afficherEtape(etape);
    }
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
    const tldSuspicieux = [
        '.ru',
        '.cn',
        'click',
        '.party',
    ];
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
        erreurElement.innerText = messagesJSON[id]?.vide;
    }
    else if (champ.validity.typeMismatch && messagesJSON[id]?.type) {
        // Type de données incorrect (email, url, tel, etc.)
        valide = false;
        erreurElement.innerText = messagesJSON[id]?.type;
    }
    else if (champ.validity.patternMismatch && messagesJSON[id]?.pattern) {
        // Ne correspond pas au pattern regex défini
        valide = false;
        erreurElement.innerText = messagesJSON[id]?.pattern;
    }
    else if (tldValide && messagesJSON[id].tldSuspicieux) {
        valide = false;
        erreurElement.innerText = messagesJSON[id].tldSuspicieux;
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
function validerEtape(etape) {
    let etapeValide = false;
    switch (etape) {
        case 0:
            const montantElement = document.getElementById('montant');
            etapeValide =
                validerChamps(montantElement);
            break;
        case 1:
            const prenomElement = document.getElementById('prenom');
            const nomElement = document.getElementById('nom');
            const telephoneElement = document.getElementById('telephone');
            const emailElement = document.getElementById('email');
            const villeElement = document.getElementById('ville');
            const nCiviqueElement = document.getElementById('nCivique');
            const nRueElement = document.getElementById('nRue');
            const cPostalElement = document.getElementById('cPostal');
            etapeValide =
                validerChamps(prenomElement)
                    && validerChamps(nomElement)
                    && validerChamps(telephoneElement)
                    && validerEmail(emailElement)
                    && validerChamps(villeElement)
                    && validerChamps(nCiviqueElement)
                    && validerChamps(nRueElement)
                    && validerChamps(cPostalElement);
            // if(etapeValide){
            //     etapeValide = validerChamps(prenomElement);
            // } 
            // if(etapeValide){
            //     etapeValide = validerChamps(nomElement);
            // } 
            // if(etapeValide){ 
            //     etapeValide = validerChamps(telephoneElement); 
            // } if(etapeValide){ 
            //     etapeValide = validerChamps(emailElement); 
            // }
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
    // btnSuivant.addEventListener('input', validerEtape(etape));
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
