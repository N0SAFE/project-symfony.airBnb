import dbClass from "../dbClass.js";

let mimeType
class MimeType extends dbClass {
    constructor() {
        super();
    }
    getDb() {
        return this.db;
    }
    extension(str) {
        let ret = this.db[str]
        if (ret) {
            return ret.extensions ? ret.extensions : []
        }
        return []
    }
}

export default function() {
    return mimeType
}

export const set = async function() {
    mimeType = new MimeType();
    mimeType.db = await ajax.get(mimeType.getPath(
        import.meta.url) + "/db.json", "POST", { parse: "JSON" });
}