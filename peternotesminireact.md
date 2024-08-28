# Following along with Rodrigo Pombo's article about how to "create your own React from scratch".

[Build your own React](https://pomb.us/build-your-own-react/)

## Setup

Install [Babel](https://babeljs.io/setup#installation).

`npm install --save-dev @babel/core @babel/cli`
`npm install --save-dev @babel/preset-react`

Check that `package.json` has something like this:

```
{
  "devDependencies": {
    "@babel/cli": "^7.24.7",
    "@babel/core": "^7.24.7",
    "@babel/preset-env": "^7.24.7",
    "@babel/preset-react": "^7.24.7",
    "jest": "^29.7.0"
  },
  "scripts": {
    "test": "jest",
    "build": "babel src.js -d lib"
  }
}
```

And make a `babel.config.json` with the following:

```
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

Write a component in `src.js` and ask for it to be passed to `render` along with the root node where you want to mount it, then `npm run build`. In our example, we've substituted `didact.js` in place of `src.js`. Your `index.html` should contain a `div` with `id="root"` and a script with `src="lib/src.js"` (in our case, `src="lib/didact.js"`).

## Description

Step I: The createElement Function
Step II: The render Function
Step III: Concurrent Mode
Step IV: Fibers
Step V: Render and Commit Phases
Step VI: Reconciliation
Step VII: Function Components
Step VIII: Hooks

- Handy for getting an overview are Cmd+K Cmd+0 to fold all. (To unfold all: Cmd+K Cmd+J.)

- If you want to experiment by changing the code, remember to enter `npm run build` to transpile the new version before testing, otherwise the page will just load the previously transpiled version.

First `workLoop` is passed to rIC to be called recursively via rIC. At first it doesn't do anything because there is no `nextUnitOfWork`. Then a fiber tree is implicitly defined by `const element = <Counter />;`, where `Counter` is a function. This `element` is passed to `render`, along with the root DOM node `container`.

What exactly does the JSX evaluate to? Answer: it calls `Didact.createElement` recursively.

`render` defines a `wipRoot` as a fiber with `wipRoot.dom` set equal to `container` and `element` as its only child. It also sets `nextUnitOfWork` equal to `wipRoot`, and makes deletions an empty array.

Now `workLoop` has a `nextUnitOfWork` to process and passes it to `performUnitOfWork`, followed by each new `nextUnitOfWork` that `performUnitOfWork` returns, till it's gone through the whole fiber tree, calling the appropriate update function according to whether the next unit is a component fiber or a host fiber. By host fiber, I mean either an element fiber or a text fiber. (These update functions are named `updateFunctionComponent` and `updateHostComponet` respectively.)

`updateHostComponent` checks if the fiber has a `fiber.dom`. If not it passes the fiber to `createDom`. `createDom` creates a DOM element or text element as the case may be, and passes it to `updateDom` along with an empty object and `fiber.props`. Then, in any case, `updateHostComponent` passes the fiber and its children to `reconcileChildren`.

As mentioned, `updateDom` receives a DOM element or text element, an empty object (in the slot representing previous props), and `fiber.props` (in the slot representing next props) from `updateHostComponent`.

In general, `updateDom` does the following:

- Remove old or changed event listeners
- Remove old properties
- Set new or changed properties
- Add event listeners

`updateFunctionComponent` sets the global variable `wipFiber` to the current fiber, `hookIndex` to 0 and `wipFiber.hooks` to an empty array. It then calls the component with the given props, supplied by its fiber. The return value, `children`, is passed as 2nd argument to `reconcileChildren` with the fiber itself as the 1st.

`reconcileChildren` does the diffing. It's a relatively long function that takes a fiber, `wipFiber`, and an array of fibers, `elements`, representing the new fibers that are to be its children. It compares each of these new fibers to the corresponding old fiber (its alternate), if any, and marks the old fiber for deletion if their types differ and pushes it to the `deletions` array. The new fiber is marked for update if there is an old fiber and their types are the same, and placement if not. In this way it diffs all the children.

When `workLoop` has gone through the whole fiber tree, calling `performUnitOfWork` on each fiber, it reaches the `wipRoot` again and calls `commitRoot` (with no arguments).

`commitRoot` calls `commitWork` on all the fibers in the `deletions` array, then on `wipRoot.child`, then sets `currentRoot` to `wipRoot`, and `wipRoot` to `null`.

`commitWork` returns immediately if the fiber passed to it is `null`. It then finds the nearest host fiber ancestor of the current fiber and defines `domParent` as the DOM element corresponding to this ancestor. If there's a `fiber.dom` and the fiber is marked for placement, it appends `fiber.dom` as a child of `domParent`. If there's a `fiber.dom` and the fiber is marked for update, `updateDom` is called with `fiber.dom`, `fiber.alternate.props`, and `fiber.props`. In any case, if the fiber is marked for deletion, it's passed with `domParent` to `commitDeletion`. Finally, `commitWork` is called with the fiber's child and then its sibling.

`useState` is called by a component fiber and relies on two global variables, `wipFiber` and `hookIndex` being set in `updateFunctionComponent` (i.e. "update component fiber") before the component is run. This roundabout way of refering to fiber is necessary because `fiber` needs to be refered to in `useState`, which is called by `fiber.type`, which is called by `updateFunctionComponent`, and only the last-named of these functions has access to `fiber`.

`wipFiber` is set to the current fiber, `wipFiber.hooks` to an empty array, and `hookIndex` to 0. Then `useState(initial)` defines `oldHook` as `wipFiber.alternate.hooks[hookIndex]` if the latter exists, and an object `hook` whose state is `oldHook` if there is one, and `initial` if not. `hook.queue` is set to an empty array. If there are any actions in `oldHook.queue`, they're called in order and used to update `hook.state` thus: `hook.state = action(hook.state)`. This `hook` is pushed to `wipFiber.hooks` and the `hookIndex` incremented, allowing for multiple state variables to be registered with multiple calls to `useState`. `[hook.state, setState]` is returned, but not before `setState` has been defined.

`setState` takes one argument, a function called `action`, which it pushes to `hook.queue`. It then triggers a fresh update by resetting the `wipRoot`, analogously to how this is done in `render`:

```JavaScript
wipRoot = {
  dom: currentRoot.dom,
  props: currentRoot.props,
  alternate: currentRoot,
  };
nextUnitOfWork = wipRoot;
```

`setState` could be called from an event handler at any time, and will trigger a fresh update, even if it interrupts an update currently in progress. This is safe because nothing is committed to the DOM till the end of the update process (and the roots of the old and new fiber trees are only swapped in `commitRoot`). It has closure on `hook` and hence is associated with a particular instance of `useState` and hence a particular state variable, `hook`, and the particular fiber where it was defined, via `wipFiber.alternate.hooks[hookIndex]` in the definition of `oldHook`.

## An alternative description of `useState` that I wrote to remind myself get it clearer in my head

`useState` is called by `fiber.type` in `updateFunctionComponent`. `fiber.type` is the function component itself. `useState` plays several roles: it initializes the state variable if it doesn't already exist (i.e. if the component is being rendered for the first time), it updates the state variable if it does exist, and it schedules a re-render if the state variable has been updated.

The word `hook` here refers to the state variable. Each fiber has an array of hooks, one for each instance of `useState` in the component. Each call to `useState` increments `hookIndex`, which is used to access the correct hook in the array. A hook consists of a state and a queue of actions scheduled since the last render. Each action is a function that takes the current state as an argument and returns the new state. The `actions` array is now iterated over in `useState`, and each action is called with the current state, which is then updated to the new state.

The `setState` function, defined for this particular hook, is a closure that has access to the hook and the fiber. When called (by an event handler), it pushes the action to the queue, creates a new wipRoot, and schedules a new re-render, which will be performed on the next idle frame.

If an event handler calls `setState` more than once, this will only schedule one render, which will start on the next idle frame. Similarly if `setState` is called from more than one event handler in quick succession: between completion of a render and the next idle frame. But if a render is in progress when `setState` is called, it will cause that render to be abandonned and a new one started on the next idle frame. The logic works because the actions associated with the hook from the previous fiber, together with any that have been scheduled since the aborted render, are still in memory and will be used on the fresh render.

## Comments

`requestIdleCallback` is not compatible with Safari. What would be a good fallback for `requestIdleCallback` in this case?

I wonder if, after the initial render, updates could be restricted to subtrees. They could start with the fiber where the update-triggering event happened or, if an update is already in progress, the nearest common ancestor of the initiating fibers.

My central event handler could be incorporated. (Event delegation.)

Signals could be added as an alternative means of state management for global state variables.

How could this be combined with `requestAnimationFrame` for the game? (Esteban says they only used Didact to create the element, just one initial render, then they switched to `requestAnimationFrame` for the actual game.)

Rodrigo suggests some ways React improves on all this:

- In Didact, we are walking the whole tree during the render phase. React instead follows some hints and heuristics to skip entire sub-trees where nothing changed.
- We are also walking the whole tree in the commit phase. React keeps a linked list with just the fibers that have effects and only visit those fibers.
- Every time we build a new work in progress tree, we create new objects for each fiber. React recycles the fibers from the previous trees.
- When Didact receives a new update during the render phase, it throws away the work in progress tree and starts again from the root. React tags each update with an expiration timestamp and uses it to decide which update has a higher priority.
- And many more…

He lists "a few features that you can add easily":

- use an object for the style prop
- flatten children arrays
- useEffect hook
- reconciliation by key
