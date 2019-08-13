// The most common tracery action is expanding&flattening a rule using some grammar
// There are two ways to do this, use the grammar, or call tracery.flatten


// Boilerplate from https://www.davidbcalhoun.com/2014/what-is-amd-commonjs-and-umd/
(function (root, factory) {

	if (typeof define === 'function' && define.amd) {
		// AMD
		define(['jquery', 'underscore'], factory);
	} else if (typeof exports === 'object') {
		// Node, CommonJS-like
		module.exports = factory();
	} else {
		// Browser globals (root is window)
		root.tracery = factory();
	}
}(this, function () {

	//======================================================================
	//======================================================================
	// Parsing raw tracery syntax
	
	function parseAddress(s) {

		// TODO actual addresses
		let pathSegments = s.split("/")
		let isPath = (pathSegments.length > 1)
	
		if (isPath) {
			// Todo check for empty first segment, otherwise is ...wrong
			pathSegments = pathSegments.slice(1)
		}

		return {
			type: trType.ADDRESS,
			raw: s,
			isBasicAddress: true,
			isPath: isPath,
			data: {
				pathSegments: s
			}
		}

		// return {
		// 	type: trType.ADDRESS,
		// 	raw: s,
		// 	isPath: isPath,
		// 	data: {
		// 		// TODO, do proper protection
		// 		pathSegments: pathSegments.map(s2 => parseRule(s2, true))
		// 	}
		// }
	}

	function parseModifier(s) {
		// TODO parameters

		return {
			type: trType.MODIFIER,
			raw: s,
			data: {
				address: parseAddress(s),
				parameters: []
			}
		}
	}

	// 
	function parseTag(s) {
		let sections = s.split(".")

		return {
			type: trType.TAG,
			raw: s,
			data: {
				address: parseAddress(sections[0]),
				modifiers: sections.slice(1).map(m => parseModifier(m))
			}
		}
	}

	function parseRule(s, isInner) {

		return {
			raw: s,
			type: isInner? trType.INNER_RULE: trType.OUTER_RULE,
			data: {sections: s.split("#").map((section, index) => {
				if (index%2 == 0) {

						// Text
						return {
							raw: section,
							type:trType.PLAINTEXT,
							data: section
						}
					} else {
						return parseTag(section)
					}
				}).filter(section =>  section.type !== trType.PLAINTEXT || section.raw.length > 0)
			}
		}

	}

	//======================================================================
	//======================================================================
	// Node types
	
	const trType = {
		PLAINTEXT: "plaintext",
		OUTER_RULE: "outerRule",
		INNER_RULE: "innerRule",
		TAG: "tag",
		ADDRESS: "address",
		MODIFIER: "modifier",
		ACTION: "action",
		RG: "rg",

	};


	// Take a raw JSON grammar
	// and expand it fully?
	function TraceryGrammar(raw) {
		this.symbols = raw
	}
	
	function getRulesetAtAddress(context, address) {
		if (address.isPath) {
			console.warn("No implementation for path addresses yet:", address.pathSegments)
			return "[[/" + address.pathSegments.join("/") + "]]"
		} else {
			key = address.pathSegments[0]
			// TODO dynamic paths

			if (context.overlay && context.overlay[key]  && context.overlay[key].length > 0) {
				console.log("OVERLAY FOUND for " + key + ":", context.overlay[key])
				overlayStack = context.overlay[key]

				// Get the top ruleset on the stack
				return overlayStack[overlayStack.length - 1]
			} else {
				return context.grammar.symbols[key]
			}
		}

		console.log("GET AT", context, address)
	}

	TraceryGrammar.prototype.expand = function(raw) {
		// Given a rule, 

		let context = {	
			random: Math.random,
			grammar: this,
			lockedNodes: [],
			expansionDelay: 300,

		}

		let root = new TraceryNode({depth:0, isRoot:true}, parseRule(raw))

		// Save the root
		context.root = root;

		root.expand(context).then(() => console.log("DONE"))
		
		return root
	}

	TraceryGrammar.prototype.flatten = function(raw) {
		let root = this.expand(raw)
		return root.final
	}

	TraceryGrammar.prototype.getRuleSet = function(key) {
		return this.symbols[key]
	}


	let nodeCount = 0
	// A tracery node is a set of instructions to do something:
	// Tag: look up a ruleset, pick one, expand it, and apply modifiers
	// Modifier: look up a modifier, expand parameters, apply the fxn to a value
	// Push: look up a symbol name e.g


	function TraceryNode(parent, template) {
		this.parent = parent
		this.depth = parent.depth + 1

		this.currentTask = undefined
		this.isActivelyExpanding = false
		this.isExpanded = false
		this.final = ""

		this.raw = template.raw
		this.type = template.type
		this.tasks = []	
		this.id = this.type + "_" + nodeCount
		nodeCount++

		// Save the template for later use
		this.template = template

		// Construct the set of tasks for this node type
		switch(this.type){
			case trType.OUTER_RULE:
			case trType.INNER_RULE:
				
				// for each section, create a task to expand it
				this.tasks = template.data.sections.map((section, index) => {
					return {
						label: "expand section " + index,
						taskID: this.id + "_expandsection_" + index,
						child: new TraceryNode(this, section)
					}
				})

				// Add a final compile step
				this.tasks.push({
					label: "concat!",
					actionID: "rule_compile",
					action: () => {
						console.log("Concat rule")
						this.final = "[[TEST]]"
					},
					taskID: this.id + "_compile",
				})

				break;

			case trType.TAG:
				this.ruleset = undefined
				this.selectedRule = undefined
				this.address = new TraceryNode(this, this.template.data.address)

				this.tasks = [{
					actionID: "tag_expandaddress",
					label: "expand the address",
					taskID: this.id + "_expandaddress",
					child: this.address
					// action: (task) => {
					// 	this.address = 
					// 	context.getAtAddress(this.address)
					// },
				}, {
					actionID: "tag_getruleset",
					action: (context, task) => {
						console.log("GET RULESET AT ", this.address)
						this.ruleset = getRulesetAtAddress(context, this.address)
						console.log("RULESET:" + this.ruleset)
					},
					label: "get the ruleset",
					taskID: this.id + "_getruleset",
				}, {
					action: (context, task) => {
						console.log("SELECT RULE FROM", this.ruleset)
						this.selectedRule = getRandom(this.ruleset)
						console.log("SELECTED", this.selectedRule)
					},
					actionID: "tag_selectrule",
					label: "select a rule",
					taskID: this.id + "_selectrule",
				},  {
					label: "expand Address",
					actionID: "tag_expandrule",
					taskID: this.id + "_expandrule",
				}]

				break;
			
			case trType.ADDRESS:
				// Get all the sections of the path, dynamic and non
				this.isPath = template.isPath
				if (template.isBasicAddress) {

					this.tasks = []
					this.pathSegments = [template.raw]
				} else {	
					this.tasks = template.data.pathSegments.map((section, index) => {
						return {
							action: "addr_expandpathsection",
							index: index,
							label: "expand a path section",
							taskID: this.id + "_expandpathsection_" + index,
							taskIndex: index,
							child: new TraceryNode(this, section)
						}
					})
				}
				return;

			case trType.PLAINTEXT:
				console.log("SET FINAL VALUE:" + template.data)
				// No tasks, go ahead and set the data 
				this.tasks = []
				this.final = template.data
				return;

			default: 
				console.warn("No task list for template", template)
		}

		this.tasks.forEach((t, index) => t.index = index)
	}

	// Expand this node, asynchronously if necessary
	TraceryNode.prototype.expand = function(context) {

		let prefix = utilities.getTabSpacer(this.depth) + this.id
		
		// Do all the tasks in order
		let nextTask = new Promise((resolve, reject)=> {
			console.log(prefix + " Expand: " + this.id + " \t" + inQuotes(this.raw))
			console.log(prefix + "\tTODO:" + this.tasks.map(s => s.taskID).join(", "))
			
			this.isActivelyExpanding = true
			this.isExpanded = false

			setTimeout(() => {
				resolve(1)
			}, context.expansionDelay); // (*)
		})
		
		nextTask = this.tasks.reduce((p, task) => {
		

			return p.then(() => {
				
				this.currentTask = task

				if (task.action)
					return new Promise((resolve, reject)=> {
						setTimeout(() => {
							task.action(context, task)
							resolve(1)
						}, context.expansionDelay); // (*)	
					})
					

				// The promise of this task is either

				if (task.child) 
					return task.child.expand(context)
				if (task.asyncTask) 
					return task.asyncTask(context)
			});
			
		}, nextTask); // initial	

		// After all the tasks are finished
		nextTask.then(() => {

			this.isActivelyExpanding = false
			this.isExpanded = true
			this.currentTask = undefined
			console.log(prefix + " Finished: " + this.id)
		})

		return nextTask
	}

	
	return {
		createGrammar:  (raw) => {
			return new TraceryGrammar(raw)
		}
	}

}));