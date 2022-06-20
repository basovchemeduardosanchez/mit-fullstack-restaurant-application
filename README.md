# MIT Fullstack Restaurant Application

![Full rendering](./restaurants.png)

## Starter Files Notes

### Frontend Notes

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app)

- index3.js (Data is hardcoded)
- index.js (Get data from Strapi using Apollo and GraphQL)
- restaurantList.js is Web Component to render restaurants

### Backend Notes

The backend is a strapi application. For detailed explanation on how things
work, checkout the [Strapi docs](https://docs-v3.strapi.io/developer-docs/latest/)

#### Permissions plugin configuration

For the **Public** role:

- Application
    - Resaurant
        - find
        - findone
    - Dish
        - find

For the **Authenticated** role:

- Application
    - Resaurant
        - find
        - findone
    - Dish
        - find
    - Order
        - create

## App Requirements

### Create account

- [x] User can create an account with email and password input field
- [x] User receives a success message after creating an account
- [x] After creating an account, username or email appears on the top right corner

### Login

- [x] User can log into account with email
- [x] User can log out of account
- [x] User can log in with another authentication source from OAuth 2 — Disccord
    account

### Homepage

- [x] Display list of restaurants

### Search Functionality

- [x] User can search for restaurants from home page
- [x] User can search for dishes on restaurant page

### Cart Functionality

- [x] User can add dishes to cart. User can remove dishes from cart
- [x] Price updates automatically
- [x] User can update quantity in cart

### Checkout Functionality

- [x] User can check out with Stripe
- [x] User receives a success message
- [x] Input fields are validated

## Contributing

### Notes

- Do not use the useState hook to work with a single state object unless you're
    going to set the whole state only once per render. If for some reason you
    decide to create individual functions to update a single object, calling them
    in sequence will cause that only the last value is written to the state

    <details>
    <summary>Wrong Example</summary>
    <section>

    ```jsx
    // App.js

    import React, { useState } from 'React';
    import { AppContext } from './context.js';
    import Component1 from 'Component1.js'

    function App() {
        const [ state, setState() ] = useState({ key1: 1, key2: 2 });
        const setKey1 = ( key1 ) => setState( { ...state, key1 } );
        const setKey2 = ( key1 ) => setState( { ...state, key2 } );

        // ...

        return (
            <AppContext.Provider value={{
                key1: state.key1,
                setKey1,
                key2: state.key2,
                setKey2
            }}>
                <Component1 />
            </AppContext.Provider>
        )
    }

    export default App;

    ```

    ```jsx
    // Component1.js

    import React, { useState } from 'React';
    import { AppContext } from './context.js';

    function Component1(){
        const appContext = useContext( AppContext );

        // ...

        const handleClick = () => {
            appContext.setKey1( 2 );
            appContext.setKey2( 3 );
            // Expected new state: { key1: 2, key2: 3 }
            // Reality: { key1: 1, key2: 3 }
        }

        return (
            <button type="button" onClick={ handleClick }>Click me!</button>
        )
    }

    export default Component1;
    ```

    In the above example, the problem is that React does not update the values of
    the variable linked to the `setState` function immediately but until the JS
    stack is empty, which means that by the time the `setKey2`
    function is executed after the button is clicked, the state will continue to
    be the same and therefore only the value of key2 will be changed

    </section>
    </details>

    <details>
    <summary>Right Example</summary>
    <section>

    ```jsx
    // App.js

    import React, { useState } from 'React';
    import { AppContext } from './context.js';
    import Component1 from 'Component1.js'

    function App() {
        const [ key1, setKey1 ] = useState( 1 );
        const [ key2, setKey2 ] = useState( 2 );

        // ...

        return (
            <AppContext.Provider value={{
                key1,
                setKey1,
                key2,
                setKey2
            }}>
                <Component1 />
            </AppContext.Provider>
        )
    }

    export default App;

    ```

    ```jsx
    // Component1.js

    import React, { useState } from 'React';
    import { AppContext } from './context.js';

    function Component1(){
        const appContext = useContext( AppContext );

        // ...

        const handleClick = () => {
            appContext.setKey1( 2 );
            appContext.setKey2( 3 );
            // Expected new state: { key1: 2, key2: 3 }
            // Reality: { key1: 2, key2: 3 }
        }

        return (
            <button type="button" onClick={ handleClick }>Click me!</button>
        )
    }

    export default Component1;
    ```

    In the above example, since both variables are separated, each will get its
    own value as expected

    </section>
    </details>

### Prerequisites

1. Install homebrew on macOS
2. Install NVM

    ```bash
    curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
    ```

3. Install Node.js with NVM

    ```bash
    nvm install lts/erbium
    nvm use lts/erbium
    ```

4. Upgrade npm to npm 8

    ```bash
    npm install --global npm@8
    ```

5. Install yarn

    ```bash
    npm install --global yarn
    ```

### Run

Run locally by executing:

```bash
yarn
yarn dev
```

#### Running the Frontend

Run locally by executing:

```bash
yarn
yarn dev
```

Then, open [http://localhost:3000](http://localhost:3000) with your browser to
see the result

You can start editing the page by modifying `pages/index.js`. The page
auto-updates as you edit the file.

#### Running the Backend

Run locally by executing:

```bash
cd backend
yarn
yarn develop
```

### Deploy

#### Back-end deployment to Heroku

```bash
# Make sure to add your stripe secret key into the backend/.env file
cd backend
nvm use
heroku login
heroku create mit-fs-restaurant-app-strapi
heroku config:set PROJECT_PATH=backend
# Link the project with github in the Heroku dashboard. See: https://devcenter.heroku.com/articles/github-integration
heroku buildpacks:set https://github.com/timanovsky/subdir-heroku-buildpack
heroku buildpacks:add heroku/nodejs
heroku addons:create heroku-postgresql:hobby-dev
heroku config:set NODE_ENV=production
heroku config:set DEPLOYMENT_URL=$(heroku info -s | grep web_url | cut -d= -f2)
heroku config:set STRIPE_SECRET_KEY=$( source .env; echo "$STRIPE_SECRET_KEY" )
git push heroku HEAD:master
heroku open
heroku logs --tail
heroku logout
# - In the Strapi admin dashboard go to plugins "Config Sync" and click import
# - Register restaurants and dishes without images since heroku deployments do
#   not support images
# - Setup Discord With your discord login API details and set the redirect url
#   to the URL in the redirect page in the front-end
#   (e.g. https://basovchemeduardosanchez.github.io/mit-fullstack-restaurant-application/connect/discord/redirect)
# - Enable automatic github deploys in the Heroku dashboard
```

#### Front-end deployment to Github Pages

```bash
# - Make sure to add your STRIPE_PUBLIC_KEY into the .env file
# - Make sure to set your NEXT_PUBLIC_API_URL into the .env.production file to
#   the root of your strapi server (e.g. https://mit-fs-restaurant-app-strapi.herokuapp.com)
use nvm
yarn deploy
```

## Resources

- <https://docs-v3.strapi.io/developer-docs/latest/update-migration-guides/update-version.html#upgrading-the-dependencies>
- <https://github.com/strapi/strapi/issues/9145>
- <https://github.com/strapi/strapi/issues/10326>
- <https://docs-v3.strapi.io/developer-docs/latest/development/plugins/users-permissions.html#providers>
- <https://nextjs.org/docs/api-reference/next.config.js/environment-variables>
- <https://nextjs.org/docs/basic-features/data-fetching/get-static-props>
- <https://docs-v3.strapi.io/developer-docs/latest/setup-deployment-guides/deployment/hosting-guides/heroku.html>
- <https://devcenter.heroku.com/articles/github-integration>
- <https://stackoverflow.com/a/53221996/1714951>
- <https://forum.strapi.io/t/unable-to-create-content-after-deploy-to-heroku/2047>
- <https://stackoverflow.com/a/61978654/1714951>
- <https://stackoverflow.com/a/64493580>

### Next.js

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js
    features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out
[the Next.js GitHub repository](https://github.com/vercel/next.js/) - your
feedback and contributions are welcome!
