# yara-code-challenge

## PostgreSQL credentials for DB

user: 'postgres',
host: 'localhost',
database: 'postgres',
password: '1234',
port: 5432,

If there is a need to modify those, according to different PostgreSQL setup, please modify the file /scripts/pgcredentials.ts

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

## Setup Frontend

In the project directory, you can run:

### `cd .\frontend\`

Opens the backend directory

### `npm run start`

Launches the frontend. React connected to postgresql through apollo client

## Additional commands

### `npm run test`

Launches the test runner in the interactive watch mode

### `npm run build`

Builds the app for production to the `build` folder.