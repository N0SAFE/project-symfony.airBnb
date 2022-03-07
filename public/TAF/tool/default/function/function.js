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
 *  args start
 *  arg         1: <str>:string (string to verify)
 *  args end
 *  utility: verify if a string is a validURL
 *  return true if valid, false if not
 */
export const isValidURL = function(str) {
    try {
        new URL(str);
        return true;
    } catch (_) {
        return false;
    }
}

export const importScript = async function importScript(path) {
    console.error()
    path = path.substring(path.length - 3, path.length) === ".js" ? path : path + ".js"
    try {
        window.module = {}
        return {
            script: await
            import ((isValidURL(path) ? "" : dirname(
                import.meta.url, 4) + "/") + path),
            module: {...module },
            absoluteHref: (isValidURL(path) ? "" : dirname(
                import.meta.url, 4) + "/") + path
        }
    } catch (e) { console.error(e) }
}

export const setFormData = (obj) => {
    const formData = new FormData();
    Object.keys(obj).forEach(key => formData.append(key, typeof obj[key] !== "string" ? JSON.stringify(obj[key]) : obj[key]));
    return formData;
}

export const autoFunction = function autoFunction(func, ...args) {
    return func(...args)
}

export const getPathFromServer = async function getPathFromServer(path) {
    let div = document.createElement('div')
    div.innerHTML = await getFromFile("php/getPath.php", { method: "POST", data: path })
    return div.cloneNode(true)
}

export const getProcessTime = async function getProcessTime(callback, args, treatementProcess) {
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

export const getRandomInt = function getRandomInt(max, min = null) {
    if (min == null) {
        return Math.floor(Math.random() * max);
    } else {
        return clamp(Math.floor(Math.random() * max), min, max)
    }
}

/*
    args start:
    arg      1: number
    arg      2: min
    arg      3: max
    args end
    utility: clamp a value between a min and a max
    example start:
    exam      1: clamp(5, 1, 10) = 5
    exam      2: clamp(0, 1, 10) = 1
    exam      3: clamp(11, 1, 10) = 10
    example end
    return the clamped value between min and max
*/
export const clamp = function clamp(num, min, max) {
    return Math.min(Math.max(num, min), max);
}

export const setAttributeLoop = function setAttributeLoop(element, arrayKey, arrayValue) {
    if (arrayKey.length != arrayValue.length) {
        throw "the two array as not the same length"
    }
    for (var i = 0; i < arrayKey.length; i++) {
        element.setAttribute(arrayKey[i], arrayValue[i]);
    }
}

export const appendChildLoop = function appendChildLoop(arrayParent, arrayChild) {
    if (arrayKey.length != arrayValue.length) {
        throw "the two array as not the same length"
    }
    for (var i = 0; i < arrayParent.length; i++) {
        arrayParent[i].appendChild(arrayChild[i])
    }
}

export const addClassLoop = function addClassLoop(arrayElement, arrayClass, elementIsSame = true) {
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

export const removeClassLoop = function removeClassLoop(arrayElement, arrayClass, elementIsSame = true) {
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

export const addFocus = function addFocus(x, element) {
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
export const removeFocus = function removeFocus(x, element) {
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
export const loopTestInputOnFocus = function LoopTestInputOnFocus(x, element) {
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
export const setCursorRealTimeInput = function setCursorRealTimeInput(x) {
    return x.value.slice(0, x.selectionStart) + "<span>|</span>" + x.value.slice(x.selectionStart, x.value.length)
}
export const returnSelfForValueDict = function returnSelfForValueDict(dict, index, elementToCatch) {
    var temp = null
    Object.entries(dict).forEach(([key, value]) => {
        if (value[index] == elementToCatch) {
            temp = key;
            return 0;
        }
    });
    return temp;
}

export const returnElementFromDictArray = function returnElementFromDictArray(index1, index2, dict, elementToCatch) {
    return dict[returnSelfForValueDict(dict, index1, elementToCatch)][index2]
}

export const getDatasetValueFromArrayNode = function getDatasetValueFromArrayNode(array, dataset, valueToSearch, Default = undefined) {
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

export const createIdBase = function createIdBase(base, len) {
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

export const personalizeSwitch = function personalizeSwitch(condition, array) {
    array.forEach(element => {
        if (element["value"] === condition) {
            console.log("test")
            element["function"]()
        }
    })
}

export const unzipArray = (array) => {
    var ret = []
    array.forEach(element => {
        ret.push(...element)
    })
    return ret
}


export const getFunctionParams = (func) => {
    let fnStr = func.toString().replace(/(\/\/.*$)|(\/\*[\s\S]*?\*\/)|(\s*=[^,\)]*(('(?:\\'|[^'\r\n])*')|("(?:\\"|[^"\r\n])*"))|(\s*=[^,\)]*))/mg, '');
    let result = fnStr.slice(fnStr.indexOf('(') + 1, fnStr.indexOf(')')).match(/([^\s,]+)/g);
    return result === null ? [] : result;
}


export const redirect = (url, time = 0) => {
    setTimeout(() => {
        window.location.replace(url)
    }, time)
}


export const filename = (path) => {
    return path.split('/').pop()
}

export const dirname = (path, deep = 1) => {
    path = path.replace("\\", "/")
    for (let i = 0; i < deep; i++) {
        path = path.split('/').reverse().slice(1).reverse().join('/')
    }
    return path;
}

// this function will be attached to an object or call by the call(obj) function
export const setDefault = function setDefault(attributeName, defaultValue, verifFunction = undefined) {
    let toTest = this[attributeName]
    if (toTest == undefined) {
        return this[attributeName] = defaultValue
    }
    if (typeof verifFunction === "function" && !verifFunction(toTest)) {
        return this[attributeName] = defaultValue
    }
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