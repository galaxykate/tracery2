// A view of an object


Vue.component('obj-view', {
	template: `
	<div v-bind:class="'objview objview-' + obj.type + '-holder'">
	
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
	
	props: ["obj", "rootObj"],
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
							<obj-view :obj="val" :objRoot="rootObj"></obj-view>
					</div>
				</div>
	`,
})

Vue.component('obj-array', {
	props: ["obj", "rootObj"],
	template: `<div 
				class="objview-array"
				>
					<obj-view 
						v-for="(item, index) in obj.items"
						v-bind:key="index"
						:obj="item" :objRoot="rootObj">
					</obj-view>
				</div>
	`,
})


Vue.component('obj-string', {
	props: ["obj", "rootObj"],
	
	template: `<pre 
				@input="onInput"
				@paste.stop.prevent="onPaste"
				class="objview-string"
				contenteditable="true"
				>{{obj.value}}</pre>
	`,

	methods: {
		onInput: function(e) {
			 console.log("edit: "+ e.target.innerText);
			
		},
		onPaste: function(e) {
			console.log("paste: "+ e.target.innerText);
		
	        var plaintext = e.clipboardData.getData('text/plain');
	         document.execCommand('inserttext', false, plaintext);
		},
	},
})


var langViewer = new Vue({
	template: `
	<div class="panel language-view">
		<div class="header">
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
			<obj-view :obj="selected"></obj-view>
		</div>
	</div>
	`,

	methods: {
		onChange: function() {
			console.log(this.selected)
		}
	},


	el: "#spec",
	data: function() {
		return {

			languageSpecs: languageSpecs,
			selected: languageSpecs.traceryOG
		}
	}
})