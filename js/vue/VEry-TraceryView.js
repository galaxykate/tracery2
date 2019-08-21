// Show/control the ruleset
	
function  nodeToStyle(node) {
	let hue = (node.idNumber*57)%360
	
	let c = "hsl(" + hue + ",50%,50%)"
	let c2 = "hsl(" + hue + ",50%,80%)"
	// c = "blue"
	let style = "color:" + c + ";background-color:" + c2

	return style
}

Vue.component('tracery-ruleset', {
	props: ["pnode"],

	data: function() {return {
		node: this.pnode,
	}},
	template: `<div class="tracerynode-ruleset">
		<div 
			class="tracerynode-ruleset-option" 
			v-for="rule in node.ruleset" 
			:class="{selected:node.selectedRule==rule}"
			@click="selectRule(rule)"
		>
			{{rule}}
		</div>
		
	</div>
	`,
	methods: {
		selectRule: function(rule) {
			this.node.expansion.lockNodeToRule(this.node, rule)
		}
	}

})

Vue.component('tracery-node', {
	props: ["pnode", "pexpansion"],
	data: function() {
		return {
			node: this.pnode,
	}},
	template: `<div :class="classObj">
		<div class="header tracerynode-raw"><div class="tracerynode-nodeid" v-bind:style="nodeToStyle(node)">{{node.id}}</div>  {{'"' + node.raw + '"'}}</div>
		<div class="content">
			<div v-if="node.sections">
				<tracery-node v-for="section in node.sections" 
					:pnode="section"
				> 
				</tracery-node>
			</div>

			<div v-if="node.type=='tag'" class="tracerynode-tagsections">
				<div class="tracerynode-innersection">
					<div class="tracerynode-subheader">address:</div>
					<tracery-node 
						:pnode="node.addressNode"
					>
					</tracery-node>
				</div>
				<div class="tracerynode-innersection">
					<div class="tracerynode-subheader">ruleset:</div>
					<tracery-ruleset 
						:pnode="node" 
					></tracery-ruleset>
				</div>
				<div class="tracerynode-innersection">
					<div class="tracerynode-subheader">rule:</div>
					<tracery-node
						v-if="node.ruleNode !== undefined"
						:pnode="node.ruleNode" 
					>
					</tracery-node>
				
				</div>
			</div>

		</div>
		<div class="footer tracerynode-final">{{'"' + node.final + '"'}}</div>
	</div>`,
	methods: {
		nodeToStyle: nodeToStyle,
		
	},
	computed: {
		classObj: function() {
			let obj = {
				tracerynode: true
			}
			obj["tracerynode-" + this.node.type] = true
			obj.iscomplete = this.node.isComplete
			obj.inprogress = this.node.isActive
			console.log("OBJ", obj)
			return obj
		}
	},
	created: function() {
		// console.log(this.node.id, this.node.expansion)
	}
})

Vue.component('tracery-expansiontrackertask', {
	props: ["ptask", "pexpansion"],
	data: function() {
		return {
			task: this.ptask,
			expansion: this.pexpansion
		}
	},

	// <span v-if='task.isComplete'>complete</span>
	// 		<span v-if='task.isInProgress'>active</span>
	// 		<span v-if='task===expansion.currentTask'>current</span>
	template: `
	<div :class="classObj">
		<div class="tracery-expansiontask-node" 
			v-bind:style="nodeToStyle(task.node)">

			{{task.node.id}}:
			
			
		</div>
		<div  class="tracery-expansiontask-label">{{task.label}}</div>
		
	</div>
	`,
	computed: {
		classObj: function() {
			// return {}
			return {
				tile:true,
				"tracery-expansiontask": true,
				iscomplete:this.task.isComplete,
				inprogress:this.task.isInProgress,
				iscurrent:this.task==this.expansion.currentTask

			}
		}
	},
	methods: {
		nodeToStyle: nodeToStyle
	}
})

Vue.component('tracery-expansiontracker', {
	props: ["pexpansion"],
	data: function() {
		return {
			expansion : this.pexpansion
		}
	},
	template: `<div class="panel">
		<div class="header">
			{{expansion.id}}
		</div>

		<div class="content">
			<div class="subsection" v-if="expansion.currentTask!=undefined">
				Current task: <div class="tracery-expansiontask-node" v-bind:style="nodeToStyle(expansion.currentTask.node)">{{expansion.currentTask.label}}</div>
			</div>
			<div class="subsection">
				<tracery-node 
					:pnode="expansion.root"
				>
				</tracery-node>
			</div>
			<div class="subsection">

				<tracery-expansiontrackertask 
					v-for="task in expansion.tasks" 
					:key="task.id"
					:pexpansion="expansion" 
					:ptask="task"
				>
				</tracery-expansiontrackertask>
			</div>
		</div>

	</div>`,
	
	methods: {
		nodeToStyle: nodeToStyle
	}

})

Vue.component('tracery-preview', {
	
	template: `<div>
		<div class="panel">
			<div class="header">
				<div class="header-main">TRACERY View</div>
				<div class="header-controls">

				<button @click="rerollSeed">🎲</button>
				<select v-model="count">
				<option v-for="x in [1, 5, 10, 25]">{{x}}</option>
				
				</select>
				<input v-model="seed"></input>
				</div>
			</div>


			<div class="content">
				<div class="subsection">
				TEST: {{test}}
				</div>


				<div class="subsection">
					<tracery-expansiontracker 
						class="tracery-expansion"
						v-for="expansion in output" 
						v-if="expansion !== undefined"
						:key="expansion.id"
						:pexpansion="expansion"
					>
						
					</tracery-expansiontracker>

				</div>

			</div>


		</div>
	</div>`,

	created: function() {
		
		this.generateOutputs()
		this.test = "bar"
	},
	methods: {
		rerollSeed: function() {
			this.seed = utilities.words.getRandomSeed()

		},

		generateOutputs: function() {
			Math.seedrandom(this.seed);
			
			this.output = []
			for (var i = 0; i < this.count; i++) {
				const index = i
				let rule = "test: #" + this.startWord + "#"
				// Todo: some kind of mutex?
				this.output[index] = grammar.expand(rule, newValue => {
				
					 // this.output[index] = newValue
					 this.test = this.test  + index
					})
				 

			}
		
			
			
		}
	},
	data: function() {
		return {
			output: [],
			test: "foo",
			startWord: "origin",
			seed:utilities.words.getRandomSeed(),
			count: 1,
		
		}
	}

});

