# README

[1. Backgound](#background)

[2. Features](#features)

[3. Usage](#usage)
- [Quickstart](#quickstart)
- [Prerequisites](#prerequisites)
- [Making other apps](#making-other-apps)
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
 virtual dom
 state management
 basic event handling
 basic routing


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

Install the [live server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) VSCode extension, and then click on the icon on the bottom left while in the root folder.

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


### state management
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

### Routes

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


## manual configuration:
If you have cloned the repository these should already exist in their respective files but if you want to add them manually these are the configs that worked.


### file structure


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
    - create element and create text element
    - create dom and update dom
    - commit root, commit work and commit deletion
    - update function component and update host component
    - reconcile children
    - workloop and perform unit of work
    - use state 
    - routehandler

# Limitations:
    can't handle all events, and can only have one event type per DOM element, this is due to needing to create a custom event handler for the project without use of addEventListener, in practice can just use that.

    doesn't have all of the react hooks, only useState.


# acknowledgements:

Thanks to rodrigo pombo for his excellent [tutorial](https://pomb.us/build-your-own-react/) on the basics of reimplementing react, as well as peter, rupert, bilal and daisy for their help in finding and fixing bugs and deepening my understanding.
