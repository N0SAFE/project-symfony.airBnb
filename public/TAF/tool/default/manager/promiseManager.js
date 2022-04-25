import { isClass } from "../function/function.js"

export const unique = () => {
    return (new Date()).getTime() + (Math.round(Math.random() * 10000))
}


export default new(class PromiseManager {
    /**
     *  args start
     *  arg         1: <promise>:Promise (promise to set the timeout)
     *  arg         1: <ms>:int (timeout of the promise)
     *  args end
     *  utility: this function can create a timeout for a specifique promise
     *  example start
     *  
     *  exam    let windPromise = await promiseTimeout(aPromise, 100)
     *  exam    ? return <aPromise> if the promise is resolved in under 100 milliseconds else return undefined
     *  
     *  example end
     *  return a promise with the race of <promise> and new promise with resolved in 100 milliseconds
     *  end: if the timeout expire this promise resolve with an undefined else resolve the current <promise> promise 
     */
    promiseTimeout = function(promise, ms) {

        // Create a promise that rejects in <ms> milliseconds
        let timeout = new Promise((resolve, reject) => {
            let id = setTimeout(() => {
                clearTimeout(id);
                reject('Timed out in ' + ms + 'ms. on : ' + this)
            }, ms)
        })

        // Returns a race between our timeout and the passed in promise
        return Promise.race([
            promise,
            timeout
        ])
    }

    /**
     *  args start
     *  arg        1: <time>:int (time in ms for the time sleep)
     *  args end
     *  utility: this function can create a sleep for a specifique time
     *  example start
     *
     *  exam    await sleep(100)
     *
     *  example end
     *  require: use await to call the function
     *  return a promise who self resolved after <time> in milliseconds
     */
    sleep = async function sleep(time) {
        return new Promise(resolve => setTimeout(resolve, time));
    }

    create(callback) {
        return new Promise(callback)
    }

    custom(callback, uses) {
        // uses [{name: "test", func: function(){}}]
        // uses ["test"]
        // uses class test {
        // uses     test
        // uses }

        let self = {
            useFunc: {},
            uses: []
        }

        self.mem = new(class Memorize {
            val = {}
            array = []
            get func() {
                return this.val.func
            }

            set func(func) {
                this.val.func = func
            }

            get args() {
                return this.val.args
            }

            set args(args) {
                this.val.args = args
            }

            get type() {
                return this.val.type
            }

            set type(type) {
                this.val.type = type
            }

            getAll() {
                return this.array
            }

            getCurrent() {
                return this.array.at(-1)
            }

            reset() {
                this.array = []
                this.val = {}
            }

            next() {
                this.array.push({ func: this.val.func, args: this.val.args, type: this.val.type })
                this.val = {}
            }

            last() {
                // ! do not use
                this.array.pop()
                this.val = {}
            }

            remove(activeFunc) {
                let index = this.array.findIndex((obj) => obj.func == activeFunc)
                if (index != -1) {
                    return this.array.splice(index, 1)[0]
                }
                return undefined
            }

            async active(data, index = 0) {
                if (this.array.length <= index) {
                    return data
                }
                if (this.array[index].func.substring(0, 8) == "__self__") {
                    let obj = self.uses.find((obj) => obj.name == this.array[index].func)
                    if (obj) {
                        if (this.array[index].type == "set") {
                            obj.func.call(data, ...this.array[index].args)
                            return await this.active(data, index + 1)
                        }
                        return await this.active(obj.func.call(data, ...this.array[index].args), index + 1)
                    }
                }
                return await this.active(data[this.array[index].func](...this.array[index].args), index + 1)
            }
        })

        self.addProperty = function(propertyName, func) {
            self.uses.push({ name: propertyName, func })
            this.useFunc[propertyName] = func
            this._promise[propertyName] = function(...args) {
                this.mem.func = propertyName
                this.mem.args = args
                this.mem.next()
                return this._promise
            }.bind(this)
        }
        self.removeProperty = function(propertyName) {
            if (!self.useFunc[propertyName]) {
                throw new Error("the property can't be deleted because it dosen't exist")
            }
            delete self._promise[propertyName]
            delete self.useFunc[propertyName]
            this.mem.remove(propertyName)
        }
        self.getPromise = () => this._promise

        const promise = new Promise((resolve, reject) => {
            self.end = resolve
        })

        self._promise = new Promise(async function(resolve, reject) {
            await promise
            let tempResolve = async function(resolvedData) {
                resolve(await this.mem.active(resolvedData))
            }.bind(this)
            let tempReject = async function(rejectedData) {
                reject(await this.mem.active(rejectedData))
            }.bind(this)

            callback.call(this, tempResolve, tempReject)
        }.bind(self))

        self._promise.__set = function(func, ...args) {
            let name = '__self__' + unique()
            self.addProperty(name, func)
            self.mem.func = name
            self.mem.args = args
            self.mem.type = "set"
            self.mem.next()
            return this
        }
        self._promise.__unset = function(func) {
            let obj = this.self.uses.find((obj) => obj.func == func)
            if (obj) {
                this.self.removeProperty(obj.name)
            }
            return this
        }
        self._promise.__get = function(func, ...args) {
            let name = '__self__' + unique()
            self.addProperty(name, func);
            self.mem.func = name
            self.mem.args = args
            self.mem.next()
            return this
        }
        self._promise.self = self

        if (isClass(uses)) {
            // todo
            Object.getOwnPropertyDescriptors(uses)

        } else if (Array.isArray(uses)) {
            uses.forEach(function(item) {
                if (item instanceof Object) {
                    self.addProperty(item.name, item.func)
                } else if (typeof item == "string") {
                    self.addProperty(item, function(args) { this[item](...args) })
                } else {
                    throw new Error("has to be an object or a string")
                }
            })
        } else if (uses) {
            if (uses instanceof Object) {
                self.addProperty(uses.name, uses.func)
            } else if (typeof uses == "string") {
                self.addProperty(uses, function(args) { this[uses](...args) })
            } else {
                throw new Error("has to be an object or a string")
            }
        }

        self.end()
        return self._promise
    }
})