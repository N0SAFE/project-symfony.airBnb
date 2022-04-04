import { isValidURL } from "../../tool/default/function/function.js"
import scriptLoader from "./loader/scriptLoader.js"

export function ajaxLoad() {
    scriptLoader.array.load(
        ["/lib/default/parser/js-yaml.js"], ["/lib/default/parser/js-ini.js"], ["/lib/default/parser/js-xml.js"], ["/lib/default/parser/js-csv.js"]
    )
}


async function parseStr(data, type) {
    if (["YAML", "INI", "XML", "CSV"].includes(type.toUpperCase().trim())) {
        await TAF.promise.ajaxLoad
    }
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

window.test = []

class StackContainer {
    /* Parsing the error stack and avoiding the file that is importing the error stack. */
    stack = TAF.module.error.ErrorStackParser.parseWithAvoid([{
        fileName: import.meta.url
    }], new Error())

    /* Creating a function that returns the last element of the array stack trace. */
    getLast = function() {
        return this.stack[0]
    }

    /* Creating a function that returns the stack trace of the error. */
    getStack = function() {
        return this.stack
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

    getCalleeStackFrame = function() {
        return (new StackContainer).getLast()
    }



    async setCryptedFormData(formData, url, method, crypt) {
        let uncryptFunc = function(str) { return str }
        if (crypt) {
            if (method.toUpperCase().trim() != "POST" && method.toUpperCase().trim() != "GET") {
                throw new Error("when you use the crypt argument, the params must be send by POST or GET method (other http method is not supported)")
            }
            if (TAF.promise.sodium) {
                // await the sodium script load
                await TAF.promise.sodium.then(function() {
                    delete TAF.promise.sodium
                })
            }
            if (crypt == true) {
                crypt = "send"
            }
            if (!["SEND", "RECEIVE", "DEFAULT", "ALL"].includes(crypt.toUpperCase().trim())) {
                throw new Error("the type argument must be SEND, RECEIVE, DEFAULT, ALL")
            }

            if (!window.sodium) window.sodium = await SodiumPlus.auto();

            if (crypt.toUpperCase().trim() == "SEND" || crypt.toUpperCase().trim() == "ALL" || crypt.toUpperCase().trim() == "DEFAULT") {
                let [publicHex, id] = (await ajax.get(
                    import.meta.url + "/../getKey.php", "GET", { parse: "TEXT" })).split(";;;")
                if (publicHex.substring(0, 5) == "<?php") {
                    throw new Error("the php is require to use the ajax crypt function")
                }
                let publicKey = X25519PublicKey.from(publicHex, "hex")


                let arrayObj = {}

                for (let [name, val] of Array.from(formData.entries())) {
                    if (typeof val == "string") {
                        if (name.substring(name.length - 1, name.length - 2) == "[" && name.substring(name.length - 1) == "]") {
                            let cipherText = await sodium.crypto_box_seal(val, publicKey)
                            arrayObj[name] = arrayObj[name] || []
                            arrayObj[name].push(cipherText.toString("hex"))
                        } else {
                            let cipherText = await sodium.crypto_box_seal(val, publicKey);
                            formData.delete(name)
                            formData.append(name, cipherText.toString("hex"))
                        }
                    }
                }

                console.log(Object.entries(arrayObj))
                Object.entries(arrayObj).forEach(function([key, valArray]) {
                    formData.delete(key)
                    console.log(key)
                    valArray.forEach(function(val) {
                        formData.append(key, val)
                    })
                })

                formData.append("__ajax-crypt-id__", id)
                console.log(...formData.entries())
            }
            if (crypt.toUpperCase().trim() == "RECEIVE" || crypt.toUpperCase().trim() == "ALL") {
                let clientKeyPair = await sodium.crypto_box_keypair();
                let clientSecretKey = await sodium.crypto_box_secretkey(clientKeyPair)
                let clientPublicKey = await sodium.crypto_box_publickey(clientKeyPair)
                formData.append("__ajax-client-key__", await sodium.sodium_bin2hex(clientPublicKey.getBuffer()))
                uncryptFunc = async function(cipherText) {
                    return (await sodium.crypto_box_seal_open(sodium.sodium_hex2bin(cipherText), clientPublicKey, clientSecretKey)).toString();
                }
            }
            formData.append("__ajax-crypt-path__", url)
            url =
                import.meta.url + "/../ajaxRedirect.php"

            window.test.push(formData)
        }

        return { url, uncryptFunc }
    }


    // this function send and receive data
    // param = Object<route = false, parse = text(json, text, yaml, ini, xml, csv), data:any, headers:Headers>
    // return an XMLRequest object (with the finished request) || if the param.parse is set return the parsed XMLRequest.responseText
    get(url, method = "GET", param) {
        param = param || {};
        let headers = param.headers || new Headers(),
            data = param.data || null,
            parse = param.parse || null,
            route = param.route || false,
            crypt = param.crypt || false,
            getXml = param.getXml || false,
            formData = new FormData();

        formData.id = Math.random()

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

        if (url.substring(0, 2) == "./") {
            let calledFile = this.getCalleeStackFrame().getFileName()
            if (calledFile.substring(0, 5) == "async") {
                calledFile = calledFile.split(" ").slice(1).join(" ")
            }
            let calledDir = calledFile.split("/").slice(0, -1).join("/")
            url = calledDir + "/" + url.substring(2)
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
                Array.from(data.entries()).forEach(function([name, val]) {
                    formData.append(name, val)
                })
            } else if (data instanceof Object) {
                for (let key in data) {
                    formData.append(key, data[key]);
                }
            } else {
                throw new Error("data must be string, array, FormData or Object");
            }
        }

        let content = new Promise(async(resolve, reject) => {

            let xhr = new XMLHttpRequest()
            this.lastRequest = xhr;
            this.allRequest.push(xhr);

            let uncryptFunc

            if (!isValidURL(url) && !route) {
                url = TAF.info.projectBaseLocation + url;
            } else if (route) {
                url = route
            };

            ({ url, uncryptFunc } = await this.setCryptedFormData(formData, url, method, crypt));

            if (method.toUpperCase().trim() == "GET") {
                url = url.split("?")[0] + "?" + Array.from(formData.entries()).filter(function([key, value]) { return typeof value == "string" }).map(([key, value]) => { formData.delete(key); return key + "=" + value }).join("&")
                xhr.open(method.toUpperCase().trim(), url, true)
            } else {
                xhr.open(method.toUpperCase().trim(), url, true);
            }

            xhr.getUncrypted = function() { return uncryptFunc(xhr.responseText) }
            xhr.onreadystatechange = async() => {
                if (xhr.readyState === 4) {
                    if (xhr.status === 200) {
                        if (parse) {
                            if (typeof parse === "function") {
                                if (getXml)
                                    resolve({ xhr, response: parse(await uncryptFunc(xhr.responseText)) })
                                resolve(parse(await uncryptFunc(xhr.responseText)))
                            } else if (typeof parse === "string") {
                                if (parse.toUpperCase().trim() == "AUTO") {
                                    let mimeType = await scriptLoader.require({ module: "db/mime-type", property: "default" })
                                    if (!xhr.getResponseHeader("Content-Type")) {
                                        console.error("the content type of the requested file can't be readed (return default parse: text)")
                                    } else {
                                        await mimeType.extension(xhr.getResponseHeader("Content-Type").split(";")[0]).forEach(await async function(ext) {
                                            let parsed
                                            if (ext != "text") {
                                                parsed = await parseStr(await uncryptFunc(xhr.responseText), ext);
                                                if (!(parsed instanceof Error)) {
                                                    if (getXml)
                                                        resolve({ xhr, response: parsed })
                                                    resolve(parsed)
                                                }
                                                resolve(new Error("the uncrypt function occure an error"))
                                            }
                                        })
                                    }
                                    if (getXml)
                                        resolve({ xhr, response: parseStr(await uncryptFunc(xhr.responseText), "TEXT") })
                                    resolve(parseStr(await uncryptFunc(xhr.responseText), "TEXT"))
                                } else {
                                    let ret = parseStr(await uncryptFunc(xhr.responseText), parse)
                                    if (ret instanceof Error) {
                                        throw new Error("parse must be JSON, TEXT, YAML, INI, XML or CSV")
                                    }
                                    if (getXml)
                                        resolve({ xhr, response: ret })
                                    resolve(ret)
                                }
                            } else {
                                throw new Error("unknow parsing type variable");
                            }
                        } else {
                            if (retXhr)
                                resolve({ xhr, response: xhr.responseText })
                            resolve(xhr.responseText)
                        }
                    } else {
                        if (getXml)
                            reject({ xhr, response: xhr.responseText })
                        reject(xhr.responseText)
                    }
                }
            }
            Array.from(headers.entries()).map(([key, value]) => {
                xhr.setRequestHeader(key, value)
            })

            try {
                console.log(...data.entries())
            } catch {}

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
            crypt = param.crypt || false,
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

        return (async function() {
            ({ url } = await this.setCryptedFormData(formData, url, method, crypt))
            let xhr = new XMLHttpRequest();
            this.lastRequest = xhr;
            this.allRequest.push(xhr);
            if (!isValidURL(url) && !route) {
                url = TAF.info.projectBaseLocation + url;
            } else if (route) {
                url = route
            }
            if (method.toUpperCase().trim() == "GET") {
                xhr.open(method.toUpperCase().trim(), url.split("?")[0] + "?" + Array.from(formData.entries()).map(([key, value]) => { return key + "=" + value }).join("&"), true)
            } else {
                xhr.open(method.toUpperCase().trim(), url, true);
            }
            Array.from(headers.entries()).map(([key, value]) => {
                xhr.setRequestHeader(key, value)
            })
            if (formData && method.toUpperCase().trim() != "GET") {
                xhr.send(formData)
            } else {
                xhr.send()
            }
        })()
    }
})()