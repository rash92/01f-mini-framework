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


make a server to be run from package.json with npm instead of live server?

add event handling. not allowed to use addeventlistener, use things like 'onclick', 'ondblclick', 'onkeydown', 'onmouseover'
-currently has these but can only have one listener per element, may want to make elements able to have more than one and remove specific ones, instead of just setting listeners of a type to null.
- add a record of existing listeners to each dom element for each type of event, and then check if the event listener already exists before adding/ removing.

make tests using jest

redo with typescript



make todoMVC app

make a useEffects hook? useRef? useMemo? useCallback?

look at optional extensions in epilogue

spec for todoMVC:
https://github.com/tastejs/todomvc/blob/master/app-spec.md