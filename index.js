document.getElementById("button").addEventListener("click", function () {
    let text = document.getElementById("text").value;
    console.log(text);

    let words = text.split("\n");
    console.log(words);


});

words.array.forEach(element => {

    checkW3W(element);
    checkURL(element);
    checkMail(element);

});

function checkUrl() {
    
}