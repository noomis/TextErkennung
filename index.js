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
    let words = inputLine.split(" ");
    inputLine = inputLine.toLowerCase();
    let dotHit = [];
    let prob = 0;

    words.forEach(words => {
        // split nach Buchstaben und length == 2

        let countDot = 0;
        // console.log(words);

        let lineChars = words.split("");
        // console.log(lineChars);

        lineChars.forEach(element => {
            if (element == ".") {
                countDot++;
            }
        });

        // TODO nach dot splitten und lenght variable wörter checken 

        // überprüfen ob 2 Punkte

        if (countDot == 2) {
            prob += 40;
        }

    });



    console.log(dotHit);
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
    debugger;
    inputLine = inputLine.toLowerCase();


    let lineWords = inputLine.split(" ");
    console.log(lineWords);

    wordLoop: for (let index = 0; index < lineWords.length; index++) {
        let wordProb = 0;
        let atHit = [];
        let dotHit = [];
        let hasTLD = false;

        const element = lineWords[index];
        let wordChars = element.split("");

            knownTLD.forEach(tld => {
                if (element.endsWith("." + tld)) {
                    console.log(element);   
                    hasTLD = true;
                }
            });
           
 
        

        charLoop: for (let i = 0; i < wordChars.length; i++) {
            const element = wordChars[i];


            if (element === "@") {
                atHit.push(element);
            }

            if (element === ".") {
                dotHit.push(element);
            }


 




        }

        if (atHit.length !== 1) {
            break wordLoop;
        }
        else{
            wordProb+=20;
        }


        if (dotHit.length == 0) {
            break wordLoop;
        }
        else{
            wordProb+=5;
        }

        if (hasTLD === false) {
            break wordLoop;
        }
        else{
            wordProb+=10;
        }


        console.log(element + ": ist mit "+ wordProb +"% eine Mail");
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