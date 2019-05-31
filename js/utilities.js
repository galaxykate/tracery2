/**
 * @author Kate Compton
 */



// serialPromise([1, 2, 3], (v, resolve, reject) => {
// 	console.log("start timeout " + v)
// 	setTimeout(() => resolve(v), 1000);
// }, (results) => console.log(results))
// Adapted from https://gist.github.com/anvk/5602ec398e4fdc521e2bf9940fd90f84
function serialPromise(array, handleVal, onResults) {
	let final = [];

	function valToPromise(v) {
		return new Promise((resolve, reject) => {
			handleVal(v, resolve, reject)
		});
	}

	function workMyCollection(arr) {
		return array.reduce((promise, v) => {
			return promise
				.then((result) => {
					return valToPromise(v).then(result => final.push(result));
				})
				.catch(console.error);
		}, Promise.resolve());
	}

	workMyCollection(array)
		.then(() => onResults(final));

}



// Converts canvas to an image
// https://davidwalsh.name/convert-canvas-image
function convertCanvasToImage(canvas) {
	var image = new Image();
	image.src = canvas.toDataURL("image/png");
	return image;
}

function canvasToThreeTexture(loader, canvas, callback) {
	var dataURL = canvas.toDataURL();
	// Create texture for material

	loader.load(
		// resource URL
		dataURL,

		// onLoad callback
		function(texture) {
			callback(texture);
		},

		// onProgress callback currently not supported
		undefined,

		// onError callback
		function(err) {
			console.error('An error happened.');
		}
	);

}

/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */

function extend(destination, source) {
	for (var k in source) {
		if (source.hasOwnProperty(k)) {
			destination[k] = source[k];
		}
	}
	return destination;
}

// https://stackoverflow.com/questions/7616461/generate-a-hash-from-string-in-javascript-jquery
String.prototype.hashCode = function() {
	var hash = 0,
		i, chr;
	if (this.length === 0) return hash;
	for (i = 0; i < this.length; i++) {
		chr = this.charCodeAt(i);
		hash = ((hash << 5) - hash) + chr;
		hash |= 0; // Convert to 32bit integer
	}
	return hash;
};


function AnimTime() {
	this.start = Date.now() * .001;
	this.current = 0;
	this.elapsed = .01;
	this.frame = 0;

}

AnimTime.prototype.update = function() {
	this.last = this.current;
	this.current = Date.now() * .001 - this.start;

	this.elapsed = Math.min(Math.max(this.current - this.last, .001), .1);
	this.frame++;
}

function OrbitalCamera(camera) {
	this.center = new Vector(0, 0, 0);
	this.phi = 0;
	this.theta = 0;
	this.r = 2000;
	this.bphi = 0;
	this.btheta = 0;
	this.cameraPos = new Vector()
	this.camera = camera;
}

OrbitalCamera.prototype.offsetFromBookmark = function(theta, phi) {
	this.theta = this.btheta + theta;
	this.phi = this.bphi + phi;
	this.update();
}
OrbitalCamera.prototype.bookmark = function() {
	this.btheta = this.theta;
	this.bphi = this.phi;
}

OrbitalCamera.prototype.setTo = function(r, theta, phi) {
	this.r = r;
	this.theta = theta;
	this.phi = phi;
	this.update();
	this.bookmark()
}
OrbitalCamera.prototype.update = function() {

	this.cameraPos.setToSpherical(this.r, this.theta, this.phi)
	this.cameraPos.add(this.center)
	this.camera.up.set(0, 0, 1);
	this.cameraPos.cloneInto(this.camera.position)
	let v = new THREE.Vector3()
	this.center.cloneInto(v)
	this.camera.lookAt(v);

}



var utilities = {
	createThree: function(holder, init, update, postRender, preventRender) {
		// ANIMATION CALL 
		function animate() {
			requestAnimationFrame(animate);
			render();
		}

		let time3 = new AnimTime()


		// RENDER LOOP
		function render() {

			time3.update();

			let r = 100 * (1.4 + Math.sin(time3.current * .008));
			let phi = .7
			let theta = time3.current * .1;
			// if (!orbitalCamera.isControlled)
			// 	orbitalCamera.setTo(r, theta, phi)

			// camera.position.x = Math.cos(timer) * 1000;
			// camera.position.z = Math.sin(timer) * 1000;


			renderer.render(scene, camera);
			update(time3)
		}



		var w = holder.width();
		var h = holder.height();


		let dragX, dragY
		holder.draggable({

			helper: function() {
				return "<div class='draggable'></div>";
			},
			start: function() {
				dragX = event.clientX - holder.offset().left;
				dragY = event.clientY - holder.offset().top;

				orbitalCamera.bookmark();
				orbitalCamera.isControlled = true

			},
			stop: function() {
				orbitalCamera.bookmark();
				orbitalCamera.isControlled = false
			},
			drag: function(ev, ui) {
				var x = event.clientX - holder.offset().left - dragX;
				var y = event.clientY - holder.offset().top - dragY;
				orbitalCamera.offsetFromBookmark(x * .006, -y * .005);
				orbitalCamera.update();
			},
		}).on('mousewheel', function(event, ui) {
			console.log("MOUSEWHEEL", event.deltaY)
			orbitalCamera.r += event.deltaY;

			orbitalCamera.update();

		});


		// CREATE RENDERER
		let renderer = new THREE.WebGLRenderer({
			antialias: true,
			alpha: true,
		});
		renderer.setSize(w, h);


		holder.get(0).appendChild(renderer.domElement);

		renderer.setClearColor(0x000000, 0);

		// CREATE CAMERA 				
		let camera = new THREE.PerspectiveCamera(45, w / h, 1, 2000);
		let orbitalCamera = new OrbitalCamera(camera)



		// CREATE SCENE 		
		let scene = new THREE.Scene();
		var geometry = new THREE.BoxGeometry(1, 1, 1);
		var material = new THREE.MeshNormalMaterial();
		for (var i = 0; i < 0; i++) {
			let r = Math.pow(i, .5) * 10;
			let theta = .8 * Math.pow(i, .65)
			let phi = .3 * Math.sin(i * .2)
			let v = Vector.spherical(r, theta, phi)
			let m = new THREE.Mesh(geometry, material)
			v.cloneInto(m.position)
			scene.add(m)
		}

		// LIGHTS

		// 	var light = new THREE.PointLight(0xcccccc, 1);
		// 	light.position.set(50, 500, -500);
		// 	scene.add(light);
		// 	var light = new THREE.PointLight(0x2222ff, 1);
		// 	light.position.set(-50, -500, -500);
		// 	scene.add(light);

		// 	var ambient = new THREE.AmbientLight(0xffffff, 0.9);
		// scene.add(ambient);


		let time = new AnimTime();
		init(time, scene, orbitalCamera, renderer)
		animate();

	},


	// control the processing view
	createProcessing: function(holder, onUpdate, onDraw, onStart, dragFxns) {

		var canvas = $("<canvas/>").appendTo(holder).css({
			width: "100%",
			height: "100%",
			left: "0px",
			top: "0px",
			position: "absolute"
		});
		var w = canvas.width();
		var h = canvas.height();



		var processingInstance = new Processing(canvas.get(0), function(g) {

			// Set the size of processing so that it matches that size of the canvas element

			let time = new AnimTime()

			g.size(w, h);
			g.colorMode(g.HSB, 1);
			g.ellipseMode(g.CENTER_RADIUS);
			if (onStart) {
				g.pushMatrix();
				g.translate(w / 2, h / 2);
				onStart(g, time);
				g.popMatrix();
			}

			g.draw = function() {
				time.update();

				onUpdate(time, g);



				g.pushMatrix();
				g.translate(w / 2, h / 2);

				onDraw(g, time);
				g.popMatrix();

			};
		});


		if (dragFxns) {

			let dragX, dragY
			holder.draggable({

				helper: function() {
					return "<div class='draggable'></div>";
				},
				start: function() {
					dragX = event.clientX - holder.offset().left - w / 2;
					dragY = event.clientY - holder.offset().top - h / 2;
					dragFxns.onStartDrag(dragX, dragY)

				},
				stop: function() {
					dragFxns.onStopDrag(dragX, dragY)
				},
				drag: function(ev, ui) {

					var x = event.clientX - holder.offset().left - w / 2;
					var y = event.clientY - holder.offset().top - h / 2;

					var offsetX = x - dragX
					var offsetY = y - dragY
					dragFxns.onDrag(x, y, offsetX, offsetY)
				},
			}).on('mousewheel', function(event, ui) {
				console.log("MOUSEWHEEL", event.deltaY)


			});

		}
	},

	noiseObj: new SimplexNoise(Math.random),

	noise: function() {
		// use the correct number of args
		switch (arguments.length) {
			case 1:
				return utilities.noiseObj.noise2D(arguments[0], 1000);
				break;
			case 2:
				return utilities.noiseObj.noise2D(arguments[0], arguments[1]);
				break;
			case 3:
				return utilities.noiseObj.noise3D(arguments[0], arguments[1], arguments[2]);
				break;
			case 4:
				return utilities.noiseObj.noise4D(arguments[0], arguments[1], arguments[2], arguments[3]);
				break;
			default:
				console.log("Attempting to use Noise with " + arguments.length + " arguments: not supported!");
				return 0;
				break;
		}
	},

	seedNoise: function(rnd) {
		utilities.noiseObj = new _Noise(rnd);
	},

	// convert angle to -PI, PI
	normalizeAngle: function(angle) {
		angle = angle % (Math.PI * 2);
		if (angle > Math.PI)
			angle -= Math.PI * 2;
		return angle;
	},
	// put noise in here too?
	capitaliseFirstLetter: function(string) {
		return string.charAt(0).toUpperCase() + string.slice(1);
	},

	lowerCaseFirstLetter: function(string) {
		return string.charAt(0).toLowerCase() + string.slice(1);
	},

	words: {
		emoji:("😎 🤓 😍 😀 😭 😡 😳 😱 😈 😺 👎 👍 🎃 🤖 👻 ☠️ 👽 👾 🤠 ✍️ 👀 🧠 👩‍🚀 🧝‍♀️ 🦹‍♂️ 🧙‍♀️ 👸 👩‍💻 🕵️‍♀️ 🧶 🧵 👗 🥼 👕 👘 👖 👠 👞 🧤 🧦 🧢 🎩 👑 💍 👓 🕶 🥽 🐶 🐱 🐭 🐰 🦊 🐻 🐼 🐨 🐯 🦁 🐮 🐷 🐸 🐵 🐣 🦆 🦅 🦉 🦇 🐗 🐴 🦄 🐝 🐛 🦋 🐌 🐞 🐜 🦟 🐢 🐍 🕷 🦂 🐍 🦎 🦖 🐙 🦑 🦞 🦀 🐋 🦈 🐟 🐬 🐡 🐊 🐅 🐆 🦓 🦍 🐘 🦛 🦏 🐪 🐫 🦒 🦘 🐃 🐂 🐄 🐎 🐖 🐏 🐑 🦙 🐐 🦌 🐕 🐩 🐈 🐓 🦃 🦚 🦜 🦢 🐇 🦝 🦡 🐁 🐀 🐿 🦔 🐾 🐉 🌵 🎄 🌲 🌳 🌴 🌱 🌿 ☘️ 🍃 🍂 🍁 🍄 🐚 🌾 🌷 🥀 🌺 🌹 🌸 🌼 🌻 🌞 🌛 ⭐️ 💫 🌟 ✨ ⚡️ ☄️ 💥 🔥 🌪 🌈 ☀️ ☁️ 🌧 🌩 ❄️ ☃️ 💨 💧 💦 ☂️").split(" "),

		syllables: {
			first: "B P T T T N M M M B C D F G Ph J K L M N P Qu R S T V W X Y Z St Fl Bl Pr Kr Ll Chr Sk Br Sth Ch Dhr Dr Sl Sc Sh Thl Thr Pl Fr Phr Phl Wh".split(" "),
			middle: "an ad in an on ion ill oop ack ist all ar art air aean eun eun euh esqu aphn arl ifn ast ign agn af av ant app ab er en eor eon ent enth iar ein irt ian ion iont ill il ipp in is it ik ob ov orb oon ion uk uf un ull urk".split(" "),
			composites: "estr antr okl ackl".split(" "),
			last: "e a i ie ei a ay oy y a ia ea u y en am is on an o ang ing io i el ios ius ae ie ee i".split(" "),
		},
		places: ["room", "sea", "room", "forest", "pagoda", "temple", "sanctuary", "ocean", "wall", "dungeon", "cave", "sky", "house", "mountain", "sanctum", "palace", "river", "place", "desert", "island", "castle", "house", "inn", "tavern", "tower", "oasis", "tent"],
		stuff: ["stone", "sorrow", "eyes", "flowers", "time", "music", "storms", "rhyme", "freedom", "rhythm", "wind", "life", "ice", "gold", "mysteries", "song", "waves", "dreams", "water", "steel", "iron", "memories", "thought", "seduction", "remembrance", "loss", "fear", "joy", "regret", "love", "friendship", "sleep", "slumber", "mirth"],
		animals: "cobra okapi moose amoeba mongoose capybara yeti dragon unicorn sphinx kangaroo boa nematode sheep quail goat corgi agouti zebra giraffe rhino skunk dolphin whale bullfrog okapi sloth monkey orangutan grizzly moose elk dikdik ibis stork finch nightingale goose robin eagle hawk iguana tortoise panther lion tiger gnu reindeer raccoon opossum".split(" "),
		moods: "vexed indignant impassioned wistful astute courteous benevolent convivial mirthful lighthearted affectionate mournful inquisitive quizzical studious disillusioned angry bemused oblivious sophisticated elated skeptical morose gleeful curious sleepy hopeful ashamed alert energetic exhausted giddy grateful groggy grumpy irate jealous jubilant lethargic sated lonely relaxed restless surprised tired thankful".split(" "),
		colors: "ivory silver ecru scarlet red burgundy ruby crimson carnelian pink rose grey pewter charcoal slate onyx black mahogany brown green emerald blue sapphire turquoise aquamarine teal gold yellow carnation orange lavender purple magenta lilac ebony amethyst jade garnet".split(" "),
		material: "fire water cybernetic steampunk jazz steel bronze brass leather pearl cloud sky river great crystal rainbow iron gold silver titanium".split(" "),
		adventures: "lament tale myth story epic tears wish desire dance mystery enigma drama path training sorrows joy tragedy comedy riddle puzzle regret victory loss song adventure question quest vow oath tale travels".split(" "),
		getRandomBotName: function() {
			var adj = randomCap(utilities.words.moods);
			if (Math.random() > .8)
				adj = randomCap(utilities.words.material);
			if (Math.random() > .6)
				adj = randomCap(utilities.words.colors);

			return adj + " " + randomCap(utilities.words.animals);
		},

		getUserName: function() {
			var f = utilities.getRandom(utilities.words.moods);
			if (Math.random() > .5)
				f = utilities.getRandom(utilities.words.colors);
			f = utilities.capitaliseFirstLetter(f);
			f += utilities.capitaliseFirstLetter(utilities.getRandom(utilities.words.animals));
			if (Math.random() > .6)
				f += Math.floor(Math.random() * 50);
			return f;
		},

		getStatement: function() {
			return "This " + utilities.getRandom(utilities.words.moods) + " " + utilities.getRandom(utilities.words.adventures) + " made me " + utilities.getRandom(utilities.words.moods);
		},

		getRandomTitle: function() {
			let adv = utilities.capitaliseFirstLetter(getRandom(this.adventures));
			let animal = utilities.capitaliseFirstLetter(getRandom(this.animals));
			let stuff = utilities.capitaliseFirstLetter(getRandom(this.stuff));
			let place = utilities.capitaliseFirstLetter(getRandom(this.places));
			let material = utilities.capitaliseFirstLetter(getRandom(this.material));
			var adj = getRandom(this.moods);
			if (Math.random() > .5)
				adj = getRandom(this.colors);
			adj = utilities.capitaliseFirstLetter(adj)
			if (Math.random() > .4)
				adv = place

			let prefix = "";
			if (Math.random() > .4) {
				prefix = utilities.capitaliseFirstLetter(getRandom([this.getRandomWord(1) + "'s", this.getRandomWord(.5) + "'s", this.getRandomWord(.5) + "'s", "a", "every", "any", "this", "my", "our", "his", "her", "some", "the", "a", "last", "no"]));
				prefix += " "
			}


			let prefix2 = "";
			if (Math.random() > .4) {
				prefix2 = utilities.capitaliseFirstLetter(getRandom([this.getRandomWord(1) + "'s", this.getRandomWord(.5) + "'s", this.getRandomWord(.5) + "'s", "a", "every", "any", "this", "my", "our", "his", "her", "some", "the", "a", "last", "no"]));
				prefix2 += " "
			}

			let word = utilities.capitaliseFirstLetter(this.getRandomWord(.5));

			if (Math.random() > .9)
				return "The " + adj + " " + adv;
			if (Math.random() > .8)
				return prefix + adj + " " + place;


			if (Math.random() > .7)
				return prefix + adv + " " + getRandom(["of", "for", "under", "in", "beyond"]) + " " + prefix2 + stuff;
			if (Math.random() > .8)
				return animal + "'s " + adv;
			if (Math.random() > .7)
				return prefix + adv + " of " + stuff;
			if (Math.random() > .5)
				return word + "'s " + adv;
			if (Math.random() > .4)
				return prefix + word;
			return "The " + adv + " of the " + adj + " " + animal;
		},

		getRandomWord: function(lengthMult) {
			if (!lengthMult)
				lengthMult = 1;
			var s = utilities.getRandom(this.syllables.first);
			if (Math.random() < .2)
				s = utilities.getRandom(this.syllables.middle);

			var count = Math.floor(Math.random() * lengthMult * 3);
			for (var i = 0; i < count; i++) {
				var mid = utilities.getRandom(this.syllables.middle);
				s += mid;

			}
			s += utilities.getRandom(this.syllables.last);

			if (s.length > 6 * lengthMult && Math.random < .8)
				s = utilities.words.getRandomWord();
			if (s.length > 9 * lengthMult && Math.random < .9)
				s = utilities.words.getRandomWord();

			if (s.length < 6 * lengthMult && Math.random() < .2)
				s += " " + utilities.words.getRandomWord();
			else if (s.length < 6 * lengthMult && Math.random() < .2)
				s += "'" + utilities.getRandom(this.syllables.last);

			return s;
		},

		getDollName: function() {
			return utilities.capitaliseFirstLetter(utilities.words.getRandomWord());
		}
	},

	arrayToString: function(array) {
		s = "";
		$.each(array, function(index, obj) {
			if (index !== 0)
				s += ", ";
			s += obj;
		});
		return s;
	},
	inSquareBrackets: function(s) {
		return "[" + s + "]";
	},
	getSpacer: function(count) {
		var s = "";
		for (var i = 0; i < count; i++) {
			s += " ";
		}
		return s;
	},

	getTabSpacer: function(count) {
		var s = "";
		for (var i = 0; i < count; i++) {
			s += "\t";
		}
		return s;
	},

	sigmoid: function(v) {
		return 1 / (1 + Math.pow(Math.E, -v));
	},

	sCurve: function(v, iterations) {
		if (iterations === undefined)
			iterations = 1;
		for (var i = 0; i < iterations; i++) {
			var v2 = .5 - .5 * Math.cos(v * Math.PI);
			v = v2;
		}
		return v;
	},

	raiseRatio: function(ratio, boost, pct) {
		return Math.pow(ratio, 2 * boost * (pct - .5))
	},

	within: function(val, min, max) {
		return (val >= min) && (val <= max);
	},

	// Inefficient, fix someday
	// the weight is determined by the function getWeight(index, item, list)
	getWeightedRandomIndex: function(array) {
		var totalWeight = 0;
		var length = array.length;

		for (var i = 0; i < length; i++) {

			totalWeight += array[i];
		};

		var target = Math.random() * totalWeight;
		var cumWeight = 0;

		for (var i = 0; i < length; i++) {
			cumWeight += array[i];

			if (target <= cumWeight) {
				return i;
			}

		};

	},

	// Get a random, from an array
	getRandom: function(array, power) {
		if (power)
			return array[Math.floor(Math.pow(Math.random(), power) * array.length)];
		else
			return array[Math.floor(Math.random() * array.length)];
	},

	// Get a random, from an array
	// Not fully random?
	getRandomUnique: function(arr, count) {
		let n = []

		if (count <= arr.length) {
			while (n.length < count) {
				let i = Math.floor(Math.random() * arr.length);
				if (!n.includes(arr[i])) {

					n.push(arr[i])
				}
			}
			return n
		}
		return arr.slice(0)
	},

	getRandomIndex: function(array) {
		return Math.floor(Math.random() * Math.round(array.length - 1));
	},
	getRandomKey: function(obj) {
		return this.getRandom(Object.keys(obj));
	},

	constrain: function(val, lowerBound, upperBound) {
		if (Math.max(val, upperBound) === val)
			return upperBound;
		if (Math.min(val, lowerBound) === val)
			return lowerBound;
		return val;
	},
	lerp: function(start, end, percent) {
		return (start + percent * (end - start));
	},

	lerpAngles: function(start, end, pct) {
		var dTheta = end - start;
	},

	// angle between 0 and 2 PI
	normalizeAngle: function(theta) {
		var twopi = Math.PI * 2;
		theta = (((theta % twopi) + twopi) % twopi);
		return theta;
	},

	// Rertun a random, possible between two numbers
	random: function() {
		if (arguments.length === 0)
			return Math.random();
		if (arguments.length === 1)
			return Math.random() * arguments[i];
		if (arguments.length === 2)
			return Math.random() * (arguments[1] - arguments[0]) + arguments[0];

		return Math.random();
	},
	roundNumber: function(num, places) {
		// default 2 decimal places
		if (places === undefined) {
			return parseFloat(Math.round(num * 100) / 100).toFixed(2);
		} else {
			return parseFloat(Math.round(num * 100) / 100).toFixed(places);
		}
	},
	angleBetween: function(a, b) {
		var dTheta = b - a;
		dTheta = ((dTheta % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
		if (dTheta > Math.PI)
			dTheta -= Math.PI * 2;
		return dTheta;
	},

	addSlider: function(parent, overrideOptions, onChange) {

		var options = {
			range: "min",
			value: 50,
			min: 0,
			max: 100,
			step: 1,

		};
		$.extend(options, overrideOptions);

		options.slide = function(event, ui) {
			$("#" + options.key + "amt").text(ui.value);
			console.log("Slide " + ui.value);
			if (onChange !== undefined) {
				onChange(options.key, ui.value);
			}
		};

		// Create an empty slider div
		var optionDiv = $("<div/>", {
			class: "slider-holder"
		});
		optionDiv.css({
			"pointer-events": "auto"
		});
		parent.append(optionDiv);

		var slider = $('<div />', {
			id: 'slider_' + options.key,
			class: "tuning_slider",
			value: options.key
		});


		// Create a lable
		$('<label />', {
			'for': 'slider_' + options.key,
			text: options.key + ": "
		}).appendTo(optionDiv);

		// Create a lable
		$('<span />', {
			id: options.key + "amt",
			text: options.defaultValue
		}).appendTo(optionDiv);
		slider.appendTo(optionDiv);
		slider.slider(options);


		return slider;
	},

	HSVtoRGB: function(h, s, v) {
		var r,
			g,
			b;
		h *= 6;
		h = h % 6;

		var i = Math.floor(h);
		var f = h - i;
		var p = v * (1 - s);
		var q = v * (1 - (s * f));
		var t = v * (1 - (s * (1 - f)));
		if (i == 0) {
			r = v;
			g = t;
			b = p;
		} else if (i == 1) {
			r = q;
			g = v;
			b = p;
		} else if (i == 2) {
			r = p;
			g = v;
			b = t;
		} else if (i == 3) {
			r = p;
			g = q;
			b = v;
		} else if (i == 4) {
			r = t;
			g = p;
			b = v;
		} else if (i == 5) {
			r = v;
			g = p;
			b = q;
		}
		r = Math.floor(r * 255);
		g = Math.floor(g * 255);
		b = Math.floor(b * 255);
		return [r, g, b];
	},
};


/*
 *
 */

//================================================================
//================================================================
//================================================================
// KColor: new

function KColor(h, s, l, a) {
	this.h = ((h) % 1 + 1) % 1;
	this.s = s;
	this.l = l;
	this.a = a;
	if (this.a === undefined)
		this.a = 1;
}

// Lerp a [0, 1] value towards 0 or 1
function midLerp(v, a) {
	if (a > 0)
		return a + (1 - a) * v;
	return v * (a + 1);
}


// move the color to saturated darks or desaturated lights
KColor.prototype.shade = function(amt) {
	let s2 = midLerp(this.s, amt * .3);
	let l2 = midLerp(this.l, amt);

	return new KColor(this.h, s2, l2, this.a);
}

function falloffAmt(v, falloff) {
	if (v === 0)
		return 0;
	let sign = Math.abs(v) / v;
	return sign * Math.pow(Math.abs(v), falloff);
}

// move the color to saturated darks or desaturated lights
KColor.prototype.modify = function(mods, multiplier, falloff) {
	if (falloff === undefined)
		falloff = 1;
	if (multiplier === undefined)
		multiplier = 1;
	let satMod = falloffAmt(mods[2] * multiplier, falloff);
	let shade = falloffAmt(mods[1] * multiplier, falloff);
	let hueMod = falloffAmt(mods[0] * multiplier, falloff);


	let h2 = midLerp(this.h, hueMod);
	let s2 = midLerp(this.s, shade * .3 + .7 * satMod);
	let l2 = midLerp(this.l, shade);


	return new KColor(h2, s2, l2, this.a);
}



KColor.prototype.blue = function(amt) {
	let h2 = (this.h + .5) % 1
	// Move from .5 to the ends
	let h3 = utilities.sCurve(h2, 1)
	h3 = utilities.lerp(h2, h3, amt)
	let h4 = (h3 + .5) % 1


	return new KColor(h4, this.s, this.l, this.a);


}


// move the color to saturated darks or desaturated lights
KColor.prototype.alpha = function(amt) {

	return new KColor(this.h, this.s, this.l, .3);


}



// move the color to saturated darks or desaturated lights
KColor.prototype.lerp = function(c, amt) {

	return new KColor(lerp(this.h, c.h, amt), lerp(this.s, c.s, amt), lerp(this.l, c.l, amt), lerp(this.a, c.a, amt));


}
KColor.prototype.toCSS = function(amt, alpha) {
	let s2 = this.s;
	let l2 = this.l;
	let a = (alpha === undefined) ? 1 : alpha;
	if (amt !== undefined) {
		s2 = midLerp(this.s, amt * .3);
		l2 = midLerp(this.l, amt);
	}

	let val = (this.h * 360).toFixed(0) + ", " + (s2 * 100).toFixed(0) + "%, " + (l2 * 100).toFixed() + "%";
	let css = "hsla(" + val + ", " + a + ")";
	return css;

}

KColor.prototype.fill = function(g, shade, opacity, hueShift) {
	if (opacity === undefined)
		opacity = 1;
	if (hueShift === undefined)
		hueShift = 0;
	if (shade !== undefined) {
		let s2 = midLerp(this.s, shade * .3);
		let l2 = midLerp(this.l, shade);

		g.fill((this.h + hueShift + 100) % 1, s2, l2, opacity)
	} else
		g.fill((this.h + hueShift + 100) % 1, this.s, this.l, opacity)
}


KColor.prototype.stroke = function(g, shade, opacity, hueShift) {
	if (hueShift === undefined)
		hueShift = 0;
	if (opacity === undefined)
		opacity = 1;
	if (shade !== undefined) {
		let s2 = midLerp(this.s, shade * .3);
		let l2 = midLerp(this.l, shade);

		g.stroke((this.h + hueShift + 100) % 1, s2, l2, opacity)
	} else
		g.stroke((this.h + hueShift + 100) % 1, this.s, this.l, opacity)
}


function KGradient() {

}

//================================================================
//================================================================
//================================================================

var Vector = function(x, y, z) {

	if (Array.isArray(x)) {
		this.x = x[0];
		this.y = x[1];
		this.z = x[2];
	} else {
		// actually another vector, clone it
		if (x === undefined) {
			this.x = 0;
			this.y = 0;
			this.z = 0;
		} else {
			if (x.x !== undefined) {
				this.x = x.x;
				this.y = x.y;
				this.z = x.z;
			} else {
				this.x = x;
				this.y = y;

				this.z = 0;
				if (z !== undefined)
					this.z = z;

			}
		}
	}
	//if (!this.isValid())
	//	throw new Error(this.invalidToString() + " is not a valid vector");
}

function extend(a, b) {
	for (var key in b)
		if (b.hasOwnProperty(key))
			a[key] = b[key];
	return a;
}

extend(Vector.prototype, {
	clone: function() {
		return new Vector(this);
	},

	cloneInto: function(v) {
		v.x = this.x;
		v.y = this.y;
		v.z = this.z;
		return this;
	},

	addMultiple: function(v, m) {
		this.x += v.x * m;
		this.y += v.y * m;
		this.z += v.z * m;
		return this;
	},
	addPolar: function(r, theta) {
		this.x += r * Math.cos(theta);
		this.y += r * Math.sin(theta);
		return this;
	},

	addSpherical: function(r, theta, phi) {
		this.x += r * Math.cos(theta) * Math.cos(phi);
		this.y += r * Math.sin(theta) * Math.cos(phi);
		this.z += r * Math.sin(phi);
		return this;
	},

	addRotated: function(v, theta) {
		var cs = Math.cos(theta);
		var sn = Math.sin(theta);
		var x = v.x * cs - v.y * sn;
		var y = v.x * sn + v.y * cs;
		this.x += x;
		this.y += y;
		return this;
	},



	setToArray: function(x) {
		this.x = x[0];
		this.y = x[1];
		if (x.length > 2)
			this.z = x[2];
	},


	setToCSSPos: function(p) {
		this.x = p.left;
		this.y = p.top;
		return this;
	},

	setToPolar: function(r, theta) {
		this.x = r * Math.cos(theta);
		this.y = r * Math.sin(theta);
		return this;
	},
	setToCylindrical: function(r, theta, z) {
		this.x = r * Math.cos(theta);
		this.y = r * Math.sin(theta);
		this.z = z;
		return this;
	},

	setToPolarOffset: function(v, r, theta) {
		this.x = v.x + r * Math.cos(theta);
		this.y = v.y + r * Math.sin(theta);
		this.z = v.z;
	},

	setToSpherical: function(r, theta, phi) {
		this.x = r * Math.cos(theta) * Math.cos(phi);
		this.y = r * Math.sin(theta) * Math.cos(phi);
		this.z = r * Math.sin(phi);
		return this;
	},

	setToMultiple: function(v, m) {
		this.x = v.x * m;
		this.y = v.y * m;
		this.z = v.z * m;
		return this;
	},

	setToAverage: function(array) {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		for (var i = 0; i < array.length; i++) {
			this.add(array[i])
		}
		this.div(array.length);
	},

	setToLerp: function(v0, v1, m) {
		var m1 = 1 - m;
		this.x = v0.x * m1 + v1.x * m;
		this.y = v0.y * m1 + v1.y * m;
		this.z = v0.z * m1 + v1.z * m;
		return this;
	},

	setToLerpPlusNormal: function(v0, v1, m, n) {
		var m1 = 1 - m;
		var dx = v1.x - v0.x
		var dy = v1.y - v1.y
		this.x = v0.x * m1 + v1.x * m + -n * dy;
		this.y = v0.y * m1 + v1.y * m + n * dx;
		this.z = v0.z * m1 + v1.z * m;

		return this;
	},

	lerpTo: function(v1, m) {
		var m1 = 1 - m;
		this.x = this.x * m1 + v1.x * m;
		this.y = this.y * m1 + v1.y * m;
		this.z = this.z * m1 + v1.z * m;
		return this;
	},


	setToAddMultiple: function(v0, m0, v1, m1) {
		this.x = v0.x * m0 + v1.x * m1;
		this.y = v0.y * m0 + v1.y * m1;
		this.z = v0.z * m0 + v1.z * m1;
		return this;
	},

	setToAddMultiples: function() {
		this.x = 0;
		this.y = 0;
		this.z = 0;
		for (let i = 0; i < arguments.length / 2; i++) {
			let index = i * 2;

			this.x += arguments[index].x * arguments[index + 1]
			this.y += arguments[index].y * arguments[index + 1]
			this.z += arguments[index].z * arguments[index + 1]
		}

		return this;
	},

	setToAddNormal: function(p, v, m) {
		this.setTo(p)
		this.x += v.y * m;
		this.y += -v.x * m;
	},

	addMultipliedSum: function(v, offset, m) {
		this.x += (v.x + offset.x) * m;
		this.y += (v.y + offset.y) * m;
		this.z += (v.z + offset.z) * m;

	},

	setToDifference: function(v0, v1) {
		this.x = v0.x - v1.x;
		this.y = v0.y - v1.y;
		this.z = v0.z - v1.z;
		return this;
	},


	setTo: function(x, y, z) {
		// Just in case this was passed a vector
		if (x.x !== undefined) {
			this.x = x.x;
			this.y = x.y;
			this.z = x.z;
			if (this.z === undefined)
				this.z = 0;

		} else {
			this.x = x;
			this.y = y;
			if (z !== undefined)
				this.z = z;
		}
		if (!this.isValid())
			throw new Error(this.invalidToString() + " is not a valid vector");

		return this;
	},


	magnitude: function() {
		return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
	},

	normalize: function() {
		let m = this.magnitude()
		if (m) {
			this.div(m);
		}
		return this;
	},

	constrainMagnitude: function(min, max) {
		var d = this.magnitude();
		if (d !== 0) {
			var d2 = utilities.constrain(d, min, max);
			this.mult(d2 / d);
		}
		return this;
	},

	getDistanceTo: function(p) {
		var dx = this.x - p.x;
		var dy = this.y - p.y;
		var dz = this.z - p.z;
		return Math.sqrt(dx * dx + dy * dy + dz * dz);
	},

	getDistanceToIgnoreZ: function(p) {
		var dx = this.x - p.x;
		var dy = this.y - p.y;

		return Math.sqrt(dx * dx + dy * dy);
	},

	getAngleTo: function(p) {
		var dx = this.x - p.x;
		var dy = this.y - p.y;
		//var dz = this.z - p.z;
		return Math.atan2(dy, dx);
	},


	getNormalTo: function(p) {
		var dx = this.x - p.x;
		var dy = this.y - p.y;
		return (new Vector(-dy, dx)).normalize();
	},

	// Given two points, find the um.... additive direction of their distances
	setToAverageDirection: function(p0, p1, p2) {
		var dx0 = p1.x - p0.x;
		var dy0 = p1.y - p0.y;
		var dz0 = p1.z - p0.z;
		var dx1 = p2.x - p1.x;
		var dy1 = p2.y - p1.y;
		var dz1 = p2.z - p1.z;

		let m0 = Math.sqrt(dx0 * dx0 + dy0 * dy0 + dz0 * dz0)
		let m1 = Math.sqrt(dx1 * dx1 + dy1 * dy1 + dz1 * dz1)

		if (m0 === 0) {
			this.setTo(dx1, dy1, dz1);
			this.div(m1);
		} else if (m1 === 0) {
			this.setTo(dx0, dy0, dz0);
			this.div(m0);
		} else {
			this.x = dx0 / m0 + dx1 / m1;
			this.y = dy0 / m0 + dy1 / m1;
			this.z = dz0 / m0 + dz1 / m1;
		}

		return this;
	},

	//===========================================================
	//===========================================================
	// Complex geometry

	dot: function(v) {
		return v.x * this.x + v.y * this.y + v.z * this.z;
	},
	cross: function(v) {
		return new Vector(this.y * v.z - this.z * v.y, this.z * v.x - this.x * v.z, this.x * v.y - this.y * v.x);
	},
	setToCross: function(u, v) {
		this.x = u.y * v.z - u.z * v.y;
		this.y = u.z * v.x - u.x * v.z;
		this.z = u.x * v.y - u.y * v.x;
		return this;
	},

	getAngleBetween: function(v) {
		return Math.acos(this.dot(v) / (this.magnitude() * v.magnitude()));
	},

	getCrossAngleBetween: function(v) {
		var cross = this.cross(v);
		if (cross.z > 0)
			return -Math.asin(cross.magnitude() / (this.magnitude() * v.magnitude()));
		else
			return Math.asin(cross.magnitude() / (this.magnitude() * v.magnitude()));
	},

	getNormalizedAngleBetween: function(v) {
		var theta0 = this.getAngle();
		var theta1 = v.getAngle();
		return normalizeAngle(theta1 - theta0);
	},

	getClosest: function(pts, range) {
		let closest = undefined;

		let closestDist = 99999
		if (range !== undefined)
			closestDist = range

		for (var i = 0; i < pts.length; i++) {
			let d = this.getDistanceTo(pts[i])
			if (d < closestDist) {
				closestDist = d
				closest = pts[i]
			}
		}
		return closest
	},


	isInTriangle: function(triangle) {

		//credit: http://www.blackpawn.com/texts/pointinpoly/default.html
		var ax = triangle[0].x;
		var ay = triangle[0].y;
		var bx = triangle[1].x;
		var by = triangle[1].y;
		var cx = triangle[2].x;
		var cy = triangle[2].y;

		var v0 = [cx - ax, cy - ay];
		var v1 = [bx - ax, by - ay];
		var v2 = [this.x - ax, this.y - ay];

		var dot00 = (v0[0] * v0[0]) + (v0[1] * v0[1]);
		var dot01 = (v0[0] * v1[0]) + (v0[1] * v1[1]);
		var dot02 = (v0[0] * v2[0]) + (v0[1] * v2[1]);
		var dot11 = (v1[0] * v1[0]) + (v1[1] * v1[1]);
		var dot12 = (v1[0] * v2[0]) + (v1[1] * v2[1]);

		var invDenom = 1 / (dot00 * dot11 - dot01 * dot01);

		var u = (dot11 * dot02 - dot01 * dot12) * invDenom;
		var v = (dot00 * dot12 - dot01 * dot02) * invDenom;

		return ((u >= 0) && (v >= 0) && (u + v < 1));

	},

	isInPolygon: function(poly) {
		var pt = this;
		for (var c = false,
				i = -1,
				l = poly.length,
				j = l - 1; ++i < l; j = i)
			((poly[i].y <= pt.y && pt.y < poly[j].y) || (poly[j].y <= pt.y && pt.y < poly[i].y)) && (pt.x < (poly[j].x - poly[i].x) * (pt.y - poly[i].y) / (poly[j].y - poly[i].y) + poly[i].x) && (c = !c);
		return c;
	},



	isInsidePolygon: function(pts) {
		let p0 = new Vector(10000, 1000)
		count = 0
		for (var i = 0; i < pts.length; i++) {
			let p1 = pts[i]
			let p2 = pts[(i + 1) % pts.length]
			let hit = Vector.calculateIntersection(this, p0, p1, p2)

			if (hit[0] >= 0 && hit[0] <= 1 && hit[1] >= 0 && hit[1] <= 1)
				count++
		}

		return count % 2 != 0
	},

	//===========================================================
	//===========================================================
	// Add and sub and mult and div functions

	add: function(x, y, z) {
		if (x.x !== undefined) {

			this.x += x.x;
			this.y += x.y;
			this.z += x.z;
		} else {
			this.x += x;
			this.y += y;
			if (z !== undefined)
				this.z += z;
		}
		return this;
	},

	sub: function(v) {
		this.x -= v.x;
		this.y -= v.y;
		this.z -= v.z;
		return this;
	},
	mult: function(m) {
		this.x *= m;
		this.y *= m;
		this.z *= m;
		return this;
	},
	div: function(m) {
		this.x /= m;
		this.y /= m;
		this.z /= m;
		return this;
	},
	getOffsetTo: function(v) {
		return new Vector(v.x - this.x, v.y - this.y, v.z - this.z);
	},

	getNormalizedOffsetTo: function(v) {
		let dx = v.x - this.x;
		let dy = v.y - this.y;
		let dz = v.z - this.z;
		let m = Math.sqrt(dx * dx + dy * dy + dz * dz);
		return new Vector(dx / m, dy / m, dz / m);
	},

	setToNormalizedOffset: function(u, v) {
		let dx = v.x - u.x;
		let dy = v.y - u.y;
		let dz = v.z - u.z;
		let m = Math.sqrt(dx * dx + dy * dy + dz * dz);
		this.x = dx / m;
		this.y = dy / m;
		this.z = dz / m;
		return this;
	},

	addNormalizedDifference: function(u, v, n) {
		if (n === undefined)
			n = 1;
		let dx = v.x - u.x;
		let dy = v.y - u.y;
		let dz = v.z - u.z;
		let m = Math.sqrt(dx * dx + dy * dy + dz * dz);
		this.x += n * dx / m;
		this.y += n * dy / m;
		this.z += n * dz / m;
		return this;
	},

	getAngle: function() {
		return Math.atan2(this.y, this.x);
	},

	rotate: function(theta) {
		var cs = Math.cos(theta);
		var sn = Math.sin(theta);
		var x = this.x * cs - this.y * sn;
		var y = this.x * sn + this.y * cs;
		this.x = x;
		this.y = y;
		return this;
	},

	setToAxisRotation: function(v, axis, theta, dot, cross) {
		if (dot === undefined)
			dot = v.dot(axis);
		if (cross === undefined)
			cross = v.cross(axis);
		this.setToMultiple(v, Math.cos(theta));
		this.addMultiple(cross, Math.sin(theta));
		this.addMultiple(axis, dot * (1 - Math.cos(theta)))
	},

	rotateX: function(theta) {
		var cs = Math.cos(theta);
		var sn = Math.sin(theta);
		var z = this.z * cs - this.y * sn;
		var y = this.z * sn + this.y * cs;
		this.z = z;
		this.y = y;
		return this;
	},

	// Vectorspace additions
	vsAdd: function(v, a, b, c) {
		this.x += v.x * a.x + v.y * b.x + v.z * c.x;
		this.y += v.x * a.y + v.y * b.y + v.z * c.y;
		this.z += v.x * a.z + v.y * b.z + v.z * c.z;
	},
	vsAddPolar: function(r, theta, a, b) {
		let x = r * Math.cos(theta);
		let y = r * Math.sin(theta);
		this.x += x * a.x + y * b.x;
		this.y += x * a.y + y * b.y;
		this.z += x * a.z + y * b.z;
	},

	vsAddCylindrical: function(r, theta, z, a, b, c) {
		let x = r * Math.cos(theta);
		let y = r * Math.sin(theta);
		this.x += x * a.x + y * b.x + z * c.x;
		this.y += x * a.y + y * b.y + z * c.y;
		this.z += x * a.z + y * b.z + z * c.z;
	},


	vsAddSpherical: function(r, theta, phi, a, b, c) {
		let x = r * Math.cos(theta) * Math.cos(phi);
		let y = r * Math.sin(theta) * Math.cos(phi);
		let z = r * Math.sin(phi);
		this.x += x * a.x + y * b.x + z * c.x;
		this.y += x * a.y + y * b.y + z * c.y;
		this.z += x * a.z + y * b.z + z * c.z;
	},



	//===========================================================
	//===========================================================

	// Lerp a vector!
	lerp: function(otherVector, percent) {
		this.x = utilities.lerp(this.x, otherVector.x, percent);
		this.y = utilities.lerp(this.y, otherVector.y, percent)
		this.z = utilities.lerp(this.z, otherVector.z, percent);
		return this;
	},

	//===========================================================
	//===========================================================
	isValid: function() {
		var hasNaN = isNaN(this.x) || isNaN(this.y) || isNaN(this.z);
		var hasUndefined = this.x === undefined || this.y === undefined || this.z === undefined;
		var hasInfinity = Math.abs(this.x) === Infinity || Math.abs(this.y) === Infinity || Math.abs(this.z) === Infinity;

		var valid = !(hasNaN || hasUndefined || hasInfinity);
		// if (!valid)
		//   console.log(hasNaN + " " + hasUndefined + " " + hasInfinity);
		return valid;
	},


	//===========================================================
	//===========================================================
	translateTo: function(g) {
		g.translate(this.x, this.y);
	},

	//===========================================================
	//===========================================================

	bezier: function(g, c0, c1) {
		g.bezierVertex(c0.x, c0.y, c1.x, c1.y, this.x, this.y);
	},

	bezierTo: function(g, c0, c1, p) {
		g.bezier(this.x, this.y, c0.x, c0.y, c1.x, c1.y, p.x, p.y);
	},
	bezierWithRelativeControlPoints: function(g, p, c0, c1, m0, m1) {
		if (m0 === undefined)
			m0 = 1;
		if (m1 === undefined)
			m1 = 1;

		g.bezierVertex(p.x + c0.x * m0, p.y + c0.y * m0, this.x + c1.x * m1, this.y + c1.y * m1, this.x, this.y);
	},

	bezierWithPolarControlPoints: function(g, p, r0, theta0, r1, theta1) {
		g.bezierVertex(p.x + r0 * Math.cos(theta0), p.y + r0 * Math.sin(theta0), this.x + r1 * Math.cos(theta1), this.y + r1 * Math.sin(theta1), this.x, this.y);
	},

	vertex: function(g) {
		g.vertex(this.x, this.y);
	},

	offsetVertex: function(g, offset, m) {
		if (m === undefined)
			m = 1;
		g.vertex(this.x + offset.x * m, this.y + offset.y * m);
	},
	polarOffsetVertex: function(g, r, theta) {

		g.vertex(this.x + r * Math.cos(theta), this.y + r * Math.sin(theta));
	},

	polarOffsetBezierWithPolarControlPoints: function(g, p, rA, thetaA, rB, thetaB, r0, theta0, r1, theta1) {
		g.bezierVertex(p.x + r0 * Math.cos(theta0) + rA * Math.cos(thetaA),
			p.y + r0 * Math.sin(theta0) + rA * Math.sin(thetaA),
			this.x + r1 * Math.cos(theta1) + rB * Math.cos(thetaB),
			this.y + r1 * Math.sin(theta1) + rB * Math.sin(thetaB),
			this.x + rB * Math.cos(thetaB),
			this.y + rB * Math.sin(thetaB));
	},



	drawCircle: function(g, radius) {
		g.ellipse(this.x, this.y, radius, radius);
	},

	drawOffsetCircle: function(g, offset, radius, m) {
		if (m === undefined)
			m = 1;
		g.ellipse(this.x + offset.x * m, this.y + offset.y * m, radius, radius);
	},



	drawLineTo: function(g, v) {
		g.line(this.x, this.y, v.x, v.y);
	},

	drawOffsetLineTo: function(g, v, m, offset) {
		var mx = m * offset.x;
		var my = m * offset.y;

		g.line(this.x + mx, this.y + my, v.x + mx, v.y + my);
	},


	drawEndOffsetLineTo: function(g, p, r0, r1, n0, n1) {
		// Good behavior for partial specification
		if (r1 === undefined)
			r1 = r0;
		if (n0 === undefined)
			n0 = 0;
		if (n1 === undefined)
			n1 = n0;

		let dx = p.x - this.x;
		let dy = p.y - this.y;
		let m = Math.sqrt(dx * dx + dy * dy);
		dx /= m;
		dy /= m;

		let nx = dy;
		let ny = -dx;

		g.line(this.x + r0 * dx + nx * n0,
			this.y + r0 * dy + ny * n0,
			p.x + -r1 * dx + nx * n1,
			p.y + -r1 * dy + ny * n1);

	},

	drawLerpedLineTo: function(g, v, startLerp, endLerp) {
		var dx = v.x - this.x;
		var dy = v.y - this.y;

		g.line(this.x + dx * startLerp, this.y + dy * startLerp, this.x + dx * endLerp, this.y + dy * endLerp);
	},

	drawArrow: function(g, v, m) {
		g.line(this.x, this.y, v.x * m + this.x, v.y * m + this.y);
	},


	drawPolarLine: function(g, r, theta) {
		g.line(this.x, this.y, r * Math.cos(theta) + this.x, r * Math.sin(theta) + this.y);
	},
	drawPolarCircle: function(g, r, theta, radius) {
		g.ellipse(r * Math.cos(theta) + this.x, r * Math.sin(theta) + this.y, radius, radius);
	},

	drawArrowHead: function(g, v, m) {
		var head = 10;
		var d = v.magnitude() * m;
		g.pushMatrix();
		g.rotate(v.getAngle());
		g.beginShape();
		g.vertex(d, 0);
		g.vertex(d - head * 1.2, -head * .3);
		g.vertex(d - head);
		g.vertex(d - head * 1.2, head * .3);

		g.endShape();
		g.popMatrix();
	},

	drawArrowWithHead: function(g, v, m, headSize, offsetLength, offsetNormal) {
		if (isNaN(offsetLength))
			offsetLength = 0;
		if (isNaN(offsetNormal))
			offsetNormal = 0;
		if (isNaN(headSize))
			headSize = 10;

		var head = headSize;
		var d = v.magnitude() * m;

		g.pushMatrix();
		g.translate(this.x, this.y);
		g.rotate(v.getAngle());
		g.translate(offsetLength, offsetNormal);
		g.line(0, 0, d - head, 0);
		g.noStroke();

		g.beginShape();
		g.vertex(d, 0);
		g.vertex(d - head * 1.2, -head * .5);
		g.vertex(d - head);
		g.vertex(d - head * 1.2, head * .5);

		g.endShape();
		g.popMatrix();
	},

	drawAngle: function(g, r, theta) {
		g.line(this.x, this.y, r * Math.cos(theta) + this.x, r * Math.sin(theta) + this.y);
	},

	drawAngleBall: function(g, r, theta, radius) {
		g.ellipse(r * Math.cos(theta) + this.x, r * Math.sin(theta) + this.y, radius, radius);
	},

	drawArc: function(g, r, theta0, theta1) {
		var range = theta1 - theta0;
		var segments = Math.ceil(range / .2);
		for (var i = 0; i < segments + 1; i++) {
			var theta = theta0 + range * (i / segments);
			g.vertex(this.x + r * Math.cos(theta), this.y + r * Math.sin(theta));
		}
	},

	drawText: function(g, s, xOffset, yOffset) {
		g.text(s, this.x + xOffset, this.y + yOffset);
	},


	//===========================================================
	//===========================================================

	lookAt: function(threeObj) {
		threeObj.lookAt(this.x, this.y, this.z);
	},

	setPosition: function(threeObj) {
		threeObj.position.x = this.x;
		threeObj.position.y = this.y;
		threeObj.position.z = this.z;
	},

	toThreeVector: function() {
		return new THREE.Vector3(this.x, this.y, this.z);
	},
	toSVG: function() {
		return this.x.toFixed(2) + " " + this.y.toFixed(2);
	},

	polarOffsetToSVG: function(r, theta) {
		return Math.round(this.x + r * Math.cos(theta)) + " " + Math.round(this.y + r * Math.sin(theta));
	},


	toThree: function() {
		return new THREE.Vector3(this.x, this.y, this.z);
	},


	toB2D: function() {
		return new Box2D.b2Vec2(this.x, -this.y);
	},

	toCSSDimensions: function() {
		return {
			width: this.x + "px",
			height: this.y + "px",

		};
	},

	toCSSTranslate: function() {
		return "translate(" + this.x.toFixed(2) + "px, " + this.y.toFixed() + "px)";
	},

	toSVGPathL: function() {
		return "L" + this.x.toFixed(2) + " " + this.y.toFixed(2) + " ";
	},

	toSVGPathM: function() {
		return "M" + this.x.toFixed(2) + " " + this.y.toFixed(2) + " ";
	},

	toSVGPathC: function(cp0, cp1) {
		return "C" + cp0.x.toFixed(2) + " " + cp0.y.toFixed(2) + ", " + cp1.x.toFixed(2) + " " + cp1.y.toFixed(2) + ", " + this.x.toFixed(2) + " " + this.y.toFixed(2) + " ";
	},

	toSVGPathS: function(cp1) {
		return "S" + cp1.x.toFixed(2) + " " + cp1.y.toFixed(2) + ", " + this.x.toFixed(2) + " " + this.y.toFixed(2) + " ";
	},

	toSVGPathT: function() {
		return "T" + this.x.toFixed(2) + " " + this.y.toFixed(2) + " ";
	},

	//===========================================================
	//===========================================================

	toString: function(precision) {
		if (precision === undefined)
			precision = 2;

		return "(" + this.x.toFixed(precision) + ", " + this.y.toFixed(precision) + ", " + this.z.toFixed(precision) + ")";
	},

	toSimpleString: function() {
		precision = 1;
		return "(" + this.x.toFixed(precision) + ", " + this.y.toFixed(precision) + ")";

	},

	invalidToString: function() {

		return "(" + this.x + ", " + this.y + ", " + this.z + ")";
	},
});
Vector.lerp = function(v0, v1, a) {
	let a0 = 1 - a
	return new Vector(v0.x * a0 + v1.x * a,
		v0.y * a0 + v1.y * a,
		v0.z * a0 + v1.z * a)
}

Vector.lookTowards = function(threeObj, p, v, up) {

		threeObj.up.set(0, 0, 1)
		if (up)
			threeObj.up.set(up.x, up.y, up.z)
		threeObj.position.x = p.x;
		threeObj.position.y = p.y;
		threeObj.position.z = p.z;

		threeObj.lookAt(new THREE.Vector3(p.x + v.x, p.y + v.y, p.z + v.z));
		//threeObj.lookAt(100, 0, 0);

	},

	Vector.drawPolygon = function(g, pts) {


		g.beginShape();


		for (var i = 0; i < pts.length; i++) {
			pts[i].vertex(g)
		}

		g.endShape(g.CLOSE)
	}

Vector.drawSmoothBezierVerticesFromDirPoints = function(g, p0, p1, m0, m1) {
	// create a bezier from these directional points
	let handle = .2 * p0.getDistanceTo(p1);
	let d0 = handle * m0;
	let d1 = handle * m1;
	g.bezierVertex(
		p0.x + p0.dir.x * d0, p0.y + p0.dir.y * d0,
		p1.x + p1.dir.x * d1, p1.y + p1.dir.y * d1,
		p1.x, p1.y);

	//g.vertex(p1.x, p1.y)

}


// Class functions
Vector.sub = function(a, b) {
	return new Vector(a.x - b.x, a.y - b.y, a.z - b.z);
};
// Class functions
Vector.add = function(a, b) {
	return new Vector(a.x + b.x, a.y + b.y, a.z + b.z);
};

// Class functions
Vector.mult = function(a, m) {
	return new Vector(a.x * m, a.y * m, a.z * m);
};

Vector.dot = function(a, b) {
	return a.x * b.x + a.y * b.y + a.z * b.z;
};

Vector.polar = function(r, theta) {
	return new Vector(r * Math.cos(theta), r * Math.sin(theta));
};

Vector.cylindrical = function(r, theta, z) {
	return new Vector(r * Math.cos(theta), r * Math.sin(theta), z);
};
Vector.spherical = function(r, theta, phi) {
	return new Vector(r * Math.cos(theta) * Math.cos(phi), r * Math.sin(theta) * Math.cos(phi), r * Math.sin(phi));
};


Vector.polarOffset = function(v, r, theta) {
	return new Vector(v.x + r * Math.cos(theta), v.y + r * Math.sin(theta), v.z);
};

Vector.multiPolarOffset = function(v, r, theta, r0, theta0) {
	return new Vector(v.x + r * Math.cos(theta) + r0 * Math.cos(theta0), v.y + r * Math.sin(theta) + r0 * Math.sin(theta0), v.z);
};

Vector.angleBetween = function(a, b) {
	return Math.acos(Vector.dot(a, b) / (a.magnitude() * b.magnitude()));
};

Vector.addMultiples = function(u, m, v, n) {
	var p = new Vector();
	p.addMultiple(u, m);
	p.addMultiple(v, n);
	return p;
};

Vector.average = function(array) {
	var avg = new Vector();
	$.each(array, function(index, v) {
		avg.add(v);
	});
	avg.div(array.length);
	return avg;
};

Vector.calculateIntersection = function(a, b, c, d) {
	let div = ((d.x - c.x) * (a.y - b.y) - (a.x - b.x) * (d.y - c.y))
	if (div === 0)
		return undefined
	ta = ((c.y - d.y) * (a.x - c.x) + (d.x - c.x) * (a.y - c.y)) / div
	tb = ((a.y - b.y) * (a.x - c.x) + (b.x - a.x) * (a.y - c.y)) / div
	return [ta, tb]
};

// Split a convex polygon, todo: work for concave?
Vector.splitPolygon = function(pts, e0, e1) {
	let current = []
	let polygons = [current]
	for (var i = 0; i < pts.length; i++) {
		let p0 = pts[i]
		let p1 = pts[(i + 1) % pts.length]
		let hit = Vector.calculateIntersection(e0, e1, p0, p1)


		current.push(pts[i])

		if (hit !== undefined && hit[1] >= 0 && hit[1] < 1) {
			let p = Vector.lerp(p0, p1, hit[1])
			current.push(p)
			current = [p]
			polygons.push(current)
		}


	}

	if (polygons.length > 1) {
		let pts2 = polygons.pop()

		polygons[0] = pts2.concat(polygons[0])
	}
	return polygons
};



function getRandom(arr) {
	return arr[Math.floor(Math.random() * arr.length)];
}


function getRandomProperty(obj) {

	return getRandom(Object.keys(obj));
}


// WIP
function splitStrict(s, splitChar) {
	var escape = false;
	var sections = [];
	var levels = [];

	var lastEnd = 0;

	function pushLevel(index, c, mate, selfmate) {
		// At base level?
		if (levels.length === 0) {
			levels.push({
				index: index,
				mate: mate,
				selfmate: selfmate
			});
		}

		// not at base level
		else {
			//ignore
		}
	}

	function popLevel(index, mate, selfmate) {
		var last = levels[levels.length - 1];
		if (last.mate === mate) {
			levels.pop();

		} else {
			//console.warn ("Mismatched: expected " + last.mate + " got " + mate);
		}
	}

	function splitAt(i) {
		if (levels.length === 0) {
			sections.push(s.substring(lastEnd, i));
			lastEnd = i + 1;
		}
	}

	for (var i = 0; i < s.length; i++) {

		if (!escape) {
			var c = s.charAt(i);
			switch (c) {
				case "\\":
					escape = true;
					break;
				case "{":
					pushLevel(i, "{", "}");
					break;
				case "(":
					pushLevel(i, "(", ")");
					break;
				case "[":
					pushLevel(i, "[", "]");
					break;

				case "}":
					popLevel(i, "}");
					break;
				case ")":
					popLevel(i, ")");
					break;
				case "]":
					popLevel(i, "]");
					break;

				case "'":
					if (levels.length === 0)
						pushLevel(i, "'", "'", true);
					else
						popLevel(i, "'", true);
					break;
				case "\"":
					if (levels.length === 0)
						pushLevel(i, '"', '"', true);
					else
						popLevel(i, '"', true);

					break;

				case splitChar:
					splitAt(i);
					break;

			}

		} else {
			escape = false;
		}


	}

	splitAt(s.length);


	if (levels.length > 0)
		console.warn("Mismatched: expected ", levels.map(function(level) {
			return level.mate + " " + level.index;
		}).join(", "));

	return sections;

}


function toClosedTag(tagName, attributes) {
	var s = "<" + tagName;
	if (attributes) {
		$.each(attributes, function(key, val) {
			s += " " + key + "=" + inQuotes(val);
		});

	}
	s += "/>";
	return s;
}



function toTag(tagName, attributes, contents) {
	var s = "<" + tagName;
	if (attributes) {

		if (Array.isArray(attributes)) {
			$.each(attributes, function(key, attr2) {
				if (attr2 !== undefined) {
					$.each(attr2, function(key, val) {
						s += " " + key + "=" + inQuotes(val);
					});
				}
			});
		} else {

			$.each(attributes, function(key, val) {
				s += " " + key + "=" + inQuotes(val);
			});
		}
	}
	s += ">" + (contents ? contents : "") + "</" + tagName + ">";
	return s;
}

function inEscapedQuotes(s) {
	return '\\"' + s + '\\"';
}

function inQuotes(s) {
	return '"' + s + '"';
}

function inParens(s) {
	return '(' + s + ')';
}

function inBrackets(s) {
	return '[' + s + ']';
}

function lerp(a, b, pct) {
	return a + (b - a) * pct;
}

function pushToEdges(a, b) {


	if (b < .5) {

		return lerp(0, a, b * 2)
	}
	return lerp(a, 1, (b - .5) * 2)
}



function itemToDiv(item, holder) {
	if (typeof item === "object") {

		if (Array.isArray(item)) {

			let arrayHolder = $("<div>", {
				class: "array",
			}).appendTo(holder)

			$.each(item, (index, subItem) => {
				let arrayItem = $("<div>", {
					class: "array-item",
				}).appendTo(arrayHolder)
				itemToDiv(subItem, arrayItem)
			})

		} else {
			objectToDiv(item, holder)
		}
	} else {

		if (typeof item === "string")
			holder.addClass("string-item")
		holder.html(item)
	}
}

function objectToDiv(obj, holder) {
	let objHolder = $("<div/>", {
		class: "object-item"
	}).appendTo(holder)

	if (obj.type)
		objHolder.addClass("item-" + obj.type)

	if (obj.type === "plaintext") {
		objHolder.html(obj.raw);
		objHolder.addClass("string-item")
	} else {

		$.each(obj, (key, item) => {
			let itemHolder = $("<div>", {
				class: "line",
			}).appendTo(objHolder)


			let label = $("<label>", {
				class: "label",
				html: key
			}).appendTo(itemHolder)

			let content = $("<div>", {
				class: "content",
			}).appendTo(itemHolder);

			itemToDiv(item, content)
		})
	}
}



let bezierSectionCurve = (function() {

	function createDirPt() {
		let p = new Vector();
		p.dir = new Vector();
		return p;
	}

	function copyDirPt(target, src) {
		target.setTo(src)
		target.dir.setTo(src.dir);
	}



	// Given a point and 
	var setOffsetPts = (function() {
		// Calculate 3 offset points, use them to calculate the center angle

		// let p0 = new Vector();
		// let p1 = new Vector();
		// let p2 = new Vector();
		// let p3 = new Vector();
		// let p4 = new Vector();

		return (fPos, fRads, t, dt, pts) => {
			for (var i = 0; i < 5; i++) {
				fPos(pts[i], t + dt * (i - 2));
			}


			// What is the direction at this point?
			for (var i = 0; i < 3; i++) {
				let p = pts[i + 1];
				p.dir.setToAverageDirection(pts[i], pts[i + 1], pts[i + 2]);

				// Calculate the offset pts 
				for (var j = 0; j < fRads.length; j++) {
					let n = fRads[j](t + dt * (i - 2), j)

					p.offsetPts[j].setToAddNormal(p, p.dir, n)
					//console.log(p.offsetPts[j])
				}
				//console.log(n, p.offsetPt, t + dt * (i - 2))
			}


			for (var j = 0; j < fRads.length; j++) {
				pts[2].offsetPts[j].dir.setToAverageDirection(pts[1].offsetPts[j],
					pts[2].offsetPts[j],
					pts[3].offsetPts[j])

			}

			// let n0 = fRad(t - dt)
			// pts[1].offsetPt.setToAddNormal(pts[1], pts[1].dir, n1)
		}
	}());

	return (fPos, fRads, fDraw, t0, t1, count) => {

		// Divide up the time into slices
		let dt = (t1 - t0) / count;


		let pts = []

		// Create the scanning set of points
		for (var i = 0; i < 5; i++) {
			pts[i] = createDirPt();
			// Middle pts have offset pts
			if (i > 0 && i < 4) {
				pts[i].offsetPts = [];

				// Create offset points for each fRad function
				for (var j = 0; j < fRads.length; j++) {
					pts[i].offsetPts[j] = createDirPt();

				}
			}
		}



		let last = {
			pts: [],
			t: 0
		}
		let current = {
			pts: [],
			t: 0
		}
		for (var i = 0; i < fRads.length; i++) {
			last.pts[i] = createDirPt();
			current.pts[i] = createDirPt();
		}



		// For each section, get the points
		for (var i = 0; i < count + 1; i++) {


			// set the current time
			let t = t0 + dt * i;

			// Set the offset points at this time
			setOffsetPts(fPos, fRads, t, dt * .1, pts);

			// We now have all the offset points (stored in the pt at index 2)

			// Copy all the offset points to the current slice
			// and copy all the current points into the last
			for (var j = 0; j < fRads.length; j++) {
				copyDirPt(last.pts[j], current.pts[j])
				copyDirPt(current.pts[j], pts[2].offsetPts[j])
			}

			last.t = current.t;
			current.t = t;


			if (i > 0)
				fDraw(last, current);



		}
	}
}());

function shallowCopyObj(obj) {
	let obj2 = {}
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			obj2[key] = obj[key]
		}
	}
	return obj2
}

function mapArrayToObj(arr, keyFxn, valFxn) {
	let obj2 = {}
	for (var i = 0; i < arr.length; i++) {
		let val = arr[i];

		let key = keyFxn(val, i);
		obj2[key] = valFxn(val, i);


	}
	return obj2
}

function mapObject(obj, fxn) {
	let obj2 = {}
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {

			obj2[key] = fxn(obj[key], key);
		}
	}
	return obj2
}

function mapObjectToArray(obj, fxn) {


	let obj2 = []
	for (let key in obj) {

		if (obj.hasOwnProperty(key)) {
			obj2.push(fxn(obj[key], key));
		}
	}
	return obj2
}

function filterObjectToArray(obj, filter, fxn) {

	let obj2 = []
	for (let key in obj) {
		if (obj.hasOwnProperty(key)) {
			if (filter(obj[key], key)) {

				if (fxn)
					obj2.push(fxn(obj[key], key));
				else
					obj2.push(obj[key]);
			}

		}
	}
	return obj2
}


function forKeyIntersection(obj0, obj1, fxn0, fxnBoth, fxn1) {
	let keys0 = Object.keys(obj0)
	let keys1 = Object.keys(obj1)
	let keysBoth = {};


	for (var i = 0; i < keys0.length; i++) {
		let k = keys0[i];
		if (obj1.hasOwnProperty(k)) {
			fxnBoth(k);
		} else {
			fxn0(k);
		}
	}

	for (var i = 0; i < keys1.length; i++) {
		let k = keys1[i];
		if (obj0.hasOwnProperty(k)) {
			//fxnBoth(k);
		} else {
			fxn1(k);
		}
	}


}

function limit(m, max, falloff) {
	if (m > max) {
		return max + Math.pow(m - max, falloff)
	}
	return m;
}

function limitVectorMagnitude(v, max, falloff) {
	let m = v.magnitude();

	if (m > max) {
		let m2 = max + Math.pow(m - max, falloff)
		v.mult(m2 / m)
	}
	return v;
}


//http://jsfromhell.com/array/shuffle
function shuffle(a) {
	var j, x, i;
	for (i = a.length; i; i--) {
		j = Math.floor(Math.random() * i);
		x = a[i - 1];
		a[i - 1] = a[j];
		a[j] = x;
	}
	return a
}


function isVowel(c) {
	var c2 = c.toLowerCase();
	return (c2 === 'a') || (c2 === 'e') || (c2 === 'i') || (c2 === 'o') || (c2 === 'u');
};

function isAlphaNum(c) {
	return (c >= 'a' && c <= 'z') || (c >= 'A' && c <= 'Z') || (c >= '0' && c <= '9');
};


function toCamelCase(str) {

	str = str.replace(/[.,'"-:;?]/g, "");
	return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
		if (+match === 0) return "";
		return index == 0 ? match.toLowerCase() : match.toUpperCase();
	});
}


function threeToPos(object, camera) {
	var vector = new THREE.Vector3();
	object.updateMatrixWorld()
	vector.setFromMatrixPosition(object.matrixWorld);

	var widthHalf = screenSize.x / 2,
		heightHalf = screenSize.y / 2;

	vector.project(camera);



	vector.x = (vector.x * widthHalf);
	vector.y = -(vector.y * heightHalf);



	return vector;
}

//returns an value for an int or float, but undefined for anything else	
// -1.23 => -1.23
// -1.2x => undefined
const toStrictNumberIsInt = /^[+-]?\d+$/;
const toStrictNumberIsFloat = /^[-+]?[0-9]*\.?[0-9]+$/;

function toStrictNumber(val) {
	if (toStrictNumberIsInt.test(val))
		return parseInt(val)
	if (toStrictNumberIsFloat.test(val))
		return parseFloat(val)
}


function toVuePanelTemplate(settings) {
	let classes = ""
	if (settings.classes !== undefined) {
		classes = " " + settings.classes
	}
	let bind = ""
	if (settings.bind !== undefined) {
		bind = " " + mapObjectToArray(settings.bind, (val, key) => ":" + key + "=" + inQuotes(val)).join(" ")
	}

	let onFxn = ""
	if (settings.on !== undefined) {
		onFxn = " " + mapObjectToArray(settings.on, (val, key) => "@" + key + "=" + inQuotes(val)).join(" ")
	}


	let template = `
	<div class='panel${classes}'${bind}${onFxn}>
		<div class='header'>
			<div class='header-main'>
				${settings.title}
			</div>
			<div class='header-controls'>
				${settings.controls}
			</div>
		</div>

		<div class='content'>
			${settings.content}
		</div>
		
		
	
	`

	if (settings.footer)
		template += `<div class='footer'>
						${settings.footer}
					</div>
					`

	template += "</div>"
	return template

}