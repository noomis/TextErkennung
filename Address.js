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

    getcompanyName() {
        return this.companyName;
    }
    setcompanyName(companyName) {
        this.companyName = companyName;
    }

    getpostalCode() {
        return this.zip;
    }
    setpostalCode(postalCode) {
        this.postalCode = postalCode;
    }

    getstreet() {
        return this.street;
    }
    setstreet(street) {
        this.street = street;
    }

    getcity() {
        return this.city;
    }
    setcity(city) {
        this.city = city;
    }

    gethomepage() {
        return this.homepage;
    }
    sethomepage(homepage) {
        this.homepage = homepage;
    }

    getw3wAddress() {
        return this.w3wAddress;
    }
    setw3wAddress(w3wAddress) {
        this.w3wAddress = w3wAddress;
    }

    getemails() {
        return this.emails;
    }
    setemails(emails) {
        this.emails = emails;
    }

    getphoneNumbers() {
        return this.phoneNumbers;
    }
    setphoneNumbers(phoneNumbers) {
        this.phoneNumbers = phoneNumbers;
    }
    
    getfaxNumbers() {
        return this.faxNumbers;
    }
    setfaxNumbers(faxNumbers) {
        this.faxNumbers = faxNumbers;
    }

    getcontactPersons() {
        return this.contactPersons;
    }
    setcontactPersons(contactPersons) {
        this.contactPersons = contactPersons;
    }
}
