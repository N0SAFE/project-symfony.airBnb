export function caller(obj) {
    // is called by (type = "name", "url", "default" (not import by scritpLoader), ...) (name = name of the calle (url, name))
    let type = obj.type
    let name = obj.name
}


export function isCalledByTAF() {
    // return true if the module is alreadyLoad by the scritpLoader module
    // to see this i have chack if the filename of the caller function is set in TAF.PARAMS
    // get the fileName of the caller by stackParser error
}