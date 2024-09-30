Code examples and explanations on how to:
    Create an element
    Create an event
    Nest elements
    Add attributes to an element
Explanation on why things work the way they work

guide: https://pomb.us/build-your-own-react/

To run after changes:
    - update minireact.js
    - do 'npm run build'
    - run live server
    
TODO:

features:
- removing and checking done todolist items
- select all button
- all, active, completed, clear completed buttons
- sanitizing inputs, currently directly checking key pressed e.g. pressing shift will input 'Shift'
- check actual spec (below) for anything else

- currently has single event listerner per type per element, may want to make elements able to have more than one and remove specific ones, instead of just setting listeners of a type to null.
- add a record of existing listeners to each dom element for each type of event, and then check if the event listener already exists before adding/ removing.
- implement capturing and bubbling events?

Make frontend:
 - should have enough in framework to do this
 - new file with imports and then create elements with jsx style

redo with typescript?

 - make tests using jest
 - more organized, different files?
 - minireact should be compartmentalized so should be able to slot in redone with typescript one

Make actual readme file

make todoMVC app

make a useEffects hook? useRef? useMemo? useCallback?

look at optional extensions in epilogue

make a server to be run from package.json with npm instead of live server?

links:
docs for addEventListener:
https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

spec for todoMVC:
https://github.com/tastejs/todomvc/blob/master/app-spec.md