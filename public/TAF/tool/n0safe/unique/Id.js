const PARAMS = getParams()

export default class UniqueId extends PARAMS.get("n0safe/__unique/super__", "default") {
    constructor(params) {
        super(params, function() {
            return this.elements.slice(-1)[0] + 1 || 0
        })
    }

    // readjusts all the id in a time (it is a long process if the this.elements is big)
    // return an object with matche key, value = before, after
    rearange() {
        let ret = {}
        for (let i = 0; i < this.elements.length; i++) {
            ret[this.elements[i]] = i
        }
        return ret
    }
}