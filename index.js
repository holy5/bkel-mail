const dotenv = require("dotenv");
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const messageRouter = require("./routes/Messages");
const bodyParser = require("body-parser");
const main = require("./bot/index");
const cors = require("cors");

dotenv.config();

app.use(cors());
app.use(bodyParser.json({ limit: "50mb", extended: true }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));

app.use("/messages", messageRouter);

mongoose.connect(process.env.MONGO_URI, () => {
	app.listen(process.env.PORT, () => {
		console.log("server is running ...");
	});
});

const INTERVAL = 1000 * 60; // 1 minute

setInterval(async function () {
	await main();
}, INTERVAL);
