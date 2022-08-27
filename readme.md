# photoShare

PhotoShare is a MERN stack app. You can share and comment on photos and tag friends. 

## Installation

    npm install

Create a mongodb database. Replace the mongodb uri at webServer.js and loadDatabase.js. 

Add data to the database:

    node loadDatabase.js 

Compile the frontend files:

    npm run build:w 


## Usage

To start the webserver:

    nodemon webServer.js  

For testing run in the test folder:

    npm run test

Go to: http://localhost:3000
