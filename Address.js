export class Address {

    constructor(
        _companyName,
        _postalCode,
        _street,_city,
        _homepage,_w3wAddress,
        _emails,_phoneNumbers,
        _faxNumbers,_contactPersons,
        _companyRegistrationNumber,
        _vatIdNumber,_taxNumber,
        _language,
    ) {
        this.companyName = _companyName;
        this.postalCode = _postalCode;
        this.street = _street;
        this.city = _city;
        this.homepage = _homepage;
        this.w3wAddress = _w3wAddress;
        this.emails = _emails;
        this.phoneNumbers = _phoneNumbers;
        this.faxNumbers = _faxNumbers;
        this.contactPersons = _contactPersons;
        this.companyRegistrationNumber = _companyRegistrationNumber;
        this.vatIdNumber = _vatIdNumber;
        this.taxNumber = _taxNumber;
        this.language = _language;
    }

    getLanguage() {
        return this.language;
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

    getTaxNumber() {
        return this.taxNumber;
    }

    setTaxNumber(_taxNumber) {
        this.taxNumber = this.taxNumber.concat(_taxNumber);
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
        let firstValue = true;

        for (let index = 0; index < objectArray.length; index++) {
            let object = objectArray[index];
            let newId = object.name;

                if (firstValue) {
                    $("#" + html_id).val(object.value).hide().fadeIn(fadeTime); // putting the first value in existing field
                } else {
                    //Recreation and implementation of fields for multiple phone numbers
                    let newObject = document.createElement("input");
                    newObject.id = "id" + index + newId;
                    newObject.classList.add("delete");
                    $("#" + newId).after(newObject);
                    $("#id" + index + newId).val(object.value).hide().fadeIn(fadeTime);
                }

                firstValue = false;;
        }
    }

    outputMaxValues(html_id) {
        $("#" + html_id).val(""); //clear html-element
        let fadeTime = 0;
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

            case "taxNumber":
                objectArray = objectArray.concat(this.getTaxNumber());
                break;

            default:
                break;
        }

        if (objectArray.length <= 0) {
            return;
        }

        let maxValue = this.findMaxPercentage(objectArray);
        $("#" + html_id).val(maxValue.value).hide().fadeIn(fadeTime);
    }

    findMaxPercentage(array) {
        let object = {
            probability: 1,
        }

        let highestPercentage = object;

        // Return null for empty arrays
        if (array.length == 0) {
            return;
        }

        // Return object with the highest probability
        array.forEach(element => {
            if (element.probability > highestPercentage.probability) {
                highestPercentage = element;
            }
        });

        return highestPercentage;
    }

    exportJson(el) {
        let jsonObject = {
            language: this.getLanguage(),
            companyName: this.getCompanyName(),
            homepage: this.getHomepage(),
            contactPersons: this.getContactPersons(),
            emails: this.getEmails(),
            street: this.getStreet(),
            phoneNumbers: this.getPhoneNumbers(),
            faxNumbers: this.getFaxNumbers(),
            postalCode: this.getPostalCode(),
            city: this.getCity(),
            w3w: this.getW3wAddress(),
            registrationNumber: this.getRegistrationNumber(),
            vatIdNumber: this.getVatIdNumber(),
            taxNumber: this.getTaxNumber(),
        };

        // Convert the JSON object to a string
        let jsonString = JSON.stringify(jsonObject, null, 4);

        // Create a data URI for the JSON content
        let dataUri = "data:text/json;charset=utf-8," + encodeURIComponent(jsonString);

        // Set the element's attributes to create the download link
        el.setAttribute("href", dataUri);
        el.setAttribute("download", "data.json");
    }
}
