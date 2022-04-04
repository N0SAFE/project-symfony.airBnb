import { importScript, isValidURL, dirname, autoFunction } from "../function/function.js"
// util
// this class is used to load the script in the order (no load override another for the window.PARAMS)

// function logLoadedBy(packageName, StackFrameArray, params) {
//     if (StackFrameArray.length == 0) {
//         return {
//             loaded: packageName,
//             type: "scriptLoader",
//             method: params.method,
//             arg: params.arg,
//             reason: params.reason
//         }
//     } else {
//         return {
//             loaded: packageName,
//             loader: StackFrameArray[0].fileName.replaceAll("async", "").trim() + ":" + StackFrameArray[0].getLineNumber() + ":" + StackFrameArray[0].getColumnNumber(),
//             type: "scriptLoader",
//             method: params.method,
//             arg: params.arg,
//             reason: params.reason
//         }
//     }
// }

// function sendEvent(obj, error, params) {
//     if (TAF && TAF.module && TAF.module.dev)
//         TAF.module.dev.send(logLoadedBy(obj, TAF.module.error.ErrorStackParser.parseWithAvoid([{
//             fileName: TAF.baseLocation + "module/default/loader/ScriptLoader.js"
//         }, {
//             fileName: TAF.baseLocation + "ini/ini.js"
//         }, {
//             fileName: TAF.baseLocation + "module/default/prototype.modifier.js",
//             line: 85
//         }, {
//             fileName: TAF.baseLocation + "module/default/dev/app.js"
//         }], error), params))
// }

// sendEvent(this.loaded[name], new Error(), { arg: "tryLoad", method: "load" })
// sendEvent(this.loaded[name], new Error(), { ok: true, method: "load" })
// sendEvent(loaded, new Error(), { ok: true, method: "call" })


// const orderLoad = new(class ScriptLoaderStatic {
//     loadArray = []
//     id = 0
//     treatment = false
//     async stop(callback, ...args) {
//         let id = this.id++;
//         this.loadArray.push({ id, callback })
//         let length = this.loadArray.length
//         console.log(length)
//         let iter = 0
//         while (length >= this.loadArray.length && length != 1 && iter < 10000) {
//             iter++
//         }
//         console.log(length)
//         console.log(this.loadArray.length)
//         if (iter == 10000) {
//             console.error("over iter")
//         }
//         let ret = await callback(function() {
//             this.suprId(id)
//         }.bind(this), ...args)
//         return ret
//     }
//     suprId(id) {
//         this.loadArray.splice(this.loadArray.findIndex(obj => obj.id == id))
//         console.log("supr")
//     }
// })


/**
 * Container is a class that can be used to create a hierarchical structure of objects. 
 */
class Container {
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

class StackContainer {
    stack = TAF.module.error.ErrorStackParser.parseWithAvoid([{
        fileName: import.meta.url
    }], new Error())
    getLast = function() {
        return this.stack[0]
    }
    getStack = function() {
        return this.stack
    }
}


export default new(class ScriptLoader {

    package = []

    /* the ScriptLoader obj loaded. */
    loaded = {}

    /* Creating an object called event that has two properties, load and call. */
    event = { load: [], call: [] }

    /* Importing a script from a URL. */
    importScript = importScript

    ini() {
        window.TAF.PARAMS = new class PARAMS {

        }
        window.TAF.getParams = function(url) {
            return this.PARAMS[url]
        }
        delete this.ini
    }

    parseJson(json, location, addToName) {
        const forbiddenWord = ["__realName__", "__global__"]

        // params is temp
        const defaultWord = [...forbiddenWord, "path", "url", "sort", "require", "params", "styles", "src"]

        const array = []

        let addToObj = function(obj, objToAdd) {
            Object.entries(objToAdd).forEach(function([key, val]) {
                if (obj[key] == undefined) {
                    obj[key] = val
                    return
                }
                if (Array.isArray(obj[key])) {
                    if (Array.isArray(val)) {
                        val.forEach(function(val_val) {
                            obj[key].push(val_val)
                        })
                        return
                    }
                    obj[key].push(val)
                    return
                }
                if (typeof obj[key] == "object") {
                    if (typeof val == "object") {
                        Object.entries(val).forEach(function([key_val, val_val]) {
                            obj[key][key_val] = val_val
                        })
                        return
                    }
                    throw new Error("an error occure when try to parse the package.TAF.json")
                }
            })
        }

        let add = function(val, name, actualObj, customProcessObj) {
            let obj = {...actualObj }
            addToObj(obj, val)
            obj.name = name.substring(1)



            if (Array.isArray(obj.path)) {
                let strRet = ""
                for (let i = 0; i < obj.path[0]; i++) {
                    strRet += "../"
                }
                obj.path = strRet + obj.path[1]
            }

            if (obj.path) {
                obj.path = new URL(location + obj.name + "/../" + obj.path).href
            }

            if (obj.name.split("/")[obj.name.split("/").length - 1] == "__repo__") {
                obj.name = obj.name.split("/").reverse().splice(1).reverse().join("/")
            }

            if (obj.name.split("/")[0] == "default") {
                obj.name = obj.name.split("/").splice(1).join("/")
            }

            if (addToName) {
                obj.name = addToName + "/" + obj.name
            }

            if (obj["__custom-processing__"]) {
                if (obj["__custom-processing__"].__parent__) {
                    if (obj["__custom-processing__"].__override__ != false) {
                        Object.assign(customProcessObj, obj["__custom-processing__"])
                    } else {
                        Object.entries(obj["__custom-processing__"]).forEach(function([key, val]) {
                            if (customProcessObj[key] == undefined) {
                                customProcessObj[key] = val
                            }
                        })
                    }
                } else {
                    customProcessObj = obj["__custom-processing__"]
                }
                delete obj["__custom-processing__"]
            }
            obj.customProcessObj = customProcessObj

            if (!obj.url) {
                obj.url = obj.path
                delete obj.path
            }

            obj.name = obj.name.toLowerCase()


            array.push(obj)
        }

        let temp = function(obj, actualName, actualObj, customProcessObj) {
            customProcessObj = {...customProcessObj }
            actualObj = {...actualObj }
            if (obj["__custom-processing__"]) {
                if (obj["__custom-processing__"].__parent__) {
                    if (obj["__custom-processing__"].__override__ != false) {
                        Object.assign(customProcessObj, obj["__custom-processing__"])
                    } else {
                        Object.entries(obj["__custom-processing__"]).forEach(function([key, val]) {
                            if (customProcessObj[key] == undefined) {
                                customProcessObj[key] = val
                            }
                        })
                    }
                } else {
                    customProcessObj = obj["__custom-processing__"]
                }
            }

            Object.entries(obj).forEach(function([key, val]) {
                let name = actualName + "/" + (val.__realName__ != undefined ? val.__realName__ : key)
                if (forbiddenWord.includes(key)) {
                    return
                }
                if (val.url != undefined || val.path != undefined) {
                    add(val, name, actualObj, customProcessObj)
                    return
                } else {
                    if (val.__global__) {
                        addToObj(actualObj, val.__global__)
                    }
                    if (!(val instanceof Object)) {
                        return
                    }
                    temp(val, name, actualObj, customProcessObj)
                }
            })
        }

        temp(json, "", {}, {})

        this.package = [...array, ...this.package]
        delete this.parseJson
    }

    // callback is : callback(object:Object<module:Object, ini func:Object, sort:string>)
    addListener(event, callback) {
        if (event == "load") {
            this.event.load.push(callback);
        } else if (event == "call") {
            this.event.call.push(callback);
        }
    }

    getPackage() {
        return this.package
    }

    getLoaded() {
        return this.loaded
    }

    getLoadedBySort(sort = undefined) {
        return Array.from(Object.entries(this.loaded).filter(function([path, object]) {
            if (typeof object.sort == "string" && object.sort.includes(sort)) {
                return true
            }
        }).map(function([path, object]) {
            let obj = {...object }
            obj.path = path
            return obj
        }))
    }

    getBaseLocation() {
        return TAF.info.baseLocation
    }

    getCalleeStackFrame = function() {
        return (new StackContainer).getLast()
    }

    findBy = function(toFind, type) {
        return this.package.find(function(obj) {
            return obj[type] == toFind
        })
    }

    findAllBy = function(toFind, type) {
        return this.package.filter(function(obj) {
            return obj[type] == toFind
        })
    }

    findAllMatch = function(toFind, type) {
        return this.package.filter(function(obj) {
            if (typeof obj[type] == "string")
                return obj[type].includes(toFind)
        })
    }

    LOAD = new class extends Container {
        constructor(parent) {
            super(parent, { id: "LOAD" })
        }

        function = new class extends Container {
            constructor(parent) {
                super(parent)
            }

            addRequireModuleToWindowParams = function(
                href,
                iniFunc,
                args,
                sort,
                params,
                styles,
                src,
                require,
                name
            ) {
                window.TAF.PARAMS[href] = {
                    get: function(scriptName, funcName = undefined) {
                        return this.require[scriptName][funcName] != undefined ? this.require[scriptName][funcName] : this.require[scriptName]
                    },
                    call: {
                        href,
                        iniFunc,
                        args,
                        sort,
                        params,
                        styles,
                        src,
                        require,
                        name
                    },
                    require: {...require }
                }
            }

            requireFunction = async(
                array
            ) => {
                const ScriptLoader = this.__getHighestParent()
                let require = array == undefined ? undefined :
                    await Promise.all((array instanceof Array ?
                        array : [array]
                    ).map(await async function({ script, use }) {
                        if (!Array.isArray(use) && use) { use = [use] }
                        let module = await ScriptLoader.isLoaded(script) ? ScriptLoader.call(script) : await ScriptLoader.load(script, null, null, null, { inner: true });
                        use = new Set(use == undefined ? Object.entries(Object.assign({}, module)).map(([name, content]) => { if (name != "|__-/name\\-__|") { return { name, content } } }) : use.map(function(use) { return { name: use, content: module[use] } }))
                        use.add({ name: "|__-/name\\-__|", content: module["|__-/name\\-__|"] })
                        use.delete(undefined)
                        let ret = {}
                        for (let { name, content }
                            of use) {
                            ret[name] = content
                        }
                        return { script, use: ret }
                    }))

                if (require != undefined) {
                    let temp = {}
                    for (let value of Object.values(require)) {
                        if (temp[value.script] != undefined) {
                            Object.assign(temp[value.script], value.use)
                        } else {
                            temp[value.script] = value.use
                        }
                    }
                    require = temp
                }
                return require
            }

            customProcessFunction = function(customProcessObj, type) {
                // type = after or before
            }
        }(this)


        verif = new class extends Container {
            constructor(parent) {
                super(parent)
            }

            urlPath = function(
                url
            ) {
                const scriptLoader = this.__getHighestParent()
                let tempObj
                if (tempObj = scriptLoader.findBy(url, "url"))
                    return { ret: scriptLoader.load(tempObj.name) }
            }

            /* The above code is a function that returns a JavaScript object. */
            rootPath = function(
                href,
                params,
                name
            ) {

                const scriptLoader = this.__getHighestParent()
                href = TAF.info.baseLocation + href.substring(1)
                let tempObj
                if (tempObj = scriptLoader.findBy(href, "url"))
                    return { ret: scriptLoader.load(tempObj.name) }

                if (params.name !== undefined) {
                    name = "BASE/" + params.name
                }

                return { href, name }

            }

            relativePath = function(
                href,
                params,
                name
            ) {

                const scriptLoader = this.__getHighestParent()
                href = new URL(scriptLoader.getCalleeStackFrame().getFileName().split("/").slice(0, -1).join("/") + "/" + href.substring(2)).href
                let tempObj
                if (tempObj = scriptLoader.findBy(href, "url"))
                    return { ret: scriptLoader.load(tempObj.name) }

                if (params.name !== undefined) {
                    name = "PROJECT/" + params.name
                }

                return { href, name }

            }

            namePath = async function(
                name
            ) {
                const scriptLoader = this.__getHighestParent()
                const requireFunction = this.__getParentById("LOAD").function.requireFunction
                let tempObj
                if (tempObj = scriptLoader.findBy(name.toLowerCase(), "name")) {
                    return {
                        href: tempObj.url,
                        require: await requireFunction(tempObj.require),
                        sort: tempObj.sort,
                        params: tempObj.params
                    }
                }
                throw new Error("the name " + name + " does not exist in config file")
            }
        }(this)
    }(this)

    async load(
        defaultHref
    ) {
        if (defaultHref instanceof Object)
            defaultHref = defaultHref.path
        if (defaultHref == undefined) {
            return false;
        }

        let params = {};
        let href = defaultHref
        let name
        let require
        let styles = []
        let src = []
        let iniFunc
        let args
        let sort
        let calledBy
        let ret

        href = href.replace("\\", "/")
        name = href

        if (isValidURL(href)) {

            ({ ret } = this.LOAD.verif.urlPath)
            if (ret) return ret
            calledBy = "url"

        } else if (href.substring(0, 2) == "./") {

            ({ href, name } = this.LOAD.verif.relativePath(href, params, name))
            calledBy = "relative"

        } else if (href.substring(0, 1) == "/") {

            ({ href, name, ret } = this.LOAD.verif.rootPath(href, params, name))
            if (ret) return ret
            calledBy = "internal"

        } else {

            ({ href, require, sort, params } = await this.LOAD.verif.namePath(name))
            calledBy = "name"

        }
        let firstFileLocation
        if (firstFileLocation = TAF.searchInObject(TAF, ["info", "firstFileLocation"]))
            if (firstFileLocation == href) {
                throw new Error("can't load the base file")
            }

        if (typeof sort !== 'string' && !(sort instanceof String)) {
            sort = undefined
        }

        if (!Array.isArray(args)) { args = args == null ? [] : [args] }
        if (this.isLoaded(name)) {
            return this.loaded[name];
        }

        styles.forEach(style => styleLoader.load(style))
        src.forEach(src => srcLoader.load(src))

        this.LOAD.function.addRequireModuleToWindowParams(
            href,
            iniFunc,
            args,
            sort,
            params,
            styles,
            src,
            require,
            name
        )

        let all = await this.importScript(href) || {};
        if (all.script == undefined) { console.error("error in " + href) }

        if (iniFunc) {
            try {
                // load the iniFunc with the args
                await all.script[iniFunc](...args);
            } catch (e) {
                if (all.script[iniFunc]) {
                    console.error("the function called {" + iniFunc + "} throw an error in [" + TAF.info.baseLocation + href + "]", all.script)
                    console.error(e)
                } else {
                    console.error("the function called {" + iniFunc + "} do not exist in [" + TAF.info.baseLocation + href + "]", all.script)
                }
            }
        }
        this.loaded[name] = {
            "module": {...all.script, ...(all.module != undefined ? (all.module.exports != undefined ? all.module.exports : {}) : {}) },
            "ini func": iniFunc != null ? {
                "function": {
                    "name": iniFunc,
                    "callback": all.script[iniFunc]
                },
                "args": args.length != 0 ? args : null
            } : null,
            "sort": sort,
            "href": href,
            "|__-/name\\-__|": name,
            href,
            callBy: []
        };
        if (TAF.searchInObject(TAF, ["module", "error"]))
            this.loaded[name].loadBy = new StackContainer

        // event
        this.event.load.forEach(function(callback) { callback(this.loaded[name]) })
        return {...this.loaded[name].module, "|__-/name\\-__|": name };
    }

    // param async loads(...args?:Array<href:string, iniFunc:?string, args:?Array<string>||string, sort:?string, ...params:?any>)
    async loads(...args) {
        let modules = await Promise.all(await args.asyncForEach(async function([href, iniFunc, args, sort, params]) {
            return this.load(href, iniFunc, args, sort, params)
        }.bind(this), false))
        return modules;
    }

    async require(obj = {}) {

        try {
            let retObj = await this.load(obj)
            return this.call({ path: retObj["|__-/name\\-__|"], property: obj.property })
        } catch (e) {
            if (!obj.avoidError) {
                throw e
            }
            // the error generate would be of type scriptLoaderError
            return e
        }
    }

    sortIn(module, sortName) {
        if (function(toTest, ...args) { for (let arg of args) { if (toTest === arg) return true } return false }(sortName, ...["sortIn", "load", "constructor", "call", "getSort", "isLoaded"]))
            return false;
        this[sortName].push(module);
    }

    getSort(sortName) {
        return this[sortName]
    }

    call(href, propertyCalled) {
        if (arguments.length > 0 && arguments[0] instanceof Object) {
            href = arguments[0].path
            propertyCalled = arguments[0].property || null
        }
        if (!this.isLoaded(href)) {
            return false
        }
        let absoluteHref

        if (href.substring(0, 2) == "./") {

            href = new URL(this.getCalleeStackFrame().getFileName().split("/").slice(0, -1).join("/") + "/" + href.substring(2)).href

        } else {

            try {
                absoluteHref = new URL((isValidURL(href) ? "" : dirname(
                    import.meta.url, 4) + "/") + href).href
            } catch {}

        }

        let loaded = Object.values(this.loaded).find(function(obj) {
            return obj.href == href || obj.href == href || obj["|__-/name\\-__|"] == href || absoluteHref == obj.href
        })

        let ret
        if (propertyCalled) {
            ret = function() {
                let getProperty = function(loaded, obj, property, arrayProperty) {
                    let propertyName, propertyFunc, propertyArgs
                    if (property instanceof Object) {
                        propertyName = property.name
                        propertyFunc = property.func
                        propertyArgs = property.args || []
                    } else {
                        propertyName = property
                    }

                    if (propertyFunc) {
                        if (propertyArgs)
                            arrayProperty.push(propertyFunc + "(...)")
                        else
                            arrayProperty.push(propertyFunc + "()")
                        if (obj[propertyFunc] instanceof Function) {
                            return obj[propertyFunc](...propertyArgs)
                        }
                        throw new Error("the function called { " + arrayProperty.join(".") + " } do not exist in [" + loaded.href + "]", obj)
                    }
                    arrayProperty.push(propertyName)
                    if (obj[propertyName]) {
                        return obj[propertyName]
                    }
                    throw new Error("the property named { " + arrayProperty.join('.') + " } do not exist in [" + loaded.href + "]", obj)
                }

                let obj = loaded.module
                let arrayProperty = []
                if (Array.isArray(propertyCalled)) {
                    while (propertyCalled.length != 0) {
                        obj = getProperty(loaded, obj, propertyCalled.shift(), arrayProperty)
                    }
                    return obj
                } else {
                    return getProperty(loaded, obj, propertyCalled, arrayProperty)
                }
            }()
        }

        if (TAF.searchInObject(TAF, ["module", "error"]))
            loaded.callBy.push(new StackContainer)

        if (ret)
            return ret

        // event
        this.event.call.forEach(function(callback) { callback(loaded) })
        return loaded.module;
    }

    isLoaded(href) {
        let ret = Object.values(this.loaded).find(function(obj) {
            return obj.href == href || obj["|__-/name\\-__|"] == href
        })
        return ret != undefined
    }
})