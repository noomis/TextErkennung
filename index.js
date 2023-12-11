let urlValue = [];
let urlProbability = [];
let mailValue = [];
let mailProbability = [];
let companyValue = [];
let companyProbability = [];
let w3wValue = [];
let w3wProbability = [];
let cityValue = [];
let cityProbability = [];

const knownTLD = ["com", "net", "org", "de", "eu", "at", "ch", "nl", "pl", "fr", "es", "info", "name", "email"];


document.getElementById("button").addEventListener("click", function () {
    let text = document.getElementById("text").value;
    text = text.replace(/  +/g, ' ');

    let lines = text.split("\n");

    lines.forEach(element => {

        checkW3W(element); //Luke
        checkUrl(element); //Lars
        checkMail(element); //Simon
        checkCompanyName(element); //Simon
        checkName(element); //Lars
        checkFax(element); //Luke
        checkPhone(element); //Simon
        checkStreet(element); //Luke
        checkCity(element); //Lars

    });
});



function checkW3W(inputLine) {
    let words = inputLine.split(" ");
    inputLine = inputLine.toLowerCase();
    let prob = 0;
    const blacklist = ['!', '@', '#', '$', '%', '^', '&', '*', '(', ')', '_', '-', '+', '=', '{', '}', '[', ']', '|', ';', ':', "'", '"', '<', '>', ',', '?', '`', '~', '0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'ä', 'ü', 'ö'];

    words: for (let i = 0; i < words.length; i++) {
        const element = words[i];
        let countDot = 0;
        let lineChars = words[i].split("");

        // Wörter mit SonderZ überspringen
        for (let b = 0; b < blacklist.length; b++) {
            if (words[i].includes(blacklist[b])) {
                continue words;
            }
        }

        // Url ausschließen
        if (words[i].includes("http") || words[i].includes("https") || words[i].includes("www")) {
            continue;
        }


        lineChars.forEach(e => {
            if (e == ".") {
                countDot++;
            }
        });

        // bei genau zwei Punkten die Zeile dannach aufteilen und die länge der einezelenen Wörter überprüfen
        if (countDot == 2) {
            let wordLength = words[i].split(".");

            for (let t = 0; t < wordLength.length; t++) {
                if (wordLength[t].length < 2) {
                    return;
                } else if (wordLength[t].length <= 44) { // TODO w3w max wort länge
                    prob += 20;
                }
            }
        } else {
            continue;
        }

        // überprüfen ob 2 Punkte
        if (countDot == 2) {
            prob += 20;
        }

        if (i !== 0) {
            let wordBefore = words[i - 1].toLowerCase();
            // Checkt ob vor der w3w z.B. w3w steht.
            if (wordBefore.includes("w3w") || wordBefore.includes("what 3 words") || wordBefore.includes("what3words") ||
                wordBefore.includes("position") || wordBefore.includes("///")) {
                prob += 15;
            }
        }

        if (words[i].startsWith("///")) {
            prob += 5;
        }

        console.log(element + ": ist mit " + prob + "% Wahrscheinlichkeit eine w3w Adresse");
        w3wValue.push(element);
        w3wProbability.push(prob);
    }
}

function checkUrl(inputLine) {
    //alle wörter klein und in neuen array
    inputLine = inputLine.toLowerCase();
    let words = inputLine.split(" ");

    //for-Schleife die alle Worte vom Input durchläuft
    for (let i = 0; i < words.length; i++) {
        const element = words[i];
        let prob = 0;
        for (const tld of knownTLD) {
            if (element.endsWith("." + tld || element.endsWith("." + tld + "/"))) {
                prob += 20;
            }
        }
        //überprüfung ob gewisse Kriterien erfüllt sind
        if (element.startsWith("http")) {
            prob += 30;
        }

        if (element.includes("://") == true) {
            prob += 10;
        }

        if (element.includes("www.") == true) {
            prob += 80;
        }

        if (element.includes("ö") == true || element.includes("ü") == true || element.includes("ß") == true || element.includes("ä") == true || element.includes("@") == true) {
            return
        }

        //Runden

        if (prob > 100) {
            prob = 100;
        }

        if (prob < 0) {
            prob = 0;
        }
        //push in globalen Array
        urlValue.push(element);
        urlProbability.push(prob);
        //output
        if (prob > 0) {
            let indexes = urlValue.indexOf(element);
            console.log('"' + element + '"' + " ist zu " + urlProbability[indexes] + "% eine URL");
        }

    }
}

function checkMail(inputLine) { // Simon
    inputLine = inputLine.toLowerCase();
    let lineWords = inputLine.split(" ");

    wordLoop: for (let index = 0; index < lineWords.length; index++) {
        let wordProb = 0; // Treffer Wahrscheinlichkeit
        let atHit = []; // Anzahl von @ im String
        let dotHit = []; //  Anzahl von . im String
        let hasTLD = false; //  hat TLD Domain

        const element = lineWords[index];
        let wordChars = element.split("");  //Splittet jedes Wort in einzelne Chars

        knownTLD.forEach(tld => {
            if (element.endsWith("." + tld)) {  // Checkt ob TLD vorhanden ist
                hasTLD = true;
            }
        });

        if (element.startsWith('@')) { // Checkt String mit @ beginnt
            continue wordLoop;
        }
        else {
            wordProb += 5;
        }

        if (element.startsWith('.')) { // Checkt String mit @ beginnt
            continue wordLoop;
        }
        else {
            wordProb += 5;
        }

        if (element.length < 6) {   // Checkt ob mindestens 6 Zeichen vorhanden sind
            continue wordLoop;
        }
        else {
            wordProb += 10;
        }

        charLoop: for (let i = 0; i < wordChars.length; i++) {  // Schleife um jeden Character eines Wortes zu durchlaufen
            const element = wordChars[i];


            if (element === "@") {  // countet @
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
        }
        else {
            wordProb += 25;
        }

        if (dotHit.length == 0) {   // checkt ob mindestens ein Punkt vorhanden ist.
            continue wordLoop;
        }
        else {
            wordProb += 5;
        }

        if (dotHit.length > 1) {    // Checkt ob die local domain mindestens 2 Zeichen lang ist.
            if (dotHit[dotHit.length - 1] - atHit[0] < 3) {
                console.log('dotHit[dotHit.length - 1]: ', dotHit[dotHit.length - 1]);
                continue wordLoop;

            }
            else {
                wordProb += 10;
            }
        }
        else if (dotHit.length == 1) {  // Checkt ob die local domain mindestens 2 Zeichen lang ist.
            if (dotHit[0] - atHit[0] < 3) {
                continue wordLoop;
            }
            else {
                wordProb += 10;
            }
        }

        if (hasTLD === false) {         // checkt ob eine TLD vorhanden ist.
            continue wordLoop;
        }
        else {
            wordProb += 20;
        }
        if (index !== 0) {
            let wordBefore = lineWords[index - 1].toLowerCase(); // Checkt ob vor der Mail z.B. Mail: steht.
            if (wordBefore.includes("mail")) {
                wordProb += 20;
            }
        }

        console.log(element + ": ist mit " + wordProb + "% Wahrscheinlichkeit eine Mail");
        mailValue.push(element);
        mailProbability.push(wordProb);
    }

}

function checkCompanyName(inputLine) { // Simon
    let wordProb = 0; // Treffer Wahrscheinlichkeit

    let unternehmensformen = [
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
        "ug"
    ];

    const firmenTitel = ['metzgerei', 'lackierer', 'tiefbau', 'feuerwehr', 'elektro', 'gerüstbau', 'hochbau', 'auto', 'galabau', 'elektriker', 'technik', 'tischlerei', 'reinigungsdienst', 'bauunternehmen', 'autohaus', 'schreinerei', 'friseursalon', 'fliesenleger', 'steuerberater', 'gartenbau', 'heizungsbau', 'sanitärinstallateur', 'baustoffhandel', 'werbeagentur', 'architekturbüro', 'edv-dienstleister', 'druckerei', 'holzbau', 'metallbau', 'malerbetrieb', 'versicherungsmakler', 'schuhgeschäft', 'buchhandlung', 'konditorei', 'baeckerei', 'elektronikladen', 'schneider', 'juwelier', 'haustierbedarf', 'blumenladen', 'optiker', 'hörgeräteakustik', 'spielwarengeschäft', 'fahrschule', 'küchenstudio', 'reisebüro', 'sportgeschäft', 'tankstelle', 'schuhmacher', 'taschengeschäft', 'dachdecker', 'zimmerei', 'fußpflege', 'druckerei', 'fahrradladen', 'elektrogroßhandel', 'lebensmittelmarkt', 'möbelhaus', 'uhrengeschäft', 'solaranlagen', 'baumaschinenverleih', 'tattoostudio', 'hundesalon', 'dönerimbiss', 'bauchladen', 'tauchschule', 'sonnenstudio', 'fotostudio', 'teppichreinigung', 'musikschule', 'modedesigner', 'yogastudio', 'autowerkstatt', 'haustechnik', 'teppichhandel', 'saunaanlagen', 'angelgeschäft', 'schlüsseldienst', 'gitarrenbau', 'fischzucht', 'hochzeitsplanung', 'hutgeschäft', 'schwimmbadtechnik', 'spielzeughersteller', 'hörbuchverlag', 'treppenbau', 'kanzlei', 'autovermietung', 'schraubenhandel', 'apotheken', 'schädlingsbekämpfung', 'vinothek', 'saftladen', 'computerladen', 'spielothek', 'elektronikmarkt', 'kindergarten', 'tanzschule', 'mietkoch', 'papierhandel', 'uhrenwerkstatt', 'stoffgeschäft', 'handyshop', 'kochschule', 'modellbau', 'goldschmied', 'floristik', 'brautmoden', 'schausteller', 'wassersport', 'segelschule', 'surfschule', 'angeln', 'haushaltswaren', 'kinderschuhladen', 'brennholzhandel', 'kaminbau', 'fotograf', 'gärtnerei', 'bioladen', 'schuhreparatur', 'mietrechtsschutz', 'müllentsorgung', 'baumschule', 'schwimmbadbau', 'catering', 'beauty-salon', 'biogasanlage', 'datenrettung', 'zeltverleih', 'videoproduktion', 'teppichhandel', 'tontechnik', 'wäscherei', 'tischlerei', 'teigwarenhersteller', 'touristik', 'taschenhersteller', 'stickerei', 'segelmacher', 'schwimmbadtechnik', 'segway-verleih', 'rolladenbau', 'reinigungsdienst', 'reiseveranstalter', 'rechtsanwalt', 'reifenservice', 'regalsysteme', 'pizzabringdienst', 'pflanzenhandel', 'pediküre', 'patisserie', 'partyservice', 'parkettverleger', 'papiergroßhandel', 'outdoorladen', 'online-marketing', 'optikergeschäft', 'orthopädietechnik', 'ölhandel', 'obstgroßhandel', 'nähmaschinenreparatur', 'motorradwerkstatt', 'mosaikleger', 'möbeltransport', 'modellflug', 'modellbahn', 'mobilfunk', 'möbeltischlerei', 'milchhandel', 'mietwagen', 'metallhandel', 'massagestudio', 'markisenbau', 'maniküre', 'malermeister', 'malerbetrieb', 'makler', 'luftaufnahmen', 'lkw-vermietung', 'lkw-werkstatt', 'logistik', 'lebensmittelhandel', 'landwirtschaft', 'lampenladen', 'laminatverleger', 'kühlhaus', 'küchenplanung', 'küchenstudio', 'küchenmontage', 'kosmetikinstitut', 'konditorei', 'kochstudio', 'kiosk', 'kinderbetreuung', 'kindermode', 'kinderzahnarzt', 'kinderarzt', 'kinderwunschzentrum', 'kinderkrippe', 'kinderpsychologe', 'kinesiologie', 'kimono-shop', 'kino', 'kiosk', 'kirchenmusik', 'kirchengemeinde', 'kiteschule', 'kletterhalle', 'konditorei', 'kosmetikstudio', 'krankenhaus', 'kunsthandel', 'kunstschule', 'kunststoffverarbeitung', 'künstleragentur', 'küchenstudio', 'kutschenverleih', 'labordienst', 'lackiererei', 'landgasthof', 'landwirtschaft', 'lebensberatung', 'lebensmittelgroßhandel', 'lebensmittelhandel', 'lebensmittelhersteller', 'lederwaren', 'lehrer', 'lerntherapie', 'lingerie-shop', 'logistikunternehmen', 'lottoladen', 'luxusuhren', 'makler', 'marketingagentur', 'massagepraxis', 'möbelhaus', 'müllabfuhr', 'müllentsorgung', 'müllverwertung', 'museum', 'musikgeschäft', 'musiklehrer', 'musikschule', 'musikstudio', 'nagelstudio', 'nahrungsergänzung', 'naturheilpraxis', 'neurologe', 'notar', 'nudelhersteller', 'ölhandel', 'obsthof', 'optiker', 'orthopäde', 'orthopädieschuhtechnik', 'packaging-design', 'papiergroßhandel', 'partyservice', 'personalberatung', 'pfandhaus', 'pflegeheim', 'pflasterarbeiten', 'pflanzenhandel', 'pflegedienst', 'physiotherapie', 'pianohaus', 'pilzzucht', 'pizza-lieferdienst', 'planungsbüro', 'polsterer', 'pr-agentur', 'pralinenhersteller', 'private-krankenversicherung', 'privatschule', 'psychiater', 'psychologe', 'psychosoziale-beratung', 'puppentheater', 'putzfrau', 'radiosender', 'rechtsanwalt', 'rechtsanwältin', 'reifenservice', 'reinigungsservice', 'reiseagentur', 'reisebüro', 'reiseveranstalter', 'reiseversicherung', 'reitsportgeschäft', 'relaxsessel', 'rentenberatung', 'restaurant', 'restauration', 'retail-design', 'rezepturenentwicklung', 'rollstuhlbau', 'rückentraining', 'saftbar', 'schauspieler', 'schlüsseldienst', 'schneiderei', 'schnittblumen', 'schokoladenhersteller', 'schornsteinfeger', 'schreibwarenhandel', 'schreinerei', 'schrottentsorgung', 'schuhgeschäft', 'schuldnerberatung', 'schwimmbadtechnik', 'schwimmschule', 'segelbootverleih', 'segelflugplatz', 'segelschule', 'sehenswürdigkeit', 'sekretariatsservice', 'selbsthilfegruppe', 'seniorendienstleistung', 'seniorenheim', 'seniorenpflege', 'shisha-bar', 'shopfitting', 'sicherheitsdienst', 'siedlungswasserwirtschaft', 'solaranlagen', 'sonnenstudio', 'sozialamt', 'sozialberatung', 'sozialdienst', 'sozialkaufhaus', 'sozialpädagogik', 'sozialpsychiatrischer-dienst', 'sozialstation', 'sozialtherapie', 'spedition', 'spielhalle', 'spielplatzbau', 'spielzeugladen', 'sportanlagenbau', 'sportartikelhersteller', 'sportgeschäft', 'sportlerheim', 'sportsbar', 'sportverein', 'stadtführung', 'stahlbau', 'staubsaugervertretung', 'steuerberatung', 'steuerberater', 'steuerfachangestellter', 'stoffgeschäft', 'straßenbau', 'stuckateur', 'studentenwohnheim', 'studienberatung', 'subunternehmen', 'supermarkt', 'sushi-bar', 'tanzschule', 'tapetenhandel', 'tattooentfernung', 'tattoostudio', 'tauchschule', 'taxiunternehmen', 'teichbau', 'teigwarenhersteller', 'telemarketing', 'telekommunikationsunternehmen', 'textildruck', 'textilveredelung', 'textilgroßhandel', 'textilhandel', 'theater', 'theaterkasse', 'theaterwerkstatt', 'therapeut', 'tierarzt', 'tierbestattung', 'tierfutterhandel', 'tierpension', 'tierpsychologie', 'tierschutzverein', 'tischlerei', 'tofuhersteller', 'tonstudio', 'touristikunternehmen', 'toyota-händler', 'traditionsunternehmen', 'trainingszentrum', 'transportunternehmen', 'treppenbau', 'trockenbau', 'trockenfrüchtehandel', 'trockenreinigung', 'trödelmarkt', 'tuningwerkstatt', 'uhrengeschäft', 'uhrenhandel', 'uhrenreparatur', 'uhrenwerkstatt', 'umzugsunternehmen', 'unternehmensberater', 'unternehmerverband', 'unterwäschehersteller', 'urlaubsbauernhof', 'us-car-vermietung', 'us-car-werkstatt', 'us-import', 'us-restaurant', 'us-shop', 'us-sportwagenvermietung', 'us-truck-vermietung', 'us-truck-werkstatt', 'us-tuning', 'uscar-handel', 'uscar-händler', 'uscar-import', 'uscar-reparatur', 'uscar-restauration', 'uscar-tuning'];

    inputLine = inputLine.toLowerCase();

    let lineWords = inputLine.split(" ");

    wordLoop: for (let index = 0; index < lineWords.length; index++) {
        const element = lineWords[index];

        unternehmensformen.forEach(unternehmensform => {
            if (element == unternehmensform) {
                wordProb += 50;
            }
        });
    }



    firmenTitel.forEach(element => {
        if (inputLine.includes(element)) {
            console.log('element: ', element);
            wordProb += 50;


        }
    });


    if (wordProb >= 50) {
        console.log(inputLine + " ist mit " + wordProb + "% Wahrscheinlichkeit ein Firmenname");
        companyValue.push(inputLine);
        companyProbability.push(wordProb);
    }


}

function checkName(inputLine) {
    //Lars
}

function checkFax(inputLine) {
    let fullNumber = "";
    inputLine = inputLine.toLowerCase();
    let words = inputLine.split(" ");
    let prob = 0;
    let stringBlacklist = "abcdefghijklmnopqrstuvwxyzäöü@#$!%^&*_={}[]|;:<>,?";
    const blacklist = stringBlacklist.split("");

    words: for (let i = 0; i < words.length; i++) {
        // Checkt ob vor der nummer z.B. fax steht
        for (let b = 0; b < blacklist.length; b++) {
            if (words[i].includes(blacklist[b])) {
                console.log(fullNumber + ": ist mit " + prob + "% Wahrscheinlichkeit eine fax Nummer");
                fullNumber = "";
                continue words;
            }
        }
        // vorher nach fax schauen und dannach nach weiteren ziffern ohne max length zu überschreiten
        if (i !== 0) {
            let wordBefore = words[i - 1].toLowerCase();
            if (wordBefore.includes("fax")) {
                prob += 70;
            } else if (wordBefore.includes("tel")) {
                return;
            }
        }
        // Checkt ob nach der nummer noch eine Nummer steht
        if (words[i].length + fullNumber.length < 20) {
            fullNumber += words[i];
        }
        let tmpFullNum = fullNumber;
        tmpFullNum = tmpFullNum.replaceAll("+", "").replaceAll("/", "").replaceAll("-", "").replaceAll(".", "");
        if (tmpFullNum.length > 5 && tmpFullNum.length < 33) {
            prob += 30;
        }
    }
    console.log(fullNumber + ": ist mit " + prob + "% Wahrscheinlichkeit eine fax Nummer");
}



function checkPhone(inputLine) {
    //Simon
}

function checkStreet(inputLine) {
    //Luke
}

function checkCity(inputLine) {
    inputLine = inputLine.toLowerCase();
    let words = inputLine.split(" ");
   for (let a = 0; a < words.length; a++) {
    const element = words[a];
       if(element.startsWith("d-")) {
        words[a] = element.replace("d-", "");
       }
   }
    const nurZahlen = words.filter(element => !isNaN(element));
    const allZipCodes = [];
    const allCityNames = [];
    let city = 0;
    let cityName = 0;
    let prob = 0;
    fetch('georef-germany-postleitzahl.json')
        .then(response => response.json())
        .then(data => {
            data.forEach(datensatz => {
                allZipCodes.push(('PLZ:', datensatz.name));
                allCityNames.push(('Stadt:', datensatz.plz_name));
            });
            zipLoop: for (let i = 0; i < nurZahlen.length; i++) {
                const element = nurZahlen[i];
                if (element.length === 5) {
                    if (allZipCodes.includes(element)) {
                        prob += 60;
                         city = allZipCodes.indexOf(element);
                         cityName = allCityNames[city];
                        if(words[i+1] !== "null") {
                            let wordAfter = words[i + 1]; 
                            if (wordAfter.includes(cityName.toLowerCase())) {
                                prob = 100;
                            }}
                        }
                    }
                    else {
                        continue zipLoop;
                    }
                    if (prob > 0) {
                    cityValue.push(element);
                    cityProbability.push(prob);
                    console.log(element + " " + cityName + " ist zu " + prob + "% eine Postleitzahl mit Ort/Stadt");
                    }
                }

            })
        .catch(error => {
            console.error('Fehler beim Laden der JSON-Datei:', error);
        });
}
