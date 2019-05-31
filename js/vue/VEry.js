

Vue.component('ery-dataview', {
		props: ["data"],
		template: `<div  class="dataview" :class={error:data.error}>
						<div class="dataview-label">{{data.spec.type}}<span v-if="getType=='custom'">:{{data.spec.customID}}</span><span v-if="getType=='option'"> selected:{{data.optionDetected}}</span></div>

						<div v-if="getType=='array'" class="dataview-obj">
							ARRAY
						</div>

						<div v-else-if="getType=='custom'" class="dataview-obj">
							<ery-dataview :data=data.subspec></ery-dataview>
						</div>

						<div v-else-if="getType=='option'" class="dataview-obj">
							<ery-dataview :data=data.subspec></ery-dataview>
						</div>


						<div v-else-if="getType=='dictionary'" class="dataview-obj">
							DICTIONARY
							<div class="dataview-row" v-for="val,key in data.items">
								<div class="dataview-label">{{key}}:</div><div class="dataview-val"><ery-dataview :data=val></ery-dataview></div>
							</div>
						</div>


						<div v-else-if="getType=='obj'" class="dataview-obj">
							<div class="dataview-row" v-for="val,key in data.props">
								<div class="dataview-label">{{key}}:</div><div class="dataview-val"><ery-dataview :data=val></ery-dataview></div>
							</div>
						</div>

						<div v-else class="dataview-val">
							{{data.value}}
						</div>

						<div v-if="data.error" class="dataview-error">
							{{data.error}}
						</div>
					</div>`,
		computed: {
			booleanToEmoji: function() {
				return this.data.value?  "✅":"🔴"
			},
			getType: function() {
				return this.data.spec.type
			}
			
	}
})

Vue.component('ery-rawview', {
		props: ["raw"],
		template: `<div  class="rawview">
						
						<!-- switch by type --> 
						<div v-if="getType=='boolean'">{{booleanToEmoji}}</div>

						<div v-else-if="getType=='string'" class="rawview-string">{{raw}}</div>

						<div v-else-if="getType=='number'">{{raw}}</div>

						<div v-else-if="getType=='obj'" class="rawview-obj">
							<div class="rawview-row" v-for="val,key in raw">
								<div class="rawview-label">{{key}}:</div><div class="rawview-val"><ery-rawview :raw=val></ery-rawview></div>
							</div>
						</div>

						<ery-rawview v-else-if="getType=='array'" v-for="(item, index) in raw" :key='index' :raw="item"></ery-rawview>
						<div v-else>
							Unknown!
							<!-- Make a choice -->
						</div>

					</div>`,
		computed: {
			booleanToEmoji: function() {
				return this.raw?  "✅":"🔴"
			},
			getType: function() {
				if (typeof this.raw === "object") {
					if (Array.isArray(this.raw)) {
						return "array"
					}
					return "obj"
				}
				if (typeof this.raw === "string") 
					return "string"
				if (typeof this.raw === "boolean") 
					return "boolean"
				if (!isNaN(this.raw))
					return "number"
				return undefined
		}
	}
})

	Vue.component('ery-element', {
		props: ["element"],
		template: `<div  :class="classObject">
						<div class="ery-el-label">
							type:{{element.type}}
						</div>
						<!-- switch by type --> 
						<div v-if="element.type=='boolean'">
							boolean stuff
						</div>
						<div v-else-if="element.type=='string'">
							text:<input></input>
						</div>
						<div v-else-if="element.type=='number'">
							slider
						</div>
						<div v-else-if="element.type=='obj'">
							OBJECT
						</div>
						<div v-else>
							<!-- Make a choice -->
						</div>
					</div>`,
	
		computed: {
			classObject: function() {
				let classes = {

					"ery-el": true,
				}
				classes["ery-el-" + this.element.type] = true
				return classes
			}
		}

	})