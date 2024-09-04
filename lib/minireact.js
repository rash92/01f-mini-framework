"use strict";

function _typeof(o) { "@babel/helpers - typeof"; return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (o) { return typeof o; } : function (o) { return o && "function" == typeof Symbol && o.constructor === Symbol && o !== Symbol.prototype ? "symbol" : typeof o; }, _typeof(o); }
function ownKeys(e, r) { var t = Object.keys(e); if (Object.getOwnPropertySymbols) { var o = Object.getOwnPropertySymbols(e); r && (o = o.filter(function (r) { return Object.getOwnPropertyDescriptor(e, r).enumerable; })), t.push.apply(t, o); } return t; }
function _objectSpread(e) { for (var r = 1; r < arguments.length; r++) { var t = null != arguments[r] ? arguments[r] : {}; r % 2 ? ownKeys(Object(t), !0).forEach(function (r) { _defineProperty(e, r, t[r]); }) : Object.getOwnPropertyDescriptors ? Object.defineProperties(e, Object.getOwnPropertyDescriptors(t)) : ownKeys(Object(t)).forEach(function (r) { Object.defineProperty(e, r, Object.getOwnPropertyDescriptor(t, r)); }); } return e; }
function _defineProperty(e, r, t) { return (r = _toPropertyKey(r)) in e ? Object.defineProperty(e, r, { value: t, enumerable: !0, configurable: !0, writable: !0 }) : e[r] = t, e; }
function _toPropertyKey(t) { var i = _toPrimitive(t, "string"); return "symbol" == _typeof(i) ? i : i + ""; }
function _toPrimitive(t, r) { if ("object" != _typeof(t) || !t) return t; var e = t[Symbol.toPrimitive]; if (void 0 !== e) { var i = e.call(t, r || "default"); if ("object" != _typeof(i)) return i; throw new TypeError("@@toPrimitive must return a primitive value."); } return ("string" === r ? String : Number)(t); }
function createElement(type, props) {
  for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
    children[_key - 2] = arguments[_key];
  }
  return {
    type: type,
    props: _objectSpread(_objectSpread({}, props), {}, {
      children: children.map(function (child) {
        return _typeof(child) === "object" ? child : createTextElement(child);
      })
    })
  };
}
function createTextElement(text) {
  return {
    type: "TEXT_ELEMENT",
    props: {
      nodeValue: text,
      children: []
    }
  };
}
function createDom(fiber) {
  var dom = fiber.type == "TEXT_ELEMENT" ? document.createTextNode("") : document.createElement(fiber.type);
  updateDom(dom, {}, fiber.props);
  return dom;
}
var isEvent = function isEvent(key) {
  return key.startsWith("on");
};
var isProp = function isProp(key) {
  return key !== "children" && !isEvent(key);
};
var isNew = function isNew(prev, next) {
  return function (key) {
    return prev[key] !== next[key];
  };
};
var isGone = function isGone(prev, next) {
  return function (key) {
    return !(key in next);
  };
};
var getEventType = function getEventType(name) {
  return name.toLowerCase().substring(2);
};

//rewrite?
function updateDom(dom, prevProps, nextProps) {
  //unsure if order of these matters? doing same order as guide
  //remove old or changed event listeners
  Object.keys(prevProps).filter(isEvent).filter(function (key) {
    return !(key in nextProps) || isNew(prevProps, nextProps)(key);
  }).forEach(function (name) {
    return dom.removeEventListener(getEventType(name), prevProps[name]);
  });

  //remove old props
  Object.keys(prevProps).filter(isProp).filter(isGone(prevProps, nextProps)).forEach(function (name) {
    dom[name] = "";
  });

  //add new or changed props
  Object.keys(nextProps).filter(isProp).filter(isNew(prevProps, nextProps)).forEach(function (name) {
    dom[name] = nextProps[name];
  });
  //add new event listeners
  Object.keys(nextProps).filter(isEvent).filter(isNew(prevProps, nextProps)).forEach(function (name) {
    return dom.addEventListener(getEventType(name), nextProps[name]);
  });
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
  var domParent = fiber.parent.dom;
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
      children: [element]
    },
    alternate: currentRoot
  };
  deletions = [];
  nextTask = wipRoot;
}
var nextTask = null;
var wipRoot = null;
var currentRoot = null;
var deletions = null;
function workLoop(deadline) {
  var done = false;
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
  var children = fiber.props.children;
  reconcileChildren(fiber, children);
  //go through children to assign as first child vs sibling of previous child

  //return next in line for tasks, child exist is easy case.
  //If not look for siblings, uncles, great uncles etc.
  if (fiber.firstChild) {
    return fiber.firstChild;
  }
  var nextFiber = fiber;
  while (nextFiber) {
    if (nextFiber.sibling) {
      return nextFiber.sibling;
    }
    nextFiber = nextFiber.parent;
  }
}
function reconcileChildren(wipFiber, children) {
  var prevSibling = null;
  var index = 0;
  //javascript && weirdness, will return first part if it's falsy, or will return value of second part
  //i.e. will be null if either are null, otherwise second value
  var oldFiber = wipFiber.alternate && wipFiber.alternate.firstChild;
  while (index < children.length || oldFiber != null) {
    var child = children[index];
    var newFiber = null;
    var sameType = oldFiber && child && child.type == oldFiber.type;

    //keep existing node but replace props
    if (sameType) {
      newFiber = {
        type: oldFiber.type,
        props: child.props,
        dom: oldFiber.dom,
        parent: wipFiber,
        alternate: oldFiber,
        effectTag: "UPDATE"
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
        effectTag: "APPEND"
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
var updateValue = function updateValue(e) {
  return rerender(e.target.value);
};
var rerender = function rerender(value) {
  var element = createElement("div", {}, createElement("input", {
    onInput: updateValue,
    value: value
  }), createElement("h2", {}, value));
  render(element, container);
};

//testing

var greatGrandChild1 = createElement("h4", {
  title: "greatgrandchild 1"
}, "i am greatgrandchild 1 ", "youngest of all");
var grandChild1 = createElement("h3", {
  title: "grandchild 1"
}, "i am grandchild 1", greatGrandChild1);
var grandChild2 = createElement("h3", {
  title: "grandchild 2"
}, "i am grandchild 2");
var testChild1 = createElement("h2", {
  title: "child 1"
}, "i am child 1", grandChild1, grandChild2);
var testChild2 = createElement("h2", {
  title: "child 2"
}, "I am child 2", " last of my line");
var testParent = createElement("h1", {
  title: "parent"
}, "test parent", testChild1, testChild2);

/** @jsx createElement */
var testParent2 = createElement("h1", {
  title: "test parent"
}, " test parent ", testChild1, testChild2);
console.log("test parent to element is: ", testParent2);
var container = document.getElementById("root");

// render(testParent2, container);
rerender("world");