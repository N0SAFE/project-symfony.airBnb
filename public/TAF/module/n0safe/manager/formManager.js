export default class formManager {
    constructor(formElement, callback) {
        this.formElement = formElement;
        this.callback = callback || function() {};
        this.ini();
    }

    ini() {
        this.formElement.addEventListener("submit", (e) => {
            e.preventDefault();
            this.callback.call(this, this.getProperty())
        })
    }

    getProperty() {
        return {
            form: {
                element: this.formElement,
                value: this.getAllInputs(),
                get: function(property) {
                    return this.formElement[property]
                }
            },
            callback: this.callback,
        }
    }

    getAllInputs() {
        let inputs = this.formElement.querySelectorAll("input");
        let all = {};
        for (let i = 0; i < inputs.length; i++) {
            let input = inputs[i];
            all[input.name] = input.value;
        }
        let selects = this.formElement.querySelectorAll("select");
        for (let i = 0; i < selects.length; i++) {
            let select = selects[i];
            all[select.name] = select.value;
        }
        return all;
    }
}