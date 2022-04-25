// test
export const unzip = function(array) {
    let length = array.length,
        result = [],
        index = 0,
        resIndex = 0;

    while (index < length) {
        result[resIndex++] = array[index++];
        result[resIndex++] = array[index++];
    }
    return result;
}

// test


export const removeItemOnce = function removeItemOnce() {
    let arr, value
    if (this) {
        arr = this
        value = arguments[0]
    } else {
        arr = arguments[0]
        value = arguments[1]
    }
    var index = arr.indexOf(value);
    if (index > -1) {
        arr.splice(index, 1);
    }
    return arr;
}

export const removeItemAll = function removeItemAll() {
    let arr, value
    if (this) {
        arr = this
        value = arguments[0]
    } else {
        arr = arguments[0]
        value = arguments[1]
    }

    var i = 0;
    while (i < arr.length) {
        if (arr[i] === value) {
            arr.splice(i, 1);
        } else {
            ++i;
        }
    }
    return arr;
}

export const pushOnce = function pushOnce() {
    let arr, value
    if (this) {
        arr = this
        value = arguments[0]
    } else {
        arr = arguments[0]
        value = arguments[1]
    }
    if (arr.includes(value)) {
        return
    }
    arr.push(value)
}



export const compare = function compare() {
    let arr1, arr2
    if (this) {
        arr1 = this
        arr2 = arguments[0]
    } else {
        arr1 = arguments[0]
        arr2 = arguments[1]
    }
}

export const compareDeep = function compareDeep() {
    let arr1, arr2
    if (this) {
        arr1 = this
        arr2 = arguments[0]
    } else {
        arr1 = arguments[0]
        arr2 = arguments[1]
    }
}

export const has = function has() {
    let arr1, arr2
    if (this) {
        arr1 = this
        arr2 = arguments[0]
    } else {
        arr1 = arguments[0]
        arr2 = arguments[1]
    }

    return arr2.every(function(item) {
        return arr1.includes(item)
    })
}
export const arrayTypeOf = function() {
    let arr, args
    if (this) {
        if (arguments.length < 1) {
            throw new ReferenceError("the arrayTypeOf with this args can not have less than 1 arguments")
        }
        arr = this
        args = Array.from(arguments).slice(0)
    } else {
        if (arguments.length < 2) {
            throw new ReferenceError("the arrayTypeOf with this args can not have less than 2 arguments")
        }
        arr = arguments[0]
        args = Array.from(arguments).slice(1)
    }
    console.log(arguments)
    if (!Array.isArray(arr)) {
        throw new TypeError("the array as to be of type array")
    }
    console.log(arr)
    return arr.every(function(item) {
        return args.includes(typeof item)
    })
}

export const arrayInstanceOf = function() {
    let arr, args
    if (this) {
        if (arguments.length < 1) {
            throw new ReferenceError("the arrayInstanceOf with this args can not have less than 1 arguments")
        }
        arr = this
        args = Array.from(arguments).slice(0)
    } else {
        if (arguments.length < 2) {
            throw new ReferenceError("the arrayInstanceOf with this args can not have less than 2 arguments")
        }
        arr = arguments[0]
        args = Array.from(arguments).slice(1)
    }
    return arr.every(function(item) {
        return !!args.find(function(item_item) {
            return item instanceof item_item
        })
    })
}

export const findBy = function findBy() {
    // dev
    console.log(arguments)
    let arr, type, toFind
    if (this) {
        arr = this
        type = arguments[0]
        toFind = arguments[1]
    } else {
        arr = arguments[0]
        type = arguments[1]
        toFind = arguments[2]
    }
    if (!arrayTypeOf([toFind], "string")) {
        throw new ReferenceError("the toFind val as to be type of string")
    }
    if (!arrayInstanceOf(arr, Object)) {
        throw new ReferenceError("the arr val as to be type of Object")
    }
    return arr.filter(function(item) {
        return item[type] == toFind
    })
}

export const findOneBy = function findOneBy() {
    // dev
    let arr, type, toFind
    if (this) {
        arr = this
        type = arguments[0]
        toFind = arguments[1]
    } else {
        arr = arguments[0]
        type = arguments[1]
        toFind = arguments[2]
    }
    if (!arrayTypeOf(toFind, "string")) {
        throw new ReferenceError("the toFind val as to be type of string")
    }
    if (!arrayInstanceOf(arr, Object)) {
        throw new ReferenceError("the arr val as to be type of Object")
    }
    return arr.find(function(item) {
        return item[type] == toFind
    })
}

export const remove = () => {
    let arr, func
    if (this) {
        arr = this
        func = arguments[0]
        thisArg = arguments[1]
    } else {
        arr = arguments[0]
        func = arguments[1]
        thisArg = arguments[2]
    }
    if (!thisArg) {
        thisArg = arr
    }
    let index = arr.findIndex(func.bind(thisArg))
    if (index != -1) {
        return arr.splice(index, 1)[0]
    }
    return undefined
}