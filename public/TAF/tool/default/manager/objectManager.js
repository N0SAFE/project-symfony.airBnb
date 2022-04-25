export default new(class objectManager {
    rebuild(OBJECT, option) {
        option = option instanceof Object ? option : {}
        const privateField = {}
        let descriptor = Object.getOwnPropertyDescriptors(OBJECT)
        Object.entries(descriptor).forEach(function([name, val], index) {
            privateField[name] = val.value
            delete OBJECT[name]
            if (option[name] && option[name].get) {
                OBJECT.__defineGetter__(name, function() {
                    return option[name].get(privateField)
                })
            } else {
                OBJECT.__defineGetter__(name, function() {
                    return privateField[name]
                })
            }
            if (option[name] && option[name].set) {
                OBJECT.__defineSetter__(name, function(toSet) {
                    option[name].set(privateField, toSet)
                })
            } else {
                OBJECT.__defineSetter__(name, function(toSet) {
                    privateField[name] = toSet
                })
            }
        })
        Object.freeze(OBJECT)
    }

    limit() {

    }
})