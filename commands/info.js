module.exports = (Client, message) => {
	const Config = require("../config.json");

	message.channel.send({embed: {color: message.author.id % 0xFFFFFF, title: "TrueRandomDice - Jonathan", description: "Carinhosamente chamado de Jonathan, nosso amigo bot levemente passivo-agressivo usa números verdadeiramente aleatórios gerados pelo random.org para rolar seus dados de RPG ;D", fields: [
		{name: "Comandos", value: `${Config.prefix}info e ${Config.prefix}roll`}, 
		{name: "Dados", value: "Os dados devem ser descritos assim: \"[NºdeDados]d[NºdeFaces]\"\nO [NºdeDados] e o [NºdeFaces] deve pelo menos 1. Jonathan só tem 10 mil dados de até 10 mil lados. Por favor não exista!\nPor motivos óbvios cada dado só pode ter apenas um \"d\" no meio"}, 
		{name: "Operadores", value: "São aceitos os 4 operadores mais primordiais da matemática: +, -, *, /\nA expressão obrigatoriamente não pode começar nem terminar com operadores"}, 
		{name: "Expressão", value: `Jonathan aceita qualquer expressão alternando dado/número e operadores. Veja os exemplos abaixo:\n${Config.prefix}roll 1d20\n${Config.prefix}roll 1d12+1d6+8\n\nCaso você role os dados que nem um energumino o Jonathan vai te xingar`}
	]}});
}