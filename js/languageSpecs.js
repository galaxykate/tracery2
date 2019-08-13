let allSchema = {}

allSchema.chancery = {

	keyTypes: {
		"state": {
			generate: () => utilities.words.getRandomWord(),
			generateCount: () => Math.floor(Math.random()*Math.random()*20 + 2)
		},
		"sound": {
			generate: () => utilities.words.getRandomWord() + ".ogg",
			generateCount: () => Math.floor(Math.random()*Math.random()*20 + 2)
		},
		"image": {
			generate: () => utilities.words.getRandomWord() + ".png",
			generateCount: () => Math.floor(Math.random()*Math.random()*20 + 2)
		},
		"variable": {
			generate: () => utilities.words.getRandomWord(),
			generateCount: () => Math.floor(Math.random()*Math.random()*20 + 2)
		},
	},

	customTypes: {
		"Data": "*date:string(date), *author:string(username), uid:string(uid), *version:string, *stars:number(int), *forks:Array of string(uid), map:Dictionary of State) of function",
		"State": "exits:Array of Exit",
		"Exit": "string(exit)"

		},
		parseContexts: { 
			outerRule: {},
			innerRule: {}
		},
	

	vueComponents: {
		preview: "tracery-preview"
	},
}



allSchema.tracery = {

	keyTypes: {
		"symbol": {
			generate: () => utilities.words.getRandomWord(),
			generateCount: () => Math.floor(Math.random()*Math.random()*20 + 2)
		},
		"modifier": {
			generate: () => utilities.words.getRandomVerb(),
			generateCount: () => Math.floor(Math.random()*Math.random()*20 + 2)
		},
	},
	vueComponents: {
		preview: "tracery-preview"
	},
}


allSchema.tracery2 = {

	vueComponents: {
		preview: "tracery-preview"
	},
	

	keyTypes: {
		"symbol": {
			generate: () => utilities.words.getRandomWord(),
			generateCount: () => Math.floor(Math.random()*Math.random()*20 + 2)
		},
		"modifier": {
			generate: () => utilities.words.getRandomVerb(),
			generateCount: () => Math.floor(Math.random()*Math.random()*20 + 2)
		},
	},
	textTypes: {
		traceryOuterRule: (context) => {

			function randomTag() {
				let key = getRandom(context.generatedKeys.symbol)
				let modCount = Math.floor(Math.random()*Math.random()*3)
				for (var j = 0; j < modCount; j++) {
					key += "." + getRandom(context.generatedKeys.symbol)
				}
				return key
			}

			function randomRule() {
				let s = []
				let count = Math.floor(Math.random()*Math.random()*10 + 1)
				for (i = 0; i < count; i++) {
					if (Math.random() > .5) {
						s.push(utilities.words.getRandomWord())
					} else {
						s.push("#" + randomTag() + "#")
					} 
				}
				return s.join(" ")
			}

			let count = Math.floor(Math.random()*Math.random()*10 + 1)
			let s = []
			for (i = 0; i < count; i++) {
				if (Math.random() > .5) {
					s.push(utilities.words.getRandomWord())
				} else if (Math.random() > .7) {
					s.push("[" + getRandom(context.generatedKeys.symbol) + ":" + randomRule()  + "]")
				} else {

					s.push("#" + randomTag()  + "#")
				} 

			}

			return s.join(" ")
		} 
	},

	customTypes: {
		"Data": "*date:string(date), *author:string(username), uid:string(uid), *version:string, *stars:number(int), *forks:Array of string(uid),grammar:BasicGrammar, modifiers:Dictionary(modifier) of function",
		"BasicGrammar": "Dictionary(symbol) of RuleSet",
		"RuleSet": "RuleString, RuleArray",
			// "RuleSet": "RuleString, RuleArray, RuleCase, RuleFalldown, RuleThreshhold, RuleCondition",
			"RuleString": "string(traceryOuterRule)",
			"RuleArray": "Array of RuleSet",
			"RuleCase": "condition:RuleString, cases:Dictionary of RuleSet, default: RuleSet",
			"RuleFalldown": "Dictionary of RuleSet",
			"RuleCondition": "condition:Condition, ifTrue:RuleSet, ifFalse:RuleSet",

			// Condition: some action that can be run to produce a true/false (hasTag etc)
			"Condition": "string(condition)",

		},
		parseContexts: { 
			outerRule: {},
			innerRule: {}
		}
	}
