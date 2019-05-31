// Ery a suite of tools for dealing with optionally structured data
let baseTypes = mapArrayToObj(["boolean", "string", "number", "function", "range", "int"], s => s, (s) => {
	return {
		type: s,
		isBaseType: true
	};
});


// Given some type ("array of Foo", "{foo:bar}")
function parseErySpec(spec) {

	if (spec === undefined) {
		console.warn("undefined specification")
		return {};

	}
	if (typeof spec === "string") {
		spec = spec.trim()
		if (spec[0] == "[") {
			return {
				type: "array",
				of: parseErySpec(type.substring(1, type.length - 1))
			}
		}

		// Objects are hard...
		// TODO deal with nesting
		if (spec[0] == "{") {
			let props = {}
			let sections = spec.substring(1, spec.length - 1).split(",").map(s => s.split(":").map(s => s.trim()))
			sections.forEach((s) => {
				if (s.length !== 2) {
					console.warn("incorrect object property line!", s)
				}

				props[s[0]] = parseErySpec(s[1])

			})


			return {
				type: "obj",
				props: props
			};
		}

		// Todo: proper parsing here 
		if (spec.startsWith("'") && spec.endsWith("'")) {
			// A specific string
			
			return {
				type: "constant",
				value: spec.substring(1, spec.length - 1)
			};
		}
		if (!isNaN(spec)) {
			// A specific number
			return {
				type: "constant",
				value: parseFloat(spec)
			};
		}
		if (spec.startsWith("dictionary")) {
			if (!spec.startsWith("dictionary of "))
				console.warn("underspecified dictionary:", spec)
			let subtypeRaw = parseErySpec(spec.substring(14))

			return {
				type: "dictionary",
				of: subtypeRaw
			}
		}
		if (spec.startsWith("array of")) {
			let subtypeRaw = parseErySpec(spec.substring(8))

			return {
				type: "array",
				of: subtypeRaw
			};
		}

		// It may be a base spec (like "boolean" or "string")
		if (baseTypes[spec] !== undefined)
			return baseTypes[spec];

		// Todo: embedded types like Tracery.Ruleset
		return {
			type: "custom",
			customID: spec
		};
	}

	// Options
	return {
		type: "option",
		options: mapObject(spec.options, parseErySpec),
		default: spec.default,
		randomOptions: spec.randomOptions,
		order: spec.order ? spec.order.slice() : undefined
	};
}

function ErySpec(raw) {
	this.id = raw.id;
	this.types = mapObject(raw.types, parseErySpec);

	this.originSpec = this.types[raw.origin];
}

ErySpec.prototype.getSpec = function(typeID) {
	if (typeof typeID === "string") {
		if (baseTypes[typeID])	
			return baseTypes[typeID]
		return this.types[typeID]
	} 
	return typeID
}

ErySpec.prototype.createRandomRawData = function(spec) {
	let count = 0
	let el = {
		// spec: spec,

	}

	if (spec === undefined)
		console.warn("undefined spec")
	switch (spec.type) {
		case "string":
		el.value = grammar.flatten("#adj# #animal#")
		break;
		case "number":
		el.value = Math.random()
		break;
		case "constant":
		el.value = spec.value
		break;
		case "boolean":
		el.value = Math.random() > .5
		break;
		case "option":
		let selected
		if (spec.randomOptions) {
			selected = getRandom(spec.randomOptions)
		} else {
			let optionIDs = Object.keys(spec.options)
			let index = Math.floor(Math.random()* optionIDs.length)
			selected = optionIDs[index]
		}
		return this.createRandomRawData(spec.options[selected])

		break;
		case "dictionary":
		count = Math.floor(Math.random() * 4 + 2)
		el.value = {}
		for (var i = 0; i < count; i++) {
			key = grammar.flatten("#adj#_#digit#")
			el.value[key] = this.createRandomRawData(spec.of)
		}
		break;
		case "array":
		count = Math.floor(Math.random() * 4 + 2)
		el.value = []
		for (var i = 0; i < count; i++) {

			el.value.push(this.createRandomRawData(spec.of))
		}
		break;
		case "obj":

		el.value = {}
		for (key in spec.props) {
			el.value[key] = this.createRandomRawData(spec.props[key])
		}

		break;
		case "custom":

		let subspec = this.getSpec(spec.customID)

		return this.createRandomRawData(subspec)
		break;
		default:

		console.warn("Unknown spec:", spec)

	}
	return el.value;
	// return el
}




// Given a data object and an ery type, verify 
//   ....and return all the subtypes it is (unpack?)
ErySpec.prototype.expand = function(rawSpec, data) {
	//
	// console.log("expand: ", rawSpec, data)

	// The specification could be either a string or a type

	let spec =this.getSpec(rawSpec)



	// Verify this data against this specification
	switch(spec.type) {
		case "obj": 
			if (!(typeof data === "object" && !Array.isArray(data)))
				return {
					isError: true,
					error: "Non-obj for obj spec",
					spec: spec,
					value: data
				}
				
			// Is this data a set of fixed properties? are the extra properties?
			let targetKeys = Object.keys(spec.props)
			let foundKeys = Object.keys(data)

			// Are all the required props present?
			for (i in targetKeys) {
				// Todo: optional keys
				let key = targetKeys[i]
				if (!foundKeys.includes(key)) {
					console.warn("missing key:", key, data, spec)
				} 
			}

			return {
				props: mapObject(data, (val, key) => {
					let propSpec = spec.props[key]
					if (propSpec === undefined) {
						// Theres a property in the data that isn't in the specification
						return {
							isError: true,
							error: "Object contains non-spec property",
							value: val
						}
					} else {
						// This is a property from the specification
						return this.expand(propSpec, val)
					}
				}),
				spec: spec
			};
			break;

			// Is this data the same as the constant value?
			case "constant":
				console.log("CONST", spec)
				if (data === spec.value)
				return {
					spec: spec,
					value: data
				}
				else
				return {
					isError: true,
					error: "Incorrect constant",
					spec: spec,
					value: data
				}
			break


			case "string":

			// is this a string?  
			// todo: formatted strings
			if (typeof data === "string") {

				return {
					spec: spec,
					value: data
				}
			} else {
				return {
					isError: true,
					error: "Non-string for string spec",
					spec: spec,
					value: data
				}
			}
			case "number":
			
			if (!isNaN(data)) {
				return {
					spec: spec,
					value:  parseFloat(data)
				}
			} else {
				return {
					isError: true,
					error: "Non-number for number spec",
					spec: spec,
					value: data
				}
			}

			case "boolean":
			if (typeof data === "boolean") {
				return {
					spec: spec,
					value: data
				}
			} else {
				return {
					isError: true,
					error: "Non-boolean for boolean spec",
					spec: spec,
					value: data
				}
			}


			case "option":
				console.log("OPTION", data, spec)
				// There are several options for this data type, which one is it?
				

				let selectedKey, selectedProcess
				let processed = mapObjectToArray(spec.options, (subspec, key) => {
					
					let p = this.expand(subspec, data)
					console.log(p)
					if (!p.isError) {
						console.log("Matching!");
						selectedKey = key
						selectedProcess = p
					}
				});

			

				return {
					optionDetected: selectedKey,
					subspec: selectedProcess,
					spec: spec,
				
				}
				break

			case "array":
				if (typeof data === "object" && Array.isArray(data)) {
				return {
					items: data.map(item => this.expand(spec.of, item)),
					spec: spec,
				}

			}
			return {
					isError: true,
					error: "Non-array for array spec",
					spec: spec,
					value: data
				}
							
			break
			case "dictionary":
				if (typeof data === "object" && !Array.isArray(data)) {
				return {
					items: mapObject(data, item => this.expand(spec.of, item)),
					spec: spec,
				}

			}
			return {
					isError: true,
					error: "Non-dictionary for dictionary spec",
					spec: spec,
					value: data
				}
							
			break

			case "custom":
				let subspec = this.getSpec(spec.customID)
				// console.log("CUSTOM", spec, subspec)
				// Recurse to parse this as whatever the subtype is
				
				return {
					spec: spec,
					subspec: this.expand(subspec, data)
				} 
			break;
			default: 
			console.warn("non-implemented spec:", spec);
			return {
				isError: true,
				error: "non-implemented spec:" + spec.type,
				spec: spec,
				value: data
			}
			break;
		}

	}



	let ruleOptions = {
		single: "string",
		array: "array of RuleSet",
		ruleSwitch: "{rulesetType:'ruleSwitch', rulesetSwitch:RuleSet, rulesetOptions:dictionary of RuleSet}",
	}

	let testSpec = new ErySpec({
		id: "traceryOG",
		origin: "Grammar",
		types: {
			"Grammar": "{author:string,foo:number,newTracery:boolean,version:string,rules:RuleDictionary}",
			"RuleDictionary": "dictionary of TopRuleSet",

		// A ruleset might be one of several different options
		"RuleSet": {
			"default": "single",
			randomOptions: ["single"],
			"options": ruleOptions

		},
		"TopRuleSet": {
			"default": "single",
			randomOptions: ["ruleSwitch", "ruleSwitch", "ruleSwitch", "array"],
			"options": ruleOptions

		}
	}
});



	function initEditor() {
		console.log("init editor");
		let raw = testSpec.createRandomRawData(testSpec.originSpec);
	// testSpec.createEditor("#main-cols")


	new Vue({
		el: "#rawdata",
		template: "<ery-rawview :raw='raw'></ery-rawview>",
		data: {
			raw: raw
		}
	});



	let parsed = testSpec.expand("Grammar", raw);
	console.log(parsed)



	new Vue({
		el: "#parseddata",
		template: "<ery-dataview :data='data'></ery-dataview>",
		data: {
			data: parsed
		}
	});
}