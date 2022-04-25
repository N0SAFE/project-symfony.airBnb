await setBuild({
    requireScript: ["function"]
})

const redirect = scriptLoader.call("function", "redirect")


let errorMessageElement = document.getElementById("error-message")


let form = document.querySelector("form");

let FormManager = await scriptLoader.require({ module: "manager/form", property: "default" })

let formManager = new FormManager(form, async function(property) {
    let response = await ajax.get({ url: "login/process", method: "POST", parse: "TEXT", data: property.value })
    console.log(response.ok())
    if (response.ok()) {
        redirect("/")
    } else {
        let inner = errorMessageElement.innerHTML
        errorMessageElement.innerHTML = "l'email ou le mot de passe est incorrect"
        setTimeout(() => {
            errorMessageElement.innerHTML = inner
        }, 6000)
    }
})