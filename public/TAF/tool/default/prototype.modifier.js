const PARAMS = TAF.getParams(
    import.meta.url
);

export const capitalize = (str) => {
    return str.charAt(0).toUpperCase() + str.slice(1);
}

export default new(class PrototypeModifier {
    // contain all association between fileName and associate object
    // example : association{"prototype/array": Array}
    association = {}
        // contain all association between class name string and current class
    association_string_to_object = PARAMS.get("/global/association/string-class.js", "default")

    constructor() {
        this.prototype = {}
        this.setAssociations()
    }

    async ini() {
        this.add(Array, "asyncForEach", asyncForEach)
        await this.addFromPrototypeModules(
            ['Promise', 'THEN', "then"], ['Promise', 'CATCH', "catch"], /** ['Promise', 'SUCESS', "sucess"], ['Promise', 'ERROR', "error"] */ )
    }

    add(object, propertyName, value, moduleNameForConflict = "") {
        moduleNameForConflict = moduleNameForConflict != "" ? "[" + moduleNameForConflict + "]" : ""
        this.createNewBibl(object.name)
        object.prototype[propertyName] = value

        if (this.prototype[object.name + moduleNameForConflict] == undefined) {
            this.prototype[object.name + moduleNameForConflict] = { "class": object, "property": [] }
        }

        this.prototype[object.name + moduleNameForConflict].property.push(value)

    }

    async addFromPrototypeModules(...array) {
        return await Promise.all(array.map(async function([fileName, funcName, name]) {
            return await this.addFromPrototypeModule(fileName, funcName, name)
        }, this))
    }

    async addFromPrototypeModule(fileName, property, name = undefined) {
        if (scriptLoader == undefined) {
            throw new Error("to use the function loadPrototypeFromFile, you must ini the built-in package")
        }
        fileName = capitalize(fileName)
            // console.log(scriptLoader.call(fileName, funcName))
        this.add(this.association[fileName], name ? name : (Array.isArray(property) ? property.join("_") : property), await scriptLoader.require({ module: "prototype/" + fileName, property }))
    }

    async addFromModules(...array) {
        return await Promise.all(array.map(async function([object, module, property, name]) {
            return this.addFromModule(object, module, property, name)
        }, this))
    }

    async addFromModule(object, module, property, name) {
        if (scriptLoader == undefined) {
            throw new Error("to use the function loadPrototypeFromFile, you must ini the built-in package")
        }

        this.add(object, name ? name : funcName, await scriptLoader.require({ module, property }))
        return object.prototype;
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
        let association = Object.keys(TAF.json.loader.tool.default.prototype).map(function(key) { return [key, TAF.json.loader.tool.default.prototype[key]] })
        association.forEach(function([name, object]) {
            try { this.association[name] = this.association_string_to_object[object.params.object]; } catch {}
        }.bind(this))
    }

    getModifiedPrototype() {
        return this.prototype
    }
})

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