

function createElement(type, props){
    return {
        type: type,
        props: props,
    }
}

function render(element, container){
    console.log("inputs: ", element, container)
    let node = document.createElement(element.type)
    node["title"] = element.props.title

    let children = element.props.children
    for (let child of children){
        if (typeof child === "string"){
            console.log("string child found: ", child)
            let text = document.createTextNode("")
            text["nodeValue"] = child
            node.appendChild(text)
        }else{
            console.log("child is not a string, attempting recursion with inputs: ", child, node)
            render(child, node)
        }
    }

    container.appendChild(node)
}



//testing
let grandChild1 = {
    type: "h3",
    props:{
        title: "grandchild 1",
        children: ["i am grandchild 1"]
    },

}
let grandChild2 = {
    type: "h3",
    props:{
        title: "grandchild 2",
        children: ["grandchild 2"]
    },

}
let testChild1 = {
    type: "h2",
    props:{
        title: "child 1",
        children: [grandChild1, grandChild2]
    },

}
let testChild2 = {
    type: "h2",
    props:{
        title: "child 2",
        children: []
    },

}

let container = document.getElementById("root")
let testElement = createElement("h1", {title: "test title", children: ["test element"]})
console.log(testElement)

console.log("getting root element as container: ", container)

console.log(testElement)
render(testChild1, container)