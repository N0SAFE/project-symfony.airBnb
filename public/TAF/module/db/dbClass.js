export default class dbClass {
    getPath(str) {
        return str ? str.split("/").slice(0, -1).join("/") : import.meta.url.split("/").slice(0, -1).join("/");
    }
}