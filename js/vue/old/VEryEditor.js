// Edit data

function annotatedToJSON(annotated) {
	if (annotated === undefined)
		console.warn("Undefined data")
	
	switch(annotated.templateType) {
		case "object": return mapObject(annotated.props, annotatedToJSON)
		case "dict": return mapObject(annotated.items, annotatedToJSON)
		case "array": return annotated.items.map(annotatedToJSON)
		case "choice": return annotatedToJSON(annotated.value)
		case "string":
		case "boolean":
		case "number": return annotated.value
		default: 
		if (annotated.value !== undefined)
			return annotatedToJSON(annotated.value)
		
		console.warn("no annotatedToJSON for type:", annotated.templateType)
	}
}

Vue.component('ery-componenteditor-string', {
	props: ["data", "editor"],

	template: `<div class="ery-dataview-string" :class="{'ery-dataview-editablestring':editor.editMode,'ery-dataview-movablestring':!editor.editMode}" contenteditable  v-text="currentValue"  @keydown.enter.prevent @input="newEntry($event)" @blur="saveNewValue($event)" @mousedown="mouseDown"></div>`,

	data: function() {
		return {
			currentValue: this.data.value
		}
	},

	methods: {
		mouseDown: function() {
			console.log("Mouse down")
			if (!this.editor.editMode) {
				this.editor.held = this.data
			}
			
			else {
				this.$parent.click()
			}
		},
		
		newEntry: function(ev) {
			// Use a placeholder value to keep contenteditable from reseting the cursor position.
			// Downside: no auto update if the rule text is changed externally (but I also don't expect that to happen)
			this.data.value = ev.target.innerHTML
		},
		saveNewValue: function(ev) {
			console.log("Re-evaluate")
		}
	}

})

Vue.component('ery-componenteditor', {
	props: ["data", "editor"],

	// What kind of data is this?
	// number: slider
	//  <input v-if="inEditMode" v-model="data.value"/>
	template: `

	<div class="ery-dataview" :class="classObj" @click="click">
	
	<div v-if="editor.held==data">TEMP</div>

	<ery-componenteditor-string :editor="editor" :data="data" v-else-if="data.templateType=='string'"></ery-componenteditor-string>

	<ery-componenteditor-string :editor="editor" :data="data"  v-else-if="data.templateType=='number'"></ery-componenteditor-string>
	
	<input v-else-if="data.templateType=='boolean'" type="checkbox" v-model="data.value"/>

	<div v-else-if="data.templateType=='object'">
	<div class="ery-dataview-row" v-for="(val,key) in data.props">
	<div class="ery-dataview-label">{{key}}:</div>
	<ery-componenteditor  :editor="editor" :data="val"></ery-componenteditor>
	</div>
	</div>


	<div v-else-if="data.templateType=='dict'">
	<div class="ery-dataview-row" v-for="(val,key) in data.items">
	<div class="ery-dataview-label ery-dataview-dictlabel">{{key}}:</div>
	<ery-componenteditor  :editor="editor" :data="val"></ery-componenteditor>
	</div>
	</div>

	<div v-else-if="data.templateType=='array'" class="ery-dataview-editablearray">

	<ery-componenteditor  :editor="editor" v-for="(val,key) in data.items" :data="val"></ery-componenteditor>
	<button v-if="inEditMode" @click="add">+</button>
	</div>

	<div v-else-if="data.templateType=='choice'">
	<div class="header" v-if="isSelected">
	<select @change="onChange($event)" v-model="data.selectionID">
	<option v-for="optionID in getOptions">{{optionID}}</option>
	</select>
	</div>
	<ery-componenteditor  :editor="editor" :data="data.value"></ery-componenteditor>
	</div>

	<ery-componenteditor  :editor="editor" v-else :data="data.value" :subtitle="data.templateType"></ery-componenteditor>
	

	</div>

	`,
	methods: {
		click: function() {
			console.log("CLICK")
			// this.inEditMode = !this.inEditMode

		},
		add: function() {
			console.log("Add ", this.data.template.componentType)

			let newItem = this.data.erySpec.generateData(this.data.template.componentType)[0]
			console.log(newItem)
			this.data.items.push(newItem)
		},
		edit: function() {
			this.inEditMode = true
		},
		onChange: function(event) {
			console.log("change selection to ", event.target.value)

           	// Save the data of 
           	console.log(this)

           	this.data.value = this.data.erySpec.generateTemplate(event.target.value, {})

            // Change this to a different selected template
            // and reroll/revalidate the data
            console.log(this.data.selection)
            console.log(this.data.value)

        }
    },

    data: function() {
    	return {
    		isSelected:false,
    		inEditMode: true,
    	}
    },

    computed: {


    	getOptions: function() {

    		return this.data.template.options.map(option => option.type)
    		return ["foo", "bar"]
    	},

    	classObj: function() {
    		let obj = {}
    		obj["ery-dataview-" + this.templateType] = true
    		return obj
    	},
    }
})