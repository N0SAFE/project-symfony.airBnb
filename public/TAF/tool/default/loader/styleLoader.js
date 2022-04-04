// util
export default new(class StyleLoader {
    constructor() {
        this.loaded = {}
    }
    load(href) {
        if (this.isLoaded(href)) {
            return false
        }

        if (href.substr(0, 1) == "|") {
            href = TAF.baseLocation + "global/style/" + href.substr(1)
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