export const keyboard = new(class KeyboardManager {
    listner = []
    listnerKey = []
    listenerCombo = []
    keyPressed = []
    constructor() {
        window.addEventListener('keydown', this.verifyKeyDown.bind(this))
        window.addEventListener('keyup', this.verifyKeyUp.bind(this))
        window.addEventListener('keypress', this.verifyKeyPress.bind(this))
    }

    removeListener(callback) {
        return Array.from(this.listner).find(function(obj, index) {
            if (obj.callback == callback) {
                delete this.listner[index]
                return true
            }
            return false
        }, this)
    }

    removeListenerByKey(...keys) {
        return Array.from(this.listner).find(function(obj, index) {
            if (obj.keys.includes(keys)) {
                delete this.listner[index]
                return true
            }
            return false
        }, this)
    }

    // keys is an object with he key, the type (press, up, down, all), timeout
    listenByKey(callback, ...keys) {
        this.listner.push({ keys, callback })
    }

    listenAll(callback) {

    }





    getlistnerFormKey(key) {
        return this.listner.filter(function(obj) {
            if (obj.combo) {
                // if (obj.keys.map(function(obj) { return obj.key }))
            }

            return obj.keys.every(function(keyObj) {
                console.log(keyObj)
                return keyObj.key.toLowerCase() == key.toLowerCase()
            })
        })
    }


    verifyKeyDown(e) {
        console.log(this.getlistnerFormKey(e.key))
        this.keyPressed.pushOnce(e.key.toLowerCase())
        console.log(this.keyPressed)
        console.log("down")
    }

    verifyKeyUp(e) {
        this.keyPressed.removeItemAll(e.key.toLowerCase())
        console.log(this.keyPressed)
        console.log("up")
    }

    verifyKeyPress(e) {
        console.log("press")
    }
})

export const mouse = new(class MouseManager {

})