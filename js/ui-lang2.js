// A view of an object


function inRect(d, p, border) {
	let r0 = d.getBoundingClientRect()
	console.log(`(${r0.left},${r0.top}) (${r0.bottom},${r0.right})`)

	let xRange = (p.x > r0.left - border) && (p.x < r0.right + border)
	let yRange = (p.y > r0.top - border) && (p.y < r0.bottom + border)
	console.log(p)
	return xRange && yRange
}

Vue.component('obj-view', {
	template: `
	<div class="objview" v-bind:class="{ 'objview-array-item':inArray}">
		<obj-dictionary
			:obj="obj" :rootObj="rootObj" 
			v-if="obj.type === 'dictionary'">
		</obj-dictionary>
		

		<obj-array
			:obj="obj" :rootObj="rootObj" 
			v-else-if="obj.type === 'array'">
		</obj-array>
		

		<obj-string
			:obj="obj" :rootObj="rootObj" 
			v-else-if="obj.type === 'string'">
		</obj-string>
		

		<div 
			:obj="obj" :rootObj="rootObj" 
			v-else>
			UNKNOWN TYPE: {{obj.type}}
		</div>
		

	</div>`,


	props: ["obj", "rootObj", "inArray"],
})



Vue.component('obj-dictionary', {
	props: ["obj", "rootObj"],
	template: `<div 
				class="objview-dictionary"
				>
					<div v-for="(val,key) in obj.props" 
						v-bind:key="key"
						class="objview-row"
					>
						<div class="objview-row-label">{{key}}</div>:
							<obj-view :obj="val" :rootObj="rootObj"></obj-view>
					</div>
				</div>
	`,
})

Vue.component('obj-array', {
	props: ["obj", "rootObj"],
	template: `

				<div 
					class="objview-array"
				>
				{{obj.id}}
					<draggable

						class="dragArea list-group"
						:list="obj.items"
						
						ghost-class="ghost"
						removeCloneOnHide: true
						:group="{ name: 'people', pull: pullFunction }"
						@start="startDrag"
						@end="endDrag"
						@add="onAdd"
						@remove="onRemove"
						@change="onChange" 
					
					>
					
						<obj-view 
							v-for="(item, index) in obj.items"
							v-bind:key="index"
							:inArray="true"
							:obj="item" :rootObj="rootObj">
						</obj-view>

					</draggable>
				</div>
	`,

	computed: {

		dragOptions() {
			return {
				animation: 0,

				ghostClass: "ghost"
			};
		},
	},

	methods: {
		pullFunction() {
			return this.controlOnStart ? "clone" : true;
		},
		onRemove() {
			console.log("onRemove" + this.obj.id)
		},
		startDrag() {
			console.log("start drag")

		},

		onAdd() {
			console.log("add" + this.obj.id)
		},

		endDrag(e) {
			let p = new Vector(e.originalEvent.clientX, e.originalEvent.clientY)
			console.log(e)
			// let p = new Vector(e.originalEvent.screenX, e.originalEvent.screenY)
			console.log("end drag " + this.obj.id)
			console.log("from list:")


			let inSource = inRect(e.from, p, 30)

			let inTarget = inRect(e.to, p, 30)
			if (!inSource && !inTarget) {
				console.log("delete")
			}
		},

		onChange() {
			console.log("change")
		},

		addItem: function() {
			console.log("Click")
			let item = createErySubObject("string")
			item.value = ""
			this.obj.items.push(item)
		}
	},
	data: function() {
		return {
			showControls: false
		}
	}
})


Vue.component('obj-string', {
	props: ["obj", "rootObj"],

	template: `<pre 
				@input="onInput"
				@paste.stop.prevent="onPaste"
				class="objview-string"
				v-bind:contenteditable="rootObj.stringsAreEditable"
				
				>{{obj.value}}</pre>
	`,

	methods: {
		onInput: function(e) {
			console.log("edit: " + e.target.innerText);

		},
		onPaste: function(e) {
			console.log("paste: " + e.target.innerText);

			var plaintext = e.clipboardData.getData('text/plain');
			document.execCommand('inserttext', false, plaintext);
		},
	},

})


var langViewer = new Vue({
	template: `
	<div 
		class="panel language-view" >
		
		
			<div class="header" :class="{dragActive:isDragging}">
				<div class="header-main">
					{{selected.id}}
				</div>
				<div class="header-controls">
					<select v-model="selected" @change="onChange">
						<option v-for="(lang, key) in languageSpecs"
							v-bind:value="lang"
						>
						{{key}}
						</option>
					</select>
					
				</div>
			</div>
			<div class="content">
				<obj-view :obj="selected" :rootObj="rootObj"></obj-view>
			</div>

	</div>
	`,

	computed: {

	},

	methods: {

		onChange: function() {
			console.log(this.selected)
		},
		onMove: function() {
			console.log("MOVE")
			console.log(this.myArray)
		}
	},


	el: "#spec",
	props: ["deletedItems"],
	data: function() {
		return {
			controlOnStart: true,
			isDragging: false,
			rootObj: {
				draggableMode: true,
				test: "foo",
				stringsAreEditable: false
			},

			languageSpecs: languageSpecs,
			selected: languageSpecs.traceryOG
		}
	}
})