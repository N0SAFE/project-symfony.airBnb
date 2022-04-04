export default new class UrlParamParser {
    constructor() {}
    refresh() {
        location.reload();
    }

    get(key = undefined) {
        if (key) {
            key = key.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
            var regex = new RegExp('[\\?&]' + key + '=([^&#]*)');
            var results = regex.exec(location.search);
            return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
        } else {
            let parts = window.location.search.substr(1).split("&");
            let obj = {};
            for (let i = 0; i < parts.length; i++) {
                let temp = parts[i].split("=");
                obj[decodeURIComponent(temp[0])] = decodeURIComponent(temp[1]);
            }
            if (obj[""] != undefined) {
                delete obj[""]
            }
            return obj;
        }
    }

    // todo: create the ârse method to parse object to string url parameters
    parse(obj) {
        return Object.entries(obj).map(function([key, value]) {
            if (key == "" || value == "") {
                return "";
            }
            return key + "=" + value
        }).join("&")
    }

    __pushState__(obj) {
        let str = this.parse(obj)
        let refresh = window.location.protocol + "//" + window.location.host + window.location.pathname + (str ? "?" : "") + str;
        window.history.pushState({ path: refresh }, '', refresh);
    }

    add(key, value, obj = {}) {
        let erased = obj.erased ? obj.erased : true,
            error = obj.error ? obj.error : false,
            refresh = obj.refresh ? obj.refresh : false,
            param = this.get()
        if (param[key] === undefined) {
            param[key] = value
        } else {
            if (erased) {
                param[key] = value
            } else if (error) {
                throw new Error("UrlParamParser.add: param already exists")
            }
        }
        this.__pushState__(param)
        if (refresh) {
            this.refresh()
        }
    }

    remove(key, obj = {}) {
        if (!Array.isArray(key)) {
            key = [key]
        }
        let error = obj.error ? obj.error : false,
            refresh = obj.refresh ? obj.refresh : false,
            param = this.get()
        if (param[key] === undefined) {
            if (error) {
                throw new Error("UrlParamParser.remove: param not found")
            }
        } else {
            delete param[key]
        }
        this.__pushState__(param)
        if (refresh) {
            this.refresh()
        }
    }

    set(objectValue, obj = {}) {
        let create = obj.create ? obj.create : true,
            refresh = obj.refresh ? obj.refresh : false,
            param = this.get()

        Object.assign(param, objectValue)
        this.__pushState__(param)
        if (refresh) {
            this.refresh()
        }
    }
}();