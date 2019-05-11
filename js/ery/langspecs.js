// Language specifications for tracery, chancery...and more!
// celery, cemetery, chancery, cheery, chicanery, confectionery, creamery, crockery, cutlery, delivery, drapery, embroidery, emery, every, fiery,finery, flattery, flowery, frippery, gallery, greenery, imagery, livery, lottery, mastery, millinery, misery, monastery, mystery, nursery, ornery, peppery, periphery, pottery, refinery, robbery, scenery, sorcery, stationery, tannery, tapestry, witchery, aery, archery, artery, bakery, bravery
let objCount = 0

function createErySubObject(type) {
	let idNumber = objCount++

	return {
		idNumber:idNumber,
		type: type,
		isPlaceholder: false
	}
}

function expandObject(raw) {
	// Expand this raw object into an editable blackboard-style boject,
	// Where all elements have object wrappers to track state/type (and allow vue editing)

	let obj = createErySubObject()
	// All objects are dictionaries, because we don't have an object property list
	switch (typeof raw) {
		case "object":
			if (Array.isArray(raw)) {
				obj.type = "array"
				obj.items = raw.map(expandObject)
			} else {
				obj.type = "dictionary"
				obj.props = mapObject(raw, expandObject)
			}
			break;
		case "number":
		case "boolean":
		case "string":
			obj.type = typeof raw
			obj.value = raw
			break;


	}
	obj.id = obj.type + obj.idNumber
	return obj
}


let languageSpecsRaw = {
	traceryOG: {
		editable: true,
		version: 1.0,
		id: "traceryOG",
		types: {
			RuleSet: ["string(tracery)", "array of string(tracery)"],
			Grammar: "dictionary of RuleSet"
		},
		animals: {
			mammals: ["okapi", "rhinoceros", "porpoise", "meercat", "moose", "grizzly", "bobcat", "hedgehog", "wolf", "fox", "rabbit", "groundhog"],
			pets: [["maine coon", "ginger", "grey tuxedo"], ["great dane", "poodle", "corgi", "svalhund"]],
			birds: ["emu", "eagle", "flamingo"],
			fish: ["catfish", "pufferfish"],
		},
		// origin: "Grammar",
		// herbs: {
		// 	"description": "A list of herbs and spices, and mixtures of the two.",
		// 	"herbs": [
		// 		"Angelica",
		// 		"Basil",
		// 		"Holy Basil",
		// 		"Thai Basil",
		// 		"Bay leaf",
		// 		"Indian Bay leaf",
		// 		"Boldo",
		// 		"Borage",
		// 		"Chervil",
		// 		"Chives",
		// 		"Garlic Chives",
		// 		"Cicely",
		// 		"Coriander leaf",
		// 		"Cilantro",
		// 		"Bolivian Coriander",
		// 		"Vietnamese Coriander",
		// 		"Culantro",
		// 		"Cress",
		// 		"Curry leaf",
		// 		"Dill",
		// 		"Epazote",
		// 		"Hemp",
		// 		"Hoja santa",
		// 		"Houttuynia cordata",
		// 		"Hyssop",
		// 		"Jimbu",
		// 		"Kinh gioi",
		// 		"Lavender",
		// 		"Lemon balm",
		// 		"Lemon grass",
		// 		"Lemon myrtle",
		// 		"Lemon verbena",
		// 		"Limnophila aromatica",
		// 		"Lovage",
		// 		"Marjoram",
		// 		"Mint",
		// 		"Mugwort",
		// 		"Mitsuba",
		// 		"Oregano",
		// 		"Parsley",
		// 		"Perilla",
		// 		"Rosemary",
		// 		"Rue",
		// 		"Sage",
		// 		"Savory",
		// 		"Sansho",
		// 		"Shiso",
		// 		"Sorrel",
		// 		"Tarragon",
		// 		"Thyme",
		// 		"Woodruff"
		// 	],
		// 	"spices": [
		// 		"Aonori",
		// 		"Ajwain",
		// 		"Allspice",
		// 		"Amchoor",
		// 		"Anise",
		// 		"Star Anise",
		// 		"Asafoetida",
		// 		"Camphor",
		// 		"Caraway",
		// 		"Cardamom",
		// 		"Black Cardamom",
		// 		"Cassia",
		// 		"Celery powder",
		// 		"Celery seed",
		// 		"Charoli",
		// 		"Chenpi",
		// 		"Cinnamon",
		// 		"Clove",
		// 		"Coriander seed",
		// 		"Cubeb",
		// 		"Cumin",
		// 		"Nigella sativa",
		// 		"Bunium persicum",
		// 		"Dill",
		// 		"Dill seed",
		// 		"Fennel",
		// 		"Fenugreek",
		// 		"Fingerroot",
		// 		"Greater Galangal",
		// 		"Lesser Galangal",
		// 		"Garlic",
		// 		"Ginger",
		// 		"Aromatic Ginger",
		// 		"Golpar",
		// 		"Grains of Paradise",
		// 		"Grains of Selim",
		// 		"Horseradish",
		// 		"Juniper berry",
		// 		"Kokum",
		// 		"Korarima",
		// 		"Dried Lime",
		// 		"Liquorice",
		// 		"Litsea cubeba",
		// 		"Mace",
		// 		"Mango-ginger",
		// 		"Mastic",
		// 		"Mahlab",
		// 		"Black Mustard",
		// 		"Brown Mustard",
		// 		"White Mustard",
		// 		"Nigella",
		// 		"Njangsa",
		// 		"Nutmeg",
		// 		"Alligator Pepper",
		// 		"Brazilian Pepper",
		// 		"Chili Pepper",
		// 		"Cayenne pepper",
		// 		"Paprika",
		// 		"Long Pepper",
		// 		"Peruvian Pepper",
		// 		"East Asian Pepper",
		// 		"Sichuan Pepper",
		// 		"Sansho",
		// 		"Tasmanian Pepper",
		// 		"Black Peppercorn",
		// 		"Green Peppercorn",
		// 		"White Peppercorn",
		// 		"Pomegranate seed",
		// 		"Poppy seed",
		// 		"Radhuni",
		// 		"Rose",
		// 		"Saffron",
		// 		"Salt",
		// 		"Sarsaparilla",
		// 		"Sassafras",
		// 		"Sesame",
		// 		"Shiso",
		// 		"Sumac",
		// 		"Tamarind",
		// 		"Tonka bean",
		// 		"Turmeric",
		// 		"Uzazi",
		// 		"Vanilla",
		// 		"Voatsiperifery",
		// 		"Wasabi",
		// 		"Yuzu",
		// 		"Zedoary",
		// 		"Zereshk",
		// 		"Zest"
		// 	],
		// 	"mixtures": [
		// 		"Adjika",
		// 		"Advieh",
		// 		"Baharat",
		// 		"Beau Monde seasoning",
		// 		"Berbere",
		// 		"Bouquet garni",
		// 		"Buknu",
		// 		"Chaat masala",
		// 		"Chaunk",
		// 		"Chili powder",
		// 		"Crab boil",
		// 		"Curry powder",
		// 		"Doubanjiang",
		// 		"Douchi",
		// 		"Duqqa",
		// 		"Fines herbes",
		// 		"Five-spice powder",
		// 		"Garam masala",
		// 		"Garlic powder",
		// 		"Garlic salt",
		// 		"Gochujang",
		// 		"Harissa",
		// 		"Hawaij",
		// 		"Herbes de Provence",
		// 		"Idli podi",
		// 		"Jamaican jerk spice",
		// 		"Khmeli suneli",
		// 		"Lemon pepper",
		// 		"Mitmita",
		// 		"Mixed spice",
		// 		"Montreal steak seasoning",
		// 		"Mulling spices",
		// 		"Old Bay Seasoning",
		// 		"Onion powder",
		// 		"Panch phoron",
		// 		"Persillade",
		// 		"Powder-douce",
		// 		"Pumpkin pie spice",
		// 		"Qâlat daqqa",
		// 		"Quatre épices",
		// 		"Ras el hanout",
		// 		"Recado rojo",
		// 		"Sharena sol",
		// 		"Shichimi",
		// 		"Tabil",
		// 		"Tandoori masala",
		// 		"Vadouvan",
		// 		"Yuzukosho",
		// 		"Za'atar"
		// 	]
		// }



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

let languageSpecs = mapObject(languageSpecsRaw, expandObject)

console.log(languageSpecs)