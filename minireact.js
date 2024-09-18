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

  dom.customAddEventListener = (type, callback) => {
    console.log("custom listener added with type: ", type, "callback: ", callback, "for dom element: ", dom)
    switch (type) {
      case "click":
        // dom.addEventListener("click", callback)
        dom.onclick = callback
        break;
      case "dblclick":
        dom.ondblclick = callback
        break;
      case "keydown":
        dom.onkeydown = callback
        break;
      case "mouseover":
        dom.onmouseover = callback
        break;
      default:
        console.log("can't add event to listner: unknown event type")
        break;
    }
  };
  dom.customRemoveEventListener = (type, callback) => {
    switch (type) {
      case "click":
        dom.onclick = null
        break;
      case "dblclick":
        dom.ondblclick = null
        break;
      case "keydown":
        dom.onkeydown = null
        break;
      case "mouseover":
        dom.onmouseover = null
        break;
      default:
        console.log("can't remove event from listener: unknown event type to remove")
        break;
    }
  };
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
      dom.customRemoveEventListener(
        getEventType(name), prevProps[name]
      )
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
      dom.customAddEventListener(
        getEventType(name), nextProps[name]
      )
    );
}

function commitRoot() {
  deletions.forEach(commitWork);
  commitWork(wipRoot.firstChild);
  currentRoot = wipRoot;
  wipRoot = null;
}

function commitDeletion(fiber, domParent) {
  //regular case where non functional component has a dom already
  if (fiber.dom) {
    domParent.removeChild(fiber.dom);
    //handle case with functional components, recursively look for children until find a fiber with a dom
  } else {
    commitDeletion(fiber.child, domParent);
  }
}

function commitWork(fiber) {
  if (!fiber) {
    return;
  }

  let domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }

  const domParent = domParentFiber.dom;

  if (fiber.effectTag === "APPEND" && fiber.dom != null) {
    domParent.appendChild(fiber.dom);
  } else if (fiber.effectTag === "UPDATE" && fiber.dom != null) {
    updateDom(fiber.dom, fiber.alternate.props, fiber.props);
  } else if (fiber.effectTag === "DELETE") {
    commitDeletion(fiber, domParent);
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
  nextUnitOfWork = wipRoot;
}

let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = null;

function workLoop(deadline) {
  let done = false;
  while (nextUnitOfWork && !done) {
    nextUnitOfWork = performUnitOfWork(nextUnitOfWork);
    done = deadline.timeRemaining() < 1;
  }
  //commit when task queue is empty
  if (!nextUnitOfWork && wipRoot) {
    commitRoot();
  }
  requestIdleCallback(workLoop);
}

requestIdleCallback(workLoop);

let wipFiber = null;
let hookIndex = null;

function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children);
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }

  const children = fiber.props.children;
  reconcileChildren(fiber, children);
}

//takes in a fiber to perform tasks on, then returns next fiber to work on next.
//order is child, if no children sibling, if no siblings 'uncle'.
function performUnitOfWork(fiber) {
  if (fiber.type instanceof Function) {
    updateFunctionComponent(fiber);
  } else {
    updateHostComponent(fiber);
  }

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
  let index = 0;
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

    if (oldFiber) {
      oldFiber = oldFiber.sibling;
    }

    if (index === 0) {
      wipFiber.firstChild = newFiber;
    } else if (child) {
      prevSibling.sibling = newFiber;
    }

    prevSibling = newFiber;
    index++;
  }
}

function useState(initial) {
  //check if previous hook exists, if it does save in oldhook otherwise return false
  //wipFiber and hookIndex are now globals
  const oldHook =
    wipFiber.alternate &&
    wipFiber.alternate.hooks &&
    wipFiber.alternate.hooks[hookIndex];
  //if hook already exists then get it and put it in hook.state, otherwise initialize
  const hook = {
    state: oldHook ? oldHook.state : initial,
    queue: [],
  };

  const actions = oldHook ? oldHook.queue : [];
  actions.forEach((action) => {
    hook.state = action(hook.state);
  });

  const setState = (action) => {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot,
    };
    nextUnitOfWork = wipRoot;
    deletions = [];
  };

  wipFiber.hooks.push(hook);
  hookIndex++;
  return [hook.state, setState];
}

//event listener sections, not in tutorial

//replace addEventListener and removeEventListener with custom versions that directly use
// onclick, ondblclick, onkeydown and any other relevant events.

//testing

/** @jsx createElement */
function App(props) {
  return <h1>Hi {props.name}</h1>;
}

/** @jsx createElement */
function Counter(props) {
  const [state, setState] = useState(1);
  const [state2, setState2] = useState(1);
  const [state3, setState3] = useState("")
  return (
    <h1 style="user-select: none">
      <h2 onClick={() => setState((c) => c + 1)}>Count: {state}</h2>
      <h3
        onDblclick={() => {
          console.log("ondblclick activated");
          return setState2((c) => c + 2);
        }}
      >
        Count2: {state2}
      </h3>
      <h4 onKeyDown={(e) => setState3(c=> c+e)}>
        keypresses: {state3}
      </h4>
    </h1>
  );
}

const funcElement = <Counter />;

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
  <h1 title="test parent">
    {" "}
    test parent {testChild1}
    {testChild2}
  </h1>
);

console.log("test parent to element is: ", testParent2);

let container = document.getElementById("root");

render(funcElement, container);
// rerender("world")
