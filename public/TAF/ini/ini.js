import { setScriptLoader } from "../module/default/loader/ScriptLoader.js";
import getScriptLoader from "../module/default/loader/ScriptLoader.js"
import { getFromFile, unzipArray } from "../tool/default/function/function.js"
import ArrayFunction from "../tool/default/objFunction/ArrayFunction.js"

/**
 * 
 * @param {bool} iniDebugTool get debug tool
 * @param {bool} iniDevTool get dev tool
 * @param {object} params <scriptLoader:Object<baseLocation:string>, requireScript:Array<string>, exceptionScript:Array<string>, iniLoadScript:Array<string>>
 * @returns {object} <debugTool, devTool, modulesLoad, modulesLoadAssocName>
 */
export default async function ini(iniDebugTool = false, iniDevTool = false, params = { scriptLoader: { baseLocation: "" }, requireScript: [], exceptionScript: [], iniLoadScript: [] }) {

    let startTime = new Date().getTime();

    // #region verification
    iniDebugTool = iniDebugTool || false;
    iniDevTool = iniDevTool || false;
    params = params || { scriptLoader: { baseLocation: "" }, requireScript: [], exceptionScript: [] };
    params.scriptLoader = params.scriptLoader || {}
    params.scriptLoader.baseLocation = params.scriptLoader.baseLocation || ""
    params.requireScript = params.requireScript || []
    params.exceptionScript = params.exceptionScript || []
    params.iniLoadScript = params.iniLoadScript || []

    // verify if iniDebugTool is a boolean
    if (typeof iniDebugTool != "boolean") {
        throw new Error("iniDebugTool must be a boolean")
    }

    // verify if iniDevTool is a boolean
    if (typeof iniDevTool != "boolean") {
        throw new Error("iniDevTool must be a boolean")
    }

    // verify if params is an object
    if (typeof params != "object") {
        throw new Error("params must be an object")
    }

    // verify if params.scriptLoader is an object
    if (typeof params.scriptLoader != "object") {
        throw new Error("params.scriptLoader must be an object")
    }

    // verify if params.scriptLoader.baseLocation is a string
    if (typeof params.scriptLoader.baseLocation != "string") {
        throw new Error("params.scriptLoader.baseLocation must be a string")
    }

    // verify if params.requireScript is an array
    if (!Array.isArray(params.requireScript)) {
        throw new Error("params.requireScript must be an array")
    }

    // verify if params.exceptionScript is an array
    if (!Array.isArray(params.exceptionScript)) {
        throw new Error("params.exceptionScript must be an array")
    }

    // verify if params.requireScript is an array of string or an array of array of string
    for (var requireScript of params.requireScript) {
        if (typeof requireScript != "string" && Array.isArray(requireScript)) {
            for (var requireScriptItem of requireScript) {
                if (typeof requireScriptItem != "string") {
                    throw new Error("params.requireScript must be an array of string or an array of array of string")
                }
            }
        } else if (typeof requireScript != "string" && !Array.isArray(requireScript)) {
            throw new Error("params.requireScript must be an array of string or an array of array of string")
        }
    }

    // verify if params.exceptionScript is an array of string
    for (let i of params.exceptionScript) {
        if (typeof i != "string") {
            throw new Error("params.exceptionScript must be an array of string")
        }
    }

    // verify if params.iniLoadScript is an array of string
    for (let i of params.iniLoadScript) {
        if (typeof i != "string") {
            throw new Error("params.iniLoadScript must be an array of string")
        }
    }

    // #endregion verification

    // #region set window variable

    window.baseLocation = params.scriptLoader.baseLocation.length == 0 || (params.scriptLoader.baseLocation.substring(params.scriptLoader.baseLocation.length - 1) == "/" || params.scriptLoader.baseLocation.substring(params.scriptLoader.baseLocation.length - 1) == "\\") ? params.scriptLoader.baseLocation : params.scriptLoader.baseLocation + "/"

    // #endregion

    // #region require the scriptLoader object

    if (getScriptLoader() == undefined) {
        setScriptLoader()
    }
    window.scriptLoader = getScriptLoader()

    // #endregion require the scriptLoader object

    // #region set global variable and set prototype/modifier

    // temp json variable to store the prototype/modifier module path
    window.ns = {
        json: {
            loader: {
                module: {
                    default: {
                        "prototype/modifier": {
                            path: "./prototype.modifier.js",
                            iniFunc: "default",
                            "require": [{ "script": "/global/association/string-class.js", "use": ["default"] }]
                        }
                    }
                }
            }
        }
    }
    window.ns.json.loader.default = {
        module: {
            "prototype/modifier": {
                path: "./prototype.modifier.js"
            }
        }
    }

    // require prototype/modifier script for the asyncForEach use in function.js:getFromFile function
    window.prototypeModifier = await scriptLoader.load("prototype/modifier", "default", undefined, undefined)

    // set json
    let json = await getFromFile(["./TAF/settings/associationName-Path.module.json", { retType: "json" }])
    window.ns.json.loader.tool = json.tool
    window.ns.json.loader.module = json.module
    window.ns.json.loader.default = { "module": ns.json.loader.module.default, "tool": ns.json.loader.tool.default }
        // console.log(json)

    // #endregion set global variable

    // #region setAssociation on prototype/modifier

    prototypeModifier.getModifiedPrototype().setAssociations(Object.keys(ns.json.loader.tool.default).filter(function(key) { return key.split("/")[0] == "prototype" }).map(function(key) { return [key, ns.json.loader.tool.default[key]] }))

    // #endregion setAssociation on prototype/modifier

    // #region load scriptLoader

    await scriptLoader.load("loader/scriptLoader", undefined, undefined, undefined)

    // #endregion load scriptLoader

    // #region load module requested by user

    let modulesToLoad = new Set(unzipArray(await Object.entries(ns.json.loader).asyncForEach(async function([typeLoadName, typeLoadContent]) {
        // return none if the typeLoadName is default (default, tool and module)
        if (typeLoadName == "default") { return [] }
        let stock = []
        stock.push(...await Object.entries(typeLoadContent).asyncForEach(async function([namespaceName, namespaceContent]) {
            let stock = []
            stock.push(...await Object.entries(namespaceContent).asyncForEach(function([scriptName, scriptObj]) {
                // make the namespace prefixe 
                if (namespaceName != "default") {
                    scriptName = namespaceName + "/" + scriptName
                }

                // console.log(scriptName, "scriptName", namespaceName, "namespaceName")

                // check if the json is not complete and if the use require the script
                if (scriptObj.ini == undefined || scriptObj.ini.isRequire == undefined) {
                    if (ArrayFunction.isInArray(scriptName, ...params.requireScript)) {
                        return [scriptName]
                    }
                    return
                }

                // if the script is require in json but the user exception this script (pass)
                if (scriptObj.ini.isRequire) {
                    if (!ArrayFunction.isInArray(scriptName, ...params.exceptionScript)) {
                        return [scriptName]
                    }
                }
                // else the script is not require in json but the user require this script
                else {
                    if (ArrayFunction.isInArray(scriptName, ...params.requireScript)) {
                        return [scriptName]
                    }
                }
            }))
            return stock
        }))

        // unzip array
        return unzipArray(stock)
    })))
    params.requireScript.asyncForEach(function(require) { if (typeof require == "[object Object]") { console.log(require) } });
    modulesToLoad.delete(undefined);
    modulesToLoad = Array.from(modulesToLoad);
    const modulesLoad = await scriptLoader.loads(...modulesToLoad);


    // load the script require in iniLoadScript (it's the script that does not is a module or a tool)
    const iniLoadScript = await scriptLoader.loads(params.iniLoadScript)
    const associationIniLoadScript = (await iniLoadScript.asyncForEach(function(script) { return [script, params.iniLoadScript[this.index]] })).filter(([module, _]) => module != undefined)

    // #endregion load module requested

    // #region test
    let debugTool, devTool = undefined
    if (iniDebugTool == true) {
        await scriptLoader.load("./built-in/module/debug/app.js", "default")
        debugTool = await scriptLoader.load("./built-in/module/debug/app.js", "getDebugTool")
    }
    if (iniDevTool == true) {
        await scriptLoader.load("./built-in/module/dev/app.js", "default")
        devTool = scriptLoader.call("./built-in/module/dev/app.js", "getDevTool")
    }

    // #endregion test

    delete window.setBuild

    console.log("%c%s", "color: #2bb7df; font-size: 15px;", "the setBuild function end up in " + (new Date().getTime() - startTime) + "ms")

    // #region return
    return {
        debugTool,
        devTool,
        modulesLoad: [
            ...modulesLoad,
            ...iniLoadScript
        ],
        modulesLoadAssociateName: [
            ...await[...modulesLoad].asyncForEach(
                function() {
                    return [modulesLoad[this.index], modulesToLoad[this.index][0]]
                }),

            ...(await [...iniLoadScript].asyncForEach(
                function(script) {
                    return [script, params.iniLoadScript[this.index]]
                }))
            .filter(
                ([module, _]) => module != undefined
            )
        ]
    }
    // #endregion return
}