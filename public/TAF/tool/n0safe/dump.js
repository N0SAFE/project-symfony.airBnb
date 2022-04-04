export default function(obj) {
    var objIdMap = new WeakMap,
        objectCount = 0,
        dumpId;

    function objectId(object) {
        if (!objIdMap.has(object)) {
            objIdMap.set(object, ++objectCount)
            return { id: objectCount, state: false }
        };
        return { id: objIdMap.get(object), state: true };
    }

    let recursiveFunc = function(item) {
        if (Array.isArray(item)) {
            item.forEach(function() {
                console.log(item)
            })
        }
    }
}

// copilote