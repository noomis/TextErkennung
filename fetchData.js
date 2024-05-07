export class FetchData {
    fetchedPostalCodes = []; 
    fetchedCityNames = [];

    async fetchCityData() {
        let tempAllPostalCodes = [];
        let tempAllCityNames = [];
        
//arrays are set to the Germany values ​​contained in the json
        await fetch('georef-germany-postleitzahl.json')
            .then(response => response.json())
            .then(data => {
                data.forEach(datensatz => {
                    tempAllCityNames.push(datensatz.plz_name);
                    tempAllPostalCodes.push(datensatz.name);
                });
            })
            
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

