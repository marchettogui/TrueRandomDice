module.exports = (Client, message) => {
	message.channel.send({embed: {color: message.author.id % 0xFFFFFF, title: "Burrice!", description: "Ouve o que você tá falando, nem existe isso ai!\nVeja em $info para saber os comando existentes e como rolar seus dados"}});
}