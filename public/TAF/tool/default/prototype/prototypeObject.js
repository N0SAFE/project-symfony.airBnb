export const add = function(key, value, force) {
    if (force) {
        this[key] = value;
        return true;
    }
    if (!Array.from(Object.keys(this)).includes(key)) {
        this[key] = value;
        return true;
    }
    return false;
}

export const del = function(key) {
    key == undefined ? function() { delete this; return true } : Array.from(Object.keys(this)).includes(key) ? function() { delete this[key]; return true } : function() { return false };
}

export const e = function(suit, value) {
    // verify if suit is an array
    if (typeof suit !== 'array') {
        console.error("[prototypeObject] addNewGlobal: suit is not an array");
        return false;
    }

    function recursiveCallee(suit, value, location) {
        if (suit.length > 1) {
            if (!Array.from(Object.keys(location)).includes(suit[0]) || typeof location[suit[0]] !== 'object') {
                location[suit[0]] = {}
            }
            recursiveCallee(suit.slice(1), value, location[suit[0]])
        } else {
            location[suit[0]] = value
        }
    }
    recursiveCallee(suit, value, this)

    return suit.length > 0 ? this[suit[0]] : this
}