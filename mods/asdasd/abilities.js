'use strict';

exports.BattleAbilities = {
	// Infiltrator
	//		Moves ignore Protect, King's Shield, Spiky Shield, Baneful Bunker, Quick Guard, Wide Guard, Mat Block and Crafty Shield, BUT NOT DETECT
	//		Moves ignore Aurora Veil and Lucky Chant
	"infiltrator": {
		inherit: true,
		desc: "This Pokemon's moves ignore Substitute, Protect, King's Shield, Spiky Shield, Baneful Bunker, Quick Guard, Wide Guard, Mat Block and Crafty Shield, and the opposing side's Reflect, Light Screen, Aurora Veil, Safeguard, Mist, and Lucky Chant.",
		shortDesc: "Ignores protective moves on target, except Detect and Endure.",
	},
	
	// Forecast
	//		Weather moves last indefinitely.
	"forecast": {
		inherit: true,
		desc: "This Pokemon's weather moves last indefinitely. If this Pokemon is a Castform, its type changes to the current weather condition's type, except Sandstorm.",
		shortDesc: "Weather moves last forever. Castform's type changes based on weather, except Sandstorm.",
		onModifyMove: function (move) {
			if (move.weather) {
				let weather = move.weather;
				move.weather = null;
				move.onHit = function (target, source) {
					this.setWeather(weather, source, this.getAbility('forecast'));
					this.weatherData.duration = 0;
				};
				move.target = 'self';
			}
		},
	},
	
	// Magma Armor
	//		Reduces damage taken by 25% on Sunny Day
	//		Imunity to Freeze
	"magmaarmor": {
		inherit: true,
		desc: "This Pokemon takes 25% reduced damage during Sunny Day, and cannot be frozen. Gaining this Ability while frozen cures it.",
		shortDesc: "Immune to freezing. Takes 25% reduced damage during Sunny Day.",
		onSourceBasePower: function (basePower) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return basePower * 3 / 4;
			}
		},
	},
	
	// Water Veil
	//		Reduces damage taken by 25% on Rain Dance
	//		Imunity to Burn
	"waterveil": {
		inherit: true,
		desc: "This Pokemon takes 12.5% reduced damage, doubled during Rain Dance, and cannot be burned. Gaining this Ability while burned cures it.",
		shortDesc: "Immune to burn. Takes 25% reduced damage during Rain Dance.",
		onSourceBasePower: function (basePower) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				return basePower * 3 / 4;
			}
		},
	},
	
	// Rain Dish
	//		Heals by 12.5% Maxomim HP each turn during Rain Dance
	"raindish": {
		inherit: true,
		desc: "If Rain Dance is active, this Pokemon restores 1/8 of its maximum HP, rounded down, at the end of each turn.",
		shortDesc: "If Rain Dance is active, this Pokemon heals 1/8 of its max HP each turn.",
		onWeather: function (target, source, effect) {
			if (effect.id === 'raindance' || effect.id === 'primordialsea') {
				this.heal(target.maxhp / 8);
			}
		},
		rating: 2.5,
	},
	
	// Sand Veil
	//		Reduces damage taken by 25% on Sandstorm
	//		Imunity to Paralysis
	"sandveil": {
		inherit: true,
		desc: "This Pokemon takes 25% reduced damage during Sandstorm, and cannot be paralyzed. Gaining this Ability while paralyzed cures it. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "Immune to paralysis. Takes 25% reduced damage during Sandstorm.",
		onUpdate: function (pokemon) {
			if (pokemon.status === 'par') {
				this.add('-activate', pokemon, 'ability: Sand Veil');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'par') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Sand Veil');
			return false;
		},
		onSourceBasePower: function (basePower) {
			if (this.isWeather('sandstorm')) {
				return basePower * 3 / 4;
			}
		},
		onModifyAccuracy: function () {},
	},
	
	// Snow Cloak
	//		Reduces damage taken by 25% on Hail
	//		Immunity to Sleep
	"snowcloak": {
		inherit: true,
		desc: "This Pokemon takes 25% reduced damage during Hail, and cannot fall asleep. Gaining this Ability while asleep cures it. This Pokemon takes no damage from Hail.",
		shortDesc: "Immune to falling asleep. Takes 25% reduced damage during Hail.",
		onUpdate: function (pokemon) {
			if (pokemon.status === 'slp') {
				this.add('-activate', pokemon, 'ability: Snow Cloak');
				pokemon.cureStatus();
			}
		},
		onSetStatus: function (status, target, source, effect) {
			if (status.id !== 'slp') return;
			if (!effect || !effect.status) return false;
			this.add('-immune', target, '[msg]', '[from] ability: Snow Cloak');
			return false;
		},
		onSourceBasePower: function (basePower) {
			if (this.isWeather('hail')) {
				return basePower * 3 / 4;
			}
		},
		onModifyAccuracy: function () {},
	},
	
	// Ice Body
	//		Heals by 12.5% Maxomim HP each turn during Hail
	"icebody": {
		inherit: true,
		desc: "If Hail is active, this Pokemon restores 1/8 of its maximum HP, rounded down, at the end of each turn. This Pokemon takes no damage from Hail.",
		shortDesc: "If Hail is active, this Pokemon heals 1/8 of its max HP each turn; immunity to Hail.",
		onWeather: function (target, source, effect) {
			if (effect.id === 'hail') {
				this.heal(target.maxhp / 8);
			}
		},
		rating: 2.5,
	},
	
	// Battle Armor
	//		Reduces damage taken by 25% of its Lost HP once, then its armor breaks
	//		Until this Pokemon's armor breaks, it is immune to entry hazard damage
	//		Armor is restored on switch-in, after hazards damage
	"battlearmor": {
		desc: "Damage taken by this Pokemon is reduced by 25% of its missing HP, but its armor is broken as well. On switch-in, this Pokemon takes no entry hazard damage if its armor isn't broken, or restores it if it is.",
		shortDesc: "Takes 25% lost HP less damage once, or no entry hazard damage on next switch-in.",
		onStart: function (pokemon) {
			if (pokemon.brokenArmor) {
				this.add('-message', pokemon.name + " repaired its Battle Armor!");
				pokemon.brokenArmor = false;
			}
		},
		onDamage: function (damage, target, source, effect) {
			if (!target.brokenArmor && effect && effect.id in {spikes:1,stealthrock:1}) {
				return false;
			}
			if (!target.brokenArmor && effect && effect.effectType === 'Move') {
				this.add('-ability', target, 'Battle Armor');
				this.add('-message', target.name + "'s Battle Armor broke while reducing the damage!");
				damage -= Math.floor((target.maxhp - target.hp) / 4);
				target.brokenArmor = true;
				if (damage < 0) damage = 0;
				return damage;
			}
		},
		id: "battlearmor",
		name: "Battle Armor",
		rating: 3.5,
		num: 4,
	},
	
	// Shell Armor
	//		Until its armor breaks, this Pokemon retreats into its shell while bellow 50% HP, and takes 25% reduced damage
	//		If this Pokemon uses Shell Smash, its armor breaks
	//		Armor is restored on switch-out, or when using Withdraw
	"shellarmor": {
		desc: "While this Pokemon has 1/2 or less of its maximum HP and its armor isn't broken, it takes 25% reduced damage. Armor breaks if this Pokemon uses Shell Smash, and is restored if it uses Withdraw or switches out.",
		shortDesc: "Takes -25% damage if low HP. Breaks if using Shell Smash. Restored by Withdraw.",
		onSourceBasePower: function (basePower, attacker, defender, move) {
			if (!defender.brokenArmor && defender.hp <= defender.maxhp / 2) {
				this.add('-ability', defender, 'Shell Armor');
				this.add('-message', target.name + "'s Shell Armor reduced the damage!");
				return this.chainModify(0.75);
			}
		},
		onHit: function (target, source, move) {
			if (!target.brokenArmor && move.id === 'shellsmash') {
				this.add('-message', target.name + " smashed its Shell Armor!");
				target.brokenArmor = true;
			}
			if (target.brokenArmor && move.id === 'withdraw') {
				this.add('-message', target.name + " restored its Shell Armor!");
				target.brokenArmor = false;
			}
		},
		onSwitchOut: function (pokemon) {
			pokemon.brokenArmor = false;
		},
		id: "shellarmor",
		name: "Shell Armor",
		rating: 3,
		num: 75,
	},
	
	// Weak Armor
	//		Until its armor breaks, this Pokemon takes 25% reduced physical damage
	//		If this Pokemon loses 25% or more of its max HP from a single move, its armor breaks
	//		Armor is restored upon using Harden or Iron Defense
	"weakarmor": {
		desc: "This Pokemon takes 25% reduced physical damage until its armor breaks. This Pokemon's armor breaks by taking 25% or more of its maximum HP from a single attack, and can then be restored by using Harden or Iron Defense.",
		shortDesc: "Takes -25% physical damage until armor breaks. Restored by Harden/Iron Defense.",
		onSourceBasePower: function (basePower, attacker, defender, move) {
			if (!defender.brokenArmor && this.getCategory(move) === 'Physical') {
				this.add('-ability', defender, 'Weak Armor');
				this.add('-message', defender.name + "'s Weak Armor reduced the damage!");
				return this.chainModify(0.75);
			}
		},
		onAfterDamage: function (damage, target, source, move) {
			if (!target.brokenArmor && damage >= target.maxhp / 4) {
				this.add('-message', "It broke " + target.name + "'s Weak Armor!");
				target.brokenArmor = true;
			}
		},
		onHit: function (target, source, move) {
			if (target.brokenArmor && move.id in {harden:1, irondefense:1}) {
				this.add('-message', target.name + " repaired its Weak Armor!");
				target.brokenArmor = false;
			}
		},
		id: "weakarmor",
		name: "Weak Armor",
		rating: 3,
		num: 133,
	},
	
	// Poison Point
	// Flame Body
	// Static
	// Cute Charm
	// Cursed Body
	//		100% Chance to activate
	"poisonpoint": {
		inherit: true,
		shortDesc: "Poisons Pokemon making contact with this Pokemon.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				source.trySetStatus('psn', target);
			}
		},
		rating: 3,
	},
	"flamebody": {
		inherit: true,
		shortDesc: "Burns Pokemon making contact with this Pokemon.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				source.trySetStatus('brn', target);
			}
		},
		rating: 3,
	},
	"static": {
		inherit: true,
		shortDesc: "Paralyzes Pokemon making contact with this Pokemon.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				source.trySetStatus('par', target);
			}
		},
		rating: 3,
	},
	"cutecharm": {
		inherit: true,
		shortDesc: "Infatuates Pokemon making contact with this Pokemon.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				source.addVolatile('Attract', target);
			}
		},
		rating: 2.5,
	},
	"cursedbody": {
		inherit: true,
		desc: "Disables Pokemon making contact with this Pokemon.",
		shortDesc: "Disables Pokemon making contact with this Pokemon.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				source.addVolatile('Disable', target);
			}
		},
		rating: 3,
	},
	
	// Effect Spore
	//		60% Chance to activate
	"effectspore": {
		inherit: true,
		desc: "60% chance a Pokemon making contact with this Pokemon will be poisoned, paralyzed, or fall asleep.",
		shortDesc: "60% chance of poison/paralysis/sleep on others making contact with this Pokemon.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact'] && !source.status && source.runStatusImmunity('powder')) {
				let r = this.random(10);
				if (r < 2) {
					source.setStatus('slp', target);
				} else if (r < 4) {
					source.setStatus('par', target);
				} else if (r < 6) {
					source.setStatus('psn', target);
				}
			}
		},
	},
	
	// Compoundeyes
	//		Increases accuracy by 60%
	"compoundeyes": {
		inherit: true,
		shortDesc: "This Pokemon's moves have their accuracy multiplied by 1.6x.",
		onSourceModifyAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('compoundeyes - enhancing accuracy');
			return accuracy * 1.6;
		},
	},
	
	// Keen Eye
	//		Increases accuracy by 40%, Imune to accuracy drops, ignores evasion
	"keeneye": {
		inherit: true,
		desc: "This Pokemon's moves have their accuracy multiplied by 1.4x. Prevents other Pokemon from lowering this Pokemon's accuracy stat stage. This Pokemon ignores a target's evasiveness stat stage.",
		shortDesc: "This Pokemon's accuracy is 1.4x, and can't be lowered by others; ignores evasion.",
		onSourceModifyAccuracy: function (accuracy) {
			if (typeof accuracy !== 'number') return;
			this.debug('keeneye - enhancing accuracy');
			return accuracy * 1.4;
		},
		rating: 3.5,
	},
	
	// Illuminate
	//		Increases all pokemon's accuracy by 40%
	"illuminate": {
		inherit: true,
		shortDesc: "All Pokemon's moves have their accuracy multiplied by 1.4x.",
		onAnyAccuracy: function (accuracy, target, source, move) {
			return accuracy * 1.4;
		},
		rating: 2,
	},
	
	// Victory Star
	//		Increases allies accuracy by 20%
	"victorystar": {
		inherit: true,
		shortDesc: "This Pokemon and its allies' moves have their accuracy multiplied by 1.2x.",
		onAllyModifyMove: function (move) {
			if (typeof move.accuracy === 'number') {
				move.accuracy *= 1.2;
			}
		},
	},
	
	// Slow Start
	//		Reduces Attack, Special Attack and Speed by 33% for 3 Turns on switch-in
	"slowstart": {
		inherit: true,
		shortDesc: "On switch-in, this Pokemon's Atk, SpAtk and Speed are 2/3x for 3 turns.",
		effect: {
			duration: 3,
			onStart: function (target) {
				this.add('-start', target, 'Slow Start');
			},
			onModifyAtk: function (atk, pokemon) {
				if (pokemon.ability !== 'slowstart') {
					pokemon.removeVolatile('slowstart');
					return;
				}
				return atk * 2 / 3;
			},
			onModifySpA: function (spa, pokemon) {
				if (pokemon.ability !== 'slowstart') {
					pokemon.removeVolatile('slowstart');
					return;
				}
				return spa * 2 / 3;
			},
			onModifySpe: function (spe, pokemon) {
				if (pokemon.ability !== 'slowstart') {
					pokemon.removeVolatile('slowstart');
					return;
				}
				return spe * 2 / 3;
			},
			onEnd: function (target) {
				this.add('-end', target, 'Slow Start');
			},
		},
	},
	
	// Multiscale
	//		Reduces damage taken by 33% when at full HP
	"multiscale": {
		inherit: true,
		shortDesc: "If this Pokemon is at full HP, damage taken from attacks is reduced by 33%.",
		onSourceModifyDamage: function (damage, source, target, move) {
			if (target.hp >= target.maxhp) {
				this.add('-message', "The attack was weakened by Multiscale!");
				return this.chainModify(2 / 3);
			}
		},
	},
	
	// Iron Fist
	//		Increases damage from punching moves by 30%
	"ironfist": {
		inherit: true,
		desc: "This Pokemon's punch-based attacks have their power multiplied by 1.3x.",
		shortDesc: "This Pokemon's punch-based attacks have 1.3x power. Sucker Punch is not boosted.",
		onBasePower: function (basePower, attacker, defender, move) {
			if (move.flags['punch']) {
				this.debug('Iron Fist boost');
				return this.chainModify(1.3);
			}
		},
	},
	
	// Stench
	//		Moves with no secondary effects gain a 30% chance to flinch
	"stench": {
		inherit: true,
		shortDesc: "This Pokemon's attacks without a chance to flinch have a 30% chance to flinch.",
		onModifyMove: function (move) {
			if (move.category !== "Status") {
				this.debug('Adding Stench flinch');
				if (!move.secondaries) move.secondaries = [];
				for (let i = 0; i < move.secondaries.length; i++) {
					if (move.secondaries[i].volatileStatus === 'flinch') return;
				}
				move.secondaries.push({
					chance: 30,
					volatileStatus: 'flinch',
				});
			}
		},
	},
	
	// Shadow Tag
	//		On switch-in, prevents foes from switching out for 3 turns
	"shadowtag": {
		desc: "For the first three turns after this Pokemon switches in, Prevents adjacent opposing Pokemon from choosing to switch out unless they are immune to trapping or also have this Ability.",
		shortDesc: "On switch-in, prevents adjacent foes from switching out for 3 turns.",
		onStart: function (pokemon) {
			pokemon.addVolatile('shadowtag');
		},
		effect: {
			duration: 3,
			onFoeTrapPokemon: function (pokemon) {
				if (!pokemon.hasAbility('shadowtag') && this.isAdjacent(pokemon, this.effectData.target)) {
					pokemon.tryTrap(true);
				}
			},
			onFoeMaybeTrapPokemon: function (pokemon, source) {
				if (!source) source = this.effectData.target;
				if (!pokemon.hasAbility('shadowtag') && this.isAdjacent(pokemon, source)) {
					pokemon.maybeTrapped = true;
				}
			},
		},
		id: "shadowtag",
		name: "Shadow Tag",
		rating: 4,
		num: 23,
	},
	
	// Run Away
	//		Immunity to trapping
	"runaway": {
		inherit: true,
		shortDesc: "This Pokemon may switch out even when trapped by another Pokemon, or by Ingrain.",
		onTrapPokemonPriority: -10,
		onTrapPokemon: function (pokemon) {
			pokemon.trapped = pokemon.maybeTrapped = false;
		},
		rating: 2,
	},
	
	// Skill Link
	//		Multi-hit moves have perfect accuracy
	"skilllink": {
		inherit: true,
		shortDesc: "This Pokemon's multi-hit attacks have perfect accuracy.",
		onModifyMove: function (move) {
			if (move.multihit) {
				move.accuracy = true;
			}
		},
	},
	
	// Battle Bond
	//		No longer makes Water Shuriken hit 3 times
	"battlebond": {
		inherit: true,
		desc: "If this Pokemon is a Greninja, it transforms into Ash-Greninja after knocking out a Pokemon. As Ash-Greninja, its Water Shuriken has 25 base power.",
		shortDesc: "After KOing a Pokemon: becomes Ash-Greninja, Water Shuriken: 25 power.",
		onModifyMove: function () {},
	},
	
	// Wonder Skin
	//		Foe's status moves without perfect accuracy always miss when used on this Pokemon
	//		Wonder Skin does not prevent moves from hitting a Substitute
	"wonderskin": {
		desc: "All opposing non-damaging moves that check accuracy miss when used on this Pokemon.",
		shortDesc: "Foe's status moves with accuracy checks always miss when used on this Pokemon.",
		onModifyAccuracy: function (accuracy, target, source, move) {
			if (!target.volatiles.substitute && source.side !== target.side && move.category === 'Status' && typeof move.accuracy === 'number') {
				this.add('-activate', target, 'ability: Wonderskin');
				return 0;
			}
		},
		id: "wonderskin",
		name: "Wonder Skin",
		rating: 3.5,
		num: 147,
	},
	
	// Anticipation
	//		Anticipates the last move used against it by a foe. If they use the same move again, it will miss
	//		Anticipation does not activate if the Pokemon is behind a Substitute
	"anticipation": {
		desc: "This Pokemon anticipates the last move used against it by an opponent, and is always able to evade it. Doesn't affect moves with perfect accuracy.",
		shortDesc: "The last move used against this Pokemon by a foe will miss if used again.",
		onStart: function (pokemon) {
			if (!pokemon.anticipatedMove) {
				this.add('-message', pokemon.name + " is anticipating its foe's moves!");
			} else {
				this.add('-message', pokemon.name + " is anticipating " + this.getMove(pokemon.anticipatedMove).name + "!");
			}
		},
		onModifyAccuracy: function (accuracy, target, source, move) {
			if (!target.volatiles.substitute && target.anticipatedMove && source.side !== target.side && move.id === target.anticipatedMove && typeof move.accuracy === 'number') {
				this.add('-activate', target, 'ability: Anticipation'); // "Pokemon shuddered!" message appears, unfortunatelly
				accuracy = 0;
			}
			target.anticipatedMove = move.id;
			return accuracy;
		},
		id: "anticipation",
		name: "Anticipation",
		rating: 3.5,
		num: 107,
	},
	
	// Adaptability
	//		Moves that don't match one of the user's types deal 30% increased damage
	"adaptability": {
		inherit: true,
		desc: "This Pokemon's moves that don't match any of its types have their power multiplied by 1.3x.",
		shortDesc: "This Pokemon's non STAB moves have 1.3x power.",
		onModifyMove: function (move) {},
		onBasePower: function (power, attacker, defender, move) {
			if (!attacker.hasType(move.type)) {
				return this.chainModify(1.3);
			}
		},
		rating: 3,
	},
	
	// Huge Power
	//		Increases Attack by 40%
	"hugepower": {
		inherit: true,
		shortDesc: "This Pokemon's Attack is multiplied by 1.4x.",
		onModifyAtk: function (atk) {
			return this.chainModify(1.4);
		},
		rating: 3.5,
	},
	
	// Pure Power
	//		Increases both Attack and Special Attack by 20%
	"purepower": {
		inherit: true,
		shortDesc: "This Pokemon's Attack and Special Attack are multiplied by 1.2x.",
		onModifyAtkPriority: 5,
		onModifyAtk: function (atk) {
			return this.chainModify(1.2);
		},
		onModifySpAPriority: 5,
		onModifySpA: function (spa) {
			return this.chainModify(1.2);
		},
		rating: 3.5,
	},
	
	// Moody
	//		Increases a random stat and decreases another by 1 each, every turn
	"moody": {
		inherit: true,
		desc: "This Pokemon has a random stat raised by 1 stages and another stat lowered by 1 stage at the end of each turn.",
		shortDesc: "Raises a random stat by 1 and lowers another stat by 1 at the end of each turn.",
		onResidual: function (pokemon) {
			let stats = [];
			let boost = {};
			for (let statPlus in pokemon.boosts) {
				if (pokemon.boosts[statPlus] < 6) {
					stats.push(statPlus);
				}
			}
			let randomStat = stats.length ? stats[this.random(stats.length)] : "";
			if (randomStat) boost[randomStat] = 1;

			stats = [];
			for (let statMinus in pokemon.boosts) {
				if (pokemon.boosts[statMinus] > -6 && statMinus !== randomStat) {
					stats.push(statMinus);
				}
			}
			randomStat = stats.length ? stats[this.random(stats.length)] : "";
			if (randomStat) boost[randomStat] = -1;

			this.boost(boost);
		},
		rating: 3,
	},
};
