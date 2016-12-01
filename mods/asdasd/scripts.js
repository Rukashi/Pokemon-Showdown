'use strict';

exports.BattleScripts = {
	inherit: 'gen7',
	init: function () {
		
		// Sentret
		//		+20 SpDef
		//		Learns: Bestow, Dizzy Punch, Lucky Chant, Wish
		this.modData('Learnsets', 'sentret').learnset.bestow = ['7L100'];
		this.modData('Learnsets', 'sentret').learnset.dizzypunch = ['7L100'];
		this.modData('Learnsets', 'sentret').learnset.luckychant = ['7L100'];
		this.modData('Learnsets', 'sentret').learnset.wish = ['7L100'];
		this.modData('Pokedex', 'sentret').baseStats = {hp: 35, atk: 46, def: 34, spa: 35, spd: 65, spe: 20};
		
		// Furret
		//		Keen Eye -> Fur Coat
		//		+30 SpDef, +30 Speed
		//		Learns: Bestow, Dizzy Punch, Lucky Chant, Wish
		this.modData('Learnsets', 'furret').learnset.bestow = ['7L100'];
		this.modData('Learnsets', 'furret').learnset.dizzypunch = ['7L100'];
		this.modData('Learnsets', 'furret').learnset.luckychant = ['7L100'];
		this.modData('Learnsets', 'furret').learnset.wish = ['7L100'];
		this.modData('Pokedex', 'furret').baseStats = {hp: 85, atk: 76, def: 64, spa: 45, spd: 85, spe: 120};
		this.modData('Pokedex', 'furret').abilities['1'] = 'Fur Coat';
		
		// Cherrim-Sunshine
		//		Type: Grass/Fire
		this.modData('Pokedex', 'cherrimsunshine').types = ['Grass', 'Fire'];
		
		// Greninja
		//		Protean -> Skill Link
		this.modData('Pokedex', 'greninja').abilities['H'] = 'Skill Link';
	},
};
