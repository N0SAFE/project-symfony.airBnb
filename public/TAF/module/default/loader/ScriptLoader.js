import { importScript, isValidURL, dirname } from "../../../tool/default/function/function.js"
// util
// this class is used to load the script in the order (no load override another for the window.PARAMS)
const orderLoad = new(class ScriptLoaderStatic {
    loadArray = []
    id = 0
    treatment = false
    async stop(callback, ...args) {
        let id = this.id++;
        this.loadArray.push({ id, callback })
        let length = this.loadArray.length
        console.log(length)
        let iter = 0
        while (length >= this.loadArray.length && length != 1 && iter < 10000) {
            iter++
        }
        console.log(length)
        console.log(this.loadArray.length)
        if (iter == 10000) {
            console.error("over iter")
        }
        let ret = await callback(function() {
            this.suprId(id)
        }.bind(this), ...args)
        return ret
    }
    suprId(id) {
        this.loadArray.splice(this.loadArray.findIndex(obj => obj.id == id))
        console.log("supr")
    }
})

class ScriptLoader {
    loaded = {}
    event = { load: [], call: [] }
    importScript = importScript

    // callback is : callback(object:Object<module:Object, ini func:Object, sort:string>)
    addListener(event, callback) {
        if (event == "load") {
            this.event.load.push(callback);
        } else if (event == "call") {
            this.event.call.push(callback);
        }
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
        return TAF.baseLocation
    }

    async load(defaultHref, params) {
        let href = defaultHref
        let name
        let require

        if (href == undefined) {
            return false;
        }
        params = params || {};

        let styles = params.styles || []
        let src = params.src || []
        let iniFunc = params.iniFunc
        let args = params.args
        let sort = params.sort

        if (!Array.isArray(styles)) { styles = [styles] }
        if (!Array.isArray(src)) { src = [src] }

        href = href.replace("\\", "/")

        name = href

        if (isValidURL(href)) {
            null;
        } else if (href.substring(0, 1) == "/") {

            href = TAF.baseLocation + href.substring(1)
            if (params.name !== undefined) {
                name = "BASE/" + params.name
            }

        } else if (href.substring(0, 2) == "./") {

            href = TAF.projectBaseLocation + TAF.deep + href

            if (params.name !== undefined) {
                name = "PROJECT/" + params.name
            }

        } else {
            let requireFunction = async(array) => {
                let require = array == undefined ? undefined :
                    await Promise.all((array instanceof Array ?
                        array : [array]
                    ).map(await async function({ script, use }) {
                        if (!Array.isArray(use) && use) { use = [use] }
                        let module = await this.isLoaded(script) ? this.call(script) : await this.load(script, null, null, null, { inner: true });
                        use = new Set(use == undefined ? Object.entries(Object.assign({}, module)).map(([name, content]) => { if (name != "|__-/name\-__|") { return { name, content } } }) : use.map(function(use) { return { name: use, content: module[use] } }))
                        use.add({ name: "|__-/name\-__|", content: module["|__-/name\-__|"] })
                        use.delete(undefined)
                        let ret = {}
                        for (let { name, content }
                            of use) {
                            ret[name] = content
                        }
                        return { script, use: ret }
                    }.bind(this)))

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

            let namespace = name.split("/")[0]
            let Default = false


            if (namespace == "local") {
                let path = name.split("/").slice(1).join("/")
                let tempFunc = (obj, path) => {
                    let key = path.split("/")[0]
                    if (obj[key] === undefined) {
                        return new Error("path")
                    }
                    if (path.split("/").length == 1) {
                        if (obj[key].__repo__ === undefined) {
                            return new Error("repo")
                        }
                        return obj[key].__repo__
                    }
                    return tempFunc(obj[key], path.split("/").slice(1).join("/"))
                }
                let json = tempFunc(TAF.json.loader.local, path)
                if (json instanceof Error) {
                    if (json.message == "path") {
                        console.error(TAF.json.loader.local)
                        throw new Error("the path {/" + path + "} does not exist in assocation.project.json")
                    } else {
                        console.error(TAF.json.loader.local)
                        throw new Error("the path " + path + " does not have a repo in assocation.project.json")
                    }
                }
                href = TAF.projectBaseLocation + json.path
                iniFunc = json.iniFunc || iniFunc
                args = eval(json.args) || args
                sort = json.sort || sort
                params = json.params || params
                styles = (json.styles || []) || styles
                src = (json.src || []) || src

                if (!Array.isArray(json.styles || [])) { styles = [styles] }
                if (!Array.isArray(json.src || [])) { src = [src] }

                styles = styles.map(style => {
                    if (style.substring(0, 1) == "|") {
                        return style
                    } else {
                        return TAF.baseLocation + typeLoadName + "/" + namespace + "/" + style
                    }
                })
                require = await requireFunction(json.require)

            } else {

                let tempName
                if (TAF.json == undefined) {
                    throw new Error("the setBuild function must be called and awaited before loading any script")
                }
                Object.values(TAF.json.loader.default).every(function(obj) {
                    if (Object.keys(obj).includes(name)) {
                        Default = true
                        return false
                    }
                    return true
                })

                if (Default) {
                    namespace = "default"
                    tempName = "default/" + name
                } else {
                    tempName = name
                }


                let notValid = true

                for (let [typeLoadName, typeLoadObj] of Object.entries(TAF.json.loader)) {
                    if (typeLoadName == "default") { continue }
                    if (typeLoadObj[namespace] == undefined) {
                        continue;
                    } else if (typeLoadObj[namespace][tempName.split("/").slice(1).join("/")] == undefined) {
                        continue;
                    } else {
                        let json = typeLoadObj[namespace][tempName.split("/").slice(1).join("/")]
                        href = typeLoadName + "/" + namespace + "/" + json.path
                        iniFunc = json.iniFunc || iniFunc
                        args = eval(json.args) || args
                        sort = json.sort || sort
                        params = json.params || params
                        styles = (json.styles || []) || styles
                        src = (json.src || []) || src

                        if (!Array.isArray(json.styles || [])) { styles = [styles] }
                        if (!Array.isArray(json.src || [])) { src = [src] }

                        // if style start by |
                        styles = styles.map(style => {
                            if (style.substring(0, 1) == "|") {
                                return style
                            } else {
                                return TAF.baseLocation + typeLoadName + "/" + namespace + "/" + style
                            }
                        })
                        require = await requireFunction(json.require)

                        notValid = false
                        break
                    }
                }

                if (notValid) {
                    throw new Error("Invalid name: " + name + " the requested module is not installed")
                }
            }


        }

        if (typeof sort !== 'string' && !(sort instanceof String)) {
            sort = undefined
        }

        if (!Array.isArray(args)) { args = args == null ? [] : [args] }
        if (this.isLoaded(name)) {
            return this.loaded[name].module;
        }

        styles.forEach(style => styleLoader.load(style))
        src.forEach(src => srcLoader.load(src))

        let absoluteHref = new URL((isValidURL(href) ? "" : dirname(
            import.meta.url, 4) + "/") + href).href

        window.PARAMS = window.PARAMS || {}
        window.PARAMS[absoluteHref] = {
            get: function(scriptName, funcName = undefined) {
                return this.require[scriptName][funcName] != undefined ? this.require[scriptName][funcName] : this.require[scriptName]
            },
            call: {
                absoluteHref,
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
        let all = await this.importScript(href) || {};
        if (all.script == undefined) { console.error("error in " + href) }

        if (iniFunc) {
            try {
                // load the iniFunc with the args
                await all.script[iniFunc](...args);
            } catch (e) {
                if (all.script[iniFunc]) {
                    console.error("the function called {" + iniFunc + "} throw an error in [" + TAF.baseLocation + href + "]", all.script)
                    console.error(e)
                } else {
                    console.error("the function called {" + iniFunc + "} do not exist in [" + TAF.baseLocation + href + "]", all.script)
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
            "|__-/name\-__|": name,
            defaultHref,
            parsedHref: autoFunction(() => {
                try {
                    return new URL(all.absoluteHref).href
                } catch {
                    return "{the url does not exist because an error occure in scriptLoader:load(), line:273 when try to create a new URL()}"
                }
            })
        };

        if (typeof this.loaded[name].module.onload == "function") {
            this.loaded[name].module.onload()
        }

        // event
        this.event.load.forEach(function(callback) { callback(this.loaded[name]) })
        return {...this.loaded[name].module, "|__-/name\-__|": name };
    }

    // param async loads(...args?:Array<href:string, iniFunc:?string, args:?Array<string>||string, sort:?string, ...params:?any>)
    async loads(...args) {
        let modules = await Promise.all(await args.asyncForEach(async function([href, iniFunc, args, sort, params]) {
            return this.load(href, iniFunc, args, sort, params)
        }.bind(this), false))
        return modules;
    }

    async loadAndCall(href, functionToCall = null, loadParam = {}) {
        let retObj = await this.load(href, loadParam)
        return this.call(retObj["|__-/name\-__|"], functionToCall)
    }

    sortIn(module, sortName) {
        if (function(toTest, ...args) { for (let arg of args) { if (toTest === arg) return true } return false }(sortName, ...["sortIn", "load", "constructor", "call", "getSort", "isLoaded"]))
            return false;
        this[sortName].push(module);
    }

    getSort(sortName) {
        return this[sortName]
    }

    call(href, functionCalled = null) {
        if (!this.isLoaded(href)) {
            return false
        }

        let loaded = Object.values(this.loaded).find(function(obj) {
            return obj.href == href || obj.parsedHref == href || obj.defaultHref == href || obj["|__-/name\-__|"] == href
        })

        if (functionCalled) {
            // verify if the string of iniFunc contains () or (...args)
            var matches = /\(([^)]+)\)/.exec(functionCalled);
            if (matches) {
                let func = loaded.module[functionCalled.replace(matches[0], "")]
                if (func == undefined || typeof func != "function") {
                    throw new Error("the function called {" + functionCalled.replace(matches[0], "") + "} do not exist in [" + loaded.parsedHref + "]", loaded.module)
                    return
                }
                return func(...(matches[1].split(",")[0]))
            }
            if (functionCalled.includes("()")) {
                let func = loaded.module[functionCalled.replace("()", "")]
                if (func == undefined || typeof func != "function") {
                    throw new Error("the function called {" + functionCalled.replace("()", "") + "} do not exist in [" + loaded.parsedHref + "]", loaded.module)
                    return
                }
                return func()
            }
            let func = loaded.module[functionCalled]
            if (func == undefined) {
                throw new Error("the method called {" + functionCalled + "} do not exist in [" + loaded.parsedHref + "]", loaded.module);
                return
            }
            return func
        }

        // event
        this.event.call.forEach(function(callback) { callback(loaded) })
        return loaded.module;
    }

    isLoaded(href) {
        let ret = Object.values(this.loaded).find(function(obj) {
            return obj.href == href || obj.parsedHref == href || obj.defaultHref == href || obj["|__-/name\-__|"] == href
        })
        return ret != undefined
    }
}


let scriptLoader;

export function setScriptLoader() {
    scriptLoader = new ScriptLoader();
}
export default function getScriptLoader() {
    return scriptLoader;
}