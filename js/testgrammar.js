let chefGrammarSmall = {
 
	"origin": "[#coffeeName#: #coffeeDesc#]",
	 "hpnStart" : ["Brax", "Brash", "Stump", "Tangle", "Star", "Stage", "Black", "Red", "Chamb", "Whit", "Gren", "Brook", "Bright", "North", "Hells", "Saints", "Fair"],
	"hpnEnd" : ["bridge", "bury", "ton", "fright", "borough", "ford", "blood", "ly", "brox", "bray", "bay", "smith", "town", "lyn", "ferry", "ghost", "haven", "brook", "oaks", "ox", "wood"],
	"hpn" : ["#hpnStart##hpnEnd#"],
	"name" : ["Gabriel", "Lucia", "Hollis", "Holly", "Maisie", "Jasper", "Lane", "Lincoln", "Sterling", "Summer", "Miranda", "Maria", "Min", "Minnie", "Mariah", "Gus", "Dani", "Darius", "Elena", "Eduardo", "Elías", "Rajesh", "Ranjit", "Rex", "Rez", "Rey", "Yew", "Reba", "Jae-woo", "Ken", "Kira", "Jae", "Shah", "Josef", "Jørn", "Autumn", "Brandy", "Copper", "Cooper", "Harrow", "Manhattan", "Jo", "Jodi", "Karim", "Raf", "January", "Aku", "Juraj", "Yuri", "Kåre", "Lyn", "Jahan", "Mitch", "Alda", "Aimee", "Zoe", "London", "Paris", "Zuzu", "Zara", "Micah", "Song", "Sparrow", "Miguel", "Mikey", "Monette", "Michelina", "Agave", "Robyn", "Saffron", "Zeke", "Garth", "Rae", "Sebastian", "Seb", "Jake", "Bastion", "Luna", "Apple", "Delilah", "Jeremiah", "Finn", "Milo", "Finley", "April", "May", "September", "Kim", "Phineas", "Quincy", "Saul", "Rudy", "Cleo", "Noel", "Frankie", "June", "Rocky", "Pearl", "Harris", "Braxton", "Hamilton", "Ace", "Duke", "Rowan", "Stella", "Stevie", "Juniper", "Ryder", "Kai", "Judd", "Rhody", "Rho", "Sven", "Hazel", "Byron", "Edie", "Lola", "Poppy", "Jo", "Whisper", "Kaya", "Karim", "Kit", "Luca", "Rafa", "Miriam", "Aya", "Carmen", "Omar", "Anika", "Shan", "Luka", "Theo", "Emma", "Julian", "Adrian", "Ari", "Noah", "Maya", "Ariel"],
	"surnameBase" : ["Chao", "Fillmore", "García", "Bond", "Wong", "Wei", "Goldsmith", "Tran", "Chu", "Baudin", "Montagne", "Moulin", "Villeneuve", "Victor", "Rodríguez", "Smith", "Johnson", "Williams", "Miller", "Stockton", "Patel", "Chaudri", "Jahan", "Christiansen", "Jones", "Stein", "Hirviniemi", "Kiuru", "Øvregard", "Singh", "Noriega", "Pine", "Clarion", "Belden", "Jaware", "Keita", "Kanu", "Geary", "Norton", "Kearny", "Aliyev", "Sato", "Tanaka", "Kim", "Lee", "Gray", "Yang", "Li", "Çelik", "Davis", "Knox", "Griffin", "Leon", "Finch", "Yoo", "Gupta", "Flores", "Lopez", "Moon", "Sun", "Castro", "Suzuki", "Torres", "Pineda", "Tsao", "Romero", "Wolf"],
	"surname" : ["#surnameBase#", "#surnameBase#-#surnameBase#", "#hpn#"],

		"coffeeServing" : ["with a dollop of #cream#", "as a #cream# latte", "topped with #cream# foam", "black", "as a pourover", "clover-style", "French Press", "in a teacup", "in a moka pot", "in a teapot", "in a pile of discarded Keurig cups", "with #cream#"],
	"coffeeServingInstruction" : ["Served #coffeeServing#", "Available #coffeeServing# or #coffeeServing#", "Try it #coffeeServing#", "Available #coffeeServing#"],
	"coffeeType" : ["arabica", "decaf", "mocha", "grind", "espresso", "french roast", "dark roast", "light roast", "#flavorMod# roast", "extra #flavorMod# roast"],

	
	"coffeeName" : ["#hpn# #coffeeType.capitalizeAll#", "#landscapeComplex.capitalizeAll# #coffeeType.capitalizeAll#", "#name#'s #coffeeType.capitalizeAll#"],
	"coffeeDesc" : ["#flavorAttr.capitalize#.  #coffeeServingInstruction#.", "#flavorAttr.capitalize# and #flavorAttr#.  #coffeeServingInstruction#."],

 }

let chefGrammar = {
 	"hex": "abcdef0123456789".split(""),
	"digit": "0123456789".split(""),
	"id": ["#hex##hex##hex##hex##hex##hex##hex##hex#"],
 	
 	"femmeFrenchAdj" : ["d'or","maudite","tacite","ombre","d'argent","amusé","verte","rouge","française","bonne","géniale","blanche","oublié","belles","nouveaux","fraîche","trompe","joyeuse","bonne","noire","chère","inclinée","malheur"],
	"mascFrenchAdj" : ["amusé","maudit","tacite","regrettable","ombre","d'argent","vert","rouge","français","génial bel","oublié","négligé","frais","faux","grand","bon","blanc","joyeux","trompe"],
	"frenchAdj" : ["#femmeFrenchAdj#", "#mascFrenchAdj#"],
	"mascFrenchNoun" : ["toit","chêne","regret","pinson","cygne taureau","truite","fromage","pain","canard"],
	"femmeFrenchNoun" : ["forêt mer","auberge","chaise","chanson","porte","baleine","table","maison","chalet"],
	"frenchNoun" : ["#femmeFrenchNoun#", "#mascFrenchNoun#"],
	"frenchPlaceName" : ["Le #mascFrenchNoun.capitalize# #mascFrenchAdj.capitalize#", "La #femmeFrenchNoun.capitalize# #femmeFrenchAdj.capitalize#", "#frenchAdj.capitalize#", "#frenchNoun.capitalize#", "#frenchAdj.capitalize#"],

"personobject": ["old blanket", "glowing orb", "threadbare shawl", "silver picture frame", "stack of old papers", "bundle of old letters", "tattered map", "vintage record player", "telescope", "human skull", "heavy iron box", "mud-covered shovel", "baseball bat", "hula hoop", "battered guitar", "cello case", "riding whip"],
	"color" : ["green", "red", "violet", "tafetta", "blue", "silver", "gold", "ivory", "platinum", "black", "lavender", "velvet", "satin", "pink", "magenta", "white", "grey", "tan"],
	"personDesc" : ["feminine", "muddy", "sweaty", "pregnant", "grinning", "soft-voiced", "drowsy", "lanky", "macho", "silent", "weeping", "ashen-faced", "red-eyed", "#color#-eyed", "sullen", "scowling", "laughing", "distracted", "nervous", "bespectacled", "slouching", "crying", "giggling", "loud-voice", "hoarse", "gracious", "mysterious", "tall", "tanned", "studious", "tattooed", "grim", "laid-back", "smiling", "hungover", "genial", "one-armed", "gorgeous", "quiet", "thoughtful", "argumentative", "long-braided", "relaxed", "pleasant", "noisy", "short", "long-haired", "short-haired", "free-spirited", "oddly dressed", "well-dressed", "formally dressed", "curly-haired", "blond", "sunburned", "disheveled", "polished", "clean-shaven", "outgoing", "introverted", "cheerful", "mournful", "chatty", "gossipy", "silver-haired", "#color#-haired", "graceful", "distracted", "mustachioed", "bearded"],
	"personSuit" : ["sundress", "unitard", "bathrobe", "wearing a lab coat", "carrying #personobject.a#", "in paint-smeared overalls", "caftan", "headscarf", "tuxedo", "ballgown", "suit", "vest", "jacket", "bathing suit", "wedding dress"],
	"personPostDesc" : ["in #color.a# #personSuit#", "covered in mud", "with mud-covered shoes", "with a blank expression", "with a dazed expression", "carrying a stuffed rabbit", "clutching a brown paper bag", "carrying a suitcase", "with a sword", "carrying a stack of thick books", "wearing an overstuffed backpack", "with an accordion", "with a Southern drawl", "with a British accent", "in #personSuit.a#", "with a strangely-shaped scar", "with an eyepatch", "with an old guitar", "carrying a ukulele", "carrying a briefcase", "carrying a boombox", "talking on their cellphone", "holding a heavy wooden crate", "wearing sunglasses", "in a wheelchair", "on crutches", "wearing a blindfold", "with haunted eyes", "wearing short-shorts", "with long dreads", "trying to hide their face", "with an enormous beard", "with long dangling earrings", "with a parrot on their shoulder", "carrying a small dog", "wearing an enormous hat", "wearing a #color# ballgown", "dressed entirely in #color#", "wearing a long #color# robe", "with tall #color# boots", "in a #color# #personSuit#"],
	"personType" : ["supermodel", "witch", "soldier", "child", "wizard", "rock star", "country singer", "sailor", "young woman", "hiker", "biker", "truck driver", "gentleman", "pirate", "detective", "movie star", "young man", "violinist", "duchess", "farmer", "soldier", "civil servant", "acrobat", "fireman", "judge", "retiree", "catgirl", "stranger", "hooded figure", "scientist", "writer", "frat brother", "nurse", "tourist", "doctor", "clown", "nun", "clown", "nun", "clown", "nun", "queen", "politician", "lumberjack", "bodybuilder", "rugby player", "ballerina", "professor", "grad student", "student", "high-schooler", "football player", "skater", "geek", "nerd", "goth", "cowboy", "priest", "nun", "monk", "granny", "girl", "hipster", "punk", "banker", "businesswoman", "businessman", "surfer", "old lady", "old man", "kid", "teen", "20-something", "woman", "man", "person", "being"],

	"patronSingle" : ["#personDesc.a# #personType#", "#personDesc.a# #personType# #personPostDesc#", "#personDesc.a# #personType#", "#personDesc.a# #personType# #personPostDesc#", "#personType.a#"],

	"patronPair" : ["#patronSingle# and #patronSingle#", "a pair of #personDesc# #personType.s#"],
	"personGroup" : ["a group of", "dozens of", "several", "a crowd of", "a flock of", "a few"],
	"patronMulti" : ["#personGroup# #personDesc# #personType.s#"],


  "hpnStart" : ["Brax", "Brash", "Stump", "Tangle", "Star", "Stage", "Black", "Red", "Chamb", "Whit", "Gren", "Brook", "Bright", "North", "Hells", "Saints", "Fair"],
	"hpnEnd" : ["bridge", "bury", "ton", "fright", "borough", "ford", "blood", "ly", "brox", "bray", "bay", "smith", "town", "lyn", "ferry", "ghost", "haven", "brook", "oaks", "ox", "wood"],
	"hpn" : ["#hpnStart##hpnEnd#"],
	"name" : ["Gabriel", "Lucia", "Hollis", "Holly", "Maisie", "Jasper", "Lane", "Lincoln", "Sterling", "Summer", "Miranda", "Maria", "Min", "Minnie", "Mariah", "Gus", "Dani", "Darius", "Elena", "Eduardo", "Elías", "Rajesh", "Ranjit", "Rex", "Rez", "Rey", "Yew", "Reba", "Jae-woo", "Ken", "Kira", "Jae", "Shah", "Josef", "Jørn", "Autumn", "Brandy", "Copper", "Cooper", "Harrow", "Manhattan", "Jo", "Jodi", "Karim", "Raf", "January", "Aku", "Juraj", "Yuri", "Kåre", "Lyn", "Jahan", "Mitch", "Alda", "Aimee", "Zoe", "London", "Paris", "Zuzu", "Zara", "Micah", "Song", "Sparrow", "Miguel", "Mikey", "Monette", "Michelina", "Agave", "Robyn", "Saffron", "Zeke", "Garth", "Rae", "Sebastian", "Seb", "Jake", "Bastion", "Luna", "Apple", "Delilah", "Jeremiah", "Finn", "Milo", "Finley", "April", "May", "September", "Kim", "Phineas", "Quincy", "Saul", "Rudy", "Cleo", "Noel", "Frankie", "June", "Rocky", "Pearl", "Harris", "Braxton", "Hamilton", "Ace", "Duke", "Rowan", "Stella", "Stevie", "Juniper", "Ryder", "Kai", "Judd", "Rhody", "Rho", "Sven", "Hazel", "Byron", "Edie", "Lola", "Poppy", "Jo", "Whisper", "Kaya", "Karim", "Kit", "Luca", "Rafa", "Miriam", "Aya", "Carmen", "Omar", "Anika", "Shan", "Luka", "Theo", "Emma", "Julian", "Adrian", "Ari", "Noah", "Maya", "Ariel"],
	"surnameBase" : ["Chao", "Fillmore", "García", "Bond", "Wong", "Wei", "Goldsmith", "Tran", "Chu", "Baudin", "Montagne", "Moulin", "Villeneuve", "Victor", "Rodríguez", "Smith", "Johnson", "Williams", "Miller", "Stockton", "Patel", "Chaudri", "Jahan", "Christiansen", "Jones", "Stein", "Hirviniemi", "Kiuru", "Øvregard", "Singh", "Noriega", "Pine", "Clarion", "Belden", "Jaware", "Keita", "Kanu", "Geary", "Norton", "Kearny", "Aliyev", "Sato", "Tanaka", "Kim", "Lee", "Gray", "Yang", "Li", "Çelik", "Davis", "Knox", "Griffin", "Leon", "Finch", "Yoo", "Gupta", "Flores", "Lopez", "Moon", "Sun", "Castro", "Suzuki", "Torres", "Pineda", "Tsao", "Romero", "Wolf"],
	"surname" : ["#surnameBase#", "#surnameBase#-#surnameBase#", "#hpn#"],


	"flavorAdj" : ["special", "dark", "light", "bitter", "burnt", "savory", "flavorful", "aromatic", "fermented", "herbal", "pleasant", "harsh", "smoky", "sweet", "fresh", "refreshing", "somber", "bright", "perky", "sullen", "acidic", "sour", "peaty", "juicy", "perfumed", "buttery", "lush", "brisk", "strong", "weak", "tart", "tangy", "bold", "overpowering", "light", "faint", "subtle", "bright", "zesty", "austere", "round", "big", "buttery", "oaky", "peaty", "seedy", "gritty", "creamy", "smooth", "rustic", "complex", "chewy", "sweet", "crisp", "dense", "bold", "elegant", "sassy", "opulent", "massive", "wide", "flamboyant", "fleshy", "approachable", "jammy", "juicy", "refined", "silky", "structured", "steely", "rich", "toasty", "burnt", "velvety", "unctuous", "oily"],


	"toasted" : ["toasted", "burnt", "singed", "fried"],
	"spread" : ["splashed", "spread", "layered", "drizzled", "layered"],
	"sauce" : ["salsa", "reduction", "vinagrette", "sauce", "jam", "puree", "butter", "jelly", "preserves"],
	"herbPrep" : ["dried", "shredded", "minced", "fried"],

	"preparedMeat" : ["duck fat<poultry><duck>", "roast duck<poultry><duck>", "crispy bacon<pork><bacon>", "pancetta", "salami", "prosciutto", "corned beef", "pastrami", "roast game hen", "seared ahi"],


	"herb" : ["fennel", "cilantro", "mint", "basil", "thyme", "Thai basil", "oregano", "peppermint", "spearmint", "rosemary"],
	"spice" : ["vanilla", "nutmeg", "allspice", "turmeric", "cardamom", "saffron", "cinnamon", "chili powder", "cayenne", "coriander", "black pepper", "white pepper", "ginger", "za’atar"],


	"largeFruit" : ["kumquat<citrus>", "honeydew<melon>", "bittermelon<melon>", "cherimoya", "peach", "sugar apple", "persimmon", "green apple", "jackfruit", "damson plum", "kiwi", "lime<citrus>", "key lime<citrus>", "meyer lemon<citrus>", "pomegranate", "green apple", "pineapple", "mandarin orange<citrus>", "blood orange<citrus>", "plum", "bosque pear", "fig", "persimmon", "durian", "mango", "lychee"],
	"smallFruit" : ["black cherry", "raisin", "cranberry", "blueberry", "raspberry", "lingonberry", "boysenberry", "elderberry", "black grape", "champagne grape", "blackberry", "marionberry", "açaí berry", "blackcurrant", "currant", "pomegranate seed"],
	"fruit" : ["#largeFruit#", "#smallFruit#"],

	"greens" : ["baby spinach", "endive", "radicchio", "arugula", "beet greens", "mustard greens", "green onion", "watercress"],

	"nut" : ["almond<nut>", "macademia nut<nut>", "cacao nib<chocolate>", "walnut<nut>", "pumpkin seed<seed>", "cashew<nut>", "pecan", "pistachio"],
	"vegetable" : ["kale", "summer squash", "rampion", "napa cabbage", "rutabaga", "carrots", "fennel", "spring onions", "arugula", "kabocha", "artichokes"],
	"ingredient" : ["#vegetable#", "#fruit#", "#nut#", "#greens#"],

	"cream" : ["coconut milk<coconut><nut>", "whipped cream<dairy>", "almond milk<nut>", "hemp milk", "organic milk<dairy>", "soy", "fermented dairy", "yoghurt", "goat's milk"],

	"bread" : ["challah", "raisin bread", "pumpernickel", "wheat bread", "sourdough", "white bread", "rye"],

	"fancyBread" : ["#bread# french toast", "toast", "grilled #bread#", "fresh-baked #bread#", "#bread#", "toasted #bread#"],
	"fancySauce" : ["#fruit# #sauce#", "#nut# #sauce#", "#ingredient.a#-#ingredient# reduction"],

	"topping" : ["#herbPrep# #herb#", "#spice# and #spice#", "#nut.s#", "#smallFruit#"],
	"sprinkled" : ["topped", "accessorize", "sprinkled", "accented"],
	"smallIngredient" : ["#smallFruit.s#", "chopped #nut.s#", "shredded #herb#"],

	"toastName" : ["#hpn# Toast", "#ingredient.capitalizeAll# Toast", "#name#'s Toast", "#name#'s #flavorAdj.capitalize# Toast"],
	"toastDesc" : ["#fancySauce.capitalize# #spread# on #fancyBread#", "#fancySauce.capitalize# #spread# on #toasted# #fancyBread#", "#topping.capitalize# on a slice of #fancyBread#", "#topping.capitalize# on #fancyBread#, #sprinkled# with #smallIngredient#"],

	"redWineType" : ["rioja", "burgundy", "merlot", "pinot noir", "syrah", "shiraz", "grenache", "malbec", "petit sirah", "zinfandel"],
	"whiteWineType" : ["white zinfandel", "champagne", "riesling", "chardonnay", "chenin blanc", "gewürztraminer", "muscat"],

	"coffeeServing" : ["with a dollop of #cream#", "as a #cream# latte", "topped with #cream# foam", "black", "as a pourover", "clover-style", "French Press", "in a teacup", "in a moka pot", "in a teapot", "in a pile of discarded Keurig cups", "with #cream#"],
	"coffeeServingInstruction" : ["Served #coffeeServing#", "Available #coffeeServing# or #coffeeServing#", "Try it #coffeeServing#", "Available #coffeeServing#"],
	"coffeeType" : ["arabica", "decaf", "mocha", "grind", "espresso", "french roast", "dark roast", "light roast", "#flavorMod# roast", "extra #flavorMod# roast"],

	"vinyard" : ["vinyard", "vines", "estate", "cellars", "barrels"],

	"flavorMod" : ["special", "dark", "light", "bitter", "burnt", "savory", "flavorful", "aromatic", "fermented", "herbal", "pleasant", "harsh", "smoky", "sweet", "fresh", "refreshing", "somber", "bright", "perky", "sullen", "acidic", "sour", "peaty", "juicy", "perfumed", "buttery", "lush", "brisk", "strong", "weak", "tart", "tangy", "bold", "overpowering", "light", "faint", "subtle"],
	"flavor" : ["spearmint", "tobacco", "agave", "coffee", "cocoa powder", "chocolate", "sea salt", "kosher salt", "brown sugar", "cinnamon", "motor oil", "lavender", "spice", "black pepper", "cardamom", "pumpkin spice", "caramel", "toffee", "butterscotch", "peppermint", "walnut", "acid", "pear", "citrus", "grenadine", "smoke", "iodine", "coriander", "cinnamon", "acid", "salt", "sugar", "maple", "coffee", "whiskey", "regret", "sorrow", "blood", "gasoline", "grass", "cigarettes", "pine", "tar", "saltwater", "rosewater", "jasmine", "espresso", "green apple", "#fruit#", "#fruit#", "#fruit#", "#fruit#", "#fruit#"],

	"they" : ["she", "he", "they", "I"],
	"them" : ["her", "him", "them", "me"],
	"their" : ["her", "his", "their", "my", "your"],

	"texture" : ["silky", "rough", "textured", "rippling", "creased", "pleated", "ruffled", "starched", "supple", "satiny", "velvety"],
	"fabric" : ["leather", "taffeta", "satin", "silk", "lamé", "calico", "jersey", "sateen", "lace", "alpaca", "wool", "burlap", "cashmere", "angora", "pleather", "cotton", "rayon", "nylon"],
	"suprising" : ["welcome", "unexpected", "unfamiliar", "surprising"],
	"knowledge" : ["awareness", "a realization", "a dream", "the fantasy", "the dream", "the illusion", "the hope"],
	"love" : ["love", "know", "kiss", "see", "fear", "hear", "agree with", "forgive", "be forgiven by", "fight with", "reconcile with", "hold"],
	"relative" : ["grandmother", "mother", "grandfather", "father", "son", "daughter", "child", "first child"],
	"memory" : ["remembrance", "a sense of peace", "serenity", "the inevitability of death", "the immateriality of all things", "fall leaves", "newfallen snow", "the ocean", "your first kiss", "mother's perfume", "your future", "your dreams", "your past", "destiny", "faint hope", "false hope", "loss", "sunscreen in the summer", "the heat of the sun", "bitter cold", "forgiveness", "a newborn child", "the first day of school", "the day #they# left", "the first day you saw #them#", "autumn leaves", "the sea at night", "your #relative#'s smile", "father's aftershave", "grass after the rain", "disappointment", "Christmas morning", "birthday cake", "wedding cake", "#knowledge# that you will never #love# your #relative#", "what it is to #love# someone", "#knowledge#, just #knowledge#"],
	"gone" : ["gone", "lost", "past", "forgotten", "forgiven"],
	"rhetoricalQuestion" : ["#they# will not return this time.", "that time is #gone#", "could #they# even #love# you?", "what would #they# say if #they# knew?", "you can never #love# #them# again.", "it is #gone#, all is #gone#.", "#gone#, it is too late to #love# #them#.", "this is not what #they# wanted.", "all you wanted was #memory#.", "this was not #their# #intention#.", "what did you think would happen?"],
	"intention" : ["intention", "plan"],
	"adj" : ["#landscapeAdj#", "#color#", "#flavorMod#", "#texture#", "#weirdAdj#"],
	"noun" : ["#weirdNoun#", "#flavor#", "#vegetable#", "#animal#", "#landscapeFeature#"],

	"landscapeAdj" : ["rainy", "windy", "old", "grey", "dark", "creaky", "quiet", "silent", "fair", "shadow", "verdant", "sunny", "far", "near", "dry", "dead"],
	"landscapeFeature" : ["river", "mountain", "forest", "mines", "pines", "falls", "glen", "garden", "mansion", "village", "isle", "bayou", "swamp", "hill", "creek", "rainforest", "desert"],
	"landscapeComplex" : ["#landscapeAdj# #landscapeFeature#"],

	"hint" : ["echo", "reminder", "hint", "overtone", "insinuation", "note", "undertone", "counterpoint"],

	"blendsWith" : ["mingles with", "counterbalances", "contrasts with", "complements", "clashes with", "harmonizes with", "accents"],
	"flavorAttr" : ["#hint.a# of #flavor#", "#texture# on your tongue", "#flavorMod# and #flavorMod# as #memory#", "it is #flavorMod# and #flavorMod# as #memory#", "#flavor#, #flavor#, and #flavor# #hint.s#", "#flavorMod# #flavor#, with #hint.s# of #flavor#", "#flavor# #blendsWith# #flavorMod# #flavor#", "#flavorMod# #flavor# #blendsWith# #flavorMod# #flavor#", "#flavorMod# #flavor#", "#flavorMod# #fruit.s#", "#hint.s# of #flavorMod# #flavor#", "#flavorMod# and #flavorMod#", "#flavorMod# #flavor# #hint.s#", "it smells of #memory#", "it reminds you of  #memory#", "you smell #memory#", "you remember #memory#", "you taste #memory#", "all you can taste is #memory#", "you #areDrowningIn# #flavorMod# #flavor#"],

	"areDrowningIn" : ["drown in a sea of", "struggle against a tide of", "are overpowered by", "smell nothing but", "are in a sea of", "are becoming one with", "are lost in"],
	"weirdAdj" : ["shadow", "rusty", "wild", "weird", "sweet", "fairy", "flame", "last", "ever", "never", "dead", "kings", "gods", "queens", "other", "dire", "fallow", "naked", "monster", "black", "new", "star", "white", "chosen", "forbidden", "great", "lost", "fallen", "idle", "joyful"],
	"weirdNoun" : ["hand", "head", "song", "harp", "fate", "dancer", "rider", "fire", "jack", "spring", "wind", "hair", "fall", "heart", "spirit", "mind", "soul", "one", "being", "star", "blood", "bone"],
	"animal" : ["horse","goat","impala","wombat","fox","wolf","coyote","dingo","centaur","amoeba","mongoose","capybara", "yeti","dragon","unicorn","gryphon","sphinx","kangaroo","boa"],

	"wineType" : ["#redWineType#", "#whiteWineType#"],

	"wineBrand" : ["#adj.capitalizeAll# #landscapeFeature.capitalizeAll#", "#hpn.capitalizeAll#", "#weirdAdj.capitalize##weirdNoun#", "#adj.capitalizeAll# #animal.capitalizeAll#"],

	"servedWith" : ["served with", "on a bed of", "rolled in", "topped with"],
	"prep" : ["crumbled", "sauteed", "broken", "shredded", "smashed", "layered", "pureed", "burnt", "gellied"],

	"coreDessert" : ["#prep# #dessertNoun.s#", "#flavor# #dessertNoun.s#", "#flavorMod# #flavor# #dessertNoun.s#"],
	
	"dessertMod" : [" in the shape of #animal.a#", "in a #fruit#-#flavor# #sauce#", "#servedWith# #coreDessert#", "topped with #fruit# jam", "sprinkled with #nut.s#"],

	"dessertNoun" : ["#fruit#", "#fruit#", "#fruit#", "#nut#", "gingersnap", "meringue", "macaron", "spongecake", "macaroon", "cookie", "cake", "biscuit", "cupcake", "scone", "financier"],
	"dessertNick" : ["trifle", "fluff", "kiss", "decadence", "seduction", "big idea", "invention", "sweetness", "happiness", "flurry", "fancy", "frivolity", "jam"],

	
	"dessertDesc" : ["#coreDessert# #dessertMod#"],
	"dessertName" : ["#weirdAdj.capitalize#cake", "The #color.capitalize# #animal.capitalize# #dessertNick.capitalize#", "#name#'s #dessertNick.capitalize#", "#name#'s #weirdAdj.capitalize# #dessertNick.capitalize#", "#name#'s #flavorMod.capitalize# #dessertNick.capitalize#", "#frenchPlaceName.capitalize# #dessertNick.capitalize#", "#hpn.capitalize# #dessertNick.capitalize#"],

	"coffeeName" : ["#hpn# #coffeeType.capitalizeAll#", "#landscapeComplex.capitalizeAll# #coffeeType.capitalizeAll#", "#name#'s #coffeeType.capitalizeAll#"],
	"coffeeDesc" : ["#flavorAttr.capitalize#.  #coffeeServingInstruction#.", "#flavorAttr.capitalize# and #flavorAttr#.  #coffeeServingInstruction#."],

	"wineName" : ["#wineBrand# #vinyard.capitalize# #wineType.capitalizeAll#", "#frenchPlaceName.capitalize#",  "#frenchPlaceName.capitalize# #vinyard.capitalize#"],
	"wineDesc" : ["#flavorAttr.capitalize#, #flavorAttr#", "#flavorAttr.capitalize#. #flavorAttr.capitalize#", "#flavorAttr.capitalize# and #rhetoricalQuestion#", "#rhetoricalQuestion.capitalize# #rhetoricalQuestion.capitalize# #flavorAttr.capitalize#", "#flavorAttr.capitalize#, #flavorAttr#.  #flavorAttr.capitalize#. #rhetoricalQuestion.capitalize#", "#flavorAttr.capitalize#. #flavorAttr.capitalize#. #rhetoricalQuestion.capitalize#"],
	"descStyle": "style='10px;'",
	"food": ["<b>#dessertName#</b><br><i>#dessertDesc#</i>", "<b>#toastName#</b><br><i>#toastDesc#</i>"],
	"drink": ["Coffee:<b>#coffeeName#</b><br><i>#coffeeDesc#</i>", "Wine:<b>#wineName#</b><br><i>#wineDesc#</i>"],
	"dessert": ["<b>#dessertName#</b><br><i>dessertDesc</i>"],
	"origin": "Le Menu<hr>Dessert:#food#<br><p style='font-size:10px;'><br>with<br></p> #drink#"

}