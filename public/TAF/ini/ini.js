import { setScriptLoader } from "../module/default/loader/ScriptLoader.js";
import getScriptLoader from "../module/default/loader/ScriptLoader.js"
import { setStyleLoader } from "../module/default/loader/StyleLoader.js"
import getStyleloader from "../module/default/loader/StyleLoader.js"
import { setSrcLoader } from "../module/default/loader/SrcLoader.js"
import getSrcLoader from "../module/default/loader/SrcLoader.js"
import { unzipArray, autoFunction } from "../tool/default/function/function.js"
import ArrayFunction from "../tool/default/objFunction/ArrayFunction.js"
import ajax from "../module/default/ajax.js";
import { ajaxLoad } from "../module/default/ajax.js"

/**
 * 
 * @param {object} params <scriptLoader:Object<baseLocation:string>, requireScript:Array<string>, exceptionScript:Array<string>, iniLoadScript:Array<string>>
 * @returns {object} <debugTool, devTool, modulesLoad, modulesLoadAssocName>
 */
export default async function ini(params = { baseLocation: { ajax: "", script: "" }, requireScript: [], exceptionScript: [], iniLoadScript: [] }) {

    let metaScript =
        import.meta.url

    let startTime = performance.now();

    // #region require the scriptLoader object

    if (getScriptLoader() == undefined) {
        setScriptLoader()
    }
    window.scriptLoader = getScriptLoader()
    if (getStyleloader() == undefined) {
        setStyleLoader()
    }
    window.styleLoader = getStyleloader()
    if (getSrcLoader() == undefined) {
        setSrcLoader()
    }
    window.srcLoader = getSrcLoader()
    window.autoFunction = autoFunction

    window.TAF = { baseLocation: metaScript.split("/").slice(0, -2).join("/") + "/" }

    await ajaxLoad()
    window.ajax = ajax

    let localLoad = [
        "loader/script",
        "loader/style",
        "loader/src",
        "prototype/modifier",
        "Error",
        "function"
    ]

    // #endregion require the scriptLoader object

    // #region verification
    params = params || { baseLocation: { ajax: "", script: "" }, requireScript: [], exceptionScript: [], iniLoadScript: [] }
    params.baseLocation = params.baseLocation || {}
    params.baseLocation.ajax = params.baseLocation.ajax || ""
    params.baseLocation.script = params.baseLocation.script || ""
    params.requireScript = params.requireScript || []
    params.exceptionScript = params.exceptionScript || []
    params.iniLoadScript = params.iniLoadScript || []

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

    // #region set global variable and set prototype/modifier



    let TafBaseLocation = metaScript.split("/").slice(0, -2).join("/") + "/"
    let TafDeep = await ajax.get(TafBaseLocation + "deep.conf", "GET", { parse: "TEXT" })
    let TafLocation = metaScript.split("/").slice(0, -2).join("/").split("/").slice(-1 - (TafDeep.split("../").length - 1)).join("/") + "/"
    let TafProjectBaseLocation = metaScript.split("/").slice(0, -3).join("/") + "/" + TafDeep

    window.TAF = { projectBaseLocation: TafProjectBaseLocation }

    // set json
    let [json, defaultJson, local, src, require] = (await ajax.array.get(
        [
            TafLocation + "settings/package.more.json",
            "GET",
            { parse: "JSON" }
        ], [
            TafLocation + "settings/package.default.json",
            "GET",
            { parse: "JSON" }
        ], [
            TafLocation + "settings/package.project.json",
            "GET",
            { parse: "JSON" }
        ], [
            TafLocation + "settings/src.json",
            "GET",
            { parse: "JSON" }
        ], [
            TafLocation + "settings/require.json",
            "GET",
            { parse: "JSON" }
        ]))

    window.TAF = {
        // 
        ajaxBaseLocation: params.baseLocation.ajax,
        scriptBaseLocation: params.baseLocation.script,
        dirName: metaScript.split("/").slice(0, -1).join("/").split("/").slice(-2)[0],
        baseLocation: TafBaseLocation,
        deep: TafDeep,
        projectBaseLocation: TafProjectBaseLocation,
        location: TafLocation,
        json: {
            loader: {
                src,
                require,
                local,
                tool: {
                    ...json.tool,
                    default: defaultJson.tool
                },
                module: {
                    ...json.module,
                    default: defaultJson.module
                },
                default: {
                    "module": defaultJson.module,
                    "tool": defaultJson.tool
                }
            }
        },
        module: {

        }
    }

    // console.log(json)


    // #endregion set global variable

    // #region load scriptLoader

    // ! prototype/modifier must be load in first and with scriptLoader.load and not .loads (tthe asyncForEach is used in scriptLoader.loads function)
    window.TAF.module.prototypeModifier = await scriptLoader.loadAndCall("prototype/modifier", "default")
    window.TAF.module.error = await scriptLoader.load("n0safe/console/error")
    await scriptLoader.load("ajax")
    await scriptLoader.load("loader/scriptLoader")

    // #endregion load scriptLoader

    // #region load module requested by user

    let modulesLoad = await scriptLoader.loads(...[...params.requireScript.map(function() { return [...arguments] }), ...TAF.json.loader.require.map(function() { return [...arguments] })])

    // #endregion load module requested

    delete window.setBuild

    console.log("%c%s", "color: #2bb7df; font-size: 15px;", "the setBuild function end up in " + (performance.now() - startTime) + "ms")

    // #region return

    return modulesLoad

    // #endregion return
}