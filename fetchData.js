export class FetchData {
    fetchedPostalCodes = []; 
    fetchedCityNames = [];
    constructor() {
        this.fetchedPostalCodes = []; 
        this.fetchedCityNames = []; 
    }

    async fetchCityData() {
        let tempAllPostalCodes = [];
        let tempAllCityNames = [];
        //arrays werden auf die Germany-Werte, die im json enthalten sind, gesetzt 
        await fetch('georef-germany-postleitzahl.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(datensatz => {
                    tempAllCityNames.push(datensatz.plz_name);
                    tempAllPostalCodes.push(datensatz.name);
                });
            })
console.log("fetched!");
        this.setAllPostalCodes(tempAllPostalCodes);
        this.setCityNames(tempAllCityNames);

    }
    getAllPostalCodes() {
        return this.fetchedPostalCodes;
    }

    getCityNames() {
        return this.fetchedCityNames;
    }

    setAllPostalCodes(_allPostalCodes) {
        this.fetchedPostalCodes = this.fetchedPostalCodes.concat(_allPostalCodes);
    }

    setCityNames(_cityNames) {
        this.fetchedCityNames = this.fetchedCityNames.concat(_cityNames);
    }

}