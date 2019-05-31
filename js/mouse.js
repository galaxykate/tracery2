let mouse = {
	droppableCount: 0,
	allDroppables: {},
	lastPos: new Vector(),
	pos: new Vector(),

	// Drag settings
	dragOffset: new Vector(),
	downPos: new Vector(),
	upPos: new Vector(),

	isDown: false,

	dragObj: {
		obj: undefined,
		onDrop: undefined,
		onDrag: undefined,
		onEnterTarget: undefined,
		onExitTarget: undefined,
		dropTarget: undefined,
		canUse: undefined
	},


	// Places that it *could* snap to
	snapTargets: [],


	init: function() {
		console.log("init mouse")

		$(window).mouseup((e) => this.stopDrag(e))
		$(window).mousedown((e) => this.startDrag(e))
		$(window).mousemove((e) => this.move(e))
	},



	addDroppable: function(obj) {
		obj.droppableID = this.droppableCount++;
		this.allDroppables[obj.droppableID] = obj
	},

	getDroppableFromElement: function(element) {
		if (element === undefined)
			return undefined
		let id = element.getAttribute("droppable")

		if (id !== null)
			return this.allDroppables[id]
		return undefined
	},


	// Handlers

	move: function(e) {

		this.lastPos.setTo(this.pos)
		this.pos.setTo(e.pageX, e.pageY)
		if (this.isDown)
			this.drag()

	},
	drag: function() {
		this.dragOffset.setToDifference(this.pos, this.downPos)


		// Get the overlap with all droppables
		let targets = $(".droppable-target")
		let maxOverlap = 0
		let selectedElement = undefined
		let rect = {
			pos: new Vector(),
			dim: new Vector()
		}

		let helper = $(".draggable-helper")

		let r1 = helper.get(0).getBoundingClientRect()

		// Go through each element with a droppable-target to find on that has an overlap
		targets.each((index, el) => {
			let r0 = el.getBoundingClientRect()
			let overlap = getRectangleOverlap(r0, r1)

			if (overlap > 0) {

				// replace if there's more area than the winner OR is the winner's child
				if (overlap > maxOverlap) {
					maxOverlap = overlap
					selectedElement = el

				}
				if (selectedElement && selectedElement.contains(el)) {
					selectedElement = el
				}
			}
		})

		// Get the actual droppable object from that element
		let newTarget = appData.getDroppableFromElement(selectedElement)

		// Different than our existing target?
		if (this.dragObj.dropTarget !== newTarget) {

			// Activate and deactivate as necessary
			if (this.dragObj.dropTarget)
				this.dragObj.dropTarget.deactivateDroppable()
			if (newTarget)
				newTarget.activateDroppable()

			// Should this snap to the new target?
			if (newTarget && newTarget.onSnap) {
				newTarget.onSnap(this.dragObj)
			}

			this.dragObj.dropTarget = newTarget
		}



	},

	pickup: function(dragSettings) {
		for (key in dragSettings) {
			this.dragObj[key] = dragSettings[key]
		}

	},

	drop: function() {

		if (this.dragObj.onDrop) {
			this.dragObj.onDrop(this.dragObj.dropTarget, this.pos)
		}

		console.log("drop")
		if (this.dragObj.dropTarget) {
			this.dragObj.dropTarget.drop(this.dragObj.obj, this.pos)
		}

		for (key in this.dragObj) {
			this.dragObj[key] = undefined
		}


	},

	startDrag: function() {
		this.isDown = true
		this.dragOffset.mult(0)
		this.downPos.setTo(this.pos)
		console.log("startDrag")

	},

	stopDrag: function() {
		this.drop()
		this.isDown = false
		this.upPos.setTo(this.pos)



	}
}