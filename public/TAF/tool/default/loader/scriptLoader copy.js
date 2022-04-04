import { importScript, isValidURL, dirname } from "../function/function.js"
// util
// this class is used to load the script in the order (no load override another for the window.PARAMS)


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

    getPackage() {
        return this.property.getPackage()
    }

    getLoaded() {
        return this.property.getLoaded()
    }

    getCalleeStackFrame = function() {
        return (new StackContainer).getLast()
    }

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
        const defaultWord = [...forbiddenWord, "path", "url", "sort", "require", "params", "style", "src"]

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

        this.property.setPackage([...array, ...this.property.package.val])
        this.package = [...array, ...this.package]
        delete this.parseJson
    }

    property = new class extends Container {
        constructor(parent) {
            super(parent)
        }
        getPackage() {
            return this.package.val
        }
        getLoaded() {
            return this.loaded.val
        }
        setPackage(array) {
            this.package.val = array
        }
        setLoaded(array) {
            this.loaded.val = array
        }
        addPackage(val) {
            this.package.val.push(val)
        }
        addLoaded(val) {
            this.loaded.val.push(val)
        }
        package = new class extends Container {
            constructor(parent) {
                super(parent)
            }
            val = []
            findBy = function(toFind, type) {
                return this.val.find(function(obj) {
                    return obj[type] == toFind
                })
            }

            findAllBy = function(toFind, type) {
                return this.val.filter(function(obj) {
                    return obj[type] == toFind
                })
            }

            findAllMatch = function(toFind, type) {
                return this.val.filter(function(obj) {
                    if (typeof obj[type] == "string")
                        return obj[type].includes(toFind)
                })
            }
        }(this)

        loaded = new class extends Container {
            val = []
            findBy = function(toFind, type) {
                return this.val.find(function(obj) {
                    return obj[type] == toFind
                })
            }

            findAllBy = function(toFind, type) {
                return this.val.filter(function(obj) {
                    return obj[type] == toFind
                })
            }

            findAllMatch = function(toFind, type) {
                return this.val.filter(function(obj) {
                    if (typeof obj[type] == "string")
                        return obj[type].includes(toFind)
                })
            }
        }(this)
    }(this)

    LOAD = new class extends Container {
        constructor(parent) {
            super(parent, { id: "LOAD" })
        }

        async loadFunction(

        ) {
            let ret
            let calledBy
            let obj = {}
            if (arguments.length != 1) {
                throw new Error("the load function would have 1 arguments of type string|Object")
            }

            if (arguments[0] instanceof Object) {
                obj = arguments[0]
            } else if (typeof arguments[0] == "string") {
                obj.path = arguments[0]
            } else {
                throw new Error("the load function would have 1 arguments of type string|Object but " + typeof arguments[0] + " is givent")
            }

            obj.path = obj.path.replace("\\", "/")
            if (!obj.name)
                obj.name = obj.path
            obj.params = {}

            if (isValidURL(obj.path)) {

                ret = this.LOAD.verif.urlPath(obj)
                if (ret) return ret
                calledBy = "url"

            } else if (obj.path.substring(0, 2) == "./") {

                ret = this.LOAD.verif.relativePath(obj)
                if (ret) return ret
                calledBy = "relative"

            } else if (obj.path.substring(0, 1) == "/") {

                ret = this.LOAD.verif.rootPath(obj)
                if (ret) return ret
                calledBy = "internal"

            } else {

                await this.LOAD.verif.namePath(obj)
                calledBy = "name"

            }

            // console.log(obj)

            let firstFileLocation
            if (firstFileLocation = TAF.searchInObject(TAF, ["info", "firstFileLocation"]))
                if (firstFileLocation == obj.url) {
                    throw new Error("can't load the base file")
                }

            if (typeof obj.sort !== 'string' && !(obj.sort instanceof String)) {
                obj.sort = undefined
            }

            let tempObj
            if (tempObj = this.property.loaded.findBy(obj.url, "url"))
                return tempObj

            obj.style = Array.isArray(obj.style) ? obj.style : []
            obj.src = Array.isArray(obj.src) ? obj.src : []


            obj.style.forEach(async style => styleLoader.load(style))
            obj.src.forEach(async src => srcLoader.load(src))

            this.LOAD.function.addRequireModuleToWindowParams(obj)

            let all = await importScript(obj.url) || {};
            if (all.script == undefined) { console.error("error in " + obj.url) }

            obj.loadBy = undefined

            obj.module

            if (TAF.searchInObject(TAF, ["module", "error"]))
                obj.loadBy = new StackContainer

            this.property.addLoaded(obj)

            // event
            this.event.load.forEach(function(callback) { callback(this.loaded[name]) })
            return {...obj }
        }

        // param async loads(...args?:Array<href:string, iniFunc:?string, args:?Array<string>||string, sort:?string, ...params:?any>)
        async loadsFunction(...args) {
            let modules = await Promise.all(await args.asyncForEach(async function([href, iniFunc, args, sort, params]) {
                return this.load(href, iniFunc, args, sort, params)
            }.bind(this), false))
            return modules;
        }

        function = new class extends Container {
            constructor(parent) {
                super(parent)
            }

            addRequireModuleToWindowParams = function(
                obj
            ) {
                window.TAF.PARAMS[obj.url] = {
                    get: function(scriptName, funcName = undefined) {
                        return this.require[scriptName][funcName] != undefined ? this.require[scriptName][funcName] : this.require[scriptName]
                    },
                    args: {...obj },
                    require: {...obj.require }
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
                        let module = await ScriptLoader.isLoaded(script) ? ScriptLoader.call(script) : await ScriptLoader.load(script);
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
                obj
            ) {
                const scriptLoader = this.__getHighestParent()
                obj.url = obj.path
                let tempObj
                if (tempObj = scriptLoader.property.package.findBy(obj.url, "url"))
                    return scriptLoader.load(tempObj.name)
            }

            /* The above code is a function that returns a JavaScript object. */
            rootPath = function(
                obj
            ) {

                const scriptLoader = this.__getHighestParent()
                obj.url = TAF.info.baseLocation + obj.path.substring(1)
                let tempObj
                if (tempObj = scriptLoader.property.package.findBy(obj.url, "url"))
                    return scriptLoader.load(tempObj.name)
                if (obj.params.name !== undefined) {
                    obj.name = "BASE/" + obj.params.name
                }

            }

            relativePath = function(
                obj
            ) {

                const scriptLoader = this.__getHighestParent()
                obj.url = new URL(scriptLoader.getCalleeStackFrame().getFileName().split("/").slice(0, -1).join("/") + "/" + obj.path.substring(2)).href
                let tempObj
                if (tempObj = scriptLoader.property.package.findBy(obj.url, "url"))
                    return scriptLoader.load(tempObj.name)

                if (obj.params.name !== undefined) {
                    obj.name = "PROJECT/" + obj.params.name
                }

            }

            namePath = async function(
                obj
            ) {
                const scriptLoader = this.__getHighestParent()
                const requireFunction = this.__getParentById("LOAD").function.requireFunction
                let tempObj
                if (tempObj = scriptLoader.property.package.findBy(obj.name.toLowerCase(), "name")) {
                    tempObj.require = await requireFunction(tempObj.require)
                    Object.assign(obj, tempObj)
                    return
                }
                throw new Error("the name " + obj.name + " does not exist in config file")
            }
        }(this)
    }(this)


    load = this.LOAD.loadFunction
    loads = this.LOAD.loadsFunction

    async require(obj = {}) {

        try {
            let retObj = await this.load(obj)
            console.log(retObj)
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


    CALL = new class extends Container {
        constructor(parent) {
            super(parent)
        }

        callFunction = function call(href, propertyCalled) {
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
    }(this)

    call = this.CALL.callFunction

    isLoaded(href) {
        let ret = Object.values(this.loaded).find(function(obj) {
            return obj.href == href || obj["|__-/name\\-__|"] == href
        })
        return ret != undefined
    }
})