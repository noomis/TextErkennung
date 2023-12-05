document.getElementById("button").addEventListener("click", function () {
    let text = document.getElementById("text").value;
    console.log(text);

    let words = text.split("\n");
    console.log(words);
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].split(" ");
    }
    console.log(words);
});