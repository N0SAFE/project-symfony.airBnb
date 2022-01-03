export default function chainElmtCreator(obj = []) {
    console.log(obj)
    if (!(typeof obj.tag === "string")) {
        return null;
    }
    obj.attribute = obj.attribute instanceof Object ? obj.attribute : {};
    if (Object.prototype.toString.call(obj.child) === "[object Object]") {
        obj.child = [obj.child]
    }
    if (!Object.prototype.toString.call("[object Array]")) {
        obj.child = []
    }
    if (typeof obj.inner !== "string") {
        obj.inner = undefined
    }

    let elmt = document.createElement(obj.tag);
    for (let key in obj.attribute) {
        elmt.setAttribute(key, obj.attribute[key]);
    }
    console.log(obj.inner)
    if (obj.inner) {
        elmt.innerHTML = obj.inner;
    } else if (obj.child != undefined) {
        obj.child.forEach(child => {
            if (child instanceof HTMLElement) {
                elmt.appendChild(child);
            } else {
                elmt.appendChild(chainElmtCreator(child));
            }
        });
    }
    return elmt;
}