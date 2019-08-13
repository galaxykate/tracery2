// A single-page app for editing Ery scripts

function createApp(el,schemaID) {

	let appData = {
		rawData : {}
	}

	// setInterval(() => {
	// 	appData.rawData.uid = utilities.words.getRandomSeed()
	// 	onUpdateJSON("interval")
	// }, 1000)

	let jsonEditor;

	function onUpdateJSON(src) {
		console.log("RAW JSON UPDATED", src)
		// Things to do when the json updates

		if (src != "jsonEditor")
			jsonEditor.set(appData.rawData);

		let parsed;
		try {
			parsed =  JSON.parse(jsonEditor.getText())
			console.log(parsed)
		}
		catch {
			console.log("INVALID")

		}

		if (parsed) {
			appData.rawData = parsed
		}
	}


	// get json


	
	Vue.component('json-editor', {
		template: '<div  class="ery-jsoneditor"/>',
		mounted: function() {
			// console.log("Mounted")

			// create the editor

			var options = {
				modes: ["code", "tree", "view", "form", "text"],
				onChangeText : function(text) {
					console.log("changed!", appData.rawData)
					onUpdateJSON("jsonEditor")
				}

			};
			// $(this.$el).append("mountend")
			jsonEditor = new JSONEditor($(this.$el).get(0), options);
			jsonEditor.set(appData.rawData);
			
		},

		beforeDestroy: function() {
			// $(this.$el).datepicker('hide').datepicker('destroy');
		}

	});



	var app2 = new Vue({
		el: '#' + el,

		// JSON/visual editor, 
		template: `<div id="ery-main-app" class="app">

		<div id="ery-editor" class="main-section panel">
		<div class="header">
		<div class="header-main">{{schemaID}} Editor</div>
		<div class="header-controls">
		<button @click="jsonMode = !jsonMode">{{editModeLabel}}</button>
		<button @click="randomizeData">🎲</button>
		<select v-model="schemaID">
		<option v-for="(schema,key) in allSchema">{{key}}</option>
		</select>
		</div>
		</div>
		<div class="content">

		<json-editor v-if="jsonMode"></json-editor>
		
		<div v-else>
		viz editor
		</div>
		</div>
		</div>

		<div id="ery-rhs" class="main-section panel">
		
		<div id="ery-viz" class="main-section panel">
		<div class="header">
		<div class="header-main">Schema preview</div>
		<div class="header-controls">
		
		</div>
		</div>
		<div class="content">
		<component v-bind:is="schema.vueComponents.preview"></component>
		</div>
		</div>

		<div id="ery-preview" class="main-section panel" v-if="showJSON">
		<div class="header">
		<div class="header-main">Raw JSON</div>
		<div class="header-controls">
		</div>
		</div>
		<div class="content">
		<pre>
		{{prettyJSON}}
		</pre>
		</div>
		</div>

		</div>

		</div>`,

		methods: {
			randomizeData: function() {
				console.log(`Generate data (seed: ${this.seed})`)
				let data = this.schema.generateData("Data")
				this.appData.rawData = data;
				onUpdateJSON("randomize")
			},
			changeLanguage: function(ev) {
				console.log("Current language: " + ev.target.value)
				this.randomizeData()
			}
		},
		computed: {

			schema: function() {
				console.log("LOAD SCHEMA", this.schemaID)
				let schema =  new ErySchema(allSchema[ this.schemaID])

				
				// this.randomizeData()
				return schema
			},

			createEditor: function() {

			},

			prettyJSON: function() {
				return JSON.stringify(this.appData.rawData, null, 2)

			},
			editModeLabel: function() {
				if (this.jsonMode)
					return "JSON"
				else 
					return "visual"
			}
		},
		data: {
			showJSON: false,
			selectedLanguage: "",
			allSchema: allSchema,
			schemaID: schemaID,
		
			appData: appData,
			jsonMode: true,
		}
	})
}