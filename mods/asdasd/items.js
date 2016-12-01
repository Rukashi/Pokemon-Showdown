'use strict';

exports.BattleItems = {
	
	// Wide Lens
	//		Increases accuracy by 20%
	"widelens": {
		inherit: true,
		desc: "The accuracy of attacks by the holder is 1.2x.",
		onSourceModifyAccuracy: function (accuracy) {
			if (typeof accuracy === 'number') {
				return accuracy * 1.2;
			}
		},
	},
	
	// Zoom Lens
	//		Increases accuracy by 40% when moving after the target
	"zoomlens": {
		inherit: true,
		desc: "The accuracy of attacks by the holder is 1.4x if it moves after its target.",
		onSourceModifyAccuracy: function (accuracy, target) {
			if (typeof accuracy === 'number' && !this.willMove(target)) {
				this.debug('Zoom Lens boosting accuracy');
				return accuracy * 1.4;
			}
		},
	},
	
	// Bright Powder
	//		Reduces foes accuracy by 15%
	"brightpowder": {
		inherit: true,
		desc: "The accuracy of attacks against the holder is 0.85x.",
		onModifyAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('brightpowder - decreasing accuracy');
			return accuracy * 0.85;
		},
	},
	
	// Big Root
	//		Draining moves heal for 50% more
	"bigroot": {
		inherit: true,
		desc: "Holder gains 1.5x HP from draining moves, Aqua Ring, Ingrain, and Leech Seed.",
		onTryHeal: function (damage, target, source, effect) {
			let heals = {drain: 1, leechseed: 1, ingrain: 1, aquaring: 1, strengthsap: 1};
			if (heals[effect.id]) {
				return Math.ceil((damage * 1.5) - 0.5); // Big Root rounds half down
			}
		},
	},
	
	// Light Clay
	//		Extends protective moves by 3 turns.
	"lightclay": {
		inherit: true,
		desc: "Holder's Reflect, Light Screen, Aurora Veil, Safeguard, Mist or Lucky Chant lasts 8 turns.",
	},
	
	// Type-enhancing Items
	//		Increase damage by 30%
	"blackbelt": {
		inherit: true,
		desc: "Holder's Fighting-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && move.type === 'Fighting') {
				return this.chainModify(1.3);
			}
		},
	},
	"blackglasses": {
		inherit: true,
		desc: "Holder's Dark-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && move.type === 'Dark') {
				return this.chainModify(1.3);
			}
		},
	},
	"charcoal": {
		inherit: true,
		desc: "Holder's Fire-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && move.type === 'Fire') {
				return this.chainModify(1.3);
			}
		},
	},
	"dragonfang": {
		inherit: true,
		desc: "Holder's Dragon-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && move.type === 'Dragon') {
				return this.chainModify(1.3);
			}
		},
	},
	"hardstone": {
		inherit: true,
		desc: "Holder's Rock-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && move.type === 'Rock') {
				return this.chainModify(1.3);
			}
		},
	},
	"magnet": {
		inherit: true,
		desc: "Holder's Electric-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Electric') {
				return this.chainModify(1.3);
			}
		},
	},
	"metalcoat": {
		inherit: true,
		desc: "Holder's Steel-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Steel') {
				return this.chainModify(1.3);
			}
		},
	},
	"miracleseed": {
		inherit: true,
		desc: "Holder's Grass-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Grass') {
				return this.chainModify(1.3);
			}
		},
	},
	"mysticwater": {
		inherit: true,
		desc: "Holder's Water-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Water') {
				return this.chainModify(1.3);
			}
		},
	},
	"nevermeltice": {
		inherit: true,
		desc: "Holder's Ice-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Ice') {
				return this.chainModify(1.3);
			}
		},
	},
	"poisonbarb": {
		inherit: true,
		desc: "Holder's Poison-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Poison') {
				return this.chainModify(1.3);
			}
		},
	},
	"sharpbeak": {
		inherit: true,
		desc: "Holder's Flying-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && move.type === 'Flying') {
				return this.chainModify(1.3);
			}
		},
	},
	"silkscarf": {
		inherit: true,
		desc: "Holder's Normal-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Normal') {
				return this.chainModify(1.3);
			}
		},
	},
	"silverpowder": {
		inherit: true,
		desc: "Holder's Bug-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Bug') {
				return this.chainModify(1.3);
			}
		},
	},
	"softsand": {
		inherit: true,
		desc: "Holder's Ground-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Ground') {
				return this.chainModify(1.3);
			}
		},
	},
	"spelltag": {
		inherit: true,
		desc: "Holder's Ghost-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Ghost') {
				return this.chainModify(1.3);
			}
		},
	},
	"twistedspoon": {
		inherit: true,
		desc: "Holder's Psychic-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Psychic') {
				return this.chainModify(1.3);
			}
		},
	},
	
	// Pure Incense
	//		Type-enhancing item for Fairy-type
	"pureincense": {
		id: "pureincense",
		name: "Pure Incense",
		desc: "Holder's Fairy-type attacks have 1.3x power.",
		spritenum: 612,
		fling: {
			basePower: 10,
		},
		onBasePowerPriority: 6,
		onBasePower: function (basePower, user, target, move) {
			if (move.type === 'Fairy') {
				return this.chainModify(1.3);
			}
		},
		num: 319,
		gen: 4,
	},
	
	// Wise Glasses
	// Muscle Band
	//		Increase damage by 15%
	"wiseglasses": {
		inherit: true,
		onBasePower: function (basePower, user, target, move) {
			if (move.category === 'Special') {
				return this.chainModify(1.15);
			}
		},
		desc: "Holder's special attacks have 1.15x power.",
	},
	"muscleband": {
		inherit: true,
		onBasePower: function (basePower, user, target, move) {
			if (move.category === 'Physical') {
				return this.chainModify(1.15);
			}
		},
		desc: "Holder's physical attacks have 1.15x power.",
	},
	
	// Gems
	//		Increase damage by 50%
	"buggem": {
		inherit: true,
		desc: "Holder's first successful Bug-type attack will have 1.5x power. Single use.",
	},
	"darkgem": {
		inherit: true,
		desc: "Holder's first successful Dark-type attack will have 1.5x power. Single use.",
	},
	"dragongem": {
		inherit: true,
		desc: "Holder's first successful Dragon-type attack will have 1.5x power. Single use.",
	},
	"electricgem": {
		inherit: true,
		desc: "Holder's first successful Electric-type attack will have 1.5x power. Single use.",
	},
	"fairygem": {
		inherit: true,
		desc: "Holder's first successful Fairy-type attack will have 1.5x power. Single use.",
	},
	"fightinggem": {
		inherit: true,
		desc: "Holder's first successful Fighting-type attack will have 1.5x power. Single use.",
	},
	"firegem": {
		inherit: true,
		desc: "Holder's first successful Fire-type attack will have 1.5x power. Single use.",
	},
	"flyinggem": {
		inherit: true,
		desc: "Holder's first successful Flying-type attack will have 1.5x power. Single use.",
	},
	"ghostgem": {
		inherit: true,
		desc: "Holder's first successful Ghost-type attack will have 1.5x power. Single use.",
	},
	"grassgem": {
		inherit: true,
		desc: "Holder's first successful Grass-type attack will have 1.5x power. Single use.",
	},
	"groundgem": {
		inherit: true,
		desc: "Holder's first successful Ground-type attack will have 1.5x power. Single use.",
	},
	"icegem": {
		inherit: true,
		desc: "Holder's first successful Ice-type attack will have 1.5x power. Single use.",
	},
	"normalgem": {
		inherit: true,
		desc: "Holder's first successful Normal-type attack will have 1.5x power. Single use.",
	},
	"poisongem": {
		inherit: true,
		desc: "Holder's first successful Poison-type attack will have 1.5x power. Single use.",
	},
	"psychicgem": {
		inherit: true,
		desc: "Holder's first successful Psychic-type attack will have 1.5x power. Single use.",
	},
	"rockgem": {
		inherit: true,
		desc: "Holder's first successful Rock-type attack will have 1.5x power. Single use.",
	},
	"steelgem": {
		inherit: true,
		desc: "Holder's first successful Steel-type attack will have 1.5x power. Single use.",
	},
	"watergem": {
		inherit: true,
		desc: "Holder's first successful Water-type attack will have 1.5x power. Single use.",
	},
	
	// Adamant Orb
	// Griseous Orb
	// Lustrous Orb
	// Soul Dew
	//		Increase damage by 30%
	"adamantorb": {
		inherit: true,
		desc: "If holder is a Dialga, its Steel- and Dragon-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && user.baseTemplate.species === 'Dialga' && (move.type === 'Steel' || move.type === 'Dragon')) {
				return this.chainModify(1.3);
			}
		},
	},
	"griseousorb": {
		inherit: true,
		desc: "If holder is a Giratina, its Ghost- and Dragon-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (user.baseTemplate.num === 487 && (move.type === 'Ghost' || move.type === 'Dragon')) {
				return this.chainModify(1.3);
			}
		},
	},
	"lustrousorb": {
		inherit: true,
		desc: "If holder is a Palkia, its Water- and Dragon-type attacks have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && user.baseTemplate.species === 'Palkia' && (move.type === 'Water' || move.type === 'Dragon')) {
				return this.chainModify(1.3);
			}
		},
	},
	"souldew": {
		inherit: true,
		desc: "If holder's a Latias/Latios, its Dragon- and Psychic-type moves have 1.3x power.",
		onBasePower: function (basePower, user, target, move) {
			if (move && (user.baseTemplate.num === 380 || user.baseTemplate.num === 381) && (move.type === 'Psychic' || move.type === 'Dragon')) {
				return this.chainModify(1.3);
			}
		},
	},
	
	// Plates
	//		No longer increase damage
	"dracoplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Dragon-type.",
	},
	"dreadplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Dark-type.",
	},
	"earthplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Ground-type.",
	},
	"fistplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Fighting-type.",
	},
	"flameplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Fire-type.",
	},
	"icicleplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Ice-type.",
	},
	"insectplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Bug-type.",
	},
	"ironplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Steel-type.",
	},
	"meadowplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Grass-type.",
	},
	"mindplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Psychic-type.",
	},
	"pixieplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Fairy-type.",
	},
	"skyplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Flying-type.",
	},
	"splashplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Water-type.",
	},
	"spookyplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Ghost-type.",
	},
	"stoneplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Rock-type.",
	},
	"toxicplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Poison-type.",
	},
	"zapplate": {
		inherit: true,
		onBasePowerPriority: null,
		onBasePower: function () {},
		desc: "Holder's Judgment is Electric-type.",
	},
};
