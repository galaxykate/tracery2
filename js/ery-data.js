// Ery data structures

// Create a datastructure and editor to safely edit any kind of data

// Given an ery format, create an editor
// function EryFormat(format) {
// 	// Figure out what format this is
// 	this.mainType = format.mainType

// 	this.createEditorWidget("#test")
// }

let animals = "amoeba mongoose capybara yeti dragon unicorn sphinx kangaroo boa nematode sheep quail goat corgi agouti zebra giraffe rhino skunk dolphin whale bullfrog okapi sloth monkey orangutan grizzly moose elk dikdik ibis stork finch nightingale goose robin eagle hawk iguana tortoise panther lion tiger gnu reindeer raccoon opossum".split(" ")


function testVue() {
	Vue.component('ery-string', {

		template: `
		<div class="ery-data">
			"I'm a string"
		</div>
		`
	})
	Vue.component('ery-number', {

		template: `
		<div class="ery-data">
			"I'm a number"
		</div>
		`
	})

	Vue.component('ery-data', {
		props: ["type", "data"],
		data: function() {
			return {}
		},
		computed: {
			dynamicComponent() {
				if (this.type === "string") {
					return "ery-string"
				}
				if (this.type === "dictionary") {
					return "ery-dict"
				}
				if (this.type === "array") {
					return "ery-array"
				}
				return "ery-number"
			}
		},
		template: `
		<div class="ery-data">
			<span class=ery-console>data={{data}}</span>
			<component 
				:is="dynamicComponent"
				:data="data">
			</component>
		</div>
		`


	})

	Vue.component('ery-dictentry', {
		props: ["entryKey", "entryValue"],
		data: function() {
			return {

			}
		},
		template: `
		<div class="ery-dictentry">
			<div class="ery-dictentry-key">{{entryKey}}</div> :
			
			<div class="ery-dictentry-data">
				<ery-data 
					:type="entryValue.type" 
					:data="entryValue.data">
				</ery-data>
			</div>

		</div>
		
		`
	})

	Vue.component('ery-dict', {
		props: ["data"],
		template: `
		<div class="ery-dict">
			<div class="ery-header">Dictionary</div>
				<ery-dictentry 
					v-for="(value, key) in data" 
					v-bind:entryValue="value"
					v-bind:entryKey="key"
					v-bind:key="key">
				</ery-dictentry>
			<div class="ery-content"></div>
		</div>

		<div>
			<div class="ery-header">Dictionary</div>
				<ery-dictentry 
					v-for="(value, key) in data" 
					v-bind:entryValue="value"
					v-bind:entryKey="key"
					v-bind:key="key">
				</ery-dictentry>
			<div class="ery-content"></div>
		</div>
		`
	})


	Vue.component('ery-array', {
		props: ["data"],
		template: `
		<div class="ery-array">
			<div class="ery-header">Array</div>
				<ery-data 
					v-for="(value, index) in data" 
					v-bind:entryValue="value"
					v-bind:key="index">
				</ery-data>
			<div class="ery-content"></div>
		</div>
		`
	})


	let data = {
		"a": {
			type: "string",
			data: "apple juice"
		},
		"b": {
			type: "number",
			data: 1
		},
		"c": {
			type: "string",
			data: "coffee"
		},
		"d": {
			type: "dictionary",
			data: {
				"animals": {
					type: "array",
					data: ["anaconda", "bear", "cat"]
				},
				"fish": {
					type: "array",
					data: ["catfish", "barracuda", "dory"]
				}
			}
		},
	}

	var interface = new Vue({
		template: `
			<div>
			
				<cookieclicker></cookieclicker>
			</div>
		`,
		el: "#test",
		data: function() {
			return {
				dictData: data
			}
		},

	})
}

// EryFormat.prototype.createEditorWidget = function(holderID) {



// 	let list = ["cat", "corgi", "panda", "pangolin"]

// 	let listHolder = $("<div/>", {
// 		class: "list-holder"
// 	}).appendTo(holderID)



// 	let itemTemplate = $("<div/>", {
// 		class: "list-item  v-class='selected: isSelected'",
// 		html: "{{animal}}"
// 	}).appendTo(listHolder)

// 	itemTemplate.attr("v-for","animal in animals");
// 	itemTemplate.attr("v-on:click","select");

// 	let addButton = $("<button/>", {
// 		html: "+"
// 	}).appendTo(holderID)


// 	 addButton.attr("v-on:click","add");


// 	// Create a list
// 	var listVue = new Vue({
// 		el: holderID,
// 		data: {
// 			animals: list,
// 			show: true,
// 			seen: true,
// 			message: 'Hello Vue!',
// 			stuff:"test"
// 		},
// 		methods: {
// 			select: function() {
// 				this.isSelected = !this.isSelected
// 				console.log("select item")
// 				console.log(this)
// 			},
// 			add: function() {
// 				console.log("ADD")

// 				this.animals.push(utilities.getRandom(animals))
// 				console.log(this.animals)
// 				console.log(list)
// 			}
// 		}
// 	})



// }