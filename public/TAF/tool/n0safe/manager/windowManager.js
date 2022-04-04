export default new(class WindowManager {
    createChild(obj) {
        return new ChildWindow(obj)
    }

    createParent() {
        return new ParentWindow(...arguments)
    }
})

class ChildWindow {
    opened
    onreceived = () => {}
    constructor(obj = {}) {
        this.options = obj.options || {};
        this.url = obj.url;
        this.windowName = obj.windowName || "Document";
        window.addEventListener("message", function(e) {
            if (e.source == this.opened) {
                this.onreceived(...arguments)
            };
        }.bind(this))
    }
    firstOpen = true
    open(NEW = false) {
        if (this.opened == undefined) {
            this.firstOpen = false
        }
        if (this.opened == undefined || this.opened.closed || NEW) {
            this.close()
            this.opened = window.open(this.url, this.windowName, this.parseOptions());
            this.opened.console.clear()
            this.opened.focus();
        }
    }
    close() {
        if (this.opened) {
            this.opened.close();
        }
    }
    send(data) {
        if (this.opened) {
            this.opened.postMessage(data);
        }
    }
    call(func) {
        func.call(this.opened)
    }
    write(data) {
        if (this.opened)
            this.opened.document.write(data)
    }
    parseOptions() {
        return Object.entries(this.options).map(([key, value]) => `${key}=${value == true ? "yes" :( value == false ? "no" : value)}`).join(",");
    }

    // return the window element of the distant page
    get() {
        return this.opened;
    }
}

class ParentWindow {
    onreceived = () => {}
    constructor(callback) {
        this.opener = window.opener;
        window.addEventListener("message", function(e) {
            if (e.source == this.opener) {
                callback(...arguments)
            };
        }.bind(this))
    }
    send(data) {
        if (this.opener) {
            this.opener.postMessage(data);
        }
    }
    call(func) {
        func.call(this.opener)
    }

    // return the window element of the distant page
    get() {
        return this.opener;
    }
}