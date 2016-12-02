'use strict';

exports.BattlePokedex = {
	
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
