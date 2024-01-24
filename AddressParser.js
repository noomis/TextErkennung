export class AddressParser {
    companyNameCheck = "";
    streetCheck = "";
    postalCodeCheck = "";
    cityCheck = "";
    homepageCheck = "";
    w3wAddressCheck = "";
    emailsCheck = "";
    phoneNumbersCheck = "";
    faxNumbersCheck = "";
    contactPersonsCheck = "";

    constructor (language, outputPercentage) {
        this.language = language;
        this.outputPercentage = outputPercentage;
    }

    get companyNameCheck() {
        return this.companyNameCheck;
    }

    get streetCheck() {
        return this.streetCheck;
    }

    get postalCodeCheck() {
        return this.postalCodeCheck;
    }

    get cityCheck() {
        return this.cityCheck;
    }

    get homepageCheck() {
        return this.homepageCheck;
    }

    get w3wAddressCheck() {
        return this.w3wAddressCheck;
    }

    get emailsCheck() {
        return this.emailsCheck;
    }

    get phoneNumbersCheck() {
        return this.phoneNumbersCheck;
    }

    get faxNumbersCheck() {
        return this.faxNumbersCheck;
    }

    get contactPersonsCheck() {
        return this.contactPersonsCheck;
    }
}