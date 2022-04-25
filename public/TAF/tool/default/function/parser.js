export default new(class Parser {

    methods = {
        JSON: (data) => JSON.parse(data),
        HTMLDOCUMENT: (data) => new DOMParser().parseFromString(data, "text/html"),
        HTML: (data) => {
            let doc = new DOMParser().parseFromString(data, "text/html")
            let body, head
            let xml = scriptLoader.call("/lib/default/parser/js-xml.js", "parseFromString")(data)
            if (xml && Array.isArray(xml) && xml.length > 0 && Array.isArray(xml[0].childNodes)) {
                xml[0].childNodes.forEach(function(node) {
                    if (node.tagName == "body") {
                        body = true
                    }
                    if (node.tagName == "head") {
                        head = true
                    }
                })
                if (body || head) {
                    return {
                        body: doc.body,
                        head: doc.head
                    }
                } else {
                    let div = document.createElement("div")
                    div.innerHTML = data
                    return Array.from(div.children)
                }
            }
            let div = document.createElement("div")
            div.innerHTML = data
            return Array.from(div.children)
        },
        HTMLARRAY: (data) => {
            let doc = document.createElement("div")
            doc.innerHTML = data
            return Array.from(doc.children)
        },
        TEXT: (data) => data,
        SCRIPT: (data) => {
            // info the script can't be of method module
            let module = {}
            eval(data);
            return module
        }
    }

    asyncMethods = {
        YAML: (data) => scriptLoader.call("/lib/default/parser/js-yaml.js", "load")(data),
        INI: (data) => scriptLoader.call("/lib/default/parser/js-ini.js", "parse")(data),
        XML: (data) => scriptLoader.call("/lib/default/parser/js-xml.js", "parseFromString")(data),
        CSV: (data) => scriptLoader.call("/lib/default/parser/js-csv.js", "parse")(data)
    }

    isAvailableSyncMethod = (method) => Object.keys(this.methods).includes(method.toUpperCase().trim())
    isAvailableAsyncMethod = (method) => Object.keys(this.asyncMethods).includes(method.toUpperCase().trim())

    async parseFromStr(data, method) {
        if (this.isAvailableAsyncMethod(method)) {
            await TAF.promise.ajaxLoad
            return this.asyncMethods[method.toUpperCase().trim()](data)
        } else if (this.isAvailableSyncMethod(method)) {
            return this.methods[method.toUpperCase().trim()](data)
        }
        throw new Error("unsupported method")
    }

    addAsyncMethod = (methodName, func) => {
        methodName = methodName.toUpperCase().trim()
        if (this.isAvailableAsyncMethod(methodName)) {
            throw new Error("conflict with the method " + methodName)
        }
        this.asyncMethods[methodName] = func
    }
    addSyncMethod = (methodName, func) => {
        methodName = methodName.toUpperCase().trim()
        if (this.isAvailableSyncMethod(methodName)) {
            throw new Error("conflict with the method " + methodName)
        }
        this.methods[methodName] = func
    }
})