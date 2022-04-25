import { StackContainer, Container } from "../../../ini/global.js"
import { importScript, isValidURL, dirname, isClass } from "../function/function.js"

// util
// this class is used to load the script in the order (no load override another for the window.PARAMS)

export default new(class ScriptLoader {

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
        window.TAF.export = new class Export {

        }
        window.TAF.getParams = function(url) {
            return this.PARAMS[url]
        }
        window.TAF.addExport = function(url, key, val) {
            TAF.export[url][key] = val
        }
        window.TAF.setExport = function(url, obj) {
            TAF.export[url] = {...obj }
        }
        delete this.ini
    }

    customProcessFunctionValAttribute(val, packageObj, params) {
        if (typeof val == 'string') {
            if (val[0] && val[val.length - 1]) {
                val = val.substring(1, val.length - 1).split(",").map(function(str) {
                    return str.trim()
                })
            }
        } else {
            return val
        }

        let func = (value) => {
            if (typeof value == "string") {
                if (value[0] == "$" && value[value.length - 1] == "$") {
                    let variable = value.substring(1, value.length - 1)
                    if (variable == "packageObj") {
                        return packageObj
                    }
                    if (params[variable]) {
                        return params[variable]
                    }
                    throw new Error("the variable named " + variable + " does not exist")
                }
            }
            return value
        }

        if (typeof val == "string") {
            val = func(val)
        } else if (Array.isArray(val)) {
            val = val.map(function(value) {
                return func(value)
            })
        } else if (typeof val == "object") {
            Object.entries(val).forEach(function([key, value]) {
                val[key] = func(value)
            })
        }
        return val
    }

    customProcessFunction = async function(packageObj, type, action, params) {

        params = {...params }

        let customProcessObj = packageObj.customProcessObj
        if (customProcessObj) {
            Object.entries(customProcessObj).forEach(async function([key, val]) {
                if (packageObj[key]) {
                    if (val[action] && val[action][type]) {
                        val[action][type].forEach(async function(obj) {
                            let [moduleName, property] = obj.controller.split("::")
                            let value = obj.value
                            if (property[0] && property[property.length - 1]) {
                                property = property.substring(1, property.length - 1).split(",").map(function(str) {
                                    return str.trim()
                                })
                            }
                            try {
                                if (moduleName.substring(0, 2) == "./") {
                                    moduleName = TAF.info.projectBaseLocation + moduleName.substring(2)
                                }
                                let val = this.customProcessFunctionValAttribute(value, packageObj, params)
                                if (property) {
                                    (await scriptLoader.require({ module: moduleName, property: property }))(packageObj[key], val);
                                } else {
                                    throw new Error("the controller string is not a valid controller, controller = moduleName::functionName")
                                }
                            } catch (e) {
                                console.error(e)
                                console.error(packageObj)
                                throw new Error("an error occure because the file package.json is badly setup (a fileName or a functionName don't exist in the customProcessObj)")
                            }
                        }, this)
                    }
                }
            }, this)
        }

        // type = after or before
    }

    parseJson(json, location, addToName) {
        const array = []

        let self = this

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

        let add = function(lastName, val, name, actualObj, customProcessObj) {
            let obj = {...actualObj }
            addToObj(obj, val)
            obj.name = name.substring(1)

            if (Array.isArray(obj.path)) {
                if (obj.path[0] == -1) {
                    let strRet = lastName + "/"
                    obj.path = strRet + obj.path[1]
                } else {
                    let strRet = ""
                    for (let i = 0; i < obj.path[0]; i++) {
                        strRet += "../"
                    }
                    obj.path = strRet + obj.path[1]
                }

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
                if (self.property.forbiddenWord.includes(key)) {
                    return
                }
                if (val.url != undefined || val.path != undefined) {
                    add(key, val, name, actualObj, customProcessObj)
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
        delete this.parseJson
    }

    array = new class extends Container {
        constructor(parent) {
            super(parent, { id: "LOAD" })
        }

        load(...array) {
            return Promise.all(array.map(async function(args) {
                return this.__getParent().load(...args)
            }.bind(this)))
        }

        call(...array) {
            return Promise.all(array.map(async function(args) {
                return this.__getParent().call(...args)
            }.bind(this)))
        }

        require(...array) {
            // to test
            return Promise.all(array.map(async function(args) {
                return this.__getParent().require(...args)
            }.bind(this)))
        }
    }(this)

    property = new class extends Container {
        constructor(parent) {
            super(parent)
        }
        forbiddenWord = ["__realName__", "__global__"]

        // params is temp
        defaultWord = [...this.forbiddenWord, "path", "url", "sort", "require", "params", "style", "src", "name", "loadBy", "callBy", "module", "customProcessObj", "property", "default"]
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
            let self = this
            let ret
            let calledBy
            let obj = {}
            if (arguments.length != 1) {
                throw new Error("the load function would have 1 arguments of type string|Object")
            }

            if (arguments[0] instanceof Object) {
                obj = arguments[0]
            } else if (typeof arguments[0] == "string") {
                obj.module = arguments[0]
            } else {
                throw new Error("the load function would have 1 arguments of type string|Object but " + typeof arguments[0] + " is givent")
            }

            try {
                obj.module = obj.module.replace("\\", "/")
            } catch (e) {
                console.error(e);
                console.log(obj);
                console.log(arguments[0])
            }

            if (!obj.name)
                obj.name = obj.module
            obj.params = {}

            if (isValidURL(obj.module)) {

                ret = this.LOAD.verif.urlPath(obj)
                if (ret) return ret
                calledBy = "url"

            } else if (obj.module.substring(0, 2) == "./") {

                ret = this.LOAD.verif.relativePath(obj)
                if (ret) return ret
                calledBy = "relative"

            } else if (obj.module.substring(0, 1) == "/") {

                ret = this.LOAD.verif.rootPath(obj)
                if (ret) return ret
                calledBy = "internal"

            } else {

                ret = await this.LOAD.verif.namePath(obj)
                if (ret) return ret
                calledBy = "name"

            }

            let tempObj
            if (tempObj = this.property.loaded.findBy(obj.url, "url"))
                return tempObj

            let packageObj = this.property.package.findBy(obj.url, "url")

            let resolve, reject
            let Try = new Promise((Resolve, Reject) => {
                resolve = Resolve, reject = Reject
            }).then(function(obj) {
                let packageObj = obj.packageObj
                obj = obj.obj
                self.customProcessFunction({...packageObj }, "load", "success", { module: obj })
                return { packageObj: {...packageObj }, module: obj }
            }).catch(function(obj) {
                let packageObj = obj.packageObj
                let reason = obj.reason
                self.customProcessFunction({...packageObj }, "load", "error", { reason })
                return { packageObj: {...packageObj }, reason }
            })

            await this.customProcessFunction({...packageObj }, "load", "try", { promise: Try })

            let firstFileLocation
            if (firstFileLocation = TAF.prefab.searchInObject(TAF, ["info", "firstFileLocation"]))
                if (firstFileLocation == obj.url) {
                    reject({ reason: "can't load the base file", packageObj })
                    throw new Error("can't load the base file")
                }

            try {
                if (typeof obj.sort !== 'string' && !(obj.sort instanceof String)) {
                    obj.sort = undefined
                }

                obj.style = Array.isArray(obj.style) ? obj.style : []
                obj.src = Array.isArray(obj.src) ? obj.src : []
                obj.prototype = Array.isArray(obj.prototype) ? obj.prototype : []


                obj.style.forEach(async style => styleLoader.load(style))
                obj.src.forEach(async src => srcLoader.load(src))


                await Promise.all(obj.prototype.map(await async function(prototype) {
                    return await this.LOAD.function.prototypeFunction(prototype)
                }, this))

                this.LOAD.function.addRequireModuleToWindowParams(obj)

                let all = await importScript(obj.url) || {};

                if (all.script == undefined) { console.error("error in " + obj.url) }

                obj.loadBy = undefined
                obj.callBy = []

                obj.module = {...all.script, ...all.module }

                if (TAF.prefab.searchInObject(TAF, ["module", "error"]))
                    obj.loadBy = new StackContainer

                this.property.addLoaded(obj)

                // event
                this.event.load.forEach(function(callback) { callback(this.loaded[name]) })
            } catch (e) {
                reject({ reason: e.message, packageObj })
                throw e
            }

            resolve({ obj, packageObj })
            return {...obj }
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

            prototypeFunction = async(
                prototype
            ) => {
                let prototypeModifier = await TAF.promise.prototypeModifier
                let [module, property] = prototype.split("::")
                if (property.substring(0, 1) == "[" && property.substring(property.length - 1) == "]") {
                    await Promise.all(property.substring(1, property.length - 1).split(",").map(await async function(funcName) {
                        return await prototypeModifier.addFromPrototypeModule(module.trim(), funcName.trim())
                    }))
                    return
                }
                await prototypeModifier.addFromPrototypeModule(module.trim(), property.trim())
                return
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
                        let module = await ScriptLoader.require(script);
                        use = new Set(use == undefined ? Object.entries(Object.assign({}, module)).map(([name, content]) => { if (name != "|__-/name\\-__|") { return { name, content } } }) : use.map(function(use) { return { name: use, content: module[use] } }))
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
        }(this)

        verif = new class extends Container {
            constructor(parent) {
                super(parent)
            }

            urlPath = function(
                obj
            ) {
                const scriptLoader = this.__getHighestParent()
                obj.url = new URL(obj.module).href
                let tempObj
                if (tempObj = scriptLoader.property.loaded.findBy(obj.url, "url"))
                    return tempObj
                if (tempObj = scriptLoader.property.package.findBy(obj.url, "url"))
                    return scriptLoader.load(tempObj.name)
            }

            /* The above code is a function that returns a JavaScript object. */
            rootPath = function(
                obj
            ) {

                const scriptLoader = this.__getHighestParent()
                obj.url = new URL(TAF.info.baseLocation + obj.module.substring(1)).href
                let tempObj
                if (tempObj = scriptLoader.property.loaded.findBy(obj.url, "url"))
                    return tempObj
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
                obj.url = new URL(scriptLoader.getCalleeStackFrame().getFileName().split("/").slice(0, -1).join("/") + "/" + obj.module.substring(2)).href
                let tempObj
                if (tempObj = scriptLoader.property.loaded.findBy(obj.url, "url"))
                    return tempObj
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
                if (tempObj = scriptLoader.property.loaded.findBy(obj.name.toLowerCase(), "name"))
                    return tempObj
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

    async require(obj = {}) {

        try {
            let retObj = await this.load(obj)
            return this.call({ module: retObj.url, property: obj.property })
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

        callFunction(module, propertyCalled) {
            if (arguments.length > 0 && arguments[0] instanceof Object) {
                module = arguments[0].module
                propertyCalled = arguments[0].property || null
            }

            let loaded

            if (isValidURL(module)) {

                loaded = this.property.loaded.findBy(new URL(module).href, "url")

            } else if (module.substring(0, 2) == "./") {

                module = new URL(this.getCalleeStackFrame().getFileName().split("/").slice(0, -1).join("/") + "/" + module.substring(2)).href
                loaded = this.property.loaded.findBy(module, "url")

            } else if (module.substring(0, 1) == "/") {
                module = new URL(TAF.info.baseLocation + module.substring(1)).href
                loaded = this.property.loaded.findBy(module, "url")

            } else {

                loaded = this.property.loaded.findBy(module.toLowerCase(), "name")

            }

            if (!loaded) {

                throw new Error("the module [" + module + "] is not loaded")

            }

            let ret
            if (propertyCalled) {
                ret = function() {
                    let getProperty = function(loaded, obj, property, arrayProperty) {
                        let propertyName, propertyFunc, propertyArgs, propertyClass
                        if (property instanceof Object) {
                            propertyName = property.name
                            propertyFunc = property.func
                            propertyClass = property.class
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
                        } else if (propertyClass) {
                            if (propertyArgs)
                                arrayProperty.push("new " + propertyClass + "(...)")
                            else
                                arrayProperty.push("new " + propertyClass + "()")
                            if (isClass(obj[propertyClass])) {
                                return new obj[propertyClass](...propertyArgs)
                            }
                            throw new Error("the function called { " + arrayProperty.join(".") + " } do not exist in [" + loaded.href + "]", obj)
                        } else {
                            arrayProperty.push(propertyName)
                            if (obj[propertyName]) {
                                return obj[propertyName]
                            }
                        }
                        throw new Error("the property named { " + arrayProperty.join('.') + " } do not exist in [" + loaded.href || loaded.name || loaded.path + "]", obj)
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

            if (TAF.prefab.searchInObject(TAF, ["module", "error"]))
                loaded.callBy.push(new StackContainer)

            // this.customProcessFunction({...loaded }, "call", "success", loaded.module)

            if (ret)
                return ret

            // event
            this.event.call.forEach(function(callback) { callback(loaded) })
            return loaded.module;
        }
    }(this)

    call = this.CALL.callFunction

    isLoaded(href) {
        let ret = Object.values(this.property.getLoaded()).find(function(obj) {
            return obj.href == href || obj["|__-/name\\-__|"] == href
        })
        return ret != undefined
    }
})