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
            element: this.formElement,
            value: new FormData(this.formElement),
            get: function(property) {
                return this.formElement[property]
            }
        }
    }
}