TAF.setExport(
    import.meta.url, {
        // this function is called when try to load a file under dev and that have the attribute "test"
        // all of this is setup in the package.TAF.json
        try: async function(testValue, customValueRequiredByTheCustomFunctionObj) {
            // console.log(arguments)
            // console.log(await arguments[1][0])
        },
        success: function() {
            console.log(arguments)
        },
        error: function() {
            console.log(arguments)
        }
    })