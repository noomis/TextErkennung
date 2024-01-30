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

        if (input != "") { // Nur ausführen wenn Eingabe nicht leer ist

            mainParser.parseText(input);
            let addressObject = new Address();
            console.log(mainParser.getEmailsCheck());

            addressObject.setEmails(mainParser.getEmailsCheck());
            addressObject.outputAllValues("email", 200);

            addressObject.setPhoneNumbers(mainParser.getPhoneNumbersCheck());
            addressObject.outputAllValues("phoneNumber", 200);

            addressObject.setContactPersons(mainParser.getContactPersonsCheck());
            addressObject.outputAllValues("contactPerson", 200);

            addressObject.setFaxNumbers(mainParser.getFaxNumbersCheck());
            addressObject.outputAllValues("faxNumber", 200);

            addressObject.setW3wAddress(mainParser.getW3wAddressCheck());
            addressObject.outputMaxValues("w3w", 200);

            addressObject.setHomepage(mainParser.getHomepageCheck());
            addressObject.outputMaxValues("homepage", 200);
            
            addressObject.setCompanyNames(mainParser.getCompanyNameCheck());
            addressObject.outputMaxValues("companyname", 200);
        }

    }, 1000);

}


// function adjustHeight(element) {
//     element.style.height = (element.scrollHeight) ? (element.scrollHeight) + "px" : "54px";
// }