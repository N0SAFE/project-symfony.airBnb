export default (type, value) => {
    if (Object.prototype.toString.call(type) === '[object Object]') { return value instanceof type; }
    switch (type) {
        case 'array':
            return Array.isArray(value);
        case 'object':
            return typeof value === 'object' && !Array.isArray(value);
        case 'null':
            return value === null;
        case 'boolean':
            return typeof value === 'boolean';
        case 'function':
            return typeof value === 'function';
        case 'number':
            return typeof value === 'number';
        case 'string':
            return typeof value === 'string';
        case 'symbol':
            return typeof value === 'symbol';
        case 'undefined':
            return typeof value === 'undefined';
        case 'date':
            return value instanceof Date;
        case 'error':
            return value instanceof Error;
        case 'map':
            return value instanceof Map;
        case 'set':
            return value instanceof Set;
        case 'weakmap':
            return value instanceof WeakMap;
        case 'weakset':
            return value instanceof WeakSet;
        case 'regexp':
            return value instanceof RegExp;
        case 'promise':
            return value instanceof Promise;
        case 'buffer':
            return Buffer.isBuffer(value);
        case 'arraybuffer':
            return value instanceof ArrayBuffer;
        case 'int8array':
            return value instanceof Int8Array;
        case 'uint8array':
            return value instanceof Uint8Array;
        case 'uint8clampedarray':
            return value instanceof Uint8ClampedArray;
        case 'int16array':
            return value instanceof Int16Array;
        case 'uint16array':
            return value instanceof Uint16Array;
        case 'int32array':
            return value instanceof Int32Array;
        case 'uint32array':
            return value instanceof Uint32Array;
        case 'float32array':
            return value instanceof Float32Array;
        case 'float64array':
            return value instanceof Float64Array;
        case 'bigint64array':
            return value instanceof BigInt64Array;
        case 'biguint64array':
            return value instanceof BigUint64Array;
        case 'dataview':
            return value instanceof DataView;
        case 'file':
            return value instanceof File;
        case 'blob':
            return value instanceof Blob;
        case 'url':
            return value instanceof URL;
        case 'image':
            return value instanceof Image;
        case 'audio':
            return value instanceof Audio;
        case 'video':
            return value instanceof Video;
        case 'geolocation':
            return value instanceof Geolocation;
        case 'navigator':
            return value instanceof Navigator;
        case 'location':
            return value instanceof Location;
        case 'history':
            return value instanceof History;
        case 'screen':
            return value instanceof Screen;
        case 'event':
            return value instanceof Event;
        case 'eventtarget':
            return value instanceof EventTarget;
        case 'element':
            return value instanceof Element;
        case 'document':
            return value instanceof Document;
        case 'documentfragment':
            return value instanceof DocumentFragment;
        case 'documenttype':
            return value instanceof DocumentType;
        case 'htmlcollection':
            return value instanceof HTMLCollection;
        case 'htmldocument':
            return value instanceof HTMLDocument;
        case 'htmlelement':
            return value instanceof HTMLElement;
        case 'htmlinputelement':
            return value instanceof HTMLInputElement;
        case 'htmltextareaelement':
            return value instanceof HTMLTextAreaElement;
        case 'htmlselectelement':
            return value instanceof HTMLSelectElement;
        case 'htmloptionelement':
            return value instanceof HTMLOptionElement;
        case 'htmloptgroupelement':
            return value instanceof HTMLOptGroupElement;
        case 'htmlbuttonelement':
            return value instanceof HTMLButtonElement;
        case 'htmlcanvaselement':
            return value instanceof HTMLCanvasElement;
        case 'htmliframeelement':
            return value instanceof HTMLIFrameElement;
        case 'htmlstyleelement':
            return value instanceof HTMLStyleElement;
        case 'htmlscriptelement':
            return value instanceof HTMLScriptElement;
        case 'htmlanchorelement':
            return value instanceof HTMLAnchorElement;
        case 'htmlappletelement':
            return value instanceof HTMLAppletElement;
        case 'htmlareaelement':
            return value instanceof HTMLAreaElement;
        case 'htmlbaseelement':
            return value instanceof HTMLBaseElement;
        case 'htmlbodyelement':
            return value instanceof HTMLBodyElement;
        case 'htmlbrelement':
            return value instanceof HTMLBRElement;
        case 'htmlbuttonelement':
            return value instanceof HTMLButtonElement;
        case 'htmlcanvaselement':
            return value instanceof HTMLCanvasElement;
        case 'htmldataelement':
            return value instanceof HTMLDataElement;
        case 'htmldatalistelement':
            return value instanceof HTMLDataListElement;
        case 'htmldirectoryelement':
            return value instanceof HTMLDirectoryElement;
        case 'htmldivelement':
            return value instanceof HTMLDivElement;
        case 'htmldlistelement':
            return value instanceof HTMLDListElement;
        case 'htmlelement':
            return value instanceof HTMLElement;
        case 'htmlembedelement':
            return value instanceof HTMLEmbedElement;
        case 'htmlfieldsetelement':
            return value instanceof HTMLFieldSetElement;
        case 'htmlfontelement':
            return value instanceof HTMLFontElement;
        case 'htmlformelement':
            return value instanceof HTMLFormElement;
        case 'htmlframeelement':
            return value instanceof HTMLFrameElement;
        case 'htmlframesetelement':
            return value instanceof HTMLFrameSetElement;
        case 'htmlframetubelement':
            return value instanceof HTMLFrameTubeElement;
    }
}