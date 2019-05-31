let grammar = tracery.createGrammar(chefGrammar)
$(function() {
	console.log("start")

	// Create a parse visualization
	mouse.init()
	initEditor()
});



function createArray() {
	let count = Math.floor(Math.random() * 10)
	let arr = []
	for (var i = 0; i < count; i++) {
		arr.push({
			id: grammar.flatten("#id#"),
			type: "text",
			value: getRandom(emoji)
		})

		if (Math.random() < .1) {
			arr.push({
				id: grammar.flatten("#id#"),
				type: "array",
				value: createArray()
			})
		}
	}
}

let appData = {
	data: [],
	init: function() {
		
	}
}

appData.init()