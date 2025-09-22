"use strict";
console.log("halloooooooo");
let etape = 0;
let btnSuivant;
let btnPrecedent;
let btnSoumettre;
let section;
let navEtapes;
let messagesJSON;
function afficherEtape(etape) {
    const etapes = document.querySelectorAll('section');
    console.log(etapes);
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
        let li = document.createElement("li");
        li.textContent = `${champ.name || champ.id} : ${valeur}`;
        ul.appendChild(li);
    });
}
function naviguerSuivant(event) {
    event.preventDefault();
    if (validerEtape(etape)) {
        const lien = navEtapes[etape + 1].querySelector('a');
        const lienPrecedent = navEtapes[etape].querySelector('a');
        console.log(lien);
        if (lien) {
            lien.ariaDisabled = "false";
            lien.classList.remove("etapes__item--inactive");
            lien.classList.remove("inactive");
            lien.classList.add("etapes__item--active");
        }
        if (lienPrecedent) {
            lienPrecedent.ariaDisabled = "false";
            lienPrecedent.classList.add("etapes__item--inactive");
            lienPrecedent.classList.remove("etapes__item--active");
        }
        etape++;
        if (etape === 3) {
            confirmerEtape();
        }
        afficherEtape(etape);
    }
}
function naviguerPrecedent(event) {
    console.log('naviguerPrecedent');
    if (etape > 0) {
        etape--;
        navEtapes.forEach((li, event) => {
            const lien = li.querySelector('a');
            if (event > etape) {
                lien.ariaDisabled = "true";
                // lien.classList.add("inactive");
                lien.classList.remove("etapes__item--active");
                lien.classList.add("etapes__item--inactive");
            }
            else {
                lien.classList.remove("inactive");
                lien.classList.add("etapes__item--active");
                lien.classList.remove("etapes__item--inactive");
            }
        });
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
function cocherEntreprise() {
    let entreprise = document.getElementById('entreprise');
    let champEntreprise = document.getElementById('entrepriseInput');
    let labelEntreprise = document.getElementById('label-entreprise');
    console.log(entreprise.checked);
    if (entreprise && entreprise.checked) {
        console.log('La case est cochée !');
        champEntreprise.classList.remove('cacher');
        labelEntreprise.classList.remove('cacher');
    }
    else {
        console.log('La case n\'est pas cochée.');
        champEntreprise.classList.add('cacher');
        labelEntreprise.classList.add('cacher');
    }
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
            break;
        case 2:
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
    return etapeValide;
}
;
function initialiser() {
    const formulaire = document.getElementById("formulaire");
    navEtapes = document.querySelectorAll('.etapes__li');
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
    let entreprise = document.getElementById('entreprise');
    if (entreprise) {
        entreprise.addEventListener("click", cocherEntreprise);
    }
    let personnel = document.getElementById('personnel');
    if (personnel) {
        personnel.addEventListener("click", cocherEntreprise);
    }
    afficherEtape(0);
    obtenirMessage();
}
document.addEventListener('DOMContentLoaded', () => {
    initialiser();
});
