export function parse(type = "string") {
    switch (type) {
        case "string":
            return parseInt(this);
        case "int":
            return this;
        case "boolean":
            return this ? true : false;
        case "array":
            return [this];
        case "object":
            return { num: this };
        default:
            return this;
    }
}

// Language: javascript
// Path: built-in\tool\prototype\prototypeNumber.js