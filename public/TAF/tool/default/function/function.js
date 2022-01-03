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
export const isValidURL = function isValidURL(str) {
    return (str.substr(0, 4) === 'http' || str.substr(0, 5) === 'https' || str.substr(0, 3) === "www");
}

/**
 *  args start
 *  arg         1: <promise>:Promise (promise to set the timeout)
 *  arg         1: <ms>:int (timeout of the promise)
 *  args end
 *  utility: this function can create a timeout for a specifique promise
 *  example start
 *  
 *  exam    let windPromise = await promiseTimeout(aPromise, 100)
 *  exam    ? return <aPromise> if the promise is resolved in under 100 milliseconds else return undefined
 *  
 *  example end
 *  return a promise with the race of <promise> and new promise with resolved in 100 milliseconds
 *  end: if the timeout expire this promise resolve with an undefined else resolve the current <promise> promise 
 */
export const promiseTimeout = function(promise, ms) {

    // Create a promise that rejects in <ms> milliseconds
    let timeout = new Promise((resolve, reject) => {
        let id = setTimeout(() => {
            clearTimeout(id);
            reject('Timed out in ' + ms + 'ms. on : ' + this)
        }, ms)
    })

    // Returns a race between our timeout and the passed in promise
    return Promise.race([
        promise,
        timeout
    ])
}

/*
    args start
    arg        1: <time>:int (time in ms for the time sleep)
    args end
    utility: this function can create a sleep for a specifique time
    example start

    exam    await sleep(100)

    example end
    require: use await to call the function
    return a promise who self resolved after <time> in milliseconds
*/
export const sleep = async function sleep(time) {
    return new Promise(resolve => setTimeout(resolve, time));
}

export const importScript = async function importScript(path) {
    path = path.substring(path.length - 3, path.length) === ".js" ? path : path + ".js"
    try {
        return await
        import ("../../../" + path)
    } catch (e) { console.error(e) }
}

// info: server side to have post [$content = trim(file_get_contents("php://input"))] or [$content = json_decode(trim(file_get_contents("php://input")))]
// info: restock the session["baseURI"] && session["baseURL"] if the  isn't set
// As with JSON, use the Fetch API & ES6
// base path = "project/creation/.assets/"
// template getFromFile(...args:Array<paths:string||Array<string>, param:Object<from:string=null, typeRet||retType:string="text", data:string||Object<any>, stringify:bool=false, showError:bool=false>>)
// rules:
// rule     1: showError=true => if the file is not found, show an error
// rule     2: from="php" => make a specifique treatement
// rule     3: stringify=true => require if data is an Object
// rule     4: retType="json" => if the return is a stringify json, make a json_encode
// rule     5: retType="text" => if the return is a string, make a trim
export const getFromFile = async function getFromFile(...array) {

    let isArray = Array.isArray(array)
    array = isArray ? Array.from(array) : [array]

    let ret = []
    let promise = []

    await array.asyncForEach(async function([paths, param]) {

        param = typeof param !== "object" || param == null || param == undefined ? {} : param

        // console.log(array)

        let pathIsArray = Array.isArray(paths)
        paths = pathIsArray ? Array.from(paths) : [paths]
        param.method = "POST"
        if (!param.from) { param.from = null }
        if (!param.typeRet) { param.typeRet = !param.retType ? null : param.retType }
        if (!param.data) { param.data = "" }
        if (!param.showError) { param.showError = false }
        if (param.stringify) { param.data = JSON.stringify(param.data) }

        let sort = []
        await paths.asyncForEach(async function(path) {
            let temp = { index: this.index, typeRet: param.typeRet }
            if ((await fetch("TAF/php/verifyFileExists.php", { method: "POST", body: path })
                    .then((response) => {
                        if (response.ok) {
                            return response.text();
                        } else {
                            throw new Error('Server response wasn\'t OK on : ' + path);
                        }
                    })
                    .then(function(json) {
                        return json
                    }.bind(temp))) == "good") {
                promise.push(
                    fetch(path, { method: param.method, body: param.data })
                    .then((response) => {
                        if (response.ok) {
                            return response.text();
                        } else {
                            throw new Error('Server response wasn\'t OK on : ' + path);
                        }
                    })
                    .then(function(json) {
                        switch (this.typeRet) {
                            case "json":
                                json = JSON.parse(json);
                                if (param.from == "php") {
                                    json = Object.values(json)[0]
                                }
                        }
                        this.response = json
                    }.bind(temp))
                    .catch(err => console.warn(err))
                );
            } else {
                if (param.showError) {
                    console.error("function.js:137 POST " + path + " 404 (Not Found)")
                    console.warn("File not found : " + path)
                }
                promise.push([undefined])
            }
            sort.push(temp)
        });
        ret.push(sort)
    });
    await Promise.all(promise);
    let temp = []
    ret.forEach(function(item) {
        ret = [];
        if (item.length == 1) {
            ret = item[0].response
        } else {
            item.forEach(function(item2) {
                ret.push(item2.response)
            })
        }
        temp.push(ret)
    });
    if (ret != undefined && ret.length == 1) {
        return ret[0]
    } else {
        return ret
    }
};

window.getFromFile = getFromFile;

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