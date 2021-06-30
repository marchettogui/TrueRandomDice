module.exports = (Client, message) => {
	const Config = require("../config.json");
	const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
	const Request = new XMLHttpRequest();
	var expression = message.content.split(" ").slice(1, ).join("");
	var elements = [];
	var rolls = [];

	if ((elements = getExpressionElements(expression)) && (rolls = getRolls(elements))) {
		
		Request.open("GET", `https://www.random.org/integers/?num=${rolls.quantity}&min=1&max=${rolls.faces_mmc}&col=1&base=10&format=plain&rnd=new`);
		Request.send();
		Request.onload = () => {
			if (Request.status === 200){
				parsed_response = getRequestResults(Request.responseText);
				elements.forEach(function(element) {
					if (element.type == "dice") {
						element.values = [];
						for (i = 0; i < element.quantity; i++) {
							element.values.push(Math.ceil(parsed_response.shift() * element.faces / rolls.faces_mmc));
						}
					}
				});
				result_string = getResultString(elements);

				message.channel.send({embed: {type: "article", color: message.author.id % 0xFFFFFF, fields: [{name: `${message.author.username}`, value: `${result_string}`, inline: false}]}});
			} else {
				console.log(`error ${Request.status} ${Request.statusText}`);
			}
		}
	} else {
		message.channel.send({embed: {color: message.author.id % 0xFFFFFF, title: "Seu burro! Não é assim que rola dados!", description: `Veja em ${Config.prefix}info como me mandar rolar seus dados\n*Jonathan sai e bate a porta*\nOuve-se ao fundo: \"Verme insolente!\"`}})
	}
}

function getExpressionElements(expression) {
	var elements = [];
	var buffer = [];

	for (i = 0; i < expression.length; i++) {
		buffer.push(expression[i]);
		if(expression[i] == "+" || expression[i] == "-" || expression[i] == "/" || expression[i] == "*") {
			if(!pushDice(elements, buffer)) return false;
			elements.push({type: "operator", values: expression[i]});
			buffer = [];
		}
	}
	if(!pushDice(elements, buffer)) return false;

	return elements;
}

function pushDice(elements, buffer) {
	if (buffer == [] || buffer.indexOf("d") != buffer.lastIndexOf("d") || isNaN(parseInt(buffer)) || parseInt(buffer) <= 0 || parseInt(buffer) > 10000) return false;
	if (buffer.includes("d")) {
		if (isNaN(parseInt(buffer.join("").split("d")[1])) || parseInt(buffer.join("").split("d")[1]) <= 0 || parseInt(buffer.join("").split("d")[1]) > 10000) return false;
		elements.push({type: "dice", quantity: parseInt(buffer.join("").split("d", 2)[0]), faces: parseInt(buffer.join("").split("d", 2)[1])});
	} else {
		elements.push({type: "number", values: parseInt(buffer)})
	}
	return true;
}

function getRolls(elements) {
	var dices = elements.filter((element) => element.type == "dice");
	var quantity = dices.sort((element_a, element_b) => element_b.faces - element_a.faces).reduce((total, element) => total + element.quantity, 0);
	if (quantity > 10000) return false;
	var faces_mmc = dices.reduce(function(total, element) {
		if(total % element.faces != 0) return total * element.faces;
		else return total;
	}, 1);
	return {quantity: quantity, faces_mmc: faces_mmc};
}

function getRequestResults(responseText) {
	var parsed_response = [];
	var buffer = [];

	for (i = 0; i < responseText.length; i++) {
		buffer.push(responseText[i]);
		if (responseText[i] == '\n') {
			parsed_response.push(parseInt(buffer.join("")));
			buffer = [];
		}
	}

	return parsed_response;
}

function getResult(elements) {
	var result = elements[0].values.reduce((total, value) => total + value, 0);
	
	for (i = 1; i < elements.length; i++) {
		if (elements[i].values == "+") {
			i++;
			if (elements[i].type == "dice") {
				result += elements[i].values.reduce((total, value) => total + value, 0);
			} else {
				result += elements[i].values;
			}
		}
		if (elements[i].values == "-") {
			i++;
			if (elements[i].type == "dice") {
				result -= elements[i].values.reduce((total, value) => total + value, 0);
			} else {
				result -= elements[i].values;
			}
		}
		if (elements[i].values == "*") {
			i++;
			if (elements[i].type == "dice") {
				result *= elements[i].values.reduce((total, value) => total + value, 0);
			} else {
				result *= elements[i].values;
			}
		}
		if (elements[i].values == "/") {
			i++;
			if (elements[i].type == "dice") {
				result /= elements[i].values.reduce((total, value) => total + value, 0);
			} else {
				result /= elements[i].values;
			}
		}
	}

	return result;
}

function getResultString(elements) {
	var result_string = [];
	var result = getResult(elements);
	for (i = 0; i < elements.length; i++) {
		if (elements[i].type == "dice") {
			result_string.push("[", elements[i].values.join(", "), "]");
		} else {
			result_string.push(elements[i].values);
		}
	}
	if (elements.length > 1 || elements[0].values.length > 1) result_string.push("=", result);

	return result_string.join("");
}