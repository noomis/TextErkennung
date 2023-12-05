let urlValue = [];
let urlProbability = [];
let mailValue = [];
let mailProbability = [];
let w3wValue = [];
let w3wProbability = [];

document.getElementById("button").addEventListener("click", function () {
    let text = document.getElementById("text").value;
    console.log(text);

    let words = text.split("\n");
    console.log(words);

    words.forEach(element => {

        checkW3W(element);
        checkUrl(element);
        checkMail(element);

    });
});



function checkW3W(inputLine) {
    let words = inputLine.split(" ");

    words.forEach(words => {
        console.log();
    });
}

function checkUrl(inputLine) {

}

function checkMail(inputLine) {
    inputLine = inputLine.toLowerCase();
    let atHit = [];


    let lineChars = inputLine.split("");
    console.log(lineChars);

    for (let index = 0; index < lineChars.length; index++) {
        const element = lineChars[index];

        if (element === "@") {
            console.log(index);
            atHit.push(element);
        }
        
    }

    console.log(atHit);
}