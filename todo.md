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

- select all button showing up in weird places, correct place on completed but not all or active?!?!
- separate out components into their own folder and import them into app.js
- write readme
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