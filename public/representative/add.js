await setBuild({
    requireScript: ["function"]
})

const redirect = scriptLoader.call("function", "redirect")


let errorMessageElement = document.getElementById("error-message")

let button = document.getElementById("button")
let text = document.getElementById("text")
let div = document.getElementById("div")
let timeout

let form = document.querySelector("form");

let FormManager = await scriptLoader.require({ module: "manager/form", property: "default" })

let formManager = new FormManager(form, async function(property) {
    try { clearTimeout(timeout) } catch {}
    button.querySelectorAll("div")[0].style.display = "none";
    button.querySelectorAll("div")[1].style.display = ""
    let ajaxResponse = await ajax.get({ url: "representative/add/process", method: "POST", parse: "TEXT", data: property.value })
    console.log(ajaxResponse.response())
    if (ajaxResponse.ok()) {
        div.style.display = "flex"
        div.style.background = "green"
        text.innerHTML = "le mandataire " + property.value.get("first_name") + " " + property.value.get("last_name") + " a bien été ajouter"
    } else if (ajaxResponse.status() == http.getCode("Unauthorized")) {
        div.style.display = "flex"
        div.style.background = "red"
        text.innerHTML = "tout les champ ne sont pas valable"
    } else if (ajaxResponse == "exist") {
        div.style.display = "flex"
        div.style.background = "red"
        text.innerHTML = "le mandataire exist deja"
    } else {
        div.style.display = "flex"
        div.style.background = "red"
        text.innerHTML = "une erreur a occurer du coté du server"
    }
    button.querySelectorAll("div")[0].style.display = "";
    button.querySelectorAll("div")[1].style.display = "none"
    timeout = setTimeout(function() {
        div.style.display = "none"
    }, 5000)
})