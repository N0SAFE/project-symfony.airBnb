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


export class StackContainer {
    /* Parsing the error stack and avoiding the file that is importing the error stack. */
    stack = TAF.module.error.ErrorStackParser.parseWithAvoid([{
        fileName: import.meta.url
    }], new Error())

    /* Creating a function that returns the last element of the array stack trace. */
    getLast = function() {
        return this.stack[0]
    }

    /* Creating a function that returns the stack trace of the error. */
    getStack = function() {
        return this.stack
    }
}


/**
 * Container is a class that can be used to create a hierarchical structure of objects. 
 */
export class Container {
    /**
     * @param parent - The parent object. If you don't specify a parent, the object will be a root
     * object.
     * @param [params] - A dictionary of parameters that are passed to the constructor.
     */
    constructor(parent, params = {}) {
        if (parent) {
            this.__parent = parent
        } else {
            this.__parent = this
        }
        this.__innerVar = {
            id: params.id
        }
    }

    /**
     * Get the parent of the current object
     * @returns The parent of the current object.
     */
    __getParent() {
        return this.__parent
    }

    /**
     * Given an id, return the parent of the element with that id
     * @param id - The id of the parent you want to find.
     * @returns The parent with the specified id.
     */
    __getParentById(id) {
        return this.__innerVar.id == id ? this : (this.__isHighestParent() ? undefined : this.__getParent().__getParentById(id))
    }

    /**
     * Returns true if the current object is the highest parent in the hierarchy
     * @returns The __isHighestParent() method returns a boolean value.
     */
    __isHighestParent() {
        if (this.__getParent() === this) {
            return true
        }
        return false
    }

    /**
     * Returns the highest parent of the current element
     * @returns The highest parent of the current object.
     */
    __getHighestParent() {
        if (this.__isHighestParent()) {
            return this
        }
        if (this.__getParent() instanceof Container)
            return this.__getParent().__getHighestParent()
        else
            return this.__getParent()
    }
}