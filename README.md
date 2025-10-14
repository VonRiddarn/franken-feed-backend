# Frankenfeed 👹💻

The spookiest social network to ever roam the internet.

## How to use 🤔

### Download the project

1️⃣ Clone the repo using `git clone link-to-repo`  
2️⃣ Install dependencies with `npm i` (Requires [Node](https://nodejs.org/en) to be installed on your system)

### Setup Docker

1️⃣ Download and install [Docker](https://www.docker.com/) for your operating system.  
2️⃣ Run the command: `docker run --name drizzle-postgres -e POSTGRES_PASSWORD=your_password_here -d -p 5431:5432 postgres`  
_Make sure to replace `your_password_here` with an individual password for your container_  
3️⃣ Add the following line to your `.env` file: `DATABASE_URL=postgres://postgres:your_password_here@localhost:5431/postgres`  
_Make sure to replace `your_password_here` with the password you chose when setting up your container_  
4️⃣ If you restart your computer, or you face problems when making contact with the DB: Make sure the container is still running.

### Setup the project

1️⃣ Ensure a `.env` file exists in the root directory and contains:

-   `DATABASE_URL`
-   `PORT`

2️⃣ Run `npx drizzle-kit push` to create tables in your database (note: proper migrations are not set up yet).  
3️⃣ Start a hot-reload environment of the project using `npm run dev`  
4️⃣ (Optional) Run `tsc` to transpile the project into `./dist`

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
