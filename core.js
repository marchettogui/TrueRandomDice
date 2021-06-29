const Discord = require("discord.js");
const Client = new Discord.Client();
const Config = require("./config.json");
const Commands = require("./scripts/commandsReader.js")(Config.prefix);
require("dotenv").config();

const https = require('https');
const express = require('express');
const app = express();
app.get("/", (request, response) => response.sendStatus(200));
app.listen(process.env.PORT);
setInterval(() => {
  	https.get(`${process.env.PROJECT_DOMAIN}`);
}, 280000);

Client.on("ready", () => {
	console.log("Pai tá on");
	Client.users.fetch(process.env.ID).then(user => user.send("Pai tá on!"));
  	setInterval(() => {
    	Client.users.fetch(process.env.ID).then(user => user.send("Ping 5min"));  
  	}, 280000);
});

Client.on("message", (message) => {
	if (!message.author.bot && message.guild){
		const content_arguments = message.content.split(" ");
		if (Commands[content_arguments[0]]) {
			Commands[content_arguments[0]](Client, message);
		} else if (content_arguments[0].split("")[0] == Config.prefix) {
			Commands[Config.prefix + "unknownCommand"](Client, message);
		}
	}
});

Client.login(process.env.TOKEN);