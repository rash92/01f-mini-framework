# README

[1. Backgound](#background)

[2. Features](#features)

[3. Usage](#usage)
- [Quickstart](#quickstart)
- [Prerequisites](#prerequisites)
- [Making other apps](#making-other-apps)
    - [Virtual Dom elements](#virtual-dom-elements)
    - [Components](#components)
    - [State management](#state-management)
    - [Routing](#routing)
    - [Event management](#event-management)
- [File structure](#file-structure)
- [Manual configuration](#manual-configuration)
    - [file structure](#file-structure)
    - [package.json](#package.json)
    - [webpack.config.cjs](#webpack.config.cjs)
    - [babel.config.json](#babel.config.json)

[4. How it works](#how-it-works)

[5. Limitations](#limitations)

[6. Acknowledgements](#acknowledgements)

# Background:

This was my version of the [mini framework](https://learn.01founders.co/git/root/public/src/branch/master/subjects/mini-framework) project while studying at [01Founders](https://01founders.co/). The idea was to create a framework and then use it to create a [TodoMVC](https://todomvc.com/), with a future project using the same framework to make a multiplayer browser game. I chose to reimplement the main basic features of react, hence 'minireact'.

# Features:
Overview of the features included in the framework which were used, see [How it works](#how-it-works) for more detailed explanations.

## Virtual dom
The virtual dom allows you to only rerender components that have actually changed, while keeping other elements the same. This is done by keeping track of changes made to state within a component, as well as props passed into a component by the parent component. Any changes to a parent causes children to be rerendered, but a child component may change without requiring sibling or cousin components to be rerendered.

## State management
Implemented the equivalent of reacts useState, which is state that a component has access to and a change in that state will cause it to rerender. Changes to state are done using a callback function that replaces what is stored in the state rather than mutating it, so as to make it noticeable when there has been a change and trigger a rerender.

## Event handling
Basic version of the built in addEventListener has been implemented as the built in method was not allowed to be used, which currently only has the events required for the todoMVC working, and only allows one event per type per dom element. In practice it is better to use the built in addEventListener.

## Routing
Routing for routes of the form `#/foo` for a given `foo` are implemented, where you can have links that change the hash route by adding `href=#/foo` and functions that detect that change and do something based on it. 

# Usage:

## Quick start
clone the repo, open in vscode and use live server from the root directory. This should run the existing todoMVC app made with the framework.

If you want to make your own app with the framework, delete/ replace components in the `src/components` directory and edit the app.js to create your app file and then then run

    npm run build

If there are issues getting this to work, look at the prerequisites section and for details of how to structure your app look at [Making other apps](#-making-other-apps).


## Prerequisites

The idea of the framework is that it should feel like using react, as such the intended way to use it is with jsx syntax and primarily functional components. Babel and webpack are required to be installed to transpile the jsx into javascript to run in the browser. While it is possible to use a custom server, for the purposes of this project I just used the live-server extension for VSCode.

If you clone this repository, the package json already has what is required so `npm install` or `npm run build` should get everything needed, but if there are any issues or if you want to use the framework by itself and set things up manually then install babel, webpack and babel loader using:

    npm install --save-dev babel-loader @babel-core @babel-cli @babel-preset-env @babel/preset-react webpack webpack-cli

Install the [live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VSCode extension, and then click on the icon on the bottom left while in the root folder. And look at [Manual configuration](#manual-configuration) for how to set up the config files.

## Making other apps

If you want to make your own app with the framework, you can copy over just the minireact.js file as that contains everything required, however there may be a lot of configuration required for this. Instead I would recomment just deleting any components in the `src/components` folder and editing the `src/app.js` file, then running `npm run build`. 

In app.js, and any component files, you need to have:

    import { minireact } from "./minireact/minireact.js";

    /** @jsx minireact.createElement */

at the beginning for babel to use minireacts createElement function rather than attempting and failing to use reacts (as react should not be installed)

At the end of the app.js file, you need to have:

    let container = document.body;
    const app = <App></App>
    minireact.render(app, container);

The app itself should be a function called App that returns jsx. 

You can have other components defined in the app function that are used in the return statement, or put them in the components folder and import them to be used in App.

### Virtual Dom elements
You can make virtual dom elements with the same syntax as regular html, and these can be saved as variables to be passed around. These will be converted by the babel transpiler into objects using the `minireact.createElement` function to be eventually rendered as html by the browser. E.g.

    const exampleDiv = <div>here is my example</div>

and this can then be used in future elements by wrapping in curly brackets `{}` if you want them to be interpreted as a variable
    const exampleChild1 = <li>item 1</li>
    const exampleChild2 = <li>item 2</li>
    const exampleParent = <ul>{exampleChild1}{exampleChild2}</ul>

which would be the equivalent of:

    <ul>
        <li>item 1</li>
        <li>item 2</li>
    </ul>

You can have html attr which are equivalent to props in the virtual dom, except for classes which need to be called className and will then be converted to class in the html due to a name conflict in javascript. You can use variables or other javascript code to be evaluated by enclosing it in `{}` e.g.

    const exampleDiv = <div className="test" id="2">I am a div with a class and an id</div>

and 

    const exampleClass = "test"
    const exampleId = "2"
    const exampleDiv = <div className={exampleClass} id={exampleId}>I am a div with a class and an id</div>

would both be equivalent to the html

    <div class="test id="2">I am a div with a class and an id</div>

under the hood these are just objects with a type, props (attributes) and children as fields:


### Components
Components allow you to create custom elements which can be made up of a lot of basic html elements, as well as doing calculations relevant to the component and keeping track of state to allow certain related blocks to rerender when necessary without having to rerender the whole page. components take in props and children which can be accessed from the inside. While the are class components that work, the inteded usage is with functional components, in which case you can think of props and children as just arguments for the function that may be used in the return statement, which may involve other components but which will ultimately be regular html.

For example, you could create a custom list component that takes in as a prop an array of children to be inserted into the list, where you can do some transformations on the items if you want, including making subcomponents out of them. E.g this defines a function that takes an array of numbers, squares them, puts them in a `<li>` element, and then inserts them into a list. 

    function SquareList({intArray}){

        let listItemComponents = intArray.map((item) => <li>{item * item}</li>)

        return (
            <ul>listItemComponents<ul>
        )
    }

and to use it:

    let listItems = [1,2,3,4,5]
    const squareListInstance = <SquareList intArray={listItems}></SquareList>

as you can see, once you've defined your component, it can be used with the same syntax as built in html elements! it's basically creating custom html elements.

You can also pass in children to these and access them within instead of passing in as props. The children are treated as just an extra prop, but are put between the tags instead of within the first tag with a named prop. This is equivalent to the above:

    function SquareList({children}){

        let listItemComponents = children.map((item) => <li>{item * item}</li>)

        return (
            <ul>listItemComponents<ul>
        )
    }

    let listItems = [1,2,3,4,5]
    const squareListInstance = <SquareList>{listItems}</SquareList>

you can also access the props within the definition by calling the props object, these are equivalent to the above two respectively:
    function SquareList(props){
        const intArray = props.intArray
        let listItemComponents = intArray.map((item) => <li>{item * item}</li>)

        return (
            <ul>listItemComponents<ul>
        )
    }

and 

    function SquareList(props){
        const children = props.children
        let listItemComponents = children.map((item) => <li>{item * item}</li>)

        return (
            <ul>listItemComponents<ul>
        )
    }


### State management
If you want to use state management, call `minireact.useState` the same way you would use `useState` from regular react. This means creating a state variable and a state updating function, using `minireact.useState`, where what is passed in is the initialised state given. It is of the form

    [foo, setFoo] = minireact.useState(0)

where above variable foo is initialised to `0`. When you want to update foo, you should use the `setFoo` callback function, which will take in another function that has the initial state as input and the new state as the return value. for example:

    setFoo(() => 5)

to replace the state in foo with `5` regardless of what was in it before, or e.g.

    setFoo((old)=> old + 5)

to add 5 to the old state, or

    setFoo((old)=>{
        console.log(old)
        return old * 2
    })

for an example where there are more than one line in the callback function and you want to do things besides return the new value.

### Routing

If you want to have behaviour based routes in the url, currently only routes of the form `#/foo` are implemented, to use this put

    window.onhashchange = () => minireact.routeHandler(routes);

and create a `routes` object where the keys are the routes you want and the values are functions to be run when the route is changed to that. In the todoMVC example I have implemented 3 routes (`#/all`, `#/completed` and `#active`) as well as the default route (represented with the empty string) as below.:

    const routes = {
    all: () => setRoute(() => "all"),
    completed: () => setRoute(() => "completed"),
    active: () => setRoute(() => "active"),
    "": () => setRoute(() => "all"),
    };

which changes the `route` state managed by `useState` and this is used for all logic that cares about the route, but you could use more complicated callback functions instead. 

### Event management
As I was not allowed to use the built in `addEventListener` I made my own custom event listener that currently only has a few basic events implemented, however you are free to use the build in addEventLister instead, to do so in `minireact.js` in the `updateDom` function replace `dom.customAddEventListener` with `dom.addEventListener`. As is, the only events that work are `keydown`, `click`, `dblclick`, `blur`, `input` and `mouseover`. To use these in your app, you can just add `onClick` etc. into a html element in your class, and then add a callback function for it to use. Currently only one event per type per dom element is possible, and new ones will overwrite old ones.


## Manual configuration:
If you have cloned the repository these should already exist in their respective files and this section can be skipped but if you want to add them manually this is the file structure and configuration that should get things working.


### File structure
The exact file structure isn't that important but changing it may require changing import paths, the src path in index.html and the webpack config file below. the src folder and css folder contains everything you should be editing yourself, and the dist folder contains the result of webpack transpiling and minifying what is in the src folder to be run by the browser. As is the expected file structure is:

    root
    |--css
    |   |--index.css
    |
    |--dist
    |   |--app.js
    |
    |--node_modules
    |
    |--src
    |   |--components
    |   |--minireact
    |   |   |--minireact.js
    |   |
    |   |--app.js
    |
    |--.gitignore
    |--babel.config.json
    |--index.html
    |--package-lock.json
    |--package.json
    |--Readme.md
    |--webpack.config.cjs


### package.json:

    {
    "type": "module",
    "name": "mini-framework",
    "version": "1.0.0",
    "scripts": {
        "build": "webpack"
    },
    "devDependencies": {
        "@babel/cli": "^7.25.6",
        "@babel/core": "^7.25.2",
        "@babel/preset-env": "^7.25.4",
        "@babel/preset-react": "^7.24.7",
        "babel-loader": "^9.2.1",
        "jest": "^29.7.0",
        "webpack": "^5.95.0",
        "webpack-cli": "^5.1.4"
    }
    }

### webpack.config.cjs:

    const path = require("path");

    module.exports = {
    entry: path.resolve(__dirname, "src", "app.js"),
    output: {
        path: path.resolve(__dirname, "dist"),
        filename: "app.js",
    },
    module: {
        rules: [
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
            loader: "babel-loader",
            options: {
                targets: "defaults",
                presets: [["@babel/preset-env"]],
            },
            },
            resolve: {
            fullySpecified: false
            }
        },
        ],
    },
    };


### babel.config.json:

    {
        "presets": [ "@babel/preset-react"]
    }



# How it works:
## create element and create text element
## create dom and update dom
## commit root, commit work and commit deletion
## update function component and update host component
## reconcile children
## workloop and perform unit of work
## use state 
## routehandler

# Limitations:
    can't handle all events, and can only have one event type per DOM element, this is due to needing to create a custom event handler for the project without use of addEventListener, in practice can just use that.

    doesn't have all of the react hooks, only useState.


# Acknowledgements:

Thanks to rodrigo pombo for his excellent [tutorial](https://pomb.us/build-your-own-react/) on the basics of reimplementing react, as well as Peter, Rupert, Bilal and Daisy for their help in finding and fixing bugs getting my head around everything.
