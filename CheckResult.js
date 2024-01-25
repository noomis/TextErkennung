export class CheckResult {
    value = "";
    probability = "";

    constructor(value, probability) {
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
