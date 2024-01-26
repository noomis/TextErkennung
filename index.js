import { Address } from "./Address.js";
import { AddressParser } from "./AddressParser.js";
import { CheckResult } from "./CheckResult.js";

let timeoutId;

document.getElementById("text").addEventListener("input", printResult);
let mainParser = new AddressParser();
// mainParser.fetchCityData();
function printResult() {

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {

        let input = document.getElementById("text").value;

        mainParser.parseText(input);
        
    }, 1000);
}


// function adjustHeight(element) {
//     element.style.height = (element.scrollHeight) ? (element.scrollHeight) + "px" : "54px";
// }