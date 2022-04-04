export class ScriptLoaderTry extends TAF.event.dev.start {
    toString = () => "[object ScriptLoader start]"
}

export class ScriptLoaderEnd extends TAF.event.dev.end {
    toString = () => "[object ScriptLoader end]"
}

export class ScriptLoaderError extends TAF.event.dev.error {
    toString = () => "[object ScriptLoader error]"
}

export default new class extends TAF.event.dev.listner {
    "[object ScriptLoader error]" = function() {

    }
    "[object ScriptLoader end]" = function() {

    }
    "[object ScriptLoader start]" = function() {

    }
}