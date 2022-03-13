const PARAMS = window.PARAMS[
    import.meta.url]

const elmtCreator = PARAMS.get("n0safe/manager/element", "creator")

console.log(elmtCreator)

export default class videoManager {
    videoElement = elmtCreator({
        tag: "video",
        attribute: {
            controls: undefined
        }
    })
    constructor(sources = [], divCantLoad) {
        this.sources = sources
        this.divCantLoad = divCantLoad
        this.sources.forEach(source => {
            if (source instanceof HTMLElement) {
                this.videoElement.appendChild(source)
            }
        }, this)
        if (this.divCantLoad instanceof HTMLElement) {
            this.videoElement.appendChild(this.divCantLoad)
        }

        console.log(this.videoElement.audioTrackList)

        this.videoElement.addEventListener("error", () => {
            console.log("error")
        })
        this.videoElement.addEventListener("canplay", () => {
            console.log("canplay")
        })
        this.videoElement.addEventListener("canplaythrough", () => {
            console.log("canplaythrough")
        })
        this.videoElement.addEventListener("loadeddata", () => {
            console.log("loadeddata")
        })
        this.videoElement.addEventListener("loadedmetadata", () => {
            console.log("loadedmetadata")
        })
        this.videoElement.addEventListener("loadstart", () => {
            console.log("loadstart")
        })
        this.videoElement.addEventListener("playing", () => {
            console.log("playing")
        })
        this.videoElement.addEventListener("play", () => {
            console.log("play")
        })
        this.videoElement.addEventListener("pause", () => {
            console.log("pause")
        })
        this.videoElement.addEventListener("ended", () => {
            console.log("ended")
        })
        this.videoElement.addEventListener("waiting", () => {
            console.log("waiting")
        })
        this.videoElement.addEventListener("stalled", () => {
            console.log("stalled")
        })
        this.videoElement.addEventListener("complete", () => {
            console.log("complete")
        })
        this.videoElement.addEventListener("durationchange", () => {
            console.log("durationchange")
        })
        this.videoElement.addEventListener("emptied", () => {
            console.log("emptied")
        })
        this.videoElement.addEventListener("progress", () => {
            console.log("progress")
        })
        this.videoElement.addEventListener("ratechange", () => {
            console.log("ratechange")
        })
        this.videoElement.addEventListener("seeked", () => {
            console.log("seeked")
        })
        this.videoElement.addEventListener("seeking", () => {
            console.log("seeking")
        })
        this.videoElement.addEventListener("suspend", () => {
            console.log("suspend")
        })
        this.videoElement.addEventListener("timeupdate", () => {
            console.log("timeupdate")
        })
        this.videoElement.addEventListener("volumechange", () => {
            console.log("volumechange")
        })
    }
    get() {
        return this.videoElement
    }
}