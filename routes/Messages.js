const express = require("express");
const router = express.Router();
const MessageModel = require("../models/messageModel");

router.post("/", async (req, res) => {
	const { userFrom, userTo, message, status } = req.body;
	try {
		const messages = await MessageModel.updateOne(
			{ userFrom, userTo, message },
			{ $set: { status } },
			{ upsert: true, new: true }
		);
		res.status(200).json(messages);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.get("/", async (req, res) => {
	try {
		const messages = await MessageModel.find({ status: "unread" }).select(
			"-_id, -__v, -createdAt, -updatedAt"
		);
		res.status(200).json(messages);
	} catch (error) {
		res.status(500).json(error);
	}
});

router.post("/byMessage", async (req, res) => {
	const { message } = req.body;
	try {
		const messages = await MessageModel.find({ message });
		res.status(200).json(messages);
	} catch (error) {
		res.status(500).json(error);
	}
});

module.exports = router;
