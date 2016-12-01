'use strict';

exports.BattleScripts = {
	inherit: 'gen7',
	init: function () {
		
		// Sentret
		//		+10 SpDef, +20 Speed
		//		Learns: Bestow, Chip Away, Dizzy Punch, Lucky Chant, Play Nice, Recycle, Switcheroo, Wish, Yawn
		this.modData('Learnsets', 'sentret').learnset.bestow = ['7L100'];
		this.modData('Learnsets', 'sentret').learnset.chipaway:["7L100"],
		this.modData('Learnsets', 'sentret').learnset.dizzypunch = ['7L100'];
		this.modData('Learnsets', 'sentret').learnset.luckychant = ['7L100'];
		this.modData('Learnsets', 'sentret').learnset.playnice:["7L100"],
		this.modData('Learnsets', 'sentret').learnset.recycle = ['7L100'];
		this.modData('Learnsets', 'sentret').learnset.switcheroo = ['7L100'];
		this.modData('Learnsets', 'sentret').learnset.wish = ['7L100'];
		this.modData('Learnsets', 'sentret').learnset.yawn = ['7L100'];
		this.modData('Pokedex', 'sentret').baseStats = {hp: 35, atk: 46, def: 34, spa: 35, spd: 55, spe: 40};
		
		// Furret
		//		Keen Eye -> Fur Coat
		//		+20 SpDef, +30 Speed
		//		Learns: After You, Bestow, Chip Away, Dizzy Punch, Encore, Fake Out, Heal Bell, Lucky Chant, Play Nice, Recycle, Safeguard, Sing, Sweet Kiss, Switcheroo, Wish, Yawn
		this.modData('Learnsets', 'furret').learnset.afteryou:["7L100"],
		this.modData('Learnsets', 'furret').learnset.bestow = ['7L100'];
		this.modData('Learnsets', 'furret').learnset.chipaway:["7L100"],
		this.modData('Learnsets', 'furret').learnset.dizzypunch = ['7L100'];
		this.modData('Learnsets', 'furret').learnset.encore:["7L100"],
		this.modData('Learnsets', 'furret').learnset.fakeout:["7L100"],
		this.modData('Learnsets', 'furret').learnset.healbell:["7L100"],
		this.modData('Learnsets', 'furret').learnset.luckychant = ['7L100'];
		this.modData('Learnsets', 'furret').learnset.playnice:["7L100"],
		this.modData('Learnsets', 'furret').learnset.recycle = ['7L100'];
		this.modData('Learnsets', 'furret').learnset.safeguard:["7L100"],
		this.modData('Learnsets', 'furret').learnset.sing:["7L100"],
		this.modData('Learnsets', 'furret').learnset.sweetkiss:["7L100"],
		this.modData('Learnsets', 'furret').learnset.switcheroo = ['7L100'];
		this.modData('Learnsets', 'furret').learnset.wish = ['7L100'];
		this.modData('Learnsets', 'furret').learnset.yawn = ['7L100'];
		this.modData('Pokedex', 'furret').baseStats = {hp: 85, atk: 76, def: 64, spa: 45, spd: 75, spe: 120};
		this.modData('Pokedex', 'furret').abilities['1'] = 'Fur Coat';
		
		// Cherrim-Sunshine
		//		Type: Grass/Fire
		this.modData('Pokedex', 'cherrimsunshine').types = ['Grass', 'Fire'];
		
		// Greninja
		//		Protean -> Skill Link
		this.modData('Pokedex', 'greninja').abilities['H'] = 'Skill Link';
	},
};
