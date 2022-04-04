const PARAMS = TAF.getParams(
    import.meta.url
)

// todo
// require the import.meta.url in the script to the params
export const getCurrentScriptPath = (metaUrl) => {
    return new URL(metaUrl).pathname.split("/").pop()
}

export const getTrace = () => {
    let error = new Error()
    let errorString = error.stack
    let len = error.name + ": " + error.message
    errorString = errorString.slice(len.length + 1)
    let stackLines = errorString.split("\n").map(line => line.trim())
    let ret = []
    stackLines.shift()
    stackLines.forEach(function(stackLine) {
        let ln, col, property, href
        property = stackLine.split("at ")
        property = property.slice(1).join("").split("(")
        property = property.slice(0, property.length - 1)
        property = property.join().trim()
        if (property == "") {
            property = "anonymous"
            href = stackLine.split("at ");
        } else {
            href = stackLine.split("(");
        }
        href = href.slice(1)
        href = href.join()
        href = href.substring(0, href.length - 1);
        href = href.split(":");
        [ln, col] = href.slice(-2)
        href = href.slice(0, -2).join(":");
        ret.push({ property, href, pos: { ln, col } })
    })
    return ret
}


PARAMS.get("n0safe/console/prettyError", "default").appendStyle({

    // this is a simple selector to the element that says 'Error'
    'pretty-error > header > title > kind': {

        // which we can hide:
        display: 'none'

    },

    // the 'colon' after 'Error':
    'pretty-error > header > colon': {

        // we hide that too:
        display: 'none'

    },

    // our error message
    'pretty-error > header > message': {

        // let's change its color:
        color: 'cyan',

        // we can use black, red, green, yellow, blue, magenta, cyan, white,
        // grey, bright-red, bright-green, bright-yellow, bright-blue,
        // bright-magenta, bright-cyan, and bright-white

        // we can also change the background color:

        // it understands paddings too!
        padding: '0 1' // top/bottom left/right

    },

    // each trace item ...
    'pretty-error > trace > item': {

        // ... can have a margin ...
        marginLeft: 2,

        // ... and a bullet character!
        bullet: '"<grey>o</grey>"'

        // Notes on bullets:
        //
        // The string inside the quotation mark will be used for bullets.
        //
        // You can set its color/background color using tags.
        //
        // This example sets the background color to white, and the text color
        // to cyan, the character will be a hyphen with a space character
        // on each side:
        // example: '"<bg-white><cyan> - </cyan></bg-white>"'
        //
        // Note that we should use a margin of 3, since the bullet will be
        // 3 characters long.

    },

    'pretty-error > trace > item > header > pointer > file': {

        color: 'bright-cyan'

    },

    'pretty-error > trace > item > header > pointer > colon': {

        color: 'cyan'

    },

    'pretty-error > trace > item > header > pointer > line': {

        color: 'bright-cyan'

    },

    'pretty-error > trace > item > header > what': {

        color: 'bright-white'

    }
});

export const prettyError = PARAMS.get("n0safe/console/prettyError", "default")

export const ErrorStackParser = PARAMS.get("n0safe/console/errorStackParser", "default")

ErrorStackParser.parseWithAvoid = function(toAvoid, error) {
    toAvoid = !Array.isArray(toAvoid) ? (typeof toAvoid == "object" ? [toAvoid] : []) : toAvoid

    if (toAvoid.length == 0) {
        return this.parse(error)
    }
    let response = this.parse(error)
    return response.filter(function(StackFrame) {
        if (StackFrame.getFileName())
            StackFrame.setFileName(StackFrame.getFileName().substring(0, 5) == "async" ? StackFrame.getFileName().substring(5).trim() : StackFrame.getFileName())
        return toAvoid.every(function(obj) {
            if (obj.line) {
                if (StackFrame.getFileName() == obj.fileName) {
                    return !(StackFrame.getLineNumber() == obj.line)
                }
                return true
            } else if (obj.funcName) {
                if (StackFrame.getFileName() == obj.fileName) {
                    return !(StackFrame.getFunctionName() == obj.funcName)
                }
                return true
            }
            return StackFrame.getFileName() != obj.fileName
        })
    })
}

export const Type = {
    StackError: class StackError extends Error {
        constructor(message) {
            super("StackError", message);
        }
    },

    ArgumentsError: class ArgumentsError extends Error {
        constructor(message) {
            super("ArgumentsError", message)
        }
    },

    TAFFileError: class TAFFileError extends Error {
        constructor(message) {
            super("TAFFileError", message)
        }
    },

    TAFPARAMSError: class TAFPARAMSError extends Error {
        constructor(message) {
            super("TAFPARAMSError", message)
        }
    }
}

// tryCatch({ try: () => { throw new Error("error") }, catch: (e) => { console.error(e) }, exception: [hierarchyObject], this: this, params: { logError: true } })
export const tryCatch = (args = {}) => {
    if (typeof args.try != "function") {
        args.try = args.try = function() {}
    }
    if (typeof args.catch != "function") {
        args.catch = args.catch = function() {}
    }
    if (!Array.isArray(args.exception)) {
        args.exception = []
    }
    if (typeof args.finally != "function") {
        args.finally = args.finally = function() {}
    }
    if (typeof args.params != "object") {
        args.params = {}
    }
    if (typeof args.params.logError != "boolean") {
        args.params.logError = false
    }
    if (typeof args.this != "object") {
        args.this = new class This {}
    }

    try {
        args.try.apply(args.this)
    } catch (e) {
        if (args.exception.length > 0) {
            args.exception.every(exception => {
                if (e instanceof exception) {
                    args.catch.apply(args.this, [e])
                    return false
                }
                return true
            })
        } else {
            args.catch.apply(args.this, [e])
        }
        if (args.params.logError) {
            console.error(e)
        }
    }
    args.finally.apply(args.this)
}