await setBuild({
    requireScript: ["function"]
})

const redirect = scriptLoader.call("function", "redirect")


let errorMessageElement = document.getElementById("error-message")


let form = document.querySelector("form");

let FormManager = await scriptLoader.require({ module: "manager/form", property: "default" })

let formManager = new FormManager(form, async function(property) {
    let response = await ajax.get({ url: "tenant/add/process", method: "POST", parse: "TEXT", data: property.value })
    console.log(response)
    if (response == "ok") {
        redirect("/tenant")
    } else {
        // todo : fetch response and display the error (response is an array with the name of the block error)
    }
})