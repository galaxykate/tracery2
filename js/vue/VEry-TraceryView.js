// Show/control the ruleset
	

Vue.compon
Vue.component('tracery-node', {
	props: ["propnode"],
	data: function() {return {
		expanded: true,
		node: this.propnode
	}},
	template: `<div class="tracerynode" :class="{expansionactive:node.isActivelyExpanding,expansioncomplete:node.isExpanded}">
		<div class="header tracerynode-raw"><b>{{node.type}}</b>  {{'"' + node.raw + '"'}}</div>
		<div class="tracerynode-tasks">
			<div v-if="node.ruleset !== undefined">
				<div v-for="rule in node.ruleset" class="tracerynode-ruleset-option" :class="{selected:rule===node.selectedRule}">
					{{rule}}
				</div>
			</div>

			<div v-if="node.currentTask">
				Current task:{{node.currentTask.label}}
			</div>
			<div for v-for="task in node.tasks" class="tracerynode-task" :class="{active:node.currentTask===task}">
			<div class="header">{{task.label}}</div>
				
				<tracery-node v-if="task.child !== undefined" :propnode="task.child" ></tracery-node>
			</div>
			
		</div>
		<div class="footer tracerynode-final">{{'"' + node.final + '"'}}</div>
	</div>`,
})

Vue.component('tracery-output', {
	props: ["output", "renderAsDivs"],
	template: `<div v-if="renderAsDivs">
		<tracery-node :propnode="output"></tracery-node>
	</div>
	<div v-else>
	PLAINTEXT{{output.final}}
	</div>`,
	

})

Vue.component('tracery-preview', {
	template: `<div>
		<div class="panel"></div>
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
				<tracery-output 
					v-for="item in generatedOutputs" 
					:key="item.id" 
					:output="item"
					:renderAsDivs="true"
				></tracery-output>
			</div>
		</div>
	</div>`,

	computed: {
		generatedOutputs: function() {
			Math.seedrandom(this.seed);
			let outputs = []
			for (var i = 0; i < this.count; i++) {
				let rule = "test #animal# foo #" + this.startWord + "#"
				
				outputs[i] = grammar.expand(rule)

			}
		
			return outputs
		},
	},
	methods: {
		rerollSeed: function() {
			this.seed = utilities.words.getRandomSeed()
		}
	},
	data: function() {
		return {
			startWord: "origin",
			seed:utilities.words.getRandomSeed(),
			count: 1,
		
		}
	}

});

