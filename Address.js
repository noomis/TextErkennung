export class Address {
    companyName = "";
    postalCode = "";
    street = "";
    city = "";
    homepage = "";
    w3wAddress = "";
    emails = "";
    phoneNumbers = "";
    faxNumbers = "";
    contactPersons = "";

    get companyName() {
        return this.companyName;
    }
    set companyName(companyName) {
        this.companyName = companyName;
    }

    get postalCode() {
        return this.zip;
    }
    set postalCode(postalCode) {
        this.postalCode = postalCode;
    }

    get street() {
        return this.street;
    }
    set street(street) {
        this.street = street;
    }

    get city() {
        return this.city;
    }
    set city(city) {
        this.city = city;
    }

    get homepage() {
        return this.homepage;
    }
    set homepage(homepage) {
        this.homepage = homepage;
    }

    get w3wAddress() {
        return this.w3wAddress;
    }
    set w3wAddress(w3wAddress) {
        this.w3wAddress = w3wAddress;
    }

    get emails() {
        return this.emails;
    }
    set emails(emails) {
        this.emails = emails;
    }

    get phoneNumbers() {
        return this.phoneNumbers;
    }
    set phoneNumbers(phoneNumbers) {
        this.phoneNumbers = phoneNumbers;
    }
    
    get faxNumbers() {
        return this.faxNumbers;
    }
    set faxNumbers(faxNumbers) {
        this.faxNumbers = faxNumbers;
    }

    get contactPersons() {
        return this.contactPersons;
    }
    set contactPersons(contactPersons) {
        this.contactPersons = contactPersons;
    }
}
