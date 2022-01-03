import { importScript } from "../../../tool/default/function/function.js"
// util
class ScriptLoader {
    loaded = {}
    event = { load: [], call: [] }

    constructor() {
        this.importScript = importScript
    }

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

    // template async load(href:string, iniFunc:?string, args:?Array<string>||string, sort:?string, params:?Object<inner:bool>)
    async load(href, iniFunc, args, sort, params) {
        let name
        let require

        if (href == undefined) {
            return false;
        }
        params = params || {};
        if (href.substring(0, 1) == "/") {

            href = href.substring(1)

        } else if (href.substring(0, 2) == "./") {

            href = "../" + baseLocation + href
            if (params.name == undefined) {
                name = "project/" + href.split("/")[href.split("/").length - 2] + "/" + href.split("/")[href.split("/").length - 1]
            } else {
                name = params.name
            }

        } else {
            params.inner = true
            name = href

            let namespace = name.split("/")[0]
            let Default = false

            Object.values(ns.json.loader.default).every(function(obj) {
                if (Object.keys(obj).includes(name)) {
                    Default = true
                    return false
                }
                return true
            })

            let tempName
            if (Default) {
                namespace = "default"
                tempName = "default/" + name
            } else {
                tempName = name
            }

            let notValid = true

            for (let [typeLoadName, typeLoadObj] of Object.entries(ns.json.loader)) {
                if (typeLoadName == "default") { continue }
                if (typeLoadObj[namespace] == undefined) {
                    continue;
                } else if (typeLoadObj[namespace][tempName.split("/").slice(1).join("/")] == undefined) {
                    continue;
                } else {
                    let json = typeLoadObj[namespace][tempName.split("/").slice(1).join("/")]
                    href = typeLoadName + "/" + namespace + "/" + json.path
                    iniFunc = json.iniFunc
                    args = eval(json.args)
                    sort = json.sort
                    params = json.params

                    require =
                        json.require == undefined ? undefined :
                        await Promise.all((json.require instanceof Array ?
                            json.require : [json.require]
                        ).map(await async function({ script, use }) {
                            let module = await this.isLoaded(script) ? this.call(script) : await this.load(script, null, null, null, { inner: true });
                            use = new Set(use == undefined ? undefined : use.map(function(use) { return { name: use, content: module[use] } }))
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
                            temp[value.script] = value.use
                        }
                        require = temp
                    }
                    notValid = false
                    break
                }
            }

            if (notValid) {
                href = "../" + baseLocation + href
            }

        }

        if (typeof sort !== 'string' && !(sort instanceof String)) {
            sort = undefined
        }

        if (!Array.isArray(args)) { args = args == null ? [] : [args] }
        if (this.isLoaded(name)) {
            return this.loaded[name].module;
        }

        let module = await this.importScript(href);
        if (module == undefined) { console.error("/public" + baseLocation + href) }

        if (require != undefined) {
            if (module.PARAMS instanceof Object) {
                Object.assign(module.PARAMS, require)
            } else {
                console.error("you have to create a ligne like : export const PARAMS = new(class {})(); to the module to use external module (error 500)")
            }
        }


        if (iniFunc) {
            try {
                await module[iniFunc](...[...args, scriptLoader]);
            } catch (e) {
                try {
                    await module[iniFunc]
                    console.error(module, "in [" + "/public" + baseLocation + href + "] do not provide an export called {" + iniFunc + "} or the function called {" + iniFunc + "} throw an error")
                    console.error(e)
                } catch {
                    console.error(module, "in [" + "/public" + baseLocation + href + "] not exist")
                }
            }
        }
        this.loaded[name] = { "module": module, "ini func": iniFunc != null ? { "function": { "name": iniFunc, "callback": module[iniFunc] }, "args": args.length != 0 ? args : null } : null, "sort": sort, "href": href };

        // event
        this.event.load.forEach(function(callback) { callback(this.loaded[name]) })
        return module;
    }

    // param async loads(...args?:Array<href:string, iniFunc:?string, args:?Array<string>||string, sort:?string, ...params:?any>)
    async loads(...args) {
        let modules = await Promise.all(await args.asyncForEach(async function([href, iniFunc, args, sort, params]) {
            return this.load(href, iniFunc, args, sort, params)
        }.bind(this), false))
        return modules;
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

        href = Object.values(this.loaded).find(function(object) {
            return object.href == href
        }) == undefined ? href : Object.values(this.loaded).find(function(object) {
            return object.href == href
        }).module

        if (functionCalled) {
            return this.loaded[href].module[functionCalled]
        }

        // event
        this.event.call.forEach(function(callback) { callback(this.loaded[href]) })
        return this.loaded[href].module;
    }

    isLoaded(href) {
        if (Object.keys(this.loaded).indexOf(href) == -1) {
            return false
        }
        return true
    }
}


let scriptLoader;

export function setScriptLoader() {
    scriptLoader = new ScriptLoader();
}
export default function getScriptLoader() {
    return scriptLoader;
}