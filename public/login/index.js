await setBuild({
    requireScript: ["function"]
})

const redirect = scriptLoader.call("function", "redirect")


let errorMessageElement = document.getElementById("error-message")


let form = document.querySelector("form");

let FormManager = await scriptLoader.require({ module: "n0safe/manager/form", property: "default" })

let formManager = new FormManager(form, async function(property) {
    let response = await ajax.get("login/process", "POST", { parse: "TEXT", data: property.value })
    console.log(response)
    if (response != "ko") {
        redirect("/")
    } else {
        let inner = errorMessageElement.innerHTML
        errorMessageElement.innerHTML = "l'email ou le mot de passe est incorrect"
        setTimeout(() => {
            errorMessageElement.innerHTML = inner
        }, 6000)
    }
})