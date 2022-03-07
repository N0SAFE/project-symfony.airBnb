import { isValidURL } from "../../../tool/default/function/function.js"
// baseLocation of non validUrl in the json is TAF/src/{path}

class SrcLoader {
    srcObj = {};
    async load(srcName, type, Await = true) {
        let srcs
        if (isValidURL(srcName)) {
            if (type == undefined) {
                type = /[^.]+$/.exec(filename);
            }
            srcs = [srcs]
            srcs.forEach(await async function(src) {
                if (type == "css") {
                    styleLoader.load(src)
                } else {
                    if (Await) {
                        await scriptLoader.load(src)
                    } else {
                        scriptLoader.load(src)
                    }
                }
                return true
            })
        } else {
            srcs = TAF.json.loader.src

            return await this.search__repo__(srcName.split("~~").slice(0, 2).join("/"), srcs, srcName, Await)
        }
    }
    async search__repo__(baseName, obj, srcName, Await) {
        srcName.split("~~").forEach(function(value) {
                if (obj[value] === undefined) {
                    throw new Error("srcLoader.load: srcName not found: " + srcName)
                }
                obj = obj[value]
            })
            // verify if obj is an object and if has a property named __repo__
        if (obj.__repo__ === undefined) {
            throw new Error("srcLoader.load: srcName not found: " + srcName)
        }
        let temp = obj.__repo__
        if (!Array.isArray(obj.__repo__)) {
            temp = [obj.__repo__]
        }
        temp.forEach(await async function(value) {
            if (typeof value === "string") {
                return await this.search__repo__(baseName, obj, value)
            }
            if (value.link != undefined) {
                if (value.type === "css") {
                    styleLoader.load(value.link)
                    return true
                } else {
                    if (Await) {
                        await scriptLoader.load(value.link)
                        return true
                    } else {
                        scriptLoader.load(value.link)
                        return true
                    }
                }
            }
            if (value.local != undefined) {
                if (value.type === "css") {
                    styleLoader.load(TAFDirName + "/src/" + baseName + "/" + value.local)
                    return true
                } else {
                    if (Await) {
                        await scriptLoader.load("/src/" + baseName + "/" + value.local)
                        return true
                    } else {
                        scriptLoader.load("/src/" + baseName + "/" + value.local)
                        return true
                    }
                }
            }
            throw new Error("error in the src.json file : path not found")
        }.bind(this))
    }
}

let srcLoader

export function setSrcLoader() {
    srcLoader = new SrcLoader()
}

export default function getSrcLoader() {
    return srcLoader
}