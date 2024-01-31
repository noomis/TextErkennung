export class Address {

    companyName = [];
    postalCode = [];
    street = [];
    city = [];
    homepage = [];
    w3wAddress = [];
    emails = [];
    phoneNumbers = [];
    faxNumbers = [];
    contactPersons = [];

    constructor() {
        this.companyName = [];
        this.postalCode = [];
        this.street = [];
        this.city = [];
        this.homepage = [];
        this.w3wAddress = [];
        this.emails = [];
        this.phoneNumbers = [];
        this.faxNumbers = [];
        this.contactPersons = [];
    }

    getCompanyName() {
        return this.companyName;
    }

    setCompanyName(companyName) {
        this.companyName = this.companyName.concat(companyName);
    }

    getPostalCode() {
        return this.postalCode;
    }

    setPostalCode(_postalCode) {
        this.postalCode = this.postalCode.concat(_postalCode);
    }

    getStreet() {
        return this.street;
    }

    setStreet(_street) {
        this.street = this.street.concat(_street);
    }

    getCity() {
        return this.city;
    }

    setCity(city) {
        this.city = this.city.concat(city);
    }

    getHomepage() {
        return this.homepage;
    }

    setHomepage(homepage) {
        this.homepage = this.homepage.concat(homepage);
    }

    getW3wAddress() {
        return this.w3wAddress;
    }

    setW3wAddress(w3wAddress) {
        this.w3wAddress = this.w3wAddress.concat(w3wAddress);
    }

    getEmails() {
        return this.emails;
    }

    setEmails(_emails) {
        this.emails = this.emails.concat(_emails);
    }

    getPhoneNumbers() {
        return this.phoneNumbers;
    }

    setPhoneNumbers(phoneNumbers) {
        this.phoneNumbers = this.phoneNumbers.concat(phoneNumbers);
    }

    getFaxNumbers() {
        return this.faxNumbers;
    }

    setFaxNumbers(faxNumbers) {
        this.faxNumbers = this.faxNumbers.concat(faxNumbers);
    }

    getContactPersons() {
        return this.contactPersons;
    }

    setContactPersons(contactPersons) {
        this.contactPersons = this.contactPersons.concat(contactPersons);
    }

    outputAllValues(html_id, fadeTime) {

        let objectArray = [];
        switch (html_id) {

            case "email":
                objectArray = objectArray.concat(this.getEmails());
                break;

            case "contactPerson":
                objectArray = objectArray.concat(this.getContactPersons());
                break;

            case "phoneNumber":
                objectArray = objectArray.concat(this.getPhoneNumbers());
                break;

            case "contactPerson":
                objectArray = objectArray.concat(this.getContactPersons());
                break;

            case "faxNumber":
                objectArray = objectArray.concat(this.getFaxNumbers());
                break;

            default:
                break;
        }

        $("#" + html_id).val(""); //feld clearen
        let firstvalue = 0;
        for (let index = 0; index < objectArray.length; index++) {
            let object = objectArray[index];
            if (object !== undefined) {
                let new_id = object.name;
                console.log(object);
                let outputPercentage = $("#slider")[0].value; //Prozentzahl vom Input des Schiebereglers 
                //wenn Slider-WKeit kleiner oder gleich dem des Wertes im Array entspricht ausgeben
                if (outputPercentage <= object.probability) {
                    if (firstvalue == 0) {
                        $("#" + html_id).val(object.value).hide().fadeIn(fadeTime); // setzen des ersten Wertes in vorhandenes Feld
                    }
                    else {
                        //Neuerstellung und Implementierung von Feldern bei mehreren Telefonnummern
                        let newObject = document.createElement("input");
                        newObject.id = "id" + index + new_id;
                        newObject.classList.add("delete");
                        $("#" + new_id).after(newObject);
                        $("#id" + index + new_id).val(object.value).hide().fadeIn(fadeTime);
                    }
                    firstvalue++;
                }
            }
        }
    }

    outputMaxValues(html_id, fadeTime) {
        $("#" + html_id).val(""); //feld clearen

        let objectArray = [];
        switch (html_id) {
            case "w3w":
                objectArray = objectArray.concat(this.getW3wAddress());
                break;

            case "companyName":
                objectArray = objectArray.concat(this.getCompanyName());
                break;

            case "homepage":
                objectArray = objectArray.concat(this.getHomepage());
                break;

            case "street":
                objectArray = objectArray.concat(this.getStreet());
                break;

            case "postalCode":
                objectArray = objectArray.concat(this.getPostalCode());
                break;

            case "city":
                objectArray = objectArray.concat(this.getCity());
                break;

            default:
                break;
        }

        if (objectArray.length <= 0) {
            return;
        }

        $("#" + html_id).val("");

        let maxValue = this.findMaxPercentage(objectArray);

        console.log(maxValue);

        // wenn slider wert größer als Wkeit nicht ausgeben
        let outputPercentage = $("#slider")[0].value;

        if (outputPercentage <= maxValue.probability) {
            $("#" + html_id).val(maxValue.value).hide().fadeIn(fadeTime);
        }
    }

    findMaxPercentage(Array) {
        let object = {
            probability: 1,
        }

        let highestPercentage = object;


        // Gebe null für leere Arrays zurück
        if (Array.length == 0) {
            return;
        }

        // Objekt mit der höhsten Wahrscheinlichkeit returnen
        Array.forEach(element => {

            if (element.probability > highestPercentage.probability) {
                highestPercentage = element;
            }
        });

        return highestPercentage;
    }
}
