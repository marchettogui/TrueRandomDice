const fs = require("fs");
const diretory = "./commands/";

module.exports = (prefix) => {
	var commands = {};

	const scripts = fs.readdirSync(diretory);
	scripts.forEach(script => {
		commands[prefix + script.split(".")[0]] = require("../" + diretory + script);
	});

	return commands;
}