const ArgumentsError = TAF.module.error.Type.ArgumentsError


export const add = function(OBJECT, key, value, force) {
    if (force) {
        OBJECT[key] = value;
        return true;
    }
    if (!Array.from(Object.keys(OBJECT)).includes(key)) {
        OBJECT[key] = value;
        return true;
    }
    return false;
}

export const del = function(OBJECT, key) {
    Array.from(Object.keys(OBJECT)).includes(key) ? function() { delete OBJECT[key]; return true } : function() { return false };
}

export const addNew = function() {
    let OBJECT, suit, value
    if (this) {
        if (arguments.length <= 2)
            return new ArgumentsError("must be called with 2 arguments but " + arguments.length + " found")
        OBJECT = this
        suit = arguments[0]
        value = arguments[1]
    } else {
        if (arguments.length <= 3)
            return new ArgumentsError("must be called with 3 arguments but " + arguments.length + " found")
        OBJECT = arguments[0]
        suit = arguments[1]
        value = arguments[2]
    }

    // verify if suit is an array
    if (typeof suit !== 'array') {
        throw new ArgumentsError("suit must be of type array")
    }

    function recursiveCallee(OBJECT, suit, value, location) {
        if (suit.length > 1) {
            if (!Array.from(Object.keys(location)).includes(suit[0]) || typeof location[suit[0]] !== 'object') {
                location[suit[0]] = {}
            }
            recursiveCallee(suit.slice(1), value, location[suit[0]])
        } else {
            location[suit[0]] = value
        }
    }
    recursiveCallee(suit, value, OBJECT)

    return suit.length > 0 ? OBJECT[suit[0]] : OBJECT
}

export const setDefault = function setDefault(attributeName, defaultValue, verifFunction = undefined) {
    let toTest = this[attributeName]
    if (toTest == undefined) {
        return this[attributeName] = defaultValue
    }
    if (typeof verifFunction === "function" && !verifFunction(toTest)) {
        return this[attributeName] = defaultValue
    }
}