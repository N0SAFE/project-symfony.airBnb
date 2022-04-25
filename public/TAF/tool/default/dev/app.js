// creer les securiter avec le session
const PARAMS = TAF.getParams(
    import.meta.url
)

// make the idea for the dev app (use scriptLoader:load and test/error/index.js)
const windowManager = PARAMS.get("manager/window", "default")
const ErrorStackParser = TAF.module.error.ErrorStackParser
const onrequestreceive = PARAMS.get("dev/onrequestreceive", "default")
const components = PARAMS.get("dev/components")


export default new(class {
    childWindow = windowManager.createChild({
        windowName: "TAF debuger",
        options: {
            menubar: false,
        }
    })
    customErrorLogging = function(ex) {
        this.send(ex)
    }.bind(this);
    customRequestLogging = function(request) {
        this.send(request)
    }.bind(this)
    eventListnerFunction = {
        error: function(event) {
            this.customErrorLogging({
                event,
                error: event.error,
                currentTarget: event.currentTarget,
                errorName: event.error.stack.split("\n")[0],
                stack: autoFunction(() => { try { return ErrorStackParser.parse(event.error) } catch { return new Error() } }),
                timestamp: event.timeStamp,
                type: "error"
            })
            event.preventDefault()
        }.bind(this),
        unhandledrejection: function(event) {
            this.customErrorLogging({
                event,
                error: event.reason,
                currentTarget: event.currentTarget,
                stack: autoFunction(() => { try { return ErrorStackParser.parse(event.reason) } catch { return new Error() } }),
                timestamp: event.timeStamp,
                type: "unhandledrejection"
            })
            event.preventDefault()
        }.bind(this)
    }
    defaultValue = {
        XMLRequestSend: XMLHttpRequest.prototype.send,
        fetch: fetch
    }
    scriptLoaderCallback = function(event) {
        if (event == "load") {
            console.log("load")
        } else if (event == "call") {
            console.log("call")
        }
    }
    state = false
    sendFunctionName = "onrequestreceive"

    // obj type objInterface
    event(obj) {

    }

    send(...args) {
        let obj = this
        this.childWindow.call(function() { this[obj.sendFunctionName](...args) })
    }

    on() {
        console.log(this.childWindow.parseOptions())
        if (this.state == true) {
            return
        }
        if (this.childWindow.firstOpen) {
            console.log("firstOpen")
            this.childWindow.innerHTML = ""
            this.childWindow.opened
        }

        this.childWindow.open()
        this.childWindow.opened[this.sendFunctionName] = onrequestreceive

        this.state = true
        let obj = this
        window.addEventListener("error", this.eventListnerFunction.error)
        window.addEventListener('unhandledrejection', this.eventListnerFunction.unhandledrejection);


        XMLHttpRequest.prototype.onsend = this.defaultValue.XMLRequestSend
        XMLHttpRequest.prototype.send = function() {
            obj.customRequestLogging(this)
            this.onsend()
        }
        window.fetch = async function() {
            return await obj.defaultValue.fetch.apply(this, arguments).then(function(response) { obj.customRequestLogging(response) })
        }
    }

    off() {
        if (this.state == false) {
            return
        }
        this.state = false
        let obj = this
        window.removeEventListener("error", this.eventListnerFunction.error)
        window.removeEventListener("unhandledrejection", this.eventListnerFunction.unhandledrejection)

        XMLHttpRequest.prototype.send = this.defaultValue.XMLRequestSend

        window.fetch = this.defaultValue.fetch
    }

    pushReceiveIntervace(receiveInterface) {
        window.arrayReceiveInterface
    }
})