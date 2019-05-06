var langViewer = new Vue({
	template: `
	<div>
	<select v-model="selected">
	${Object.keys(languageSpecs).map(key => "<option>" + key + "</option>").join("")}
	</select>
	{{selected}}
	</div>

	`,


	el: "#spec",
	data: {
		selected: ''
	}

})