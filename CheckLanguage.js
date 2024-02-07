import { AddressParser } from "./AddressParser.js";
import { detect } from 'https://cdn.jsdelivr.net/npm/tinyld@1.3.0/dist/tinyld.normal.browser.js'


export class CheckLanguage {
    language = [];

    parseLanguage(input) {
        let inputLine = input.replaceAll("\n", " ");

        return detect(inputLine);
    }

    checkLanguage(inputLine) {
        let possibleLanguage = [];
        let addressParser = new AddressParser();
        let email = addressParser.checkMails(inputLine);
        let inputWords = inputLine.split(" ");
        let germanProbability = 0;
        let dutchProbability = 0;
        let englishProbability = 0;

        for (let index = 0; index < email.length; index++) {
            const element = email[index].value;
            if (element.endsWith(".de")) {
                germanProbability += 20;
            }
            if (element.endsWith(".nl")) {
                dutchProbability += 20;
            }
            if (element.endsWith(".uk")) {
                englishProbability += 20;
            }
        }

        for (let index = 0; index < inputWords.length; index++) {
            const element = inputWords[index];
            //checken ob deutsche keywords im input enthalten sind, um die Wahrscheinlichkeit für DE zu erhöhen
            if (element.includes("www.") && element.endsWith(".de")) {
                germanProbability += 20;
            }

            if (element.startsWith("D-") || element.startsWith("DE")) {
                germanProbability += 20
            }

            if (element.startsWith("+49")) {
                germanProbability += 10;
            }

            //checken ob niederländische keywords im input enthalten sind, um die Wahrscheinlichkeit für NL zu erhöhen
            if (element.includes("www.") && element.endsWith(".nl")) {
                dutchProbability += 20;
            }

            if (element.startsWith("NL-") || element.startsWith("NL")) {
                dutchProbability += 20
            }
            
            if (element.startsWith("+31")) {
                dutchProbability += 10;
            }

            //checken ob englische keywords im input enthalten sind, um die Wahrscheinlichkeit für UK zu erhöhen
            if (element.includes("www.") && element.endsWith(".uk")) {
                englishProbability += 20;
            }

            if (element.startsWith("UK-") || element.startsWith("UK")) {
                englishProbability += 20
            }
            
            if (element.startsWith("+44")) {
                englishProbability += 10;
            }
        }

        if (germanProbability > dutchProbability && germanProbability > englishProbability) {
            possibleLanguage.push("german");
        }
        if (dutchProbability > germanProbability && dutchProbability > englishProbability) {
            possibleLanguage.push("dutch");
        }
        if (englishProbability > dutchProbability && englishProbability > germanProbability) {
            possibleLanguage.push("english");
        }
        return possibleLanguage;
    }
}
