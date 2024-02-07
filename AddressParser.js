import { Address } from "./Address.js";
import { CheckResult } from "./CheckResult.js";

export class AddressParser {
    companyNamesCheck = []; // only max
    streetsCheck = []; // only max
    postalCodeCheck = [];
    citysCheck = []; //
    homepageCheck = []; // only max
    w3wAddressCheck = []; // only max
    emailsCheck = [];
    phoneNumbersCheck = [];
    faxNumbersCheck = [];
    contactPersonsCheck = [];
    companyRegistrationNumberCheck = []; //only max
    vatIdNumberCheck = []; //only max
    taxNumberCheck = []; //only max

    fetchedPostalCodes = []; // only max
    fetchedCityNames = []; // only max
    outputPercentage = 0;

    constructor(language = null, outputPercentage) {

        if (!language) {
            language = "German"
        } else {
            this.language = language;
        }


        this.outputPercentage = outputPercentage;


    }

    getCompanyNameCheck() {
        return this.companyNamesCheck;
    }

    getStreetCheck() {
        return this.streetsCheck;
    }

    getPostalCodeCheck() {
        return this.postalCodeCheck;
    }

    getCityCheck() {
        return this.citysCheck;
    }

    getHomepageCheck() {
        return this.homepageCheck;
    }

    getW3wAddressCheck() {
        return this.w3wAddressCheck;
    }

    getEmailsCheck() {

        return this.emailsCheck;
    }

    getPhoneNumbersCheck() {
        return this.phoneNumbersCheck;
    }

    getFaxNumbersCheck() {
        return this.faxNumbersCheck;
    }

    getContactPersonsCheck() {
        return this.contactPersonsCheck;
    }

    getCompanyRegistrationNumberCheck() {
        return this.companyRegistrationNumberCheck;
    }

    getVatIdNumberCheck() {
        return this.vatIdNumberCheck;
    }

    getTaxNumberCheck() {
        return this.taxNumberCheck;
    }

    setAllPostalCodes(_allPostalCodes) {
        this.fetchedPostalCodes = this.fetchedPostalCodes.concat(_allPostalCodes);
    }

    setCityNames(_cityNames) {
        this.fetchedCityNames = this.fetchedCityNames.concat(_cityNames);
    }


    parseText(input) {
        let inputLines = input.split("\n");
        let addressObject;
        console.log(this.language);
        inputLines.forEach(input => {

            this.w3wAddressCheck = this.w3wAddressCheck.concat(this.checkW3ws(input));

            this.homepageCheck = this.homepageCheck.concat(this.checkHomepage(input));

            this.emailsCheck = this.emailsCheck.concat(this.checkMails(input));

            this.companyNamesCheck = this.companyNamesCheck.concat(this.checkCompanyNames(input));

            this.contactPersonsCheck = this.contactPersonsCheck.concat(this.checkContactPersons(input));

            this.faxNumbersCheck = this.faxNumbersCheck.concat(this.checkFax(input));

            this.phoneNumbersCheck = this.phoneNumbersCheck.concat(this.checkPhone(input));

            this.streetsCheck = this.streetsCheck.concat(this.checkStreets(input));

            this.postalCodeCheck = this.postalCodeCheck.concat(this.checkPostalCode(input));

            this.citysCheck = this.citysCheck.concat(this.checkCity(input));

            this.companyRegistrationNumberCheck = this.companyRegistrationNumberCheck.concat(this.checkCompanyRegistrationNumber(input));

            this.vatIdNumberCheck = this.vatIdNumberCheck.concat(this.checkVatIdNumber(input));

            this.taxNumberCheck = this.taxNumberCheck.concat(this.checkTaxNumber(input));

        });

        addressObject = new Address(this.filterResults(this.companyNamesCheck), this.filterResults(this.postalCodeCheck), this.filterResults(this.streetsCheck), this.filterResults(this.citysCheck), this.filterResults(this.homepageCheck), this.filterResults(this.w3wAddressCheck), this.filterResults(this.emailsCheck), this.filterResults(this.phoneNumbersCheck), this.filterResults(this.faxNumbersCheck), this.filterResults(this.contactPersonsCheck), this.filterResults(this.companyRegistrationNumberCheck), this.filterResults(this.vatIdNumberCheck), this.filterResults(this.taxNumberCheck))
        console.log(addressObject);

        return addressObject;

    }

    checkW3ws(inputLine) {
        let tempW3w = [];
        let inputLineWords = inputLine.split(" ");
        inputLine = inputLine.toLowerCase();
        let probability = 0;

        words: for (let i = 0; i < inputLineWords.length; i++) {
            let countDot = 0;
            let lineChars = inputLineWords[i].split("");

            // Für jeden Buchstaben von dem aktullen Wort den Ascii Code berechnen
            for (let index = 0; index < lineChars.length; index++) {
                let charAsciiCode = lineChars[index].charCodeAt(0);

                // Überprüfen, ob die Buchstaben valide sind indem sie (A-Z, a-z, ., /) entsprechen
                if (!(charAsciiCode >= 65 && charAsciiCode <= 90 || charAsciiCode >= 97 && charAsciiCode <= 122 || charAsciiCode == 46 || charAsciiCode == 47)) {

                    // Bei einem Link zur w3w Adresse, den Verzeichnis Pfad der Url herausnehmen und damit weiter durchlaufen
                    if (inputLineWords[i].includes("https://what3words.com/") || inputLineWords[i].includes("https://w3w.co/")) {
                        let w3wUrl = inputLineWords[i].split("/");
                        inputLineWords[i] = w3wUrl[w3wUrl.length - 1];
                        lineChars = inputLineWords[i].split("");

                    } else {
                        continue words;
                    }
                }

                if (lineChars[index] == ".") {
                    countDot++;
                }
            }

            // Url ausschließen
            if (inputLineWords[i].includes("www")) {
                continue;
            }

            // bei genau zwei Punkten die Zeile dannach aufteilen und die länge der einezelenen Wörter überprüfen
            if (countDot == 2) {
                let wordLength = inputLineWords[i].split(".");

                for (let t = 0; t < wordLength.length; t++) {
                    if (wordLength[t].length < 2) {
                        return tempW3w;

                        // Max länge eines w3w Wortes
                    } else if (wordLength[t].length <= 24) {
                        probability += 20;
                    }
                }

            } else {
                continue;
            }

            // überprüfen ob 2 Punkte
            if (countDot == 2) {
                probability += 20;
            }

            if (i !== 0) {
                let wordBefore = inputLineWords[i - 1].toLowerCase();
                // Checkt ob vor der w3w z.B. w3w steht.
                if (wordBefore.includes("w3w") || wordBefore.includes("what 3 words") || wordBefore.includes("what3words") ||
                    wordBefore.includes("position") || wordBefore.includes("///")) {
                    probability += 15;
                }
            }

            if (inputLineWords[i].startsWith("///")) {
                probability += 5;
            }

            tempW3w.push(new CheckResult("w3w", inputLineWords[i], probability));
        }

        return tempW3w;
    }

    checkHomepage(inputLine) {
        //alle wörter klein und in neuen array
        let inputLineWords = inputLine.toLowerCase().split(" ");
        let tempUrl = [];
        let knownTLD = ["com", "net", "org", "de", "eu", "at", "ch", "nl", "pl", "fr", "es", "info", "name", "email", "co", "biz", "uk"];

        //for-Schleife die alle Worte vom Input durchläuft
        for (let i = 0; i < inputLineWords.length; i++) {
            const element = inputLineWords[i];
            let probability = 0;

            for (const tld of knownTLD) {
                if (element.endsWith("." + tld || element.endsWith("." + tld + "/"))) {
                    probability += 20;
                }

                if (element.includes("." + tld)) {
                    probability += 10;
                }
            }

            //überprüfung ob gewisse Kriterien erfüllt sind
            if (element.startsWith("http")) {
                probability += 30;
            }

            if (element.includes("://")) {
                probability += 10;
            }

            if (element.includes("www.")) {
                probability += 80;
            }

            if (i !== 0) {
                let wordBefore = inputLineWords[i - 1].toLowerCase();

                // Checkt ob vor der URL bestimmte Keywords stehen
                if (wordBefore.includes("url") || wordBefore.includes("website") || wordBefore.includes("homepage") || wordBefore.includes("internet")) {
                    probability += 20;
                }
            }

            if (element.includes("ö") || element.includes("ü") || element.includes("ß") || element.includes("ä") || element.includes("@") || element.includes("(at)")) {
                return tempUrl;
            }

            //Runden
            if (probability > 100) {
                probability = 100;
            }

            if (probability < 0) {
                probability = 0;
            }
            //push in globalen Array & output
            if (probability > 0) {
                tempUrl.push(new CheckResult("homepage", element, probability));
            }
        }

        return tempUrl;
    }

    checkMails(inputLine) {
        let knownTLD = ["com", "net", "org", "de", "eu", "at", "ch", "nl", "pl", "fr", "es", "info", "name", "email", "co", "biz", "uk"];
        let tempMails = [];
        inputLine = inputLine.toLowerCase();
        let inputLineWords = inputLine.split(" ");

        wordLoop: for (let index = 0; index < inputLineWords.length; index++) {
            let wordProb = 0; // Treffer Wahrscheinlichkeit
            let atHit = []; // Anzahl von @ im String
            let dotHit = []; //  Anzahl von . im String
            let hasTLD = false; //  hat TLD Domain

            const element = inputLineWords[index];
            let wordChars = element.split("");  //Splittet jedes Wort in einzelne Chars

            knownTLD.forEach(tld => {
                if (element.endsWith("." + tld)) {  // Checkt ob TLD vorhanden ist
                    hasTLD = true;
                }
            });

            if (element.startsWith('@')) { // Checkt String mit @ beginnt
                continue wordLoop;
            } else {
                wordProb += 5;
            }

            if (element.startsWith('.')) { // Checkt String mit @ beginnt
                continue wordLoop;
            } else {
                wordProb += 5;
            }

            if (element.length < 6) {   // Checkt ob mindestens 6 Zeichen vorhanden sind
                continue wordLoop;
            } else {
                wordProb += 10;
            }

            charLoop: for (let i = 0; i < wordChars.length; i++) {  // Schleife um jeden Character eines Wortes zu durchlaufen
                const element = wordChars[i];

                if (element === "@" || (wordChars[i] == "(" && wordChars[i + 1] == "a" && wordChars[i + 2] == "t" && wordChars[i + 3] == ")" || (wordChars[i] == "[" && wordChars[i + 1] == "a" && wordChars[i + 2] == "t" && wordChars[i + 3] == "]"))) {  // countet @
                    atHit.push(i);
                }

                if (element === ".") {  // countet .
                    dotHit.push(i);

                    if (wordChars[i + 1] === ".") {  // verhindert aufeinander folgende Punkte.
                        continue wordLoop;
                    }
                }
            }

            if (atHit.length !== 1) {   // checkt ob genau ein @ vorhanden ist.
                continue wordLoop;
            } else {
                wordProb += 25;
            }

            if (dotHit.length == 0) {   // checkt ob mindestens ein Punkt vorhanden ist.
                continue wordLoop;
            } else {
                wordProb += 5;
            }

            if (dotHit.length > 1) {    // Checkt ob die local domain mindestens 2 Zeichen lang ist.
                if (dotHit[dotHit.length - 1] - atHit[0] < 3) {

                    continue wordLoop;

                } else {
                    wordProb += 10;
                }
            } else if (dotHit.length == 1) {  // Checkt ob die local domain mindestens 2 Zeichen lang ist.
                if (dotHit[0] - atHit[0] < 3) {
                    continue wordLoop;
                } else {
                    wordProb += 10;
                }
            }

            if (hasTLD === false) {         // checkt ob eine TLD vorhanden ist.
                continue wordLoop;
            } else {
                wordProb += 20;
            }

            if (index !== 0) {
                let wordBefore = inputLineWords[index - 1].toLowerCase(); // Checkt ob vor der Mail z.B. Mail: steht.
                if (wordBefore.includes("mail")) {
                    wordProb += 20;
                }
            }


            tempMails.push(new CheckResult("mail", inputLineWords[index], wordProb));
        }

        return tempMails;
    }

    checkCompanyNames(inputLine) {
        let wordProb = 0; // Treffer Wahrscheinlichkeit
        let tempCheckCompanyNames = [];
        const knownTLD = ["com", "net", "org", "de", "eu", "at", "ch", "nl", "pl", "fr", "es", "info", "name", "email", "co", "biz"];
        const companyType = [
            "einzelunternehmen",
            "gesellschaft mit beschränkter haftung",
            "aktiengesellschaft",
            "offene handelsgesellschaft",
            "kommanditgesellschaft",
            "gesellschaft bürgerlichen rechts",
            "limited",
            "unternehmergesellschaft",
            "e.k.",
            "gmbh",
            "ag",
            "ohg",
            "kg",
            "gbr",
            "ltd.",
            "ug",
            "e.v.",
            "gemeinde"
        ];

        const companyKeyWords = ['metzgerei', 'computer', 'lackierer', 'tiefbau', 'feuerwehr', 'elektro', 'weincontor', 'weinimport', 'gerüstbau', 'hochbau', 'auto', 'galabau', 'elektriker', 'technik', 'tischlerei', 'reinigungsdienst', 'bauunternehmen', 'autohaus', 'schreinerei', 'friseursalon', 'fliesenleger', 'steuerberater', 'gartenbau', 'heizungsbau', 'sanitärinstallateur', 'baustoffhandel', 'werbeagentur', 'architekturbüro', 'edv-dienstleister', 'druckerei', 'holzbau', 'metallbau', 'malerbetrieb', 'versicherungsmakler', 'schuhgeschäft', 'buchhandlung', 'konditorei', 'baeckerei', 'elektronikladen', 'schneider', 'juwelier', 'haustierbedarf', 'blumenladen', 'optiker', 'hörgeräteakustik', 'spielwarengeschäft', 'fahrschule', 'küchenstudio', 'reisebüro', 'sportgeschäft', 'tankstelle', 'schuhmacher', 'taschengeschäft', 'dachdecker', 'zimmerei', 'fußpflege', 'druckerei', 'fahrradladen', 'elektrogroßhandel', 'lebensmittelmarkt', 'möbelhaus', 'uhrengeschäft', 'solaranlagen', 'baumaschinenverleih', 'tattoostudio', 'hundesalon', 'dönerimbiss', 'bauchladen', 'tauchschule', 'sonnenstudio', 'fotostudio', 'teppichreinigung', 'musikschule', 'modedesigner', 'yogastudio', 'autowerkstatt', 'haustechnik', 'teppichhandel', 'saunaanlagen', 'angelgeschäft', 'schlüsseldienst', 'gitarrenbau', 'fischzucht', 'hochzeitsplanung', 'hutgeschäft', 'schwimmbadtechnik', 'spielzeughersteller', 'hörbuchverlag', 'treppenbau', 'kanzlei', 'autovermietung', 'schraubenhandel', 'apotheken', 'schädlingsbekämpfung', 'vinothek', 'saftladen', 'computerladen', 'spielothek', 'elektronikmarkt', 'kindergarten', 'tanzschule', 'mietkoch', 'papierhandel', 'uhrenwerkstatt', 'stoffgeschäft', 'handyshop', 'kochschule', 'modellbau', 'goldschmied', 'floristik', 'brautmoden', 'schausteller', 'wassersport', 'segelschule', 'surfschule', 'angeln', 'haushaltswaren', 'kinderschuhladen', 'brennholzhandel', 'kaminbau', 'fotograf', 'gärtnerei', 'bioladen', 'schuhreparatur', 'mietrechtsschutz', 'müllentsorgung', 'baumschule', 'schwimmbadbau', 'catering', 'beauty-salon', 'biogasanlage', 'datenrettung', 'zeltverleih', 'videoproduktion', 'teppichhandel', 'tontechnik', 'wäscherei', 'tischlerei', 'teigwarenhersteller', 'touristik', 'taschenhersteller', 'stickerei', 'segelmacher', 'schwimmbadtechnik', 'segway-verleih', 'rolladenbau', 'reinigungsdienst', 'reiseveranstalter', 'rechtsanwalt', 'reifenservice', 'regalsysteme', 'pizzabringdienst', 'pflanzenhandel', 'pediküre', 'patisserie', 'partyservice', 'parkettverleger', 'papiergroßhandel', 'outdoorladen', 'online-marketing', 'optikergeschäft', 'orthopädietechnik', 'ölhandel', 'obstgroßhandel', 'nähmaschinenreparatur', 'motorradwerkstatt', 'mosaikleger', 'möbeltransport', 'modellflug', 'modellbahn', 'mobilfunk', 'möbeltischlerei', 'milchhandel', 'mietwagen', 'metallhandel', 'massagestudio', 'markisenbau', 'maniküre', 'malermeister', 'malerbetrieb', 'makler', 'luftaufnahmen', 'lkw-vermietung', 'lkw-werkstatt', 'logistik', 'lebensmittelhandel', 'landwirtschaft', 'lampenladen', 'laminatverleger', 'kühlhaus', 'küchenplanung', 'küchenstudio', 'küchenmontage', 'kosmetikinstitut', 'konditorei', 'kochstudio', 'kiosk', 'kinderbetreuung', 'kindermode', 'kinderzahnarzt', 'kinderarzt', 'kinderwunschzentrum', 'kinderkrippe', 'kinderpsychologe', 'kinesiologie', 'kimono-shop', 'kino', 'kiosk', 'kirchenmusik', 'kirchengemeinde', 'kiteschule', 'kletterhalle', 'konditorei', 'kosmetikstudio', 'krankenhaus', 'kunsthandel', 'kunstschule', 'kunststoffverarbeitung', 'künstleragentur', 'küchenstudio', 'kutschenverleih', 'labordienst', 'lackiererei', 'landgasthof', 'landwirtschaft', 'lebensberatung', 'lebensmittelgroßhandel', 'lebensmittelhandel', 'lebensmittelhersteller', 'lederwaren', 'lehrer', 'lerntherapie', 'lingerie-shop', 'logistikunternehmen', 'lottoladen', 'luxusuhren', 'makler', 'marketingagentur', 'massagepraxis', 'möbelhaus', 'müllabfuhr', 'müllentsorgung', 'müllverwertung', 'museum', 'musikgeschäft', 'musiklehrer', 'musikschule', 'musikstudio', 'nagelstudio', 'nahrungsergänzung', 'naturheilpraxis', 'neurologe', 'notar', 'nudelhersteller', 'ölhandel', 'obsthof', 'optiker', 'orthopäde', 'orthopädieschuhtechnik', 'packaging-design', 'papiergroßhandel', 'partyservice', 'personalberatung', 'pfandhaus', 'pflegeheim', 'pflasterarbeiten', 'pflanzenhandel', 'pflegedienst', 'physiotherapie', 'pianohaus', 'pilzzucht', 'pizza-lieferdienst', 'planungsbüro', 'polsterer', 'pr-agentur', 'pralinenhersteller', 'private-krankenversicherung', 'privatschule', 'psychiater', 'psychologe', 'psychosoziale-beratung', 'puppentheater', 'putzfrau', 'radiosender', 'rechtsanwalt', 'rechtsanwältin', 'reifenservice', 'reinigungsservice', 'reiseagentur', 'reisebüro', 'reiseveranstalter', 'reiseversicherung', 'reitsportgeschäft', 'relaxsessel', 'rentenberatung', 'restaurant', 'restauration', 'retail-design', 'rezepturenentwicklung', 'rollstuhlbau', 'rückentraining', 'saftbar', 'schauspieler', 'schlüsseldienst', 'schneiderei', 'schnittblumen', 'schokoladenhersteller', 'schornsteinfeger', 'schreibwarenhandel', 'schreinerei', 'schrottentsorgung', 'schuhgeschäft', 'schuldnerberatung', 'schwimmbadtechnik', 'schwimmschule', 'segelbootverleih', 'segelflugplatz', 'segelschule', 'sehenswürdigkeit', 'sekretariatsservice', 'selbsthilfegruppe', 'seniorendienstleistung', 'seniorenheim', 'seniorenpflege', 'shisha-bar', 'shopfitting', 'sicherheitsdienst', 'siedlungswasserwirtschaft', 'solaranlagen', 'sonnenstudio', 'sozialamt', 'sozialberatung', 'sozialdienst', 'sozialkaufhaus', 'sozialpädagogik', 'sozialpsychiatrischer-dienst', 'sozialstation', 'sozialtherapie', 'spedition', 'spielhalle', 'spielplatzbau', 'spielzeugladen', 'sportanlagenbau', 'sportartikelhersteller', 'sportgeschäft', 'sportlerheim', 'sportsbar', 'sportverein', 'stadtführung', 'stahlbau', 'staubsaugervertretung', 'steuerberatung', 'steuerberater', 'steuerfachangestellter', 'stoffgeschäft', 'straßenbau', 'stuckateur', 'studentenwohnheim', 'studienberatung', 'subunternehmen', 'supermarkt', 'sushi-bar', 'tanzschule', 'tapetenhandel', 'tattooentfernung', 'tattoostudio', 'tauchschule', 'taxiunternehmen', 'teichbau', 'teigwarenhersteller', 'telemarketing', 'telekommunikationsunternehmen', 'textildruck', 'textilveredelung', 'textilgroßhandel', 'textilhandel', 'theater', 'theaterkasse', 'theaterwerkstatt', 'therapeut', 'tierarzt', 'tierbestattung', 'tierfutterhandel', 'tierpension', 'tierpsychologie', 'tierschutzverein', 'tischlerei', 'tofuhersteller', 'tonstudio', 'touristikunternehmen', 'toyota-händler', 'traditionsunternehmen', 'trainingszentrum', 'transportunternehmen', 'treppenbau', 'trockenbau', 'trockenfrüchtehandel', 'trockenreinigung', 'trödelmarkt', 'tuningwerkstatt', 'uhrengeschäft', 'uhrenhandel', 'uhrenreparatur', 'uhrenwerkstatt', 'umzugsunternehmen', 'unternehmensberater', 'unternehmerverband', 'unterwäschehersteller', 'urlaubsbauernhof', 'us-car-vermietung', 'us-car-werkstatt', 'us-import', 'us-restaurant', 'us-shop', 'us-sportwagenvermietung', 'us-truck-vermietung', 'us-truck-werkstatt', 'us-tuning', 'uscar-handel', 'uscar-händler', 'uscar-import', 'uscar-reparatur', 'uscar-restauration', 'uscar-tuning'];
        let inputLineClear = inputLine;
        inputLine = inputLine.toLowerCase();
        let inputLineWords = inputLine.split(" ");

        wordLoop: for (let index = 0; index < inputLineWords.length; index++) {
            const element = inputLineWords[index];

            if (element.includes('@')) { // Checkt String mit @ beginnt
                return tempCheckCompanyNames;
            }

            if (element.includes('(at)')) { // Checkt String mit @ beginnt
                return tempCheckCompanyNames;
            }
            for (let i = 0; i < knownTLD.length; i++) {
                const el = knownTLD[i];
                if (element.startsWith("www.") && element.endsWith(el)) {
                    return tempCheckCompanyNames;
                }
            }

            companyType.forEach(unternehmensform => {
                if (element == unternehmensform) {
                    wordProb += 50;
                }
            });
        }

        companyKeyWords.forEach(element => {
            if (inputLine.includes(element)) {
                wordProb += 50;
            }
        });

        if (wordProb >= 50) {

            tempCheckCompanyNames.push(new CheckResult("companyName", inputLineClear, wordProb));
        }

        return tempCheckCompanyNames;
    }

    checkContactPersons(inputLine) {
        const firstName = ["Fenna", "Luuk", "Evi", "Jurre", "Lotte", "Stijn", "Saar", "Francesco", "Thijs", "Lynn", "Tijn", "Maud", "Bram", "Isa", "Sem", "Tessa", "Jens", "Jan-Peer", "Fleur", "Daan", "Noa", "Femke", "Sven", "Loes", "Mees", "Noor", "Luuk", "Liv", "Jesse", "Mila", "Noud", "Elin", "Ruben", "Femke", "Jelle", "Jasmijn", "Tygo", "Sophie", "Rens", "Elin", "Lars", "Eva", "Niek", "Jara", "Gijs", "Julia", "Thijn", "Yara", "Sander", "Lieke", "Jesper", "Evy", "Bo", "Fay", "Stan", "Isabella", "Teun", "Roos", "Tom", "Puck", "Joris", "Demi", "Lucas", "Noor", "Jop", "Roos", "Hidde", "Lara", "Milan", "Anna", "Jens", "Liv", "Luca", "Madelief", "Siem", "Mia", "Cas", "Luna", "Ties", "Sophie", "Bram", "Fenna", "Finn", "Nina", "Thom", "Sophie", "Renske", "Olaf", "Liza", "Floris", "Saar", "Jesse", "Pien", "Julian", "Isabel", "Levi", "Esmee", "Guus", "Sara", "Jurre", "Feline", "Liam", "Iris", "Noud", "Lise", "Jens", "Fay", "Stijn", "Lisa", "Jesper", "Fleur", "Lars", "Lina", "Hugo", "Nova", "Benthe", "Sepp", "Lara", "Tim", "Mila", "Dani", "Elin", "Thijn", "Isa", "Jelle", "Lola", "Finn", "Lotte", "Niek", "Emma", "Teun", "Lynn", "Luca", "Maud", "Oliver", "Femke", "Pim", "Fleur", "Mats", "Mia", "Dex", "Lena", "Quinn", "Sophie", "Sam", "Zoe", "Boaz", "Tess", "Hidde", "Mara", "Jesper", "Puck", "Rens", "Lynn", "Siem", "Eva", "Ties", "Saar", "Mees", "Roos", "Thijs", "Jara", "Luuk", "Pien", "Finn", "Evy", "Bram", "Sophie", "Ruben", "Noa", "Lars", "Isa", "Jesse", "Maud", "Thijn", "Lise", "Jop", "Nina", "Tijn", "Lina", "Floris", "Lisa", "Guus", "Emma", "Gijs", "Nova", "Stijn", "Benthe", "Luca", "Feline", "Jens", "Liam", "Madelief", "Jurre", "Mara", "Levi", "Lola", "Tom", "Fay", "Milan", "Sara", "Julian", "Zoe", "Cas", "Olaf", "Esmee", "Tess", "Dani", "Iris", "Bo", "Liza", "Mats", "Isabel", "Pim", "Oliver", "Sophie", "Dex", "Lynn", "Quinn", "Mia", "Zoe", "Lena", "Boaz", "Ben", "Paul", "Leon", "Maike", "Finn", "Kai", "Giacomo", "Lara", "Lukas", "Selina", "Luca", "Verena", "Benjamin", "Alina", "Ferdinand", "Valentina", "Niklas", "Clara", "Philipp", "Greta", "Adrian", "Antonia", "Vincent", "Paulina", "Max", "Celine", "Fabio", "Lea", "Matthias", "Sophie", "David", "Rosa", "Klaus", "Helena", "Alexander", "Zoe", "Valentin", "Emma", "Raphael", "Valerie", "Daniel", "Maya", "Dominik", "Lina", "Julia", "Leah", "Johann", "Isabella", "Emanuel", "Katharina", "Fabienne", "Benjamin", "Annika", "Marcel", "Paula", "Jonathan", "Helen", "Dirk", "Volker", "Joachim", "Sandra", "Anke", "Rudolf", "Wolfram", "Isabell", "Rosemarie", "Martina", "Hans", "Anja", "Jörg", "Petra", "Verena", "Michael", "Yvonne", "Günther", "Eva", "Roland", "Susanne", "Axel", "Ingrid", "Babara", "Fynn", "Matthias", "Christoph", "Peter", "Elias", "Thomas", "Ursula", "Elon", "Stefan", "Olaf", "Jennifer", "Steffen", "Joe", "Angela", "Jonas", "Gerd", "Franz", "Wilhelm", "Jürgen", "Josef", "Hans", "Noah", "Luis", "Louis", "Maximilian", "Felix", "Luca", "Luka", "Tim", "Emil", "Oskar", "Oscar", "Henry", "Moritz", "Theo", "Theodor", "Anton", "David", "Niklas", "Andreas", "Brigitte", "Karl-Heinz", "Karen", "Jens", "Ralf", "Ann-Kristin", "Nicolas", "Philipp", "Samuel", "Fabian", "Leo", "Frank", "Sabine", "Simone", "Markus", "Marcus", "Clemens", "Monika", "Ingo", "Regina", "Uwe", "Dorothee", "Gabriele", "Jonathan", "Carl", "Karl", "Alexander", "Jakob", "Vincent", "Simon", "Aaron", "Emiliano", "Julius", "Matteo", "Raphael", "Valentin", "Johann", "Finnian", "Daniel", "Gabriel", "Richard", "Max", "Adrian", "Sebastian", "Tobias", "Liam", "Joshua", "Reiner", "Sven", "Rainer", "Melanie", "Heike", "Hannelore", "Ernst", "Dietmar", "Werner", "Renate", "Justin", "Jonah", "Yannick", "Bruno", "Milan", "Rafael", "Leonhard", "Timon", "Adam", "Fabio", "Leonard", "Henryk", "Erik", "Silas", "Jannik", "Jasper", "Nico", "Lenny", "Colin", "Tom", "Bastian", "Damian", "Jasper", "Silas", "Lennard", "Finnegan", "Malte", "Aaron", "Jannis", "Elias", "Paul", "Samuel", "Victor", "Jonathan", "Nick", "Alexander", "Malte", "Florian", "Noah", "Eric", "Oliver", "Matteo", "Theodor", "Niklas", "Jan-Stephan", "Gustav", "Marius", "Arne", "Frederik", "Julius", "Emil", "Theo", "Elias", "Jasper", "Luis", "Gustav", "Florian", "Lias", "Aaron", "Tilo", "Mathis", "Janosch", "Lennert", "Jeremy", "Leopold", "Marius", "Valentin", "Julius", "Julian", "Melvin", "Laurin", "Nils", "Oliver", "Jaron", "Laurin", "Leif", "Florian", "Jaron", "Leonard", "Silvan", "Levin", "Ole", "Henri", "Johann", "Lars", "Luke", "Lukas", "Lucas", "Friedhelm", "Ludwig", "Valentin", "Mattis", "Justus", "Constantin", "Maxim", "Leonard", "Friedrich", "Theodor", "Maximilian", "Leander", "Lias", "Christian", "Elias", "Colin", "Thilo", "Emma", "Mia", "Hannah", "Hanna", "Emilia", "Sophia", "Sofia", "Lina", "Marie", "Mila", "Ella", "Lea", "Clara", "Klara", "Lena", "Leni", "Luisa", "Louisa", "Anna", "Laura", "Lara", "Maja", "Maya", "Amelie", "Johanna", "Nele", "Charlotte", "Jana", "Mara", "Frieda", "Mira", "Paula", "Alina", "Lotta", "Greta", "Nina", "Matilda", "Mathilda", "Rosa", "Fiona", "Sarah", "Sara", "Emelie", "Zoe", "Isabella", "Melina", "Ida", "Frida", "Julia", "Eva", "Amelia", "Tilda", "Anni", "Liv", "Ava", "Victoria", "Lucy", "Helen", "Helena", "Elif", "Aaliyah", "Elsa", "Julie", "Stella", "Leona", "Juna", "Mina", "Jara", "Elina", "Nela", "Nora", "Emma", "Zara", "Elena", "Malia", "Aria", "Mira", "Elisa", "Aurora", "Enna", "Ronja", "Nora", "Elin", "Emmy", "Ivy", "Ella", "Anastasia", "Josephine", "Jasmin", "Amira", "Emmi", "Merle", "Joline", "Carolin", "Estelle", "Leila", "Kiara", "Romy", "Elif", "Tara", "Joana", "Klara", "Lotte", "Marlene", "Magdalena", "Lia", "Annika", "Liana", "Liselotte", "Katharina", "Rosalie", "Enya", "Selma", "Hedda", "Luise", "Louise", "Pia", "Elisabeth", "Malin", "Leana", "Yara", "Alma", "Carlotta", "Jolina", "Elsa", "Cara", "Lavinia", "Milla", "Josephina", "Marla", "Malou", "Johanna", "Luisa", "Louisa", "Juliana", "Malia", "Paulina", "Carla", "Alessia", "Valentina", "Nova", "Mila", "Alexandra", "Antonia", "Anita", "Joleen", "Jara", "Annabelle", "Kira", "Liana", "Svenja", "Melissa", "Delia", "Elif", "Luana", "Anni", "Tessa", "Rosie", "Esma", "Leticia", "Eleni", "Carolina", "Anya", "Louna", "Kim", "Livia", "Fenja", "Thea", "Juna", "Selina", "Celine", "Alessa", "Rosa", "Evelyn", "Alissa", "Hanna", "Mara", "Cassandra", "Viola", "Elena", "Valeria", "Kiana", "Helena", "Sofie", "Lana", "Nina", "Alessandra", "Eveline", "Anika", "Luna", "Anouk", "Paulina", "Felicitas", "Rieke", "Lotte", "Yuna", "Jette", "Antonia", "Jolene", "Felina", "Miley", "Anisa", "Martha", "Ava", "Philippa", "Edda", "Karolina", "Linda", "Greta", "Ella", "Larissa", "Vanessa", "Esther", "Elena", "Nola", "Lucia", "Elaine", "Flora", "Lola", "Rosalie", "Lena", "Alia", "Elina", "Mina", "Luisa/Louisa", "Carolina", "Tamara", "Annabelle", "Elisa", "Nina", "Johanna", "Leonie", "Jolie", "Rieke", "Anastasia", "Lotte", "Lynn", "Josefine", "Lotta", "Leona", "Johanna", "Lorena", "Marie", "Pia", "Leni", "Paulina", "Lotte", "Maja/Maya", "Larissa", "Nora", "Amalia", "Mira", "Alexandra", "Louisa", "Lara", "Greta", "Ella", "Marlene", "Mila", "Elif", "Kiara", "Mina", "Lucia", "Maya", "Zara", "Liv", "Aurora", "Nela", "Sophie", "Emilia", "Tara", "Helena", "Leonie", "Lina", "Jasmin", "Lieselotte", "Stella", "Yara", "Mira", "Mina", "Nina", "Emma", "Liam", "Olivia", "Noah", "Ava", "Isabella", "Sophia", "Jackson", "Mia", "Lucas", "Oliver", "Aiden", "Charlotte", "Harper", "Elijah", "Amelia", "Abigail", "Ella", "Leo", "Grace", "Mason", "Evelyn", "Logan", "Avery", "Sofia", "Ethan", "Lily", "Aria", "Hazel", "Zoe", "Alexander", "Madison", "Luna", "Mateo", "Chloe", "Nora", "Zoey", "Mila", "Carter", "Eli", "Aubrey", "Ellie", "Scarlett", "Jaxon", "Maya", "Levi", "Elena", "Penelope", "Aurora", "Samuel", "Cora", "Skylar", "Carson", "Sadie", "Nathan", "Kinsley", "Anna", "Elizabeth", "Grayson", "Camila", "Lincoln", "Asher", "Aaliyah", "Callie", "Xavier", "Luke", "Madelyn", "Caleb", "Kai", "Isaac", "Bella", "Zara", "Landon", "Matthew", "Lucy", "Adrian", "Joseph", "Stella", "Mackenzie", "Kailey", "Nolan", "Eleanor", "Samantha", "Dylan", "Leah", "Audrey", "Aaron", "Jasmine", "Tyler", "Easton", "Hudson", "Bailey", "Alice", "Layla", "Eliana", "Brooklyn", "Jackson", "Bentley", "Trinity", "Liliana", "Claire", "Adeline", "Ariel", "Jordyn", "Emery", "Max", "Naomi", "Eva", "Paisley", "Brody", "Kennedy", "Bryson", "Nova", "Emmett", "Kaylee", "Genesis", "Julian", "Elliot", "Piper", "Harrison", "Sarah", "Daisy", "Cole", "Kylie", "Serenity", "Jace", "Elena", "Ruby", "Camden", "Eva", "Delilah", "John", "Liam", "Catherine", "Madeline", "Isla", "Jordan", "Julia", "Sydney", "Levi", "Alexa", "Kinsley", "Hayden", "Gianna", "Everly", "Alexis", "Jaxson", "Isabelle", "Allison", "Alyssa", "Elias", "Brynn", "Leilani", "Alexandra", "Kayla", "Gracie", "Lucia", "Reagan", "Valentina", "Brayden", "Jocelyn", "Molly", "Kendall", "Blake", "Diana", "Isabel", "Zachary", "Emilia", "Lilah", "David", "Charlie", "Charlie", "Eliana", "Ryder", "Lydia", "Nevaeh", "Savannah", "Zayden", "Sydney", "Amaya", "Nicole", "Caroline", "Jaxon", "Natalia", "Jayden", "Mila", "Lincoln", "Nash", "Emilia", "Peyton", "Annabelle", "Zane", "Zoey", "Elena", "Hannah", "Lyla", "Christian", "Lily", "Violet", "Sophie", "Bentley", "Kai", "Jasmine", "Skylar", "Bella", "Penelope", "Alexandra", "Joseph", "Khloe", "Rebecca", "Leo", "Luna", "Alina", "Ashley", "Audrey", "Riley", "Alexa", "Parker", "Adeline", "Leon", "Lucy", "Taylor", "Maria", "Evan", "Chase", "Eva", "Maya", "Kayla", "Mia", "Naomi", "Ryder", "Peyton", "Eli", "Zoe", "Zara", "Mateo", "Ellie", "Julian", "Christopher", "Aiden", "Emma", "Evelyn", "Layla", "Sophia", "Grace", "Benjamin", "Harper", "Mila", "Eleanor", "Carter", "Amelia", "Ella", "Jackson", "Oliver", "Charlotte", "Ava", "Lucas", "Liam", "Abigail", "Avery", "Ethan", "Aria", "Scarlett", "Chloe", "Hazel", "Mason", "Emma", "Zoey", "Aiden", "Penelope", "Claire", "Lily", "Isabella", "Daniel", "Nora", "Madison", "Grace", "Luna", "Mia", "Lily", "Zoe", "Layla", "Ariana", "Aubrey", "Liam", "Eli", "Alexander", "Sebastian", "Aria", "Scarlett", "Victoria", "Lucy", "Mila", "Emily", "Levi", "Avery", "Ella", "Abigail", "Evelyn", "Sophia", "James", "Ben", "Wilhelm", "Friedrich", "Heinrich", "Karl", "Johann", "Georg", "Ludwig", "Ernst", "Otto", "Heinrich", "Hans", "Fritz", "Paul", "Max", "Albert", "August", "Richard", "Walter", "Hermann", "Gustav", "Rudolf", "Anton", "Franz", "Emil", "Adolf", "Oskar", "Gottfried", "Eduard", "Kurt", "Klaus", "Theodor", "Alfred", "Friedrich", "Hugo", "Arthur", "Gerhard", "Werner", "Erwin", "Berthold", "Helmut", "Konrad", "Wolfgang", "Arnold", "Rolf", "Ulrich", "Dieter", "Erich", "Günther", "Hans-Jürgen", "Winfried", "Willi", "Rolf", "Helmut", "Reinhard", "Gerd", "Manfred", "Jürgen", "Hubert", "Friedhelm", "Gustav", "Ludwig", "Karl-Heinz", "Otto", "Karl-Friedrich", "Hans-Dieter", "Heinz", "Ernst", "Walter", "Rudolf", "Herbert", "Klaus-Dieter", "Wolfram", "Friedrich-Wilhelm", "Ewald", "Egon", "Wilfried", "Norbert", "Karl-Heinz", "Gerhard", "Hans-Peter", "Dieter", "Werner", "Alfred", "Helmut", "Walter", "Heinz", "Kurt", "Hans-Joachim", "Günther", "Ernst", "Rainer", "Bernd", "Hans-Jürgen", "Wilhelm", "Joachim", "Friedrich", "Karl", "Klaus", "Reinhard", "Heinz", "Karl-Heinz", "Peter", "Jürgen", "Helmut", "Werner", "Rolf", "Günter", "Fritz", "Wolfgang", "Alfred", "Erich", "Karl-Friedrich", "Gustav", "Dieter", "Friedhelm", "Hans-Dieter", "Gerd", "Herbert", "Ludwig", "Ulrich", "Winfried", "Hans-Joachim", "Reiner", "Günther", "Manfred", "Rudolf", "Berthold", "Eduard", "Franz", "Heinrich", "Friedrich-Wilhelm", "Wilfried", "Klaus-Dieter", "Werner", "Erwin", "Wolfram", "Rainer", "Ernst", "Hubert", "Hans-Peter", "Joachim", "Norbert", "Arthur", "Karl-Heinz", "Heinz", "Otto", "Egon", "Ewald", "Kurt", "Hans", "Gustav", "Wilhelm", "Franz", "Ernst", "Heinrich", "Hermann", "Karl", "Friedrich", "Ludwig", "Alfred", "Otto", "Walter", "Richard", "Wilhelm", "Hans", "Fritz", "Paul", "Max", "Albert", "August", "Theodor", "Werner", "Friedrich", "Hugo", "Arthur", "Erwin", "Gerhard", "Eduard", "Kurt", "Heinz", "Erich", "Günther", "Hans-Jürgen", "Winfried", "Willi", "Helmut", "Reinhard", "Gerd", "Manfred", "Jürgen", "Karl-Heinz", "Hubert", "Friedhelm", "Gustav", "Ludwig", "Ewald", "Egon", "Wilfried", "Karl", "Franz", "Peter", "Wolfgang", "Ulrich", "Dieter", "Klaus-Dieter", "Heinz", "Karl-Friedrich", "Hans-Dieter", "Wolfram", "Friedrich-Wilhelm", "Ernst", "Erich", "Günter", "Rainer", "Bernd", "Herbert", "Hans-Joachim", "Wilhelm", "Joachim", "Friedrich", "Karl", "Klaus", "Reinhard", "Heinz", "Karl-Heinz", "Peter", "Jürgen", "Helmut", "Werner", "Rolf", "Günter", "Fritz", "Wolfgang", "Alfred", "Erich", "Karl-Friedrich", "Gustav", "Dieter", "Friedhelm", "Hans-Dieter", "Gerd", "Herbert", "Ludwig", "Ulrich", "Winfried", "Hans-Joachim", "Reiner", "Günther", "Manfred", "Rudolf", "Berthold", "Eduard", "Franz", "Heinrich", "Friedrich-Wilhelm", "Wilfried", "Klaus-Dieter", "Werner", "Erwin", "Wolfram", "Rainer", "Ernst", "Hubert", "Hans-Peter", "Joachim", 'Jörg', 'Hermann', 'Ulrich', 'Roland', 'Frank', 'Cord', 'Ralf', 'Sascha', 'Andreas', 'Heiko', 'Christoph', 'Kerstin', 'Christian', 'Lucas', 'Axel', 'Dirk', 'Hans-Gerd', 'Thomas', 'Norman', 'Karsten', 'Regina', 'Werner', 'Daniel', 'Leendert', 'Anton', 'Joachim', 'Alexander', 'Bastian', 'Horst', 'Sven', 'Dieter', 'Araik', 'Hans-Jürgen', 'Jens', 'Jan', 'Matthias', 'Toni', 'Erika', 'Dipl. Ing. Elmar', 'Ludger', 'Mark', 'Guido', 'Dennis', 'Marcel', 'Björn', 'Hans-Hermann', 'Monze', 'Walter', 'Maik', 'Thorsten', 'Nadine', 'Ulf', 'Meinhard', 'Johann', 'Gerhard', 'Tibor', 'Wilhelm', 'Ernst-Christian', 'Maja', 'Wolfgang', 'Jana', 'Otto', 'Franz', 'Andre', 'Bertholt', 'Klaus', 'Lukas', 'Stephan', 'Knut', 'Burghart', 'Torsten', 'Thijs Petrus Antonius', 'Hans', 'Ernst', 'Erich', 'Vinzenz', 'Volker', 'Uwe', 'Hans-Joachim', 'Detlef', 'Hinnerk', 'Bernd', 'Gernot', 'Peter', 'Markus', 'Claus', 'Armin', 'Otto Johann', 'Kurt-Egon', 'Dan', 'Timo', 'Kai', 'Herbert', 'Hilmar', 'Rainer', 'Sören', 'Gunnar', 'Nico', 'Tim', 'Christine', 'Cengiz', 'Nicolas', 'Jürgen', 'Josef', 'Raphael', 'Heinrich', 'Lüder', 'Harald', 'Helmuth', 'Savino', 'Julian', 'Carsten', 'Bernhard', 'Simon', 'Patrick', 'Rolf', 'Urs', 'Ewald', 'Jörn', 'Stefan', 'Mirco', 'Emanuel', 'Cristian-Valentin', 'Talha', 'Christina', 'Andrey', 'Henning', 'Heike', 'Marcus', 'Johannes', 'Ingo', 'Ina', 'Philipp', 'Mirko', 'Tore', 'Anja', 'Olaf', 'Fridel', 'Cornelia', 'Sandra', 'Martin', 'Monika', 'Tanja', 'Jessica', 'Marc', 'Rowena', 'Erik', 'Lasse', 'Benedikt', 'Heiner', 'Ansgar', 'Linda', 'Sebastian', 'Michaela', 'David', 'Anne', 'Stanislavas', 'Swantje', 'Petra', 'Melanie', 'Maren', 'Friedhelm', 'Lothar', 'Sarah', 'Manfred', 'Günter', 'Florian', 'Thore', 'Doris', 'Anneliese', 'Beate', 'Oliver', 'Phillip', 'Bianca', 'Marion', 'Katharina', 'Kathrin', 'Michele', 'Nina', 'Günther', 'Corinna', 'Kolja Ole', 'Helmut', 'Ilka', 'Mario', 'Helge', 'Lena', 'Jathavan', 'Karl', 'Julia', 'Martina', 'Reinhard', 'Dörk', 'Andrea', 'Achim', 'Bettina', 'Carina', 'Lars', 'Paul', 'Bodo', 'Lambert', 'Yvonne', 'Constanze', 'Rüdiger', 'Arthur', 'Wolny', 'Ronja', 'Annett', 'Kornelia', 'Friedrich', 'Ruth', 'Georg', 'Birgit', 'Siegfried', 'Eva-Maria', 'Frederik', 'Steffen', 'Holger', 'Milan', 'Miriam', 'Jakob', 'Viktor', 'Jaqueline', 'Sabine', 'Nils', 'Lisa', 'Leo', 'Berthold', 'Fatih', 'Sabrina', 'Luca', 'Heino', 'Sergey', 'Verena', 'Robert', 'Klaus-Dieter', 'Jochen', 'Igor', 'Kristina', 'Denis', 'Enes', 'Fait', 'Mathias', 'Henner', 'Ulla', 'Elke', 'Wilfried', 'Rene', 'Hubert', 'Willi', 'Roderik', 'Udo', 'Monique', 'Marco', 'Enrico', 'Richard', 'Jonas', 'Otmar', 'Tobias', 'Boris', 'Nicole', 'Elmar', 'Immo', 'Frederick', 'Margit', 'Hans-Jörg', 'Jordan', 'Lutz', 'Heinz', 'Justas', 'Detlev', 'Reimer', 'Gerald', 'Rita', 'Emil', 'Pascal', 'Karl-Hans', 'Benno', 'Ralph', 'Thilo', 'Murat', 'Denise', 'Danila', 'Ömür', 'Katja', 'Christof', 'Berndt', 'Norbert', 'Freddy', 'Ursula', 'Heinz Willi', 'Frederic', 'Ralf-Peter', 'Sylvia', 'Alois', 'Carl', 'Bert', 'Iris', 'Benjamin', 'Arne', 'Jan-Hermann', 'Sybille', 'Ute', 'Fabian', 'Sotirios', 'Khanh', 'Annette', 'Nadja', 'Antonius', 'Geigle', 'Chiara', 'Lucien', 'Beata', 'Reiner', 'Ramon', 'Hüsniye', 'Mijo', 'Erwin', 'Rogerio', 'Mike', 'Benny', 'Ludwig', 'Roger', 'Herge', 'Niklas', 'Andres', 'Roxanne', 'Othmar', 'Cyril', 'Karl-Heinz', 'Stefanie', 'Burkhard', 'Angelus', 'Pierre', 'Götz', 'Tilmann', 'Claudia', 'Ronald', 'Tammo', 'Dietmar', 'Rico', 'Dejan', 'Dainius', 'Silvio', 'Vitalij'];
        const lastName = ["Müller", "Schmidt", "Schneider", "Fischer", "Meyer", "Weber", "Meier", "Mayer", "Maier", "Wagner", "Becker", "Schulz", "Hoffmann", "Schäfer", "Koch", "Bauer", "Richter", "Klein", "Wolf", "Braun", "Schmid", "Hartmann", "Zimmermann", "Krüger", "Schmitz", "Lange", "Werner", "Schulte", "Köhler", "Lehmann", "Maier", "Scholz", "Albrecht", "Vogel", "Pohl", "Huber", "Roth", "Arnold", "König", "Friedrich", "Beyer", "Bruegge", "Seidel", "Sommer", "Haas", "Graf", "Heinrich", "Schreiber", "Schiller", "Günther", "Krämer", "Zimmer", "Jäger", "Ludwig", "Ritter", "Winkler", "Ziegler", "Frank", "Schwarz", "Neumann", "Herrmann", "Kühn", "Walter", "Peters", "Möller", "Martin", "Schubert", "Dietrich", "Ullrich", "Fuchs", "Voigt", "Simon", "Kunz", "Marx", "Sauer", "Hauser", "Böhm", "Dreher", "Schuster", "Stahl", "Hein", "Hess", "Berger", "Bock", "Busch", "Menzel", "Weiß", "Engels", "Sander", "Geiger", "Lorenz", "Rommel", "Hahn", "Schütz", "Keller", "Petersen", "Thiel", "Böttcher", "Dahl", "Heinze", "Trautmann", "Zimmerer", "Vogt", "Otto", "Voß", "Janßen", "Dahlke", "Stein", "Hesse", "Röder", "Rieger", "Wendt", "Kühne", "Seeger", "Brinkmann", "Franke", "Ackermann", "Drechsler", "Wenzel", "Hagen", "Reuter", "Döring", "Groß", "Böhme", "Kellermann", "Ebert", "Renner", "Pfeiffer", "Eichhorn", "Blum", "Stoll", "Rupp", "Vetter", "Breuer", "Hildebrand", "Wendel", "Grote", "Rosenberger", "Rößler", "Adam", "Weiß", "Ostermann", "Wiegand", "Wirth", "Bode", "Brügge", "Kolb", "Geyer", "Kling", "Heßler", "Ritz", "Lambrecht", "Essing"];
        let probability = 0;
        let wordAfter = "";
        let word2After;
        let wordBefore;
        let tripleName = "";
        let inputLineWords = inputLine.split(" ");
        let tempNames = [];
        let wordAfterClean = "";

        //Vor- und Nachname-Array to lower case
        for (let a = 0; a < firstName.length; a++) {
            firstName[a] = firstName[a].toLowerCase();
        }

        for (let a = 0; a < lastName.length; a++) {
            lastName[a] = lastName[a].toLowerCase();
        }

        //Schleife und check ob das aktuelle Word im Vornamen-Array existiert
        for (let i = 0; i < inputLineWords.length; i++) {
            const tempWord = inputLineWords[i].toLowerCase();
            const tempInputWord = inputLineWords[i];
            probability = 0;

            if (firstName.includes(tempWord)) {
                probability += 50;
            }

            //checken ob das Wort vor i, falls es existiert, gewisse Stichworte enthält
            if (i !== 0) {
                wordBefore = inputLineWords[i - 1].toLowerCase();

                if (wordBefore.includes("geschäftsführer") || wordBefore.includes("ansprechpartner") || wordBefore.includes("vorstand") || wordBefore.includes("vorsitzender") || wordBefore.includes("inhaber") || wordBefore.includes("dr") && firstName.includes(tempWord) ||
                    wordBefore.includes("prof") || wordBefore.includes("herr") || wordBefore.includes("frau") || wordBefore.includes("verantwortliche") && tempWord !== "nach" || wordBefore.includes("vertreter")) {
                    probability += 40;
                } else if (wordBefore.includes("firmenname") || wordBefore.includes("umsatzsteuer-identifikationsnummer")) {
                    return tempNames;
                }
            }

            tripleName = "";

            //checken ob das Wort nach i mit dem Nachnamen Array matcht 
            if (inputLineWords[i + 1] !== undefined) {
                wordAfter = inputLineWords[i + 1].toLowerCase();
                wordAfterClean = inputLineWords[i + 1];
                if (lastName.includes(wordAfter)) {
                    probability += 40;
                }

                if (wordAfter.includes("gmbh") || wordAfter.includes("ohg") || wordAfter.includes("e.v.")) {
                    return tempNames;
                } else if (firstName.includes(wordAfter) && firstName.includes(tempWord)) { //checken ob es ein 3er-Name ist
                    if (inputLineWords[i + 2] !== undefined) {
                        word2After = inputLineWords[i + 2];
                        tripleName = tempInputWord + " " + wordAfterClean + " " + word2After;
                    }
                }
            }
            if (inputLineWords[i + 2] !== undefined) {
                word2After = inputLineWords[i + 2].toLowerCase();
                if (word2After.includes("stra")) {
                    probability -= 35;
                }
            }
            //für sauberere Ausgabe
            wordAfterClean = wordAfterClean.replaceAll(",", "").replaceAll("_", "");
            //Wahrscheinlichkeitsrundung
            if (probability > 100) {
                probability = 100;
            }
            //checken, ob Namen bereits als Objekte erstellt wurden, um Doppelungen zu vermeiden
            let inlineExistingObjects = tempNames;
            let existingObjects = this.contactPersonsCheck;
            inlineExistingObjects.forEach((nameObject, index) => {
                if (nameObject.value === tripleName || nameObject.value === tempInputWord + " " + wordAfterClean && nameObject.probability > probability) {
                    probability = 0;
                } else if (nameObject.value === tripleName || nameObject.value === tempInputWord + " " + wordAfterClean && nameObject.probability <= probability) {
                    inlineExistingObjects.splice(index, 1);
                }
            });
            existingObjects.forEach((nameObject, index) => {
                if ((nameObject.value === tripleName || nameObject.value === tempInputWord + " " + wordAfterClean) && nameObject.probability > probability) {
                    probability = 0;
                } else if ((nameObject.value === tripleName || nameObject.value === tempInputWord + " " + wordAfterClean) && nameObject.probability <= probability) {
                    console.log(nameObject);
                    existingObjects.splice(index, 1);
                }
            });
            if (probability > 0) {
                //output wenn es ein "normaler" Name ist
                if (tripleName == "") {
                    let name = tempInputWord + " " + wordAfterClean;
                    // checken, ob das Wort vorher nicht auch ein Vorname ist, dann pushen um einen möglichen 3er-Namen nicht doppelt zu erhalten
                    if (!firstName.includes(wordBefore)) {
                        //checken, ob name kein § enthält = edge case
                        if (!name.includes("§") && this.checkCorrectName(name)) {
                            tempNames.push(new CheckResult("contactPerson", name, probability));
                        }
                    }
                }
                //output bei einem 3er-Namen 
                else {
                    if (!tempNames.includes(tripleName) && this.checkCorrectName(tripleName)) {
                        tripleName = tripleName.replaceAll(",", "").replaceAll("_", "");
                        tempNames.push(new CheckResult("contactPerson", tripleName, probability));
                    }
                }
            }
        }
        return tempNames;
    }

    checkFax(inputLine) {
        let tempFax = [];
        let fullNumber = "";
        inputLine = inputLine.toLowerCase();
        let inputLineWords = inputLine.split(" ");
        let probability = 0;
        const whiteList = ("0123456789+/- ()[].");

        words: for (let i = 0; i < inputLineWords.length; i++) {
            let inputLineChars = inputLineWords[i].split("");

            for (let index = 0; index < inputLineChars.length; index++) {

                // Überprüfen, ob die Eingabe keiner Nummer entspricht
                if (!whiteList.includes(inputLineChars[index])) {

                    // Falls nach einer Nummer ein Wort kommt, wird die bisher gespeicherte Nummer ausgegeben
                    if (fullNumber.trim().length >= 6 && probability != 0) {
                        // Faxnummern einheitliche Schreibweise setzen
                        if (inputLineWords[i - 1].startsWith("0") || inputLineWords[i - 1].startsWith("(0")) {
                            tempFax.push(new CheckResult("faxNumber", inputLineWords[i - 1].replace("0", "+49"), probability));

                        } else {
                            tempFax.push(new CheckResult("faxNumber", inputLineWords[i - 1], probability));
                        }

                        if (fullNumber.startsWith("0") || fullNumber.startsWith("(0")) {
                            tempFax.push(new CheckResult("faxNumber", fullNumber.replace("0", "+49"), probability));

                        } else {
                            tempFax.push(new CheckResult("faxNumber", fullNumber, probability));
                        }
                    }
                    fullNumber = "";
                    continue words;
                }
            }

            // Checkt ob vor der nummer z.B. fax steht
            if (i !== 0) {
                let wordBefore = inputLineWords[i - 1].toLowerCase();

                if (wordBefore.includes("fax")) {
                    probability += 90;

                } else if (wordBefore.includes("tel") || wordBefore.includes("fon") || wordBefore.includes("mobil") || wordBefore.includes("handy")) {
                    return tempFax;
                }
            }

            // Checkt ob die gesamt länge der Nummer zu groß ist
            if (inputLineWords[i].length + fullNumber.length < 20) {
                fullNumber += inputLineWords[i];
            }

            let tmpFullNum = fullNumber;
            tmpFullNum = tmpFullNum.replaceAll("+", "").replaceAll("/", "").replaceAll("-", "").replaceAll(".", "");
            if (tmpFullNum.length > 5 && tmpFullNum.length < 33) {
                probability += 10;
            }
        }

        let tmpFullNum = fullNumber;
        tmpFullNum = tmpFullNum.replaceAll("+", "").replaceAll("/", "").replaceAll("-", "").replaceAll(".", "");
        if (tmpFullNum.length > 5 && tmpFullNum.length < 33) {
            probability += 10;
        }

        if (fullNumber.trim().length != 0 && probability != 0) {
            if (fullNumber.startsWith("0") || fullNumber.startsWith("(0")) {
                tempFax.push(new CheckResult("faxNumber", fullNumber.replace("0", "+49"), probability));

            } else {
                tempFax.push(new CheckResult("faxNumber", fullNumber, probability));
            }
        }

        return tempFax;
    }

    checkPhone(inputLine) {
        let tempPhone = []

        if (inputLine.length < 10) {
            return tempPhone;
        }

        let fullNumber = "";
        let fullUnformattedNumber = "";

        inputLine = inputLine.toLowerCase();
        let inputLineWords = inputLine.split(" ");
        fullUnformattedNumber = inputLine;
        let probability = 0;
        const whiteList = ("0123456789+/- ()[].");

        words: for (let i = 0; i < inputLineWords.length; i++) {


            let inputLineChars = inputLineWords[i].split("");

            for (let index = 0; index < inputLineChars.length; index++) {

                // Überprüfen, ob die Eingabe keiner Nummer entspricht
                if (!whiteList.includes(inputLineChars[index])) {

                    // Falls nach einer Nummer ein Wort kommt, wird die bisher gespeicherte Nummer ausgegeben
                    if (fullNumber.trim().length >= 6 && probability != 0) {
                        // Telefonnummer einheitliche Schreibweise setzen
                        if (inputLineWords[i - 1].startsWith("0") || inputLineWords[i - 1].startsWith("(0")) {
                            tempPhone.push(new CheckResult("phoneNumber", inputLineWords[i - 1].replace("0", "+49"), probability));

                        } else {
                            tempPhone.push(new CheckResult("phoneNumber", inputLineWords[i - 1], probability));
                        }

                        if (fullNumber.startsWith("0") || fullNumber.startsWith("(0")) {
                            tempPhone.push(new CheckResult("phoneNumber", fullNumber.replace("0", "+49"), probability));

                        } else {
                            tempPhone.push(new CheckResult("phoneNumber", fullNumber, probability));
                        }
                    }
                    fullNumber = "";
                    continue words;
                }
            }

            // Checkt ob vor der nummer z.B. Fon steht
            if (i !== 0) {
                let wordBefore = inputLineWords[i - 1].toLowerCase();
                if (wordBefore.includes("fon") || wordBefore.includes("tel") || wordBefore.includes("mobil") || wordBefore.includes("handy")) {
                    probability += 70;
                }

                if (wordBefore.includes("fax")) {
                    return tempPhone;
                }
            }

            // Checkt ob die gesamt länge der Nummer zu groß ist
            if (inputLineWords[i].length + fullNumber.length < 17) {
                fullNumber += inputLineWords[i];
                fullUnformattedNumber = fullUnformattedNumber.replace(inputLineWords[i], "");
            }

            let tmpFullNum = fullNumber;
            tmpFullNum = tmpFullNum.replaceAll("+", "").replaceAll("/", "").replaceAll("-", "").replaceAll(".", "");
            if (tmpFullNum.length > 5 && tmpFullNum.length < 20) {
                probability += 30;
            }
        }

        let tmpFullNum = fullNumber;
        tmpFullNum = tmpFullNum.replaceAll("+", "").replaceAll("/", "").replaceAll("-", "").replaceAll(".", "");
        if (tmpFullNum.length > 5 && tmpFullNum.length < 20) {
            probability += 30;
        }

        if (fullNumber.trim().length != 0 && probability != 0) {
            if (fullNumber.startsWith("+49") || fullNumber.startsWith("0") || fullNumber.startsWith("(0") || fullNumber.startsWith("(+49")) {
                if (fullNumber.startsWith("0") || fullNumber.startsWith("(0")) {
                    tempPhone.push(new CheckResult("phoneNumber", fullNumber.replace("0", "+49"), probability));

                } else {
                    tempPhone.push(new CheckResult("phoneNumber", fullNumber, probability));
                }

            }
        }

        if (tmpFullNum > 5) {
            fullUnformattedNumber = fullUnformattedNumber.trim();

            if (fullUnformattedNumber.length > 10) {

                tempPhone = tempPhone.concat(this.checkPhone(fullUnformattedNumber));
            }
        }
        return tempPhone;
    }

    checkStreets(inputLine) {
        let tempStreet = [];
        let inputLineWords = inputLine.toLowerCase().split(" ");
        let probability = 0;
        let streetNames = ["str.", "stra", "weg", "allee", "gasse", "ring", "platz", "promenade", "chaussee", "boulevard", "stieg", "pfad", "feld", "kamp", "berg", "wiesen", "hof", "lanen", "pleinen", "grachten", "singels", "hoven"];
        let stringBlacklist = "abcdefghijklmnopqrstuvwxyzäöü@#$!%^&*_={}[]|;:<>,?";
        let stringStreetBeginnings = ["an der", "zu den", "in der", "in den", "im ", "auf den", "auf der", "am ", "an den", "auf dem", "zur "];
        const blacklist = stringBlacklist.split("");
        const whiteList = ("0123456789+/-");
        let num = 0;
        let fullStreetName = "";
        let fullStreetNameClear = "";
        let houseNumber = 0;

        words: for (let i = 0; i < inputLineWords.length; i++) {

            // Zeile nach Keywords durchsuchen
            for (let sNames = 0; sNames < streetNames.length; sNames++) {

                if (inputLineWords[i].includes(streetNames[sNames])) {
                    fullStreetName = inputLine.toLowerCase();
                    fullStreetNameClear = inputLine;
                    probability += 40;

                    if (i + 1 < inputLineWords.length) {
                        let wordAfter = inputLineWords[i + 1].toLowerCase();

                        // checkt ob nach der Straße eine Hausnummer kommt
                        for (let b = 0; b < blacklist.length; b++) {
                            if (inputLineWords[i + 1].includes(blacklist[b])) {
                                num++;
                            }
                        }

                        if (num == 0) {
                            probability += 20;
                            if (wordAfter.length > 0 && wordAfter.length < 3) {
                                probability += 20;
                            } else if (wordAfter.length < 5) {
                                probability += 10;
                            }

                            // checkt, ob nach der Hausnummer ein Buchstaben Zusatz kommt
                            if (i + 2 < inputLineWords.length) {
                                let word2After = inputLineWords[i + 2].toLowerCase();

                                if (word2After.length == 1) {

                                    for (let a = 0; a < 26; a++) {

                                        if (word2After == blacklist[a]) {
                                            probability += 5;
                                        }
                                    }
                                }
                            }
                        }

                        // checkt den Fall, wenn der Nr. Zusatz nicht mit einem Leerzeichen von der Nr. getrennt ist
                        if (num == 1) {
                            probability += 30;

                            for (let z = 0; z < inputLineWords[i + 1].length - 1; z++) {

                                for (let b = 0; b < blacklist.length; b++) {
                                    // checkt, ob alle char Werte bis auf der letzte Nummer sind

                                    if (inputLineWords[i + 1][z].includes(blacklist[b])) {
                                        houseNumber++;
                                    }
                                }
                            }

                            // checkt, ob der letzte char Wert ein Buchstabe ist
                            if (houseNumber == 0) {

                                for (let alphabet = 0; alphabet < 26; alphabet++) {

                                    if (inputLineWords[i + 1][(inputLineWords[i + 1].length) - 1] == blacklist[alphabet]) {
                                        probability += 15;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        // überprüft den Fall, wenn die Adresse mit z.b. an der ... anfängt
        for (let p = 0; p < stringStreetBeginnings.length; p++) {

            if (inputLine.includes(stringStreetBeginnings[p])) {

                fullStreetName = inputLine.toLowerCase();
                fullStreetNameClear = inputLine;
                probability += 10;
                let matchingWords = stringStreetBeginnings[p].split(" ");

                words: for (let m = 0; m < inputLineWords.length; m++) {

                    if (matchingWords.length == 1) {
                        if (inputLineWords[m] == matchingWords[0]) {
                            // continue
                        } else {
                            continue words;
                        }

                    } else {

                        if (inputLineWords[m] == matchingWords[1] && inputLineWords[m - 1] == matchingWords[0]) {
                            // continue
                        } else {
                            continue words;
                        }
                    }

                    if (m + 2 < inputLineWords.length) {
                        let word2After = inputLineWords[m + 2].toLowerCase();
                        // checkt ob nach der Straße eine Hausnummer kommt
                        for (let b = 0; b < blacklist.length; b++) {

                            if (inputLineWords[m + 2].includes(blacklist[b])) {
                                num++;
                            }
                        }

                        if (num == 0) {
                            probability += 25;
                            if (word2After.length > 0 && word2After.length < 3) {
                                probability += 25;
                            } else if (word2After.length < 5) {
                                probability += 15;
                            }

                            // checkt, ob nach der Hausnummer ein Buchstaben Zusatz kommt
                            if (m + 3 < inputLineWords.length) {
                                let word3After = inputLineWords[m + 3].toLowerCase();
                                if (word3After.length == 1) {
                                    for (let a = 0; a < 26; a++) {
                                        if (word3After == blacklist[a]) {
                                            probability += 5;
                                        }
                                    }
                                }
                            }
                        }
                        // checkt den Fall, wenn der Nr. Zusatz nicht mit einem Leerzeichen von der Nr. getrennt ist
                        if (num == 1) {
                            probability += 35;

                            for (let z = 0; z < inputLineWords[m + 2].length - 1; z++) {

                                for (let b = 0; b < blacklist.length; b++) {

                                    // checkt, ob alle char Werte bis auf der letzte Nummer sind
                                    if (inputLineWords[m + 2][z].includes(blacklist[b])) {
                                        houseNumber++;
                                    }
                                }
                            }

                            // checkt, ob der letzte char Wert ein Buchstabe ist
                            if (houseNumber == 0) {
                                for (let alphabet = 0; alphabet < 26; alphabet++) {

                                    if (inputLineWords[m + 2][(inputLineWords[m + 2].length) - 1] == blacklist[alphabet]) {

                                        probability += 25;
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        if (fullStreetName.length < 20 && fullStreetName.length > 10) {
            probability += 10;
        }

        if (fullStreetName.trim().length != 0 && probability != 0) {

            tempStreet.push(new CheckResult("street", fullStreetNameClear, probability));
        }

        return tempStreet;
    }

    checkPostalCode(inputLine) {

        let tempPostalCode = [];
        inputLine = inputLine.toLowerCase();
        let inputLineWords = inputLine.split(" ");
        let city = 0;
        let cityName = 0;
        let probability = 0;
        let wordAfter;

        //wenn element mit d-/de- startet wird dieses entfernt
        for (let a = 0; a < inputLineWords.length; a++) {
            const element = inputLineWords[a];

            if (element.startsWith("d-")) {
                inputLineWords[a] = element.replace("d-", "");
                probability += 10;
            }

            if (element.startsWith("de-")) {
                inputLineWords[a] = element.replace("de-", "");
                probability += 10;
            }

            //Falls vor der 5-Stelligen Zahl ein verbotenes Keyword steht wird diese Zahl nicht angegeben 
            if (a !== 0) {
                let wordBefore = inputLineWords[a - 1];

                if (wordBefore.includes("fax") || wordBefore.includes("fon")) {
                    inputLineWords.splice(a, 1);
                }
            }
        }
        //neuer Array nur mit 5 Stelligen Zahlen 
        const onlyNumbers = inputLineWords.filter(element => !isNaN(element));

        for (let a = 0; a < onlyNumbers.length; a++) {
            const element = onlyNumbers[a];

            if (element.length !== 5) {
                onlyNumbers.splice(a, 1);
            }
        }
        //check ob elements im json enthalten sind und somit eine Stadt matchen
        zipLoop: for (let i = 0; i < onlyNumbers.length; i++) {
            const element = onlyNumbers[i];

            if (this.fetchedPostalCodes.includes(element)) {
                probability += 60;
                city = this.fetchedPostalCodes.indexOf(element);
                cityName = this.fetchedCityNames[city];

                //check ob Wort nach dem zip Code der Stadt entspricht die im json eingetragen ist
                if (inputLineWords[i + 1] !== undefined) {
                    wordAfter = inputLineWords[i + 1];

                    if (cityName.toLowerCase().includes(wordAfter)) {
                        probability += 30;
                    }

                    if (wordAfter.includes(cityName.toLowerCase())) {
                        probability = 100;
                    }
                }
            }

            //output
            if (probability > 100) {
                probability = 100;
            }

            if (probability > 0) {
                tempPostalCode.push(new CheckResult("postalCode", element, probability));

            } else {
                continue zipLoop;
            }

        }
        return tempPostalCode;
    }

    checkCity(inputLine) {
        let tempCity = [];
        let inputLineWords = inputLine.split(" ");
        let postalCode = 0;
        let cityName = 0;
        let probability = 0;
        let wordBefore;
        let cityNamesArray = this.fetchedCityNames;
        for (let a = 0; a < cityNamesArray.length; a++) {
            const element = cityNamesArray[a];
            cityNamesArray[a] = element.toLowerCase();
        }

        //check ob elements im json enthalten sind und somit eine Stadt matchen
        zipLoop: for (let i = 0; i < inputLineWords.length; i++) {
            const element = inputLineWords[i].toLowerCase();
            const elementClear = inputLineWords[i];
            probability = 0;
            if (cityNamesArray.includes(element)) {
                probability += 60;
                cityName = this.fetchedCityNames.indexOf(element);
                postalCode = this.fetchedPostalCodes[cityName];

                //check ob Wort nach dem zip Code der Stadt entspricht die im json eingetragen ist
                if (inputLineWords[i - 1] !== undefined) {
                    wordBefore = inputLineWords[i - 1];

                    const onlyNumbers = inputLineWords.filter(element => !isNaN(element));

                    for (let a = 0; a < onlyNumbers.length; a++) {
                        const e = onlyNumbers[a];

                        if (e.length !== 5) {
                            onlyNumbers.splice(a, 1);
                        }
                    }

                    if (onlyNumbers.includes(wordBefore)) {
                        probability += 10;
                    }
                    if (wordBefore.startsWith("d-")) {
                        wordBefore = wordBefore.replace("d-", "");
                        probability += 10;
                    }

                    if (wordBefore.startsWith("de-")) {
                        wordBefore = wordBefore.replace("de-", "");
                        probability += 10;
                    }
                    if (postalCode.toLowerCase().includes(wordBefore)) {
                        probability += 30;
                    }

                    if (wordBefore.includes(postalCode.toLowerCase())) {
                        probability = 100;
                    }
                    if (wordBefore.toLowerCase().includes("amtsgericht")
                        || wordBefore.toLowerCase().includes("finanzamt")) {
                        probability = 15;
                    }
                }
            }
            //checken, ob citys bereits ein Objekt haben, um Doppelungen zu vermeiden
            let existingObjects = this.citysCheck;
            let inlineExistingObjects = tempCity;
            inlineExistingObjects.forEach((cityObject, index) => {
                if (cityObject.value.toLowerCase() === elementClear.toLowerCase() && cityObject.probability > probability) {
                    probability = 0;
                } else if (cityObject.value.toLowerCase() === elementClear.toLowerCase() && cityObject.probability <= probability) {
                    inlineExistingObjects.splice(index, 1);
                }
            });
            existingObjects.forEach((cityObject, index) => {
                if (cityObject.value.toLowerCase() === elementClear.toLowerCase() && cityObject.probability > probability) {
                    probability = 0;
                } else if (cityObject.value.toLowerCase() === elementClear.toLowerCase() && cityObject.probability <= probability) {
                    existingObjects.splice(index, 1);
                }
            });
            //output
            if (probability > 100) {
                probability = 100;
            }

            if (probability > 0) {
                tempCity.push(new CheckResult("city", elementClear, probability));

            } else {
                continue zipLoop;
            }

        }
        return tempCity;
    }

    checkCompanyRegistrationNumber(inputLine) {
        let tempRegistrationNumber = [];
        let inputLineWords = inputLine.split(" ");
        let probability = 0;
        let wordBefore;

        for (let index = 0; index < inputLineWords.length; index++) {
            const element = inputLineWords[index];
            probability = 0;

            //checken, ob im word vor dem element ein bestimmtes Keyword/Blacklist-Wort steht
            if (index !== 0) {
                wordBefore = inputLineWords[index - 1].toLowerCase();

                if (wordBefore.startsWith("hrb") || wordBefore.startsWith("hra") || wordBefore.startsWith("hr") || wordBefore.startsWith("hrg") || wordBefore.startsWith("hrm")) {
                    probability = +50;
                }
            }

            if (probability > 100) {
                probability = 100;
            }
            //Objekt Erstellung / Output            
            if (probability > 0) {
                tempRegistrationNumber.push(new CheckResult("registrationNumber", element.replaceAll(",", "").replaceAll(".", ""), probability));
            }
        }
        return tempRegistrationNumber;
    }

    checkVatIdNumber(inputLine) {
        let tempTax = [];
        let inputLineWords = inputLine.split(" ");
        let wordBefore;
        let probability = 0;
        let tempInputWords = inputLine.split(" ");
        let elementReplaced;
        //checken, ob es mit DE startet und dann DE replacen für den onlyNumbers Array
        for (let index = 0; index < tempInputWords.length; index++) {
            const element = tempInputWords[index].toLowerCase();
            if (element.startsWith("de")) {
                tempInputWords[index] = element.replace("de", "");
            }
        }
        const onlyNumbers = tempInputWords.filter(element => !isNaN(element));
        //onlyNumbers Array wird auf Zahlen mit ausschließlich 9 Ziffern begrenzt  
        for (let a = 0; a < onlyNumbers.length; a++) {
            const el = onlyNumbers[a];
            if (el.length !== 9) {
                onlyNumbers.splice(a, 1);
            }
        }
        //checken, ob vor dem element ein string mit bestimmten Keyword steht und ob element mit de startet
        for (let index = 0; index < inputLineWords.length; index++) {
            const elementClear = inputLineWords[index];
            const element = inputLineWords[index].toLowerCase();
            if (element.startsWith("de")) {
                // Extrahiere die letzten beiden Zeichen des Elements
                const lastTwoCharacters = element.slice(-2);

                // Überprüfe, ob die letzten beiden Zeichen Zahlen sind
                if (!isNaN(lastTwoCharacters)) {
                    // Entferne "de" aus dem Element
                    elementReplaced = element.replace("de", "");

                    // Erhöhe die Wahrscheinlichkeit um 15
                    probability += 15;
                } else {
                    elementReplaced = element;
                }
            } else {
                elementReplaced = element;
            }
            if (index !== 0) {
                wordBefore = inputLineWords[index - 1].toLowerCase();
                if (wordBefore.includes("ust.-idnr.") || wordBefore.includes("umsatzsteuer-id")) {
                    probability += 70;
                } else if (wordBefore.includes("fon") || wordBefore.includes("fax")) {
                    probability = 0;
                }
            }
            //checken, ob das element eine 9 stellige Zahl ist und ob verbotene keywords davorstehen
            for (let i = 0; i < onlyNumbers.length; i++) {
                const e = onlyNumbers[i];
                if (e == elementReplaced && elementReplaced.length == 9) {
                    probability += 40;
                    if (index !== 0) {
                        if (wordBefore.includes("fon") || wordBefore.includes("fax")) {
                            probability = 0;
                        }
                    }
                }
            }
            //Rundungen
            if (probability > 100) {
                probability = 100;
            }
            //Objekt Erstellung / Output
            if (probability > 0) {
                tempTax.push(new CheckResult("vatIdNumber", elementClear, probability));
            }
        }
        return tempTax;
    }

    checkTaxNumber(inputLine) {
        let tempTax = [];
        let inputLineWords = inputLine.toLowerCase().split(" ");
        let probability = 0;
        const whiteList = "0123456789/";
        const numbers = "0123456789"

        wordloop: for (let index = 0; index < inputLineWords.length; index++) {
            const element = inputLineWords[index];
            const wordChars = element.split("");

            if (element === "finanzamt") {
                probability += 30;

                this.fetchedCityNames.forEach(element => {
                    if (element === inputLineWords[index + 1]) {
                        probability += 40;
                    }
                });
            }

            charLoop: for (let i = 0; i < wordChars.length; i++) {

                if (!whiteList.includes(wordChars[i])) {
                    continue wordloop;
                } else {
                    probability += 10;
                }
            }

            // Checkt ob folgendes Format vorliegt: 123/4567/9876
            let tempWord = element.split("/");
            let tempCount = 0;

            if (tempWord.length == 3 && tempWord[0].length == 3 && tempWord[1].length == 4 && tempWord[2].length == 4) {
                probability += 20;
            }

            tempWord.forEach(element => {

                element.split("").forEach(chars => {

                    if (numbers.includes(chars)) {
                        probability += 30;
                        tempCount++;
                    } else {
                        return tempTax
                    }
                });
            });

            if (tempCount == 11) {
                tempTax.push(new CheckResult("companyTax", inputLineWords[index], probability));
            }
        }
        return tempTax;
    }

    checkCorrectName(name) {
        const germanNamesWhitelist = [
            'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm',
            'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z',
            'ä', 'ö', 'ü', 'ß', '-', ' '
        ];
        name = name.toLowerCase();
        // Überprüfe, ob alle Zeichen in der Variable im germanNamesWhitelist Array enthalten sind
        return name.split('').every(char => germanNamesWhitelist.includes(char));
    }

    filterResults(Array) {
        let tempArray = [];

        // neuen Array mit elementen befüllen die eine größerer Wkeit als die Übergebne haben
        Array.forEach(element => {
            if (element.probability >= this.outputPercentage) {
                if (element.probability > 100) {
                    element.probability = 100;
                }
                tempArray.push(element);
            }
        });
        return tempArray;
    }
}
