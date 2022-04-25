import DbClass from "../index.js";

let dbClass = new DbClass()
let db = (await ajax.get({
    url: dbClass.getPath(
        import.meta.url) + "/db.json",
    method: "GET",
    parse: "JSON"
})).response();

export default new(class MimeType extends DbClass {
    constructor() {
        super();
        this.db = db
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
})