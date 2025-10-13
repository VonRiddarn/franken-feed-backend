# Frankenfeed 👹💻

The spookiest social network to ever roam the internet.

## How to use 🤔

0️⃣ Download and launch a docker container following [this tutorial](https://orm.drizzle.team/docs/guides/postgresql-local-setup).
1️⃣ Clone the repo using `git clone link-to-repo`  
2️⃣ Install dependencies with `npm i`  
3️⃣ Create an environment file called `.env` in the root directory and add your `DATABASE_URL` and `PORT` variables.  
_Varies depending on your Postgre host location, but:_  
For local hosting: `DATABASE_URL=DATABASE_URL=postgres://postgres:my-secret-password@localhost:5432/postgres` is the default.  
4️⃣ Run `npx drizzle-kit push` to create tables in your database (note: proper migrations are not set up yet).  
5️⃣ Start the project using `npm run dev`  
_This starts a developer environment using `tsx` and `nodemon`._  
6️⃣ (Optional) Run `tsc` to transpile the project into `./dist`

## Extra resources 💡

_Stuff that might be useful._  
🐘 [PostgreSQL - docs](https://www.postgresql.org/docs/)  
🐍 [Drizzle ORM - Get started](https://orm.drizzle.team/docs/get-started/postgresql-new) : [Drizzle ORM - Custom schema](https://orm.drizzle.team/docs/sql-schema-declaration)  
🚅 [Express.JS - docs](https://expressjs.com/en/starter/hello-world.html)  
⚛️ [Module augmentation - TS docs](https://www.typescriptlang.org/docs/handbook/declaration-merging.html#module-augmentation)  
🤓 [How to extend Request object - Stackoverflow](https://stackoverflow.com/questions/37377731/extend-express-request-object-using-typescript)

## Dependencies 📦

_List of what and why. Coming soon._

## Pre-post mortem notes 📝

_Development insgits and comments._
