await setBuild({
    requireScript: ["function"]
})

const redirect = scriptLoader.call("function", "redirect")


let errorMessageElement = document.getElementById("error-message")


let form = document.querySelector("form");

let FormManager = await scriptLoader.loadAndCall("n0safe/manager/form", "default")

let formManager = new FormManager(form, async function(property) {
    let response = await ajax.get("login/process", "POST", { parse: "TEXT", data: property.form.value })
    console.log(response)
    if (response != "ko") {
        redirect("/")
    } else {
        let inner = errorMessageElement.innerHTML
        errorMessageElement.innerHTML = "l'email ou le mot de passe est incorrect"
        setTimeout(() => {
            errorMessageElement.innerHTML = inner
        }, 3000)
    }
})

// let randomData = await scriptLoader.loadAndCall("db/randomData", "default")
// console.log(await randomData.get("name", "f/l"))
// console.log(randomData.getRandom(await randomData.get("name")))
// console.log(await randomData.get("cityData"))
// console.log(await randomData.get("countriesData", "name"))
// console.log(randomData)