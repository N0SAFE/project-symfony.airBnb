require:
    set sessionStorage.baseURL and sessionStorage.baseURI

use:
    scriptLoader.load(href, functionForIni, args, typeOfSort, params = {inner: true~false}) => return module | false if error
    scriptLoader.loads(...[href, functionForIni, args, typeOfSort, params = {inner: true~false}]) => return array of modules | false if error
    scriptLoader.call(href, functionCalled = functionName~null) => return module or function of module | false if error
    scriptLoader.setBaseLocation(baseLocation) => return none
    scriptLoader.getLoadedBySort(sortName | subString of sortName) => return all loaded scripts arrange by sortName
    scriptLoader.loaded() => return all loaded script