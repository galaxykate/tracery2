Vue.component('test-socket', {
	props: ["obj"],
	template: `<div 
			class="socket droppable-target"
			v-bind:style="getStyle"
			v-bind:class="getClassObj"
			v-bind:droppable="obj.droppableID"
		>
			{{this.obj.droppableID}}
			<test-socket v-for="socket in obj.subsockets" :key="socket.id" :obj="socket"></test-socket>
			<div v-for="child in obj.children">{{child.icon}}</div>
		</div>`,
	methods: {

	},
	computed: {
		getClassObj: function() {
			let classes = {
				'disable-select': true,
				'droppable-active': this.obj.isActive,
				'droppable-open': mouse.dragObj.canUse && mouse.dragObj.canUse(this.obj)
			}
			classes["socket-type" + this.obj.type] = true
			return classes
		},
		getStyle: function() {
			return {
				left: this.obj.pos.x + "px",
				top: this.obj.pos.y + "px",
				width: this.obj.dim.x + "px",
				height: this.obj.dim.y + "px",
				position: "absolute",
				backgroundColor: `hsla(${this.obj.type*90 + 20}, 50%, 50%, 1)`

			}
		}
	}
});

// Vue.component('test-toy', {
// 	props: ["obj", "ignorePosition"],
// 	data: function() {
// 		return {
// 			isGhost: false
// 		}
// 	},
// 	template: `<div 
// 			class="toy"

// 			v-bind:style="getStyle"
// 			v-bind:class="{'disable-select':true, 'test-toy-ghost':isGhost}"
// 			@mousedown="pickup"
// 		>
// 			{{obj.icon}}
// 		</div>`,
// 	methods: {
// 		pickup: function() {
// 			this.isGhost = true

// 			// Call the pickup function with these settings 
// 			//  (which the parent might override or add to?)
// 			this.$parent.pickup({
// 				obj: this.obj,
// 				helperComponent: this.$options.name,
// 				canUse: (dropTarget) => {
// 					return dropTarget.type === this.obj.type
// 				},
// 				onDrop: (dropTarget) => {
// 					console.log("Drop " + this.obj.id)

// 					this.$parent.remove(this.obj)

// 					// if (dropTarget === undefined) {
// 					// 	console.log("Drop to delete")
						
// 					// } else {
// 					// 	console.log("Drop somewhere useful")
// 					// }
// 				}
// 			})
// 		},

// 	},
// 	computed: {
// 		getStyle: function() {
// 			let style = {

// 				width: this.obj.dim.x + "px",
// 				height: this.obj.dim.y + "px",

// 				backgroundColor: `hsla(${this.obj.type*90 + 20}, 90%, 80%, 1)`

// 			}
// 			if (!this.ignorePosition) {
// 				style.position = "absolute"
// 				style.left = this.obj.pos.x + "px"
// 				style.top = this.obj.pos.y + "px"
// 			}
// 			return style
// 		}
// 	}
// })

// var app = new Vue({

// 	template: `
// 	<div class="app">
// 	<!-- gamefield: a place for toys -->
// 		<div id="layer-sockets" class="layer">
// 			<test-socket v-for="obj in appData.sockets"
// 				:obj="obj"
				
// 				:key="obj.id"
// 			></test-socket>
// 		</div>

// 		<div id="layer-toys" class="layer">
// 			<test-toy v-for="obj in appData.toys"
// 				:obj="obj"
				
// 				:key="obj.id"
// 			></test-toy>
// 		</div>

// 	<!-- overlay: a good place to put drag helpers! -->
// 		<div v-if="mouse.isDown"
// 			class="draggable-helper" 
// 			v-bind:style="draggableStyle"
// 		>
// 			<component v-if="mouse.isDown&&mouse.dragObj.obj" :obj="mouse.dragObj.obj" :ignorePosition="true" v-bind:is="mouse.dragObj.helperComponent"></component>
			
			
// 		</div>

// 	<!-- mouse widget -->
// 		<div class="widget widget-mouse disable-select" >
// 			Mouse:{{mouse.pos.toPaddedString(1, 5, "&nbsp;")}}
// 			<div v-if="mouse.isDown">down<br>
// 			offset:{{mouse.dragOffset.toPaddedString(1, 5, "&nbsp;")}}</div>
// 		</div>
// 	</div>
// 	`,
// 	el: "#main-cols",
// 	computed: {
// 		draggableStyle: function() {
// 			return {
// 				left: this.mouse.pos.x + "px",
// 				top: this.mouse.pos.y + "px",
// 			}
// 		}
// 	},
// 	methods: {
// 		pickup: function(dragSettings) {
// 			mouse.pickup(dragSettings)
// 		},
// 		remove: function(toy) {
// 			console.log("Remove", toy)
// 			let index = this.appData.toys.indexOf(toy)
// 			console.log(index)
// 			this.appData.toys.splice(index, 1)
// 		}
// 	},
// 	data: {
// 		draggableComponent: undefined,
// 		mouse: mouse,
// 		appData: appData

// 	}
// })