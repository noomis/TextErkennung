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
    language = "";

    constructor(language = null, outputPercentage) {

        if (!language) {
            //default language = "de"
            this.language = "de"
        } else {
            this.language = language;
            console.log(language);
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
        //Split input by lines
        let inputLines = input.split("\n");
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

        //Address Object is created with information that at least corresponds to the specified probability
        let addressObject = new Address(
            this.filterResults(this.companyNamesCheck),
            this.filterResults(this.postalCodeCheck),
            this.filterResults(this.streetsCheck),
            this.filterResults(this.citysCheck),
            this.filterResults(this.homepageCheck),
            this.filterResults(this.w3wAddressCheck),
            this.filterResults(this.emailsCheck),
            this.filterResults(this.phoneNumbersCheck),
            this.filterResults(this.faxNumbersCheck),
            this.filterResults(this.contactPersonsCheck),
            this.filterResults(this.companyRegistrationNumberCheck),
            this.filterResults(this.vatIdNumberCheck),
            this.filterResults(this.taxNumberCheck),
            this.language
        )
        console.log(addressObject);

        return addressObject;
    }

    checkW3ws(inputLine) {
        let tempW3w = [];
        let inputLineWords = inputLine.split(" ");
        inputLine = inputLine.toLowerCase();
        let probability = 0;
        const whiteList = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ./".split("");

        words: for (let i = 0; i < inputLineWords.length; i++) {
            let countDot = 0;
            let lineChars = inputLineWords[i].split("");

            for (let index = 0; index < lineChars.length; index++) {

                //Check if the letters are valid by matching the list
                if (!whiteList.includes(lineChars[index])) {

                    //For a link to the w3w address, remove the directory path of the url and continue through with the rest of it
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

            //exclude url
            if (inputLineWords[i].includes("www")) {
                continue;
            }

            //If there are two points, then split the line and check the length of the individual words
            if (countDot == 2) {
                let wordLength = inputLineWords[i].split(".");

                for (let t = 0; t < wordLength.length; t++) {
                    if (wordLength[t].length < 2) {
                        return tempW3w;

                        //Max length of a w3w word
                    } else if (wordLength[t].length <= 24) {
                        probability += 20;
                    }
                }
            } else {
                continue;
            }

            //check if there are 2 points in the word
            if (countDot == 2) {
                probability += 20;
            }

            if (i !== 0) {
                let wordBefore = inputLineWords[i - 1].toLowerCase();
                //Checks whether the w3w address is preceded by w3w, for example.
                if (
                    wordBefore.includes("w3w")
                    || wordBefore.includes("what 3 words")
                    || wordBefore.includes("what3words")
                    || wordBefore.includes("position")
                    || wordBefore.includes("///")
                ) {
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
        //all words to lowercase and in new array addden
        let inputLineWords = inputLine.toLowerCase().split(" ");
        let tempUrl = [];
        let knownTLD = ["com", "net", "org", "de", "eu", "at", "ch", "nl", "pl", "fr", "es", "info", "name", "email", "co", "biz", "uk"];

        //for loop that loops through all words from the input
        wordLoop: for (let i = 0; i < inputLineWords.length; i++) {
            const element = inputLineWords[i];
            let probability = 0;

            for (const tld of knownTLD) {
                //increase prob if element endsWith known Top Level Domain
                if (element.endsWith("." + tld || element.endsWith("." + tld + "/"))) {
                    probability += 20;
                }

                //increase prob if element includes known Top Level Domain
                if (element.includes("." + tld)) {
                    probability += 10;
                }
            }

            //check whether certain criteria are met
            if (element.startsWith("http")) {
                probability += 30;
            }

            if (element.includes("://")) {
                probability += 10;
            }
            //check how many points are in the array to filter out invalid URLs
            const dots = element.split(".");

            if (element.includes("www.")) {
                probability += 30;
                if (dots.length > 2) {
                    probability += 40
                }
            }

            //if there are no or only 1 point in the array, the prob is set to 0.
            if (dots.length <= 2) {
                continue wordLoop;
            }

            if (i !== 0) {
                let wordBefore = inputLineWords[i - 1].toLowerCase();

                //Checks whether certain keywords appear before the URL
                if (
                    wordBefore.includes("url")
                    || wordBefore.includes("website")
                    || wordBefore.includes("homepage")
                    || wordBefore.includes("internet")
                ) {
                    probability += 20;
                }
            }
            //check whether certain illegal terms are contained in the element
            if (
                element.includes("ö")
                || element.includes("ü")
                || element.includes("ß")
                || element.includes("ä")
                || element.includes("@")
                || element.includes("(at)")
            ) {
                return tempUrl;
            }

            //round
            if (probability > 100) {
                probability = 100;
            }

            if (probability < 0) {
                probability = 0;
            }
            //Create output object for elements with more than 0%
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
            let wordProb = 0; //Hit probability
            let atHit = []; //Number of @ in the string
            let dotHit = []; // Number of . in the string
            let hasTLD = false; // hat TLD Domain
            const element = inputLineWords[index];

            //Splits each word into individual chars
            let wordChars = element.split("");

            //Checks whether TLD exists
            knownTLD.forEach(tld => {
                if (element.endsWith("." + tld)) {
                    hasTLD = true;
                }
            });

            //Checks if string starting with @
            if (element.startsWith('@')) {
                continue wordLoop;
            } else {
                wordProb += 5;
            }

            //Checks if string starting with @
            if (element.startsWith('.')) {
                continue wordLoop;
            } else {
                wordProb += 5;
            }

            //Checks whether there are at least 6 characters
            if (element.length < 6) {
                continue wordLoop;
            } else {
                wordProb += 10;
            }

            //Loop to iterate through each character of a word
            charLoop: for (let i = 0; i < wordChars.length; i++) {
                const element = wordChars[i];

                if (
                    element === "@"
                    || (
                        wordChars[i] == "("
                        && wordChars[i + 1] == "a"
                        && wordChars[i + 2] == "t"
                        && wordChars[i + 3] == ")"
                        || (
                            wordChars[i] == "["
                            && wordChars[i + 1] == "a"
                            && wordChars[i + 2] == "t"
                            && wordChars[i + 3] == "]"
                        ))
                ) {  // countet @
                    atHit.push(i);
                }

                // counts dots
                if (element === ".") {
                    dotHit.push(i);

                    //prevents consecutive points.
                    if (wordChars[i + 1] === ".") {
                        continue wordLoop;
                    }
                }
            }

            //checks whether exactly one @ is present.
            if (atHit.length !== 1) {
                continue wordLoop;
            } else {
                wordProb += 25;
            }

            //checks whether at least one point is present.
            if (dotHit.length == 0) {
                continue wordLoop;
            } else {
                wordProb += 5;
            }

            //TODO continue comments change to english
            //Checks whether the local domain is at least 2 characters long.
            if (dotHit.length > 1) {
                if (dotHit[dotHit.length - 1] - atHit[0] < 3) {
                    continue wordLoop;
                } else {
                    wordProb += 10;
                }
            } else if (dotHit.length == 1) { // Checkt ob die local domain mindestens 2 Zeichen lang ist.
                if (dotHit[0] - atHit[0] < 3) {
                    continue wordLoop;
                } else {
                    wordProb += 10;
                }
            }

            if (hasTLD === false) { // checkt ob eine TLD vorhanden ist.
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
        const companyTypeGerman = [ // deutsche Unternehmensformen
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

        const companyTypeEnglish = [    // englische Unternehmensformen
            "sole proprietorship", "sole prop.",
            "limited liability company", "llc",
            "corporation", "corp.",
            "general partnership", "gen. partn.",
            "limited partnership", "ltd. partn.",
            "civil law partnership", "clp",
            "limited", "ltd", "ltd.",
            "entrepreneurial company", "ec",
            "sole trader", "sole trader",
            "private limited company", "plc",
            "public limited company", "plc",
            "non-profit association", "non-profit assoc.",
            "municipality", "muni"
        ];

        const companyTypeDutch = [ // niederländische Unternehmensformen
            "eenmanszaak", "eenm.",
            "besloten vennootschap", "bv", "b.v.",
            "naamloze vennootschap", "nv",
            "vennootschap onder firma", "vof",
            "commanditaire vennootschap", "cv",
            "maatschap", "maatschap",
            "limited", "limited",
            "ondernemerschap", "ondernemerschap",
            "eenmanszaak", "eenm.",
            "besloten vennootschap", "bv",
            "naamloze vennootschap", "nv",
            "vennootschap onder firma", "vof",
            "commanditaire vennootschap", "cv",
            "non-profit organisatie", "non-profit org.",
            "gemeente", "gemeente"
        ];


        const companyKeyWordsGerman = ['metzgerei', 'computer', 'lackierer', 'tiefbau', 'feuerwehr', 'elektro', 'weincontor', 'weinimport', 'gerüstbau', 'hochbau', 'auto', 'galabau', 'elektriker', 'technik', 'tischlerei', 'reinigungsdienst', 'bauunternehmen', 'autohaus', 'schreinerei', 'friseursalon', 'fliesenleger', 'steuerberater', 'gartenbau', 'heizungsbau', 'sanitärinstallateur', 'baustoffhandel', 'werbeagentur', 'architekturbüro', 'edv-dienstleister', 'druckerei', 'holzbau', 'metallbau', 'malerbetrieb', 'versicherungsmakler', 'schuhgeschäft', 'buchhandlung', 'konditorei', 'baeckerei', 'elektronikladen', 'schneider', 'juwelier', 'haustierbedarf', 'blumenladen', 'optiker', 'hörgeräteakustik', 'spielwarengeschäft', 'fahrschule', 'küchenstudio', 'reisebüro', 'sportgeschäft', 'tankstelle', 'schuhmacher', 'taschengeschäft', 'dachdecker', 'zimmerei', 'fußpflege', 'druckerei', 'fahrradladen', 'elektrogroßhandel', 'lebensmittelmarkt', 'möbelhaus', 'uhrengeschäft', 'solaranlagen', 'baumaschinenverleih', 'tattoostudio', 'hundesalon', 'dönerimbiss', 'bauchladen', 'tauchschule', 'sonnenstudio', 'fotostudio', 'teppichreinigung', 'musikschule', 'modedesigner', 'yogastudio', 'autowerkstatt', 'haustechnik', 'teppichhandel', 'saunaanlagen', 'angelgeschäft', 'schlüsseldienst', 'gitarrenbau', 'fischzucht', 'hochzeitsplanung', 'hutgeschäft', 'schwimmbadtechnik', 'spielzeughersteller', 'hörbuchverlag', 'treppenbau', 'kanzlei', 'autovermietung', 'schraubenhandel', 'apotheken', 'schädlingsbekämpfung', 'vinothek', 'saftladen', 'computerladen', 'spielothek', 'elektronikmarkt', 'kindergarten', 'tanzschule', 'mietkoch', 'papierhandel', 'uhrenwerkstatt', 'stoffgeschäft', 'handyshop', 'kochschule', 'modellbau', 'goldschmied', 'floristik', 'brautmoden', 'schausteller', 'wassersport', 'segelschule', 'surfschule', 'angeln', 'haushaltswaren', 'kinderschuhladen', 'brennholzhandel', 'kaminbau', 'fotograf', 'gärtnerei', 'bioladen', 'schuhreparatur', 'mietrechtsschutz', 'müllentsorgung', 'baumschule', 'schwimmbadbau', 'catering', 'beauty-salon', 'biogasanlage', 'datenrettung', 'zeltverleih', 'videoproduktion', 'teppichhandel', 'tontechnik', 'wäscherei', 'tischlerei', 'teigwarenhersteller', 'touristik', 'taschenhersteller', 'stickerei', 'segelmacher', 'schwimmbadtechnik', 'segway-verleih', 'rolladenbau', 'reinigungsdienst', 'reiseveranstalter', 'rechtsanwalt', 'reifenservice', 'regalsysteme', 'pizzabringdienst', 'pflanzenhandel', 'pediküre', 'patisserie', 'partyservice', 'parkettverleger', 'papiergroßhandel', 'outdoorladen', 'online-marketing', 'optikergeschäft', 'orthopädietechnik', 'ölhandel', 'obstgroßhandel', 'nähmaschinenreparatur', 'motorradwerkstatt', 'mosaikleger', 'möbeltransport', 'modellflug', 'modellbahn', 'mobilfunk', 'möbeltischlerei', 'milchhandel', 'mietwagen', 'metallhandel', 'massagestudio', 'markisenbau', 'maniküre', 'malermeister', 'malerbetrieb', 'makler', 'luftaufnahmen', 'lkw-vermietung', 'lkw-werkstatt', 'logistik', 'lebensmittelhandel', 'landwirtschaft', 'lampenladen', 'laminatverleger', 'kühlhaus', 'küchenplanung', 'küchenstudio', 'küchenmontage', 'kosmetikinstitut', 'konditorei', 'kochstudio', 'kiosk', 'kinderbetreuung', 'kindermode', 'kinderzahnarzt', 'kinderarzt', 'kinderwunschzentrum', 'kinderkrippe', 'kinderpsychologe', 'kinesiologie', 'kimono-shop', 'kino', 'kiosk', 'kirchenmusik', 'kirchengemeinde', 'kiteschule', 'kletterhalle', 'konditorei', 'kosmetikstudio', 'krankenhaus', 'kunsthandel', 'kunstschule', 'kunststoffverarbeitung', 'künstleragentur', 'küchenstudio', 'kutschenverleih', 'labordienst', 'lackiererei', 'landgasthof', 'landwirtschaft', 'lebensberatung', 'lebensmittelgroßhandel', 'lebensmittelhandel', 'lebensmittelhersteller', 'lederwaren', 'lehrer', 'lerntherapie', 'lingerie-shop', 'logistikunternehmen', 'lottoladen', 'luxusuhren', 'makler', 'marketingagentur', 'massagepraxis', 'möbelhaus', 'müllabfuhr', 'müllentsorgung', 'müllverwertung', 'museum', 'musikgeschäft', 'musiklehrer', 'musikschule', 'musikstudio', 'nagelstudio', 'nahrungsergänzung', 'naturheilpraxis', 'neurologe', 'notar', 'nudelhersteller', 'ölhandel', 'obsthof', 'optiker', 'orthopäde', 'orthopädieschuhtechnik', 'packaging-design', 'papiergroßhandel', 'partyservice', 'personalberatung', 'pfandhaus', 'pflegeheim', 'pflasterarbeiten', 'pflanzenhandel', 'pflegedienst', 'physiotherapie', 'pianohaus', 'pilzzucht', 'pizza-lieferdienst', 'planungsbüro', 'polsterer', 'pr-agentur', 'pralinenhersteller', 'private-krankenversicherung', 'privatschule', 'psychiater', 'psychologe', 'psychosoziale-beratung', 'puppentheater', 'putzfrau', 'radiosender', 'rechtsanwalt', 'rechtsanwältin', 'reifenservice', 'reinigungsservice', 'reiseagentur', 'reisebüro', 'reiseveranstalter', 'reiseversicherung', 'reitsportgeschäft', 'relaxsessel', 'rentenberatung', 'restaurant', 'restauration', 'retail-design', 'rezepturenentwicklung', 'rollstuhlbau', 'rückentraining', 'saftbar', 'schauspieler', 'schlüsseldienst', 'schneiderei', 'schnittblumen', 'schokoladenhersteller', 'schornsteinfeger', 'schreibwarenhandel', 'schreinerei', 'schrottentsorgung', 'schuhgeschäft', 'schuldnerberatung', 'schwimmbadtechnik', 'schwimmschule', 'segelbootverleih', 'segelflugplatz', 'segelschule', 'sehenswürdigkeit', 'sekretariatsservice', 'selbsthilfegruppe', 'seniorendienstleistung', 'seniorenheim', 'seniorenpflege', 'shisha-bar', 'shopfitting', 'sicherheitsdienst', 'siedlungswasserwirtschaft', 'solaranlagen', 'sonnenstudio', 'sozialamt', 'sozialberatung', 'sozialdienst', 'sozialkaufhaus', 'sozialpädagogik', 'sozialpsychiatrischer-dienst', 'sozialstation', 'sozialtherapie', 'spedition', 'spielhalle', 'spielplatzbau', 'spielzeugladen', 'sportanlagenbau', 'sportartikelhersteller', 'sportgeschäft', 'sportlerheim', 'sportsbar', 'sportverein', 'stadtführung', 'stahlbau', 'staubsaugervertretung', 'steuerberatung', 'steuerberater', 'steuerfachangestellter', 'stoffgeschäft', 'straßenbau', 'stuckateur', 'studentenwohnheim', 'studienberatung', 'subunternehmen', 'supermarkt', 'sushi-bar', 'tanzschule', 'tapetenhandel', 'tattooentfernung', 'tattoostudio', 'tauchschule', 'taxiunternehmen', 'teichbau', 'teigwarenhersteller', 'telemarketing', 'telekommunikationsunternehmen', 'textildruck', 'textilveredelung', 'textilgroßhandel', 'textilhandel', 'theater', 'theaterkasse', 'theaterwerkstatt', 'therapeut', 'tierarzt', 'tierbestattung', 'tierfutterhandel', 'tierpension', 'tierpsychologie', 'tierschutzverein', 'tischlerei', 'tofuhersteller', 'tonstudio', 'touristikunternehmen', 'toyota-händler', 'traditionsunternehmen', 'trainingszentrum', 'transportunternehmen', 'treppenbau', 'trockenbau', 'trockenfrüchtehandel', 'trockenreinigung', 'trödelmarkt', 'tuningwerkstatt', 'uhrengeschäft', 'uhrenhandel', 'uhrenreparatur', 'uhrenwerkstatt', 'umzugsunternehmen', 'unternehmensberater', 'unternehmerverband', 'unterwäschehersteller', 'urlaubsbauernhof', 'us-car-vermietung', 'us-car-werkstatt', 'us-import', 'us-restaurant', 'us-shop', 'us-sportwagenvermietung', 'us-truck-vermietung', 'us-truck-werkstatt', 'us-tuning', 'uscar-handel', 'uscar-händler', 'uscar-import', 'uscar-reparatur', 'uscar-restauration', 'uscar-tuning'];
        const companyKeyWordsDutch = ['slagerij', 'computer', 'schilder', 'grondwerken', 'brandweer', 'elektrisch', 'wijnhandel', 'wijnimport', 'steigerbouw', 'bouw', 'auto', 'tuinaanleg', 'elektricien', 'technologie', 'timmerwerk', 'bakkerij', 'reclame', 'meubelmaker', 'dakdekker', 'loodgieter', 'advocaat', 'accountant', 'fotograaf', 'architect', 'loods', 'makelaar', 'kapper', 'schoonheidsspecialist', 'supermarkt', 'boekhandel', 'opticien', 'tandarts', 'apotheek', 'fietsenwinkel', 'juwelier', 'reisbureau', 'restaurant', 'cafetaria', 'snackbar', 'hotel', 'bar', 'catering', 'bouwmarkt', 'dierenwinkel', 'plantenkwekerij', 'zagerij', 'transportbedrijf', 'drukkerij', 'uitgeverij', 'verzekering', 'bank', 'garage', 'tankstation', 'reparatie', 'installatie', 'schrijnwerkerij', 'verlichting', 'verwarming', 'sanitair', 'schilderij', 'kunstgalerij', 'museum', 'theater', 'bioscoop', 'concertzaal', 'evenementenlocatie', 'recreatiepark', 'pretpark', 'zoo', 'botanische tuin', 'sporthal', 'fitnesscentrum', 'zwembad', 'tennisbaan', 'golfbaan', 'voetbalveld', 'basketbalveld', 'volleybalveld', 'sportschool', 'yogastudio', 'pilatesstudio', 'dansstudio', 'muziekschool', 'taalschool', 'universiteit', 'hogeschool', 'basisschool', 'kinderopvang', 'peuterspeelzaal', 'speelgoedwinkel', 'kinderkleding', 'babywinkel', 'zwangerschapswinkel', 'kraamzorg', 'verloskundige', 'fysiopraktijk', 'chiropractor', 'thuiszorg', 'verpleeghuis', 'ziekenhuis', 'huisarts', 'dierenarts', 'dierenopvang', 'dierenartspraktijk', 'trimsalon', 'hondenuitlaatservice', 'supermarkt', 'boekhandel', 'opticien', 'tandarts', 'apotheek', 'fietsenwinkel', 'juwelier', 'reisbureau', 'restaurant', 'cafetaria', 'snackbar', 'hotel', 'bar', 'catering', 'bouwmarkt', 'dierenwinkel', 'plantenkwekerij', 'zagerij', 'transportbedrijf', 'drukkerij', 'uitgeverij', 'verzekering', 'bank', 'garage', 'tankstation', 'reparatie', 'installatie', 'schrijnwerkerij', 'verlichting', 'verwarming', 'sanitair', 'schilderij', 'kunstgalerij', 'museum', 'theater', 'bioscoop', 'concertzaal', 'evenementenlocatie', 'recreatiepark', 'pretpark', 'zoo', 'botanische tuin', 'sporthal', 'fitnesscentrum', 'zwembad', 'tennisbaan', 'golfbaan', 'voetbalveld', 'basketbalveld', 'volleybalveld', 'sportschool', 'yogastudio', 'pilatesstudio', 'dansstudio', 'muziekschool', 'taalschool', 'universiteit', 'hogeschool', 'basisschool', 'kinderopvang', 'peuterspeelzaal', 'speelgoedwinkel', 'kinderkleding', 'babywinkel', 'zwangerschapswinkel', 'kraamzorg', 'verloskundige', 'fysiopraktijk', 'chiropractor', 'thuiszorg', 'verpleeghuis', 'ziekenhuis', 'huisarts', 'dierenarts', 'dierenopvang', 'dierenartspraktijk', 'trimsalon', 'hondenuitlaatservice'];
        const companyKeyWordsEnglish = ['butcher', 'computer', 'painter', 'groundworks', 'fire brigade', 'electric', 'wine shop', 'wine import', 'scaffolding', 'construction', 'car', 'landscaping', 'electrician', 'technology', 'carpentry', 'bakery', 'advertising', 'furniture maker', 'roofer', 'plumber', 'lawyer', 'accountant', 'photographer', 'architect', 'warehouse', 'real estate agent', 'hairdresser', 'beautician', 'supermarket', 'bookstore', 'optician', 'dentist', 'pharmacy', 'bicycle shop', 'jeweler', 'travel agency', 'restaurant', 'cafeteria', 'snack bar', 'hotel', 'bar', 'catering', 'hardware store', 'pet shop', 'nursery', 'sawmill', 'transport company', 'printing press', 'publishing house', 'insurance', 'bank', 'garage', 'gas station', 'repair', 'installation', 'joinery', 'lighting', 'heating', 'sanitary', 'painting', 'art gallery', 'museum', 'theater', 'cinema', 'concert hall', 'event venue', 'recreation park', 'amusement park', 'zoo', 'botanical garden', 'sports hall', 'fitness center', 'swimming pool', 'tennis court', 'golf course', 'football field', 'basketball court', 'volleyball court', 'gym', 'yoga studio', 'pilates studio', 'dance studio', 'music school', 'language school', 'university', 'college', 'primary school', 'daycare', 'preschool', 'toy store', 'childrens clothing', 'baby store', 'maternity store', 'maternity care', 'midwife', 'physiotherapy practice', 'chiropractor', 'home care', 'nursing home', 'hospital', 'general practitioner', 'veterinarian', 'animal shelter', 'veterinary clinic', 'dog grooming', 'dog walking service', 'plumbing supplies', 'gardening equipment', 'electronics store', 'office supplies', 'fashion boutique', 'shoe store', 'music store', 'record store', 'pawn shop', 'tattoo parlor', 'beauty salon', 'tanning salon', 'massage therapy', 'tattoo removal', 'antique shop', 'home decor store', 'kitchenware store', 'gift shop', 'florist', 'party supply store', 'wedding planner', 'event rental service', 'catering service', 'cleaning service', 'laundry service', 'pest control service', 'moving company', 'storage facility', 'security service', 'private investigator', 'funeral home', 'cremation service', 'florist', 'bicycle repair shop', 'computer repair shop', 'cell phone repair', 'shoe repair', 'watch repair', 'jewelry repair', 'tailor', 'dry cleaner', 'auto body shop', 'auto parts store', 'tire shop', 'car wash', 'detailing service', 'auto glass shop', 'motorcycle shop', 'motorcycle repair', 'boat dealer', 'marina', 'yacht club', 'boat rental', 'boat repair', 'fishing supply store', 'tackle shop', 'hunting supply store', 'gun shop', 'pawn shop', 'sporting goods store', 'bicycle shop', 'bike rental', 'ski rental', 'ski shop', 'snowboard shop', 'surf shop', 'skate shop', 'skateboard shop', 'snowboard rental', 'golf shop', 'tennis shop', 'fitness equipment store', 'yoga studio', 'pilates studio', 'gymnastics center', 'climbing gym', 'boxing gym', 'karate school', 'martial arts studio', 'dance studio', 'ballet school', 'salsa dance studio', 'hip hop dance studio', 'jazz dance studio', 'tap dance studio', 'ballroom dance studio', 'swing dance studio', 'modern dance studio', 'belly dance studio', 'flamenco dance studio', 'contemporary dance studio', 'folk dance studio', 'zumba studio', 'fitness boot camp', 'crossfit gym', 'personal trainer', 'nutritionist', 'weight loss center', 'dietitian', 'physical therapist', 'chiropractor', 'acupuncture clinic', 'massage therapist', 'spa', 'beauty salon', 'hair salon', 'nail salon', 'esthetician', 'facial spa', 'medical spa', 'tanning salon', 'makeup artist', 'lash extensions', 'waxing salon', 'hair removal', 'tattoo parlor', 'piercing studio', 'body piercing', 'microblading', 'permanent makeup', 'barber shop', 'mens grooming', 'shave barber', 'beard grooming', 'massage therapist', 'shiatsu massage', 'deep tissue massage', 'swedish massage', 'sports massage', 'reflexology', 'hot stone massage', 'aromatherapy', 'prenatal massage', 'couples massage', 'Thai massage', 'Indian head massage']

        let inputLineClear = inputLine;
        inputLine = inputLine.toLowerCase();
        let inputLineWords = inputLine.split(" ");

        let companyType = companyTypeGerman;
        let companyKeyWords = companyKeyWordsGerman;

        switch (this.language.languageName) {   // je nach Land die jeweiligen Arrays festlegen

            case "de":
                companyType = companyTypeGerman;
                companyKeyWords = companyKeyWordsGerman;
                break;

            case "eng":
                companyType = companyTypeEnglish;
                companyKeyWords = companyKeyWordsEnglish;
                break;

            case "nl":
                companyType = companyTypeDutch;
                companyKeyWords = companyKeyWordsDutch;
                break;

            default:
                break;

        }

        wordLoop: for (let index = 0; index < inputLineWords.length; index++) {
            const element = inputLineWords[index];

            if (element.includes('@')) { // Checkt ob String mit @ beginnt
                return tempCheckCompanyNames;
            }

            if (element.includes('(at)')) { // Checkt ob String mit @ beginnt
                return tempCheckCompanyNames;
            }
            for (let i = 0; i < knownTLD.length; i++) {
                const el = knownTLD[i];
                if (element.startsWith("www.") && element.endsWith(el)) { // checkt ob das aktulle Wort eine URL ist
                    return tempCheckCompanyNames;
                }
            }

            companyType.forEach(e => { // Checkt ob das aktuelle Wort einer Unternehmensform entspricht

                if (element == e) {
                    wordProb += 50;
                }
            });
        }

        companyKeyWords.forEach(element => { // Checkt ob das aktuelle Wort einem Company Keyword entspricht z.B. Malerei, Straßenbau usw.
            if (inputLine.includes(element)) {
                wordProb += 50;
            }
        });
        inputLineClear = inputLineClear.replace('Name', ''); // Entfernt den Titel "Name" aus z.B. SelectLine 
        tempCheckCompanyNames.push(new CheckResult("companyName", inputLineClear, wordProb));
        return tempCheckCompanyNames;
    }

    checkContactPersons(inputLine) {
        const firstName = ["Fenna", "Luuk", "Jane", "Evi", "Jurre", "Lotte", "Stijn", "Saar", "Francesco", "Thijs", "Lynn", "Tijn", "Maud", "Bram", "Isa", "Sem", "Tessa", "Jens", "Jan-Peer", "Fleur", "Daan", "Noa", "Femke", "Sven", "Loes", "Mees", "Noor", "Luuk", "Liv", "Jesse", "Mila", "Noud", "Elin", "Ruben", "Femke", "Jelle", "Jasmijn", "Tygo", "Sophie", "Rens", "Elin", "Lars", "Eva", "Niek", "Jara", "Gijs", "Julia", "Thijn", "Yara", "Sander", "Lieke", "Jesper", "Evy", "Bo", "Fay", "Stan", "Isabella", "Teun", "Roos", "Tom", "Puck", "Joris", "Demi", "Lucas", "Noor", "Jop", "Roos", "Hidde", "Lara", "Milan", "Anna", "Jens", "Liv", "Luca", "Madelief", "Siem", "Mia", "Cas", "Luna", "Ties", "Sophie", "Bram", "Fenna", "Finn", "Nina", "Thom", "Sophie", "Renske", "Olaf", "Liza", "Floris", "Saar", "Jesse", "Pien", "Julian", "Isabel", "Levi", "Esmee", "Guus", "Sara", "Jurre", "Feline", "Liam", "Iris", "Noud", "Lise", "Jens", "Fay", "Stijn", "Lisa", "Jesper", "Fleur", "Lars", "Lina", "Hugo", "Nova", "Benthe", "Sepp", "Lara", "Tim", "Mila", "Dani", "Elin", "Thijn", "Isa", "Jelle", "Lola", "Finn", "Niek", "Emma", "Teun", "Lynn", "Luca", "Maud", "Oliver", "Femke", "Pim", "Fleur", "Mats", "Mia", "Dex", "Lena", "Quinn", "Sophie", "Sam", "Zoe", "Boaz", "Tess", "Hidde", "Mara", "Jesper", "Puck", "Rens", "Lynn", "Siem", "Eva", "Ties", "Saar", "Mees", "Roos", "Thijs", "Jara", "Luuk", "Pien", "Finn", "Evy", "Bram", "Sophie", "Ruben", "Noa", "Lars", "Isa", "Jesse", "Maud", "Thijn", "Lise", "Jop", "Nina", "Tijn", "Lina", "Floris", "Lisa", "Guus", "Emma", "Gijs", "Nova", "Stijn", "Benthe", "Luca", "Feline", "Jens", "Liam", "Madelief", "Jurre", "Mara", "Levi", "Lola", "Tom", "Fay", "Milan", "Sara", "Julian", "Zoe", "Cas", "Olaf", "Esmee", "Tess", "Dani", "Iris", "Bo", "Liza", "Mats", "Isabel", "Pim", "Oliver", "Sophie", "Dex", "Lynn", "Quinn", "Mia", "Zoe", "Lena", "Boaz", "Ben", "Paul", "Leon", "Maike", "Finn", "Kai", "Giacomo", "Lara", "Lukas", "Selina", "Luca", "Verena", "Benjamin", "Alina", "Ferdinand", "Valentina", "Niklas", "Clara", "Philipp", "Greta", "Adrian", "Antonia", "Vincent", "Paulina", "Max", "Celine", "Fabio", "Lea", "Matthias", "Sophie", "David", "Rosa", "Klaus", "Helena", "Alexander", "Zoe", "Valentin", "Emma", "Raphael", "Valerie", "Daniel", "Maya", "Dominik", "Lina", "Julia", "Leah", "Johann", "Isabella", "Emanuel", "Katharina", "Fabienne", "Benjamin", "Annika", "Marcel", "Paula", "Jonathan", "Helen", "Dirk", "Volker", "Joachim", "Sandra", "Anke", "Rudolf", "Wolfram", "Isabell", "Rosemarie", "Martina", "Hans", "Anja", "Jörg", "Petra", "Verena", "Michael", "Yvonne", "Günther", "Eva", "Roland", "Susanne", "Axel", "Ingrid", "Babara", "Fynn", "Matthias", "Christoph", "Peter", "Elias", "Thomas", "Ursula", "Elon", "Stefan", "Olaf", "Jennifer", "Steffen", "Joe", "Angela", "Jonas", "Gerd", "Franz", "Wilhelm", "Jürgen", "Josef", "Hans", "Noah", "Luis", "Louis", "Maximilian", "Felix", "Luca", "Luka", "Tim", "Emil", "Oskar", "Oscar", "Henry", "Moritz", "Theo", "Theodor", "Anton", "David", "Niklas", "Andreas", "Brigitte", "Karl-Heinz", "Karen", "Jens", "Ralf", "Ann-Kristin", "Nicolas", "Philipp", "Samuel", "Fabian", "Leo", "Frank", "Sabine", "Simone", "Markus", "Marcus", "Clemens", "Monika", "Ingo", "Regina", "Uwe", "Dorothee", "Gabriele", "Jonathan", "Carl", "Karl", "Alexander", "Jakob", "Vincent", "Simon", "Aaron", "Emiliano", "Julius", "Matteo", "Raphael", "Valentin", "Johann", "Finnian", "Daniel", "Gabriel", "Richard", "Max", "Adrian", "Sebastian", "Tobias", "Liam", "Joshua", "Reiner", "Sven", "Rainer", "Melanie", "Heike", "Hannelore", "Ernst", "Dietmar", "Werner", "Renate", "Justin", "Jonah", "Yannick", "Bruno", "Milan", "Rafael", "Leonhard", "Timon", "Adam", "Fabio", "Leonard", "Henryk", "Erik", "Silas", "Jannik", "Jasper", "Nico", "Lenny", "Colin", "Tom", "Bastian", "Damian", "Jasper", "Silas", "Lennard", "Finnegan", "Malte", "Aaron", "Jannis", "Elias", "Paul", "Samuel", "Victor", "Jonathan", "Nick", "Alexander", "Malte", "Florian", "Noah", "Eric", "Oliver", "Matteo", "Theodor", "Niklas", "Jan-Stephan", "Gustav", "Marius", "Arne", "Frederik", "Julius", "Emil", "Theo", "Elias", "Jasper", "Luis", "Gustav", "Florian", "Lias", "Aaron", "Tilo", "Mathis", "Janosch", "Lennert", "Jeremy", "Leopold", "Marius", "Valentin", "Julius", "Julian", "Melvin", "Laurin", "Nils", "Oliver", "Jaron", "Laurin", "Leif", "Florian", "Jaron", "Leonard", "Silvan", "Levin", "Ole", "Henri", "Johann", "Lars", "Luke", "Lukas", "Lucas", "Friedhelm", "Ludwig", "Valentin", "Mattis", "Justus", "Constantin", "Maxim", "Leonard", "Friedrich", "Theodor", "Maximilian", "Leander", "Lias", "Christian", "Elias", "Colin", "Thilo", "Emma", "Mia", "Hannah", "Hanna", "Emilia", "Sophia", "Sofia", "Lina", "Marie", "Mila", "Ella", "Lea", "Clara", "Klara", "Lena", "Leni", "Luisa", "Louisa", "Anna", "Laura", "Lara", "Maja", "Maya", "Amelie", "Johanna", "Nele", "Charlotte", "Jana", "Mara", "Frieda", "Mira", "Paula", "Alina", "Lotta", "Greta", "Nina", "Matilda", "Mathilda", "Rosa", "Fiona", "Sarah", "Sara", "Emelie", "Zoe", "Isabella", "Melina", "Ida", "Frida", "Julia", "Eva", "Amelia", "Tilda", "Anni", "Liv", "Ava", "Victoria", "Lucy", "Helen", "Helena", "Elif", "Aaliyah", "Elsa", "Julie", "Stella", "Leona", "Juna", "Mina", "Jara", "Elina", "Nela", "Nora", "Emma", "Zara", "Elena", "Malia", "Aria", "Mira", "Elisa", "Aurora", "Enna", "Ronja", "Nora", "Elin", "Emmy", "Ivy", "Ella", "Anastasia", "Josephine", "Jasmin", "Amira", "Emmi", "Merle", "Joline", "Carolin", "Estelle", "Leila", "Kiara", "Romy", "Elif", "Tara", "Joana", "Klara", "Lotte", "Marlene", "Magdalena", "Lia", "Annika", "Liana", "Liselotte", "Katharina", "Rosalie", "Enya", "Selma", "Hedda", "Luise", "Louise", "Pia", "Elisabeth", "Malin", "Leana", "Yara", "Alma", "Carlotta", "Jolina", "Elsa", "Cara", "Lavinia", "Milla", "Josephina", "Marla", "Malou", "Johanna", "Luisa", "Louisa", "Juliana", "Malia", "Paulina", "Carla", "Alessia", "Valentina", "Nova", "Mila", "Alexandra", "Antonia", "Anita", "Joleen", "Jara", "Annabelle", "Kira", "Liana", "Svenja", "Melissa", "Delia", "Elif", "Luana", "Anni", "Tessa", "Rosie", "Esma", "Leticia", "Eleni", "Carolina", "Anya", "Louna", "Kim", "Livia", "Fenja", "Thea", "Juna", "Selina", "Celine", "Alessa", "Rosa", "Evelyn", "Alissa", "Hanna", "Mara", "Cassandra", "Viola", "Elena", "Valeria", "Kiana", "Helena", "Sofie", "Lana", "Nina", "Alessandra", "Eveline", "Anika", "Luna", "Anouk", "Paulina", "Felicitas", "Rieke", "Lotte", "Yuna", "Jette", "Antonia", "Jolene", "Felina", "Miley", "Anisa", "Martha", "Ava", "Philippa", "Edda", "Karolina", "Linda", "Greta", "Ella", "Larissa", "Vanessa", "Esther", "Elena", "Nola", "Lucia", "Elaine", "Flora", "Lola", "Rosalie", "Lena", "Alia", "Elina", "Mina", "Luisa/Louisa", "Carolina", "Tamara", "Annabelle", "Elisa", "Nina", "Johanna", "Leonie", "Jolie", "Rieke", "Anastasia", "Lotte", "Lynn", "Josefine", "Lotta", "Leona", "Johanna", "Lorena", "Marie", "Pia", "Leni", "Paulina", "Lotte", "Maja/Maya", "Larissa", "Nora", "Amalia", "Mira", "Alexandra", "Louisa", "Lara", "Greta", "Ella", "Marlene", "Mila", "Elif", "Kiara", "Mina", "Lucia", "Maya", "Zara", "Liv", "Aurora", "Nela", "Sophie", "Emilia", "Tara", "Helena", "Leonie", "Lina", "Jasmin", "Lieselotte", "Stella", "Yara", "Mira", "Mina", "Nina", "Emma", "Liam", "Olivia", "Noah", "Ava", "Isabella", "Sophia", "Jackson", "Mia", "Lucas", "Oliver", "Aiden", "Charlotte", "Harper", "Elijah", "Amelia", "Abigail", "Ella", "Leo", "Grace", "Mason", "Evelyn", "Logan", "Avery", "Sofia", "Ethan", "Lily", "Aria", "Hazel", "Zoe", "Alexander", "Madison", "Luna", "Mateo", "Chloe", "Nora", "Zoey", "Mila", "Carter", "Eli", "Aubrey", "Ellie", "Scarlett", "Jaxon", "Maya", "Levi", "Elena", "Penelope", "Aurora", "Samuel", "Cora", "Skylar", "Carson", "Sadie", "Nathan", "Kinsley", "Anna", "Elizabeth", "Grayson", "Camila", "Lincoln", "Asher", "Aaliyah", "Callie", "Xavier", "Luke", "Madelyn", "Caleb", "Kai", "Isaac", "Bella", "Zara", "Landon", "Matthew", "Lucy", "Adrian", "Joseph", "Stella", "Mackenzie", "Kailey", "Nolan", "Eleanor", "Samantha", "Dylan", "Leah", "Audrey", "Aaron", "Jasmine", "Tyler", "Easton", "Hudson", "Bailey", "Alice", "Layla", "Eliana", "Brooklyn", "Jackson", "Bentley", "Trinity", "Liliana", "Claire", "Adeline", "Ariel", "Jordyn", "Emery", "Max", "Naomi", "Eva", "Paisley", "Brody", "Kennedy", "Bryson", "Nova", "Emmett", "Kaylee", "Genesis", "Julian", "Elliot", "Piper", "Harrison", "Sarah", "Daisy", "Cole", "Kylie", "Serenity", "Jace", "Elena", "Ruby", "Camden", "Eva", "Delilah", "John", "Liam", "Catherine", "Madeline", "Isla", "Jordan", "Julia", "Sydney", "Levi", "Alexa", "Kinsley", "Hayden", "Gianna", "Everly", "Alexis", "Jaxson", "Isabelle", "Allison", "Alyssa", "Elias", "Brynn", "Leilani", "Alexandra", "Kayla", "Gracie", "Lucia", "Reagan", "Valentina", "Brayden", "Jocelyn", "Molly", "Kendall", "Blake", "Diana", "Isabel", "Zachary", "Emilia", "Lilah", "David", "Charlie", "Charlie", "Eliana", "Ryder", "Lydia", "Nevaeh", "Savannah", "Zayden", "Sydney", "Amaya", "Nicole", "Caroline", "Jaxon", "Natalia", "Jayden", "Mila", "Lincoln", "Nash", "Emilia", "Peyton", "Annabelle", "Zane", "Zoey", "Elena", "Hannah", "Lyla", "Christian", "Lily", "Violet", "Sophie", "Bentley", "Kai", "Jasmine", "Skylar", "Bella", "Penelope", "Alexandra", "Joseph", "Khloe", "Rebecca", "Leo", "Luna", "Alina", "Ashley", "Audrey", "Riley", "Alexa", "Parker", "Adeline", "Leon", "Lucy", "Taylor", "Maria", "Evan", "Chase", "Eva", "Maya", "Kayla", "Mia", "Naomi", "Ryder", "Peyton", "Eli", "Zoe", "Zara", "Mateo", "Ellie", "Julian", "Christopher", "Aiden", "Emma", "Evelyn", "Layla", "Sophia", "Grace", "Benjamin", "Harper", "Mila", "Eleanor", "Carter", "Amelia", "Ella", "Jackson", "Oliver", "Charlotte", "Ava", "Lucas", "Liam", "Abigail", "Avery", "Ethan", "Aria", "Scarlett", "Chloe", "Hazel", "Mason", "Emma", "Zoey", "Aiden", "Penelope", "Claire", "Lily", "Isabella", "Daniel", "Nora", "Madison", "Grace", "Luna", "Mia", "Lily", "Zoe", "Layla", "Ariana", "Aubrey", "Liam", "Eli", "Alexander", "Sebastian", "Aria", "Scarlett", "Victoria", "Lucy", "Mila", "Emily", "Levi", "Avery", "Ella", "Abigail", "Evelyn", "Sophia", "James", "Ben", "Wilhelm", "Friedrich", "Heinrich", "Karl", "Johann", "Georg", "Ludwig", "Ernst", "Otto", "Heinrich", "Hans", "Fritz", "Paul", "Max", "Albert", "August", "Richard", "Walter", "Hermann", "Gustav", "Rudolf", "Anton", "Franz", "Emil", "Adolf", "Oskar", "Gottfried", "Eduard", "Kurt", "Klaus", "Theodor", "Alfred", "Friedrich", "Hugo", "Arthur", "Gerhard", "Werner", "Erwin", "Berthold", "Helmut", "Konrad", "Wolfgang", "Arnold", "Rolf", "Ulrich", "Dieter", "Erich", "Günther", "Hans-Jürgen", "Winfried", "Willi", "Rolf", "Helmut", "Reinhard", "Gerd", "Manfred", "Jürgen", "Hubert", "Friedhelm", "Gustav", "Ludwig", "Karl-Heinz", "Otto", "Karl-Friedrich", "Hans-Dieter", "Heinz", "Ernst", "Walter", "Rudolf", "Herbert", "Klaus-Dieter", "Wolfram", "Friedrich-Wilhelm", "Ewald", "Egon", "Wilfried", "Norbert", "Karl-Heinz", "Gerhard", "Hans-Peter", "Dieter", "Werner", "Alfred", "Helmut", "Walter", "Heinz", "Kurt", "Hans-Joachim", "Günther", "Ernst", "Rainer", "Bernd", "Hans-Jürgen", "Wilhelm", "Joachim", "Friedrich", "Karl", "Klaus", "Reinhard", "Heinz", "Karl-Heinz", "Peter", "Jürgen", "Helmut", "Werner", "Rolf", "Günter", "Fritz", "Wolfgang", "Alfred", "Erich", "Karl-Friedrich", "Gustav", "Dieter", "Friedhelm", "Hans-Dieter", "Gerd", "Herbert", "Ludwig", "Ulrich", "Winfried", "Hans-Joachim", "Reiner", "Günther", "Manfred", "Rudolf", "Berthold", "Eduard", "Franz", "Heinrich", "Friedrich-Wilhelm", "Wilfried", "Klaus-Dieter", "Werner", "Erwin", "Wolfram", "Rainer", "Ernst", "Hubert", "Hans-Peter", "Joachim", "Norbert", "Arthur", "Karl-Heinz", "Heinz", "Otto", "Egon", "Ewald", "Kurt", "Hans", "Gustav", "Wilhelm", "Franz", "Ernst", "Heinrich", "Hermann", "Karl", "Friedrich", "Ludwig", "Alfred", "Otto", "Walter", "Richard", "Wilhelm", "Hans", "Fritz", "Paul", "Max", "Albert", "August", "Theodor", "Werner", "Friedrich", "Hugo", "Arthur", "Erwin", "Gerhard", "Eduard", "Kurt", "Heinz", "Erich", "Günther", "Hans-Jürgen", "Winfried", "Willi", "Helmut", "Reinhard", "Gerd", "Manfred", "Jürgen", "Karl-Heinz", "Hubert", "Friedhelm", "Gustav", "Ludwig", "Ewald", "Egon", "Wilfried", "Karl", "Franz", "Peter", "Wolfgang", "Ulrich", "Dieter", "Klaus-Dieter", "Heinz", "Karl-Friedrich", "Hans-Dieter", "Wolfram", "Friedrich-Wilhelm", "Ernst", "Erich", "Günter", "Rainer", "Bernd", "Herbert", "Hans-Joachim", "Wilhelm", "Joachim", "Friedrich", "Karl", "Klaus", "Reinhard", "Heinz", "Karl-Heinz", "Peter", "Jürgen", "Helmut", "Werner", "Rolf", "Günter", "Fritz", "Wolfgang", "Alfred", "Erich", "Karl-Friedrich", "Gustav", "Dieter", "Friedhelm", "Hans-Dieter", "Gerd", "Herbert", "Ludwig", "Ulrich", "Winfried", "Hans-Joachim", "Reiner", "Günther", "Manfred", "Rudolf", "Berthold", "Eduard", "Franz", "Heinrich", "Friedrich-Wilhelm", "Wilfried", "Klaus-Dieter", "Werner", "Erwin", "Wolfram", "Rainer", "Ernst", "Hubert", "Hans-Peter", "Joachim", 'Jörg', 'Hermann', 'Ulrich', 'Roland', 'Frank', 'Cord', 'Ralf', 'Sascha', 'Andreas', 'Heiko', 'Christoph', 'Kerstin', 'Christian', 'Lucas', 'Axel', 'Dirk', 'Hans-Gerd', 'Thomas', 'Norman', 'Karsten', 'Regina', 'Werner', 'Daniel', 'Leendert', 'Anton', 'Joachim', 'Alexander', 'Bastian', 'Horst', 'Sven', 'Dieter', 'Araik', 'Hans-Jürgen', 'Jens', 'Jan', 'Matthias', 'Toni', 'Erika', 'Dipl. Ing. Elmar', 'Ludger', 'Mark', 'Guido', 'Dennis', 'Marcel', 'Björn', 'Hans-Hermann', 'Monze', 'Walter', 'Maik', 'Thorsten', 'Nadine', 'Ulf', 'Meinhard', 'Johann', 'Gerhard', 'Tibor', 'Wilhelm', 'Ernst-Christian', 'Maja', 'Wolfgang', 'Jana', 'Otto', 'Franz', 'Andre', 'Bertholt', 'Klaus', 'Lukas', 'Stephan', 'Knut', 'Burghart', 'Torsten', 'Thijs Petrus Antonius', 'Hans', 'Ernst', 'Erich', 'Vinzenz', 'Volker', 'Uwe', 'Hans-Joachim', 'Detlef', 'Hinnerk', 'Bernd', 'Gernot', 'Peter', 'Markus', 'Claus', 'Armin', 'Otto Johann', 'Kurt-Egon', 'Dan', 'Timo', 'Kai', 'Herbert', 'Hilmar', 'Rainer', 'Sören', 'Gunnar', 'Nico', 'Tim', 'Christine', 'Cengiz', 'Nicolas', 'Jürgen', 'Josef', 'Raphael', 'Heinrich', 'Lüder', 'Harald', 'Helmuth', 'Savino', 'Julian', 'Carsten', 'Bernhard', 'Simon', 'Patrick', 'Rolf', 'Urs', 'Ewald', 'Jörn', 'Stefan', 'Mirco', 'Emanuel', 'Cristian-Valentin', 'Talha', 'Christina', 'Andrey', 'Henning', 'Heike', 'Marcus', 'Johannes', 'Ingo', 'Ina', 'Philipp', 'Mirko', 'Tore', 'Anja', 'Olaf', 'Fridel', 'Cornelia', 'Sandra', 'Martin', 'Monika', 'Tanja', 'Jessica', 'Marc', 'Rowena', 'Erik', 'Lasse', 'Benedikt', 'Heiner', 'Ansgar', 'Linda', 'Sebastian', 'Michaela', 'David', 'Anne', 'Stanislavas', 'Swantje', 'Petra', 'Melanie', 'Maren', 'Friedhelm', 'Lothar', 'Sarah', 'Manfred', 'Günter', 'Florian', 'Thore', 'Doris', 'Anneliese', 'Beate', 'Oliver', 'Phillip', 'Bianca', 'Marion', 'Katharina', 'Kathrin', 'Michele', 'Nina', 'Günther', 'Corinna', 'Kolja Ole', 'Helmut', 'Ilka', 'Mario', 'Helge', 'Lena', 'Jathavan', 'Karl', 'Julia', 'Martina', 'Reinhard', 'Dörk', 'Andrea', 'Achim', 'Bettina', 'Carina', 'Lars', 'Paul', 'Bodo', 'Lambert', 'Yvonne', 'Constanze', 'Rüdiger', 'Arthur', 'Wolny', 'Ronja', 'Annett', 'Kornelia', 'Friedrich', 'Ruth', 'Georg', 'Birgit', 'Siegfried', 'Eva-Maria', 'Frederik', 'Steffen', 'Holger', 'Milan', 'Miriam', 'Jakob', 'Viktor', 'Jaqueline', 'Sabine', 'Nils', 'Lisa', 'Leo', 'Berthold', 'Fatih', 'Sabrina', 'Luca', 'Heino', 'Sergey', 'Verena', 'Robert', 'Klaus-Dieter', 'Jochen', 'Igor', 'Kristina', 'Denis', 'Enes', 'Fait', 'Mathias', 'Henner', 'Ulla', 'Elke', 'Wilfried', 'Rene', 'Hubert', 'Willi', 'Roderik', 'Udo', 'Monique', 'Marco', 'Enrico', 'Richard', 'Jonas', 'Otmar', 'Tobias', 'Boris', 'Nicole', 'Elmar', 'Immo', 'Frederick', 'Margit', 'Hans-Jörg', 'Jordan', 'Lutz', 'Heinz', 'Justas', 'Detlev', 'Reimer', 'Gerald', 'Rita', 'Emil', 'Pascal', 'Karl-Hans', 'Benno', 'Ralph', 'Thilo', 'Murat', 'Denise', 'Danila', 'Ömür', 'Katja', 'Christof', 'Berndt', 'Norbert', 'Freddy', 'Ursula', 'Heinz Willi', 'Frederic', 'Ralf-Peter', 'Sylvia', 'Alois', 'Carl', 'Bert', 'Iris', 'Benjamin', 'Arne', 'Jan-Hermann', 'Sybille', 'Ute', 'Fabian', 'Sotirios', 'Khanh', 'Annette', 'Nadja', 'Antonius', 'Geigle', 'Chiara', 'Lucien', 'Beata', 'Reiner', 'Ramon', 'Hüsniye', 'Mijo', 'Erwin', 'Rogerio', 'Mike', 'Benny', 'Ludwig', 'Roger', 'Herge', 'Niklas', 'Andres', 'Roxanne', 'Othmar', 'Cyril', 'Karl-Heinz', 'Stefanie', 'Burkhard', 'Angelus', 'Pierre', 'Götz', 'Tilmann', 'Claudia', 'Ronald', 'Tammo', 'Dietmar', 'Rico', 'Dejan', 'Dainius', 'Silvio', 'Vitalij'];
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

                if (
                    wordBefore.includes("geschäftsführer")
                    || wordBefore.includes("ansprechpartner")
                    || wordBefore.includes("vorstand")
                    || wordBefore.includes("vorsitzender")
                    || wordBefore.includes("inhaber")
                    || wordBefore.includes("dr") && firstName.includes(tempWord)
                    || wordBefore.includes("prof")
                    || wordBefore.includes("herr")
                    || wordBefore.includes("frau")
                    || wordBefore.includes("verantwortliche") && tempWord !== "nach"
                    || wordBefore.includes("vertreter")
                ) {
                    probability += 40;
                } else if (wordBefore.includes(
                    "firmenname")
                    || wordBefore.includes("umsatzsteuer-identifikationsnummer"
                    )) {
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
            //hier um InLine Dopplungen rauzufiltern
            let inlineExistingObjects = tempNames;
            let existingObjects = this.contactPersonsCheck;

            inlineExistingObjects.forEach((nameObject, index) => {
                if (
                    nameObject.value === tripleName
                    || nameObject.value === tempInputWord + " " + wordAfterClean && nameObject.probability > probability
                ) {
                    probability = 0;
                } else if (
                    nameObject.value === tripleName
                    || nameObject.value === tempInputWord + " " + wordAfterClean && nameObject.probability <= probability
                ) {
                    inlineExistingObjects.splice(index, 1);
                }
            });

            //hier um generelle Dopplungen rauzufiltern
            existingObjects.forEach((nameObject, index) => {
                if (
                    (
                        nameObject.value === tripleName || nameObject.value === tempInputWord + " " + wordAfterClean
                    )
                    && nameObject.probability > probability
                ) {
                    probability = 0;
                } else if (
                    (
                        nameObject.value === tripleName
                        || nameObject.value === tempInputWord + " " + wordAfterClean
                    )
                    && nameObject.probability <= probability
                ) {
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
                    //output bei einem 3er-Namen      
                } else {
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
        let languageAreaCode = "";
        const languageAreaCodeDE = "+49";
        const languageAreaCodeNL = "+31";
        const languageAreaCodeEN = "+44";
        // TODO nummern für innerhalb erkennen z.B. London 020 anstatt 0

        // Auswahl der passenden Vorwahl nach der erkannten Sprache
        switch (this.language.languageName) {
            case "de":
                languageAreaCode = languageAreaCodeDE;
                break;

            case "nl":
                languageAreaCode = languageAreaCodeNL;
                break;

            case "eng":
                languageAreaCode = languageAreaCodeEN;
                break;

            default:
                break;
        }

        words: for (let i = 0; i < inputLineWords.length; i++) {
            let inputLineChars = inputLineWords[i].split("");

            for (let index = 0; index < inputLineChars.length; index++) {

                // Überprüfen, ob die Eingabe keiner Nummer entspricht
                if (!whiteList.includes(inputLineChars[index])) {
                    // Falls nach einer Nummer ein Wort kommt, wird die bisher gespeicherte Nummer ausgegeben
                    if (fullNumber.trim().length >= 6 && probability != 0) {

                        // Faxnummern einheitliche Schreibweise setzen
                        if (inputLineWords[i - 1].startsWith("0") || inputLineWords[i - 1].startsWith("(0")) {
                            tempFax.push(new CheckResult("faxNumber",
                                fullNumber.replace("0", languageAreaCode),
                                probability,
                            ));
                        }

                        if (fullNumber.startsWith("00") || fullNumber.startsWith("(00")) {
                            tempFax.push(new CheckResult(
                                "faxNumber",
                                fullNumber.replace("00", "+"),
                                probability,
                            ));
                        } else if (fullNumber.startsWith("0") || fullNumber.startsWith("(0")) {
                            tempFax.push(new CheckResult(
                                "faxNumber",
                                fullNumber.replace("0", languageAreaCode),
                                probability,
                            ));
                        } else {
                            tempFax.push(new CheckResult(
                                "faxNumber",
                                fullNumber,
                                probability,
                            ));
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
                } else if (
                    wordBefore.includes("tel")
                    || wordBefore.includes("fon")
                    || wordBefore.includes("mobil")
                    || wordBefore.includes("handy")
                ) {
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

        if (
            fullNumber.trim().length != 0
            && probability != 0
        ) {
            if (
                fullNumber.startsWith("00")
                || fullNumber.startsWith("(00")
            ) {
                tempFax.push(new CheckResult(
                    "faxNumber",
                    fullNumber.replace("00", "+"),
                    probability,
                ));
            } else if (
                fullNumber.startsWith("0")
                || fullNumber.startsWith("(0")
            ) {
                tempFax.push(new CheckResult(
                    "faxNumber",
                    fullNumber.replace("0", languageAreaCode),
                    probability,
                ));
            } else {
                tempFax.push(new CheckResult(
                    "faxNumber",
                    fullNumber,
                    probability,
                ));
            }
        }

        return tempFax;
    }

    checkPhone(inputLine) {
        let tempPhone = []

        // für rekursiv keine Ahnung frag Simon
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
        let languageAreaCode = "";
        const languageAreaCodeDE = "+49";
        const languageAreaCodeNL = "+31";
        const languageAreaCodeEN = "+44";

        // Auswahl der passenden Vorwahl nach der erkannten Sprache
        switch (this.language.languageName) {
            case "de":
                languageAreaCode = languageAreaCodeDE;
                break;

            case "nl":
                languageAreaCode = languageAreaCodeNL;
                break;

            case "eng":
                languageAreaCode = languageAreaCodeEN;
                break;

            default:
                break;
        }

        words: for (let i = 0; i < inputLineWords.length; i++) { // for Schleife zum durchlaufen aller Wörter in der übergebenen Zeile

            let inputLineChars = inputLineWords[i].split("");

            for (let index = 0; index < inputLineChars.length; index++) { // for Schleife zum durchlaufen aller Character im aktuellen Wort

                // Überprüfen, ob die Eingabe einer Nummer entspricht
                if (!whiteList.includes(inputLineChars[index])) {

                    // Falls nach einer Nummer ein Wort kommt, wird die bisher gespeicherte Nummer ausgegeben
                    if (fullNumber.trim().length >= 6 && probability != 0) {

                        // Telefonnummer einheitliche Schreibweise setzen
                        if (
                            inputLineWords[i - 1].startsWith("0")
                            || inputLineWords[i - 1].startsWith("(0")
                        ) {
                            tempPhone.push(new CheckResult("phoneNumber", fullNumber.replace("0", languageAreaCode), probability));
                            continue words;
                        }

                        if (
                            fullNumber.startsWith("00")
                            || fullNumber.startsWith("(00")
                        ) {
                            tempPhone.push(new CheckResult("phoneNumber", fullNumber.replace("00", "+"), probability));
                            continue words;

                        } else if (
                            fullNumber.startsWith("0")
                            || fullNumber.startsWith("(0")
                        ) {
                            tempPhone.push(new CheckResult("phoneNumber", fullNumber.replace("0", languageAreaCode), probability));
                            continue words;

                        } else {
                            tempPhone.push(new CheckResult("phoneNumber", fullNumber, probability));
                            continue words;
                        }
                    }

                    fullNumber = "";
                    continue words;
                }
            }

            // Checkt ob vor der nummer z.B. Fon steht
            if (i !== 0) {
                let wordBefore = inputLineWords[i - 1].toLowerCase();

                if (wordBefore.includes("fon")
                    || wordBefore.includes("tel")
                    || wordBefore.includes("mobil")
                    || wordBefore.includes("handy")
                ) {
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

            if (
                tmpFullNum.length > 5
                && tmpFullNum.length < 20
            ) {
                probability += 30;
            }
        }

        let tmpFullNum = fullNumber;
        tmpFullNum = tmpFullNum.replaceAll("+", "").replaceAll("/", "").replaceAll("-", "").replaceAll(".", "");

        if (
            tmpFullNum.length > 5
            && tmpFullNum.length < 20
        ) {
            probability += 30;
        }

        if (
            fullNumber.trim().length != 0
            && probability != 0
        ) {
            if (
                fullNumber.startsWith(languageAreaCode)
                || fullNumber.startsWith("0")
                || fullNumber.startsWith("(0")
                || fullNumber.startsWith("(" + languageAreaCode)
            ) {
                if (
                    fullNumber.startsWith("00")
                    || fullNumber.startsWith("(00")
                ) {
                    tempPhone.push(new CheckResult(
                        "phoneNumber",
                        fullNumber.replace("00", "+"),
                        probability,
                    ));
                } else if (fullNumber.startsWith("0")
                    || fullNumber.startsWith("(0")
                ) {
                    tempPhone.push(new CheckResult(
                        "phoneNumber",
                        fullNumber.replace("0", languageAreaCode),
                        probability,
                    ));
                } else {
                    tempPhone.push(new CheckResult(
                        "phoneNumber",
                        fullNumber,
                        probability,
                    ));
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
        const streetNamesDE = ["str.", "stra", "weg", "allee", "gasse", "ring", "platz", "pfad", "feld", "hof", "berg"];
        const streetNamesNL = ["straat", "weg", "hof", "straat", "pad", "burg", "plein", "hoven"];
        const streetNamesEN = ["road", "street", "avenue", "lane", "boulevard", "way", "alley", "hill", "lane"];
        const stringStreetBeginningsDE = ["an der", "zu den", "in der", "in den", "im ", "auf den", "auf der", "am ", "an den", "auf dem", "zur "];
        const stringStreetBeginningsNL = ["de", "het"];
        const stringStreetBeginningsEN = ["Maple", "lake", "river"];
        const whiteList = "abcdefghijklmnopqrstuvwxyz".split("");
        let streetNames = streetNamesDE;
        let blackList = ["@", "mail", "www.", "https", "http"];
        // deutsche Unternehmensformen
        let blackListCompanyTypeDE = [
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
            "gemeinde"];
        // englische Unternehmensformen
        const blackListCompanyTypeEN = [
            "sole proprietorship", "sole prop.",
            "limited liability company", "llc",
            "corporation", "corp.",
            "general partnership", "gen. partn.",
            "limited partnership", "ltd. partn.",
            "civil law partnership", "clp",
            "limited", "ltd", "ltd.",
            "entrepreneurial company", "ec",
            "sole trader", "sole trader",
            "private limited company", "plc",
            "public limited company", "plc",
            "non-profit association", "non-profit assoc.",
            "municipality", "muni"
        ];
        // niederländische Unternehmensformen
        const blackListCompanyTypeNL = [
            "eenmanszaak", "eenm.",
            "besloten vennootschap", "bv", "b.v.",
            "naamloze vennootschap", "nv",
            "vennootschap onder firma", "vof",
            "commanditaire vennootschap", "cv",
            "maatschap", "maatschap",
            "limited", "limited",
            "ondernemerschap", "ondernemerschap",
            "eenmanszaak", "eenm.",
            "besloten vennootschap", "bv",
            "naamloze vennootschap", "nv",
            "vennootschap onder firma", "vof",
            "commanditaire vennootschap", "cv",
            "non-profit organisatie", "non-profit org.",
            "gemeente", "gemeente"
        ];
        let stringStreetBeginnings = stringStreetBeginningsDE;
        let num = 0;
        let fullStreetName = "";
        let fullStreetNameClear = "";

        // Auswahl des passenden Arrays nach der erkannten Sprache
        switch (this.language.languageName) {
            case "de":
                streetNames = streetNamesDE;
                stringStreetBeginnings = stringStreetBeginningsDE;
                blackList = blackList.concat(blackListCompanyTypeDE);
                break;

            case "nl":
                streetNames = streetNamesNL;
                stringStreetBeginnings = stringStreetBeginningsNL;
                blackList = blackList.concat(blackListCompanyTypeNL);
                break;

            case "eng":
                streetNames = streetNamesEN;
                stringStreetBeginnings = stringStreetBeginningsEN;
                blackList = blackList.concat(blackListCompanyTypeEN);
                break;

            default:
                break;
        }

        words: for (let i = 0; i < inputLineWords.length; i++) {

            // Checkt ob das aktuelle Wort einer Unternehmensform entspricht und diese überspringen
            for (let index = 0; index < blackList.length; index++) {
                const e = blackList[index];

                if (inputLineWords[i].includes(e)) {
                    return tempStreet;
                }
            }

            // Zeile nach Keywords durchsuchen wie straße usw.
            for (let sNames = 0; sNames < streetNames.length; sNames++) {

                if (inputLineWords[i].includes(streetNames[sNames])) {
                    fullStreetName = inputLine.toLowerCase();
                    fullStreetNameClear = inputLine;

                    // wenn zwei keywords in einer zeile vorkommen wird nur einer angerechnet
                    if (probability < 40) {
                        probability += 40;
                    }

                    if (i + 1 < inputLineWords.length) {
                        let wordAfter = inputLineWords[i + 1].toLowerCase();

                        // checkt ob nach der Straße eine Hausnummer kommt
                        for (let b = 0; b < inputLineWords[i + 1].length; b++) {

                            if (!whiteList.includes(inputLineWords[i + 1][b])) {
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

                                        if (word2After == whiteList[a]) {
                                            probability += 5;
                                        }
                                    }
                                }
                            }
                        }

                        // checkt den Fall, wenn der Nr. Zusatz nicht mit einem Leerzeichen von der Nr. getrennt ist
                        if (num == 1) {
                            probability += 30;

                            // checkt, ob der letzte char Wert ein Buchstabe ist
                            for (let alphabet = 0; alphabet < 26; alphabet++) {

                                if (inputLineWords[i + 1][(inputLineWords[i + 1].length) - 1] == whiteList[alphabet]) {
                                    probability += 15;
                                }
                            }
                        }
                    }
                }
            }
        }

        // überprüft den Fall, wenn die Adresse mit z.b. an der ... anfängt
        for (let p = 0; p < stringStreetBeginnings.length; p++) {

            if (inputLine.toLowerCase().includes(stringStreetBeginnings[p])) {
                fullStreetName = inputLine.toLowerCase();
                fullStreetNameClear = inputLine;
                probability += 10;
                let matchingWords = stringStreetBeginnings[p].split(" ");

                words: for (let m = 0; m < inputLineWords.length; m++) {

                    // wenn der Vergleich, ob ein Satz mit etwas startet dessen Keyword mehr als nur ein Wort lang ist
                    if (matchingWords.length == 1) {

                        // das Wort ermittlen, welches aus der Zeile mit dem Keyword matcht
                        if (!inputLineWords[m] == matchingWords[0]) {
                            continue words;
                        }

                    } else {

                        // das Wort ermittlen, welches aus der Zeile mit dem Keyword matcht
                        if (!(inputLineWords[m] == matchingWords[1] && inputLineWords[m - 1] == matchingWords[0])) {
                            continue words;
                        }
                    }

                    if (m + 2 < inputLineWords.length) {
                        let word2After = inputLineWords[m + 2].toLowerCase();

                        // checkt ob nach der Straße eine Hausnummer kommt
                        for (let b = 0; b < inputLineWords[m + 2].length; b++) {

                            if (!whiteList.includes(inputLineWords[m + 2][b])) {
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

                                        if (word3After == whiteList[a]) {
                                            probability += 5;
                                        }
                                    }
                                }
                            }
                        }
                        // checkt den Fall, wenn der Nr. Zusatz nicht mit einem Leerzeichen von der Nr. getrennt ist
                        if (num == 1) {
                            probability += 35;

                            // checkt, ob der letzte char Wert ein Buchstabe ist
                            for (let alphabet = 0; alphabet < 26; alphabet++) {

                                if (inputLineWords[m + 2][(inputLineWords[m + 2].length) - 1] == whiteList[alphabet]) {
                                    probability += 25;
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
        let inputLineWordsClear = inputLine.split(" ");
        inputLine = inputLine.toLowerCase();
        let inputLineWords = inputLine.split(" ");
        let city = 0;
        let cityName = 0;
        let probability = 0;
        let wordAfter;
        let wordBefore;
        let postalCodeLength = 0;
        let oneLetterKey = "";
        let twoLetterKey = "";
        const whiteList = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L',
            'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

        // Auswahl der passenden Vorwahl nach der erkannten Sprache
        switch (this.language.languageName) {
            case "de":
                postalCodeLength = 5;
                oneLetterKey = "d";
                twoLetterKey = "de";
                break;

            case "nl":
                postalCodeLength = 6;
                oneLetterKey = "n";
                twoLetterKey = "nl";
                break;

            case "eng":
                postalCodeLength = 5;
                oneLetterKey = "uk";
                twoLetterKey = "gb";
                break;

            default:
                break;
        }

        // wenn element mit d-/de- startet wird dieses entfernt
        for (let a = 0; a < inputLineWords.length; a++) {
            const element = inputLineWords[a];

            if (element.startsWith(oneLetterKey + "-")) {
                inputLineWords[a] = element.replace(oneLetterKey + "-", "");
                probability += 10;
            }

            if (element.startsWith(twoLetterKey + "-")) {
                inputLineWords[a] = element.replace(twoLetterKey + "-", "");
                probability += 10;
            }

            // Falls vor der 5-Stelligen Zahl ein verbotenes Keyword steht wird diese Zahl nicht angegeben 
            if (a !== 0) {
                let wordBefore = inputLineWords[a - 1];

                if (wordBefore.includes("fax") || wordBefore.includes("fon")) {
                    inputLineWords.splice(a, 1);
                }
            }
        }

        if (this.language.languageName === "de") {

            // neuer Array nur mit 5 Stelligen Zahlen 
            const onlyNumbers = inputLineWords.filter(element => !isNaN(element));

            for (let a = 0; a < onlyNumbers.length; a++) {
                const element = onlyNumbers[a];

                if (element.length !== postalCodeLength) {
                    onlyNumbers.splice(a, 1);
                }
            }
            // check ob elements im json enthalten sind und somit eine Stadt matchen
            zipLoop: for (let i = 0; i < onlyNumbers.length; i++) {
                const element = onlyNumbers[i];

                if (this.fetchedPostalCodes.includes(element)) {
                    probability += 60;
                    city = this.fetchedPostalCodes.indexOf(element);
                    cityName = this.fetchedCityNames[city];

                    // check ob Wort nach dem zip Code der Stadt entspricht die im json eingetragen ist
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

                // output
                if (probability > 100) {
                    probability = 100;
                }

                if (probability > 0 && element.length === postalCodeLength) {
                    tempPostalCode.push(new CheckResult("postalCode", element, probability));

                } else {
                    continue zipLoop;
                }
            }
        }

        if (this.language.languageName === "nl") {
            // neuer Array nur mit 4 stelligen Zahlen 
            const onlyNumbers = inputLineWords.filter(
                element => !isNaN(element) 
                && (
                    element.length === 4 
                    || whiteList.includes(element)
                )
            );

            zipLoop: for (let i = 0; i < inputLineWords.length; i++) {
                const element = inputLineWords[i];

                // check, ob element eine 4 stellige Zahl ist 
                if (
                    element.length === 4 
                    && onlyNumbers.includes(element)
                ) {
                    probability += 20;

                    if (inputLineWordsClear[i + 1] !== undefined) {
                        wordAfter = inputLineWordsClear[i + 1];

                        // check, ob das Wort nach dem Element 2 Zeichen lang ist nur aus Buchstaben erkannt wird
                        if (
                            wordAfter.length === 2
                            && this.checkCorrectName(wordAfter)
                        ) {
                            probability += 40
                        }
                    }
                }

                // output
                if (probability > 100) {
                    probability = 100;
                }

                if (
                    probability > 0 
                    && element.length === 4
                ) {
                    tempPostalCode.push(new CheckResult("postalCode", element + " " + wordAfter, probability));
                } else {
                    continue zipLoop;
                }
            }
        }

        if (this.language.languageName === "eng") {

            zipLoop: for (let i = 0; i < inputLineWords.length; i++) {
                const element = inputLineWords[i];
                const elementClear = inputLineWordsClear[i];
                const firstLetter = parseInt(element.charAt(0), 10);
                const secondLetter = element.charAt(1);
                const thirdLetter = element.charAt(2);

                // checken, ob das erste Zeichen eine Zahl ist, das zweite Zeichen eine Buchstabe ist, check ob das dritte Zeichen eine 
                // Buchstabe ist und das element genau 3 Zeichen lang ist
                if (
                    element.length === 3 
                    && !isNaN(firstLetter) 
                    && isNaN(secondLetter) 
                    && isNaN(thirdLetter)
                ) {
                    probability += 40;

                    if (inputLineWordsClear[i - 1] !== undefined) {
                        wordBefore = inputLineWordsClear[i - 1];
                        
                        if (wordBefore.length >= 2 && wordBefore.length <= 4) { //check, ob das Wort vorher den UK-PLZ Kriterien entspricht  
                            probability += 30
                        }
                    }
                }

                // output
                if (probability > 100) {
                    probability = 100;
                }

                if (probability > 0 && element.length === 3) {
                    tempPostalCode.push(new CheckResult("postalCode", wordBefore + " " + elementClear, probability));
                } else {
                    continue zipLoop;
                }
            }
        }

        return tempPostalCode;
    }

    checkCity(inputLine) {
        let tempCity = [];
        let inputLineWords = inputLine.split(" ");
        let postalCode = this.fetchedPostalCodes;
        let cityName = 0;
        let probability = 0;
        let wordBefore;
        let cityNamesArray = this.fetchedCityNames;
        let secondCountryCode = "d"
        let countryCode = "de";
        const ukCityArray = ["Abberton", "Abbots Langley", "Aberaeron", "Aberchirder", "Abercynon", "Aberdare", "Aberdeen", "Aberfeldy", "Aberford", "Aberfoyle", "Abergavenny", "Abergele", "Abergwynfi", "Abergynolwyn", "Aberkenfig", "Aberlour", "Abersychan", "Abertillery", "Aberystwyth", "Abingdon", "Aboyne", "Accrington", "Acton", "Addington", "Addington", "Addlestone", "Adlingfleet", "Aghalee", "Aintree", "Airdrie", "Akeley", "Albrighton", "Alcester", "Aldeburgh", "Alderholt", "Alderley Edge", "Aldermaston", "Aldershot", "Aldridge", "Alexandria", "Alfold", "Alford", "Alford", "Alfreton", "Alloa", "Alness", "Alnwick", "Alresford", "Alrewas", "Alsager", "Alston", "Altham", "Alton", "Alton", "Altrincham", "Alva", "Alvechurch", "Alveston", "Ambleside", "Amersham", "Amesbury", "Amlwch", "Ammanford", "Ampthill", "Andover", "Angmering", "Anlaby", "Annalong", "Annan", "Annesley", "Anniesland", "Anstey", "Anstey", "Anstruther", "Antrim", "Appleby", "Appleford", "Appleton", "Appley Bridge", "Arbroath", "Ardingly", "Ardmillan", "Ardrossan", "Arlesey", "Arley", "Armadale", "Armagh", "Armitage", "Arnold", "Arrochar", "Arthog", "Arundel", "Ascot", "Ash", "Ash Vale", "Ashbourne", "Ashburton", "Ashby de la Launde", "Ashby de la Zouch", "Ashdon", "Ashen", "Ashfield", "Ashford", "Ashford", "Ashington", "Ashington", "Ashley", "Ashmore", "Ashtead", "Ashton in Makerfield", "Ashton-under-Lyne", "Ashwell", "Askam in Furness", "Askern", "Askham", "Astley", "Aston", "Aston Clinton", "Atherstone", "Atherton", "Attleborough", "Attleborough", "Atworth", "Auchinleck", "Auchterarder", "Auchtermuchty", "Augher", "Aughnacloy", "Aultbea", "Aveley", "Aviemore", "Avoch", "Avonmouth", "Axbridge", "Axminster", "Aycliffe", "Aylesbury", "Aylesford", "Aylsham", "Ayr", "Babraham", "Back", "Bacton", "Bacup", "Bagillt", "Bagshot", "Baildon", "Bainton", "Bakewell", "Bala", "Baldock", "Balerno", "Balham", "Ball", "Ballingry", "Balloch", "Ballybogy", "Ballycastle", "Ballyclare", "Ballymena", "Ballymoney", "Ballynahinch", "Bampton", "Banbridge", "Banbury", "Banchory", "Banff", "Bangor", "Bangor", "Bangor-is-y-coed", "Banham", "Banstead", "Barbaraville", "Bargoed", "Barking", "Barkway", "Barley", "Barmouth", "Barmston", "Barnard Castle", "Barnes", "Barnet", "Barnham", "Barnoldswick", "Barnsley", "Barnstaple", "Barnwell", "Barrow", "Barrow in Furness", "Barrow upon Humber", "Barrow upon Soar", "Barrowford", "Barry", "Barton in Fabis", "Barton on Sea", "Barton under Needwood", "Barton upon Humber", "Barton-le-Clay", "Barwell", "Basildon", "Basingstoke", "Baslow", "Bath", "Bathgate", "Batley", "Battle", "Bawtry", "Bayble", "Bayford", "Beach", "Beaconsfield", "Beal", "Bealings", "Beaminster", "Beaufort", "Beaulieu", "Beauly", "Beaumaris", "Beaumont", "Beaworthy", "Bebington", "Beccles", "Beckenham", "Beckingham", "Beckley", "Beckton", "Bedale", "Bedford", "Bedlington", "Bedminster", "Bedworth", "Beer", "Beeston", "Beith", "Bekesbourne", "Belbroughton", "Belcoo", "Belfast", "Belleek", "Bellshill", "Belmont", "Belper", "Belvedere", "Bembridge", "Ben Rhydding", "Benburb", "Benenden", "Benllech", "Benson", "Bentley", "Berkeley", "Berkhamstead", "Bermondsey", "Berwick", "Berwick-Upon-Tweed", "Besthorpe", "Betchworth", "Bettws", "Betws", "Beverley", "Bewdley", "Bexhill", "Bexleyheath", "Bicester", "Bickenhill", "Bickleigh", "Biddenden", "Biddenham", "Biddulph", "Bideford", "Bidford-on-Avon", "Bidston", "Bierton", "Biggar", "Biggin Hill", "Biggleswade", "Bignor", "Bildeston", "Billericay", "Billesley", "Billingham", "Billingshurst", "Bilsthorpe", "Bilston", "Binfield", "Bingham", "Bingley", "Binsted", "Birchanger", "Birchington", "Birdbrook", "Birkenhead", "Birmingham", "Birnam", "Birstall", "Birtley", "Birtley", "Bishop Auckland", "Bishop Burton", "Bishopbriggs", "Bishops Cleeve", "Bishops Waltham", "Bishopstoke", "Bishopstrow", "Bishopton", "Bisley", "Blackburn", "Blackford", "Blackford", "Blackheath", "Blackpool", "Blackwater", "Blackwater", "Blackwood", "Blackwood", "Blaenau-Ffestiniog", "Blaenavon", "Blaenwaun", "Blaina", "Blairgowrie", "Blakeney", "Blakeney", "Blandford Forum", "Blaydon", "Bledlow", "Bletchingley", "Bletchley", "Blewbury", "Blidworth", "Bloomsbury", "Bloxwich", "Blunham", "Bluntisham", "Blyth", "Bodelwyddan", "Bodmin", "Bognor Regis", "Boldon Colliery", "Bollington", "Bolney", "Bolsover", "Bolton", "Bonar Bridge", "Bonnybridge", "Bonnyrigg", "Bookham", "Bootle", "Bordesley", "Boreham", "Borehamwood", "Borough Green", "Boroughbridge", "Bosbury", "Boscastle", "Boston", "Boston Spa", "Botesdale", "Bothwell", "Botley", "Bottesford", "Bourne", "Bourne End", "Bournemouth", "Bournville", "Bourton on the Water", "Bovey Tracey", "Bow", "Bowdon", "Bowes", "Bowness-on-Windermere", "Box", "Boxley", "Bozeat", "Brackley", "Bracknell", "Bradfield St George", "Bradford", "Bradford-on-Avon", "Bradwell on Sea", "Braintree", "Bramford", "Bramhall", "Bramley", "Brampton", "Brandesburton", "Brandon", "Brandon", "Brandon", "Bransford", "Bransgore", "Brasted", "Braunstone", "Braunton", "Brayton", "Brechin", "Brecon", "Bredbury", "Brede", "Brenchley", "Brentford", "Brentwood", "Brewood", "Bridge", "Bridgemary", "Bridgend", "Bridgham", "Bridgnorth", "Bridgwater", "Bridlington", "Bridport", "Brierfield", "Brierley Hill", "Brigg", "Brighouse", "Brightlingsea", "Brighton", "Brigstock", "Brimpton", "Brimscombe", "Bristol", "Briton Ferry", "Brixham", "Brixton Hill", "Brixworth", "Broad Blunsdon", "Broadstairs", "Broadstone", "Broadwas", "Broadway", "Brockenhurst", "Brockley Green", "Brockworth", "Bromborough", "Bromham", "Brompton", "Bromsgrove", "Bromyard", "Brook", "Brook", "Brooke", "Brookland", "Broom", "Broseley", "Brough", "Broughton", "Broughton", "Broughton", "Broughton", "Broughton", "Broughton", "Broughton", "Broughty Ferry", "Brownhills", "Broxbourne", "Broxburn", "Bruton", "Buckden", "Buckfastleigh", "Buckhurst Hill", "Buckie", "Buckingham", "Buckland", "Buckley", "Bucknell", "Bude", "Budleigh Salterton", "Bugbrooke", "Builth Wells", "Bulford", "Bulkington", "Bulwell", "Bungay", "Buntingford", "Burbage", "Burbage", "Burford", "Burgess Hill", "Burgh le Marsh", "Burghclere", "Burley", "Burnham", "Burnham on Crouch", "Burnham-on-Sea", "Burnley", "Burnopfield", "Burntisland", "Burntwood", "Burry Port", "Burscough", "Burslem", "Burstwick", "Burton", "Burton", "Burton Pidsea", "Burton-on-Trent", "Burwash", "Burwell", "Bury", "Bury", "Bury St Edmunds", "Burythorpe", "Bushey", "Butterton", "Buxted", "Buxton", "Byfield", "Byfleet", "Cadbury", "Caddington", "Caernarfon", "Caerphilly", "Caersws", "Caister-on-Sea", "Caistor", "Caldicot", "Callander", "Callington", "Calne", "Calstock", "Calverton", "Cam", "Camberley", "Camberwell", "Camborne", "Cambridge", "Cambuslang", "Cambusnethan", "Camelford", "Campbeltown", "Canewdon", "Cannock", "Canterbury", "Capel", "Capenhurst", "Carbrooke", "Cardiff", "Cardigan", "Cardonald", "Cardross", "Carlisle", "Carlton", "Carlton", "Carlton le Moorland", "Carluke", "Carmarthen", "Carnforth", "Carnmoney", "Carnoustie", "Carrbridge", "Carrickfergus", "Carrowdore", "Carshalton", "Carterton", "Castle Cary", "Castle Donington", "Castle Douglas", "Castlederg", "Castleford", "Castlereagh", "Castleton", "Castlewellan", "Caston", "Caterham", "Catford", "Catherington", "Catterick", "Caversham", "Cawston", "Caxton", "Caythorpe", "Chacombe", "Chaddesden", "Chadwell", "Chalfont Saint Peter", "Chalgrove", "Chandlers Ford", "Chapel en le Frith", "Chapeltown", "Chard", "Charfield", "Charing Cross", "Charlestown", "Charlton on Otmoor", "Charlwood", "Charmouth", "Chartham", "Chasetown", "Chatham", "Chatteris", "Cheadle", "Cheadle", "Cheadle Hulme", "Cheam", "Checkley", "Cheddar", "Chellaston", "Chelmsford", "Chelsfield", "Cheltenham", "Chepstow", "Chertsey", "Chesham", "Cheshunt", "Chessington", "Chester", "Chester-le-Street", "Chesterfield", "Chestfield", "Chichester", "Chigwell", "Chilbolton", "Chilcompton", "Childwall", "Chilton", "Chilton", "Chilton Trinity", "Chilwell", "Chingford", "Chinley", "Chinnor", "Chippenham", "Chipping Campden", "Chipping Norton", "Chipping Ongar", "Chipping Sodbury", "Chipstead", "Chislehurst", "Chiswick", "Choppington", "Chorley", "Christchurch", "Christleton", "Chryston", "Chulmleigh", "Church", "Church Gresley", "Church Leigh", "Church Stretton", "Churchill", "Cinderford", "Cirencester", "City of London", "City of Westminster", "Clackmannan", "Clacton-on-Sea", "Clapham", "Clapham", "Clapham", "Clarbeston Road", "Clare", "Clare", "Claverdon", "Clavering", "Claygate", "Clayton West", "Cleator", "Cleator Moor", "Cleckheaton", "Clevedon", "Cleveleys", "Cliffe", "Clifton", "Clifton", "Clifton", "Clifton Hampden", "Clipstone", "Clitheroe", "Clovenfords", "Clun", "Clunderwen", "Clutton", "Clydach", "Clydebank", "Coalbrookdale", "Coalisland", "Coalville", "Coatbridge", "Cobham", "Cobham", "Cockerham", "Cockermouth", "Codsall", "Coed-Talon", "Cogenhoe", "Coggeshall", "Colchester", "Coleford", "Coleraine", "Colnbrook", "Colne", "Colne", "Colwyn Bay", "Colyford", "Colyton", "Comber", "Compton", "Compton Dundon", "Comrie", "Congleton", "Conisbrough", "Connahs Quay", "Conon Bridge", "Consett", "Conway", "Cookham", "Cooksbridge", "Cookstown", "Coppenhall", "Coppull", "Corbridge", "Corby", "Corfe Castle", "Corfe Mullen", "Corpach", "Corringham", "Corsham", "Corwen", "Coseley", "Cosham", "Cotgrave", "Cottenham", "Cottered", "Cottingham", "Coulsdon", "Countess Wear", "Coupar Angus", "Covent Garden", "Coventry", "Cowbridge", "Cowden", "Cowdenbeath", "Cowley", "Cradley", "Craigavon", "Cramlington", "Cranbrook", "Cranfield", "Cranford", "Cranleigh", "Crathorne", "Craven Arms", "Crawley", "Crayford", "Crediton", "Crewe", "Crewkerne", "Criccieth", "Crick", "Crickhowell", "Cricklade", "Cricklewood", "Crieff", "Crofton", "Cromer", "Cromwell", "Crook", "Crookham", "Crosby", "Cross", "Cross in Hand", "Cross Keys", "Crossgar", "Crossgates", "Crosshouse", "Croston", "Croughton", "Crowborough", "Crowland", "Crowthorne", "Croxley Green", "Croydon", "Crumlin", "Crymych", "Cublington", "Cuckfield", "Cuffley", "Cullen", "Cullompton", "Cumbernauld", "Cumnock", "Cupar", "Curdridge", "Currie", "Cwmbran", "Cynwyd", "Dagenham", "Dalbeattie", "Dalkeith", "Dalry", "Dalton in Furness", "Daresbury", "Darfield", "Darlaston", "Darlington", "Dartford", "Dartmouth", "Darvel", "Darwen", "Datchet", "Daventry", "Dawley", "Dawlish", "Deal", "Dean", "Deighton", "Denbigh", "Denby", "Denham", "Denny", "Denton", "Deptford", "Derby", "Dereham", "Derwen", "Desborough", "Devizes", "Dewsbury", "Didcot", "Diddington", "Dinas Powys", "Dingestow", "Dingwall", "Dinnington", "Diss", "Doagh", "Dolgelly", "Dollar", "Dollis Hill", "Dolwyddelan", "Donaghadee", "Doncaster", "Donnington", "Dorchester", "Dorking", "Dorney", "Dornoch", "Dorridge", "Douglas", "Doune", "Dover", "Dovercourt", "Downend", "Downham Market", "Downpatrick", "Draperstown", "Draycott", "Draycott in the Moors", "Drayton", "Drayton Bassett", "Drayton Saint Leonard", "Driffield", "Drighlington", "Droitwich", "Dromara", "Dromore", "Dronfield", "Droxford", "Droylsden", "Drumahoe", "Drumchapel", "Drybrook", "Drymen", "Duddington", "Dudley", "Duffield", "Duffus", "Dukinfield", "Dulverton", "Dulwich", "Dumbarton", "Dumbleton", "Dumfries", "Dunbar", "Dunblane", "Dunchurch", "Dundee", "Dundonald", "Dunfermline", "Dungannon", "Dungiven", "Dunkeld", "Dunkeswell", "Dunmurry", "Dunning", "Dunoon", "Duns", "Dunstable", "Durham", "Durrington", "Dursley", "Duxford", "Dyce", "Dymock", "Dyserth", "Eagle", "Eaglesfield", "Eaglesham", "Earley", "Earlham", "Earls Colne", "Earls Court", "Earlston", "Earnley", "Easington", "Easingwold", "East Barnet", "East Bergholt", "East Boldon", "East Budleigh", "East Challow", "East Cowes", "East Down", "East Dulwich", "East Grinstead", "East Hagbourne", "East Ham", "East Hanningfield", "East Harling", "East Hoathly", "East Horsley", "East Keal", "East Kilbride", "East Leake", "East Linton", "East Malling", "East Molesey", "East Peckham", "East Preston", "East Retford", "East Stour", "East Tilbury", "Eastbourne", "Eastchurch", "Eastcote", "Eastham", "Eastington", "Eastleigh", "Easton", "Eastwood", "Ebbw Vale", "Eccles", "Eccleshall", "Edenbridge", "Edenfield", "Edgbaston", "Edgefield", "Edgware", "Edinburgh", "Edmonton", "Edwalton", "Edwinstowe", "Effingham", "Egerton", "Egham", "Egremont", "Egton", "Elderslie", "Elgin", "Elland", "Ellesmere", "Ellesmere Port", "Ellington", "Ellon", "Elloughton", "Elmley Lovett", "Elstead", "Elstree", "Elsworth", "Eltham", "Ely", "Ely", "Empingham", "Emsworth", "Enfield", "Englefield Green", "Enniskillen", "Enstone", "Epping", "Epping Green", "Epsom", "Erdington", "Erith", "Esher", "Essendon", "Etchingham", "Eton", "Eversholt", "Evesham", "Ewelme", "Ewhurst", "Exeter", "Exminster", "Exmouth", "Eye", "Eyemouth", "Eynsham", "Failsworth", "Fairford", "Fairlight", "Fakenham", "Falkirk", "Falkland", "Falmouth", "Fangfoss", "Fareham", "Faringdon", "Farmborough", "Farnborough", "Farndon", "Farnham", "Farnham Royal", "Farningham", "Farnworth", "Fauldhouse", "Faulkland", "Faversham", "Felbridge", "Felixstowe", "Felsted", "Feltham", "Ferndale", "Ferryhill", "Ferryside", "Filey", "Fillongley", "Finchampstead", "Finchley", "Finedon", "Fintry", "Fishburn", "Fishguard", "Fitzwilliam", "Fivemiletown", "Fladbury", "Fleet", "Fleetwood", "Flint", "Flitwick", "Flordon", "Fochabers", "Folkestone", "Ford", "Fordingbridge", "Forest Row", "Forfar", "Formby", "Forres", "Fort William", "Four Marks", "Fowey", "Fownhope", "Framlingham", "Frant", "Fraserburgh", "Freckleton", "Frensham", "Freshwater", "Fressingfield", "Friern Barnet", "Frimley", "Fringford", "Frinton-on-Sea", "Friskney", "Frithville", "Frizington", "Frodsham", "Froggatt", "Frome", "Fulham", "Fulmer", "Gaerwen", "Gainsborough", "Galashiels", "Galston", "Gamlingay", "Gargrave", "Gargunnock", "Garrison", "Garstang", "Garston", "Garth", "Gateshead", "Gatwick", "Gaydon", "Gayton Thorpe", "Gelligaer", "Gifford", "Giggleswick", "Gillingham", "Gillingham", "Gipping", "Girton", "Girvan", "Glasdrumman", "Glasgow", "Glastonbury", "Glenboig", "Glenrothes", "Glenshee", "Glentham", "Glossop", "Gloucester", "Gnosall", "Godalming", "Godmanchester", "Godmersham", "Godstone", "Golborne", "Gomersal", "Goodmayes", "Goodwick", "Goole", "Goostrey", "Gordon", "Gorebridge", "Goring", "Goring", "Gorleston-on-Sea", "Gorseinon", "Gorslas", "Gorton", "Gosberton", "Gosfield", "Gosforth", "Gosport", "Goudhurst", "Gourock", "Granby", "Grange", "Grangemouth", "Grantham", "Grantown on Spey", "Grasmere", "Grateley", "Graveley", "Gravesend", "Grays", "Great Amwell", "Great Baddow", "Great Barton", "Great Billing", "Great Chesterford", "Great Dunmow", "Great Fransham", "Great Gidding", "Great Glemham", "Great Gransden", "Great Milton", "Great Missenden", "Great Ryburgh", "Great Staughton", "Great Torrington", "Great Waldingfield", "Great Yarmouth", "Greenfield", "Greenford", "Greenhead", "Greenhithe", "Greenisland", "Greenock", "Greensted", "Greenwich", "Grendon", "Grendon Underwood", "Gresford", "Gretna", "Gretna Green", "Gretton", "Grimsargh", "Grimsby", "Groombridge", "Grove", "Guildford", "Guisborough", "Guiseley", "Gullane", "Gunnislake", "Guthrie", "Hackbridge", "Hackney", "Haddenham", "Haddington", "Hadleigh", "Hadleigh", "Hadlow", "Hadlow Down", "Hagley", "Hailsham", "Halesowen", "Halesworth", "Halewood", "Halifax", "Halstead", "Halstead", "Halton", "Haltwhistle", "Halwell", "Hamble", "Hambleden", "Hambleton", "Hamilton", "Hammersmith", "Hampton", "Hampton", "Hampton Lucy", "Handcross", "Handforth", "Handsworth", "Hanley", "Hanwell", "Hanworth", "Hapton", "Harby", "Hardham", "Harefield", "Harlaxton", "Harlech", "Harlesden", "Harleston", "Harlow", "Harold Wood", "Harpenden", "Harrogate", "Harrold", "Harrow", "Harrow on the Hill", "Harrow Weald", "Hartfield", "Hartford", "Hartlepool", "Hartley", "Hartpury", "Hartwell", "Harwell", "Harwich", "Harworth", "Haslemere", "Haslingden", "Hassocks", "Hastings", "Hatch", "Hatfield", "Hatherleigh", "Hathersage", "Hatton", "Havant", "Haverfordwest", "Haverhill", "Havering atte Bower", "Hawarden", "Hawes", "Hawick", "Hawkhurst", "Hawkwell", "Hawley", "Haydock", "Haydon Bridge", "Hayes", "Hayes", "Hayle", "Haywards Heath", "Hazel Grove", "Hazelwood", "Headcorn", "Headington", "Headley", "Heanor", "Heath", "Heathfield", "Heathrow", "Hebburn", "Hebden Bridge", "Heckington", "Heckmondwike", "Hedgerley", "Hednesford", "Hedon", "Helens Bay", "Helensburgh", "Hellesdon", "Helmsley", "Helston", "Hemel Hempstead", "Hemingstone", "Hemswell", "Hemsworth", "Hendon", "Henfield", "Hengoed", "Henham", "Henley", "Henley-on-Thames", "Henlow", "Hennock", "Henstridge", "Hereford", "Heriot", "Hermitage", "Herne Bay", "Herriard", "Hersham", "Herstmonceux", "Hertford", "Hessle", "Heston", "Heswall", "Hever", "Hexham", "Heybridge", "Heysham", "Heythrop", "Heywood", "High Bentham", "High Blantyre", "High Halden", "High Legh", "High Peak", "High Peak Junction", "High Wycombe", "Higham Ferrers", "Higham on the Hill", "Highbridge", "Highbury", "Highcliffe", "Higher Bebington", "Hightown", "Highway", "Highworth", "Hilborough", "Hilderstone", "Hill", "Hillingdon", "Hillsborough", "Hillside", "Hilton", "Hinckley", "Hindhead", "Hindley", "Hindon", "Hingham", "Hinton St George", "Histon", "Hitcham", "Hitchin", "Hockley", "Hoddesdon", "Holbeach", "Holborn", "Holmes Chapel", "Holmewood", "Holmfirth", "Holsworthy", "Holt", "Holt", "Holyhead", "Holywell", "Holywell", "Holywood", "Honingham", "Honiton", "Hook", "Hooke", "Hopwood", "Horam", "Horbling", "Horbury", "Horley", "Horley", "Horncastle", "Hornchurch", "Horndean", "Horndon on the Hill", "Hornsea", "Hornsey", "Horrabridge", "Horsham", "Horsmonden", "Horsted Keynes", "Horton Kirby", "Horwich", "Hotham", "Houghton on the Hill", "Houghton Regis", "Houghton-le-Spring", "Houston", "Hove", "Howden", "Hoylake", "Hucknall Torkard", "Hucknall under Huthwaite", "Huddersfield", "Huish", "Hull", "Humberston", "Humbie", "Hungerford", "Hunstanton", "Huntingdon", "Huntly", "Huntspill", "Hursley", "Hurstbourne Tarrant", "Hurstpierpoint", "Hurworth", "Huyton", "Hyde", "Hythe", "Ibstock", "Ickenham", "Ifield", "Ilchester", "Ilford", "Ilfracombe", "Ilkeston", "Ilkley", "Ilminster", "Immingham", "Inchinnan", "Ingatestone", "Innerleithen", "Insch", "Inveraray", "Invergordon", "Inverkeilor", "Inverkeithing", "Inverkip", "Inverness", "Inverness-shire", "Inverurie", "Ipswich", "Irlam", "Irthlingborough", "Irvine", "Isham", "Isleham", "Isleworth", "Islington", "Islip", "Itchen", "Itchen Abbas", "Iver", "Ivybridge", "Iwerne Courtney", "Jarrow", "Jedburgh", "Johnstone", "Jordanstown", "Juniper Green", "Kedington", "Keele", "Keighley", "Keith", "Kelbrook", "Kelly", "Kelmarsh", "Kelsall", "Kelso", "Kelty", "Kelvedon", "Kempston", "Kendal", "Kenilworth", "Kenley", "Kennington", "Kennoway", "Kensington", "Kent", "Keresley", "Keston", "Keswick", "Ketley", "Kettering", "Keynsham", "Kibworth Harcourt", "Kidderminster", "Kidlington", "Kidsgrove", "Kidwelly", "Kilbarchan", "Kilbirnie", "Kilbride", "Kilbride", "Kilkeel", "Killamarsh", "Killin", "Kilmacolm", "Kilmarnock", "Kilsyth", "Kilwinning", "Kimberley", "Kimbolton", "Kingham", "Kinghorn", "Kinglassie", "Kings Langley", "Kings Lynn", "Kings Norton", "Kings Sutton", "Kingsbridge", "Kingskerswell", "Kingsland", "Kingsteignton", "Kingston", "Kingston", "Kingston Seymour", "Kingswinford", "Kingswood", "Kingswood", "Kingussie", "Kinloch Rannoch", "Kinmel", "Kinnerley", "Kinross", "Kirby Cross", "Kirk Ella", "Kirkby", "Kirkby in Ashfield", "Kirkby Stephen", "Kirkcaldy", "Kirkconnel", "Kirkcudbright", "Kirkham", "Kirkintilloch", "Kirkliston", "Kirkwall", "Kirriemuir", "Kirtlington", "Kirton in Lindsey", "Knaresborough", "Knebworth", "Kneeton", "Knighton", "Knottingley", "Knowsley", "Knutsford", "Kyle of Lochalsh", "Laindon", "Lakenheath", "Lambeth", "Lambourn", "Lampeter", "Lanark", "Lancaster", "Lancing", "Landrake", "Langho", "Langley", "Langport", "Langstone", "Lapworth", "Larbert", "Largs", "Larkhall", "Larne", "Lauder", "Laugharne", "Launceston", "Laurencekirk", "Lavant", "Lavendon", "Lawrencetown", "Laxfield", "Laxton", "Leatherhead", "Lechlade", "Leconfield", "Ledbury", "Lee", "Lee-on-the-Solent", "Leeds", "Leeds", "Leek", "Leek Wootton", "Leicester", "Leigh", "Leigh", "Leigh-on-Sea", "Leighton Buzzard", "Leiston", "Leitholm", "Lenham", "Leominster", "Lerwick", "Lesmahagow", "Letchworth", "Leuchars", "Leven", "Levenshulme", "Lewes", "Lewisham", "Leyburn", "Leyland", "Leysdown-on-Sea", "Leyton", "Lichfield", "Lidlington", "Lifton", "Limavady", "Limekilns", "Lincoln", "Lindal in Furness", "Lindfield", "Lingfield", "Linlithgow", "Linthwaite", "Linton", "Linton", "Linton upon Ouse", "Liphook", "Lisburn", "Liskeard", "Lisnaskea", "Liss", "Litherland", "Little Barningham", "Little Canfield", "Little Eaton", "Little Gaddesden", "Little Hulton", "Little Kimble", "Little Lever", "Little Milton", "Little Paxton", "Littleborough", "Littlebury", "Littlehampton", "Littleport", "Liverpool", "Liversedge", "Livingston", "Llanbedr", "Llanddulas", "Llandeilo", "Llandovery", "Llandrillo", "Llandrindod Wells", "Llandudno", "Llandudno Junction", "Llanelli", "Llanfair-Dyffryn-Clwyd", "Llanfairfechan", "Llanfyllin", "Llanfyrnach", "Llangattock", "Llangefni", "Llangennech", "Llangollen", "Llanharan", "Llanidloes", "Llanishen", "Llanon", "Llanrwst", "Llansantffraid-ym-Mechain", "Llantrisant", "Llantrisant", "Llantwit Fardre", "Llantwit Major", "Llanwrda", "Llanwrtyd Wells", "Llanymynech", "Llwyngwril", "Llwynypia", "Loanhead", "Lochgelly", "Lochgilphead", "Lochmaddy", "Lochwinnoch", "Lockerbie", "Loddington", "London", "London Borough of Bromley", "London Borough of Hounslow", "London Borough of Wandsworth", "Londonderry", "Long Buckby", "Long Ditton", "Long Eaton", "Long Melford", "Long Stratton", "Longdown", "Longfield", "Longhope", "Longniddry", "Longport", "Longridge", "Longstanton", "Longton", "Looe", "Loppington", "Lossiemouth", "Lostwithiel", "Loudwater", "Loughborough", "Loughor", "Loughton", "Louth", "Low Ham", "Lowdham", "Lower Beeding", "Lower Brailes", "Lower Darwen", "Lowestoft", "Lowton", "Lubenham", "Ludlow", "Lupton", "Lurgan", "Lustleigh", "Luton", "Lutterworth", "Lydbury North", "Lydney", "Lyme Regis", "Lyminge", "Lymington", "Lymm", "Lympsham", "Lyndhurst", "Lyng", "Lytchett Minster", "Lytham", "Mablethorpe", "Macclesfield", "Macduff", "Machynlleth", "Maerdy", "Maesteg", "Maghera", "Magherafelt", "Magheralin", "Maghull", "Maida Vale", "Maiden Newton", "Maidenhead", "Maidstone", "Malden", "Maldon", "Mallaig", "Malmesbury", "Malpas", "Malton", "Malvern", "Manchester", "Manningtree", "Manor", "Mansfield", "Mansfield Woodhouse", "Manton", "March", "Marcham", "Marden", "Margate", "Marhamchurch", "Mark", "Market Deeping", "Market Drayton", "Market Harborough", "Market Rasen", "Market Weighton", "Markfield", "Marlborough", "Marlow", "Marnhull", "Marple", "Marr", "Marsham", "Marske", "Martin", "Martley", "Martock", "Maryhill", "Maryport", "Masham", "Matching", "Matlock", "Mattishall", "Mauchline", "Maulden", "Maybole", "Mayfair", "Mayfield", "Mayfield", "Meanwood", "Measham", "Medmenham", "Medstead", "Meesden", "Meggies", "Meifod", "Melbourne", "Meldreth", "Melksham", "Mells", "Melrose", "Melton", "Melton Constable", "Melton Mowbray", "Menai Bridge", "Mendlesham", "Menheniot", "Menston", "Meopham", "Mere", "Merthyr Mawr", "Merthyr Tydfil", "Merton", "Metheringham", "Methil", "Mexborough", "Mickleton", "Mickleton", "Mid Calder", "Middlesbrough", "Middleton", "Middleton", "Middleton", "Middleton One Row", "Middlewich", "Midford", "Midgham", "Midhurst", "Midsomer Norton", "Mildenhall", "Milford", "Milford Haven", "Milford on Sea", "Mill Hill", "Millbrook", "Millbrook", "Millom", "Milltimber", "Milnathort", "Milnthorpe", "Milton", "Milton", "Milton", "Milton Keynes", "Milton on Stour", "Minchinhampton", "Minehead", "Minster", "Minster Lovell", "Minsterley", "Mirfield", "Mitcham", "Mitcheldean", "Mobberley", "Mochdre", "Moira", "Mold", "Molesey", "Molesey", "Mollington", "Moneymore", "Monifieth", "Monkswood", "Monkton", "Monmouth", "Montgomery", "Montrose", "Monyash", "Moorsholm", "Moorside", "Morden", "More", "Morecambe", "Moreton", "Moreton in Marsh", "Morley", "Morpeth", "Morriston", "Moseley", "Moss", "Mossley", "Moston", "Motherwell", "Moulton", "Moulton St Michael", "Moulton St Michael", "Mount Bures", "Mount Hamilton", "Mountain Ash", "Mountsorrel", "Much Hadham", "Much Hoole", "Much Wenlock", "Muir of Ord", "Mundesley", "Murton", "Musselburgh", "Myddle", "Mytholmroyd", "Myton on Swale", "Nafferton", "Nailsea", "Nairn", "Nantwich", "Nantyglo", "Napton on the Hill", "Narberth", "Naseby", "Nash", "Nassington", "Neasden", "Neath", "Needingworth", "Neilston", "Nelson", "Nelson", "Neston", "Nettlebed", "Nettleton", "New Barnet", "New Buckenham", "New Cross", "New Ferry", "New Mills", "New Milton", "New Quay", "New Romney", "New Southgate", "New Tredegar", "Newark on Trent", "Newbiggin-by-the-Sea", "Newbold", "Newbridge", "Newbridge", "Newburgh", "Newbury", "Newcastle", "Newcastle", "Newcastle Emlyn", "Newcastle upon Tyne", "Newcastle-under-Lyme", "Newent", "Newhall", "Newham", "Newham", "Newhaven", "Newick", "Newlands", "Newmarket", "Newport", "Newport", "Newport", "Newport", "Newport", "Newport Pagnell", "Newport-On-Tay", "Newquay", "Newry", "Newton Abbot", "Newton Aycliffe", "Newton on Trent", "Newton Stewart", "Newton-le-Willows", "Newtonmore", "Newtown", "Newtownabbey", "Newtownards", "Norbury", "Nordelph", "Norham", "Normandy", "Normanton", "North Berwick", "North Elmsall", "North Ferriby", "North Hykeham", "North Kilworth", "North Leigh", "North Moreton", "North Newton", "North Petherton", "North Shields", "North Somercotes", "North Tawton", "North Walsham", "North Waltham", "North Weald", "Northallerton", "Northampton", "Northenden", "Northfield", "Northfleet", "Northleach", "Northolt", "Northop", "Northrepps", "Northwich", "Northwood", "Norton", "Norton", "Norton", "Norton Lindsey", "Norwich", "Norwood", "Nottingham", "Nuffield", "Nuneaton", "Nutfield", "Nutley", "Oadby", "Oakamoor", "Oakford", "Oakham", "Oakhill", "Oakley", "Oare", "Oban", "Odiham", "Offord Cluny", "Okehampton", "Old Basing", "Old Buckenham", "Old Colwyn", "Old Malton", "Old Windsor", "Oldbury", "Oldbury", "Oldham", "Oldmeldrum", "Olney", "Omagh", "Ormesby", "Ormiston", "Ormskirk", "Orpington", "Ossett", "Oswaldtwistle", "Oswestry", "Otford", "Otley", "Otley", "Otterburn", "Ottershaw", "Ottery St Mary", "Oulton", "Oundle", "Overton", "Oving", "Ovingdean", "Owslebury", "Oxenhope", "Oxford", "Oxshott", "Oxted", "Padbury", "Paddock Wood", "Padiham", "Padstow", "Paignton", "Painswick", "Paisley", "Palmers Green", "Pampisford", "Papworth Everard", "Par", "Parbold", "Partington", "Partridge Green", "Paston", "Patchway", "Pathhead", "Patrington", "Paul", "Peebles", "Pelsall", "Pembroke", "Pembroke Dock", "Pembury", "Penarth", "Pencader", "Pencaitland", "Pencarreg", "Pencoed", "Pendlebury", "Penicuik", "Penkridge", "Penn", "Pennington", "Penrice", "Penrith", "Penryn", "Penshurst", "Pentraeth", "Penwortham", "Penzance", "Perivale", "Perranporth", "Pershore", "Perth", "Peterborough", "Peterculter", "Peterhead", "Peterlee", "Petersfield", "Petworth", "Pevensey", "Pewsey", "Pickering", "Piddington", "Pilham", "Pilton", "Pinner", "Pinxton", "Pitlochry", "Pitsford", "Pittenweem", "Plaistow", "Plaitford", "Pleshey", "Plockton", "Plumstead", "Plymouth", "Plymstock", "Pocklington", "Polegate", "Polmont", "Polperro", "Ponders End", "Pontardawe", "Pontefract", "Ponteland", "Pontesbury", "Pontycymer", "Pontypool", "Pontypridd", "Poole", "Poplar", "Porlock", "Port Erroll", "Port Glasgow", "Port Sunlight", "Port Talbot", "Portadown", "Portaferry", "Portchester", "Portglenone", "Porth", "Porthcawl", "Porthleven", "Portishead", "Portlethen", "Portmadoc", "Portree", "Portrush", "Portslade-by-Sea", "Portsmouth", "Portstewart", "Postling", "Potters Bar", "Potterspury", "Potton", "Poulton le Fylde", "Powfoot", "Powick", "Poynton", "Prees", "Preesall", "Prescot", "Prestatyn", "Presteigne", "Preston", "Prestonpans", "Prestwich", "Prestwick", "Princes Risborough", "Princethorpe", "Privett", "Prudhoe", "Puckeridge", "Pudsey", "Pulborough village hall", "Pulloxhill", "Purfleet", "Purleigh", "Purley", "Pwllheli", "Pyle", "Quedgeley", "Queenborough", "Queensferry", "Quinton", "Radcliffe", "Radcliffe on Trent", "Radlett", "Radnage", "Radstock", "Rainford", "Rainham", "Rainham", "Rainhill", "Rainworth", "Ramsbottom", "Ramsbury", "Ramsey", "Ramsey Saint Marys", "Ramsgate", "Randalstown", "Ratcliffe on Soar", "Rathfriland", "Ravenstone", "Rawmarsh", "Rawreth", "Rawtenstall", "Rayleigh", "Rayne", "Raynes Park", "Reading", "Redbourn", "Redcar", "Reddish", "Redditch", "Redhill", "Redhill", "Redland", "Redruth", "Reed", "Reepham", "Reigate", "Renfrew", "Renton", "Repton", "Reydon", "Rhayader", "Rhondda", "Rhoose", "Rhos-on-Sea", "Rhyl", "Richmond", "Richmond", "Rickmansworth", "Ridingmill", "Rimington", "Ringmer", "Ringwood", "Ripe", "Ripley", "Ripley", "Ripon", "Ripponden", "Risca", "Risley", "River", "Rivington", "Roade", "Roath", "Robertsbridge", "Rochdale", "Roche", "Rochester", "Rochford", "Rock", "Rock Ferry", "Roehampton", "Roffey", "Rogerstone", "Rogiet", "Romford", "Romsey", "Ross on Wye", "Rosslea", "Rosyth", "Rothbury", "Rotherfield", "Rotherham", "Rothesay", "Rothwell", "Rothwell", "Rottingdean", "Rowde", "Rowhedge", "Rowlands Castle", "Rowlands Gill", "Rowley Regis", "Roxwell", "Royal Leamington Spa", "Royal Tunbridge Wells", "Royal Wootton Bassett", "Roydon", "Royston", "Royston", "Ruabon", "Ruddington", "Rugby", "Rugeley", "Ruislip", "Runcorn", "Rushden", "Rushden", "Rustington", "Rutherglen", "Ruthin", "Ryde", "Rye", "Ryton", "Sacriston", "Saffron Walden", "Saint Agnes", "Saint Annes on the Sea", "Saint Bees", "Saint Brides Major", "Saint Clears", "Saint Columb Major", "Saint Erme", "Saint Ives", "Saint Leonards-on-Sea", "Saint Neots", "Sale", "Salford", "Salfords", "Salisbury", "Saltash", "Saltburn-by-the-Sea", "Saltcoats", "Salthouse", "Sandbach", "Sanderstead", "Sandhurst", "Sandiacre", "Sandown", "Sandwell", "Sandwich", "Sandy", "Sandycroft", "Sanquhar", "Sarratt", "Saundersfoot", "Sawbridgeworth", "Sawley", "Saxmundham", "Saxtead", "Scalby", "Scapa", "Scarborough", "Scunthorpe", "Seacroft", "Seaford", "Seaham", "Seale", "Seascale", "Seaton", "Seaton", "Seaview", "Sedbergh", "Sedgeberrow", "Sedgefield", "Sedgley", "Seend", "Seghill", "Selborne", "Selby", "Selkirk", "Selsey", "Selston", "Send", "Settle", "Seven Kings", "Sevenoaks", "Shadoxhurst", "Shaftesbury", "Shalford", "Shalford", "Shanklin", "Shardlow", "Shaw", "Shawbury", "Sheering", "Sheerness", "Sheffield", "Shefford", "Sheldon", "Shelford", "Shenfield", "Shepperton", "Shepshed", "Shepton Mallet", "Sherborne", "Sherfield upon Loddon", "Sheringham", "Shifnal", "Shildon", "Shilton", "Shinfield", "Shipley", "Shipston on Stour", "Shirebrook", "Shirehampton", "Shireoaks", "Shoeburyness", "Shoreham-by-Sea", "Shotley Gate", "Shotton", "Shotts", "Shrewsbury", "Shrivenham", "Sidcot", "Sidcup", "Sidlesham", "Sidmouth", "Sileby", "Silloth", "Silsden", "Silsoe", "Silverdale", "Silverstone", "Sittingbourne", "Skegness", "Skelmersdale", "Skelmorlie", "Skelton", "Skilgate", "Skipton", "Slapton", "Slawitt", "Sleaford", "Slinfold", "Slough", "Smalley", "Smarden", "Smethwick", "Snaresbrook", "Snettisham", "Snodland", "Soham", "Solihull", "Somerset", "Somersham", "Somerton", "Sompting", "Sonning", "South Benfleet", "South Brent", "South Brewham", "South Carlton", "South Cave", "South Cerney", "South Elmsall", "South Hayling", "South Hetton", "South Killingholme", "South Milford", "South Molton", "South Normanton", "South Ockendon", "South Petherton", "South Shields", "Southall", "Southam", "Southampton", "Southbourne", "Southend-on-Sea", "Southgate", "Southgate", "Southminster", "Southport", "Southsea", "Southwark", "Southwater", "Southwell", "Southwick", "Southwold", "Sowerby Bridge", "Spalding", "Sparsholt", "Speke", "Speldhurst", "Spennymoor", "Spetisbury", "Spilsby", "Spittal", "Spondon", "Spratton", "Sprowston", "Square", "St Albans", "St Andrews", "St Asaph", "St Austell", "St Helens", "St Ives", "St. Dogmaels", "Stafford", "Staindrop", "Staines", "Stalham", "Stallingborough", "Stalybridge", "Stamford", "Stanbridge", "Standlake", "Stanford", "Stanford", "Stanford", "Stanground", "Stanhope", "Stanley", "Stanmore", "Stanstead", "Stansted", "Stanton", "Stanton", "Stanton Fitzwarren", "Stanwell", "Staple", "Staplehurst", "Star", "Staverton", "Stawell", "Steeple Claydon", "Steeton", "Stepps", "Stevenage", "Stevenston", "Steventon", "Stewarton", "Steyning", "Stiffkey", "Stifford", "Stillington", "Stirling", "Stisted", "Stock", "Stockbridge", "Stockcross", "Stockport", "Stocksbridge", "Stocksfield", "Stockton", "Stockton-on-Tees", "Stoke", "Stoke by Nayland", "Stoke Climsland", "Stoke Newington", "Stoke Poges", "Stoke Prior", "Stoke upon Tern", "Stoke-on-Trent", "Stokesley", "Stone", "Stone", "Stone Allerton", "Stonehaven", "Stonehouse", "Stoneleigh", "Stonesfield", "Stony Stratford", "Stornoway", "Storrington", "Stotfold", "Stourbridge", "Stourport On Severn", "Stow", "Stow", "Stow on the Wold", "Stowe", "Stowmarket", "Strabane", "Stranmillis", "Stranraer", "Stratfield Mortimer", "Stratford", "Stratford-upon-Avon", "Strathaven", "Strathmiglo", "Strathyre", "Streatham", "Streatley", "Stretford", "Stretton on Fosse", "Stromness", "Strood", "Stroud", "Stuartfield", "Studham", "Studley", "Studley", "Sturmer", "Sturminster Newton", "Stutton", "Sudbury", "Sully", "Sunbury-on-Thames", "Sunderland", "Sundon Park", "Sunningdale", "Sunninghill", "Surbiton", "Surrey", "Sutton", "Sutton Bridge", "Sutton Coldfield", "Sutton Courtenay", "Sutton in Ashfield", "Sutton on Hull", "Sutton on the Hill", "Sutton on Trent", "Swadlincote", "Swaffham", "Swalwell", "Swanage", "Swanland", "Swanscombe", "Swansea", "Swavesey", "Swaythling", "Swindon", "Swindon Village", "Swinton", "Swynnerton", "Symington", "Syston", "Tackley", "Tadcaster", "Tadley", "Tadmarton", "Tadworth", "Tain", "Takeley", "Talgarth", "Talsarnau", "Talybont", "Tamworth", "Tandragee", "Tansley", "Taplow", "Tarbert", "Tarleton", "Tarporley", "Tatsfield", "Tattershall", "Taunton", "Tavistock", "Taynuilt", "Tayport", "Teddington", "Teddington", "Teignmouth", "Telford", "Temple", "Templecombe", "Templepatrick", "Tempo", "Tenbury Wells", "Tenby", "Tendring", "Tenterden", "Tetbury", "Tetsworth", "Tewin", "Tewkesbury", "Teynham", "Thakeham", "Thame", "Thames Ditton", "Thatcham", "The Hyde", "Theale", "Theale", "Thetford", "Theydon Bois", "Thirsk", "Thornaby", "Thornaby", "Thornbury", "Thornton", "Thornton", "Thornton Heath", "Thornton-in-Craven", "Thorpe St Peter", "Thorrington", "Thrapston", "Three Legged Cross", "Threlkeld", "Thurleigh", "Thurso", "Thurston", "Ticehurst", "Ticknall", "Tideswell", "Tilbury", "Tile Hill", "Tilehurst", "Tillicoultry", "Tillingham", "Timperley", "Tipton", "Tiptree", "Tisbury", "Tiverton", "Toddington", "Todmorden", "Tollard Royal", "Tollerton", "Tonbridge", "Tongham", "Tonypandy", "Tonyrefail", "Torpoint", "Torquay", "Totnes", "Tottenham", "Totteridge", "Totternhoe", "Totton", "Towcester", "Tranent", "Tredegar", "Trefonen", "Treforest", "Tregarth", "Trehafod", "Treharris", "Treherbert", "Trent", "Treorchy", "Treuddyn", "Trimdon", "Tring", "Troon", "Trowbridge", "Truro", "Trusthorpe", "Tunstall", "Turnberry", "Turriff", "Turvey", "Tweedmouth", "Twickenham", "Twyford", "Twyford", "Tyldesley", "Tynemouth", "Tywardreath", "Uckfield", "Uddingston", "Ufford", "Ulceby", "Ulcombe", "Ullesthorpe", "Ulverston", "Unstone", "Uphall", "Upminster", "Upper Beeding", "Upper Slaughter", "Uppingham", "Upton", "Upton", "Upton", "Upton upon Severn", "Upwell", "Urchfont", "Urmston", "Ushaw Moor", "Usk", "Uttoxeter", "Uxbridge", "Uxbridge", "Valley", "Ventnor", "Verwood", "Victoria", "Voe", "Waddesdon", "Wadebridge", "Wadhurst", "Wakefield", "Waldringfield", "Wales", "Walford", "Walgrave", "Walkden", "Walker", "Wallasey", "Wallingford", "Wallington", "Wallsend", "Walmer", "Walsall", "Waltham", "Waltham", "Waltham Abbey", "Waltham Cross", "Walthamstow", "Walton on Thames", "Walton on the Hill", "Walton on the Hill", "Walton-on-the-Naze", "Wanstead", "Wantage", "Warden", "Ware", "Wareham", "Warfield", "Wargrave", "Waringstown", "Warlingham", "Warmington", "Warminster", "Warrenpoint", "Warrington", "Warton", "Warwick", "Washington", "Watchet", "Watchfield", "Water Orton", "Waterbeach", "Waterlooville", "Watford", "Wath upon Dearne", "Watlington", "Wattisfield", "Watton", "Weald", "Wealdstone", "Weare", "Weaverham", "Wedmore", "Wednesbury", "Wednesfield", "Weedon", "Weedon Bec", "Well", "Welling", "Wellingborough", "Wellington", "Wellington", "Wells", "Welshpool", "Welwyn", "Welwyn Garden City", "Wem", "Wembley", "Wemyss Bay", "Wendover", "Wentworth", "Weobley", "West Ashby", "West Bromwich", "West Byfleet", "West Calder", "West Clandon", "West Cowes", "West Drayton", "West Drayton", "West Grinstead", "West Horsley", "West Kilbride", "West Kirby", "West Langdon", "West Linton", "West Malling", "West Mersea", "West Raynham", "West Row", "West Rudham", "West Wickham", "West Wickham", "West Wittering", "Westbury", "Westbury-sub-Mendip", "Westcott", "Westerham", "Westfield", "Westgate", "Westgate on Sea", "Westhay", "Westhoughton", "Westleigh", "Westleton", "Weston", "Weston", "Weston in Gordano", "Weston under Lizard", "Weston-super-Mare", "Wetherby", "Wethersfield", "Weybridge", "Weymouth", "Whaley Bridge", "Whalley", "Wheathampstead", "Wheatley", "Wheaton Aston", "Whetstone", "Whickham", "Whimple", "Whisby", "Whitbourne", "Whitburn", "Whitby", "Whitchurch", "Whitchurch", "Whitchurch", "Whitchurch", "Whitefield", "Whitehaven", "Whitehouse", "Whiteparish", "Whitland", "Whitley Bay", "Whitnash", "Whitstable", "Whittlebury", "Whittlesey", "Whittlesford", "Whitton", "Whitwell", "Whitwick", "Whyteleafe", "Wick", "Wick", "Wick", "Wick", "Wicken", "Wickersley", "Wickford", "Wickham", "Wickham Bishops", "Wickham Market", "Widdrington", "Widmerpool", "Widnes", "Wigan", "Wigston", "Wigton", "Wilburton", "Wilden", "Willaston", "Willenhall", "Willesden", "Willingale Doe", "Willingham", "Willington", "Willington", "Willington Quay", "Wilmington", "Wilmslow", "Wilnecote", "Wilshamstead", "Wimbledon", "Wimborne Minster", "Wincanton", "Winchester", "Windermere", "Windlesham", "Windsor", "Windsor", "Wing", "Wingate", "Winkleigh", "Winlaton", "Winnersh", "Winnington", "Winsford", "Winslow", "Winterborne Kingston", "Winterbourne Dauntsey", "Winton", "Wirksworth", "Wisbech", "Wishaw", "Witham", "Withernsea", "Withernwick", "Withington", "Witley", "Witney", "Wix", "Woburn Sands", "Woking", "Wokingham", "Wold Newton", "Woldingham", "Wolstanton", "Wolverhampton", "Wolverley", "Wombourne", "Wombwell", "Wooburn", "Woodbridge", "Woodford", "Woodford Green", "Woodhall Spa", "Woodham Ferrers", "Woodhouse", "Woodhouse", "Woodley", "Woodmancote", "Woodsetts", "Woodstock", "Woolacombe", "Woolwich", "Woore", "Wootton", "Wootton", "Wootton", "Wootton", "Worcester", "Worcester Park", "Workington", "Worksop", "Worle", "Worminghall", "Worsley", "Worth", "Worthing", "Wotton Underwood", "Wotton-under-Edge", "Wragby", "Wrangaton", "Wrangle", "Wrawby", "Wraysbury", "Wrea Green", "Wrexham", "Wrington", "Writtle", "Wroughton", "Wroxall", "Wyke", "Wymeswold", "Wymondham", "Wythenshawe", "Wyton", "Wyverstone", "Yarm", "Yate", "Yatton", "Yeadon", "Yelverton", "Yeovil", "York", "Yoxford", "Ystalyfera", "Ystrad Mynach", "Ystradgynlais", "Zeals"];
        const nlCityArray = ["Aagtekerke", "Aalburg", "Aalden", "Aalsmeer", "Aalsmeerderbrug", "Aalst", "Aalten", "Aardenburg", "Abbekerk", "Abbenes", "Abcoude", "Achterberg", "Achterveld", "Achthuizen", "Achtmaal", "Aduard", "Aerdenhout", "Aerdt", "Afferden", "Akersloot", "Akkrum", "Albergen", "Alblasserdam", "Alde Leie", "Alem", "Alkmaar", "Almelo", "Almere", "Almere Haven", "Almkerk", "Alphen", "Alphen aan den Rijn", "Ameide", "America", "Amerongen", "Amersfoort", "Ammerstol", "Ammerzoden", "Amstelhoek", "Amstelveen", "Amstenrade", "Amsterdam", "Anderen", "Andijk", "Ane", "Angeren", "Anjum", "Ankeveen", "Anloo", "Anna Paulowna", "Annen", "Apeldoorn", "Appelscha", "Appeltern", "Appingedam", "Arcen", "Arkel", "Arnemuiden", "Arnhem", "Asperen", "Assen", "Assendelft", "Asten", "Augustinusga", "Avenhorn", "Axel", "Baambrugge", "Baarland", "Baarle-Nassau", "Baarlo", "Baarn", "Baars", "Babberich", "Badhoevedorp", "Baexem", "Bakel", "Baken", "Bakhuizen", "Balgoij", "Balk", "Ballum", "Banholt", "Barchem", "Barendrecht", "Barneveld", "Batenburg", "Bathmen", "Bavel", "Bedum", "Beegden", "Beek", "Beek", "Beek", "Beekbergen", "Beerta", "Beerzerveld", "Beesd", "Beesel", "Beets", "Beetsterzwaag", "Beilen", "Beinsdorp", "Belfeld", "Bellingwolde", "Bemelen", "Bemmel", "Beneden-Leeuwen", "Bennebroek", "Bennekom", "Benningbroek", "Benthuizen", "Berg", "Berg en Dal", "Bergambacht", "Bergeijk", "Bergen", "Bergen", "Bergen op Zoom", "Bergentheim", "Bergharen", "Berghem", "Bergschenhoek", "Beringe", "Berkenwoude", "Berkhout", "Berlicum", "Best", "Beugen", "Beuningen", "Beusichem", "Beverwijk", "Biddinghuizen", "Bierum", "Biervliet", "Biest", "Bilthoven", "Bitgum", "Bladel", "Blaricum", "Bleiswijk", "Blerick", "Bleskensgraaf", "Blitterswijck", "Bloemendaal", "Blokker", "Blokzijl", "Bocholtz", "Bodegraven", "Boeicop", "Boekel", "Boelenslaan", "Boerakker", "Boesingheliede", "Bolsward", "Borculo", "Borger", "Born", "Borne", "Borsele", "Bosch en Duin", "Boskoop", "Bosschenhoofd", "Bourtange", "Boven-Hardinxveld", "Boven-Leeuwen", "Bovenkarspel", "Bovensmilde", "Boxmeer", "Boxtel", "Brakel", "Breda", "Bredevoort", "Breezand", "Breskens", "Breugel", "Breukelen", "Breukeleveen", "Brielle", "Briltil", "Britsum", "Broek in Waterland", "Broek op Langedijk", "Broekhin", "Broekhuizen", "Brouwershaven", "Bruchem", "Brucht", "Bruinisse", "Brummen", "Brunssum", "Buchten", "Budel", "Budel-Dorplein", "Budel-Schoot", "Buinerveen", "Buitenkaag", "Buitenpost", "Bunde", "Bunnik", "Bunschoten", "Buren", "Buren", "Burgerveen", "Burgum", "Burgwerd", "Burum", "Bussum", "Buurse", "Cadier en Keer", "Cadzand", "Callantsoog", "Capelle aan den IJssel", "Castricum", "Centrum", "Chaam", "Clinge", "Coevorden", "Colijnsplaat", "Colmschate", "Craailo", "Cromvoirt", "Cruquius", "Cuijk", "Culemborg", "Daarle", "Dalen", "Dalfsen", "Damwald", "De Bilt", "De Blesse", "De Cocksdorp", "De Falom", "De Glind", "De Goorn", "De Hoef", "De Horst", "De Klomp", "De Koog", "De Kwakel", "De Lier", "De Lutte", "De Meern", "De Moer", "De Punt", "De Rijp", "De Steeg", "De Waal", "De Westereen", "De Wijk", "De Wilp", "De Zilk", "Dedemsvaart", "Deest", "Delden", "Delden", "Delfgauw", "Delft", "Delfzijl", "Den Bommel", "Den Burg", "Den Deijl", "Den Dolder", "Den Dungen", "Den Helder", "Den Hoorn", "Den Hout", "Den Ilp", "Den Oever", "Denekamp", "Deurne", "Deventer", "Didam", "Diemen", "Diepenheim", "Diepenveen", "Dieren", "Diessen", "Dieteren", "Diever", "Dijk", "Dinteloord", "Dinxperlo", "Dirkshorn", "Dirksland", "Dodewaard", "Doenrade", "Doesburg", "Doetinchem", "Dokkum", "Domburg", "Dongen", "Doorn", "Doornenburg", "Doornspijk", "Doorwerth", "Dordrecht", "Dorp", "Dorst", "Drachten", "Drempt", "Dreumel", "Driebergen", "Driebruggen", "Driehuis", "Driel", "Driemond", "Drogeham", "Dronryp", "Dronten", "Drunen", "Druten", "Duin", "Duiven", "Duivendrecht", "Dwingeloo", "Earnewald", "Echt", "Echten", "Echtenerbrug", "Eckart", "Edam", "Ede", "Ederveen", "Eede", "Eefde", "Eelde-Paterswolde", "Eelderwolde", "Eemnes", "Eenrum", "Eerbeek", "Eersel", "Eethen", "Eext", "Eexterzandvoort", "Egchel", "Egmond aan Zee", "Egmond-Binnen", "Eibergen", "Eijsden", "Eindhoven", "Einighausen", "Elburg", "Ell", "Ellecom", "Elsendorp", "Elsloo", "Elst", "Elst", "Emmeloord", "Emmen", "Emmer-Compascuum", "Emst", "Engelen", "Enkhuizen", "Ens", "Enschede", "Enschot", "Enspijk", "Enter", "Enumatil", "Epe", "Epen", "Epse", "Erica", "Erichem", "Erm", "Ermelo", "Erp", "Escharen", "Espel", "Etten", "Everdingen", "Ewijk", "Exloo", "Eygelshoven", "Eys", "Ezinge", "Farmsum", "Feanwalden", "Ferwert", "Fijnaart", "Finsterwolde", "Fleringen", "Fluitenberg", "Flushing", "Foxhol", "Franeker", "Frederiksoord", "Gaanderen", "Galder", "Gameren", "Gapinge", "Garderen", "Garmerwolde", "Garsthuizen", "Garyp", "Gasselte", "Gasselternijveen", "Geertruidenberg", "Geervliet", "Gees", "Geesteren", "Geesteren", "Geldermalsen", "Geldrop", "Geleen", "Gelselaar", "Gemeente Rotterdam", "Gemert", "Gemonde", "Genderen", "Gendringen", "Gendt", "Genemuiden", "Gennep", "Giesbeek", "Giessenburg", "Giessendam", "Gieten", "Gieterveen", "Giethoorn", "Gilze", "Glimmen", "Goes", "Goirle", "Goor", "Gorinchem", "Gorredijk", "Gorssel", "Gouda", "Gouderak", "Goudswaard", "Goutum", "Gramsbergen", "Grashoek", "Grathem", "Grave", "Greup", "Grijpskerk", "Groeningen", "Groenlo", "Groenveld", "Groesbeek", "Groessen", "Groet", "Groningen", "Gronsveld", "Groot-Agelo", "Groot-Ammers", "Grootebroek", "Grootegast", "Grou", "Grubbenvorst", "Gulpen", "Guttecoven", "Gytsjerk", "Haaften", "Haaksbergen", "Haalderen", "Haamstede", "Haaren", "Haarle", "Haarlem", "Haarlemmerliede", "Haelen", "Halfweg", "Halle", "Hallum", "Halsteren", "Hank", "Hantum", "Hantumhuizen", "Hapert", "Haps", "Hardenberg", "Harderwijk", "Haren", "Haren", "Harich", "Harkema", "Harkstede", "Harlingen", "Harmelen", "Hartwerd", "Hasselt", "Hattem", "Haule", "Haulerwijk", "Hauwert", "Havelte", "Hazerswoude-Dorp", "Hazerswoude-Rijndijk", "Hedel", "Hedel", "Heeg", "Heelsum", "Heemskerk", "Heemstede", "Heenvliet", "Heerde", "Heerenveen", "Heerhugowaard", "Heerjansdam", "Heerle", "Heerlen", "Heesch", "Heeswijk", "Heeswijk-Dinther", "Heeten", "Heeze", "Heijen", "Heijningen", "Heikant", "Heilig Landstichting", "Heiloo", "Heinenoord", "Heino", "Hekelingen", "Helden", "Helenaveen", "Hellendoorn", "Hellevoetsluis", "Hellouw", "Helmond", "Helvoirt", "Hem", "Hemelum", "Hendrik-Ido-Ambacht", "Hengelo", "Hengelo", "Hengevelde", "Hennaard", "Hensbroek", "Herbaijum", "Herkenbosch", "Herkingen", "Hernen", "Herpen", "Herten", "Herveld", "Herwijnen", "Heteren", "Heukelum", "Heusden", "Heveadorp", "Heythuysen", "Hierden", "Hijken", "Hillegom", "Hilvarenbeek", "Hilversum", "Hindeloopen", "Hippolytushoef", "Hoedekenskerke", "Hoek", "Hoek van Holland", "Hoenderloo", "Hoensbroek", "Hoevelaken", "Hoge Donk", "Hollandsche Rading", "Hollandscheveld", "Hollum", "Holten", "Holthees", "Holthone", "Holtum", "Holwierde", "Homoet", "Honselersdijk", "Hoofddorp", "Hoofdplaat", "Hoogblokland", "Hooge Zwaluwe", "Hoogeloon", "Hoogerheide", "Hoogersmilde", "Hoogeveen", "Hoogezand", "Hooghalen", "Hoogkarspel", "Hoogkerk", "Hoogland", "Hooglanderveen", "Hoogmade", "Hoogvliet", "Hoogwoud", "Hoorn", "Hoorn", "Hoornaar", "Horn", "Horst", "Hout", "Houtakker", "Houten", "Huijbergen", "Huis ter Heide", "Huissen", "Huizen", "Hulsberg", "Hulshorst", "Hulst", "Hummelo", "Hurdegaryp", "IJhorst", "IJlst", "IJmuiden", "IJsselmuiden", "IJsselstein", "IJzendijke", "IJzendoorn", "Ilpendam", "Ingelum", "Ingen", "Ittervoort", "Jabeek", "Jisp", "Joppe", "Joure", "Jubbega", "Julianadorp", "Jutrijp", "Kaag", "Kaatsheuvel", "Kalenberg", "Kamerik", "Kampen", "Kamperland", "Kantens", "Kapelle", "Kats", "Katwijk", "Katwijk aan Zee", "Katwoude", "Keijenborg", "Kekerdom", "Keldonk", "Kerk-Avezaath", "Kerkdriel", "Kerkenveld", "Kerkrade", "Kessel", "Kesteren", "Kimswerd", "Kinderdijk", "Klaaswaal", "Klazienaveen", "Klimmen", "Kloetinge", "Kloosterhaar", "Klundert", "Kockengen", "Koedijk", "Koekange", "Koewacht", "Kolham", "Kolhorn", "Kollum", "Kommerzijl", "Koog aan de Zaan", "Kootstertille", "Kootwijkerbroek", "Kortenhoef", "Kortgene", "Koudekerk aan den Rijn", "Koudekerke", "Koudum", "Kraggenburg", "Krimpen aan de Lek", "Krimpen aan den IJssel", "Krommenie", "Kropswolde", "Kruiningen", "Kruisland", "Kudelstaart", "Kuitaart", "Kwintsheul", "Laag-Soeren", "Lage Mierde", "Lage Zwaluwe", "Landsmeer", "Langedijk", "Langezwaag", "Laren", "Lathum", "Leek", "Leerdam", "Leersum", "Leeuwarden", "Legemeer", "Leiden", "Leiderdorp", "Leidschendam", "Leimuiden", "Lekkerkerk", "Lelystad", "Lemele", "Lemelerveld", "Lemiers", "Lemmer", "Lent", "Lettele", "Leusden", "Leuth", "Lewenborg", "Lexmond", "Lichtenvoorde", "Liempde", "Lienden", "Lienden", "Lies", "Lieshout", "Liessel", "Lievelde", "Lijnden", "Limbricht", "Limmel", "Limmen", "Linne", "Linschoten", "Lippenhuizen", "Lisse", "Lithoijen", "Lobith", "Lochem", "Loenen", "Loon op Zand", "Loosdrecht", "Loozen", "Lopik", "Loppersum", "Losser", "Lottum", "Lunteren", "Lutjebroek", "Lutjewinkel", "Lutten", "Luyksgestel", "Maarheeze", "Maarn", "Maarssen", "Maarssenbroek", "Maartensdijk", "Maasbommel", "Maasbracht", "Maasbree", "Maasdam", "Maasdijk", "Maashees", "Maaskantje", "Maasland", "Maassluis", "Maastricht", "Made", "Makkum", "Malden", "Manderveen", "Margraten", "Marienberg", "Markelo", "Marknesse", "Marrum", "Marum", "Mastenbroek", "Maurik", "Mechelen", "Medemblik", "Meeden", "Meer", "Meerkerk", "Meerlo", "Meerssen", "Meeuwen", "Megchelen", "Meijel", "Melick", "Meppel", "Merkelbeek", "Merselo", "Middelbeers", "Middelburg", "Middelharnis", "Middenbeemster", "Middenmeer", "Midlum", "Mierlo", "Mijdrecht", "Mijnsheerenland", "Mildam", "Milheeze", "Mill", "Millingen", "Millingen aan de Rijn", "Milsbeek", "Moerdijk", "Moergestel", "Moerkapelle", "Molenaarsgraaf", "Molenhoek", "Molenhoek", "Molenschot", "Monnickendam", "Monster", "Montfoort", "Montfort", "Mook", "Mookhoek", "Moordrecht", "Mortel", "Muiden", "Muiderberg", "Munstergeleen", "Muntendam", "Mussel", "Naaldwijk", "Naarden", "Nederasselt", "Nederhemert", "Nederhorst den Berg", "Nederweert", "Neede", "Neer", "Neer-Andel", "Nes", "Netterden", "Nibbixwoud", "Nieuw-Amsterdam", "Nieuw-Balinge", "Nieuw-Beijerland", "Nieuw-Bergen", "Nieuw-Buinen", "Nieuw-Dordrecht", "Nieuw-Lekkerland", "Nieuw-Namen", "Nieuw-Schoonebeek", "Nieuw-Vennep", "Nieuw-Vossemeer", "Nieuwdorp", "Nieuwe Pekela", "Nieuwe Wetering", "Nieuwe-Niedorp", "Nieuwe-Tonge", "Nieuwegein", "Nieuwehorne", "Nieuwendijk", "Nieuwer-Ter-Aa", "Nieuwerbrug", "Nieuwerkerk aan den IJssel", "Nieuweschoot", "Nieuwkoop", "Nieuwkuijk", "Nieuwlande", "Nieuwleusen", "Nieuwolda", "Nieuwpoort", "Nieuwstadt", "Nieuwveen", "Nigtevecht", "Nijbroek", "Nijhuizum", "Nijkerk", "Nijkerkerveen", "Nijland", "Nijmegen", "Nijnsel", "Nijverdal", "Nistelrode", "Noardburgum", "Noorbeek", "Noord-Scharwoude", "Noord-Sleen", "Noordbroek", "Noordeloos", "Noorden", "Noordgouwe", "Noordhorn", "Noordlaren", "Noordscheschut", "Noordwelle", "Noordwijk aan Zee", "Noordwijk-Binnen", "Noordwijkerhout", "Noordwolde", "Nootdorp", "Norg", "Nuenen", "Nuis", "Nuland", "Numansdorp", "Nunhem", "Nunspeet", "Nuth", "Obbicht", "Obdam", "Ochten", "Odijk", "Oeffelt", "Oegstgeest", "Oene", "Oijen", "Oirsbeek", "Oirschot", "Oisterwijk", "Oldeberkoop", "Oldebroek", "Oldeholtpade", "Oldehove", "Oldekerk", "Oldemarkt", "Oldenzaal", "Olst", "Ommen", "Onnen", "Ooij", "Ooltgensplaat", "Oost-Souburg", "Oostburg", "Oostendam", "Oosterbeek", "Oosterbierum", "Oosterend", "Oosterhesselen", "Oosterhout", "Oosterland", "Oosternijkerk", "Oosterwolde", "Oosterwolde", "Oosterzee", "Oosthuizen", "Oostkapelle", "Oostvoorne", "Oostwold", "Oostwoud", "Oostzaan", "Ootmarsum", "Op den Bosch", "Opeinde", "Ophemert", "Opheusden", "Opmeer", "Oranje", "Oranjewoud", "Ospel", "Oss", "Ossendrecht", "Oterleek", "Otterlo", "Ottersum", "Oud-Ade", "Oud-Alblas", "Oud-Beijerland", "Oud-Gastel", "Oud-Zuilen", "Ouddorp", "Oude Pekela", "Oude Wetering", "Oude-Tonge", "Oudega", "Oudehaske", "Oudehorne", "Oudelande", "Oudemirdum", "Oudemolen", "Oudenbosch", "Oudendijk", "Ouderkerk aan de Amstel", "Oudeschild", "Oudesluis", "Oudewater", "Oudkarspel", "Oudorp", "Oudwoude", "Overasselt", "Overberg", "Overdinkel", "Overloon", "Overveen", "Ovezande", "Palemig", "Pannerden", "Panningen", "Papekop", "Papendrecht", "Partij", "Paterswolde", "Peize", "Pernis", "Petten", "Philippine", "Piershil", "Pieterburen", "Pieterzijl", "Pijnacker", "Pingjum", "Plasmolen", "Poeldijk", "Poortugaal", "Poortvliet", "Posterholt", "Princenhof", "Prinsenbeek", "Puiflijk", "Purmerend", "Purmerland", "Puth", "Putte", "Putten", "Puttershoek", "Raalte", "Raamsdonksveer", "Randwijk", "Ravenstein", "Ravenswoud", "Reeuwijk", "Rekken", "Renesse", "Renkum", "Renswoude", "Ressen", "Retranchement", "Reusel", "Reuver", "Rheden", "Rhenen", "Rhenoy", "Rhoon", "Ridderkerk", "Riethoven", "Rietveld", "Rijckholt", "Rijen", "Rijkevoort", "Rijnsburg", "Rijpwetering", "Rijsbergen", "Rijsenhout", "Rijssen", "Rijswijk", "Rijswijk", "Rilland", "Rinsumageast", "Rips", "Rivierenwijk", "Rixtel", "Rockanje", "Roden", "Rodenrijs", "Roelofarendsveen", "Roermond", "Roggel", "Rolde", "Roodeschool", "Roosendaal", "Roosteren", "Rooth", "Rosmalen", "Rossum", "Rossum", "Rotterdam", "Rottum", "Rottum", "Rozenburg", "Rozenburg", "Rozendaal", "Rucphen", "Ruinen", "Ruinerwold", "Rutten", "Ruurlo", "s-Heerenberg", "Saasveld", "Sambeek", "Santpoort-Noord", "Sappemeer", "Sas van Gent", "Sassenheim", "Schagen", "Schagerbrug", "Schaijk", "Schalkhaar", "Scharmer", "Scheemda", "Schellinkhout", "Schermerhorn", "Scherpenisse", "Scherpenzeel", "Schiedam", "Schiermonnikoog", "Schijndel", "Schildwolde", "Schimmert", "Schin op Geul", "Schinnen", "Schinveld", "Schipborg", "Schipluiden", "Schoondijke", "Schoonebeek", "Schoonhoven", "Schoorl", "Schore", "Sellingen", "Serooskerke", "Sevenum", "Sibculo", "Siddeburen", "Siebengewald", "Silvolde", "Simpelveld", "Sint Agatha", "Sint Annaland", "Sint Annaparochie", "Sint Anthonis", "Sint Hubert", "Sint Jansteen", "Sint Joost", "Sint Maarten", "Sint Maartensdijk", "Sint Nicolaasga", "Sint Odilienberg", "Sint Pancras", "Sint Philipsland", "Sint Willebrord", "Sint-Michielsgestel", "Sint-Oedenrode", "Sintjohannesga", "Sittard", "Slagharen", "Sleen", "Sleeuwijk", "Slenaken", "Sliedrecht", "Slijk-Ewijk", "Slochteren", "Slootdorp", "Sloterdijk", "Sluis", "Sluiskil", "Smilde", "Sneek", "Soerendonk", "Soest", "Soesterberg", "Someren", "Sommelsdijk", "Son en Breugel", "Spaarndam", "Spakenburg", "Spanbroek", "Spaubeek", "Spierdijk", "Spijk", "Spijkenisse", "Sprang", "Sprundel", "Stadskanaal", "Stampersgat", "Staphorst", "Stationsbuurt", "Stedum", "Steenbergen", "Steensel", "Steenwijk", "Steggerda", "Steijl", "Stein", "Stellendam", "Sterksel", "Stevensbeek", "Stevensweert", "Stiens", "Stolwijk", "Stompetoren", "Stompwijk", "Stoutenburg", "Strijen", "Strijensas", "Stroe", "Stuifzand", "Sumar", "Surhuisterveen", "Surhuizum", "Susteren", "Suwald", "Swalmen", "Sweikhuizen", "Swifterbant", "Taarlo", "Tegelen", "Ten Boer", "Ten Post", "Ter Aar", "Ter Apel", "Ter Apelkanaal", "Terblijt", "Terborg", "Terheijden", "Terneuzen", "Terschuur", "Teteringen", "The Hague", "Tholen", "Tiel", "Tienhoven", "Tienraij", "Tijnje", "Tilburg", "Tilligte", "Tinte", "Tjerkwerd", "Tolbert", "Toldijk", "Tolkamer", "Tricht", "Tubbergen", "Tuitjenhorn", "Tull", "Tweede Exloermond", "Tweede Valthermond", "Twello", "Twijzelerheide", "Twisk", "Tynaarlo", "Tytsjerk", "Tzummarum", "Uddel", "Uden", "Udenhout", "Ugchelen", "Uitdam", "Uitgeest", "Uithoorn", "Uithuizen", "Uithuizermeeden", "Uitwellingerga", "Ulestraten", "Ulft", "Ulicoten", "Ulrum", "Ulvenhout", "Ureterp", "Urk", "Urmond", "Ursem", "Utrecht", "Vaals", "Vaassen", "Valburg", "Valkenburg", "Valkenburg", "Valkenswaard", "Valthe", "Valthermond", "Varik", "Varsseveld", "Vasse", "Veen", "Veendam", "Veenendaal", "Veenhuizen", "Veenoord", "Veghel", "Velddriel", "Velden", "Veldhoven", "Velp", "Velsen", "Velsen-Noord", "Ven-Zelderheide", "Venhorst", "Venhuizen", "Venlo", "Venray", "Vianen", "Vierhouten", "Vierlingsbeek", "Vierpolders", "Vijfhuizen", "Vilt", "Vinkeveen", "Vlaardingen", "Vlagtwedde", "Vledder", "Vleuten", "Vlieland", "Vlijmen", "Vlodrop", "Voerendaal", "Vogelenzang", "Vogelwaarde", "Volendam", "Volkel", "Voorburg", "Voorhout", "Voorschoten", "Voorst", "Voorthuizen", "Vorden", "Vorstenbosch", "Vortum-Mullem", "Vragender", "Vreeland", "Vries", "Vriezenveen", "Vroomshoop", "Vrouwenpolder", "Vught", "Vuren", "Waalre", "Waalwijk", "Waardenburg", "Waarder", "Waarland", "Waddinxveen", "Wagenberg", "Wagenborgen", "Wageningen", "Walterswald", "Wamel", "Wanroij", "Wanssum", "Wapenveld", "Warder", "Warffum", "Warmenhuizen", "Warmond", "Warnsveld", "Waspik", "Wassenaar", "Wateringen", "Waterland", "Weerselo", "Weert", "Weesp", "Wehl", "Weidum", "Well", "Wellerlooi", "Wemeldinge", "Werkendam", "Werkhoven", "Wervershoof", "Wessem", "West-Knollendam", "West-Terschelling", "Westbeemster", "Westbroek", "Westdorpe", "Westerbork", "Westerhaar-Vriezenveensewijk", "Westerhoven", "Westervoort", "Westerwijtwerd", "Westkapelle", "Westmaas", "Westzaan", "Weurt", "Wezep", "Wierden", "Wieringerwaard", "Wieringerwerf", "Wierum", "Wijchen", "Wijckel", "Wijdenes", "Wijdewormer", "Wijhe", "Wijk aan Zee", "Wijk bij Duurstede", "Wijlre", "Wijnaldum", "Wijnandsrade", "Wijngaarden", "Wijster", "Wildervank", "Willemstad", "Wilnis", "Wilp", "Winkel", "Winschoten", "Winssen", "Winsum", "Wintelre", "Winterswijk", "Wissenkerke", "Witharen", "Wittem", "Witteveen", "Woensdrecht", "Woerden", "Woerdense Verlaat", "Wognum", "Wolfheze", "Wolphaartsdijk", "Woltersum", "Wolvega", "Wommels", "Wons", "Workum", "Wormer", "Wormerveer", "Woubrugge", "Woudenberg", "Woudrichem", "Woudsend", "Wouwsche Plantage", "Yde", "Yerseke", "Ysbrechtum", "Zaamslag", "Zaandam", "Zaandijk", "Zaanstad", "Zalk", "Zaltbommel", "Zandeweer", "Zandvoort", "Zeddam", "Zeeland", "Zeerijp", "Zeewolde", "Zeist", "Zelhem", "Zetten", "Zevenaar", "Zevenbergen", "Zevenbergschen Hoek", "Zevenhoven", "Zevenhuizen", "Zierikzee", "Zieuwent", "Zijderveld", "Zoetermeer", "Zoeterwoude", "Zonnemaire", "Zorgvlied", "Zoutelande", "Zoutkamp", "Zuid-Beijerland", "Zuid-Scharwoude", "Zuidbroek", "Zuidermeer", "Zuiderpark", "Zuidhorn", "Zuidland", "Zuidlaren", "Zuidoostbeemster", "Zuidwolde", "Zuidzande", "Zuilichem", "Zundert", "Zutphen", "Zwaag", "Zwaagdijk-Oost", "Zwaanshoek", "Zwanenburg", "Zwartebroek", "Zwartemeer", "Zwartewaal", "Zwartsluis", "Zwijndrecht", "Zwinderen", "Zwolle"];

        // Auswahl der passenden Vorwahl nach der erkannten Sprache
        switch (this.language.languageName) {
            case "de":
                cityNamesArray = this.fetchedCityNames;
                break;

            case "nl":
                cityNamesArray = nlCityArray;
                countryCode = "nl";
                secondCountryCode = "n"
                break;

            case "eng":
                cityNamesArray = ukCityArray;
                countryCode = "uk";
                secondCountryCode = "gb"
                break;

            default:
                break;
        }

        //array to lowercase, um mit element zu vergleichen
        for (let a = 0; a < cityNamesArray.length; a++) {
            const element = cityNamesArray[a];
            cityNamesArray[a] = element.toLowerCase();
        }

        //check ob elements im json enthalten sind und somit eine Stadt matchen
        cityLoop: for (let i = 0; i < inputLineWords.length; i++) {
            const element = inputLineWords[i].toLowerCase().replaceAll(",", ""); //replace von Kommas, um mögliche Ungenauigkeit zu verhindern
            const elementClear = inputLineWords[i].replaceAll(",", "").replaceAll(".", "");
            probability = 0;

            if (cityNamesArray.includes(element)) {
                probability += 60;
                cityName = cityNamesArray.indexOf(element);
                postalCode = this.fetchedPostalCodes[cityName];

                if (inputLineWords[i - 1] !== undefined) {
                    wordBefore = inputLineWords[i - 1];

                    if (wordBefore.includes(postalCode)) {
                        probability = 100;
                    }
                }
            }

            //falls ein Länderpräfix vor den Wort steht wird dieser Entfernt und gibt Prozente 
            for (let a = 0; a < inputLineWords.length; a++) {
                const element = inputLineWords[a].toLowerCase().replaceAll(",", "");

                if (element.startsWith(secondCountryCode + "-")) {
                    inputLineWords[a] = element.replace(secondCountryCode + "-", "");
                    probability += 10;
                }

                if (element.startsWith(countryCode + "-")) {
                    inputLineWords[a] = element.replace(countryCode + "-", "");
                    probability += 10;
                }

                // TODO array erstellen und durch loopen
                //bei bestimmten regelmäßigen Endungen von Städten gewisse Probability geben
                if (
                    element.endsWith("berg")
                    || element.endsWith("stadt")
                    || element.endsWith("stedt")
                    || element.endsWith("ingen")
                    || element.endsWith("brück")
                    || element.endsWith("burg")
                    || element.endsWith("furt")
                    || element.endsWith("kirchen")
                    || element.endsWith("chester")
                    || element.endsWith("borough")
                    || element.endsWith("mouth")
                    || element.endsWith("bury")
                    || element.endsWith("wick")
                ) {
                    probability += 20;
                }
            }

            //check ob Wort nach dem zip Code der Stadt entspricht die im json eingetragen ist
            if (inputLineWords[i - 1] !== undefined) {
                wordBefore = inputLineWords[i - 1].toLowerCase();
                const onlyNumbers = inputLineWords.filter(element => !isNaN(element));
                const onlyFiveDigitNumbers = onlyNumbers.filter(element => element.length === 5 && element >= 10000 && element <= 99999);

                if (postalCode.includes(wordBefore)) {
                    probability += 30;
                } else if (onlyFiveDigitNumbers.includes(wordBefore)) {
                    probability += 20;
                }

                if (
                    wordBefore.toLowerCase().includes("amtsgericht")
                    || wordBefore.toLowerCase().includes("finanzamt")
                ) {
                    probability = 15;
                }
            }

            //checken, ob citys bereits ein Objekt haben, um Doppelungen zu vermeiden
            //hier um InLine Dopplungen rauzufiltern
            let existingObjects = this.citysCheck;
            let inlineExistingObjects = tempCity;

            inlineExistingObjects.forEach((cityObject, index) => {

                if (
                    cityObject.value.toLowerCase() === elementClear.toLowerCase()
                    && cityObject.probability > probability
                ) {
                    probability = 0;
                } else if (
                    cityObject.value.toLowerCase() === elementClear.toLowerCase()
                    && cityObject.probability <= probability
                ) {
                    inlineExistingObjects.splice(index, 1);
                }
            });

            //hier um generelle Dopplungen rauzufiltern
            existingObjects.forEach((cityObject, index) => {

                if (
                    cityObject.value.toLowerCase() === elementClear.toLowerCase()
                    && cityObject.probability > probability
                ) {
                    probability = 0;
                } else if (
                    cityObject.value.toLowerCase() === elementClear.toLowerCase()
                    && cityObject.probability <= probability
                ) {
                    existingObjects.splice(index, 1);
                }
            });

            //output
            if (probability > 100) {
                probability = 100;
            }

            //Ausgabe-Objekt Erstellung, wenn Prob größer 0 und das Element nur erlaubte Wörter enthält
            if (
                probability > 0 
                && this.checkCorrectName(elementClear)
            ) {
                tempCity.push(new CheckResult("city", elementClear, probability));
            } else {
                continue cityLoop;
            }
        }

        return tempCity;
    }

    checkCompanyRegistrationNumber(inputLine) {
        let tempRegistrationNumber = [];
        let inputLineWords = inputLine.split(" ");
        let probability = 0;
        let wordBefore;
        const keywordsDE = ["hrb", "hra", "hrg", "hrm", "handelsregisternummer"];
        const keywordsNL = ["kvk", "handelsregisternummer"];
        const keywordsEN = ["crn", "brn", "cin", "bn", "in", "registration"];
        let keywords = keywordsDE;

        // Auswahl des passenden Arrays
        switch (this.language.languageName) {
            case "de":
                keywords = keywordsDE;
                break;

            case "nl":
                keywords = keywordsNL;
                break;

            case "eng":
                keywords = keywordsEN;
                break;

            default:
                break;
        }

        words: for (let index = 0; index < inputLineWords.length; index++) {
            const element = inputLineWords[index];
            probability = 0;

            //checken, ob im word vor dem element ein bestimmtes Keyword/Blacklist-Wort steht
            if (index !== 0) {
                wordBefore = inputLineWords[index - 1].toLowerCase();

                keywords.forEach(keyword => {
                    if (wordBefore.startsWith(keyword)) {
                        probability += 80;
                    }
                });
            }

            // wenn nach einem keyword noch nummer folgt, das nächste wort nehmen nur nach zahlen überprüfen, wenn keywords enthalten sind
            if (
                element.includes("nummer")
                || element.includes("number")
                && probability == 80
            ) {
                if (index < inputLineWords.length - 1) {
                    const wordAfter = inputLineWords[index + 1].toLowerCase();

                    // überprüfen ob die Ausgabe eine Nummer ist
                    if (
                        isNaN(wordAfter) 
                        && probability == 80
                    ) {
                        continue words;
                    } else {
                        probability += 25;
                    }

                    tempRegistrationNumber.push(new CheckResult(
                        "registrationNumber",
                        wordAfter.replaceAll(",", "").replaceAll(".", ""),
                        probability,
                    ));

                    return tempRegistrationNumber;
                }
                // auch überprüfen ob die Ausgabe eine Nummer ist, nur ein wort vorher
            } else if (!isNaN(element)) {
                probability += 20;
            } else {
                continue words;
            }

            if (probability > 100) {
                probability = 100;
            }

            //Objekt Erstellung / Output            
            if (
                probability > 0 
                && element.length == 5
            ) {
                tempRegistrationNumber.push(new CheckResult(
                    "registrationNumber", element.replaceAll(",", "").replaceAll(".", ""), probability
                ));
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
        let vatIdCountryCode = "de";
        let vatKeywordsNL = ["btw-nr", "omzetbelastingnummer", "vat", "btw-nummer"];
        let vatKeywordsGB = ["vat no.", "vat number"];
        let vatKeywordsDE = ["ust.-idnr.", "umsatzsteuer-id"];
        let vatKeywords = vatKeywordsDE;

        // Auswahl des Keyword Arrays nach Sprache
        switch (this.language.languageName) {
            case "de":
                vatIdCountryCode = "de";
                vatKeywords = vatKeywordsDE;
                break;

            case "eng":
                vatIdCountryCode = "gb";
                vatKeywords = vatKeywordsGB;
                break;

            case "nl":
                vatIdCountryCode = "nl";
                vatKeywords = vatKeywordsNL;
                break;

            default:
                break;
        }

        //checken, ob es mit DE startet und dann DE replacen für den onlyNumbers Array
        for (let index = 0; index < tempInputWords.length; index++) {
            const element = tempInputWords[index].toLowerCase();

            if (element.startsWith(vatIdCountryCode)) {
                tempInputWords[index] = element.replace(vatIdCountryCode, "");
                probability += 10;
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

            if (element.startsWith(vatIdCountryCode)) {
                // Extrahiere die letzten beiden Zeichen des Elements
                const lastTwoCharacters = element.slice(-2);

                // Überprüfe, ob die letzten neun Zeichen Zahlen sind
                if (!isNaN(lastTwoCharacters)) {
                    // Entferne "de" aus dem Element
                    elementReplaced = element.replace(vatIdCountryCode, "");

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
                //checken ob das Wort vorher ein bestimmtes Keyword enthält, um die Probability zu erhöhen bzw. senken.
                vatKeywords.forEach(e => {

                    if (wordBefore.includes(e)) {
                        probability += 70;
                    }
                });

                if (wordBefore.includes("fon") || wordBefore.includes("fax")) {
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
        const numbers = "0123456789";
        const keywordDE = "finanzamt";
        const keywordNL = "belastingkantoor";
        const keywordEN = "tax office";
        let keyword = keywordDE;

        // Auswahl des passenden Keyword für die Sprache
        switch (this.language.languageName) {
            case "de":
                keyword = keywordDE;
                break;

            case "nl":
                keyword = keywordNL;
                break;

            case "eng":
                keyword = keywordEN;
                break;

            default:
                break;
        }

        wordloop: for (let index = 0; index < inputLineWords.length; index++) {
            const element = inputLineWords[index];
            const wordChars = element.split("");

            if (element === keyword) {
                probability += 30;

                this.fetchedCityNames.forEach(element => {
                    if (element === inputLineWords[index + 1]) {
                        probability += 40;
                    }
                });
                // wenn die Sprache englisch ist, da das keyword zwei Wörter sind
            } else if (
                element === keyword.split(" ")[0] 
                && inputLineWords[index + 1] !== 0 
                && inputLineWords[index + 1] === keyword.split(" ")[1]
            ) {
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

            if (
                tempWord.length == 3 
                && tempWord[0].length == 3 
                && tempWord[1].length == 4 
                && tempWord[2].length == 4
            ) {
                probability += 20;

                tempWord.forEach(element => {

                    element.split("").forEach(chars => {

                        if (numbers.includes(chars)) {
                            tempCount++;
                        } else {
                            return tempTax
                        }
                    });
                });

                probability += 10;

                if (tempCount == 11) {
                    tempTax.push(new CheckResult("companyTax", inputLineWords[index], probability));
                }
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

    filterResults(array) {
        let tempArray = [];

        // neuen Array mit elementen befüllen die eine größerer Wkeit als die Übergebne haben
        array.forEach(element => {

            if (element.probability >= this.outputPercentage) {

                if (element.probability > 100) { // Setzt alle Wahrscheinlichkeiten > 100% auf 100% runter
                    element.probability = 100;
                }

                if (this.checkForDuplicates(tempArray, element)) { // element is only added if it does not already exist (no duplicates)
                    tempArray.push(element);
                }
            }
        });

        return tempArray;
    }

    checkForDuplicates(array, object) {

        for (let index = 0; index < array.length; index++) {
            const element = array[index];

            if (element.value === object.value) { // Wenn das Objekt mit dem selben Wert bereits existiert wird false returned
                return false;
            }
        }
        
        return true;
    }
}
