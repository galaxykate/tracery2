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

		// TODO: path addresses
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
	// Expansion context
	

	function TraceryExpansionContext(grammar) {
		this.grammar = grammar
		this.overlay = {}
		
		// Maintain a list of tasks, this lets us step through each task
	

	}

	// Select rule
	TraceryExpansionContext.prototype.selectRule = function(node, ruleset, callback) {
		if (Array.isArray(ruleset)) {
			let selected = getRandom(ruleset)
			callback(selected)
		} else {
			console.warn("Non-array ruleset", ruleset)
			callback("[[Non-array rules]]")
		}

	}

	TraceryExpansionContext.prototype.getRulesetAtAddress = function(node, address, callback) {
		console.log(node, address)
		if (address.isPath) {
			console.warn("No implementation for path addresses yet:", address.pathSegments)
			callback("[[/" + address.pathSegments.join("/") + "]]")
		} else {
			console.log("ADDRESS", address)
			let key = address.pathSegments[0]
			// TODO dynamic paths

			if (this.overlay && this.overlay[key]  && context.this[key].length > 0) {
				console.log("OVERLAY FOUND for " + key + ":", this.overlay[key])
				overlayStack = this.overlay[key]

				// Get the top ruleset on the stack
				callback(overlayStack[overlayStack.length - 1])
			} else {
				let grammarRules = this.grammar.getRuleSet(key)
				console.log("Rules for key '" + key + "': ", grammarRules)
				callback(grammarRules)
			}
		}
	}

	//------------------------------------------------
	
	let expansionCount = 0
	let taskCount = 0
	function TraceryExpansionTask(node, label, settings) {
		this.idNumber = taskCount++
		this.id = "TASK_" + this.idNumber
		this.node = node
		this.label = label
		
		this.prefix = utilities.getTabSpacer(node.depth) + "(" + node.id + ")"
		this.expandChild = settings.expandChild
		this.action = settings.action

		this.isComplete = false
		this.isInProgress = false
	}
	

	// An iterator that walks through the expansion tree,
	// doing all the tasks that need doing for each node expansion
	function TraceryExpansion(context, rootTemplate, callback) {
		this.id = "EXP-" + (expansionCount++)

		this.context = context

		this.tasks = []
		this.taskIndex = -1
		this.currentTask = undefined
		
		// create a root
		this.root = new TraceryNode({
			depth: 0,
			expansion: this,
		}, rootTemplate)


		this.enqueueNode(this.root)
		
		
	}



	// Do all of the tasks associated with this node. 
	// When all the tasks are complete, do callback
	TraceryExpansion.prototype.enqueueNode = function(node) {
		

		console.log("\n\nENQUEUE " + node.id)
		
		// Queue up all the tasks for this node

		// this.tasks = this.tasks.concat(node.tasks)

		// Splice the tasks at the current task index
		let tasks = node.tasks.slice(0)
			

		// When all this node's tasks are finished, call the node-complete callback
		// this.{
		// 	label: "finish " + node.id,
		// 	action: (context, task, callback) => {
		// 		console.log("Completed node: " + node.id)
		// 		callback()
				
		// 	}
		// })	

		let spliceIndex = this.taskIndex + 1
		console.log("	Node tasks: " + node.tasks.map(t => t.label).join(", "))

		tasks.forEach(task => { 
			this.tasks.splice(spliceIndex, 0, task)
			spliceIndex++
		})
		console.log("Current queue:\n" + this.tasks.map((t, index) => index + ": " + t.prefix + t.label).join("\n"))
		this.checkTaskQueue()
	}

	// Given a node, lock its ruleset to a particular value, and reroll
	TraceryExpansion.prototype.lockNodeToRule = function(node, rule) {

		console.log("Lock node " + this.id + " to rule '" + rule + "'")
		node.selectedRule = rule;
		node.isLocked = true

		//this.enqueueNode(node)
		//this.checkTaskQueue()
	
	}

	TraceryExpansion.prototype.checkTaskQueue = function() {
		console.log("check task queue: " + this.taskIndex + "/" + this.tasks.length)
		
		if (this.currentTask == undefined && !paused) {
			// Get the next task
			this.taskIndex += 1
			let task = this.tasks[this.taskIndex]
			this.currentTask = task
		
			if (this.taskIndex >= this.tasks.length) {
				console.log("Completed all tasks in queue")
			}
			else {
				// Start this task
				this.doTask(this.currentTask, () => {
					// Delay the task completion
					setTimeout(() => {
						// Finish that task
						this.currentTask = undefined
						this.checkTaskQueue()
					}, 200) 
					
				})
			}
		} 
		else {
			// Queue is busy
		}
	}
	

	// Do a task, which may be an asynchronous task, or enqueuing 
	TraceryExpansion.prototype.doTask = function(task, callback) {
	
		
		console.log("TASK START: (" + task.node.id + ") " + task.label)
		task.isInProgress = true

		let partialCallback = () => {
			task.isComplete = true
			task.isInProgress = false
			console.log("TASK FINISH: (" + task.node.id + ") " + task.label)
			callback()
		}
		
		if (task.action) {
			console.log("   do action for: " + task.label)
			task.action(this.context, task, partialCallback)
		} else {

			if (task.expandChild) {
				let child = task.expandChild
				if (typeof child === "string")
					child = task.node[child]
				console.log("EXPAND CHILD: " + child.id)

				this.enqueueNode(child)
				partialCallback()
			}
			else 
				partialCallback()
		}
			// console.log("   no action")
		// 	setTimeout(() => {
			
			
			
		// 	partialCallback()
		// }, 500)
		// }

		
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


	TraceryGrammar.prototype.expand = function(startRule, callback,  context = new TraceryExpansionContext(this)) {
		if (typeof startRule === "string")
			startRule = parseRule(startRule)	
		
		let expansion = new TraceryExpansion(context, startRule, callback)

		return expansion
	}

	TraceryGrammar.prototype.getRuleSet = function(key) {
		return this.symbols[key]
	}


	let nodeCount = 0
	// A tracery node is a set of instructions to do something:
	// Tag: look up a ruleset, pick one, expand it, and apply modifiers
	// Modifier: look up a modifier, expand parameters, apply the fxn to a value
	// Push: look up a symbol name e.g


	function TraceryNode(parent, template, originatingTask) {

		this.parent = parent
		this.depth = parent.depth + 1
		this.expansion = parent.expansion


		this.final = ""

		this.raw = template.raw
		this.type = template.type
		this.idNumber = nodeCount++
		this.id = this.type + "_" + this.idNumber

		this.isActive = false
		this.isComplete = false
		
		this.tasks = []

		// Construct the set of tasks for this node type
		// The structure of subnodes *doesn't* depend on internal expansions
		// 

		this.addTask("start " + this.id, {
			action: (context, task, callback) => {
				console.log("ACTIVATE:", this.id)
				this.isActive = true
				callback()
			}
		})

		switch(this.type){
			case trType.OUTER_RULE:
			case trType.INNER_RULE:
				this.sections = template.data.sections.map(section => new TraceryNode(this, section))

				// for each section, create a task to expand it
				template.data.sections.map((section, index) => {
					this.addTask("expand section ", {
						expandChild: this.sections[index]
					})
				})

				// Add a final compile step
				this.addTask("concat!", {
					action: (context, task, callback) => {
						
						this.final = this.sections.map(s => s.final).join("")
						console.log("FINAL VALUE FOR RULE '" + this.raw + "' => '" +  this.final + "'")
						callback()

					}
				})

				break;

			case trType.TAG:

				this.addressNode = new TraceryNode(this, template.data.address)

				// Information we don't have yet (initialize so that we can track in Vue)
				this.ruleNode = undefined
				this.ruleset = undefined
				this.selectedRule = undefined
				this.modifiers = []
				this.initialValue = "[[initialvalue]]"
				this.currentValue = "[[currentvalue]]"
				this.modifiedValues = []

				this.addTask("expand the address", {
						expandChild: this.addressNode
					})

				this.addTask("get the ruleset", {
					action: (context, task, callback) => {
						console.log("Address node", this.addressNode)
						context.getRulesetAtAddress(this, this.addressNode, (ruleset) => {
							this.ruleset = ruleset
							console.log("Ruleset found!", this.ruleset)
							callback()
						})
					},
				}),

				this.addTask("select a rule", {
					action: (context, task, callback) => {
						if (this.isLocked) {
							// Don't reselect the rule, just return
							callback()
						}
						else {
							context.selectRule(this, this.ruleset, (rule) => {
								this.selectedRule = rule
								console.log("Rule selected! ", this.selectedRule)
								callback()
							})
						}
					},
				}),

				this.addTask("create the selected rule node", {
					action: (context, task, callback) => {

						let ruleTemplate = this.selectedRule
						if (typeof ruleTemplate === "string")
							ruleTemplate = parseRule(ruleTemplate)

						this.ruleNode = new TraceryNode(this, ruleTemplate, task)
						callback()
					}
				}),

				this.addTask("expand the selected rule", {
					expandChild: "ruleNode"
				}),
				
				this.addTask("get the rule value", {
					action: (context, task, callback) => {
						console.log("FINISHED RULE NODE:", this.ruleNode.final)
						this.initialValue = this.ruleNode.final
						this.currentValue = this.initialValue
						callback()
					},
				})
		


				// Add any modifier tasks
				template.data.modifiers.forEach((mod, index) => {
					this.addTask("expand a modifier", {
						action: (context, task, callback) => {
							// Create a modifier node, and 
							this.modifiers[index] = new TraceryNode(this, mod, task)
							context.expand(this.modifiers[index], callback)
						},
					})
					this.addTask("apply a modifier", {
						action: (context, task, callback) => {
							// This modifier may be asynchronous!
							let currentValue = this.modifiedValues[this.modifiedValues.length - 1]
							let mod = this.modifiers[index]
							console.log("apply modifier", mod, " to value ", currentValue)
							context.applyModifier(mode, currentValue, callback)
							
						},
					})
				})

				this.addTask("set the final value", {
					action: (context, task, callback) => {
						this.final = this.currentValue
						console.log("Final tag value: " + this.currentValue)
						callback()
					},
				})

				break;
			
			case trType.ADDRESS:
				// Get all the sections of the path, dynamic and non
				this.isPath = template.isPath

				if (template.isBasicAddress) {
					this.pathSegments = [template.raw]
					console.log("PATH SEGMENTS:", this.pathSegments)
				} else {	
					console.warn("complex path not implemented")
				}

				// Add a final task to get the data at this address
				this.addTask("set the path", {
					action: (context, task, callback) => {
						console.log("Set the final path segments: ", this.pathSegments)
						this.final =  this.pathSegments.join("/")
						callback()
					},
				})

				break

			case trType.PLAINTEXT:
				this.final = template.data
				break;

			default: 
				console.warn("No task list for template", template)
		}

		this.addTask("finish " + this.id, {
			action: (context, task, callback) => {
				this.isActive = false
				this.isComplete = true
				callback()
			}
		})
		
	}


	TraceryNode.prototype.addTask = function(label, settings) {

		let task = new TraceryExpansionTask(this, label, settings)
		this.tasks.push(task)
	}
	
	return {
		createGrammar:  (raw) => {
			return new TraceryGrammar(raw)
		}
	}

}));