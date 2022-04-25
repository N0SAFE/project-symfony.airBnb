export default new(class TypeManager {
    verify = function(item, verifObj) {

    }

    parse = new class extends TAF.module.prefabObject.Container {
        constructor(parent) {
            super(parent)
        }
        toString(typeObj) {

        }
        toObj(typeString) {

        }
    }(this)
})





let test = {
    type: "string",
    defaultValue: "je",
    nullable: true,
};


let testVal = "un string"

let testValError = 1




any = "any"

// test2<Object<?test:[string,number], other:any>>
let test2 = {
    type: "object",
    nullable: false,
    content: {
        test: {
            nullable: true,
            type: ["string, number"]
        },
        other: {
            type: any
        }
    }
}

test2Val = {
    test: "je suis un sstring",
    other: {}
}

test2Val2 = {
    other: "other"
}

test2ValError = {
    test: {}
}

test2ValError2 = "test"