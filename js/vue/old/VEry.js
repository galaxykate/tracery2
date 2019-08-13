// Options in Ery:
// What was the origin


// One element view, for raw js data, as well as Ery specialty types
// types:
// base non-interactive types: bools, non-parsed strings, numbers, etc
// ery template types: "array of Ruleset" {erySpecType:array,erySpecComponent:Ruleset} 
// annotated data: {type:option}

Vue.component('ery-template', {
	props: ["data"],
	template: `
	<div v-if="data.type=='object'" class="ery-dataview">
		<div v-for="(proptype, key) in data.props" class="ery-dataview-row">
			<div class="ery-dataview-label">{{key}}:</div>
			<ery-template :data='proptype'></ery-template>
			
		</div>
	</div>

	<div v-else-if="data.type=='array'" class="ery-dataview">
		<div class="ery-templatetype-container">Array of</div>
		<ery-template :data='data.componentType'></ery-template>
	</div>

	<div v-else-if="data.type=='dict'" class="ery-dataview">
		<div class="ery-templatetype-container">Dict of</div>
		<ery-template :data='data.componentType'></ery-template>
	</div>

	<div v-else-if="data.type=='choice'" class="ery-dataview">
		<div v-for="option in data.options">•<ery-template :data="option"></ery-template></div>
		
	</div>

	<div v-else class="ery-dataview  ery-templatetype">
		<div class="ery-templatetype-root">{{data.type}}</div>
		<div class="ery-templatetype-sub" v-if="data.subdata&&data.type==='string'">{{data.subdata}}</div>
	</div>
	`,

})


Vue.component('ery-dataview', {
	props: ["data"],
	template: `<div class="ery-dataview" :class="classObj" v-if="type=='obj'">
	<div v-for="(item, key) in data" class="ery-dataview-row">
	<div class="ery-dataview-label">{{key}}:</div>
	<ery-dataview :data="item" :key="'item-' + key"></ery-dataview>
	</div>
	</div>



	<div class="ery-dataview" :class="classObj" v-else-if="type=='array'">
	<ery-dataview v-for="(item, index) in data" :data="item" :key="'item' + index"></ery-dataview>
	</div>

	<div class="ery-dataview"  v-else-if="type=='undefined'">
	UNDEFINED
	</div>


	<div class="ery-dataview" :class="classObj" v-else>
	{{data}}
	</div>`,
	computed: {

		classObj: function() {
			let obj = {}
			obj["ery-dataview-" + this.type] = true
			return obj
		},

		type: function() {
				// Raw data
				if (typeof this.data === "object") {
					if (Array.isArray(this.data))
						return "array"
					return "obj"
				}
				return typeof this.data


			}

		}
	})
