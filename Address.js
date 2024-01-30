import { CheckResult } from "./CheckResult.js";

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

    getCompanyName() {
        return this.companyName;
    }
    setCompanyName(companyName) {
        this.companyName = companyName;
    }

    getPostalCode() {
        return this.zip;
    }
    setPostalCode(postalCode) {
        this.postalCode = postalCode;
    }

    getStreet() {
        return this.street;
    }
    setStreet(street) {
        this.street = street;
    }

    getCity() {
        return this.city;
    }
    setCity(city) {
        this.city = city;
    }

    getHomepage() {
        return this.homepage;
    }
    setHomepage(homepage) {
        this.homepage = homepage;
    }

    getW3wAddress() {
        return this.w3wAddress;
    }
    setW3wAddress(w3wAddress) {
        this.w3wAddress = w3wAddress;
    }

    getEmails() {
        return this.emails;
    }
    setEmails(_emails) {
        console.log(_emails);
        this.emails = this.emails.concat(_emails);
    }

    getPhoneNumbers() {
        return this.phoneNumbers;
    }
    setPhoneNumbers(phoneNumbers) {
        this.phoneNumbers = phoneNumbers;
    }
    
    getFaxNumbers() {
        return this.faxNumbers;
    }
    setFaxNumbers(faxNumbers) {
        this.faxNumbers = faxNumbers;
    }

    getContactPersons() {
        return this.contactPersons;
    }
    setContactPersons(contactPersons) {
        this.contactPersons = contactPersons;
    }

    outputAllValues(html_id, fadeTime) {

              let objectArray = [];
        switch (html_id) {
            case "email":
            console.log('email: ', email);
                console.log(this.getEmails());
                 objectArray = objectArray.concat(this.getEmails());
                break;

            case "contactPerson":
            console.log('contactPerson: ', contactPerson);
                console.log(this.getContactPersons());
                objectArray = objectArray.concat(this.getContactPersons());
                break;

            case "phoneNumber":
            console.log('phoneNumber: ', phoneNumber);
                console.log(this.getPhoneNumbers());
                objectArray = objectArray.concat(this.getPhoneNumbers());
                break;

            case "contactPerson":
                console.log(this.getContactPersons());
                objectArray = objectArray.concat(this.getContactPersons());
                break;

            case "faxNumber":
                console.log(this.getFaxNumbers());
                objectArray = objectArray.concat(this.getFaxNumbers());
                break;

            default:
                break;
        }
        console.log(objectArray);

        $("#" + html_id).val(""); //feld clearen
        let firstvalue = 0;
        for (let index = 0; index < objectArray.length; index++) {
            let object = objectArray[index];
            let new_id = object.name;
            console.log(new_id);
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

    outputMaxValues(html_id, fadeTime) {
        let objectArray = [];
        switch (html_id) {
            case "w3w":
                console.log(this.getw3wAddress());
                objectArray = objectArray.concat(this.getw3wAddress());
                break;

            case "fgd":
                console.log(this.getcontactPersons());
                objectArray = objectArray.concat(this.getcontactPersons());
                break;

            default:
                break;
        }
        console.log(objectArray);

        $("#" + html_id).val("");

        let maxValue = this.findMaxPercentage(objectArray);
        console.log(maxValue);

        // wenn slider wert größer als Wkeit nicht ausgeben
        let outputPercentage = $("#slider")[0].value;

        if (outputPercentage <= maxValue.probability) {
            $("#" + html_id).val(maxValue.value).hide().fadeIn(fadeTime);
        }
    }

    findMaxPercentage (Array) {
        let highestPercentage = Array[0];

        // Gebe null für leere Arrays zurück
        if (Array.length == 0) {
            return null; 
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
