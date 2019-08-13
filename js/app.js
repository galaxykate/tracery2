let grammar = tracery.createGrammar({
	foo: ["#animal#"],
	animal: ["cat", "dog", "fish", "ocelot", "unicorn", "macaw", "eagle", "dolphin", "okapi"],
	mood: "wise sleepy joyful patient astute mirthful".split(" "),
	adj: ["#mood#", "#color#"],	
	color: ["pink", "magenta", "silver", "white", "grey", "blue", "turquoise", "purple", "indigo"],
	"origin2": ["#adj# #animal#"],
	"origin": ["happy #animal#"],

 	"landscapeAdj" : ["rainy", "windy", "old", "grey", "dark", "creaky", "quiet", "silent", "fair", "shadow", "verdant", "sunny", "far", "near", "dry", "dead"],
	"landscapeFeature" : ["river", "mountain", "forest", "mines", "pines", "falls", "glen", "garden", "mansion", "village", "isle", "bayou", "swamp", "hill", "creek", "rainforest", "desert"],
	"landscapeComplex" : ["#landscapeAdj# #landscapeFeature#"],

 	"hint" : ["echo", "reminder", "hint", "overtone", "insinuation", "note", "undertone", "counterpoint"],
	"flavorAttr" : ["#hint.a# of #flavor#", "#texture# on your tongue", "#flavorMod# and #flavorMod# as #memory#", "it is #flavorMod# and #flavorMod# as #memory#", "#flavor#, #flavor#, and #flavor# #hint.s#", "#flavorMod# #flavor#, with #hint.s# of #flavor#", "#flavor# #blendsWith# #flavorMod# #flavor#", "#flavorMod# #flavor# #blendsWith# #flavorMod# #flavor#", "#flavorMod# #flavor#", "#flavorMod# #fruit.s#", "#hint.s# of #flavorMod# #flavor#", "#flavorMod# and #flavorMod#", "#flavorMod# #flavor# #hint.s#", "it smells of #memory#", "it reminds you of  #memory#", "you smell #memory#", "you remember #memory#", "you taste #memory#", "all you can taste is #memory#", "you #areDrowningIn# #flavorMod# #flavor#"],
	"flavorMod" : ["special", "dark", "light", "bitter", "burnt", "savory", "flavorful", "aromatic", "fermented", "herbal", "pleasant", "harsh", "smoky", "sweet", "fresh", "refreshing", "somber", "bright", "perky", "sullen", "acidic", "sour", "peaty", "juicy", "perfumed", "buttery", "lush", "brisk", "strong", "weak", "tart", "tangy", "bold", "overpowering", "light", "faint", "subtle"],
	"flavor" : ["spearmint", "tobacco", "agave", "coffee", "cocoa powder", "chocolate", "sea salt", "kosher salt", "brown sugar", "cinnamon", "motor oil", "lavender", "spice", "black pepper", "cardamom", "pumpkin spice", "caramel", "toffee", "butterscotch", "peppermint", "walnut", "acid", "pear", "citrus", "grenadine", "smoke", "iodine", "coriander", "cinnamon", "acid", "salt", "sugar", "maple", "coffee", "whiskey", "regret", "sorrow", "blood", "gasoline", "grass", "cigarettes", "pine", "tar", "saltwater", "rosewater", "jasmine", "espresso", "green apple", "#fruit#", "#fruit#", "#fruit#", "#fruit#", "#fruit#"],
	"blendsWith" : ["mingles with", "counterbalances", "contrasts with", "complements", "clashes with", "harmonizes with", "accents"],
	"cream" : ["coconut milk", "whipped cream", "almond milk", "hemp milk", "organic milk", "soy", "fermented dairy", "yoghurt", "goat's milk"],

	"largeFruit" : ["kumquat", "honeydew", "bittermelon", "cherimoya", "peach", "sugar apple", "persimmon", "green apple", "jackfruit", "damson plum", "kiwi", "lime", "key lime", "meyer lemon", "pomegranate", "green apple", "pineapple", "mandarin orange", "blood orange", "plum", "bosque pear", "fig", "persimmon", "durian", "mango", "lychee"],
	"smallFruit" : ["black cherry", "raisin", "cranberry", "blueberry", "raspberry", "lingonberry", "boysenberry", "elderberry", "black grape", "champagne grape", "blackberry", "marionberry", "açaí berry", "blackcurrant", "currant", "pomegranate seed"],
	"fruit" : ["#largeFruit#", "#smallFruit#"],

	"hpnStart" : ["Brax", "Brash", "Stump", "Tangle", "Star", "Stage", "Black", "Red", "Chamb", "Whit", "Gren", "Brook", "Bright", "North", "Hells", "Saints", "Fair"],
	"hpnEnd" : ["bridge", "bury", "ton", "fright", "borough", "ford", "blood", "ly", "brox", "bray", "bay", "smith", "town", "lyn", "ferry", "ghost", "haven", "brook", "oaks", "ox", "wood"],
	"hpn" : ["#hpnStart##hpnEnd#"],
	"name" : ["Gabriel", "Lucia", "Hollis", "Holly", "Maisie", "Jasper", "Lane", "Lincoln", "Sterling", "Summer", "Miranda", "Maria", "Min", "Minnie", "Mariah", "Gus", "Dani", "Darius", "Elena", "Eduardo", "Elías", "Rajesh", "Ranjit", "Rex", "Rez", "Rey", "Yew", "Reba", "Jae-woo", "Ken", "Kira", "Jae", "Shah", "Josef", "Jørn", "Autumn", "Brandy", "Copper", "Cooper", "Harrow", "Manhattan", "Jo", "Jodi", "Karim", "Raf", "January", "Aku", "Juraj", "Yuri", "Kåre", "Lyn", "Jahan", "Mitch", "Alda", "Aimee", "Zoe", "London", "Paris", "Zuzu", "Zara", "Micah", "Song", "Sparrow", "Miguel", "Mikey", "Monette", "Michelina", "Agave", "Robyn", "Saffron", "Zeke", "Garth", "Rae", "Sebastian", "Seb", "Jake", "Bastion", "Luna", "Apple", "Delilah", "Jeremiah", "Finn", "Milo", "Finley", "April", "May", "September", "Kim", "Phineas", "Quincy", "Saul", "Rudy", "Cleo", "Noel", "Frankie", "June", "Rocky", "Pearl", "Harris", "Braxton", "Hamilton", "Ace", "Duke", "Rowan", "Stella", "Stevie", "Juniper", "Ryder", "Kai", "Judd", "Rhody", "Rho", "Sven", "Hazel", "Byron", "Edie", "Lola", "Poppy", "Jo", "Whisper", "Kaya", "Karim", "Kit", "Luca", "Rafa", "Miriam", "Aya", "Carmen", "Omar", "Anika", "Shan", "Luka", "Theo", "Emma", "Julian", "Adrian", "Ari", "Noah", "Maya", "Ariel"],
	"surnameBase" : ["Chao", "Fillmore", "García", "Bond", "Wong", "Wei", "Goldsmith", "Tran", "Chu", "Baudin", "Montagne", "Moulin", "Villeneuve", "Victor", "Rodríguez", "Smith", "Johnson", "Williams", "Miller", "Stockton", "Patel", "Chaudri", "Jahan", "Christiansen", "Jones", "Stein", "Hirviniemi", "Kiuru", "Øvregard", "Singh", "Noriega", "Pine", "Clarion", "Belden", "Jaware", "Keita", "Kanu", "Geary", "Norton", "Kearny", "Aliyev", "Sato", "Tanaka", "Kim", "Lee", "Gray", "Yang", "Li", "Çelik", "Davis", "Knox", "Griffin", "Leon", "Finch", "Yoo", "Gupta", "Flores", "Lopez", "Moon", "Sun", "Castro", "Suzuki", "Torres", "Pineda", "Tsao", "Romero", "Wolf"],
	"surname" : ["#surnameBase#", "#surnameBase#-#surnameBase#", "#hpn#"],

	"memory" : ["remembrance", "a sense of peace", "serenity", "the inevitability of death", "the immateriality of all things", "fall leaves", "newfallen snow", "the ocean", "your first kiss", "mother's perfume", "your future", "your dreams", "your past", "destiny", "faint hope", "false hope", "loss", "sunscreen in the summer", "the heat of the sun", "bitter cold", "forgiveness", "a newborn child", "the first day of school", "the day #they# left", "the first day you saw #them#", "autumn leaves", "the sea at night", "your #relative#'s smile", "father's aftershave", "grass after the rain", "disappointment", "Christmas morning", "birthday cake", "wedding cake", "#knowledge# that you will never #love# your #relative#", "what it is to #love# someone", "#knowledge#, just #knowledge#"],
	"areDrowningIn" : ["drown in a sea of", "struggle against a tide of", "are overpowered by", "smell nothing but", "are in a sea of", "are becoming one with", "are lost in"],
	

	"coffeeServing" : ["with a dollop of #cream#", "as a #cream# latte", "topped with #cream# foam", "black", "as a pourover", "clover-style", "French Press", "in a teacup", "in a moka pot", "in a teapot", "in a pile of discarded Keurig cups", "with #cream#"],
	"coffeeServingInstruction" : ["Served #coffeeServing#", "Available #coffeeServing# or #coffeeServing#", "Try it #coffeeServing#", "Available #coffeeServing#"],
	"coffeeType" : ["arabica", "decaf", "mocha", "grind", "espresso", "french roast", "dark roast", "light roast", "#flavorMod# roast", "extra #flavorMod# roast"],

	
	"coffeeName" : ["#hpn# #coffeeType.capitalizeAll#", "#landscapeComplex.capitalizeAll# #coffeeType.capitalizeAll#", "#name#'s #coffeeType.capitalizeAll#"],
	"coffeeDesc" : ["#flavorAttr.capitalize#.  #coffeeServingInstruction#.", "#flavorAttr.capitalize# and #flavorAttr#.  #coffeeServingInstruction#."],

	"origin2": "#coffeeName#: #coffeeDesc#",
	
 })


$(function() {
	
	// Create the UI 
	createApp("main-app", "chancery")


})

