let urlValue = [];
let urlProbability = [];
let mailValue = [];
let mailProbability = [];
let companyValue = [];
let companyProbability = [];
let w3wValue = [];
let w3wProbability = [];
let zipValue = [];
let zipProbability = [];
let nameValue = [];
let nameProbability = [];
let telValue = [];
let telProbability = [];
let faxValue = [];
let faxProbability = [];

let timeoutId;

const knownTLD = ["com", "net", "org", "de", "eu", "at", "ch", "nl", "pl", "fr", "es", "info", "name", "email", "co"];
const allZipCodes = [];
const allCityNames = [];

document.getElementById("text").addEventListener("input", printResult);

function printResult() {

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {



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

        let maxMailProb = findMaxIndex(mailProbability);
        let maxMailValue = mailValue[maxMailProb];
        console.log('maxMailValue: ', maxMailValue);

        let maxW3WProb = findMaxIndex(w3wProbability);
        let maxW3WValue = w3wValue[maxW3WProb];
        console.log('maxW3WValue: ', maxW3WValue);

        let maxUrlProb = findMaxIndex(urlProbability);
        let maxUrlValue = urlValue[maxUrlProb];
        console.log('maxUrlValue: ', maxUrlValue);

        let maxCompanyProb = findMaxIndex(companyProbability);
        let maxCompanyValue = companyValue[maxCompanyProb];
        console.log('maxCompanyValue: ', maxCompanyValue);

        let maxFaxProb = findMaxIndex(nameProbability);
        let maxFaxValue = faxValue[maxFaxProb];
        console.log('maxFaxValue: ', maxFaxValue);

        let maxPhoneProb = findMaxIndex(telProbability);
        let maxPhoneValue = telValue[maxPhoneProb];
        console.log('maxPhoneValue: ', maxPhoneValue);

        let maxCityProb = findMaxIndex(zipProbability);
        let maxzipValue = zipValue[maxCityProb];
        console.log('maxzipValue: ', maxzipValue);

        $("#email").val(maxMailValue);
        $("#companyname").val(maxCompanyValue);
        $("#zipcode").val(maxzipValue);
        $("#website").val(maxUrlValue);
        $("#phone").val(maxPhoneValue);
        $("#fax").val(maxFaxValue);

    }, 2000);




    urlValue = [];
    urlProbability = [];
    mailValue = [];
    mailProbability = [];
    companyValue = [];
    companyProbability = [];
    w3wValue = [];
    w3wProbability = [];
    zipValue = [];
    zipProbability = [];
    nameValue = [];
    nameProbability = [];
    telValue = [];
    telProbability = [];
    faxValue = [];
    faxProbability = [];
}


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
            if (element.includes("." + tld)) {
                prob += 10
            }
        }
        //überprüfung ob gewisse Kriterien erfüllt sind
        if (element.startsWith("http")) {
            prob += 30;
        }

        if (element.includes("://")) {
            prob += 10;
        }

        if (element.includes("www.")) {
            prob += 80;
        }

        if (i !== 0) {
            let wordBefore = words[i - 1].toLowerCase();
            // Checkt ob vor der URL bestimmte Keywords stehen
            if (wordBefore.includes("url") || wordBefore.includes("website") || wordBefore.includes("homepage") || wordBefore.includes("internet")) {
                prob += 20;
            }
        }

        if (element.includes("ö") || element.includes("ü") || element.includes("ß") || element.includes("ä") || element.includes("@")) {
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
      
        //output
        if (prob > 0) {
            let indexes = urlValue.indexOf(element);
            console.log('"' + element + '"' + " ist mit " + urlProbability[indexes] + "% Wahrscheinlichkeit eine URL");
            urlValue.push(element);
            urlProbability.push(prob);
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

        if (element.includes('@')) { // Checkt String mit @ beginnt
            return;
        }

        unternehmensformen.forEach(unternehmensform => {
            if (element == unternehmensform) {
                wordProb += 50;
            }
        });
    }





    firmenTitel.forEach(element => {
        if (inputLine.includes(element)) {
            // console.log('element: ', element);
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
    const vornamen = ["Ben", "Paul", "Leon", "Finn", "Kai", "Dirk", "Volker", "Joachim", "Sandra", "Anke", "Rudolf", "Wolfram", "Isabell", "Rosemarie", "Martina", "Hans", "Anja", "Jörg", "Petra", "Verena", "Michael", "Yvonne", "Günther", "Eva", "Roland", "Susanne", "Axel", "Ingrid", "Babara", "Fynn", "Matthias", "Christoph", "Peter", "Elias", "Thomas", "Ursula", "Elon", "Stefan", "Olaf", "Jennifer", "Steffen", "Joe", "Angela", "Jonas", "Gerd", "Franz", "Wilhelm", "Jürgen", "Josef", "Hans", "Noah", "Luis", "Louis", "Maximilian", "Felix", "Luca", "Luka", "Tim", "Emil", "Oskar", "Oscar", "Henry", "Moritz", "Theo", "Theodor", "Anton", "David", "Niklas", "Andreas", "Brigitte", "Karl-Heinz", "Karen", "Jens", "Ralf", "Ann-Kristin", "Nicolas", "Philipp", "Samuel", "Fabian", "Leo", "Frank", "Sabine", "Simone", "Markus", "Marcus", "Clemens", "Monika", "Ingo", "Regina", "Uwe", "Dorothee", "Gabriele", "Jonathan", "Carl", "Karl", "Alexander", "Jakob", "Vincent", "Simon", "Aaron", "Emiliano", "Julius", "Matteo", "Raphael", "Valentin", "Johann", "Finnian", "Daniel", "Gabriel", "Richard", "Max", "Adrian", "Sebastian", "Tobias", "Liam", "Joshua", "Reiner", "Sven", "Rainer", "Melanie", "Heike", "Hannelore", "Ernst", "Dietmar", "Werner", "Renate", "Justin", "Jonah", "Yannick", "Bruno", "Milan", "Rafael", "Leonhard", "Timon", "Adam", "Fabio", "Leonard", "Henryk", "Erik", "Silas", "Jannik", "Jasper", "Nico", "Lenny", "Colin", "Tom", "Bastian", "Damian", "Jasper", "Silas", "Lennard", "Finnegan", "Malte", "Aaron", "Jannis", "Elias", "Paul", "Samuel", "Victor", "Jonathan", "Nick", "Alexander", "Malte", "Florian", "Noah", "Eric", "Oliver", "Matteo", "Theodor", "Niklas", "Jan-Stephan", "Gustav", "Marius", "Arne", "Frederik", "Julius", "Emil", "Theo", "Elias", "Jasper", "Luis", "Gustav", "Florian", "Lias", "Aaron", "Tilo", "Mathis", "Janosch", "Lennert", "Jeremy", "Leopold", "Marius", "Valentin", "Julius", "Julian", "Melvin", "Laurin", "Nils", "Oliver", "Jaron", "Laurin", "Leif", "Florian", "Jaron", "Leonard", "Silvan", "Levin", "Ole", "Henri", "Johann", "Lars", "Luke", "Lukas", "Lucas", "Friedhelm", "Ludwig", "Valentin", "Mattis", "Justus", "Constantin", "Maxim", "Leonard", "Friedrich", "Theodor", "Maximilian", "Leander", "Lias", "Christian", "Elias", "Colin", "Thilo", "Emma", "Mia", "Hannah", "Hanna", "Emilia", "Sophia", "Sofia", "Lina", "Marie", "Mila", "Ella", "Lea", "Clara", "Klara", "Lena", "Leni", "Luisa", "Louisa", "Anna", "Laura", "Lara", "Maja", "Maya", "Amelie", "Johanna", "Nele", "Charlotte", "Jana", "Mara", "Frieda", "Mira", "Paula", "Alina", "Lotta", "Greta", "Nina", "Matilda", "Mathilda", "Rosa", "Fiona", "Sarah", "Sara", "Emelie", "Zoe", "Isabella", "Melina", "Ida", "Frida", "Julia", "Eva", "Amelia", "Tilda", "Anni", "Liv", "Ava", "Victoria", "Lucy", "Helen", "Helena", "Elif", "Aaliyah", "Elsa", "Julie", "Stella", "Leona", "Juna", "Mina", "Jara", "Elina", "Nela", "Nora", "Emma", "Zara", "Elena", "Malia", "Aria", "Mira", "Elisa", "Aurora", "Enna", "Ronja", "Nora", "Elin", "Emmy", "Ivy", "Ella", "Anastasia", "Josephine", "Jasmin", "Amira", "Emmi", "Merle", "Joline", "Carolin", "Estelle", "Leila", "Kiara", "Romy", "Elif", "Tara", "Joana", "Klara", "Lotte", "Marlene", "Magdalena", "Lia", "Annika", "Liana", "Liselotte", "Katharina", "Rosalie", "Enya", "Selma", "Hedda", "Luise", "Louise", "Pia", "Elisabeth", "Malin", "Leana", "Yara", "Alma", "Carlotta", "Jolina", "Elsa", "Cara", "Lavinia", "Milla", "Josephina", "Marla", "Malou", "Johanna", "Luisa", "Louisa", "Juliana", "Malia", "Paulina", "Carla", "Alessia", "Valentina", "Nova", "Mila", "Alexandra", "Antonia", "Anita", "Joleen", "Jara", "Annabelle", "Kira", "Liana", "Svenja", "Melissa", "Delia", "Elif", "Luana", "Anni", "Tessa", "Rosie", "Esma", "Leticia", "Eleni", "Carolina", "Anya", "Louna", "Kim", "Livia", "Fenja", "Thea", "Juna", "Selina", "Celine", "Alessa", "Rosa", "Evelyn", "Alissa", "Hanna", "Mara", "Cassandra", "Viola", "Elena", "Valeria", "Kiana", "Helena", "Sofie", "Lana", "Nina", "Alessandra", "Eveline", "Anika", "Luna", "Anouk", "Paulina", "Felicitas", "Rieke", "Lotte", "Yuna", "Jette", "Antonia", "Jolene", "Felina", "Miley", "Anisa", "Martha", "Ava", "Philippa", "Edda", "Karolina", "Linda", "Greta", "Ella", "Larissa", "Vanessa", "Esther", "Elena", "Nola", "Lucia", "Elaine", "Flora", "Lola", "Rosalie", "Lena", "Alia", "Elina", "Mina", "Luisa/Louisa", "Carolina", "Tamara", "Annabelle", "Elisa", "Nina", "Johanna", "Leonie", "Jolie", "Rieke", "Anastasia", "Lotte", "Lynn", "Josefine", "Lotta", "Leona", "Johanna", "Lorena", "Marie", "Pia", "Leni", "Paulina", "Lotte", "Maja/Maya", "Larissa", "Nora", "Amalia", "Mira", "Alexandra", "Louisa", "Lara", "Greta", "Ella", "Marlene", "Mila", "Elif", "Kiara", "Mina", "Lucia", "Maya", "Zara", "Liv", "Aurora", "Nela", "Sophie", "Emilia", "Tara", "Helena", "Leonie", "Lina", "Jasmin", "Lieselotte", "Stella", "Yara", "Mira", "Mina", "Nina", "Emma", "Liam", "Olivia", "Noah", "Ava", "Isabella", "Sophia", "Jackson", "Mia", "Lucas", "Oliver", "Aiden", "Charlotte", "Harper", "Elijah", "Amelia", "Abigail", "Ella", "Leo", "Grace", "Mason", "Evelyn", "Logan", "Avery", "Sofia", "Ethan", "Lily", "Aria", "Hazel", "Zoe", "Alexander", "Madison", "Luna", "Mateo", "Chloe", "Nora", "Zoey", "Mila", "Carter", "Eli", "Aubrey", "Ellie", "Scarlett", "Jaxon", "Maya", "Levi", "Elena", "Penelope", "Aurora", "Samuel", "Cora", "Skylar", "Carson", "Sadie", "Nathan", "Kinsley", "Anna", "Elizabeth", "Grayson", "Camila", "Lincoln", "Asher", "Aaliyah", "Callie", "Xavier", "Luke", "Madelyn", "Caleb", "Kai", "Isaac", "Bella", "Zara", "Landon", "Matthew", "Lucy", "Adrian", "Joseph", "Stella", "Mackenzie", "Kailey", "Nolan", "Eleanor", "Samantha", "Dylan", "Leah", "Audrey", "Aaron", "Jasmine", "Tyler", "Easton", "Hudson", "Bailey", "Alice", "Layla", "Eliana", "Brooklyn", "Jackson", "Bentley", "Trinity", "Liliana", "Claire", "Adeline", "Ariel", "Jordyn", "Emery", "Max", "Naomi", "Eva", "Paisley", "Brody", "Kennedy", "Bryson", "Nova", "Emmett", "Kaylee", "Genesis", "Julian", "Elliot", "Piper", "Harrison", "Sarah", "Daisy", "Cole", "Kylie", "Serenity", "Jace", "Elena", "Ruby", "Camden", "Eva", "Delilah", "John", "Liam", "Catherine", "Madeline", "Isla", "Jordan", "Julia", "Sydney", "Levi", "Alexa", "Kinsley", "Hayden", "Gianna", "Everly", "Alexis", "Jaxson", "Isabelle", "Allison", "Alyssa", "Elias", "Brynn", "Leilani", "Alexandra", "Kayla", "Gracie", "Lucia", "Reagan", "Valentina", "Brayden", "Jocelyn", "Molly", "Kendall", "Blake", "Diana", "Isabel", "Zachary", "Emilia", "Lilah", "David", "Charlie", "Charlie", "Eliana", "Ryder", "Lydia", "Nevaeh", "Savannah", "Zayden", "Sydney", "Amaya", "Nicole", "Caroline", "Jaxon", "Natalia", "Jayden", "Mila", "Lincoln", "Nash", "Emilia", "Peyton", "Annabelle", "Zane", "Zoey", "Elena", "Hannah", "Lyla", "Christian", "Lily", "Violet", "Sophie", "Bentley", "Kai", "Jasmine", "Skylar", "Bella", "Penelope", "Alexandra", "Joseph", "Khloe", "Rebecca", "Leo", "Luna", "Alina", "Ashley", "Audrey", "Riley", "Alexa", "Parker", "Adeline", "Leon", "Lucy", "Taylor", "Maria", "Evan", "Chase", "Eva", "Maya", "Kayla", "Mia", "Naomi", "Ryder", "Peyton", "Eli", "Zoe", "Zara", "Mateo", "Ellie", "Julian", "Christopher", "Aiden", "Emma", "Evelyn", "Layla", "Sophia", "Grace", "Benjamin", "Harper", "Mila", "Eleanor", "Carter", "Amelia", "Ella", "Jackson", "Oliver", "Charlotte", "Ava", "Lucas", "Liam", "Abigail", "Avery", "Ethan", "Aria", "Scarlett", "Chloe", "Hazel", "Mason", "Emma", "Zoey", "Aiden", "Penelope", "Claire", "Lily", "Isabella", "Daniel", "Nora", "Madison", "Grace", "Luna", "Mia", "Lily", "Zoe", "Layla", "Ariana", "Aubrey", "Liam", "Eli", "Alexander", "Sebastian", "Aria", "Scarlett", "Victoria", "Lucy", "Mila", "Emily", "Levi", "Avery", "Ella", "Abigail", "Evelyn", "Sophia", "James", "Ben", "Wilhelm", "Friedrich", "Heinrich", "Karl", "Johann", "Georg", "Ludwig", "Ernst", "Otto", "Heinrich", "Hans", "Fritz", "Paul", "Max", "Albert", "August", "Richard", "Walter", "Hermann", "Gustav", "Rudolf", "Anton", "Franz", "Emil", "Adolf", "Oskar", "Gottfried", "Eduard", "Kurt", "Klaus", "Theodor", "Alfred", "Friedrich", "Hugo", "Arthur", "Gerhard", "Werner", "Erwin", "Berthold", "Helmut", "Konrad", "Wolfgang", "Arnold", "Rolf", "Ulrich", "Dieter", "Erich", "Günther", "Hans-Jürgen", "Winfried", "Willi", "Rolf", "Helmut", "Reinhard", "Gerd", "Manfred", "Jürgen", "Hubert", "Friedhelm", "Gustav", "Ludwig", "Karl-Heinz", "Otto", "Karl-Friedrich", "Hans-Dieter", "Heinz", "Ernst", "Walter", "Rudolf", "Herbert", "Klaus-Dieter", "Wolfram", "Friedrich-Wilhelm", "Ewald", "Egon", "Wilfried", "Norbert", "Karl-Heinz", "Gerhard", "Hans-Peter", "Dieter", "Werner", "Alfred", "Helmut", "Walter", "Heinz", "Kurt", "Hans-Joachim", "Günther", "Ernst", "Rainer", "Bernd", "Hans-Jürgen", "Wilhelm", "Joachim", "Friedrich", "Karl", "Klaus", "Reinhard", "Heinz", "Karl-Heinz", "Peter", "Jürgen", "Helmut", "Werner", "Rolf", "Günter", "Fritz", "Wolfgang", "Alfred", "Erich", "Karl-Friedrich", "Gustav", "Dieter", "Friedhelm", "Hans-Dieter", "Gerd", "Herbert", "Ludwig", "Ulrich", "Winfried", "Hans-Joachim", "Reiner", "Günther", "Manfred", "Rudolf", "Berthold", "Eduard", "Franz", "Heinrich", "Friedrich-Wilhelm", "Wilfried", "Klaus-Dieter", "Werner", "Erwin", "Wolfram", "Rainer", "Ernst", "Hubert", "Hans-Peter", "Joachim", "Norbert", "Arthur", "Karl-Heinz", "Heinz", "Otto", "Egon", "Ewald", "Kurt", "Hans", "Gustav", "Wilhelm", "Franz", "Ernst", "Heinrich", "Hermann", "Karl", "Friedrich", "Ludwig", "Alfred", "Otto", "Walter", "Richard", "Wilhelm", "Hans", "Fritz", "Paul", "Max", "Albert", "August", "Theodor", "Werner", "Friedrich", "Hugo", "Arthur", "Erwin", "Gerhard", "Eduard", "Kurt", "Heinz", "Erich", "Günther", "Hans-Jürgen", "Winfried", "Willi", "Helmut", "Reinhard", "Gerd", "Manfred", "Jürgen", "Karl-Heinz", "Hubert", "Friedhelm", "Gustav", "Ludwig", "Ewald", "Egon", "Wilfried", "Karl", "Franz", "Peter", "Wolfgang", "Ulrich", "Dieter", "Klaus-Dieter", "Heinz", "Karl-Friedrich", "Hans-Dieter", "Wolfram", "Friedrich-Wilhelm", "Ernst", "Erich", "Günter", "Rainer", "Bernd", "Herbert", "Hans-Joachim", "Wilhelm", "Joachim", "Friedrich", "Karl", "Klaus", "Reinhard", "Heinz", "Karl-Heinz", "Peter", "Jürgen", "Helmut", "Werner", "Rolf", "Günter", "Fritz", "Wolfgang", "Alfred", "Erich", "Karl-Friedrich", "Gustav", "Dieter", "Friedhelm", "Hans-Dieter", "Gerd", "Herbert", "Ludwig", "Ulrich", "Winfried", "Hans-Joachim", "Reiner", "Günther", "Manfred", "Rudolf", "Berthold", "Eduard", "Franz", "Heinrich", "Friedrich-Wilhelm", "Wilfried", "Klaus-Dieter", "Werner", "Erwin", "Wolfram", "Rainer", "Ernst", "Hubert", "Hans-Peter", "Joachim", 'Jörg', 'Hermann', 'Ulrich', 'Roland', 'Frank', 'Cord', 'Ralf', 'Sascha', 'Andreas', 'Heiko', 'Christoph', 'Kerstin', 'Christian', 'Lucas', 'Axel', 'Dirk', 'Hans-Gerd', 'Thomas', 'Norman', 'Karsten', 'Regina', 'Werner', 'Daniel', 'Leendert', 'Anton', 'Joachim', 'Alexander', 'Bastian', 'Horst', 'Sven', 'Dieter', 'Araik', 'Hans-Jürgen', 'Jens', 'Jan', 'Matthias', 'Toni', 'Erika', 'Dipl. Ing. Elmar', 'Ludger', 'Mark', 'Guido', 'Dennis', 'Marcel', 'Björn', 'Hans-Hermann', 'Monze', 'Walter', 'Maik', 'Thorsten', 'Nadine', 'Ulf', 'Meinhard', 'Johann', 'Gerhard', 'Tibor', 'Wilhelm', 'Ernst-Christian', 'Maja', 'Wolfgang', 'Jana', 'Otto', 'Franz', 'Andre', 'Bertholt', 'Klaus', 'Lukas', 'Stephan', 'Knut', 'Burghart', 'Torsten', 'Thijs Petrus Antonius', 'Hans', 'Ernst', 'Erich', 'Vinzenz', 'Volker', 'Uwe', 'Hans-Joachim', 'Detlef', 'Hinnerk', 'Bernd', 'Gernot', 'Peter', 'Markus', 'Claus', 'Armin', 'Otto Johann', 'Kurt-Egon', 'Dan', 'Timo', 'Kai', 'Herbert', 'Hilmar', 'Rainer', 'Sören', 'Gunnar', 'Nico', 'Tim', 'Christine', 'Cengiz', 'Nicolas', 'Jürgen', 'Josef', 'Raphael', 'Heinrich', 'Lüder', 'Harald', 'Helmuth', 'Savino', 'Julian', 'Carsten', 'Bernhard', 'Simon', 'Patrick', 'Rolf', 'Urs', 'Ewald', 'Jörn', 'Stefan', 'Mirco', 'Emanuel', 'Cristian-Valentin', 'Talha', 'Christina', 'Andrey', 'Henning', 'Heike', 'Marcus', 'Johannes', 'Ingo', 'Ina', 'Philipp', 'Mirko', 'Tore', 'Anja', 'Olaf', 'Fridel', 'Cornelia', 'Sandra', 'Martin', 'Monika', 'Tanja', 'Jessica', 'Marc', 'Rowena', 'Erik', 'Lasse', 'Benedikt', 'Heiner', 'Ansgar', 'Linda', 'Sebastian', 'Michaela', 'David', 'Anne', 'Stanislavas', 'Swantje', 'Petra', 'Melanie', 'Maren', 'Friedhelm', 'Lothar', 'Sarah', 'Manfred', 'Mandred', 'Günter', 'Florian', 'Thore', 'Doris', 'Anneliese', 'Beate', 'Oliver', 'Phillip', 'Bianca', 'Marion', 'Katharina', 'Kathrin', 'Michele', 'Nina', 'Günther', 'Corinna', 'Kolja Ole', 'Helmut', 'Ilka', 'Mario', 'Helge', 'Lena', 'Jathavan', 'Karl', 'Julia', 'Martina', 'Reinhard', 'Dörk', 'Andrea', 'Achim', 'Bettina', 'Carina', 'Lars', 'Paul', 'Bodo', 'Lambert', 'Yvonne', 'Constanze', 'Rüdiger', 'Arthur', 'Wolny', 'Ronja', 'Annett', 'Kornelia', 'Friedrich', 'Ruth', 'Georg', 'Birgit', 'Siegfried', 'Eva-Maria', 'Frederik', 'Steffen', 'Holger', 'Milan', 'Miriam', 'Jakob', 'Viktor', 'Jaqueline', 'Sabine', 'Nils', 'Lisa', 'Leo', 'Berthold', 'Fatih', 'Sabrina', 'Luca', 'Heino', 'Sergey', 'Verena', 'Robert', 'Klaus-Dieter', 'Jochen', 'Igor', 'Kristina', 'Denis', 'Enes', 'Fait', 'Mathias', 'Henner', 'Ulla', 'Elke', 'Wilfried', 'Rene', 'Hubert', 'Willi', 'Roderik', 'Udo', 'Monique', 'Marco', 'Enrico', 'Richard', 'Jonas', 'Otmar', 'Tobias', 'Boris', 'Nicole', 'Elmar', 'Immo', 'Frederick', 'Margit', 'Hans-Jörg', 'Jordan', 'Lutz', 'Heinz', 'Justas', 'Detlev', 'Reimer', 'Gerald', 'Rita', 'Emil', 'Pascal', 'Karl-Hans', 'Benno', 'Ralph', 'Thilo', 'Murat', 'Denise', 'Danila', 'Ömür', 'Katja', 'Christof', 'Berndt', 'Norbert', 'Freddy', 'Ursula', 'Heinz Willi', 'Frederic', 'Ralf-Peter', 'Sylvia', 'Alois', 'Carl', 'Bert', 'Iris', 'Benjamin', 'Arne', 'Jan-Hermann', 'Sybille', 'Ute', 'Fabian', 'Sotirios', 'Khanh', 'Annette', 'Nadja', 'Antonius', 'Geigle', 'Chiara', 'Lucien', 'Beata', 'Reiner', 'Ramon', 'Hüsniye', 'Mijo', 'Erwin', 'Rogerio', 'Mike', 'Benny', 'Ludwig', 'Roger', 'Herge', 'Niklas', 'Andres', 'Roxanne', 'Othmar', 'Cyril', 'Karl-Heinz', 'Stefanie', 'Burkhard', 'Angelus', 'Pierre', 'Götz', 'Tilmann', 'Claudia', 'Ronald', 'Tammo', 'Dietmar', 'Rico', 'Dejan', 'Dainius', 'Silvio', 'Vitalij'];
    const nachnamen = ["Müller", "Schmidt", "Schneider", "Fischer", "Meyer", "Meier", "Mayer", "Maier", "Wagner", "Becker", "Schulz", "Hoffmann", "Schäfer", "Koch", "Bauer", "Richter", "Klein", "Wolf", "Braun", "Schmid", "Hartmann", "Zimmermann", "Krüger", "Schmitz", "Lange", "Werner", "Schulte", "Köhler", "Lehmann", "Maier", "Scholz", "Albrecht", "Vogel", "Pohl", "Huber", "Roth", "Arnold", "König", "Friedrich", "Beyer", "Bruegge", "Seidel", "Sommer", "Haas", "Graf", "Heinrich", "Schreiber", "Schiller", "Günther", "Krämer", "Zimmer", "Jäger", "Ludwig", "Ritter", "Winkler", "Ziegler", "Frank", "Schwarz", "Neumann", "Herrmann", "Kühn", "Walter", "Peters", "Möller", "Martin", "Schubert", "Dietrich", "Ullrich", "Fuchs", "Voigt", "Simon", "Kunz", "Marx", "Sauer", "Hauser", "Böhm", "Dreher", "Schuster", "Stahl", "Hein", "Hess", "Berger", "Bock", "Busch", "Menzel", "Weiß", "Engels", "Sander", "Geiger", "Lorenz", "Rommel", "Hahn", "Schütz", "Keller", "Petersen", "Thiel", "Böttcher", "Dahl", "Heinze", "Trautmann", "Zimmerer", "Vogt", "Otto", "Voß", "Janßen", "Dahlke", "Stein", "Hesse", "Röder", "Rieger", "Wendt", "Kühne", "Seeger", "Brinkmann", "Franke", "Ackermann", "Drechsler", "Wenzel", "Hagen", "Reuter", "Döring", "Groß", "Böhme", "Kellermann", "Ebert", "Renner", "Pfeiffer", "Eichhorn", "Blum", "Stoll", "Rupp", "Vetter", "Breuer", "Hildebrand", "Wendel", "Grote", "Rosenberger", "Rößler", "Adam", "Weiß", "Ostermann", "Wiegand", "Wirth", "Bode", "Brügge", "Kolb", "Geyer", "Kling", "Heßler", "Ritz", "Lambrecht", "Essing"];
    let prob = 0;
    inputLine = inputLine.toLowerCase();
    let words = inputLine.split(" ");
    //Vor- und Nachname-Array to lower case
    for (let a = 0; a < vornamen.length; a++) {
        const element = vornamen[a];
        vornamen[a] = element.toLowerCase();
    }
    for (let a = 0; a < nachnamen.length; a++) {
        const element = nachnamen[a];
        nachnamen[a] = element.toLowerCase();
    }
    //Schleife und check ob element im Vornamen-Array existiert
    for (let i = 0; i < words.length; i++) {
        const element = words[i];
        prob = 0;
        if (vornamen.includes(element)) {
            prob += 40;
        }
        //checken ob das Wort nach i mit dem Nachnamen Array matcht 
        let wordAfter = words[i + 1];
        if (nachnamen.includes(wordAfter)) {
            prob += 40;
        }
        //checken ob das Wort vor i, falls es existiert, mit gewisse Stichworte enthält 
        if (i !== 0) {
            let wordBefore = words[i - 1];
            if (wordBefore.includes("geschäftsführer") || wordBefore.includes("ansprechpartner") || wordBefore.includes("vorstand") || wordBefore.includes("vorsitzender") || wordBefore.includes("inhaber")) {
                prob += 50;
            } else if (wordBefore.includes("firmenname")) {
                return;
            }
        }
        //Wahrscheinlichkeitsrundung && output
        if (prob > 100) {
            prob = 100;
        }
        if (prob > 0) {
            nameValue.push(element);
            nameProbability.push(prob);
            console.log(element + " " + wordAfter + " ist mit " + prob + "% Wahrscheinlichkeit ein Name");
        }
    }
}

function checkFax(inputLine) {
    let fullNumber = "";
    inputLine = inputLine.toLowerCase();
    let words = inputLine.split(" ");
    let prob = 0;
    let stringBlacklist = "abcdefghijklmnopqrstuvwxyzäöü@#$!%^&*_={}[]|;:<>,?";
    const blacklist = stringBlacklist.split("");

    words: for (let i = 0; i < words.length; i++) {
        // Checkt ob das Wort Buchstaben usw. enthält
        for (let b = 0; b < blacklist.length; b++) {
            if (words[i].includes(blacklist[b])) {
                if (fullNumber.trim().length != 0 && prob != 0) {
                    console.log(fullNumber + ": ist mit " + prob + "% Wahrscheinlichkeit eine Faxnummer");
                    faxValue.push(fullNumber);
                    faxProbability.push(prob);
                }
                fullNumber = "";
                continue words;
            }
        }

        // Checkt ob vor der nummer z.B. fax steht
        if (i !== 0) {
            let wordBefore = words[i - 1].toLowerCase();
            if (wordBefore.includes("fax")) {
                prob += 70;
            } else if (wordBefore.includes("tel") || wordBefore.includes("fon")) {
                return;
            }
        }
        // Checkt ob die gesamt länge der Nummer zu groß ist
        if (words[i].length + fullNumber.length < 20) {
            fullNumber += words[i];
        }
    }

    let tmpFullNum = fullNumber
    tmpFullNum = tmpFullNum.replaceAll("+", "").replaceAll("/", "").replaceAll("-", "").replaceAll(".", "");
    if (tmpFullNum.length > 5 && tmpFullNum.length < 33) {
        prob += 30;
    }

    if (fullNumber.trim().length != 0 && prob != 0) {
        console.log(fullNumber + ": ist mit " + prob + "% Wahrscheinlichkeit eine Faxnummer");
        faxValue.push(fullNumber);
        faxProbability.push(prob);
    }
}



function checkPhone(inputLine) {
    let fullNumber = "";
    inputLine = inputLine.toLowerCase();
    let words = inputLine.split(" ");
    let prob = 0;
    let stringBlacklist = "abcdefghijklmnopqrstuvwxyzäöü@#$!%^&*_={}[]|;:<>,?";
    const blacklist = stringBlacklist.split("");

    words: for (let i = 0; i < words.length; i++) {
        // Checkt ob das Wort Buchstaben usw. enthält
        for (let b = 0; b < blacklist.length; b++) {
            if (words[i].includes(blacklist[b])) {
                if (fullNumber.trim().length != 0 && prob != 0) {
                    console.log(fullNumber + ": ist mit " + prob + "% Wahrscheinlichkeit eine Telefonnummer");
                    telValue.push(fullNumber);
                    telProbability.push(prob);
                }
                fullNumber = "";
                continue words;
            }
        }

        // Checkt ob vor der nummer z.B. fax steht
        if (i !== 0) {
            let wordBefore = words[i - 1].toLowerCase();
            if (wordBefore.includes("fon")) {
                prob += 70;
            } else if (wordBefore.includes("fax")) {
                return;
            }
        }
        // Checkt ob die gesamt länge der Nummer zu groß ist
        if (words[i].length + fullNumber.length < 20) {
            fullNumber += words[i];
        }
    }

    let tmpFullNum = fullNumber
    tmpFullNum = tmpFullNum.replaceAll("+", "").replaceAll("/", "").replaceAll("-", "").replaceAll(".", "");
    if (tmpFullNum.length > 5 && tmpFullNum.length < 33) {
        prob += 30;
    }

    if (fullNumber.trim().length != 0 && prob != 0) {
        console.log(fullNumber + ": ist mit " + prob + "% Wahrscheinlichkeit eine Telefonnummer");
        telValue.push(fullNumber);
        telProbability.push(prob);
    }
}

function checkStreet(inputLine) {
    inputLine = inputLine.toLowerCase();
    let words = inputLine.split(" ")
    let prob = 0;
    let streetNames = ["str", "weg", "allee", "gasse", "ring", "platz", "promenade", "chaussee", "boulevard", "stieg", "pfad"];
    let stringBlacklist = "abcdefghijklmnopqrstuvwxyzäöü@#$!%^&*_={}[]|;:<>,?";
    const blacklist = stringBlacklist.split("");
    let num = 0;
    let fullStreetName = "";

    words: for (let i = 0; i < words.length; i++) {
        
        // Wörter mit StreetNames Array vergleichen
        for (let sNames = 0; sNames < streetNames.length; sNames++) {
            if (words[i].includes(streetNames[sNames])) {
                fullStreetName += " " + words[i];
                prob += 40;

                if (i + 1 < words.length) {
                    let wordAfter = words[i + 1].toLowerCase();

                    // prüfen ob nach der Straße eine Hausnummer kommt
                    for (let b = 0; b < blacklist.length; b++) {
                        if (words[i+1].includes(blacklist[b])) {
                            num++;
                        }
                    }

                    if (num == 0) {
                        fullStreetName += " " + words[i+1];
                        prob += 30;

                        if (wordAfter.length > 0 && wordAfter.length < 3) {
                            prob += 20;
                        } else if (wordAfter.length < 5) {
                            prob += 10;
                        }
                    }

                    // überprüfen nach der Hausnummer ein Buchstaben Zusatz kommt
                    if (i + 2 < words.length) {
                        let word2After = words[i + 2].toLowerCase();

                        if (word2After.length == 1) {
                            for (let a = 0; a < 26; a++) {
                                if (word2After == blacklist[a]) {
                                    fullStreetName += " " + words[i+2];
                                    prob += 10;
                                }
                            }
                        }
                    }
                }
            }
        }
    }
    console.log(fullStreetName + ": ist mit " + prob + "% Wahrscheinlichkeit eine Straße");
}

function checkCity(inputLine) {
    inputLine = inputLine.toLowerCase();
    let words = inputLine.split(" ");
    let city = 0;
    let cityName = 0;
    let prob = 0;
    //wenn element mit d- startet wird diese entfernt
    for (let a = 0; a < words.length; a++) {
        const element = words[a];
        if (element.startsWith("d-")) {
            words[a] = element.replace("d-", "");
            prob += 10;
        }
        //Falls vor der 5-Stelligen Zahl ein verbotenes Keyword steht wird diese Zahl nicht angegeben 
        if (a !== 0) {
            let wordBefore = words[a - 1];
            if (wordBefore.includes("fax") || wordBefore.includes("fon")) {
                words.splice(a, 1);
            }
        }
    }
    //neuer Array nur mit 5 Stelligen Zahlen 
    const nurZahlen = words.filter(element => !isNaN(element));
    for (let a = 0; a < nurZahlen.length; a++) {
        const element = nurZahlen[a];
        if (element.length !== 5) {
            nurZahlen.splice(a, 1);
        }
    }
    //check ob elements im json enthalten sind und somit eine Stadt matchen
    zipLoop: for (let i = 0; i < nurZahlen.length; i++) {
        const element = nurZahlen[i];
        if (allZipCodes.includes(element)) {
            prob += 60;
            city = allZipCodes.indexOf(element);
            cityName = allCityNames[city];
            //check ob Wort nach dem zip Code der Stadt entspricht die im json engetragen ist
            if (words[i + 1] !== undefined) {
                let wordAfter = words[i + 1];
                if (wordAfter.includes(cityName.toLowerCase())) {
                    prob = 100;
                }
            }
        }
        else {
            continue zipLoop;
        }
        //output
        if (prob > 0) {
            zipValue.push(element);
            zipProbability.push(prob);
            console.log(element + " " + cityName + " ist mit " + prob + "% Wahrscheinlichkeit eine Postleitzahl mit Ort");
        }
    }
}
//arrays werden auf die Werte, die im json enthalten sind, gesetzt 
fetch('georef-germany-postleitzahl.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(datensatz => {
            allZipCodes.push(('PLZ:', datensatz.name));
            allCityNames.push(('Stadt:', datensatz.plz_name));
        });
    })
    .catch(error => {
        console.error('Fehler beim Laden der JSON-Datei:', error);
    });


function findMaxIndex(arr) {
    if (!arr || arr.length === 0) {
        return null; // Gebe null für leere Arrays zurück
    }

    let maxIndex = 0;
    let maxValue = arr[0];

    for (let i = 1; i < arr.length; i++) {
        if (arr[i] > maxValue) {
            maxValue = arr[i];
            maxIndex = i;
        }
    }

    return maxIndex;
}
