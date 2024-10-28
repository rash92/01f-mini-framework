# ACTUAL README

to edit, make changes to app.js
To update site after making changes, do 'npm run build' then run the live server.
need to have:

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