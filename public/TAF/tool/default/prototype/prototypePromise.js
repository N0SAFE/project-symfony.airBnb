import promiseManager from "../../default/manager/promiseManager.js"
import { isClass } from "../function/function.js"

let Then = Promise.prototype.then
let Catch = Promise.prototype.catch

export const THEN = function(callbackSuccess, callbackError, object) {
    if (!(this instanceof Promise)) {
        return new Error("this function has to be attach to a promise object")
    }
    if (isClass(object)) {
        object = object.prototype
    }
    let promise = Then.call(this, callbackSuccess, callbackError)
    if (object) {
        return promiseManager.custom(async(resolve, reject) => {
                resolve(await promise)
            },
            Object.getOwnPropertyNames(object)
            .filter((str) => {
                return !['constructor', 'prototype', '__proto__'].includes(str)
            })
            .map(function(name) {
                return {
                    name,
                    func: function(funcArgs) {
                        return this[name](...funcArgs)
                    }
                }
            }))
    }
    return promise
}

export const CATCH = function(callbackSuccess, callbackError, object) {
    if (!(this instanceof Promise)) {
        return new Error("this function has to be attach to a promise object")
    }
    if (isClass(object)) {
        object = object.prototype
    }
    let promise = Catch.call(this, callbackSuccess, callbackError)
    if (object) {
        return promiseManager.custom(async(resolve, reject) => {
                resolve(await promise)
            },
            Object.getOwnPropertyNames(object)
            .filter((str) => {
                return !['constructor', 'prototype', '__proto__'].includes(str)
            })
            .map(function(name) {
                return {
                    name,
                    func: function(funcArgs) {
                        return this[name](...funcArgs)
                    }
                }
            }))
    }
    return promise
}


// todo

// export const SUCESS = function(callback, object) {
//     let self = this
//     if (!(object instanceof Object)) {
//         object = {}
//     }
//     if (isClass(object)) {
//         object = object.prototype
//     }
//     return promiseManager.custom(async(resolve, reject) => {
//             resolve(await self)
//         },
//         ...Object.getOwnPropertyNames(object)
//         .filter((str) => {
//             return !['constructor', 'prototype', '__proto__'].includes(str)
//         })
//         .map(function(name) {
//             return {
//                 name,
//                 func: function(ajaxResponse, funcArgs) {
//                     return ajaxResponse[name](...funcArgs)
//                 }
//             }
//         }))
// }

// export const ERROR = function(callback, object) {
//     let self = this
//     if (!(object instanceof Object)) {
//         object = {}
//     }
//     if (isClass(object)) {
//         object = object.prototype
//     }
//     return promiseManager.custom(async(resolve, reject) => {
//             if (self.then(res => { this.undo(); return res }, res => { self.undo(); return res }))
//                 resolve(await self)
//         },
//         ...Object.getOwnPropertyNames(object)
//         .filter((str) => {
//             return !['constructor', 'prototype', '__proto__'].includes(str)
//         })
//         .map(function(name) {
//             return {
//                 name,
//                 func: function(ajaxResponse, funcArgs) {
//                     return ajaxResponse[name](...funcArgs)
//                 }
//             }
//         }))
// }