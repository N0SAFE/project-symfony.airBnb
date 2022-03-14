import { isValidURL } from "../../tool/default/function/function.js"

export async function ajaxLoad() {
    await scriptLoader.load("/lib/default/parser/js-yaml.js")
    await scriptLoader.load("/lib/default/parser/js-ini.js")
    await scriptLoader.load("/lib/default/parser/js-xml.js")
    await scriptLoader.load("/lib/default/parser/js-csv.js")
}


async function parseStr(data, type) {
    if (type.toUpperCase().trim() == "JSON") {
        return JSON.parse(data)
    } else if (type.toUpperCase().trim() == "HTMLDOCUMENT") {
        // return a HTMLDocument
        return new DOMParser().parseFromString(data, "text/html")
    } else if (type.toUpperCase().trim() == "HTML") {
        // return a array of htmlElement if the data don't have a body and a head else return the body and the head
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

    } else if (type.toUpperCase().trim() == "HTMLARRAY") {
        let doc = document.createElement("div")
        doc.innerHTML = data
        return Array.from(doc.children)
    } else if (type.toUpperCase().trim() == "TEXT") {
        return data
    } else if (type.toUpperCase().trim() == "YAML") {
        let yamlParse = scriptLoader.call("/lib/default/parser/js-yaml.js", "load")
        return yamlParse(data)
    } else if (type.toUpperCase().trim() == "INI") {
        let confParse = scriptLoader.call("/lib/default/parser/js-ini.js", "parse")
        return confParse(data)
    } else if (type.toUpperCase().trim() == "XML") {
        let xmlParse = scriptLoader.call("/lib/default/parser/js-xml.js", "parseFromString")
        return xmlParse(data)
    } else if (type.toUpperCase().trim() == "CSV") {
        let csvParse = scriptLoader.call("/lib/default/parser/js-csv.js", "parse")
        return csvParse(data)
    } else if (type.toUpperCase().trim() == "SCRIPT") {
        // info the script can't be of type module
        let module = {}
        eval(data);
        return module
    } else if (type.toUpperCase().trim() == "DEFAULT") {
        return data
    } else {
        return new Error("Unsupported type")
    }
}

export default new(class Ajax {
    allRequest = []
    isValidMethod(str) {
        return ["GET", "POST", "PUT", "DELETE"].includes(str.toUpperCase().trim())
    }

    array = (function() {
        return {
            get: async function(...array) {
                return Promise.all(array.map(function(item) { return this.get(...item) }.bind(this)))
            }.bind(this),
            set: function(...array) {
                return array.map(function(item) { return this.set(...item) }.bind(this))
            }
        }
    }.bind(this))()



    // this function send and receive data
    // param = Object<route = false, parse = text(json, text, yaml, ini, xml, csv), data:any, headers:Headers>
    // return an XMLRequest object (with the finished request) || if the param.parse is set return the parsed XMLRequest.responseText
    get(url, method = "POST", param) {
        param = param || {};
        let headers = param.headers || new Headers(),
            data = param.data || null,
            parse = param.parse || null,
            route = param.route || false,
            formData = new FormData(),
            getXml = param.getXml || false

        if (typeof url !== "string") {
            throw new Error("url must be string");
        }

        if (typeof method !== "string") {
            throw new Error("method must be string");
        }

        if (!this.isValidMethod(method)) {
            throw new Error("method must be GET, POST, PUT, DELETE");
        }

        if (method.toUpperCase().trim() == "GET" && this.warning == true && data) {
            throw new Error("GET with parameters will overide the url parameters");
        }


        if (!(headers instanceof Headers)) { throw new Error("headers must be instance of Headers") }

        if (data) {
            if (typeof data == "string") {
                formData.append("string", data);
            } else if (Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    formData.append(i, data[i]);
                }
            } else if (data instanceof FormData) {
                formData = data;
            } else if (data instanceof Object) {
                for (let key in data) {
                    formData.append(key, data[key]);
                }
            } else {
                throw new Error("data must be string, array, FormData or Object");
            }
        }


        let content = new Promise((resolve, reject) => {
            let xhr = new XMLHttpRequest()
            this.lastRequest = xhr;
            this.allRequest.push(xhr);
            if (!isValidURL(url) && !route) {
                url = TAF.projectBaseLocation + url;
            }
            if (method == "GET") {
                xhr.open(method, url.split("?")[0] + "?" + Array.from(formData.entries()).map(([key, value]) => { return key + "=" + value }).join("&"), true)
            } else {
                xhr.open(method, url, true);
            }
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if (parse) {
                        if (typeof parse === "function") {
                            resolve(parse(xhr.responseText))
                        } else if (typeof parse === "string") {
                            if (parse.toUpperCase().trim() == "AUTO") {
                                scriptLoader.load("db/mime-type").then(function() {
                                    let mimeType = scriptLoader.call("db/mime-type", "default()")
                                    mimeType.extension(xhr.getResponseHeader("Content-Type").split(";")[0]).forEach(function(ext) {
                                        let parsed
                                        if (ext != "text") {
                                            parsed = parseStr(xhr.responseText, ext);
                                            if (!(parsed instanceof Error)) { resolve(parsed) }
                                        }
                                    })
                                    resolve(parseStr(xhr.responseText, "TEXT"))
                                })
                            } else {
                                let ret = parseStr(xhr.responseText, parse)
                                if (ret instanceof Error) {
                                    throw new Error("parse must be JSON, TEXT, YAML, INI, XML or CSV")
                                }
                                resolve(ret)
                            }
                        } else {
                            throw new Error("unknow parsing type variable");
                        }
                    } else {
                        resolve(xhr)
                    }
                }
            }
            Array.from(headers.entries()).map(([key, value]) => {
                xhr.setRequestHeader(key, value)
            })
            if (formData && method.toUpperCase().trim() != "GET") {
                xhr.send(formData)
            } else {
                xhr.send()
            }
        });
        return content.catch(res => res);
    }


    getLastXmlRequest() {
        return this.lastRequest
    }


    // this function send data
    // param = Object<route = false, data:any, headers:Headers>
    send(url, method = "POST", param) {
        param = param || {};
        let headers = param.headers || new Headers(),
            data = param.data || null,
            route = param.route || false,
            formData = new FormData();

        if (typeof url !== "string") {
            throw new Error("url must be string");
        }

        if (typeof method !== "string") {
            throw new Error("method must be string");
        }

        if (!this.isValidMethod(method)) {
            throw new Error("method must be GET, POST, PUT, DELETE");
        }

        if (method.toUpperCase().trim() == "GET" && this.warning == true && data) {
            throw new Error("GET with parameters will overide the url parameters");
        }


        if (!(headers instanceof Headers)) { throw new Error("headers must be instance of Headers") }

        if (data) {
            if (typeof data == "string") {
                formData.append("string", data);
            } else if (Array.isArray(data)) {
                for (let i = 0; i < data.length; i++) {
                    formData.append(i, data[i]);
                }
            } else if (data instanceof FormData) {
                formData = data;
            } else if (data instanceof Object) {
                for (let key in data) {
                    formData.append(key, data[key]);
                }
            } else {
                throw new Error("data must be string, array, FormData or Object");
            }
        }


        let xhr = new XMLHttpRequest();
        this.lastRequest = xhr;
        this.allRequest.push(xhr);
        if (!isValidURL(url) && !route) {
            url = TAF.projectBaseLocation + url;
        }
        if (method == "GET") {
            xhr.open(method, url.split("?")[0] + "?" + Array.from(formData.entries()).map(([key, value]) => { return key + "=" + value }).join("&"), true)
        } else {
            xhr.open(method, url, true);
        }
        Array.from(headers.entries()).map(([key, value]) => {
            xhr.setRequestHeader(key, value)
        })
        if (formData && method.toUpperCase().trim() != "GET") {
            xhr.send(formData)
        } else {
            xhr.send()
        }

        return true;
    }
})()