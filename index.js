import { Address } from "./Address.js";
import { AddressParser } from "./AddressParser.js";
import { CheckResult } from "./CheckResult.js";

let timeoutId;

document.getElementById("text").addEventListener("input", printResult);
let mainParser = new AddressParser();
let allZipCodes = mainParser.fetchCityData();
console.log(allZipCodes);
mainParser.setAllPostalCodes(allZipCodes);

document.getElementById("slider").addEventListener("Oninput", printResult);

function printResult() {
    console.log("test");
    let outputPercentage = $("#slider")[0].value;

    $("#probValue").text("Treffer Wahrscheinlichkeit: " + outputPercentage + "%");

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {

        let input = document.getElementById("text").value;

        mainParser.parseText(input);
        let addressObject = new Address();
        console.log(mainParser.getEmailsCheck());
        addressObject.setemails(mainParser.getEmailsCheck());
        console.log(addressObject.getemails());

        addressObject.outputAllValues("email",200)
        
    }, 1000);

    
}


// function adjustHeight(element) {
//     element.style.height = (element.scrollHeight) ? (element.scrollHeight) + "px" : "54px";
// }