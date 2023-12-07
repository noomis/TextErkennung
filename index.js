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

        checkW3W(element);
        checkUrl(element);
        checkMail(element);
        checkCompanyName(element);
        checkName(element);
        checkFax(element);
        checkPhone(element);
        checkStreet(element);
        checkCity(element);

    });
});



function checkW3W(inputLine) {
    let words = inputLine.split(" ");

    words.forEach(words => {
        // split nach Buchstaben und length == 2
    });
}

function checkUrl(inputLine) {
    inputLine = inputLine.toLowerCase();
    let words = inputLine.split(" ");

    for (let i = 0; i < words.length; i++) {
        const element = words[i];
        let allHits = [];
        let prob = 0;
        for (const tld of knownTLD) {
            if (element.includes("." + tld)) {
                allHits.push("tld")
            }
        }

        if (element.includes("http")) {
            allHits.push("http")
        }

        if (element.includes("://") == true) {
            allHits.push("://")
        }

        if (element.includes("www.") == true) {
            allHits.push("www.")
        }

        if (element.includes("ö") == true) {
            allHits.push("negativ")
        }

        if (element.includes("ä") == true) {
            allHits.push("negativ")
        }

        if (element.includes("ü") == true) {
            allHits.push("negativ")
        }

        if (element.includes("ß") == true) {
            allHits.push("negativ")
        }

        if (element.includes("@") == true) {
            allHits.push("negativ")
        }

        if (allHits.includes("negativ") == true) {
            prob = -150;
        }
        if (allHits.includes("tld") == true) {
            prob += 30;
        }
        if (allHits.includes("www.") == true) {
            prob += 70;
        }
        if (allHits.includes("://") == true) {
            prob += 10;
        }
        if (allHits.includes("http") == true) {
            prob += 40;
        }

        if (prob > 100) {
            prob = 100
        }

        if (prob < 0) {
            prob = 0
        }
        urlValue.push(element);
        urlProbability.push(prob);

        if (prob > 0) {
            let indexes = urlValue.indexOf(element)
            let newUrlObject = document.createElement("p");
            newUrlObject.innerHTML ='"' + element +'"' + " ist zu " + urlProbability[indexes] + "% eine URL";
            document.body.appendChild(newUrlObject)
        }
        
    }
}

function checkMail(inputLine) {

    inputLine = inputLine.toLowerCase();

    let atHit = [];
    let dotHit = [];

    let lineWords = inputLine.split(" ");
    console.log(lineWords);
    let lineChars = inputLine.split("");
    console.log(lineChars);

    for (let index = 0; index < lineChars.length; index++) {
        const element = lineChars[index];

        if (element === "@") {
            atHit.push(element);
        }

        if (element === ".") {
            dotHit.push(element);
        }

    }

    if (atHit.length > 1) {
        return;
    }

    if (dotHit.length == 0) {
        return;
    }
    console.log("Wahrscheinlich eine Mail");

    console.log(atHit);
}

function checkCompanyName(inputLine) {
// Simon
}

function checkName(inputLine) {
    
}

function checkFax(inputLine) {
    
}

function checkPhone(inputLine) {
    
}

function checkStreet(inputLine) {
    
}

function checkCity(inputLine) {
    
}