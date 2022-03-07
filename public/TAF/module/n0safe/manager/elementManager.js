// templates obj:Object<?tag:string, ?element:HTMLElement<>, ?attribute:Object<key:value>, ?eventListner:Array<Object<key:string, value:any, ?propagation:bool>>, ?inner:string(innerHTML), ?child:creator(recursive)|Array<creator(recursive)>>
// priority order (tag, element, inner, attribute) overridden each other
// ! add the posibility to execute function 


export function createElementFromHTML(htmlString) {
    var div = document.createElement('div');
    div.innerHTML = htmlString.trim();

    // Change this to div.childNodes to support multiple top-level nodes
    return div.firstChild;
}


export function creator(obj = {}) {
    // console.log(obj)
    if (!(typeof obj.tag === "string") && (obj.element != undefined && !(obj.element instanceof HTMLElement))) {
        return null;
    }
    if (typeof obj === "string") {
        return createElementFromHTML(obj);
    }
    if (obj.outer != undefined && typeof obj.outer == "string") {
        return createElementFromHTML(obj.outer);
    }
    obj.attribute = obj.attribute instanceof Object ? obj.attribute : {};
    obj.eventListner = obj.eventListner instanceof Array ? obj.eventListner : [];
    obj.style = obj.style instanceof Object ? obj.style : {};
    obj.property = obj.property instanceof Object ? obj.property : {};
    if (Object.prototype.toString.call(obj.child) === "[object Object]") {
        obj.child = [obj.child]
    }
    if (!Object.prototype.toString.call("[object Array]")) {
        obj.child = []
    }
    if (typeof obj.inner !== "string") {
        obj.inner = undefined
    }
    let elmt
    if (obj.element != undefined && obj.element instanceof HTMLElement) {
        elmt = obj.element
    } else {
        elmt = document.createElement(obj.tag);
    }

    for (let key in obj.attribute) {
        elmt.setAttribute(key, obj.attribute[key]);
    }
    for (let val of obj.eventListner) {
        elmt.addEventListener(val.name, val.value, val.propagation);
    }
    for (let key in obj.style) {
        elmt.style[key] = obj.style[key];
    }
    if (obj.inner) {
        elmt.innerHTML = obj.inner;
    } else if (obj.child != undefined) {
        forEachRecursive(obj.child, elmt);
    }
    Object.entries(obj.property).forEach(([key, value]) => {
        elmt[key] = value;
    });
    return elmt;
}

function forEachRecursive(child, elmt) {
    if (Array.isArray(child)) {
        child.forEach(child => {
            forEachRecursive(child, elmt)
        })
    } else if (typeof child === "function") {
        forEachRecursive(child(elmt), elmt)
    } else {
        if (child == undefined) {
            null
        } else if (child instanceof HTMLElement) {
            elmt.appendChild(child);
        } else {
            elmt.appendChild(creator(child));
        }
    }
}