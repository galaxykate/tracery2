function Toy() {
	this.id = grammar.flatten("#id#")
	this.icon = getRandom(emoji)
	this.name = grammar.flatten("#adj#_#animal#")
	this.type = Math.floor(Math.random() * 4)

	this.dim = new Vector(r * aspect, r / aspect)
	this.pos = new Vector(Math.random() * 300, Math.random() * 300)
}


function Socket(lvl, x, y, w, h) {
	this.lvl = lvl
	this.children = []

	this.subsockets = []


	this.isActive = false

	this.id = grammar.flatten("#id#")
	this.name = "socket"
	this.type = Math.floor(Math.random() * 4)
	this.dim = new Vector(w, h)
	this.pos = new Vector(x, y)

	if (this.lvl === 0) {
		for (var i = 0; i < 3; i++) {
			this.subsockets[i] = new Socket(lvl + 1, 60 * i + 10, 60 * i + 10, 50, 50)
		}
	}
	appData.addDroppable(this)
}

Socket.prototype.drop = function(obj, pos) {
	this.children.push(obj)
}
Socket.prototype.activateDroppable = function() {
	// console.log("ACTIVATE " + this.droppableID)
	this.isActive = true
}
Socket.prototype.deactivateDroppable = function() {
	// console.log("DEACTIVATE " + this.droppableID)
	this.isActive = false
}