// Language specifications for tracery, chancery...and more!
// celery, cemetery, chancery, cheery, chicanery, confectionery, creamery, crockery, cutlery, delivery, drapery, embroidery, emery, every, fiery,finery, flattery, flowery, frippery, gallery, greenery, imagery, livery, lottery, mastery, millinery, misery, monastery, mystery, nursery, ornery, peppery, periphery, pottery, refinery, robbery, scenery, sorcery, stationery, tannery, tapestry, witchery, aery, archery, artery, bakery, bravery
let languageSpecs = {
	traceryOG: {
		id: "traceryOG",
		types: {
			RuleSet: ["string(tracery)", "array of string(tracery)"],
			Grammar: "dictionary of RuleSet"
		},
		origin: "Grammar"

	},
	tracery2: {
		id: "tracery2"
	},
	chancery: {
		id: "chancery"
	},
	// A language for idle games
	filigree: {
		id: "filigree"
	},

	stationery: {
		id: "stationery"

	}
}