let wipFiber = null;
let hookIndex = null;
let nextUnitOfWork = null;
let wipRoot = null;
let currentRoot = null;
let deletions = null;

// callback functions for use in e.g. .filter
const isEvent = (key) => key.startsWith("on");
const isProp = (key) => key !== "children" && !isEvent(key);
const isNew = (prev, next) => (key) => prev[key] !== next[key];
const isGone = (next) => (key) => !(key in next);
const getEventType = (name) => name.toLowerCase().substring(2);

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
    switch (type) {
      case "click":
        dom.onclick = callback;
        break;
      case "dblclick":
        dom.ondblclick = callback;
        break;
      case "keydown":
        dom.onkeydown = callback;
        break;
      case "blur":
        dom.onblur = callback;
        break;
      case "mouseover":
        dom.onmouseover = callback;
        break;
      case "input":
        dom.oninput = callback;
        break;
      default:
        console.log("can't add event to listner: unknown event type");
        break;
    }
  };
  dom.customRemoveEventListener = (type, callback) => {
    switch (type) {
      case "click":
        dom.onclick = null;
        break;
      case "dblclick":
        dom.ondblclick = null;
        break;
      case "keydown":
        dom.onkeydown = null;
        break;
      case "blur":
        dom.onblur = null;
        break;
      case "mouseover":
        dom.onmouseover = null;
        break;
      case "input":
        dom.oninput = null;
        break;
      default:
        console.log(
          "can't remove event from listener: unknown event type to remove"
        );
        break;
    }
  };

  updateDom(dom, {}, fiber.props);

  return dom;
}

function updateDom(dom, prevProps, nextProps) {
  //remove old or changed event listeners
  if (!nextProps) {
    console.log("unable to update dom, nextProps passed in is: ", nextProps);
    return;
  }
  Object.keys(prevProps)
    .filter(isEvent)
    .filter((key) => !(key in nextProps) || isNew(prevProps, nextProps)(key))
    .forEach((name) =>
      dom.customRemoveEventListener(getEventType(name), prevProps[name])
    );

  //remove old props
  Object.keys(prevProps)
    .filter(isProp)
    .filter(isGone(nextProps))
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
      dom.customAddEventListener(getEventType(name), nextProps[name])
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
    commitDeletion(fiber.firstChild, domParent);
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
    //this return bit is not in tutorial but suggested something like this in one of the pull requests and seems to fix weird deleting issues?
    return;
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



function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  const children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children.flat());
}

function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (!fiber.props) {
    console.log("fiber.props missing, fiber is: ", fiber);
  }
  const children = fiber.props.children;
  reconcileChildren(fiber, children.flat());
}



function reconcileChildren(wipFiber, children) {
  let prevSibling = null;
  let index = 0;
  //will return first part if it's falsy, or will return value of second part
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

function routeHandler(routes) {
  let path = window.location.hash.slice(2);
  let pathFound = false;
  for (let route in routes) {
    if (path === route) {
      routes[route]();
      pathFound = true;
    }
  }
  if (!pathFound) {
    console.log("route not found");
  }
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

export const minireact = {
  createElement,
  render,
  useState,
  routeHandler,
};