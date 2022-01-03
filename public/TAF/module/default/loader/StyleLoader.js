// util
class StyleLoader {
    constructor() {
        this.loaded = {}
    }
    load(href) {

        if (this.isLoaded(href)) {
            return false
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
}
let styleLoader

export default function setLoader() {
    styleLoader = new StyleLoader();
}

export function getloader() {
    return styleLoader
}