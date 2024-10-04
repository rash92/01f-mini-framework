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

main:
- removing and checking done todolist items - counting works, deleting doesn't want to delete first item it seems?
- select all button
- all, active, completed, clear completed buttons
- check codes rather than values for keys (i.e. don't check ==='Enter' etc.)?
- hide main and footer when no todos available
- hide 'clear completed' while none are completed
- redo file structure, separate out framework from app
- write readme
- pass callback functions down to children so pass state back and forth e.g. to count how many are completed. currently if directly in returned child (in the clear completed button in footer as a test) it works but not in the todoilst items that are added.
- check actual spec (below) for anything else

stretch:
- currently has single event listerner per type per element, may want to make elements able to have more than one and remove specific ones, instead of just setting listeners of a type to null.
- add a record of existing listeners to each dom element for each type of event, and then check if the event listener already exists before adding/ removing.
- implement capturing and bubbling events?
- redo with typescript
- write tests

- make a server to be run from package.json with npm instead of live server?

links:
docs for addEventListener:
https://developer.mozilla.org/en-US/docs/Web/API/EventTarget/addEventListener

spec for todoMVC:
https://github.com/tastejs/todomvc/blob/master/app-spec.md