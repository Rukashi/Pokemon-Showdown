'use strict';

exports.BattleAbilities = {
	// Infiltrator
	//		Moves ignore Protect, King's Shield, Spiky Shield, Baneful Bunker, Quick Guard, Wide Guard and Crafty Shield, BUT NOT DETECT
	//		Moves ignore Aurora Veil
	"infiltrator": {
		inherit: true,
		desc: "This Pokemon's moves ignore Substitute, Protect, King's Shield, Spiky Shield, Baneful Bunker, Quick Guard, Wide Guard and Crafty Shield, and the opposing side's Reflect, Light Screen, Aurora Veil, Safeguard, and Mist.",
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
	//		Reduces damage taken by 12.5%, doubled on Sunny Day
	//		Imunity to Freeze
	"magmaarmor": {
		inherit: true,
		desc: "This Pokemon takes 12.5% reduced damage, doubled during Sunny Day, and cannot be frozen. Gaining this Ability while frozen cures it.",
		shortDesc: "Immune to freezing. Takes 12.5% reduced damage, doubled during Sunny Day.",
		onSourceBasePower: function (basePower) {
			if (this.isWeather(['sunnyday', 'desolateland'])) {
				return basePower * 3 / 4;
			}
			return basePower * 7 / 8;
		},
	},
	
	// Water Veil
	//		Reduces damage taken by 12.5%, doubled on Rain Dance
	//		Imunity to Burn
	"waterveil": {
		inherit: true,
		desc: "This Pokemon takes 12.5% reduced damage, doubled during Rain Dance, and cannot be burned. Gaining this Ability while burned cures it.",
		shortDesc: "Immune to burn. Takes 12.5% reduced damage, doubled during Rain Dance.",
		onSourceBasePower: function (basePower) {
			if (this.isWeather(['raindance', 'primordialsea'])) {
				return basePower * 3 / 4;
			}
			return basePower * 7 / 8;
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
	//		Reduces damage taken by 12.5%, doubled on Sandstorm
	//		Imunity to Paralysis
	"sandveil": {
		inherit: true,
		desc: "This Pokemon takes 12.5% reduced damage, doubled during Sandstorm, and cannot be paralyzed. Gaining this Ability while paralyzed cures it. This Pokemon takes no damage from Sandstorm.",
		shortDesc: "Immune to paralysis. Takes 12.5% reduced damage, doubled during Sandstorm.",
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
			return basePower * 7 / 8;
		},
		onModifyAccuracy: function () {},
	},
	
	// Snow Cloak
	//		Reduces damage taken by 12.5%, doubled on Hail
	//		Immunity to Sleep
	"snowcloak": {
		inherit: true,
		desc: "This Pokemon takes 12.5% reduced damage, doubled during Hail, and cannot fall asleep. Gaining this Ability while asleep cures it. This Pokemon takes no damage from Hail.",
		shortDesc: "Immune to falling asleep. Takes 12.5% reduced damage, doubled during Hail.",
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
			return basePower * 7 / 8;
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
	},
	"flamebody": {
		inherit: true,
		shortDesc: "Burns Pokemon making contact with this Pokemon.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				source.trySetStatus('brn', target);
			}
		},
	},
	"static": {
		inherit: true,
		shortDesc: "Paralyzes Pokemon making contact with this Pokemon.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				source.trySetStatus('par', target);
			}
		},
	},
	"cutecharm": {
		inherit: true,
		shortDesc: "Infatuates Pokemon making contact with this Pokemon.",
		onAfterDamage: function (damage, target, source, move) {
			if (move && move.flags['contact']) {
				source.addVolatile('Attract', target);
			}
		},
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
		onModifyMove: function (move) {
			move.ignoreEvasion = true;
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
			onModifySpe: function (spe, pokemon) {
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
	
	// Shell Armor
	//		Reduces damage taken by 10% of Maximum HP, immune to critical hits
	//		Removed by Shell Smash
	"shellarmor": {
		inherit: true,
		shortDesc: "Reduces damage taken by 10% Max HP, and cannot be struck by a critical hit.",
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.add('-message', "Its damage was reduced by Shell Armor!");
				damage -= target.maxhp / 10;
				if (damage < 0) damage = 0;
				return damage;
			}
		},
		onHit: function (target, source, move) {
			if (move.id === 'shellsmash') {
				target.setAbility('');
			}
		},
	},
	
	// Battle Armor
	//		Reduces damage taken by 10% of Maximum HP, immune to critical hits
	"battlearmor": {
		inherit: true,
		shortDesc: "Reduces damage taken by 10% Max HP, and cannot be struck by a critical hit.",
		onDamage: function (damage, target, source, effect) {
			if (effect && effect.effectType === 'Move') {
				this.add('-message', "Its damage was reduced by Battle Armor!");
				damage -= target.maxhp / 10;
				if (damage < 0) damage = 0;
				return damage;
			}
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
};
