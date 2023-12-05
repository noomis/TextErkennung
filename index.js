let urlValue = [];
let urlProbability = [];
let mailValue = [];
let mailProbability = [];
let w3wValue = [];
let w3wProbability = [];

let words = [];

document.getElementById("button").addEventListener("click", function () {
    let text = document.getElementById("text").value;
    console.log(text);

    let words = text.split("\n");
    console.log(words);

    words.array.forEach(element => {

        checkW3W(element);
        checkURL(element);
        checkMail(element);
    
    });
});



function checkW3W(inputLine) {
    
}

function checkUrl(inputLine) {
    
}

function checkMail(inputLine){
 
    if (inputLine.match("@")) {
        console.log("treffer");
    } else {
        
    }
}