import DbClass from "../index.js"

const capitalize = await scriptLoader.loadAndCall("prototype/string", "capitalize")

export default new(class RandomData extends DbClass {
    data = {}
    template = {}
    constructor() {
        super()
    }
    async get(toGet, template) {
        return this["get" + capitalize(toGet)] ? await this["get" + capitalize(toGet)](template) : (!this.data[toGet] ? this.data[toGet] = (await ajax.get({
            url: this.getPath(
                import.meta.url) + "/" + toGet + ".json",
            method: "GET",
            parse: "JSON"
        })).response() : this.data[toGet])
    }
    async set(toSet, array) {
        return this.data[toSet] = array
    }
    async templateSet(toSet, templateName, array) {
        this.data[toSet] = this.data[toSet] || {}
        return this.data[toSet][templateName] = array
    }
    async getName(template) {
        // f/l
        // l/f
        let firstNameArray = await this.get("firstName")
        let lastNameArray = await this.get("lastName")
        let length = firstNameArray.length < lastNameArray.length ? firstNameArray.length : lastNameArray.length

        if (template) {
            template = this.parseTemplate(template, {
                verify: [
                    ["l", "f"],
                    ["l", "f"]
                ],
                diffente: [
                    [0, 1]
                ]
            })
            if (template[0] == "l" && template[1] == "f") {
                return this.templateSet("name", template.join("/"), Array.from({ length }).map(function() { return this.getRandom(lastNameArray) + " " + this.getRandom(firstNameArray) }, this));
            } else if (template[0] == "f" && template[1] == "l") {
                return this.templateSet("name", template.join("/"), Array.from({ length }).map(function() { return this.getRandom(firstNameArray) + " " + this.getRandom(lastNameArray) }, this));
            }
        }
        return await this.set("name", Array.from({ length }).map(function(none, index) { return this.getRandom(firstNameArray) + " " + this.getRandom(lastNameArray) }, this));
    }
    async getCity() {

    }
    async getZipCode() {

    }
})