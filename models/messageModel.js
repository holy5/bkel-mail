const mongoose = require("mongoose");

const messageScheme = new mongoose.Schema(
	{
		userFrom: {
			type: String,
			required: true,
		},
		userTo: {
			type: String,
			required: true,
		},
		message: {
			type: String,
			required: true,
		},
		status: {
			type: String,
			require: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Message", messageScheme);
