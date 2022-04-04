export default class DbClass {
    getPath(str) {
        return str ? str.split("/").slice(0, -1).join("/") : import.meta.url.split("/").slice(0, -1).join("/");
    }
    getRandomArray(array, length) {
        return Array.from({ length: length ? length : Math.floor(Math.random() * (array.length)) }).map(function() {
            return array[Math.floor(Math.random() * (array.length))]
        })
    }
    getRandom(array) {
        return array[Math.floor(Math.random() * (array.length))]
    }
    parseTemplate(template, option = {}) {
        option = option instanceof Object ? option : {}
        option.itemLength = option.itemLength instanceof Number && option.itemLength >= 1 ? option.itemLength : 1
        option.verify = Array.isArray(option.verify) ? option.verify : []
        option.diferente = Array.isArray(option.diferente) ? option.diferente : []

        if (!Array.isArray(template)) {
            template = template.split("/")
        }
        if (!template.every(function(item) {
                return item.length == option.itemLength
            })) {
            throw new Error("invalid template")
        }
        template = template.map(function(item) {
            if (typeof item != "string") {
                throw new Error("invalid template")
            }
            return item.trim()
        })
        option.verify.forEach(function(array, index) {
            if (!Array.isArray(array) || !array.includes(template[index])) {
                throw new Error("invalid template")
            }
        })
        option.diffente.forEach(function(array, index) {
            let s = new Set(array)
            if (!Array.isArray(array) || s.size !== array.length) {
                throw new Error("duplicate element between element : " + array.map(element, index => index).join(" "))
            }
        })

        return template
    }
}