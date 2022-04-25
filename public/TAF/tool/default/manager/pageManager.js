// todo

export default class PageManager {
    static count = 0
    constructor(option = {}) {
        if (PageManager.count > 1) {
            throw new Error("only on PageManager can exist at a time")
        }
        PageManager.count++;

        // type == route or getParam

        type = option.type


        // bool = fetch the good page on the firstLoad
        firstLoad = option.firstLoad


        // action is the dom element where the change occure
        action = option.action


    }

    getPageContent() {

    }
}