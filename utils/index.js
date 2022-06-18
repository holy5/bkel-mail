const axios = require("axios");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");

dotenv.config();

const BASE_URL = "http://e-learning.hcmut.edu.vn/webservice/rest/server.php";

async function getUserData() {
	const res = await axios.get(
		`${BASE_URL}?wstoken=${process.env.TOKEN}&wsfunction=core_webservice_get_site_info&moodlewsrestformat=json`
	);
	return res.data;
}

async function getMessages() {
	const userId = (await getUserData()).userid;
	const res = await axios.get(
		`${BASE_URL}?wstoken=${process.env.TOKEN}&wsfunction=core_message_get_messages&useridto=${userId}&read=0&type=both&moodlewsrestformat=json`
	);
	return JSON.stringify(res.data);
}

function sendEmail({ from, to, html }) {
	let transporter = nodemailer.createTransport({
		service: "gmail",
		auth: {
			user: process.env.EMAIL,
			pass: process.env.PASSWORD,
		},
		tls: {
			rejectUnauthorized: false,
		},
	});
	let mailOptions = {
		from: process.env.EMAIL,
		to: process.env.EMAIL_RECEIVER,
		subject: `Forwarded message from ${from}`,
		html: `<b>This is a forwarded message from ${from} to ${to}.</b>${html}`,
	};
	transporter.sendMail(mailOptions, function (error, info) {
		if (error) {
			console.log(error);
		} else {
			console.log(info);
		}
	});
}

async function checkExistAndWriteMessageToDB() {
	const messagesData = await getMessages();
	const messages = JSON.parse(messagesData).messages;

	for (let message of messages) {
		const res = await axios.post(`/messages/byMessage`, {
			message: message.fullmessagehtml || message.text,
		});
		if (res.data.length == 0) {
			axios.post(`/messages`, {
				userFrom: message.userfromfullname,
				userTo: message.usertofullname,
				message: message.fullmessagehtml || message.text,
				status: "unread",
			});
		}
	}
}

async function getUnreadMessagesFromDB() {
	const messages = await axios.get(`/messages`);
	return messages.data;
}

module.exports = {
	sendEmail,
	checkExistAndWriteMessageToDB,
	getUnreadMessagesFromDB,
};
