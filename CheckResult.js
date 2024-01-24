export class CheckResult {
    value = "";
    probability = "";

    constructor(value, probability) {
        this.value = value;
        this.probability = probability;
    }

    get value () {
        return this.value;
    }
    set value (value) {
        this.value = value;
    }

    get probability () {
        return this.probability;
    }
    set probability (probability) {
        this.probability = probability;
    }
}
