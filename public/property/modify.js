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

let FormManager = await scriptLoader.loadAndCall("n0safe/manager/form", "default")

let photo = document.getElementById("photo")

let formManager = new FormManager(form, async function(property) {
    let response = await ajax.get("property/modify/process", "POST", { parse: "TEXT", data: property.form.value, getXml: true })
    console.log(response)
    if (response == "ok") {
        if (property.form.value.get("photo_file").size != 0) {
            photo.src = await getBase64(property.form.value.get("photo_file"))
        }
    } else {
        // todo : fetch response and display the error (response is an array with the name of the block error)
    }
})