await setBuild({
    requireScript: ["function"]
})

const redirect = scriptLoader.call("function", "redirect")


let errorMessageElement = document.getElementById("error-message")


let form = document.querySelector("form");

let FormManager = await scriptLoader.require({ module: "n0safe/manager/form", property: "default" })

let formManager = new FormManager(form, async function(property) {
    console.log(...property.value.entries())
    let response = await ajax.get("representative/modify/process", "POST", { parse: "TEXT", data: property.value })
    console.log(response)
    if (response == "ok") {
        redirect("/representative")
    } else {
        // todo : fetch response and display the error (response is an array with the name of the block error)
    }
})