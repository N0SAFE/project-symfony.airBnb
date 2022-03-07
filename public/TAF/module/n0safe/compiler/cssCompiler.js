// this object is used for one file
export default class cssCompiler {
    querys = [];
    constructor(querys = []) {
        querys.forEach(function(query) {
            this.addQuery(query);
        }.bind(this))
    }
    addQuery(query) {
        if (query instanceof cssQuery) {
            this.querys.push(query);
        }

    }
    getQuery() {
        return this.querys;
    }
    compile() {
        let ret = "";
        this.querys.forEach(function(query) {
            ret += query.get() + "\n";
        });
        return ret;
    }
}

export class cssQuery {
    association = { " ": "space", ">": "child", "+": "adjacent", "~": "sibling" }

    // selectors template: selectors:Array<selector:cssSelector<>, association = "">
    // body template: body = {property:value, property:value}
    constructor(selectors, body) {
        this.selectors = selectors;
        this.body = body;
    }
    setNewSelector(selector) {
        this.selectors.push(selector);
    }
    resetSelectors() {
        this.selectors = [];
    }
    get() {
        let sortedSelector = ""
        this.selectors.forEach(function([selector, association]) {
            if (this.association[association] !== undefined) {
                sortedSelector += association
            } else if (Object.values(this.association).indexOf(association) !== -1) {
                sortedSelector += Object.keys(this.association).find(function(key) {
                    return this.association[key] == association;
                }.bind(this))
            } else {
                sortedSelector += " "
            }

            if (selector instanceof cssSelector) {
                sortedSelector += selector.get();
            } else {
                sortedSelector += selector;
            }
        }.bind(this));
        return (sortedSelector + JSON.stringify(this.body)).substring(1)
    }
}

export class cssSelector {
    association = { "#": "id", ".": "class", "[]": "attribute", "*": "tag", "": "none" };
    constructor(targetName, baseSelector = "none") {
        this.targetName = targetName;
        if (Object.keys(this.association).indexOf(baseSelector) !== -1) {
            this.baseSelector = baseSelector;
        } else if (Object.values(this.association).indexOf(baseSelector) !== -1) {
            this.baseSelector = Object.keys(this.association)[Object.values(this.association).indexOf(baseSelector)];
        } else {
            this.baseSelector = ".";
        }
        this.selector = this.baseSelector[0] + this.targetName + (this.baseSelector[1] == undefined ? "" : this.baseSelector[1]);
    }
    getTargetName() {
        return this.targetName;
    }
    getBaseSelector() {
        return this.baseSelector;
    }
    get() {
        return this.selector;
    }

    // param is of type cssPseudoClass
    setPseudoClass(pseudoClass) {
        this.selector += pseudoClass.getSelector();
    }
}

export class cssPseudoClass {
    // psuedoClass = ["name", "hasParam"]
    association = {
            "active": false,
            "any-link": false,
            "autofill": false,
            "blank": false,
            "checked": false,
            "default": false,
            "defined": false,
            "dir": true,
            "disabled": false,
            "empty": false,
            "enabled": false,
            "first-child": false,
            "first-of-type": false,
            "fullscreen": false,
            "focus-visible": false,
            "focus-within": false,
            "focus": false,
            "has": true,
            "host-context": true,
            "host": true,
            "host": false,
            "hover": false,
            "in-range": false,
            "indeterminate": false,
            "invalid": false,
            "is": true,
            "matches": true,
            "any": true,
            "lang": true,
            "last-child": false,
            "last-of-type": false,
            "left": false,
            "link": false,
            "not": true,
            "nth-child": true,
            "nth-last-child": true,
            "nth-last-of-type": true,
            "nth-of-type": true,
            "only-child": false,
            "only-of-type": false,
            "optional": false,
            "out-of-range": false,
            "paused": false,
            "picture-in-picture": false,
            "placeholder-shown": false,
            "playing": false,
            "read-only": false,
            "read-write": false,
            "required": false,
            "right": false,
            "root": false,
            "scope": false,
            "target": false,
            "user-invalid": false,
            "user-valid": false,
            "valid": false,
            "visited": false,
            "where": false,
        }
        // param is of type cssPseudoClass or cssSelector
    constructor(selector, param) {
        let temp = Object.entries(this.association).filter(([key, value]) => { return key === selector })
        if (!temp) {
            this.selector = undefined;
        } else if (temp.length > 1) {
            if (param) {
                this.selector = ":" + temp.find(([key, value]) => { return value === true })[0] + "(" + param.get() + ")";
            } else {
                this.selector = ":" + temp.find(([key, value]) => { return value === false })[0]
            }
        } else {
            if (temp[0][1] === true) {
                this.selector = ":" + temp[0][0] + "(" + param.get() + ")";
            } else {
                this.selector = ":" + temp[0][0];
            }
        }
    }
    get() {
        return this.selector;
    }
}

export class cssPseudoElement {

}

function __main__() {

    let selector = new cssSelector("test", "id");

    let query = new cssQuery(
        [
            [selector, "space"]
        ], {
            "color": "red"
        }
    );

    let query2 = new cssQuery(
        [
            [".test", "space"],
            [selector, ">"]
        ], {
            "color": "red"
        }
    )

    let style = new cssCompiler(
        [
            query,
            query2
        ]
    )

    console.log(style.compile());

    console.log(selector)

}