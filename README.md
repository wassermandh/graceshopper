# Your World Industries:

http://yourworldindustries.herokuapp.com/products

Your world industries is a gag e-commerce site that sells users planets.

## Navigating the site:

The site's home page displays all 3 available planets. Users (guests or logged-in) can click on each planet to render a single-product view, where they can add a certain quantity of the item to their cart. A user can then click on "see cart" in the nav-bar to see the number of each item in their cart. A user can check out by clicking the "to checkout" button beneath the "change quantity" button. If the user is not logged in, they will be asked to do so or to sign up with a username/password or OAuth. If the user is logged in, there will be  an option to "pay with card", but this is not functional. They can also click "submit order", after which they will be thanked for their purchase. They can then click the "orders" tab toward the top of the screen to see their submitted order(s). 

## Technologies:

Styling:<br />
Basic CSS and Semantic-UI<br />

Storing/accessing data:<br />
Postgres<br />
Sequelize<br />
Local Storage<br />

Front-end:<br />
React<br />
React-Redux<br />

## Running our app

Fork and clone the repository

Run npm install

Create two postgres databases: grace-shopper and grace-shopper-test

Run _npm test_ to run our unit tests

Run _npm run seed_ to seed the database

_npm run start-dev_ runs the app in development mode. Open http://localhost:8080 to view it in the browser. Errors will be shown in your browser and code editor

You can view the deployed version of the app on: http://yourworldindustries.herokuapp.com/products

Please note that you will need to first configure a new application with Heroku if you would like to launch a clone of this repository.
