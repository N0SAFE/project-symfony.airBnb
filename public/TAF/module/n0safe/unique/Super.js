export default class UniqueSuper {
    elements = []
    generate() {}
    constructor(params, generate) {
        params = params || {}
        this.stock = params.stock == undefined ? true : params.stock
            // if generate is not a function throw an error
        if (typeof generate !== 'function') {
            throw new Error('"generate" must be a function')
        }
        this.generate = generate
    }

    new() {
        let id = this.generate()
        if (!this.stock && this.elements.length > 0) {
            this.elements.pop()
        }
        this.elements.push(id)
        return id
    }

    pop(id) {
        if (!this.stock) {
            throw new Error("'pop' function can't be used when the parameter 'stock' is false")
        }
        let index = this.elements.indexOf(id)
        if (index === -1) {
            throw new Error('id not found')
        }
        this.elements.splice(index, 1)
        return id
    }
}