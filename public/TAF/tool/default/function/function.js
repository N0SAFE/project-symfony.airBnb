import * as TimerClasse from "./Timer.js"

// util
export const Timer = class Timer {
    // ! all can be:    stop with stop()
    // !                pause with pause()
    // !                start/restart with start()
    // !                return state with getStateRunning()
    // !                return time left with getTimeLeft()

    // ! func with exec after can set the func to exec after with setFunction(Function, ...args)

    // ! set timer with function in end
    static timeout(Function, delay, ...funcArgs) {
        return new TimerClasse.TimerTimeout(Function, delay, ...funcArgs)
    }

    // ! run an infinit loop and run first loop after timinig
    static infinityLooper(Function, delay, ...funcArgs) {
        return new TimerClasse.TimerInfinityReapeter(Function, delay, ...funcArgs)
    }

    // ! run an infinit loop and run instant 
    static infinityLooperInstant(Function, delay, ...funcArgs) {
        return new TimerClasse.TimerInfinityReapeterInstant(Function, delay, ...funcArgs)
    }

    // ! run a loop with number of loop in argument and run first loop after timing
    static looper(Function, delay, numberOfLoop, ...funcArgs) {
        return new TimerClasse.TimerReapeter(Function, delay, numberOfLoop, ...funcArgs)
    }

    // ! run a loop with number of loop in argument and run execution instant
    static looperInstant(Function, delay, numberOfLoop, ...funcArgs) {
        return new TimerClasse.TimerReapeterInstant(Function, delay, numberOfLoop, ...funcArgs)
    }

    // ! run a loop with number of loop in argument, run first loop after timing and run a function after the loop as finish
    static looperRunAfter(Function, delay, numberOfLoop, ...funcArgs) {
        return new TimerClasse.TimerReapeaterWithFunctionAfter(Function, delay, numberOfLoop, ...funcArgs)
    }

    // ! run a loop with number of loop in argument, run execution instant and run a function after the loop as finish
    static looperInstantRunAfter(Function, delay, numberOfLoop, ...funcArgs) {
        return new TimerClasse.TimerReapeaterInstantWithFunctionAfter(Function, delay, numberOfLoop, ...funcArgs)
    }
}

/**
 * Check if a string is a valid URL
 * @param str - The string to test.
 * @returns The URL is being validated. If it is valid, it will return true. If it is not valid, it
 * will return false.
 */
export const isValidURL = (str) => {
    try {
        new URL(str);
        return true;
    } catch (_) {
        return false;
    }
}

/**
 * It imports a JavaScript file from the specified path.
 * @param path - The path to the script you want to import.
 * @returns The script is being imported and the module is being returned.
 */
export const importScript = async(path) => {
    if (!isValidURL(path)) {
        path = path.substring(path.length - 3, path.length) === ".js" ? path : path + ".js"
    }
    TAF.export[path] = {}
    return {
        script: await
        import ((isValidURL(path) ? "" : dirname(
            import.meta.url, 4) + "/") + path),
        module: {...TAF.export[path] },
        href: (isValidURL(path) ? "" : dirname(
            import.meta.url, 4) + "/") + path
    }
}

/**
 * It takes an object and converts it to a form data object.
 * @param obj - The object that contains the data to be sent to the server.
 * @returns The formData object.
 */
export const setFormData = (obj) => {
    const formData = new FormData();
    Object.keys(obj).forEach(key => formData.append(key, typeof obj[key] !== "string" ? JSON.stringify(obj[key]) : obj[key]));
    return formData;
}

/**
 * It takes a function and any number of arguments and returns the result of the function.
 * @param func - the function to be called
 * @param args - The arguments to pass to the function.
 * @returns The result of the function call.
 */
export const autoFunction = (func, ...args) => {
    return func(...args)
}

/**
 * It measures the time it takes to execute a function.
 * @param callback - The function that will be executed.
 * @param args - The arguments to pass to the callback function.
 * @param treatementProcess - a function that will be called after the callback function is executed.
 * @returns The return value of the callback function.
 */
export const getProcessTime = async(callback, args, treatementProcess) => {
    if (!Array.isArray(args)) { args = [args] }
    if (typeof treatementProcess != "function" && treatementProcess != undefined) {
        treatementProcess = undefined;
        console.warn("treatementProcess must be a function")
    }
    let temp = performance.now()
    let ret = await callback(...args)
    if (treatementProcess == undefined) {
        console.table([{
            process: callback,
            time: (performance.now() - temp) + " ms"
        }])
    } else {
        treatementProcess(performance.now() - temp)
    }
    return ret
}

/**
 * Generate a random integer between the specified minimum and maximum values
 * @param max - The maximum value to return.
 * @param [min=null] - The minimum value to return.
 * @returns A random integer between the min and max values.
 */
export const getRandomInt = (max, min = null) => {
    if (min == null) {
        return Math.floor(Math.random() * max);
    } else {
        return clamp(Math.floor(Math.random() * max), min, max)
    }
}

/**
 * Given a number, return the number if it is between a minimum and maximum value, otherwise return the
 * minimum or maximum value
 * @param num - The number you want to clamp.
 * @param min - The minimum value to return.
 * @param max - The maximum value to return.
 * @returns The value of the input number, clamped between the min and max values.
 */
export const clamp = (num, min, max) => {
    return Math.min(Math.max(num, min), max);
}

export const setAttributeLoop = (element, arrayKey, arrayValue) => {
    if (arrayKey.length != arrayValue.length) {
        throw "the two array as not the same length"
    }
    for (var i = 0; i < arrayKey.length; i++) {
        element.setAttribute(arrayKey[i], arrayValue[i]);
    }
}

export const appendChildLoop = (arrayParent, arrayChild) => {
    if (arrayKey.length != arrayValue.length) {
        throw "the two array as not the same length"
    }
    for (var i = 0; i < arrayParent.length; i++) {
        arrayParent[i].appendChild(arrayChild[i])
    }
}

export const addClassLoop = (arrayElement, arrayClass, elementIsSame = true) => {
    if (!elementIsSame) {
        if (arrayElement.length != arrayClass.length) {
            throw "the two array as not the same length"
        }
        for (var i = 0; i < arrayElement.length; i++) {
            arrayElement[i].classList.add(arrayClass[i])
        }
    } else {
        for (var i = 0; i < arrayClass.length; i++) {
            arrayElement.classList.add(arrayClass[i])
        }
    }
}

export const removeClassLoop = (arrayElement, arrayClass, elementIsSame = true) => {
    if (!elementIsSame) {
        if (arrayElement.length != arrayClass.length) {
            throw "the two array as not the same length"
        }
        for (var i = 0; i < arrayElement.length; i++) {
            arrayElement[i].classList.remove(arrayClass[i])
        }
    } else {
        for (var i = 0; i < arrayClass.length; i++) {
            arrayElement.classList.remove(arrayClass[i])
        }
    }
}

export const addFocus = (x, element) => {
    x.classList.add('isFocus');
    if (x.type == "textarea") {
        element.classList.add('focusElement');
    } else {
        element.classList.add('focusElement');
    }
    console.log(element)
    console.log(x)
    LoopTestInputOnFocus(x, element);
}
export const removeFocus = (x, element) => {
    x.classList.remove('isFocus');
    if (x.type == "textarea") {
        try {
            element.removeChild(element.getElementsByTagName("span")[0])
        } catch {}
        element.classList.remove('focusElement');
    } else {
        try {
            element.removeChild(element.getElementsByTagName("span")[0])
        } catch {}
        element.classList.remove('focusElement');
    }
}
export const loopTestInputOnFocus = (x, element) => {
    var name;
    var box;
    if (x.classList.contains('isFocus')) {
        if (x.type == "textarea") {
            box = element;
            name = box.dataset.nsTextArea;
            // console.log(name);
        } else {
            box = element;
            name = box.dataset.nsText;
            // console.log(name);
        }
        // console.log(x.value)
        if (x.value) {
            box.innerHTML = setCursorRealTimeInput(x);
        } else if (name) {
            box.innerHTML = name;
        } else {
            box.innerHTML = "Lorem Ipsum";
        }
        setTimeout(function() {
            LoopTestInputOnFocus(x, element);
        }, 100);
    }
}

/**
 * The function takes in a textarea element and returns the textarea's value with a "|" character
 * inserted at the cursor's current position
 * @param x - the real time input element
 * @returns The value of the input field, but with a pipe character inserted at the cursor position.
 */

export const setCursorRealTimeInput = (x) => {
    return x.value.slice(0, x.selectionStart) + "<span>|</span>" + x.value.slice(x.selectionStart, x.value.length)
}

/**
 * Given a dictionary, return the key of the dictionary that has the value that matches the
 * elementToCatch
 * @param dict - the dictionary you want to search
 * @param index - the index of the value you want to return
 * @param elementToCatch - the value you want to return
 * @returns The key of the dictionary that has the value that matches the elementToCatch.
 */
export const returnSelfForValueDict = (dict, index, elementToCatch) => {
    var temp = null
    Object.entries(dict).forEach(([key, value]) => {
        if (value[index] == elementToCatch) {
            temp = key;
            return 0;
        }
    });
    return temp;
}

/**
 * Given a dictionary of arrays, return the element at the given index of the array at the given index
 * of the dictionary
 * @param index1 - the index of the element in the array that you want to return
 * @param index2 - the index of the element in the array that you want to return.
 * @param dict - the dictionary to search
 * @param elementToCatch - The element that you want to return the value of.
 * @returns The value of the element in the array that is being returned.
 */

export const returnElementFromDictArray = (index1, index2, dict, elementToCatch) => {
    return dict[returnSelfForValueDict(dict, index1, elementToCatch)][index2]
}

/**
 * Given an array of elements, a dataset name, and a value to search for, return the element that has
 * the dataset name and value
 * @param {Array} array - The array to search through.
 * @param {string} dataset - The name of the dataset to search for.
 * @param valueToSearch - The value of the dataset attribute that you want to search for.
 * @param [Default] - The default value to return if the value is not found.
 * @returns The element that has the dataset value of valueToSearch.
 */
export const getDatasetValueFromArrayNode = (array, dataset, valueToSearch, Default = undefined) => {
    let ret = Default
    Array.from(array).every(element => {
        if (element.dataset[dataset] == valueToSearch) {
            ret = element
            return false
        }
        return true
    })
    return ret
}

/**
 * Create a random string of characters of a given length using a given base
 * @param base - The base to use.
 * @param len - The length of the random string to be generated.
 * @returns A random string of characters.
 */
export const createIdBase = (base, len) => {
    var optionBase = [10, 2, 64, 16]
    var strBase;
    switch (base) {
        case (optionBase[0]):
            strBase = "0123456789"
            break
        case (optionBase[1]):
            strBase = "01"
            break
        case (optionBase[2]):
            strBase = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_!"
            break
        case (optionBase[3]):
            strBase = "0123456789abcdef"
            break
    }
    var ret = ""
    for (var i = 0; i < len; i++) {
        ret += strBase[getRandomInt(strBase.length)]
    }
    return ret
}


/**
 * Given a condition and an array of arrays, where each array has two elements, the first element is a
 * condition, and the second element is a function, the function will execute the function
 * corresponding to the first element that matches the condition
 * @param condition - The condition to check for.
 * @param array - an array of arrays. Each array has two elements: the first is a condition, and the
 * second is a function.
 */
export const personalizeSwitch = (condition, array) => {
    array.forEach(element => {
        if (element[0] === condition) {
            element[1]()
        }
    })
}

/**
 * Unzip an array of arrays into a single array
 * @param array - The array to be unzipped.
 * @returns An array of all the elements in the original array.
 */
export const unzipArray = (array) => {
    var ret = []
    array.forEach(element => {
        ret.push(...element)
    })
    return ret
}


/**
 * Get the parameters of a function
 * @param func - The function to get the parameters from.
 * @returns An array of the parameters of the function.
 */
export const getFunctionParams = (func) => {
    let fnStr = func.toString().replace(/(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg, '');
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
    return result === null ? [] : result;
}

/**
 * Redirects the user to a new url
 * @param url - The URL to redirect to.
 * @param [time=0] - The time in milliseconds to wait before redirecting.
 */

export const redirect = (url, time = 0) => {
    setTimeout(() => {
        window.location.replace(url)
    }, time)
}


/**
 * Given a path, return the filename
 * @param path - The path to the file you want to download
 * @returns The last item in the array.
 */
export const filename = (path) => {
    return path.split('/').pop()
}

/**
 * Given a path, return the path of the parent directory
 * @param path - The path to the file or directory.
 * @param [deep=1] - The number of directories to go up.
 * @returns The directory name of the path.
 */
export const dirname = (path, deep = 1) => {
    path = path.replace("\\", "/")
    for (let i = 0; i < deep; i++) {
        path = path.split('/').reverse().slice(1).reverse().join('/')
    }
    return path;
}

/**
 * If the attribute is undefined, set it to the default value. If the attribute is defined, and if the
 * verifFunction is defined and returns true, then set the attribute to the default value
 * @param attributeName - the name of the attribute to set.
 * @param defaultValue - the default value to set if the attribute is undefined or if the verifFunction
 * returns false.
 * @param [verifFunction] - A function that takes the value of the attribute and returns a boolean. If
 * the function returns false, the attribute is set to the default value.
 * @error throw an error if the function is not attached to an object
 * @returns Nothing.
 */
export function setDefault(attributeName, defaultValue, verifFunction = undefined) {
    if (this)
        throw new Error("this function must be attached to an object")
    let toTest = this[attributeName]
    if (toTest == undefined) {
        return this[attributeName] = defaultValue
    }
    if (typeof verifFunction === "function" && !verifFunction(toTest)) {
        return this[attributeName] = defaultValue
    }
}

/**
 * If the function throws an error when called, and the error message starts with "Class constructor",
 * then it's a class
 * @param v - The value to check.
 * @returns A function that returns a boolean.
 */
export function isClass(v) {
    return typeof v === 'function' && v.prototype.constructor === v;
}


/**
for function and class:
// info: une info importante
// !warning: un avertissement
// args start:
// arg      1: {nom de l'argument:type => explication}
// arg      2: {nom de l'argument:type => explication}
// arg      3: {nom de l'argument:type => explication}
// arg      etc...
// args end:
// utility: explication de l'utilité de la fonction
// example start:
// exam   {
// exam       example de code
// exam   }   
// example end
// require start:
// requ   {
// requ       indiquer les script requis et les prerequis pour l'utilisation de la function   // ex: require('fs')
// requ       ou require l'utilisation de await
// requ   }
// require end
// return: arg1, arg2, arg3, etc...
// end: un text supplementaire qui explique comment utiliser l'object de retour

for all:
// templates: int ou [...args] ou {...args} ----> example :(Object<any>)
*/