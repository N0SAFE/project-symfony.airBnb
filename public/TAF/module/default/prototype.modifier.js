const PARAMS = window.PARAMS[
    import.meta.url];

class ModifiedPrototype {
    // contain all association between fileName and associate object
    // example : association{"prototype/array": Array}
    association = {}
        // contain all association between class name string and current class
    association_string_to_object = PARAMS.get("/global/association/string-class.js", "default")

    constructor() {
        this.prototype = {}
    }

    classNewPrototype(object, propertyName, value, moduleNameForConflict = "") {

        moduleNameForConflict = moduleNameForConflict != "" ? "[" + moduleNameForConflict + "]" : ""
        this.createNewBibl(Object.prototype.toString.call(object()))
        object.prototype[propertyName] = value

        if (this.prototype[Object.prototype.toString.call(object()) + moduleNameForConflict] == undefined) {
            this.prototype[Object.prototype.toString.call(object()) + moduleNameForConflict] = { "class": object, "property": [] }
        }

        this.prototype[Object.prototype.toString.call(object()) + moduleNameForConflict].property.push(value)

    }
    getPersonnalizedProperty(object, propertyName = null) {
        return propertyName == null ? this.prototype[object] : this.prototype[object][propertyName]
    }
    getAllObjectsWithPersonnalizedProperty() { return this.prototype }
    createNewBibl(biblName) {
        if (!this.isBilbExist) {
            this.prototype[biblName] = {}
        }
        return biblName
    }

    isBilbExist(biblName) {
        return Object.keys(this.prototype).includes(biblName)
    }

    setAssociations() {
        let association = Object.keys(TAF.json.loader.tool.default).filter(function(key) { return key.split("/")[0] == "prototype" }).map(function(key) { return [key, TAF.json.loader.tool.default[key]] })
        association.forEach(function([name, object]) {
            try { this.association[name] = this.association_string_to_object[object.params.object]; } catch {}
        }.bind(this))
    }
}

let modifiedPrototype

export default function getModifiedPrototype() {
    return modifiedPrototype
}
export function modifiedNewPrototype(object, propertyName, value, moduleNameForConflict = "") {
    modifiedPrototype.classNewPrototype(object, propertyName, value, moduleNameForConflict)
}
export function setModifiedPrototypeClass() {
    modifiedPrototype = new ModifiedPrototype()
    modifiedPrototype.setAssociations()
    modifiedNewPrototype(Array, "asyncForEach", asyncForEach)
}

export async function loadsPrototypeFromFile(...array) {
    let promises = array.map(async function([fileName, funcName, name]) {
        return loadPrototypeFromFile(fileName, funcName, name)
    })
    return await Promise.all(promises)
}

export async function loadPrototypeFromFile(fileName, funcName, name = undefined) {
    if (scriptLoader == undefined) {
        throw new Error("to use the function loadPrototypeFromFile, you must ini the built-in package")
    }
    if (scriptLoader.call(fileName) == false) {
        await scriptLoader.load(fileName)
    }
    // console.log(scriptLoader.call(fileName, funcName))
    modifiedNewPrototype(modifiedPrototype.association[fileName], name ? name : funcName, scriptLoader.call(fileName)[funcName])
    return true;
}

export function getActualModifiedPrototype() {
    return getModifiedPrototype().prototype
}

async function asyncForEach(callback = () => { throw new Error("error no callback assign"); }, wait = true, timeout = 0) {
    let ret = [];
    callback = callback.bind(this)
    for (let i = 0; i < this.length; i++) {
        this.index = i
        if (i != 0 && timeout != 0 && !isNaN(timeout)) {
            await new Promise(resolve => setTimeout(resolve, timeout))
        }
        if (wait == false) {
            this.actualReturn = callback(this[i])
            ret.push(this.actualReturn)

        } else {
            this.actualReturn = await callback(this[i])
            ret.push(this.actualReturn)

        }
    }
    return ret;
}