# ACTUAL README

background and purpose:
    -to gain a deeper understanding of how frameworks (and particularly in this case, react) work
    - part of the 01founders course with project [project link] that has certain requirements to build a mini framework to reimplement features of others, and then use that framework to make a basic todo app. A future project will use the framework to create a multiplayer bomberman game. 

acknowledgements:

thanks to rodrigo pombo for his excellent tutorial:

    https://pomb.us/build-your-own-react/

on the basics of reimplementing react, as well as peter, rupert, bilal and daisy for their help in finding and fixing bugs and deepening my understanding.

Usage:

prerequisite installs: babel (babel cli, babel core, babel preset-env, babel preset-react), webpack (webpack, webpack-cli, babel-loader), liveserver extension

config:
package.json:

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

webpack.config.cjs:

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
            },
            ],
        },
        };

babel.config.json:

        {
         "presets": [ "@babel/preset-react"]
        }


to edit, make changes to app.js and add components to the components folder
To update site after making changes, do 'npm run build' then run the live server.

in app.js, need to have:

    import { minireact } from "./minireact/minireact.js";

        /** @jsx minireact.createElement */

at the beginning, and then:

    let container = document.body;
    const app = <App></App>
    minireact.render(app, container);

at the end, where in the middle you should have a function called App where you can create your app. it can return jsx and use regular react syntax. For usestate, you should use:

    minireact.useState

but apart from that it has the same syntax as regular react useState.

in your App function, create a routes object with keys as routes that would go at the end of the url after '#/', and functions to exectute on going to that route as values, then put:

  window.onhashchange = () => minireact.routeHandler(routes)

in the app component

add stuff about installing babel and webpack.

features:
 virtual dom
 state management
 basic event handling

explanations:
    - create element and create text element
    - create dom and update dom
    - commit root, commit work and commit deletion
    - update function component and update host component
    - reconcile children
    - workloop and perform unit of work
    - use state 
    - routehandler

limitations and possible future extension:
    can't handle all events, and can only have one event type per DOM element, this is due to needing to create a custom event handler for the project without use of addEventListener, in practice can just use that.

    doesn't have all of the react hooks, only useState.

