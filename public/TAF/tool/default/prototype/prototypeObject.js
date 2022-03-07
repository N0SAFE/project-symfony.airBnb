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

export const addNewGlobal = function(OBJECT, suit, value) {
    // verify if suit is an array
    if (typeof suit !== 'array') {
        console.error("[prototypeObject] addNewGlobal: suit is not an array");
        return false;
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