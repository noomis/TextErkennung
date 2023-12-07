let urlValue = [];
let urlProbability = [];
let mailValue = [];
let mailProbability = [];
let w3wValue = [];
let w3wProbability = [];

const knownTLD = ["com", "net", "org", "de", "eu", "at", "ch", "nl", "pl", "fr", "es", "info", "name", "email"];


document.getElementById("button").addEventListener("click", function () {
    let text = document.getElementById("text").value;

    let lines = text.split("\n");

    lines.forEach(element => {

        checkW3W(element); //Luke
        checkUrl(element); //Lars
        checkMail(element); //Simon
        checkCompanyName(element); //Simon
        checkName(element); //Lars
        checkFax(element); //Luke
        checkPhone(element); //Simon
        checkStreet(element); //Luke
        checkCity(element); //Lars

    });
});



function checkW3W(inputLine) {
    // Test
    let words = inputLine.split(" ");
    inputLine = inputLine.toLowerCase();
    let allHits = [];
    let prob = 0;
    const blacklist = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', '{', '}', '[', ']', '|', ';', ':', "'", '"', '<', '>', ',', '?', '`', '~', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ä', 'ü', 'ö'];

    words: for (let i = 0; i < words.length; i++) {
        const element = words[i];
        let countDot = 0;
        let lineChars = words[i].split("");

        for (let b = 0; b < blacklist.length; b++) {
            if (words[i].includes(blacklist[b])) {
                continue words;
            }
        }

        // Url ausschließen
        if (words[i].includes("http") || words[i].includes("https") || words[i].includes("www")) {
            continue;
        }


        lineChars.forEach(e => {
            if (e == ".") {
                countDot++;
            }
        });

        if (countDot == 2) {
            let wordLength = words[i].split(".");

            for (let t = 0; t < wordLength.length; t++) {
                if (wordLength[t].length < 2) {
                    return;
                } else if (wordLength[t].length <= 44) { // TODO w3w max wort länge
                    prob += 20;
                }
            }
        } else {
            continue;
        }

        // überprüfen ob 2 Punkte
        if (countDot == 2) {
            prob += 30;
        }

        if (i !== 0) {
            let wordBefore = words[i - 1].toLowerCase();
            // Checkt ob vor der w3w z.B. w3w steht.
            if (wordBefore.includes("w3w") || wordBefore.includes("what 3 words") || wordBefore.includes("what3words") || 
            wordBefore.includes("position") || wordBefore.includes("///")) {
                prob += 5;
            }
        }

        if (words[i].startsWith("///")) {
            prob += 5;
        }

        console.log(element + ": ist mit " + prob + "% Wahrscheinlichkeit eine w3w Adresse");
        w3wValue.push(element);
        w3wProbability.push(prob);
    }
}

function checkUrl(inputLine) {
    //alle wörter klein und in neuen array
    inputLine = inputLine.toLowerCase();
    let words = inputLine.split(" ");
    //alle bekannten TLDs

    //for-Schleife die alle Worte vom Input durchläuft
    for (let i = 0; i < words.length; i++) {
        const element = words[i];
        let allHits = [];
        let prob = 0;
        for (const tld of knownTLD) {
            if (element.endsWith("." + tld)) {
                allHits.push("tld");
            }
        }
        //überprüfung ob gewisse Kriterien erfüllt sind
        if (element.startsWith("http")) {
            allHits.push("http");
        }

        if (element.includes("://") == true) {
            allHits.push("://");
        }

        if (element.includes("www.") == true) {
            allHits.push("www.");
        }

        if (element.includes("ö") == true) {
            allHits.push("negativ");
        }

        // negativ mit return ersetzen (LUKE)
        if (element.includes("ä") == true) {
            allHits.push("negativ");
        }

        if (element.includes("ü") == true) {
            allHits.push("negativ");
        }

        if (element.includes("ß") == true) {
            allHits.push("negativ");
        }

        if (element.includes("@") == true) {
            allHits.push("negativ");
        }

        //Punktevergabe

        // Wieso fügst du die Punkte nicht direkt oben hinzu, dann würdest du dir fast alle folgenden IF Abfragen sparen :) - Simon

        if (allHits.includes("negativ") == true) {
            prob = -150;
        }

        if (allHits.includes("tld") == true) {
            prob += 20;
        }

        if (allHits.includes("www.") == true) {
            prob += 70;
        }

        if (allHits.includes("://") == true) {
            prob += 10;
        }

        if (allHits.includes("http") == true) {
            prob += 30;
        }

        if (prob > 100) {
            prob = 100;
        }

        if (prob < 0) {
            prob = 0;
        }
        //push in globalen Array
        urlValue.push(element);
        urlProbability.push(prob);
        //output
        if (prob > 80) {
            let indexes = urlValue.indexOf(element);
            let newUrlObject = document.createElement("p");
            newUrlObject.innerHTML = '"' + element + '"' + " zu " + urlProbability[indexes] + "% eine URL";
            document.body.appendChild(newUrlObject);
        }

    }
}

function checkMail(inputLine) {
    inputLine = inputLine.toLowerCase();
    let lineWords = inputLine.split(" ");

    wordLoop: for (let index = 0; index < lineWords.length; index++) {
        let wordProb = 0;
        let atHit = [];
        let dotHit = [];
        let hasTLD = false;

        const element = lineWords[index];
        let wordChars = element.split("");

        knownTLD.forEach(tld => {           
            if (element.endsWith("." + tld)) {  // Checkt ob TLD vorhanden ist
                hasTLD = true;
            }
        });

        if (element.startsWith('@')) { // Checkt String mit @ beginnt
            continue wordLoop;
          }
          else {
            wordProb += 5;
        }

        if (element.length < 6) {   // Checkt ob mindestens 6 Zeichen vorhanden sind
            continue wordLoop;
          }
          else {
            wordProb += 10;
        }

        charLoop: for (let i = 0; i < wordChars.length; i++) {
            const element = wordChars[i];


            if (element === "@") {
                atHit.push(i);
            }

            if (element === ".") {
                dotHit.push(i);
            }
        }

        if (atHit.length !== 1) {   // checkt ob genau ein @ vorhanden ist.
            continue wordLoop;
        }
        else {
            wordProb += 25;
        }
    
        if (dotHit.length == 0) {   // checkt ob mindestens ein Punkt vorhanden ist.
            continue wordLoop;
        }
        else {
            wordProb += 5;
        }

        console.log(dotHit.length);
        if (dotHit.length > 1) {
            if (dotHit[dotHit.length] - atHit[0] < 2) { 
                continue wordLoop;
            }
            else{
                wordProb += 10;
            }
        }
        else if (dotHit.length == 1) {
            if (dotHit[0] - atHit[0] < 2){
                continue wordLoop;
            }
            wordProb += 10;
        }
        
        if (hasTLD === false) {         // checkt ob eine TLD vorhanden ist.
            continue wordLoop;
        }
        else {
            wordProb += 20;
        }
        if (index !== 0) {
            let wordBefore = lineWords[index - 1].toLowerCase(); // Checkt ob vor der Mail z.B. Mail: steht.
            if (wordBefore.includes("mail")) {  
                wordProb += 20;
            }
        }

        console.log(element + ": ist mit " + wordProb + "% Wahrscheinlichkeit eine Mail");
        mailValue.push(element);
        mailProbability.push(wordProb);
    }
    
}

function checkCompanyName(inputLine) {
    // Simon
}

function checkName(inputLine) {
    //Lars
}

function checkFax(inputLine) {
    //Luke

    let words = inputLine.split(" ");
    inputLine = inputLine.toLowerCase();
}

function checkPhone(inputLine) {
    //Simon
}

function checkStreet(inputLine) {
    //Luke
}

function checkCity(inputLine) {
    inputLine = inputLine.toLowerCase();
    let words = inputLine.split(" "); 
}