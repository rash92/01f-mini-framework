function createElement(type, props, ...children) {
  return {
    type: type,
    props: {
      ...props,
      children: children.map((child) =>
        typeof child === "object" ? child : createTextElement(child)
      ),
    },
  };
}

function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: [],
    },
  };
}

function createDom(fiber) {
  const dom =
    fiber.type == "TEXT_ELEMENT"
      ? document.createTextNode("")
      : document.createElement(fiber.type);

  updateDom(dom, {}, fiber.props);

  return dom;
}

const isEvent = (key) => key.startsWith("on");
const isProp = (key) => key !== "children" && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (prev, next) => (key) => !(key in next);
const getEventType = (name) => name.toLowerCase().substring(2);

//rewrite?
function updateDom(dom, prevProps, nextProps) {
  //unsure if order of these matters? doing same order as guide
  //remove old or changed event listeners
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) =>
      dom.removeEventListener(getEventType(name), prevProps[name])
    );

  //remove old props
  Object.keys(prevProps)
    .filter(isProp)
    .filter(isGone(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = "";
    });

  //add new or changed props
  Object.keys(nextProps)
    .filter(isProp)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) => {
      dom[name] = nextProps[name];
    });
  //add new event listeners
  Object.keys(nextProps)
    .filter(isEvent)
    .filter(isNew(prevProps, nextProps))
    .forEach((name) =>
      dom.addEventListener(getEventType(name), nextProps[name])
    );
}

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.firstChild);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }
  const domParent = fiber.parent.dom;
 
  if (fiber.effectTag === "APPEND" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETE") {
    domParent.removeChild(fiber.dom);
  }

  commitWork(fiber.firstChild);
  commitWork(fiber.sibling);
}

function render(element, container) {
  wipRoot = {
    dom: container,
    props: {
      children: [element],
    },
    alternate: currentRoot,
  };
  deletions = [];
  nextTask = wipRoot;
}

let nextTask = null;
let wipRoot = null;
let currentRoot = null;
let deletions = null;

function workLoop(deadline) {
  let done = false;
  while (nextTask && !done) {
    nextTask = performTask(nextTask);
    done = deadline.timeRemaining() < 1;
  }
  //commit when task queue is empty
  if (!nextTask && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

//takes in a fiber to perform tasks on, then returns next fiber to work on next.
//order is child, if no children sibling, if no siblings 'uncle'.
function performTask(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const children = fiber.props.children;
  reconcileChildren(fiber, children);
  //go through children to assign as first child vs sibling of previous child

  //return next in line for tasks, child exist is easy case.
  //If not look for siblings, uncles, great uncles etc.
  if (fiber.firstChild) {
    return fiber.firstChild;
  }
  let nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}

function reconcileChildren(wipFiber, children) {
  let prevSibling = null;
  let index = 0
  //javascript && weirdness, will return first part if it's falsy, or will return value of second part
  //i.e. will be null if either are null, otherwise second value
  let oldFiber = wipFiber.alternate && wipFiber.alternate.firstChild;
  while (index < children.length || oldFiber != null) {
    const child = children[index];
    let newFiber = null;

    const sameType = oldFiber && child && child.type == oldFiber.type;

    //keep existing node but replace props
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: child.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE",
      };
    }
    //create and add new node
    if (child && !sameType) {
      newFiber = {
        type: child.type,
        props: child.props,
        dom: null,
        parent: wipFiber,
        alternate: null,
        effectTag: "APPEND",
      };
    }
    //delete old node
    if (oldFiber && !sameType) {
      oldFiber.effectTag = "DELETE";
      deletions.push(oldFiber);
    }

    if (oldFiber){
      oldFiber = oldFiber.sibling
    }

    if (index === 0) {
      wipFiber.firstChild = newFiber;
    } else if (child){
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++
  }
}

const updateValue = (e) => rerender(e.target.value);

const rerender = (value) => {
  const element = createElement(
    "div",
    {},
    createElement("input", { onInput: updateValue, value: value }),
    createElement("h2", {}, value)
  );
  render(element, container);
};

//testing

let greatGrandChild1 = createElement(
  "h4",
  { title: "greatgrandchild 1" },
  "i am greatgrandchild 1 ",
  "youngest of all"
);

let grandChild1 = createElement(
  "h3",
  { title: "grandchild 1" },
  "i am grandchild 1",
  greatGrandChild1
);

let grandChild2 = createElement(
  "h3",
  { title: "grandchild 2" },
  "i am grandchild 2"
);

let testChild1 = createElement(
  "h2",
  { title: "child 1" },
  "i am child 1",
  grandChild1,
  grandChild2
);

let testChild2 = createElement(
  "h2",
  { title: "child 2" },
  "I am child 2",
  " last of my line"
);

let testParent = createElement(
  "h1",
  { title: "parent" },
  "test parent",
  testChild1,
  testChild2
);

/** @jsx createElement */
const testParent2 = (
  <h1 title="test parent"> test parent {testChild1}{testChild2}</h1>
)

console.log("test parent to element is: ", testParent2)

let container = document.getElementById("root");

// render(testParent2, container);
rerender("world")
