import "dotenv/config";
import express from "express";
import { attachApiResponse } from "./middleware/ExtendResponse.ts";
import { userRouter, USERS_ROOT } from "./controllers/userEndpoints.ts";

const app = express();
app.use(attachApiResponse);
app.use(express.json());
app.use(USERS_ROOT, userRouter);

const server = app.listen(process.env.PORT, startMessage);

// SIGINT (Interupt) = Predefined signal for regular CTRL + C shutdown
// SIGTERM (Terminate) = Prefefined signal for external termination
["SIGINT", "SIGTERM"].forEach((signal) => {
	process.on(signal, () => shutdown());
});

// Methods
function startMessage() {
	console.log("\nServer is now operating.");
	console.log(`Running on:\thttp://localhost:${process.env.PORT}`);
}

async function shutdown() {
	console.log("Shutting down...");

	server.close(async (err) => {
		if (err) {
			console.error("Error while closing server: ", err);
			process.exit(1);
		}

		// More stuff goes here.

		console.log();
		console.log("Shutdown complete.");
		process.exit(0);
	});
}
