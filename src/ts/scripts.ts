console.log("halloooooooo");
let etape:number = 0;
let btnSuivant: HTMLButtonElement | null;
let btnPrecedent: HTMLButtonElement | null;
let btnSoumettre: HTMLButtonElement | null;
let section: NodeListOf<HTMLElement> | null;
interface ErreurJson{
    vide:string;
    pattern:string;
}
let messagesJSON = {};


function afficherEtape(etape:number):void{
    const etapes = document.querySelectorAll('section');

    cacherSection();

    if (etape >= 0 && etape < etapes.length) {
        etapes[etape].classList.remove('cacher');
    }

    if(etape === 0){
        btnPrecedent?.classList.add('cacher');
        btnSuivant?.classList.remove('cacher');
        btnSoumettre?.classList.add('cacher');
    }
    else if(etape === 1){
        btnPrecedent?.classList.remove('cacher');
        btnSuivant?.classList.remove('cacher');
        btnSoumettre?.classList.add('cacher');
    }
    else if(etape === 2){
        btnPrecedent?.classList.remove('cacher');
        btnSuivant?.classList.add('cacher');
        btnSoumettre?.classList.remove('cacher');
    }
}


function cacherSection(){

    section?.forEach((maSection)=> {
        maSection.classList.add('cacher');
    });
}

function naviguerSuivant(event: MouseEvent):void{
        etape++;
        afficherEtape(etape);
    
}
function naviguerPrecedent(event: MouseEvent):void{
    console.log('naviguerPrecedent');
    if(etape > 0){
        etape--;
        afficherEtape(etape);
    }
}


async function obtenirMessage(){
    const response = await fetch('objJSONMessages.json');
    messagesJSON = await response.json();

};

function validerChamps(champ: HTMLInputElement): boolean{
    let valide = false;
// Vérifie chaque type d'erreur de validation
if (champ.validity.valueMissing && messagesJSON?.vide) {
    // Champ obligatoire vide (attribut required)
    valide = false;
}else if (champ.validity.typeMismatch && messagesJSON?.typeMismatch) {
    // Type de données incorrect (email, url, tel, etc.)
    valide = false;
} else if (champ.validity.patternMismatch && messagesJSON?.patternMismatch) {
    // Ne correspond pas au pattern regex défini
    valide = false;
} else if (champ.validity.valid === false) {
    // Catch-all pour toute autre erreur de validation non spécifique
    valide = false;
}

}

function validerEtape(etape:number): boolean{
    let etapeValide = false;
    switch(etape){
        case 0:
            const prenomElement = document.getElementById('prenom') as HTMLInputElement;
            const nomElement = document.getElementById('nom')as HTMLInputElement;
            const telephoneElement = document.getElementById('telephone')as HTMLInputElement;
            const emailElement = document.getElementById('email')as HTMLInputElement;
        
            etapeValide
            etapeValide = validerChamps(prenomElement) && validerChamps(nomElement) && validerChamps(nomElement);

            if(etapeValide){
                etapeValide = validerChamps(nomElement);
            }
            if(etapeValide){
                etapeValide = validerChamps(telephoneElement);
            }
            if(etapeValide){
                etapeValide = validerChamps(emailElement);
            }
        break;
    }
    return etapeValide;
};

function initialiser():void{
    const formulaire: HTMLFormElement | null = document.getElementById("formulaire") as HTMLFormElement;
    if(formulaire){
        formulaire.noValidate = true
    }

    section = document.querySelectorAll('section');
    cacherSection();

    btnSuivant = document.getElementById('bouton-suivant') as HTMLButtonElement;
    btnPrecedent = document.getElementById('bouton-precedent') as HTMLButtonElement;
    btnSoumettre = document.getElementById('bouton-soumettre') as HTMLButtonElement;

    if(btnPrecedent){
        btnPrecedent.addEventListener('click', naviguerPrecedent);
    };
    if(btnSuivant){
        btnSuivant.addEventListener('click', naviguerSuivant);
    };

    afficherEtape(0);
    obtenirMessage()
}


document.addEventListener('DOMContentLoaded', ():void => {
    initialiser();

})