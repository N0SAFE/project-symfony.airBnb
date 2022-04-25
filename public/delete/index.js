await setBuild({
    requireScript: ["function"]
})

const redirect = scriptLoader.call("function", "redirect")

let deleteButton = document.getElementById("delete-button")
let errorText = document.getElementById("error-text")

deleteButton.onclick = async function() {
    let ajaxResponse = await ajax.get({ url: "delete/process", method: "POST", parse: "TEXT" })
    console.log(ajaxResponse.response())
    console.log(ajaxResponse.status())
    if (ajaxResponse.ok()) {
        redirect("/")
    } else {
        let inner = errorText.innerHTML
        errorText.innerHTML = "une erreur est survenu lors de la suppresion du compte"
        setTimeout(() => {
            errorText.innerHTML = inner
        }, 3000)
    }
}