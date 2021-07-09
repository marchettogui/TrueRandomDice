const config = require("./config.json");
require("dotenv").config();
const discord = require("discord.js");
const client = new discord.Client();
const commands = require("./scripts/commandsReader.js")(config.prefix);

const https = require('https');
const express = require('express');
const app = express();

app.get("/", (request, response) => response.sendStatus(200));
app.listen(process.env.PORT);
setInterval(() => {
  	https.get(`${process.env.PROJECT_DOMAIN}`);
  	client.users.fetch(process.env.ID).then(user => user.send("Ping 5 min"));
}, 280000);

client.on("ready", () => {
	console.log(`Login: ${client.user.username}:#${client.user.tag}`);
	client.users.fetch(process.env.ID).then(user => user.send(`Login: ${client.user.username}:#${client.user.tag}`));
});

client.on("message", (message) => {
	if (!message.author.bot && message.guild){
		const contentArguments = message.content.split(" ");
		if (commands[contentArguments[0]]) {
			commands[contentArguments[0]](client, message);
		} else if (contentArguments[0].split("")[0] == config.prefix) {
			commands[config.prefix + "unknownCommand"](client, message);
		}
	}
});

client.login(process.env.TOKEN);