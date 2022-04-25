const PARAMS = TAF.getParams(
    import.meta.url
)

const elmtCreator = PARAMS.get("n0safe/manager/element", "creator")

export default new(class UI {
    constructor() {

    }

    multiSelect(array, name) {
        if (!Array.isArray(array)) {
            throw new Error("first parameter would be of type array")
        }
        if (typeof name != "string") {
            throw new Error("the name must be of type string")
        }
        if (name.substring(name.length - 2, name.length) != "[]") {
            name = name + "[]"
        }

        let input = createElement({
            tag: "input"
        })

        let main = document.createElement("div")
        let inputContainer = elmtCreator({
            tag: "div",
            style: {
                display: "none"
            },
            child: [
                input
            ]
        })
        let dropDown = elmtCreator({
            tag: "div"
        })
        let display = elmtCreator({
            tag: "ul",
            child: [{
                tag: "li"
            }]
        })

        main.appendChild(inputContainer)
        main.appendChild(dropDown)
        main.appendChild(display)

        array.forEach(function(obj) {
            if (!(obj instanceof Object)) {
                throw new Error("the array would contains object")
            }
            inputContainer.appendChild(elmtCreator({
                tag: "input",
                attribute: {
                    name,
                    ...autoFunction(() => { if (obj.selected) { return { selected: true } } else { return {} } })
                }
            }))

            dropDown.appendChild(elmtCreator({
                tag: "div",
                property: {
                    onclick: function() {

                    }
                }
            }))

        })
    }

})