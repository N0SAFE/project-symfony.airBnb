export default new(class WindowManager {
    createChild(url, windowName = "Document", options = {}) {
        return new ChildWindow(url, windowName, options)
    }

    createParent(callback = () => {}) {
        return new ParentWindow(...arguments)
    }
})

class ChildWindow {
    opened
    onreceived = () => {}
    constructor(url, windowName, options) {
        this.options = options;
        this.url = url;
        this.windowName = windowName;
        window.addEventListener("message", function(e) {
            if (e.source == this.opened) {
                this.onreceived(...arguments)
            };
        }.bind(this))
    }
    open(NEW = false) {
        if (this.opened == undefined || this.opened.closed || NEW) {
            this.close()
            this.opened = window.open(this.url, this.windowName, this.parseOptions());
            this.opened.focus();
        } else {
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
    write(data) {
        if (this.opened)
            this.opened.document.write(data)
    }
    parseOptions() {
        return Object.entries(this.options).map(([key, value]) => `${key}=${value}`).join(",");
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

    // return the window element of the distant page
    get() {
        return this.opener;
    }
}