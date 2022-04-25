const PARAMS = TAF.getParams(
    import.meta.url
)

const elmtCreator = PARAMS.get("n0safe/manager/element", "creator")

export default new(class PopUpManager {
    elmtArray = []
    add(titleText, content) {
        let popUp = elmtCreator({
            tag: "div",
            attribute: {
                "pqftkUOnCdtOsDRafRfmdAOKTqXvIQ": "popUp"
            },
            child: [{
                tag: "div",
                child: [{
                    tag: "div",
                    attribute: {
                        "pqftkUOnCdtOsDRafRfmdAOKTqXvIQ": "header"
                    },
                    child: [{
                        tag: "h1",
                        inner: titleText,
                        attribute: {
                            "pqftkUOnCdtOsDRafRfmdAOKTqXvIQ": "title"
                        }
                    }, {
                        tag: "button",
                        attribute: {
                            "pqftkUOnCdtOsDRafRfmdAOKTqXvIQ": "close-button"
                        },
                        property: {
                            onclick: () => {
                                this.elmtArray[0].hide(popUp)
                            }
                        }
                    }]
                }, {
                    tag: "div",
                    attribute: {
                        "pqftkUOnCdtOsDRafRfmdAOKTqXvIQ": "content"
                    },
                    child: [
                        content
                    ]
                }]
            }],
        })
        this.elmtArray.push(popUp)
        this.tryShow()
    }

    tryShow() {
        if (!this.active && this.elmtArray.length > 0) {
            this.show()
        }
    }

    show() {
        document.body.appendChild(this.elmtArray[0])
        this.elmtArray[0].classList.add("show")
        setTimeout(() => {
            this.hide()
        }, 6000)
    }

    hide() {
        this.elmtArray[0].classList.remove("show")
        this.elmtArray[0].classList.add("hide")
        setTimeout(() => {
            this.elmtArray[0].remove()
            this.elmtArray.shift()
            this.tryShow()
        }, 2000)
    }
})