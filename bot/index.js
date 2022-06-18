const {
	checkExistAndWriteMessageToDB,
	sendEmail,
	getUnreadMessagesFromDB,
} = require("../utils/index");
const axios = require("axios");
const dotenv = require("dotenv");

dotenv.config();

async function main() {
	await checkExistAndWriteMessageToDB();
	const messagesArray = await getUnreadMessagesFromDB();
	if (messagesArray.length > 0) {
		messagesArray.forEach(async (message) => {
			sendEmail({
				from: message.userFrom,
				to: message.userTo,
				html: message.message,
			});
			axios.post(`/messages`, {
				...message,
				status: "read",
			});
		});
	} else {
		return;
	}
}
module.exports = main;
