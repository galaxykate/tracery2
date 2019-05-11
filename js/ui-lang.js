// A view of an object

function cloneObj(obj) {
	if (typeof obj === "object")
		if (Array.isArray(obj))
			return obj.map(cloneObj)
	else
		return mapObject(obj, cloneObj)
	return obj

}

function DropPlaceholder() {
	this.isPlaceholder = true
	this.array = undefined
	this.index = 0
}

DropPlaceholder.prototype.replaceWith = function(obj) {

	if (this.array) {
		console.log("replace index " + this.index, this.array.items)
		this.array.items[this.index] = obj
		console.log(this.array.items)
	}
	this.remove()
	this.array = undefined

}

DropPlaceholder.prototype.remove = function() {
	if (this.array) {
		this.array.items = this.array.items.filter(item => !item.isPlaceholder)
	}
}

DropPlaceholder.prototype.addAt = function(array, index) {
	console.log("Add at " + index, array)
	this.array = array;
	this.index = index;
	if (this.array)
		this.array.items.splice(this.index, 0, this)
}

let uiVueData = {
	undoStack: [],
	mousePos: new Vector(),
	controlOnStart: true,
	undo: function() {
		let lastState = this.undoStack.pop()
		console.log("undo to state:" + this.undoStack.length)
		if (lastState)
			this.current = lastState
	},
	storeState: function() {

		this.undoStack.push(cloneObj(this.current))

	},
	rootObj: {
		draggingTarget: undefined,
		draggingObj: undefined,
		isDragging: false,
		draggingPlaceholder: new DropPlaceholder(),

		test: "foo",
		stringsAreEditable: false,

		pickup: function(obj, array) {
			console.log("Pickup")
			this.isDragging = true
			this.draggingTarget = array
			this.draggingObj = obj
		},
		moveDropPlaceholder: function() {
			if (this.draggingObj) {
				if (this.draggingTarget) {
					let p = uiVueData.mousePos
					let targetIndex = 0

					// Which index should this go into?
					$("#" + this.draggingTarget.id).children().each((index, child) => {
						let r0 = child.getBoundingClientRect()
						let avgX = r0.x + r0.width * .5 + window.scrollX

						let ry = window.scrollY + r0.y;
						console.log(p.y, ry)
						if (p.x > avgX && p.y > ry)
							targetIndex = index + 1

					})


					this.draggingPlaceholder.remove()
					this.draggingPlaceholder.addAt(this.draggingTarget, targetIndex)


					// this.draggingTarget.items.push(this.draggingObj)
				} else
					console.log("deleted", this.draggingObj)
			}

		},
		drop: function() {
			uiVueData.storeState()
			console.log("DROP")

			this.draggingPlaceholder.replaceWith(this.draggingObj)
			this.draggingObj = undefined
			this.draggingTarget = undefined

			// this.moveDropPlaceholder()
			
		}
	},

	languageSpecs: languageSpecs,

	selected: languageSpecs.traceryOG,
	current: undefined

}


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
	<div v-if="obj !== undefined" class="objview" v-bind:class="{ 'objview-array-item':inArray}">
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
		

	</div>
	<div v-else>((EMPTY OBJ))</div>`

		,


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
					@mouseenter="mouseEnter"
					@mouseleave="mouseOut"
					class="objview-array"
					:id="obj.id"
					:class="{dragTarget:rootObj.isDragging && obj==rootObj.draggingTarget}"
				>
				{{obj.id}}
	

					<div
						class="objview-array-item"
						v-for="(item, index) in getDisplayList"
						v-bind:key="index"
						v-bind:class="{dropPlaceholder:item.isPlaceholder}"
						@mousedown.stop="mousePressed(item, index)"
					>
						<obj-view 
							v-if="!item.isPlaceholder"
							
							:obj="item" :rootObj="rootObj">
						</obj-view>
						<span 
							v-else>
							&nbsp
						</span>
					</div>
					
				</div>
	`,

	computed: {
		getDisplayList :function() {
			console.log(this.obj.items)
			let list2 = this.obj.items.slice()
			list2.splice(1, 0, {
				isPlaceholder: true
			})
			console.log(list2)
			return list2
		}
	},

	methods: {
		mouseEnter() {
			console.log("Enter " + this.obj.id)
			this.rootObj.draggingTarget = this.obj

		},
		mouseOut(item, index) {
			console.log("Exit " + this.obj.id)
			this.rootObj.draggingTarget = undefined
		},

		mousePressed(item, index) {
			console.log("Enter " + this.obj.id, this.obj.items)

			this.pickup(item, index)
			return false

		},

		pickup(item, index) {
			console.log("pickup", item, index)
			this.obj.items.splice(index, 1);
			this.rootObj.pickup(item, this.obj)
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
		@mousemove="mouseMove"
		@mouseup="mouseUp"
		class="panel language-view disable-select" >
		
		
			<div class="header"">
				<div class="header-main">
					{{current.id}}
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
				<obj-view :obj="current" :rootObj="rootObj"></obj-view>
			</div>

		<div 
			v-if="rootObj.draggingObj"
			class="draggable-helper" 
			draggable="true" drag="drag"
			v-bind:style="draggableStyle"
		>
			<obj-view :obj="rootObj.draggingObj" :rootObj="rootObj"></obj-view>
		</div>
	</div>
	`,

	computed: {
		draggableStyle: function() {
			return {
				left: this.mousePos.x + "px",
				top: this.mousePos.y + "px",
			}
		}
	},

	created: function() {
		this.current = cloneObj(this.selected)

		console.log(this.current, this.selected)
	},
	methods: {
		drag() {
			console.log("drag")
		},
		mouseUp(e) {
			this.rootObj.drop()
		},
		mouseMove(e) {
			this.mousePos.setTo(e.pageX, e.pageY)

			// console.log("move", this.mousePos.toSimpleString())
			if (this.rootObj.draggingObj) {
				console.log("Dragging...")

				this.rootObj.moveDropPlaceholder()
			}
		},
		onChange: function() {
			console.log(this.selected)
			this.current = this.selected
		},


	},


	el: "#spec",
	props: ["deletedItems"],
	data: uiVueData
})


$(function() {
	$(window).mouseup(function() {
		console.log("window mouseup!")
		uiVueData.rootObj.drop()
	})

	$(document).on('keydown.meta_z', null, function(ev) {
		console.log("HOTKEY", ev.key)
		ev.preventDefault()
		console.log("undo")
		uiVueData.undo()


	});

})