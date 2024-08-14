

function createElement(type, props, ...children){
    return {
        type: type,
        props: {
            ...props, 
            children: children.map(child =>
                typeof child === "object" ? child : createTextElement(child)
            )
        }
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
    console.log("rendering element: ", element, "of type: ", typeof element, "with container: ", container)
    const dom =
        element.type == "TEXT_ELEMENT"
        ? document.createTextNode("")
        : document.createElement(element.type);
    const isProperty = key => key !== "children";
    Object.keys(element.props)
        .filter(isProperty)
        .forEach(name => {
        dom[name] = element.props[name];
        });
    element.props.children.forEach(child => render(child, dom));
    container.appendChild(dom);
}



//testing

let greatGrandChild1 = createElement("h4", {title: "greatgrandchild 1"}, "i am greatgrandchild 1 ", "youngest of all")

let grandChild1 = createElement("h3", {title: "grandchild 1"}, "i am grandchild 1", greatGrandChild1)

let grandChild2 = createElement("h3", {title: "grandchild 2"}, "i am grandchild 2")

let testChild1 = createElement("h2", {title: "child 1"}, "i am child 1", grandChild1, grandChild2)

let testChild2 = createElement("h2", {title: "child 2"}, "I am child 2", " last of my line")

let testParent = createElement("h1", {title: "parent"}, "test parent", testChild1, testChild2)

let container = document.getElementById("root")

render(testParent, container)