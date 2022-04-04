export const addInObject = function() {
    let OBJECT = arguments[0]
    let suit = arguments[1]
    let value = arguments[2]

    // verify if suit is an array
    if (!Array.isArray(suit)) {
        throw new Error("suit must be of type array")
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
    recursiveCallee(suit, value, OBJECT)

    return suit.length > 0 ? OBJECT[suit[0]] : OBJECT
}

export function searchInObject() {
    if (arguments.length < 2)
        throw new Error("must be called with 2 arguments but " + arguments.length + " found")
    let OBJECT = arguments[0]
    let array = arguments[1]

    let recFunc = (OBJECT, arraySearch) => {
        if (arraySearch.length > 0) {
            let search = arraySearch.shift()
            if (OBJECT[search]) {
                return recFunc(OBJECT[search], arraySearch)
            }
            return false
        }
        return OBJECT
    }
    return recFunc(OBJECT, array)
}

export function Try(obj) {
    let Try = obj.try
    let Catch = obj.catch
    let Finally = obj.finally
    let ret

    try {
        ret = Try()
    } catch (e) {
        ret = Catch(e)
    } finally {
        Finally()
    }
    return ret
}