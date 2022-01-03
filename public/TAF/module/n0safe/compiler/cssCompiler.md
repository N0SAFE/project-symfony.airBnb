example:

function __main__() {

    let selector = new cssSelector("test", "id");

    let query = new cssQuery(
        [
            [selector, "space"]
        ], {
            "color": "red"
        }
    );

    let query2 = new cssQuery(
        [
            [".test", "space"],
            [selector, ">"]
        ], {
            "color": "red"
        }
    )

    let style = new cssCompiler(
        [
            query,
            query2
        ]
    )

    console.log(style.compile());

    console.log(selector)

}