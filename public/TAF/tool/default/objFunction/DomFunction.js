export default class {
    // #region getElement
    static get(selector) {
        return document.querySelector(selector);
    }
    static getAll(selector) {
        return document.querySelectorAll(selector);
    }
    static getById(id) {
        return document.getElementById(id);
    }
    static getByClass(className) {
        return document.getElementsByClassName(className);
    }
    static getByTag(tagName) {
        return document.getElementsByTagName(tagName);
    }
    static getByName(name) {
        return document.getElementsByName(name);
    }

    // #endregion createElement

    // #region get, set, remove, event
    static getStyle(element) {
        return element.getComputedStyle(element);
    }
    static setStyle(styles, element) {
        Object.assign(element.style, styles);
    }
    static getAttribute(element, attribute) {
        return element.getAttribute(attribute);
    }
    static setAttribute(element, attribute, value) {
        element.setAttribute(attribute, value);
    }
    static removeAttribute(element, attribute) {
        element.removeAttribute(attribute);
    }
    static remove(element) {
        element.remove();
    }
    static add(element, parent) {
        parent.appendChild(elemennt);
    }
    static addEvent(element, event, callback) {
        element.addEventListener(event, callback);
    }
    static addClass(element, className) {
        element.classList.add(className);
    }
    static removeChild(element) {
        element.removeChild(element);
    }

    // #endregion get, set, remove, event

    // #region createElement
    static create(tagName) {
        return document.createElement(tagName);
    }
    static createText(text) {
        return document.createTextNode(text);
    }
    static createComment(text) {
        return document.createComment(text);
    }
    static createDocumentFragment() {
        return document.createDocumentFragment();
    }
    static createAttribute(name) {
        return document.createAttribute(name);
    }
    static createAttributeNS(namespace, name) {
        return document.createAttributeNS(namespace, name);
    }
    static createEvent(name) {
        return document.createEvent(name);
    }
    static createRange() {
        return document.createRange();
    }
    static createNodeIterator(root, whatToShow, filter) {
        return document.createNodeIterator(root, whatToShow, filter);
    }
    static createTreeWalker(root, whatToShow, filter) {
        return document.createTreeWalker(root, whatToShow, filter);
    }
    static createEventListener(type, listener, useCapture) {
        return document.addEventListener(type, listener, useCapture);
    }

    // #endregion createElement

    // #region custom function
    static getDomPath(el, param = {}) {
        param.getAttribute = param.getAttribute == true
        var stack = [];
        while (el.parentNode != null) {
            var sibCount = 0;
            var sibIndex = 0;
            for (var i = 0; i < el.parentNode.childNodes.length; i++) {
                var sib = el.parentNode.childNodes[i];
                if (sib.nodeName == el.nodeName) {
                    if (sib === el) {
                        sibIndex = sibCount;
                    }
                    sibCount++;
                }
            }
            if (param.getAttribute) {
                if (el.hasAttribute('id') && el.id != '') {
                    stack.unshift(el.nodeName.toLowerCase() + '#' + el.id);
                } else if (sibCount > 1) {
                    stack.unshift(el.nodeName.toLowerCase() + ':eq(' + sibIndex + ')');
                } else {
                    stack.unshift(el.nodeName.toLowerCase());
                }
            } else {
                stack.unshift(el)
            }

            el = el.parentNode;
        }

        return stack.slice(1); // removes the html element
    }

    // typeElement = "string" || "node"
    static createNewList(arrayListElement, typeElement = "string") {
        let list = document.createElement('ul');
        if (typeElement == "string") {
            arrayListElement.forEach(element => {
                list.innerHTML += `<li>${element}</li>`
            })
        } else if (typeElement == "node") {
            arrayListElement.forEach(element => {
                list.appendChild(element)
            })
        }
        return list
    }

    static searchDataset(dataset, elseValue) {
        if (dataset != undefined && dataset != "") {
            return dataset
        }
        return elseValue
    }

    static insertAfter(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode.nextSibling);
    }
    static insertBefore(newNode, referenceNode) {
        referenceNode.parentNode.insertBefore(newNode, referenceNode);
    }

    static getParentByClass(element, className) {
        let parent = element.parentElement;
        let retList = []
        if (parent != undefined) {
            retList = this.getParentByClass(parent, className)
        }
        if (parent.classList.contains(className)) {
            retList.push(parent)
        }
        return retList
    }

    static getParentByClass(element, className) {
        let parent = element.parentElement;
        if (parent.classList.contains(className)) {
            return parent
        } else if (parent == undefined) {
            return null
        } else {
            return this.getParentByClass(parent, className)
        }
    }

    static getParentByTag(element, tagName) {
        let parent = element.parentElement;
        if (parent.tagName.toLowerCase() == tagName.toLowerCase()) {
            return parent
        } else if (parent == undefined)
            return null
        else {
            return this.getParentByTag(parent, tagName)
        }
    }

    static getParentByAttributeKey(element, attribute, value) {
        let parent = element.parentElement;
        if (parent.getAttribute(attribute) != undefined) {
            return parent
        } else if (parent == undefined)
            return null
        else {
            return this.getParentByAttribute(parent, attribute, value)
        }
    }

    static getParentByAttributeValue(element, attribute, value) {
        let parent = element.parentElement;
        if (parent.getAttribute(attribute) == value) {
            return parent
        } else if (parent == undefined)
            return null
        else {
            return this.getParentByAttributeValue(parent, attribute, value)
        }
    }

    static getChildByClass(element, className, retList = []) {
        let childs = element.children;
        Array.from(childs).forEach(element => {
            if (element.classList.contains(className)) {
                retList.push(element)
            }
            this.getChildByClass(element, className, retList)
        });
        return retList
    }

    static getChildByTag(element, tagName, retList = []) {
        let childs = element.children;
        Array.from(childs).forEach(element => {
            if (element.tagName.toLowerCase() == tagName.toLowerCase()) {
                retList.push(element)
            }
            this.getChildByTag(element, tagName, retList)
        });
        return retList
    }
}