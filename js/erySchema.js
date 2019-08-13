// A schema for a particular Ery language (tracery, chancery or yet-to-be-written languages)
// The schema has a json structure of nested entities, some of which may be parsable strings
// Parsable strings are parsed with a "parse context", a nestable syntax specifying how to parse that section of string
// Ery data will have some lists of unique keys that represent elements in the data 
// (ie, mods and symbol names in tracery, state names in Chancery), 
// we may want to validate/highlight/etc those more clearly than a general-purpose validator like AJV does

// Given a raw form of the schema, expand into a language object
function ErySchema(rawSchema) {
	this.keyTypes = rawSchema.keyTypes
	this.textTypes = rawSchema.textTypes

	this.customTypes = mapObject(rawSchema.customTypes, parseEryTypeSpec)
	this.parseContexts = mapObject(rawSchema.parseContexts, context => {

	})

	this.vueComponents = rawSchema.vueComponents
}

// Output this as a JSON schema 
//(provides fast n fancy error checking, 
// more general than this (ie, no dict vs obj, key lists, etc)
ErySchema.prototype.toJSONSchema = function(spec, lastContext) {


}

// Create raw data for this type
ErySchema.prototype.generateData = function(spec, lastContext) {
	console.log("generate data", spec)
	
	let context = {
		level: 0
	}

	if (lastContext) {
		context.level = lastContext.level +1
		context.specID = lastContext.specID,
		context.generatedKeys = lastContext.generatedKeys
	} else {
		// Create some keys
		context.generatedKeys = this.generateAllKeys()
	}

	// Get the spec for this type of data
	if (typeof spec === "string") {
		context.specID = spec
		spec = this.customTypes[spec]
	}


	
	switch(spec.type) {

		case "object": 
			return mapObject(spec.properties, (prop, key) => {
				if (!prop.isOptional || Math.random() > .1) {
					let val = this.generateData(prop.type, context)
					console.log(key, val)
					return val
				}
				return undefined
			})

		case "array": 
			// How many should we generate?
			let count = this.getCount(context)
			let arr = []

			for (var i = 0; i < count; i++) {
				arr[i] = this.generateData(spec.componentType, context)
			}
			return arr;

		case "dictionary": 
			// Are there already keys for this dictionary?
		
			let keys = spec.keyType?context.generatedKeys[spec.keyType] : this.generateRandomKeys(context)
			if (spec.keyType && !context.generatedKeys[spec.keyType]) {
				console.warn("Missing generated keys for ", spec.keyType)
			}
			let dict = {}
			console.log(spec.keyType, keys)
			
			keys.forEach(key => dict[key] = this.generateData(spec.componentType, context))
			console.log(dict)
			return dict;

		case "choice": 
			let option = getRandom(spec.options)
			return this.generateData(option, context)
			// return "foo"

		case "function": 
			// return (s) => s
			return "FXN"

		case "number": 
			if (spec.subdata === "int")
				return Math.floor(Math.random()*Math.random()*Math.random()*9999);
			return Math.random()*Math.random()*Math.random()*9999;

		case "string": 
			// Generate some type of stringÏ
			if (spec.subdata) {
				return this.generateString(spec.subdata, context);
			}
			return "UNDEFINED STRING TYPE";

		default: 
			if (spec.isCustom)
				return this.generateData(spec.type, context)

			console.warn("not implemented: " + spec.type)
			
			break;
		}


	}
ErySchema.prototype.generateRandomKeys = function(context) {
	let count = Math.floor(Math.random() *Math.random()*8 + 1)
	let keys = []
	for (var i = 0; i < count; i++) {
		keys.push(utilities.words.getRandomWord())
	}
	return keys
}


ErySchema.prototype.generateAllKeys = function() {
	// Create all necessary keys for a generated data

	let allKeys = mapObject(this.keyTypes, type => {
		let count = type.generateCount()
		let keys = []
		for (var i = 0; i < count; i++) {
			keys.push(type.generate())
		}
		return keys
	})
	console.log(allKeys)
	return allKeys
}

ErySchema.prototype.getCount = function(context) {

		let maxCount = Math.max(0, 20 - context.level)
		return Math.floor(Math.min(maxCount, Math.random()*Math.random()*20)) + 1

}

ErySchema.prototype.generateString = function(type, context) {

	if (type === "uid")
		return utilities.words.getRandomID()
	if (type === "username")
		return utilities.words.getUserName()
	if (type === "date") {
		let date = new Date(Date.now() +  Math.random() * 100000)
		return date.toString()
	}

	if (this.textTypes[type])
		return this.textTypes[type](context)



	return utilities.words.getRandomTitle()
}


// Annotate data of this type
ErySchema.prototype.annotateData = function(dataType, data) {
	let baseType = dataType

	if (typeof dataType !== "string") {
		// Subtype may be the parse type ("tracery") or the container
		baseType = dataType.baseType
	}

	// is the type a string (type id) or an object (type:"string",parseType:"tracery")

	// Each custom type is either a selection (String, number), a container (array of Foo), 
	//   an object (foo:number,bar:string), or a base type (number, string(parseType))


	let annotated = {
		errors: []
	}

	let wrongType = false


	if (baseType === "array") {
		if (!Array.isArray(data)) {
			annotated.errors.push(`Expected type:array, got type:${typeof data }`)
			wrongType = true
		}
	} else if (baseType === "object" || baseType === "dictionary") {
		if (typeof data != baseType) {
			annotated.errors.push(`Expected type:object, got type:${typeof data }`)
			wrongType = true
		}
	} else if (baseType !== "choice" && baseType !== "constant") {
		if (typeof data != baseType) {
			annotated.errors.push(`Expected type:${baseType}, got type:${typeof data }`)
			wrongType = true
		}
	}

	if (!wrongType) {
		switch(baseType) {
			// Check any subrequirements
			case "function": break;
			case "number":break;
			case "boolean":break;
			case "string":
				// Regular expression
				// Parse type
				break;

				case "dictionary": 
				annotated.items = mapObject(data, item => this.annotate(dataType.itemType, item))
				break;


				case "array": 
				annotated.items = data.map(item => this.annotate(dataType.itemType, item))

				break;
				case "object": 
			// Check all dictionary entries
			let keys = forKeyIntersection(data, dataType.properties, fxn0, fxnBoth, fxn1);

			break;
			case "choice": break;

		}

	}
}

//============


function parseEryTypeSpec(rawType) {
	let baseTypes = ["string", "function", "number", "boolean"]

	let spec = {}

	let sections = rawType.split(",")
	if (sections[0].includes(":")) {
		spec.type = "object"
		spec.properties = {}
		sections.forEach(s => {
			let [key, val] = s.split(':').map(s2 => s2.trim());
			let isOptional = false
			if (key[0] === "*") {
				key = key.substring(1)
				isOptional = true
			}
			spec.properties[key] = {
				type: parseEryTypeSpec(val),
				isOptional: isOptional
			}
		})

	} else if (sections.length > 1) {
		spec.type = "choice"
		spec.options = sections.map(parseEryTypeSpec)

	} else {

		let [type, componentType] = rawType.split(" of ").map(s2 => s2.trim());
		
		let typeSections = splitProtected(type)
		spec.type = typeSections.unprotected[0]
		
		
		if (componentType) {
			spec.keyType = typeSections.protected[0]
			spec.type = spec.type.toLowerCase()
			spec.componentType = parseEryTypeSpec(componentType)
		} else {
			if (!baseTypes.includes(spec.type))
				spec.isCustom = true
			spec.subdata = typeSections.protected[0]
		}
	}

	return spec
}

function splitProtected(s, openChar = "(", closeChar = ")") {

	let protected = false
	let sections = {
		protected : [],
		unprotected: []
	}
	let start = 0
	while (start < s.length) {
		
		if (protected)  {
			// Get the closing character
			let i = s.indexOf(closeChar, start)
			if (i >= 0) {
				// Close the previous section
				sections.protected.push(s.substring(start, i))
				start = i + 1
				protected = false
			} else {
				// No more protected sections
				sections.protected.push(s.substring(start))
				start = s.length
			}
		} else {
			// Get the opening character
			let i = s.indexOf(openChar, start)

			if (i >= 0) {
				// Close the previous section
				sections.unprotected.push(s.substring(start, i))
				start = i + 1
				protected = true
			} else {
				// No more protected sections
				sections.unprotected.push(s.substring(start))
				start = s.length
			}

		}
	}
	return sections
}

