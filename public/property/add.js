await setBuild({
    requireScript: ["function"]
})

const redirect = scriptLoader.call("function", "redirect")


let errorMessageElement = document.getElementById("error-message")


let form = document.querySelector("form");

let FormManager = await scriptLoader.require({ module: "manager/form", property: "default" })

let formManager = new FormManager(form, async function(property) {
    let response = await ajax.get({ url: "property/add/process", method: "POST", data: property.value })
    response.see()
    if (response.ok()) {
        redirect("/property")
    } else {
        // todo : fetch response and display the error (response is an array with the name of the block error)
    }
})