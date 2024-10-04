"use strict";

function _toConsumableArray(r) { return _arrayWithoutHoles(r) || _iterableToArray(r) || _unsupportedIterableToArray(r) || _nonIterableSpread(); }
function _nonIterableSpread() { throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _iterableToArray(r) { if ("undefined" != typeof Symbol && null != r[Symbol.iterator] || null != r["@@iterator"]) return Array.from(r); }
function _arrayWithoutHoles(r) { if (Array.isArray(r)) return _arrayLikeToArray(r); }
function _slicedToArray(r, e) { return _arrayWithHoles(r) || _iterableToArrayLimit(r, e) || _unsupportedIterableToArray(r, e) || _nonIterableRest(); }
function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }
function _unsupportedIterableToArray(r, a) { if (r) { if ("string" == typeof r) return _arrayLikeToArray(r, a); var t = {}.toString.call(r).slice(8, -1); return "Object" === t && r.constructor && (t = r.constructor.name), "Map" === t || "Set" === t ? Array.from(r) : "Arguments" === t || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(t) ? _arrayLikeToArray(r, a) : void 0; } }
function _arrayLikeToArray(r, a) { (null == a || a > r.length) && (a = r.length); for (var e = 0, n = Array(a); e < a; e++) n[e] = r[e]; return n; }
function _iterableToArrayLimit(r, l) { var t = null == r ? null : "undefined" != typeof Symbol && r[Symbol.iterator] || r["@@iterator"]; if (null != t) { var e, n, i, u, a = [], f = !0, o = !1; try { if (i = (t = t.call(r)).next, 0 === l) { if (Object(t) !== t) return; f = !1; } else for (; !(f = (e = i.call(t)).done) && (a.push(e.value), a.length !== l); f = !0); } catch (r) { o = !0, n = r; } finally { try { if (!f && null != t["return"] && (u = t["return"](), Object(u) !== u)) return; } finally { if (o) throw n; } } return a; } }
function _arrayWithHoles(r) { if (Array.isArray(r)) return r; }
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
  dom.customAddEventListener = function (type, callback) {
    switch (type) {
      case "click":
        // dom.addEventListener("click", callback)
        dom.onclick = callback;
        break;
      case "dblclick":
        dom.ondblclick = callback;
        break;
      case "keydown":
        dom.onkeydown = callback;
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
  dom.customRemoveEventListener = function (type, callback) {
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
      case "mouseover":
        dom.onmouseover = null;
        break;
      case "input":
        dom.oninput = null;
        break;
      default:
        console.log("can't remove event from listener: unknown event type to remove");
        break;
    }
  };
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
  // console.log("attempting to update dom: ", dom, "with prevProps: ", prevProps, "and nextProps: ", nextProps)
  if (!nextProps) {
    console.log("unable to update dom, nextProps passed in is: ", nextProps);
    return;
  }
  Object.keys(prevProps).filter(isEvent).filter(function (key) {
    return !(key in nextProps) || isNew(prevProps, nextProps)(key);
  }).forEach(function (name) {
    return dom.customRemoveEventListener(getEventType(name), prevProps[name]);
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
    return dom.customAddEventListener(getEventType(name), nextProps[name]);
  });
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
  var domParentFiber = fiber.parent;
  while (!domParentFiber.dom) {
    domParentFiber = domParentFiber.parent;
  }
  var domParent = domParentFiber.dom;
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
      children: [element]
    },
    alternate: currentRoot
  };
  deletions = [];
  nextUnitOfWork = wipRoot;
}
var nextUnitOfWork = null;
var wipRoot = null;
var currentRoot = null;
var deletions = null;
function workLoop(deadline) {
  var done = false;
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
var wipFiber = null;
var hookIndex = null;
function updateFunctionComponent(fiber) {
  wipFiber = fiber;
  hookIndex = 0;
  wipFiber.hooks = [];
  var children = [fiber.type(fiber.props)];
  reconcileChildren(fiber, children.flat());
}
function updateHostComponent(fiber) {
  if (!fiber.dom) {
    fiber.dom = createDom(fiber);
  }
  if (!fiber.props) {
    console.log("fiber.props missing, fiber is: ", fiber);
  }
  var children = fiber.props.children;
  reconcileChildren(fiber, children.flat());
}

//takes in a fiber to perform tasks on, then returns next fiber to work on next.
//order is child, if no children sibling, if no siblings 'uncle'.
function performUnitOfWork(fiber) {
  if (!fiber || !fiber.type) {
    console.log("issue performing unit of work for fiber: ", fiber);
  }
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
function useState(initial) {
  //check if previous hook exists, if it does save in oldhook otherwise return false
  //wipFiber and hookIndex are now globals
  var oldHook = wipFiber.alternate && wipFiber.alternate.hooks && wipFiber.alternate.hooks[hookIndex];
  //if hook already exists then get it and put it in hook.state, otherwise initialize
  var hook = {
    state: oldHook ? oldHook.state : initial,
    queue: []
  };
  var actions = oldHook ? oldHook.queue : [];
  actions.forEach(function (action) {
    hook.state = action(hook.state);
  });
  var setState = function setState(action) {
    hook.queue.push(action);
    wipRoot = {
      dom: currentRoot.dom,
      props: currentRoot.props,
      alternate: currentRoot
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

// /** @jsx createElement */
// function Counter(props) {
//   const [state, setState] = useState(1);
//   const [state2, setState2] = useState(1);
//   const [state3, setState3] = useState("");
//   return (
//     <h1 style="user-select: none">
//       <h2 onClick={() => setState((c) => c + 1)}>Count: {state}</h2>
//       <h3
//         onDblclick={() => {
//           console.log("ondblclick activated");
//           return setState2((c) => c + 2);
//         }}
//       >
//         Count2: {state2}
//       </h3>
//       <h4 onKeyDown={(e) => setState3((c) => c + e)}>keypresses: {state3}</h4>
//     </h1>
//   );
// }

// const funcElement = <Counter />;

/** @jsx createElement */
function App(_ref) {
  var children = _ref.children;
  var _useState = useState([]),
    _useState2 = _slicedToArray(_useState, 2),
    taskList = _useState2[0],
    setTasklist = _useState2[1];
  // const [completedCount, setCompletedCount] = useState(0);
  var completedCount = taskList.filter(function (task) {
    return !task.completed;
  }).length;

  // console.log("calculated completed count: ", completedCount)
  var onToggleComplete = function onToggleComplete(id) {
    console.log("trying to increase completed count due to message from id: ", id);
    setTasklist(function (taskList) {
      return taskList.map(function (task, index) {
        return task.id === id ? _objectSpread(_objectSpread({}, task), {}, {
          completed: !task.completed
        }) : task;
      });
    });
  };
  var clearCompleted = function clearCompleted() {
    console.log("trying to clear all completed tasks");
  };
  var deleteTask = function deleteTask(id) {
    console.log("tried to delete task with id: ", id);
    console.log("task to be deleted: ", taskList.filter(function (task) {
      return task.id === id;
    }));
    console.log("other tasks not to be deleted: ", taskList.filter(function (task) {
      return task.id !== id;
    }));
    var newArr = taskList.filter(function (task) {
      return task.id !== id;
    });
    setTasklist(function (taskList) {
      return newArr;
    });
  };

  //redo to handle counting total completed with callback function passed in?
  var handleEnter = function handleEnter(e) {
    if (e.key === "Enter") {
      var newTask = {
        task: e.target.value,
        id: crypto.randomUUID(),
        completed: false
      };
      setTasklist(function (oldArr) {
        return [].concat(_toConsumableArray(oldArr), [newTask]);
      });
      e.target.value = "";
    }
  };
  return [createElement("section", {
    id: "root",
    className: "todoapp"
  }, createElement(InputHeader, {
    onEnter: handleEnter
  }), createElement(ToDoList, {
    taskList: taskList,
    onDelete: deleteTask,
    onToggleComplete: onToggleComplete
  }), createElement(ToDoListFooter, {
    onClear: clearCompleted,
    completedCount: completedCount
  })), infoFooter];
}

/** @jsx createElement */
function TodoItem(_ref2) {
  var children = _ref2.children,
    id = _ref2.id,
    onToggleComplete = _ref2.onToggleComplete,
    onDelete = _ref2.onDelete;
  // const [complete, setComplete] = useState(false);
  return createElement("li", null, createElement("div", null, createElement("input", {
    className: "toggle",
    type: "checkbox",
    onClick: function onClick() {
      onToggleComplete(id);
    }
  }), createElement("label", null, "To do item id: ", id, ": ", children, ", "), createElement("button", {
    className: "destroy",
    onClick: function onClick() {
      return onDelete(id);
    }
  })));
}
function InputHeader(_ref3) {
  var onEnter = _ref3.onEnter;
  return createElement("header", {
    className: "header"
  }, createElement("h1", null, "todos"), createElement("div", {
    className: "input-container"
  }, createElement("input", {
    id: "todo-input",
    className: "new-todo",
    type: "text",
    placeholder: "What needs to be done?",
    value: "",
    onKeyDown: onEnter,
    autofocus: true
  })));
}
function ToDoList(_ref4) {
  var taskList = _ref4.taskList,
    onDelete = _ref4.onDelete,
    onToggleComplete = _ref4.onToggleComplete;
  return createElement("main", {
    className: "main"
  }, createElement("ul", {
    className: "todo-list"
  }, taskList.map(function (item, index) {
    return createElement(TodoItem, {
      completed: item.completed,
      id: item.id,
      onToggleComplete: onToggleComplete,
      onDelete: onDelete
    }, item.task);
  })));
}
function ToDoListFooter(_ref5) {
  var onClear = _ref5.onClear,
    completedCount = _ref5.completedCount;
  return createElement("footer", {
    className: "footer"
  }, createElement("span", {
    className: "todo-count"
  }, completedCount, " items left"), createElement("ul", {
    className: "filters"
  }, createElement("li", null, createElement("a", null, "all")), createElement("li", null, createElement("a", null, "active")), createElement("li", null, createElement("a", null, "completed"))), createElement("button", {
    className: "clear-completed",
    onClick: onClear
  }, "Clear Completed"));
}
var todoitem = createElement(TodoItem, null, "todo item in variable");
var app = createElement(App, null);
var infoFooter = createElement("footer", {
  className: "info"
}, createElement("p", null, "Double-click to edit a todo"), createElement("p", null, "Created by the TodoMVC Team"), createElement("p", null, "Part of ", createElement("a", {
  href: "http://todomvc.com"
}, "TodoMVC")));
var container = document.body;
render(app, container);