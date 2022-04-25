import scriptLoader from "../tool/default/loader/scriptLoader.js"
import styleLoader from "../tool/default/loader/styleLoader.js"
import srcLoader from "../tool/default/loader/srcLoader.js"
import { autoFunction } from "../tool/default/function/function.js"
import ajax from "../tool/default/ajax.js";
import { ajaxLoad } from "../tool/default/ajax.js"
import { addInObject, searchInObject } from "./global.js";
import * as global from "./global.js"
import HTTP from "../tool/default/manager/httpManager.js";

window.TAF = new class TAF {}
const addTAFVar = (array, value) => addInObject(TAF, array, value)
const multiCall = (func, array) => array.forEach((args) => func(...args))

/**
 * @param {object} params <scriptLoader:Object<baseLocation:string>, requireScript:Array<string>, iniLoadScript:Array<string>>
 * @returns {object} <debugTool, devTool, modulesLoad, modulesLoadAssocName>
 */
export default async function setBuild(params = { baseLocation: { ajax: "", script: "" }, requireScript: [], iniLoadScript: [], dev: false, tafDeep: "" }) {

    // set the stack limit off the error handler to infinity
    Error.stackTraceLimit = Infinity

    // set the setBuild into the global var
    window.setBuild = setBuild

    let metaScript =
        import.meta.url

    let startTime = performance.now();

    // #region require the scriptLoader object

    window.scriptLoader = scriptLoader
    window.styleLoader = styleLoader
    window.srcLoader = srcLoader
    window.autoFunction = autoFunction
    window.http = HTTP

    // set the TAF property of scriptLoader (getParams and PARAMS)
    scriptLoader.ini()

    Object.entries(global).forEach(([key, val]) => addTAFVar(["prefab", key], val))

    addTAFVar(["autoFunction"], autoFunction)

    addTAFVar(["info", "baseLocation"], metaScript.split("/").slice(0, -2).join("/") + "/")

    addTAFVar(["promise", "ajaxLoad"], ajaxLoad())
    window.ajax = ajax

    // let localLoad = [
    //     "loader/script",
    //     "loader/style",
    //     "loader/src",
    //     "prototype/modifier",
    //     "Error",
    //     "function"
    // ]

    // #endregion require the scriptLoader object

    // #region verification
    params = params || { baseLocation: { ajax: "", script: "" }, requireScript: [], iniLoadScript: [] }
    params.baseLocation = params.baseLocation || {}
    params.baseLocation.ajax = params.baseLocation.ajax || ""
    params.baseLocation.script = params.baseLocation.script || ""
    params.requireScript = params.requireScript || []
    params.iniLoadScript = params.iniLoadScript || []
    params.dev = params.dev || false
    params.tafDeep = params.tafDeep || ""

    if (params.projectLocation)
        try {
            params.projectLocation = new URL(params.projectLocation).href
        } catch {
            throw new Error("the projectLocation have to be a valid url")
        }

    // verify if params is an object
    if (typeof params != "object") {
        throw new Error("params must be an object")
    }

    // verify if params.scriptLoader is an object
    if (typeof params.baseLocation != "object") {
        throw new Error("params.scriptLoader must be an object")
    }

    // verify if params.scriptLoader.baseLocation is a string
    if (typeof params.baseLocation.ajax != "string" || typeof params.baseLocation.script != "string") {
        throw new Error("params.baseLocation.ajax and params.baseLocation.script must be a string")
    }

    // verify if params.requireScript is an array
    if (!Array.isArray(params.requireScript)) {
        throw new Error("params.requireScript must be an array")
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

    // verify if params.iniLoadScript is an array of string
    for (let i of params.iniLoadScript) {
        if (typeof i != "string") {
            throw new Error("params.iniLoadScript must be an array of string")
        }
    }

    // verify if params is an object
    if (typeof params.dev != "boolean") {
        throw new Error("params.dev must be a boolean")
    }

    // #endregion verification

    // #region set global variable and set prototype/modifier

    let TafBaseLocation = metaScript.split("/").slice(0, -2).join("/") + "/"
    let TafLocation = metaScript.split("/").slice(0, -2).join("/").split("/").slice(-1 - (params.tafDeep.split("../").length - 1)).join("/") + "/"
    let TafProjectBaseLocation
    if (params.projectLocation)
        TafProjectBaseLocation = params.projectLocation
    TafProjectBaseLocation = metaScript.split("/").slice(0, -3).join("/") + "/" + params.tafDeep

    addTAFVar(["info", "projectBaseLocation"], TafProjectBaseLocation)

    // set json
    let [json, local, src, require] = await ajax.array.get({
        url: TafLocation + "package.TAF.json",
        method: "GET",
        parse: "JSON"
    }, {
        url: TafLocation + "package.project.json",
        method: "GET",
        parse: "JSON"
    }, {
        url: TafLocation + "src.json",
        method: "GET",
        parse: "JSON"
    }, {
        url: TafLocation + "require.json",
        method: "GET",
        parse: "JSON"
    }).response()

    scriptLoader.parseJson(json, TAF.info.baseLocation + "tool/")
    scriptLoader.parseJson(local, TAF.info.projectBaseLocation, "LOCAL")

    multiCall(addTAFVar, [
        [
            ["info", "ajaxBaseLocation"], params.baseLocation.ajax
        ],
        [
            ["info", "scriptBaseLocation"], params.baseLocation.script
        ],
        [
            ["info", "dirName"], metaScript.split("/").slice(0, -1).join("/").split("/").slice(-2)[0]
        ],
        [
            ["info", "baseLocation"], TafBaseLocation
        ],
        [
            ["info", "deep"], params.tafDeep
        ],
        [
            ["info", "projectBaseLocation"], TafProjectBaseLocation
        ],
        [
            ["info", "location"], TafLocation
        ],
        [
            ["json"], {
                loader: {
                    src,
                    require,
                    local,
                    tool: {
                        ...json
                    }
                }
            }
        ]
    ])

    styleLoader.load('/global/style/style.css')

    // #endregion set global variable

    // #region scriptLoader

    // ! prototype/modifier must be load in first and with scriptLoader.load and not .loads (the asyncForEach is used in scriptLoader.loads function)
    await scriptLoader.array.load(["ajax"], ["loader/scriptLoader"], ["manager/event"], ["n0safe/console/error"], ["prototype/modifier"])
    await scriptLoader.call({ module: "prototype/modifier", property: "default" }).ini()
    addTAFVar(["promise", "sodium"], scriptLoader.load("node_modules/sodium"))
    addTAFVar(["promise", "prototypeModifier"], scriptLoader.require({ module: "prototype/modifier", property: "default" }))
    addTAFVar(["module", "eventManager"], scriptLoader.call({ module: "manager/event", property: "default" }))
    addTAFVar(["module", "error"], scriptLoader.call({ module: "n0safe/console/error" }))
    addTAFVar(["module", "dev"], await scriptLoader.require({ module: "dev", property: "default" }))
    let arrayStackFrame = TAF.prefab.searchInObject(TAF, ["module", "error", "ErrorStackParser"]).parse(new Error())
    let StackFrame = arrayStackFrame[arrayStackFrame.length - 1]
    if (StackFrame.getFileName()) {
        StackFrame.setFileName(StackFrame.getFileName().substring(0, 5) == "async" ? StackFrame.getFileName().substring(5).trim() : StackFrame.getFileName())
    }
    addTAFVar(["info", "firstFileLocation"], StackFrame.getFileName())

    if (params.dev) window.TAF.module.dev.on()

    // #endregion scriptLoader

    // #region load module requested by user

    // console.log(params)
    let modulesLoad = await scriptLoader.array.load(...[...params.requireScript.map(function(array) { return [array] }), ...TAF.json.loader.require.map(function(array) { return [array] })])

    // #endregion load module requested by user

    delete window.setBuild

    console.log("%c%s", "color: #2bb7df; font-size: 15px;", "the setBuild function end up in " + (performance.now() - startTime) + "ms")

    // #region return

    return modulesLoad

    // #endregion return
}


window.setBuild = setBuild