export class CheckResult {
    name = "";
    value = "";
    probability = "";

    constructor(name, value, probability) {
        this.name = name;
        this.value = value;
        this.probability = probability;
    }

    getvalue () {
        return this.value;
    }
    setvalue (value) {
        this.value = value;
    }

    getprobability () {
        return this.probability;
    }
    setprobability (probability) {
        this.probability = probability;
    }
}
