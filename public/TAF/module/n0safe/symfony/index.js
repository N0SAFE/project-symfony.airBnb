const PARAMS = window.PARAMS[
    import.meta.url];

const windowManager = PARAMS.get("n0safe/manager/window", "default")
const childWindow = windowManager.createChild(
    import.meta.url + "/../index.html", "child")

export function showError(data) {
    childWindow.open()
    childWindow.write(data)
}