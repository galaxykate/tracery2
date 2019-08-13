
// A component for a full-page app
Vue.component('ery-editorapp', {
	props: ["appdata"],
	// Three columns
	template: `<div class="app">
	<div class="app-columns">
	<div v-if="showEditor" class="column ery-editor-column"><ery-filemanager :appdata="appdata"></ery-filemanager><ery-editor  :appdata="appdata"></ery-editor></div>
	<div class="column ery-editor-column"><ery-view  :appdata="appdata"></ery-view></div>
	</div>
	</div>`,
	data: function() {
		return {
			showEditor: true
		}

	}
})


// A component for a full-page app
Vue.component('ery-filemanager', {
	props: ["appdata"],
	template: `<div class="panel">
	<div class="header">files</div>
	
	<div class="content">Ery:{{appdata.spec.id}}
	</div>
	</div>`
})


// A component for a full-page app
Vue.component('ery-editor', {
	props: ["appdata"],
	template: `<div class="panel ery-editor-panel">
	<div class="header">editor</div>

	<div class="content">
	<ery-componenteditor v-if="showAnnotated" :data="appdata.annotatedData" :editor="appdata.editorData"></ery-componenteditor>
	<textarea class="ery-editor-jsonview">{{jsonData}}</textarea>
		
	</div>
	</div>`,
	data: function() {
		return {
			showAnnotated: false
		}
		
	},
	computed: {
		jsonData: function()  {
			return annotatedToJSON(this.appdata.annotatedData);
		}
	}
})


// A component for a full-page app
Vue.component('ery-view', {
	props: ["appdata"],
	template: `	

	<tracery-view :rawgrammar="jsonData" :count="5"></tracery-view>
	`,
	computed: {
		jsonData: function()  {
			return annotatedToJSON(this.appdata.annotatedData);
		}
	}
})

Vue.component('tracery-view', {
	props: ["rawgrammar"],
	template: `<div>
	<div class="header">
	<div class="header-main">Tracery</div><div class="header-controls">
	<select  v-model="originKey"><option v-for="origin in originKeys" >{{origin}}</option></select>
	<select  v-model="count"><option v-for="count in counts">{{count}}</option></select>
	<button v-bind:class="{'ery-togglebutton':true,'istoggled':htmlMode}" @click="htmlMode = !htmlMode">htmlMode</button>
	<button v-bind:class="{'ery-togglebutton':true,'istoggled':seedUI}" @click="seedUI=!seedUI">▼</button>
	<div class="tracery-seedcontrols" v-if="seedUI">
	<input  v-model="seed"></input>
	<button class="ery-togglebutton" @click="reroll">🎲</button>
	<button class="ery-togglebutton" @click="previousSeed">⬅</button>
	<button class="ery-togglebutton" @click="nextSeed">➡︎</button>
	</div>
	</div>
	</div>

	<div class="content">

	<div v-if="htmlMode">
	<div class="tracery-expansion tracery-expansion-html" v-for="expansion in expansions" v-html="expansion"></div>
	</div>

	<div v-else>
	<div class="tracery-expansion" v-for="expansion in expansions" v-text="expansion"></div>
	</div>

	</div>
	</div>`,

	data: function() {
		console.log("CREATE DATA", this.rawgrammar)

		return {
			seed: "",
			htmlMode: false,
			randomRoll: false,
			seedUI: true,
			seedStack: [utilities.words.getRandomSeed(10)],
			seedIndex : 0,
			count: 5,
			originKey: this.rawgrammar.rules["origin"]?  "origin" : getRandom(Object.keys(this.rawgrammar.rules))
		}
	},	
	methods: {
		reroll: function() {
			this.seedStack[this.seedIndex] = utilities.words.getRandomSeed(10)
		},
		nextSeed: function() {
			this.seedIndex++
			if (this.seedIndex >= this.seedStack.length) {
				this.seedStack[this.seedIndex] = utilities.words.getRandomSeed(10)
			}
			
		},
		previousSeed: function() {
			this.seedIndex = Math.max(this.seedIndex - 1, 0)

		}
	},
	computed: {
		counts: function() {
			return [1, 5, 10, 25, 50]
		},
		grammar: function() {
			let grammar = tracery.createGrammar(this.rawgrammar.rules)
			
			return grammar
		},
		originKeys: function() {
			return Object.keys(this.grammar.symbols)
		},
		expansions: function() {
			this.seed  = this.seedStack[this.seedIndex]
			Math.seedrandom(this.seed)
			let keys = this.originKeys
			
			
			let expansions = []
			for (var i = 0; i < this.count; i++) {
				expansions[i] = this.grammar.flatten("#" + this.originKey + "#")
			}
			console.log(expansions)
			return expansions
			
		}
	}
})
