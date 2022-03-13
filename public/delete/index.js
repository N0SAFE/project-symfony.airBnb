await setBuild({
    requireScript: ["function"]
})

const redirect = scriptLoader.call("function", "redirect")

let deleteButton = document.getElementById("delete-button")
let errorText = document.getElementById("error-text")

deleteButton.onclick = async function() {
    let response = await ajax.get("delete/proccess", "POST", { parse: "TEXT" })
    console.log(response)
    if (response != "ko") {
        redirect("/")
    } else {
        let inner = errorText.innerHTML
        errorText.innerHTML = "une erreur est survenu lors de la suppresion du compte"
        setTimeout(() => {
            errorText.innerHTML = inner
        }, 3000)
    }
}