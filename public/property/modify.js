await setBuild({
    requireScript: ["function"]
})

const redirect = scriptLoader.call("function", "redirect")

async function getBase64(file) {
    return await new Promise((resolve, reject) => {
        let reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function() {
            resolve(reader.result);
        };
        reader.onerror = function(error) {
            reject('Error: ', error);
        };
    })
}


let errorMessageElement = document.getElementById("error-message")


let form = document.querySelector("form");

let FormManager = await scriptLoader.require({ module: "manager/form", property: "default" })

let photo = document.getElementById("photo")
let name = document.getElementById("name")

let formManager = new FormManager(form, async function(property) {
    let response = await ajax.get({ url: "property/modify/process", method: "POST", data: property.value })
    console.log(response)
    if (response.ok()) {
        window.location.reload()
    } else {
        // todo : fetch response and display the error (response is an array with the name of the block error)
    }
})