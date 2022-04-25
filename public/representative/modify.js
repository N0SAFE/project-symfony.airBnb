await setBuild({
    requireScript: ["function"]
})

const redirect = scriptLoader.call("function", "redirect")


let errorMessageElement = document.getElementById("error-message")


let form = document.querySelector("form");

let FormManager = await scriptLoader.require({ module: "manager/form", property: "default" })

let formManager = new FormManager(form, async function(property) {
    console.log(...property.value.entries())
    let ajaxResponse = await ajax.get({ url: "representative/modify/process", method: "POST", parse: "TEXT", data: property.value })
    console.log(ajaxResponse)
    ajaxResponse.see()
    if (ajaxResponse.response() == "ok") {
        redirect("/representative")
    } else {
        // todo : fetch response and display the error (response is an array with the name of the block error)
    }
})