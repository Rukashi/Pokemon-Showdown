'use strict';

exports.BattlePokedex = {
	
	// Vaporeon
	//		+Rain Dish
	vaporeon: {
		inherit: true,
		abilities: {0: "Water Absorb", 1: "Rain Dish", H: "Hydration"},
	},
	
	// Jolteon
	//		Volt Absorb -> Lightning Rod
	//		+Steadfast
	jolteon: {
		inherit: true,
		abilities: {0: "Lightning Rod", 1: "Quick Feet", H: "Steadfast" },
	},
	
	// Flareon
	//		+Fur Coat
	flareon: {
		inherit: true,
		abilities: {0: "Flash Fire", 1: "Fur Coat", H: "Guts"},
	},
	
	// Espeon
	//		Synchronize -> Anticipation
	//		+Telepathy
	espeon: {
		inherit: true,
		abilities: {0: "Anticipation", 1: "Telepathy", H: "Magic Bounce"},
	},
	
	// Umbreon
	//		Inner Focus -> Infiltrator
	//		+Illuminate
	umbreon: {
		inherit: true,
		abilities: {0: "Synchronize", 1: "Illuminate", H: "Infiltrator"},
	},
	
	// Leafeon
	//		+Natural Cure
	leafeon: {
		inherit: true,
		abilities: {0: "Leaf Guard", 1: "Natural Cure", H: "Chlorophyll"},
	},
	
	// Glaceon
	//		Ice Body -> Refrigerate
	//		+Snow Warning
	glaceon: {
		inherit: true,
		abilities: {0: "Snow Cloak", 1: "Snow Warning", H: "Refrigerate"},
	},
	
	// Sylveon
	//		+Serene Grace
	sylveon: {
		inherit: true,
		abilities: {0: "Cute Charm", 1: "Serene Grace", H: "Pixilate"},
	},
	
	// Sentret
	//		+10 SpDef, +20 Speed
	sentret: {
		inherit: true,
		baseStats: {hp: 35, atk: 46, def: 34, spa: 35, spd: 55, spe: 40},
	},
	
	// Furret
	//		Keen Eye -> Fur Coat
	//		+20 SpDef, +30 Speed
	furret: {
		inherit: true,
		baseStats: {hp: 85, atk: 76, def: 64, spa: 45, spd: 75, spe: 120},
		abilities: {0: "Run Away", 1: "Fur Coat", H: "Frisk"},
	},
	
	// Slugma
	//		Weak Armor -> Unnerve
	//		+20 Hp, +10 Def, +10 SpDef
	slugma: {
		inherit: true,
		baseStats: {hp: 60, atk: 40, def: 50, spa: 70, spd: 50, spe: 20},
		abilities: {0: "Magma Armor", 1: "Flame Body", H: "Unnerve"},
	},
	
	// Magcargo
	//		Weak Armor -> Shell Armor
	//		+30 Hp, +20 Def, +30 SpAtk, -20 Speed
	magcargo: {
		inherit: true,
		baseStats: {hp: 90, atk: 50, def: 140, spa: 120, spd: 80, spe: 10},
		abilities: {0: "Magma Armor", 1: "Flame Body", H: "Shell Armor"},
	},
	
	// Cherrim-Sunshine
	//		Type: Grass/Fire
	cherrimsunshine: {
		inherit: true,
		types: ["Grass","Fire"],
	},
	
	// Greninja
	//		Protean -> Skill Link
	greninja: {
		inherit: true,
		abilities: {0: "Torrent", H: "Skill Link", S: "Battle Bond"},
	},
};
