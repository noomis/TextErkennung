import { Address } from "./Address.js";
import { AddressParser } from "./AddressParser.js";
import { FetchData } from "./fetchData.js";
import { CheckLanguage } from "./checkLanguage.js";
let timeoutId;

let fetchData = new FetchData;
fetchData.fetchCityData();

document.getElementById("text").addEventListener("input", printResult);

document.getElementById("slider").addEventListener("input", printResult);

function printResult() {
    $(".delete").remove();
    let input = document.getElementById("text").value;
    let languageChecker = new CheckLanguage();
    languageChecker = languageChecker.parseLanguage(input);
    let outputPercentage = $("#slider")[0].value;
    let mainParser = new AddressParser(languageChecker,outputPercentage);

    $("#probValue").text("Treffer Wahrscheinlichkeit: " + outputPercentage + "%");

    clearTimeout(timeoutId);

    timeoutId = setTimeout(() => {

        if (input != "") { // Nur ausführen wenn Eingabe nicht leer ist

            mainParser.setAllPostalCodes(fetchData.getAllPostalCodes());
            mainParser.setCityNames(fetchData.getCityNames());
            let addressObject;
            addressObject = mainParser.parseText(input);

            addressObject.outputAllValues("email", 0);
            addressObject.outputAllValues("phoneNumber", 0);
            addressObject.outputAllValues("contactPerson", 0);
            addressObject.outputAllValues("faxNumber", 0);
            addressObject.outputMaxValues("w3w", 0);
            addressObject.outputMaxValues("homepage", 0);
            addressObject.outputMaxValues("street", 0);
            addressObject.outputMaxValues("companyName", 0);
            addressObject.outputMaxValues("postalCode", 0);
            addressObject.outputMaxValues("city", 0);
            addressObject.outputMaxValues("registrationNumber", 0);
            addressObject.outputMaxValues("vatIdNumber", 0);
            addressObject.outputMaxValues("taxNumber", 0);

            document.getElementById('exportJSON').addEventListener('click', function () {
            addressObject.exportJson(this);
            });
        }

    }, 500);

}

document.getElementById("random").addEventListener("click", randomImpressum);


window.addEventListener("load", async () => {

    // (A) GET HTML ELEMENTS
    const hSel = document.getElementById("select"),
        hRes = document.getElementById("text");

    // (B) CREATE ENGLISH TESSERACT WORKER
    const worker = await Tesseract.createWorker();
    await worker.loadLanguage("deu");
    await worker.initialize("deu");

    // (C) ON FILE SELECT - IMAGE TO TEXT
    hSel.onchange = async () => {

        const res = await worker.recognize(hSel.files[0]);
        hRes.value = res.data.text;
        $("#text").trigger("onkeyup");
        printResult();
    };
});


let i = 0;
function randomImpressum() {
    $("#text").height(60);

    let Impressen = [];

    Impressen.push('geoCapture GmbH\nRheiner Str. 3\nD-48496 Hopsten\nTelefon: +49 5458 936668-0\nTelefax: +49 5458 936668-28\nE-Mail: info@geocapture.de\nWebsite: www.geocapture.de\n\nwhat3words Position:  ///zeugt.zutreffen.wissen\n\nGerichtsstand:\nAmtsgericht Steinfurt HRB 12637\nGeschäftsführer: Friedhelm Brügge\nFinanzamt Steinfurt 327/5770/7451\nUSt.-IdNr. DE276689377');
    Impressen.push('IMPRESSUM\n\nAngaben gemäß § 5 TMG:\n\nSiering Straßenbau GmbH\nRheiner Straße 2\n///abgesprochen.teichrose.milchprodukt\nwww.siering-hopsten.com\n48496 Hopsten\n\nVertreten durch:\n\nJörg Siering, Dipl.-Bau.-Ing., Wirtsch.-Ing. (FH)\nDipl.-Bau-Ing. (FH) Marc Borgmann\n\nKontakt:\n\nTelefon:\t 05458/9312-0\nTelefax:\t 05458/9312-55\nE-Mail:\t info@siering-hopsten.de');
    Impressen.push('WEINCONTOR WIESBADEN\nHans-Jürgen Becker\nTaunusstr. 5\n65183 Wiesbaden\nTel.: 0611-1746652\nFax: 0611-1746653\nemail: selection@weincontor-wiesbaden.de\nHomepage: www.weincontor-wiesbaden.de\n\nOEFFNUNGSZEITEN\nMontag - Freitag 11-19 Uhr\nSamstag 10-16 Uhr\nSA im Dezember 10-18 Uhr\n\nw3w-Adresse Eingang: ///kaiser.sonst.bisher');
    Impressen.push('Impressum\nHerausgeber der Seite\nGemeinde Hopsten\nBunte Straße 35\n48496 Hopsten\n\nTelefon: 05458 9325 0\nTelefax: 05458 9325 93\n\nE-Mail: info@hopsten.de\nDE-Mail: postfach@hopsten.de-mail.de\n\nDie Gemeinde Hopsten ist eine Körperschaft des öffentlichen Rechts.\nSie wird vertreten durch den Bürgermeister Ludger Kleine-Harmeyer (Kontaktdaten siehe oben)\n\nPresserechtliche Verantwortung und Vertretungsberechtigter gem. § 5 Telemediengesetz TMG bzw. inhaltlich Verantwortlich § 55 II Rundfunkstaatsvertrag RStV:');
    Impressen.push('Gemeinde Recke\nDer Bürgermeister\nHauptstraße 28\n49509 Recke\nVertreten durch:\nHerrn Peter Vos\nKontakt:\nTelefon:  +49 (0) 5453 910 31\nTelefax:  +49 (0) 5453 910 88 31\nE-Mail:   vos@recke.de\nE-Mail:   info@recke.de\nDE-Mail: info@recke.de-mail.de');
    Impressen.push('Betreiber\nM. Holl GmbH\nGeschäftsführer: Michael Holl\nMax-Planck-Straße 3\n53577 Neustadt (Wied)\nTel. (02683) 938 050\nFax (02683) 938 052\nEmail info@mholl-gmbh.de');
    Impressen.push('Impressum:\n\nMustermann GmbH\nMusterstraße 123\n48607 Ochtrup\nw3w: ///huhn.katze.maus\n\nVertreten durch:\nMax Mustermann\nMaria Musterfrau\n\nKontakt:\nE-Mail: info@muster-gbr.de\nTelefon: +49 123 456789\nTelefax: +49 123 456780\nInternet: www.mustersite.de\n\nUmsatzsteuer-ID:\nDE123456789\nAmtsgericht Musterstadt HRB 12345\nSteuernummer: 123/4567/8910');

    $("#text").val = "geoCapture GmbHRheiner Str. 3D-48496 Hopsten Telefon: +49 5458 936668-0Telefax: +49 5458 936668-28 E-Mail: info@geocapture.deWebsite: www.geocapture.dewhat3words Position:  ///zeugt.zutreffen.wissenGerichtsstand:Amtsgericht Steinfurt HRB 12637Geschäftsführer: Friedhelm BrüggeFinanzamt Steinfurt 327/5770/7451USt.-IdNr. DE276689377";

    if (i <= Impressen.length - 1) {
        document.getElementById("text").value = Impressen[i];

    } else {
        i = 0;
        document.getElementById("text").value = Impressen[i];

    }

    $("#text").trigger("onkeyup");
    printResult();
    i++;
}