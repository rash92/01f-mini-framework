

function createElement(type, props, ...children){
    return {
        type: type,
        props: {...props, children}
    }
}

function createTextElement(text){
    return {
        type: "TEXT_ELEMENT",
        props: {
            nodeValue: text,
            children: []
        }
    }
}

function render(element, container){
    console.log("inputs: ", element, container)
    let node = document.createElement(element.type)
    node["title"] = element.props.title

    let children = element.props.children
    for (let child of children){
        if (typeof child !== "object"){
            console.log("string child found: ", child)
            let text = document.createTextNode("")
            text["nodeValue"] = child
            node.appendChild(text)
        }else{
            console.log("child is not a string, attempting recursion with inputs: ", child, node)
            console.log("type of child is: ", typeof child)
            render(child, node)
        }
    }

    container.appendChild(node)
}



//testing

let greatGrandChild1 = {
    type: "h4",
    props:{
        title: "greatgrandchild 1",
        children: ["i am greatgrandchild 1", 32]
    },
}
let grandChild1 = {
    type: "h3",
    props:{
        title: "grandchild 1",
        children: ["i am grandchild 1", greatGrandChild1]
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
        children: ["i am child 1", grandChild1, grandChild2]
    },

}
let testChild2 = createElement("h2", {title: "child 2"}, "i am child 2", grandChild1, grandChild2)
console.log("test child 2", testChild2)
let container = document.getElementById("root")
let testElement = createElement("h1", {title: "test title"}, "test element")
console.log("test element: ", testElement)

console.log("getting root element as container: ", container)

console.log(testElement)
render(testChild2, container)