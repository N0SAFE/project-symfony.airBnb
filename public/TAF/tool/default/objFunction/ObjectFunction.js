import isTypeOf from './verification/typeVerification.js.js.js';

export default class {
    static mergeObject(obj1, obj2) {
        let obj3 = {};
        Object.assign(obj3, obj1);
        Object.assign(obj3, obj2);
        return obj3;
    }

    static getObjectValue(obj) {
        return isTypeOf("object", obj) ? Object.values(obj) : () => { console.error("ObjectFunction.getObjectValue: obj is not an object"); return obj; };
    }

    static getObjectKey(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]' ? Object.keys(obj) : () => { console.error("ObjectFunction.getObjectKey: obj is not an object"); return obj; };
    }

    static isObject(obj) {
        return Object.prototype.toString.call(obj) === '[object Object]';
    }
}

// end