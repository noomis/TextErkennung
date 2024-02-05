

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
    companyRegistrationNumber = [];
    vatIdNumber = [];

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
        this.companyRegistrationNumber = [];
        this.vatIdNumber = [];
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

    getRegistrationNumber() {
        return this.companyRegistrationNumber;
    }

    setRegistrationNumber(registrationNumber) {
        this.companyRegistrationNumber = this.companyRegistrationNumber.concat(registrationNumber);
    }

    getVatIdNumber() {
        return this.vatIdNumber;
    }

    setVatIdNumber(_vatIdNumber) {
        this.vatIdNumber = this.vatIdNumber.concat(_vatIdNumber);
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
            // if (object !== undefined) {
            let new_id = object.name;
            console.log(object);
            let outputPercentage = $("#slider")[0].value; //Prozentzahl vom Input des Schiebereglers 
            //wenn Slider-Wahrscheinlichkeit kleiner oder gleich dem des Wertes im Array entspricht ausgeben
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
            // }
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

            case "registrationNumber":
                objectArray = objectArray.concat(this.getRegistrationNumber());
                break;

            case "vatIdNumber":
                objectArray = objectArray.concat(this.getVatIdNumber());
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

        // wenn Slider wert größer als Wahrscheinlichkeit nicht ausgeben
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


    exportJson(el) {

        let jsonObject = {
            companyName: "",
            homepage: "",
            contactPersons: "",
            emails: "",
            street: "",
            phone: "",
            fax: "",
            zip: "",
            city: "",
            w3w: "",
        };

        jsonObject.city = this.getCity();
        jsonObject.zip = this.getPostalCode();
        jsonObject.w3w = this.getW3wAddress();
        jsonObject.companyName = this.getCompanyName();
        jsonObject.homepage = this.getHomepage();
        jsonObject.contactPersons = this.getContactPersons();
        jsonObject.emails = this.getEmails();
        jsonObject.street = this.getStreet();
        jsonObject.phone = this.getPhoneNumbers();
        jsonObject.fax = this.getFaxNumbers();

        // Convert the JSON object to a string
        let jsonString = JSON.stringify(jsonObject, null, 4);

        // Create a data URI for the JSON content
        let dataUri = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);

        // Set the element's attributes to create the download link
        el.setAttribute("href", dataUri);
        el.setAttribute("download", "data.json");
    }

}
