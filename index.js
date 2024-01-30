import { Address } from "./Address.js";
import { AddressParser } from "./AddressParser.js";
import { CheckResult } from "./CheckResult.js";

let timeoutId;

document.getElementById("text").addEventListener("input", printResult);
let mainParser = new AddressParser();
let allZipCodes = mainParser.fetchCityData();
console.log(allZipCodes);
mainParser.setAllPostalCodes(allZipCodes);

document.getElementById("slider").addEventListener("input", printResult);

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
        addressObject.outputAllValues("email", 200);

        addressObject.setcontactPersons(mainParser.getContactPersonsCheck());
        addressObject.outputAllValues("contactPerson", 200);

        addressObject.setfaxNumbers(mainParser.getFaxNumbersCheck());
        addressObject.outputAllValues("faxNumber", 200);

        // addressObject.setw3wAddress(mainParser.getW3wAddressCheck());
        // addressObject.outputAllValues("w3w",200)

    }, 1000);

}


// function adjustHeight(element) {
//     element.style.height = (element.scrollHeight) ? (element.scrollHeight) + "px" : "54px";
// }