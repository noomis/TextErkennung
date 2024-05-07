import { AddressParser } from "./AddressParser.js";
import { franc } from 'https://esm.sh/franc@6?bundle'

export class CheckLanguage {
    language = "";
    languages = [];

    parseLanguage(input) {
        let inputLine = input.replaceAll("\n", " ");
        this.language = this.checkLanguage(inputLine);
        return this.language;
    }

    findMostProbableLanguage() {
        // Start with a value lower than any probability
        let maxProbability = 1;
        let mostProbableLanguage = "de";

        // Iterate through the languages array
        this.languages.forEach(language => {

            //check which language is most likely
            if (language.languageProbability > maxProbability) {
                maxProbability = language.languageProbability;
                mostProbableLanguage = language;
                //roundings so as not to be over 100%
                
                if (language.languageProbability > 100) {
                    language.languageProbability = 100;
                }
            }
        });
        return mostProbableLanguage;
    }

    checkLanguage(inputLine) {
        let possibleLanguage = "";
        let addressParser = new AddressParser();
        let email = addressParser.checkMails(inputLine);
        let inputWords = inputLine.split(" ");
        let germanProbability = 0;
        let dutchProbability = 0;
        let englishProbability = 0;
        let language;
        //Function call of external library (Franc)
        let languageDetection = franc(inputLine);

        //check whether the email ends with a certain TLD to determine the country more precisely
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

          //check whether German keywords are included in the input to increase the probability of DE
            if (
                element.includes("www.")
                && element.endsWith(".de")
            ) {
                germanProbability += 20;
            }

            if (
                element.startsWith("D-")
                || element.startsWith("DE")
            ) {
                germanProbability += 20
            }

            if (element.startsWith("+49")) {
                germanProbability += 10;
            }

            //check whether Dutch keywords are included in the input to increase the probability of NL
            if (
                element.includes("www.")
                && element.endsWith(".nl")
            ) {
                dutchProbability += 20;
            }

            if (
                element.startsWith("NL-")
                ||element.startsWith("NL")
            ) {
                dutchProbability += 20
            }

            if (element.startsWith("+31")) {
                dutchProbability += 10;
            }

            //check whether English keywords are included in the input to increase the probability of UK
            if (element.includes("www.")
                && element.endsWith(".uk")
            ) {
                englishProbability += 20;
            }

            if (
                element.startsWith("UK-")
                || element.startsWith("GB")
                || element.startsWith("UK")
            ) {
                englishProbability += 20
            }

            if (element.startsWith("+44")) {
                englishProbability += 10;
            }
        }
        
        if (inputLine !== "") {
           //Library determines the language based on written text and then gives percentages
            // if (languageDetection == "deu") {
            //     germanProbability += 30;
            // }

            // if (languageDetection == "eng") {
            //     englishProbability += 20;
            // }

            // if (languageDetection == "nld") {
            //     dutchProbability += 20;
            // }

           //push the language with probability into the array
            this.languages.push(
                language = {
                    languageName: "nl",
                    languageProbability: dutchProbability,
                }
            );

            this.languages.push(
                language = {
                    languageName: "eng",
                    languageProbability: englishProbability,
                }
            );

            this.languages.push(
                language = {
                    languageName: "de",
                    languageProbability: germanProbability,
                }
            );
        }

        //Call the function to find the most probable language
        possibleLanguage = this.findMostProbableLanguage();
        return possibleLanguage;
    }
}
