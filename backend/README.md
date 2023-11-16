## Backend technologies

### NodeJS, Express, GraphQL, PostgreSQL, ApolloClient

## Setup Backend

In the project directory, you can run:

### `cd .\backend\`

Opens the backend directory

### `npm run start`

Launches the backend server, connected to postgre db. Also seeds the db on each startup by running npm run seed before starting up the server.

## Additional commands

### `npm run seed`

Seeds the database with mockup data

### `npm run wipeDB`

Wipes the DB, usually used for testing.

### `npm run createDB`

Creates an empty DB, should be executed after running `npm run wipeDB`
