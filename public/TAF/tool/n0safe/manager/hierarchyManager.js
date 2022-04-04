const PARAMS = window.PARAMS[
    import.meta.url];

const elmtCreator = PARAMS.get("n0safe/manager/element", "creator")

const CONST = new(class CONST {
    hierarchyId = 0
    getHierarchyId() {
        return this.hierarchyId++
    }
})

export default class HierarchyManager {
    hierarchyId = CONST.getHierarchyId()

    base = elmtCreator({
        tag: "div",
        attribute: {
            "TAF-token": "ISFdqZ1gRzfOPqwc3wqC",
            class: "hierarchy-container unselectables"
        }
    })

    getHierarchyLineNode(id, childLength, spanName, param) {
        let hierarchyId = this.hierarchyId
        let input, nameDiv_text_label, nameDiv, container, nameDiv_label
        let line = elmtCreator({
            tag: "div",
            attribute: {
                "TAF-token": "ISFdqZ1gRzfOPqwc3wqC",
                class: "line"
            },
            child: [
                input = autoFunction(() => {
                    if (childLength != 0) {
                        return elmtCreator({
                            tag: "input",
                            attribute: {
                                "TAF-token": "ISFdqZ1gRzfOPqwc3wqC",
                                type: "checkbox",
                                id: hierarchyId + "-lnHiera" + (id ? "-" + id : "")
                            }
                        })
                    }
                }),
                nameDiv = elmtCreator({
                    tag: "div",
                    attribute: {
                        "TAF-token": "ISFdqZ1gRzfOPqwc3wqC",
                        class: "name"
                    },
                    child: [autoFunction(() => {
                            if (childLength != 0) {
                                nameDiv_label = elmtCreator({
                                    tag: "label",
                                    attribute: {
                                        "TAF-token": "ISFdqZ1gRzfOPqwc3wqC",
                                        for: hierarchyId + "-lnHiera" + (id ? "-" + id : "")
                                    },
                                    child: [{
                                        tag: "i",
                                        attribute: {
                                            "TAF-token": "ISFdqZ1gRzfOPqwc3wqC",
                                            class: "fa fa-angle-right"
                                        }
                                    }]
                                })
                                return nameDiv_label
                            }

                        }),
                        nameDiv_text_label = autoFunction(() => {
                            let nameDiv_text_label = elmtCreator({
                                tag: "label",
                                inner: autoFunction(() => {
                                    return spanName != undefined ? spanName : "error"
                                }),
                                attribute: {
                                    "TAF-token": "ISFdqZ1gRzfOPqwc3wqC",
                                    for: autoFunction(() => { if (childLength != 0) { return hierarchyId + "-lnHiera" + (id ? "-" + id : "") } })
                                },
                                style: {
                                    color: autoFunction(() => { return spanName != undefined ? "" : "red" })
                                }
                            })
                            return nameDiv_text_label
                        })
                    ]
                }),
                container = elmtCreator({
                    tag: "div",
                    attribute: {
                        container: "",
                        "TAF-token": "ISFdqZ1gRzfOPqwc3wqC"
                    }
                })
            ]
        })

        if (param.checked == true) {
            input.checked = true
            console.log("input checked")
        }

        return {
            removeInput: () => {
                input.remove()
                TAF.module.error.tryCatch({
                    try: () => {
                        nameDiv_label.remove()
                    }
                })
                container.remove()
                nameDiv_text_label.removeAttribute("for")
                let current = param.current
                param.callback(nameDiv_text_label, current)
            },
            line: line,
            input: input,
            nameDiv: nameDiv,
            nameDiv_text_label: nameDiv_text_label,
            container: container,
            nameDiv_label: nameDiv_label
        }
    }

    clear() {
        this.base.innerHTML = ""
    }


    // line = HTMLElement
    // obj = {current: {}, parent: {}}
    // params = {}
    recursiveLoadAssociation(line, obj, param) {
        // console.log(param)
        return this.objVerif(line, obj, param)
    }
}

export class HierarchyElement extends HierarchyManager {
    constructor(baseElement, param) {
        super()
        this.baseElement = baseElement
        this.setAttributeName(param.attributeName)
        this.checkAttributeName = param.checkAttributeName
        this.callback = typeof param.callback === "function" ? param.callback : () => {}
    }

    __verifyBaseElement() {
        return this.baseElement instanceof HTMLElement
    }


    setEmplacement(baseElement) {
        this.baseElement = baseElement
    }

    setAttributeName(attributeName) {
        attributeName = attributeName.toLowerCase().trim()
        attributeName = attributeName.split("-").map(subStr => PARAMS.get("prototype/string", "capitalize")(subStr)).join("")
        attributeName = attributeName.charAt(0).toLowerCase() + attributeName.slice(1)
        this.attributeName = attributeName
    }

    load() {
        if (this.__verifyBaseElement()) {
            this.clear()
            return this.recursiveLoadAssociation(this.base, { current: this.baseElement }, { id: "" })
        }
        return false
    }


    objVerif(parentLineContainer, obj, param) {
        let ret
        if (obj.current.getAttribute(this.attributeName) != undefined) {

            let lineObj = this.getHierarchyLineNode(
                param.id,
                this.baseElement.children.length,
                this.baseElement.getAttribute("name") != null ? this.baseElement.getAttribute("name") : this.baseElement.getAttribute("id"), {
                    cheked: this.baseElement.getAttribute(this.checkAttributeName) != undefined ? true : false,
                    callback: this.callback,
                    current: obj.current
                }
            )
            parentLineContainer.appendChild(lineObj.line)

            Object.entries(Array.from(obj.current.children)).forEach(function([index, element]) {
                ret = this.recursiveLoadAssociation(lineObj.container, { current: element, parent: obj.current }, { id: param.id + "-" + index })
            }.bind(this))

            if (ret == false || obj.current.children.length == 0) {
                lineObj.removeInput()
            }
        } else {
            Object.entries(Array.from(obj.current.children)).forEach(function([index, element]) {
                ret = this.recursiveLoadAssociation(parentLineContainer, { current: element, parent: obj.current }, { id: "" + index })
            }.bind(this))
        }
        if (obj.current.children.length == 0) {
            return obj.current.getAttribute(this.attributeName) != undefined
        }
        if (ret) {
            return true
        }
        return obj.current.getAttribute(this.attributeName) != undefined
    }
}
export class HierarchyObject extends HierarchyManager {
    constructor(obj, param = {}) {
        super()
        this.setObj(obj)
        this.paramForLineName = param.paramForLineName
        this.attributeName = param.attributeName
        this.attributeValue = param.attributeValue
        this.checkAttributeName = param.checkAttributeName
        this.callback = typeof param.callback === "function" ? param.callback : () => {}
    }

    setObj(obj) {
        if (this.__verify(obj)) {
            this.obj = obj
            return true
        }
        return false
    }

    __verify(obj) {
        return obj instanceof Object
    }

    load() {
        if (this.__verify(this.obj)) {
            this.clear()
            return this.recursiveLoadAssociation(this.base, { current: this.obj }, { id: "" })
        }
        return false
    }

    objVerif(parentLineContainer, obj, param) {
        let ret
        if (typeof obj.current != "object") {
            return false
        }
        if ((this.attributeValue != undefined && obj.current[this.attributeName] == this.attributeValue) || obj.current[this.attributeName] != undefined) {
            let lineObj = this.getHierarchyLineNode(param.id, Object.values(obj.current).length, obj.current.__name__, {
                checked: obj.current[this.checkAttributeName],
                callback: this.callback,
                current: obj.current
            });
            parentLineContainer.appendChild(lineObj.line)


            Object.values(obj.current).forEach(function(element, index) {
                ret = this.recursiveLoadAssociation(lineObj.container, { current: element, parent: obj.current }, { id: param.id + "-" + index })
            }.bind(this))

            if (ret == false || Object.keys(obj.current) == 0) {
                lineObj.removeInput()
            }
        } else {
            Object.values(obj.current).forEach(function(element, index) {
                ret = this.recursiveLoadAssociation(parentLineContainer, { current: element, parent: obj.current }, { id: "" + index })
            }.bind(this))
        }
        if (ret == false || Object.keys(obj.current) == 0) {
            return (this.attributeValue != undefined && obj.current[this.attributeName] == this.attributeValue) || obj.current[this.attributeName] != undefined
        }
        if (ret) {
            return true
        }
        return (this.attributeValue != undefined && obj.current[this.attributeName] == this.attributeValue) || obj.current[this.attributeName] != undefined
    }
}