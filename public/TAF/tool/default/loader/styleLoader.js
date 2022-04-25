import { StackContainer } from "../../../ini/global.js"

// util
export default new(class StyleLoader {
    constructor() {
        this.loaded = {}
    }
    getCalleeStackFrame = function() {
        return (new StackContainer).getLast()
    }
    load(href) {
        if (this.isLoaded(href)) {
            return false
        }

        if (href.substr(0, 1) == "|") {
            href = TAF.baseLocation + "global/style/" + href.substr(1)
        } else if (href.substring(0, 2) == "./") {
            href = new URL(scriptLoader.getCalleeStackFrame().getFileName().split("/").slice(0, -1).join("/") + "/" + href.substring(2)).href
        } else if (href.substring(0, 1) == "/") {
            href = new URL(TAF.info.baseLocation + href.substring(1)).href
        }

        let cssLink = document.createElement('link');
        cssLink.rel = 'stylesheet';
        cssLink.href = href;

        document.head.appendChild(cssLink)

        this.loaded[href] = cssLink

        return true
    }
    unload(href) {
        if (!this.isLoaded()) {
            return false
        }
        this.loaded[href].remove()
        return true
    }
    isLoaded(href) {
        if (Object.keys(this.loaded).indexOf(href) == -1) {
            return false
        }
        return true
    }
})