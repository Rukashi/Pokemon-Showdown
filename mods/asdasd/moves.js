'use strict';

exports.BattleMovedex = {
	// Stealth Rock
	//		25% Max HP Damage to Flying-types, 12.5% Otherwise
	"stealthrock": {
		inherit: true,
		desc: "Sets up a hazard on the foe's side of the field, damaging each foe that switches in. Can be used only once before failing. Foes lose 1/16 of their maximum HP, doubled if they're Flying-type, rounded down. Can be removed from the foe's side if any foe uses Rapid Spin or Defog, or is hit by Defog.",
		shortDesc: "Hurts foes on switch-in. Doubled on Flying-types.",
		effect: {
			// this is a side condition
			onStart: function (side) {
				this.add('-sidestart', side, 'move: Stealth Rock');
			},
			onSwitchIn: function (pokemon) {
				let factor = 2;
				if (pokemon.hasType('Flying')) factor = 4;
				this.damage(pokemon.maxhp * factor / 16);
			},
		},
	},
	
	// Rapid Spin
	//		Removes Hazards before Fainting
	"rapidspin": {
		inherit: true,
		desc: "If this move is successful, the effects of Leech Seed and partial-trapping moves end for the user, and all hazards are removed from the user's side of the field.",
		shortDesc: "Frees user from hazards/partial trap/Leech Seed.",
		self: {
			onHit: function (pokemon) {
				if (pokemon.removeVolatile('leechseed')) {
					this.add('-end', pokemon, 'Leech Seed', '[from] move: Rapid Spin', '[of] ' + pokemon);
				}
				let sideConditions = {spikes:1, toxicspikes:1, stealthrock:1, stickyweb:1};
				for (let i in sideConditions) {
					if (pokemon.side.removeSideCondition(i)) {
						this.add('-sideend', pokemon.side, this.getEffect(i).name, '[from] move: Rapid Spin', '[of] ' + pokemon);
					}
				}
				if (pokemon.volatiles['partiallytrapped']) {
					pokemon.removeVolatile('partiallytrapped');
				}
			},
		},
	},
	
	// Continuous side protection moves
	//		Better in general
	
	// Safeguard
	// Mist
	// Lucky Chant
	//		Duration increased by 3 turns when holding Light Clay
	"safeguard": {
		inherit: true,
		desc: "For 5 turns, the user and its party members cannot have major status conditions or confusion inflicted on them by other Pokemon. It is removed from the user's side if the user or an ally is successfully hit by Defog. Lasts for 8 turns if the user is holding Light Clay.",
		effect: {
			duration: 5,
			durationCallback: function (target, source, effect) {
				if (source && source.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onSetStatus: function (status, target, source, effect) {
				if (source && target !== source && effect && (!effect.infiltrates || target.side === source.side)) {
					this.debug('interrupting setStatus');
					if (effect.id === 'synchronize' || (effect.effectType === 'Move' && !effect.secondaries)) {
						this.add('-activate', target, 'move: Safeguard');
					}
					return null;
				}
			},
			onTryAddVolatile: function (status, target, source, effect) {
				if ((status.id === 'confusion' || status.id === 'yawn') && source && target !== source && effect && (!effect.infiltrates || target.side === source.side)) {
					if (!effect.secondaries) this.add('-activate', target, 'move: Safeguard');
					return null;
				}
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'Safeguard');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 2,
			onEnd: function (side) {
				this.add('-sideend', side, 'Safeguard');
			},
		},
	},
	"mist": {
		inherit: true,
		desc: "For 5 turns, the user and its party members are protected from having their stats lowered by other Pokemon. It is removed from the user's side if the user or an ally is successfully hit by Defog. Lasts for 8 turns if the user is holding Light Clay.",
		effect: {
			duration: 5,
			durationCallback: function (target, source, effect) {
				if (source && source.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onBoost: function (boost, target, source, effect) {
				if (source && target !== source && (!effect.infiltrates || target.side === source.side)) {
					let showMsg = false;
					for (let i in boost) {
						if (boost[i] < 0) {
							delete boost[i];
							showMsg = true;
						}
					}
					if (showMsg && !effect.secondaries) this.add('-activate', target, 'move: Mist');
				}
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'Mist');
			},
			onResidualOrder: 21,
			onResidualSubOrder: 3,
			onEnd: function (side) {
				this.add('-sideend', side, 'Mist');
			},
		},
	},
	"luckychant": {
		inherit: true,
		desc: "For 5 turns, the user and its party members are protected from the secondary effects of opposing Pokemon, and cannot be struck by a critical hit. Fails if this move is already in effect for the user's side. Lasts for 8 turns if the user is holding Light Clay.",
		shortDesc: "5 turns: party is immune to secondary effects and crits.",
		effect: {
			duration: 5,
			durationCallback: function (target, source, effect) {
				if (source && source.hasItem('lightclay')) {
					return 8;
				}
				return 5;
			},
			onStart: function (side) {
				this.add('-sidestart', side, 'move: Lucky Chant'); // "The Lucky Chant shielded [side.name]'s team from critical hits!"
			},
			onCriticalHit: function (move) {
				if (!move.infiltrates) {return false;}
			},
			onResidualOrder: 21,
			onResidualSubOrder: 5,
			onEnd: function (side) {
				this.add('-sideend', side, 'move: Lucky Chant'); // "[side.name]'s team's Lucky Chant wore off!"
			},
		},
	},
	
	// Stall moves
	//		Nerfed in general
	
	// Substitute
	//		Substitute is hit before Protect, Detect, King's Shield, Spiky Shield, Baneful Bunker, Quick Guard, Wide Guard
	//		Attacks against a Substitute always Hit
	"substitute": {
		inherit: true,
		effect: {
			onStart: function (target) {
				this.add('-start', target, 'Substitute');
				this.effectData.hp = Math.floor(target.maxhp / 4);
				delete target.volatiles['partiallytrapped'];
			},
			onAccuracyPriority: -100,
			onAccuracy: function (accuracy, target, source, move) {
				return 100;
			},
			onTryPrimaryHitPriority: 2,
			onTryPrimaryHit: function (target, source, move) {
				if (target === source || move.flags['authentic'] || move.infiltrates) {
					return;
				}
				let damage = this.getDamage(source, target, move);
				if (!damage) {
					return null;
				}
				damage = this.runEvent('SubDamage', target, source, move, damage);
				if (!damage) {
					return damage;
				}
				if (damage > target.volatiles['substitute'].hp) {
					damage = target.volatiles['substitute'].hp;
				}
				target.volatiles['substitute'].hp -= damage;
				source.lastDamage = damage;
				if (target.volatiles['substitute'].hp <= 0) {
					target.removeVolatile('substitute');
				} else {
					this.add('-activate', target, 'Substitute', '[damage]');
				}
				if (move.recoil) {
					this.damage(this.clampIntRange(Math.round(damage * move.recoil[0] / move.recoil[1]), 1), source, target, 'recoil');
				}
				if (move.drain) {
					this.heal(Math.ceil(damage * move.drain[0] / move.drain[1]), source, target, 'drain');
				}
				this.runEvent('AfterSubDamage', target, source, move, damage);
				return 0; // hit
			},
			onEnd: function (target) {
				this.add('-end', target, 'Substitute');
			},
		},
	},
	
	// Protect
	//		Substitute is hit before Protect
	//		Infiltrator ignores Protect
	"protect": {
		inherit: true,
		desc: "The user is protected from most attacks made by other Pokemon during this turn. Moves from Pokemon with the Ability Infiltrator go through this protection. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (target.volatiles.substitute || !move.flags['protect'] || move.infiltrates) return;
				this.add('-activate', target, 'Protect');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			},
		},
	},
	
	// Detect
	//		Substitute is hit before Detect
	"detect": {
		inherit: true,
		volatileStatus: 'detect',
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'Detect'); //'Protect'
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (target.volatiles.substitute || !move.flags['protect']) return;
				this.add('-activate', target, 'Detect'); //'Protect'
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			},
		},
	},
	
	// King's Shield
	//		Substitute is hit before King's Shield
	//		Only reduces Attack by 1 Stage
	//		Infiltrator ignores King's Shield
	"kingsshield": {
		inherit: true,
		desc: "The user is protected from most attacks made by other Pokemon during this turn, and Pokemon trying to make contact with the user have their Attack lowered by 1 stages. Non-damaging moves and moves from Pokemon with the Ability Infiltrator go through this protection. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
		shortDesc: "Protects from attacks. Contact try: lowers Atk by 1.",
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (target.volatiles.substitute || !move.flags['protect'] || move.category === 'Status' || move.infiltrates) return;
				this.add('-activate', target, 'Protect');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (move.flags['contact']) {
					this.boost({atk:-1}, source, target, this.getMove("King's Shield"));
				}
				return null;
			},
		},
	},
	
	// Spiky Shield
	//		Substitute is hit before Spiky Shield
	//		Spiky Shield no longer prevent Status Moves
	//		Infiltrator ignores Spiky Shield
	"spikyshield": {
		inherit: true,
		desc: "The user is protected from most attacks made by other Pokemon during this turn, and Pokemon making contact with the user lose 1/8 of their maximum HP, rounded down. Non-damaging moves and moves from Pokemon with the Ability Infiltrator go through this protection. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (target.volatiles.substitute || !move.flags['protect'] || move.category === 'Status' || move.infiltrates) return;
				if (move && (move.target === 'self' || move.id === 'suckerpunch')) return;
				this.add('-activate', target, 'move: Protect');
				if (move.flags['contact']) {
					this.damage(source.maxhp / 8, source, target);
				}
				return null;
			},
		},
	},
	
	// Baneful Bunker
	//		Substitute is hit before Baneful Bunker
	//		Baneful Bunker no longer prevent Status Moves
	//		Infiltrator ignores Baneful Bunker
	"banefulbunker": {
		inherit: true,
		desc: "The user is protected from most attacks made by other Pokemon during this turn, and Pokemon making contact with the user become poisoned. Non-damaging moves and moves from Pokemon with the Ability Infiltrator go through this protection. This move has a 1/X chance of being successful, where X starts at 1 and triples each time this move is successfully used. X resets to 1 if this move fails or if the user's last move used is not Baneful Bunker, Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn.",
		effect: {
			duration: 1,
			onStart: function (target) {
				this.add('-singleturn', target, 'move: Protect');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (target.volatiles.substitute || !move.flags['protect'] || move.category === 'Status' || move.infiltrates) return;
				this.add('-activate', target, 'move: Protect');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				if (move.flags['contact']) {
					source.trySetStatus('psn');
				}
				return null;
			},
		},
	},
	
	// Quick Guard
	//		Substitute is hit before Quick Guard
	//		Infiltrator ignores Quick Guard
	"quickguard": {
		inherit: true,
		desc: "The user and its party members are protected from attacks with original or altered priority greater than 0 made by other Pokemon, including allies, during this turn. Moves from Pokemon with the Ability Infiltrator go through this protection. This move modifies the same 1/X chance of being successful used by other protection moves, where X starts at 1 and triples each time this move is successfully used, but does not use the chance to check for failure. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn or if this move is already in effect for the user's side.",
		effect: {
			duration: 1,
			onStart: function (target, source) {
				this.add('-singleturn', source, 'Quick Guard');
			},
			onTryHitPriority: 4,
			onTryHit: function (target, source, effect) {
				// Quick Guard blocks moves with positive priority, even those given increased priority by Prankster or Gale Wings.
				// (e.g. it blocks 0 priority moves boosted by Prankster or Gale Wings; Quick Claw/Custap Berry do not count)
				if (target.volatiles.substitute || (effect && (effect.id === 'feint' || effect.priority <= 0.1 || effect.target === 'self' || effect.infiltrates))) {
					return;
				}
				this.add('-activate', target, 'move: Quick Guard');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			},
		},
	},
	
	// Wide Guard
	//		Substitute is hit before Wide Guard
	//		Infiltrator ignores Wide Guard
	"wideguard": {
		inherit: true,
		desc: "The user and its party members are protected from damaging attacks made by other Pokemon, including allies, during this turn that target all adjacent foes or all adjacent Pokemon. Moves from Pokemon with the Ability Infiltrator go through this protection. This move modifies the same 1/X chance of being successful used by other protection moves, where X starts at 1 and triples each time this move is successfully used, but does not use the chance to check for failure. X resets to 1 if this move fails or if the user's last move used is not Detect, Endure, King's Shield, Protect, Quick Guard, Spiky Shield, or Wide Guard. Fails if the user moves last this turn or if this move is already in effect for the user's side.",
		effect: {
			duration: 1,
			onStart: function (target, source) {
				this.add('-singleturn', source, 'Wide Guard');
			},
			onTryHitPriority: 4,
			onTryHit: function (target, source, effect) {
				// Wide Guard blocks damaging spread moves
				if (target.volatiles.substitute || (effect && (effect.category === 'Status' || (effect.target !== 'allAdjacent' && effect.target !== 'allAdjacentFoes') || effect.infiltrates))) {
					return;
				}
				this.add('-activate', target, 'move: Wide Guard');
				let lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			},
		},
	},
	
	// Mat Block
	//		Substitute is hit before Mat Block
	//		Infiltrator ignores Mat Block
	"matblock": {
		inherit: true,
		desc: "The user and its party members are protected from damaging attacks made by other Pokemon, including allies, during this turn. Moves from Pokemon with the Ability Infiltrator go through this protection. Fails unless it is the user's first turn on the field, if the user moves last this turn, or if this move is already in effect for the user's side.",
		effect: {
			duration: 1,
			onStart: function (target, source) {
				this.add('-singleturn', source, 'Mat Block');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (!move.flags['protect']) return;
				if (target.volatiles.substitute || move && (move.target === 'self' || move.category === 'Status') || move.infiltrates) return;
				this.add('-activate', target, 'Mat Block', move.name);
				var lockedmove = source.getVolatile('lockedmove');
				if (lockedmove) {
					// Outrage counter is reset
					if (source.volatiles['lockedmove'].duration === 2) {
						delete source.volatiles['lockedmove'];
					}
				}
				return null;
			}
		},
	},
	
	// Crafty Shield
	//		Substitute is hit before Crafty Shield
	//		Infiltrator ignores Crafty Shield
	"craftyshield": {
		inherit: true,
		desc: "The user and its party members are protected from non-damaging attacks made by other Pokemon, including allies, during this turn. Moves from Pokemon with the Ability Infiltrator go through this protection. Fails if the user moves last this turn or if this move is already in effect for the user's side.",
		effect: {
			duration: 1,
			onStart: function (target, source) {
				this.add('-singleturn', source, 'Crafty Shield');
			},
			onTryHitPriority: 3,
			onTryHit: function (target, source, move) {
				if (target.volatiles.substitute || (move && (move.target === 'self' || move.category !== 'Status')) || effect.infiltrates) return;
				this.add('-activate', target, 'move: Crafty Shield');
				return null;
			},
		},
	},
	
	// 2 Turn Moves
	//		160 Base Power, 100% Accuracy
	//		Moves with semi-invulnerability turns lose some of their damage in exchange for the added safety
	
	// Solar Beam
	// Solar Blade
	//		160 Base Power
	"solarbeam": {
		inherit: true,
		isViable: true,
		basePower: 160,
		zMovePower: 200,
	},
	"solarblade": {
		inherit: true,
		isViable: true,
		basePower: 160,
		zMovePower: 200,
	},
	
	// Sky Attack
	//		160 Base Power, 100% Accuracy, 10 PP, No Secondary Effect (Still has increased critical hit rate)
	"skyattack": {
		inherit: true,
		isViable: true,
		basePower: 160,
		accuracy: 100,
		pp: 10,
		secondary: null,
		zMovePower: 200,
	},
	
	// Skull Bash
	//		160 Base Power
	"skullbash": {
		inherit: true,
		isViable: true,
		basePower: 160,
		zMovePower: 200,
	},
	
	// Freeze Shock
	// Ice Burn
	//		160 Base Power, 100% Accuracy
	"freezeshock": {
		inherit: true,
		isViable: true,
		basePower: 160,
		accuracy: 100,
		zMovePower: 200,
	},
	"iceburn": {
		inherit: true,
		isViable: true,
		basePower: 160,
		accuracy: 100,
		zMovePower: 200,
	},
	
	// Razor Wind
	//		Flying-type, 120 Base Power, No High Crit rate
	"razorwind": {
		inherit: true,
		isViable: true,
		basePower: 120,
		critRatio: 1,
		type: "Flying",
		zMovePower: 190,
	},
	
	// Fly
	// Dig
	// Dive
	//		120 Base Power, 100% Accuracy
	"fly": {
		inherit: true,
		isViable: true,
		basePower: 120,
		accuracy: 100,
		zMovePower: 190,
	},
	"dig": {
		inherit: true,
		isViable: true,
		basePower: 120,
		accuracy: 100,
		zMovePower: 190,
	},
	"dive": {
		inherit: true,
		isViable: true,
		basePower: 120,
		accuracy: 100,
		zMovePower: 190,
	},
	
	// Bounce
	//		100 Base Power, 100% Accuracy
	"bounce": {
		inherit: true,
		isViable: true,
		basePower: 100,
		accuracy: 100,
		zMovePower: 180,
	},
	
	// Shadow Force
	//		100 Base Power
	"shadowforce": {
		inherit: true,
		isViable: true,
		basePower: 100,
		accuracy: 100,
		zMovePower: 180,
	},
	
	// Sky Drop
	//		80 Base Power
	"skydrop": {
		inherit: true,
		basePower: 80,
		zMovePower: 160,
	},
	
	// Hyper Beam
	// Giga Impact
	// Blast Burn
	// Frenzy Plant
	// Hydro Cannon
	// Prismatic Laser
	// Rock Wrecker
	// Roar of Time
	//		160 Base Power, 100% Accuracy
	"hyperbeam": {
		inherit: true,
		basePower: 160,
		accuracy: 100,
		zMovePower: 200,
	},
	"gigaimpact": {
		inherit: true,
		basePower: 160,
		accuracy: 100,
		zMovePower: 200,
	},
	"blastburn": {
		inherit: true,
		basePower: 160,
		accuracy: 100,
		zMovePower: 200,
	},
	"frenzyplant": {
		inherit: true,
		basePower: 160,
		accuracy: 100,
		zMovePower: 200,
	},
	"hydrocannon": {
		inherit: true,
		basePower: 160,
		accuracy: 100,
		zMovePower: 200,
	},
	"prismaticlaser": {
		inherit: true,
		basePower: 160,
		accuracy: 100,
		zMovePower: 200,
	},
	"rockwrecker": {
		inherit: true,
		basePower: 160,
		accuracy: 100,
		zMovePower: 200,
	},
	"roaroftime": {
		inherit: true,
		basePower: 160,
		accuracy: 100,
		zMovePower: 200,
	},
	
	// Roar
	// Whirlwind
	//		Perfect Accuracy
	"roar": {
		inherit: true,
		accuracy: true,
	},
	"whirlwind": {
		inherit: true,
		accuracy: true,
	},
	
	// 2 Hit Moves
	//		Wing Attack is now a 2 Hit Move
	//		40 Base Power, 100% Accuracy, 15 PP
	"bonemerang": {
		inherit: true,
		basePower: 40,
		accuracy: 100,
		pp: 15,
		zMovePower: 100,
	},
	"doublehit": {
		inherit: true,
		basePower: 40,
		accuracy: 100,
		pp: 15,
		zMovePower: 100,
	},
	"doublekick": {
		inherit: true,
		basePower: 40,
		accuracy: 100,
		pp: 15,
		zMovePower: 100,
	},
	"dualchop": {
		inherit: true,
		basePower: 40,
		accuracy: 100,
		pp: 15,
		zMovePower: 100,
	},
	"geargrind": {
		inherit: true,
		basePower: 40,
		accuracy: 100,
		pp: 15,
		zMovePower: 100,
	},
	"wingattack": {
		inherit: true,
		basePower: 40,
		accuracy: 100,
		pp: 15,
		multihit: 2,
		zMovePower: 100,
	},
	
	// Twineedle
	//		Hits 2 Times, 40 Base Power, 100% Accuracy, 10 PP, 30% Poison Chance per Hit
	"twineedle": {
		inherit: true,
		basePower: 40,
		accuracy: 100,
		pp: 10,
		secondary: {
			chance: 30,
			status: 'psn',
		},
		zMovePower: 100,
	},
	
	// 2-5 Multihit Moves
	//		Will always try to hit 5 times, each with its independent accuracy check
	
	// Arm Thrust
	// Barrage
	// Double Slap
	// Fury Attack
	//		15 Base Power, 90% Accuracy, 30 PP
	"armthrust": {
		inherit: true,
		basePower: 15,
		accuracy: 90,
		multihit: 5,
		multiaccuracy: true,
		tryAllHits: true,
		pp: 30,
		zMovePower: 100,
	},
	"barrage": {
		inherit: true,
		basePower: 15,
		accuracy: 90,
		multihit: 5,
		multiaccuracy: true,
		tryAllHits: true,
		pp: 30,
		zMovePower: 100,
	},
	"doubleslap": {
		inherit: true,
		basePower: 15,
		accuracy: 90,
		multihit: 5,
		multiaccuracy: true,
		tryAllHits: true,
		pp: 30,
		zMovePower: 100,
	},
	"furyattack": {
		inherit: true,
		basePower: 15,
		accuracy: 90,
		multihit: 5,
		multiaccuracy: true,
		tryAllHits: true,
		pp: 30,
		zMovePower: 100,
	},
	
	// Bone Rush
	// Comet Punch
	// Fury Swipes
	//		20 Base Power, 80% Accuracy, 20 PP
	"bonerush": {
		inherit: true,
		basePower: 20,
		accuracy: 80,
		multihit: 5,
		multiaccuracy: true,
		tryAllHits: true,
		pp: 20,
		zMovePower: 100,
	},
	"cometpunch": {
		inherit: true,
		basePower: 20,
		accuracy: 80,
		multihit: 5,
		multiaccuracy: true,
		tryAllHits: true,
		pp: 20,
		zMovePower: 100,
	},
	"furyswipes": {
		inherit: true,
		basePower: 20,
		accuracy: 80,
		multihit: 5,
		multiaccuracy: true,
		tryAllHits: true,
		pp: 20,
		zMovePower: 100,
	},
	
	// Bullet Seed
	// Icicle Spear
	// Pin Missile
	// Rock Blast
	// Spike Cannon
	//		25 Base Power, 70% Accuracy, 15 PP
	"bulletseed": {
		inherit: true,
		basePower: 25,
		accuracy: 70,
		multihit: 5,
		multiaccuracy: true,
		tryAllHits: true,
		pp: 15,
		zMovePower: 100,
	},
	"iciclespear": {
		inherit: true,
		basePower: 25,
		accuracy: 70,
		multihit: 5,
		multiaccuracy: true,
		tryAllHits: true,
		pp: 15,
		zMovePower: 100,
	},
	"pinmissile": {
		inherit: true,
		basePower: 25,
		accuracy: 70,
		multihit: 5,
		multiaccuracy: true,
		tryAllHits: true,
		pp: 15,
		zMovePower: 100,
	},
	"rockblast": {
		inherit: true,
		basePower: 25,
		accuracy: 70,
		multihit: 5,
		multiaccuracy: true,
		tryAllHits: true,
		pp: 15,
		zMovePower: 100,
	},
	"spikecannon": {
		inherit: true,
		basePower: 25,
		accuracy: 70,
		multihit: 5,
		multiaccuracy: true,
		tryAllHits: true,
		pp: 15,
		zMovePower: 100,
	},
	
	// Tail Slap
	//		30 Base Power, 60% Accuracy, 10 PP
	"tailslap": {
		inherit: true,
		basePower: 30,
		accuracy: 60,
		multihit: 5,
		multiaccuracy: true,
		tryAllHits: true,
		pp: 10,
		zMovePower: 100,
	},
	
	// Water Shuriken
	//		15 Base Power, 70% Accuracy, 10 PP, +1 Priority
	//		25 Base Power when used by Ash-Greninja
	"watershuriken": {
		inherit: true,
		basePower: 15,
		accuracy: 70,
		multihit: 5,
		multiaccuracy: true,
		tryAllHits: true,
		pp: 10,
		basePowerCallback: function (pokemon, target, move) {
			if (pokemon.template.species === 'Greninja-Ash' && pokemon.hasAbility('battlebond')) {
				return 25;
			}
			return move.basePower;
		},
		zMovePower: 100,
	},
	
	// Triple Kick
	//		15 Base Power
	"triplekick": {
		inherit: true,
		desc: "Hits three times. Power increases to 30 for the second hit and 45 for the third. This move checks accuracy for each hit, and the attack ends if the target avoids any of the hits. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit three times.",
		basePower: 15,
		basePowerCallback: function (pokemon) {
			pokemon.addVolatile('triplekick');
			return 15 * pokemon.volatiles['triplekick'].hit;
		},
		zMovePower: 100,
	},
	
	// Beat Up
	//		Base Power Increased, 5 PP
	"beatup": {
		inherit: true,
		basePowerCallback: function (pokemon, target) {
			pokemon.addVolatile('beatup');
			if (!pokemon.side.pokemon[pokemon.volatiles.beatup.index]) return null;
			return 5 + Math.floor(pokemon.side.pokemon[pokemon.volatiles.beatup.index].template.baseStats.atk / 5);
		},
		pp: 5,
		zMovePower: 100,
	},
	
	// Draining Moves
	//		Descriptions updated, due to Big Root changes
	
	// Draining Kiss
	// Drain Punch
	// Giga Drain
	// Horn Leech
	// Leech Life
	// Parabolic Charge
	//		80 Base Power, Drains 50% of Damage Dealt
	"drainingkiss": {
		inherit: true,
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.5x normal, rounded half down.",
		shortDesc: "User recovers 50% of the damage dealt.",
		basePower: 80,
		drain: [1, 2],
		zMovePower: 160,
	},
	"drainpunch": {
		inherit: true,
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.5x normal, rounded half down.",
		basePower: 80,
		drain: [1, 2],
		zMovePower: 160,
	},
	"gigadrain": {
		inherit: true,
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.5x normal, rounded half down.",
		basePower: 80,
		drain: [1, 2],
		zMovePower: 160,
	},
	
	"hornleech": {
		inherit: true,
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.5x normal, rounded half down.",
		basePower: 80,
		drain: [1, 2],
		zMovePower: 160,
	},
	"leechlife": {
		inherit: true,
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.5x normal, rounded half down.",
		basePower: 80,
		drain: [1, 2],
		zMovePower: 160,
	},
	"paraboliccharge": {
		inherit: true,
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.5x normal, rounded half down.",
		basePower: 80,
		drain: [1, 2],
		zMovePower: 160,
	},
	
	// Mega Drain
	//		60 Base Power, Drains 50% of Damage Dealt
	"megadrain": {
		inherit: true,
		desc: "The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.5x normal, rounded half down.",
		basePower: 60,
		drain: [1, 2],
		zMovePower: 120,
	},
	
	// Dream Eater
	//		120 Base Power, Drains 50% of Damage Dealt
	"dreameater": {
		inherit: true,
		desc: "The target is unaffected by this move unless it is asleep. The user recovers 1/2 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.5x normal, rounded half down.",
		basePower: 120,
		drain: [1, 2],
		zMovePower: 190,
	},
	
	// Absorb
	//		40 Base Power, 20 PP, Drains 75% of Damage Dealt
	//		Deals double damage against targets under the effects of Leech Seed
	"absorb": {
		inherit: true,
		basePower: 40,
		basePowerCallback: function (pokemon, target, move) {
			if (target.volatiles['leechseed']) return move.basePower * 2;
			return move.basePower;
		},
		desc: "Power doubles if the target is under the effects of Leech Seed. The user recovers 3/4 the HP lost by the target, rounded half up. If Big Root is held by the user, the HP recovered is 1.5x normal, rounded half down.",
		shortDesc: "2x Power if foe afflicted by Leech Seed; Recovers 75% of the damage dealt.",
		pp: 20,
		drain: [3, 4],
		zMovePower: 100,
	},
	
	// Oblivion Wing
	//		Drains 100% of Damage Dealt
	"oblivionwing": {
		inherit: true,
		desc: "The user recovers all the HP lost by the target. If Big Root is held by the user, the HP recovered is 1.5x normal, rounded half down.",
		shortDesc: "User recovers 100% of the damage dealt.",
		drain: [1, 1],
	},
	
	// Aqua Ring
	// Ingrain
	//		Heal 12.5% Max HP each turn
	//		Descriptions updated, due to Big Root changes
	"aquaring": {
		inherit: true,
		desc: "The user has 1/8 of its maximum HP, rounded down, restored at the end of each turn while it remains active. If Big Root is held by the recipient, the HP recovered is 1.5x normal, rounded half down. If the user uses Baton Pass, the replacement will receive the healing effect.",
		shortDesc: "User recovers 1/8 max HP per turn.",
		effect: {
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'Aqua Ring');
			},
			onResidualOrder: 6,
			onResidual: function (pokemon) {
				this.heal(pokemon.maxhp / 8);
			},
		},
	},
	"ingrain": {
		inherit: true,
		desc: "The user has 1/8 of its maximum HP restored at the end of each turn, but it is prevented from switching out and other Pokemon cannot force the user to switch out. If Big Root is held by the recipient, the HP recovered is 1.5x normal, rounded half down. The user can still switch out if it uses Baton Pass, Parting Shot, U-turn, or Volt Switch. If the user leaves the field using Baton Pass, the replacement will remain trapped and still receive the healing effect. During the effect, the user can be hit normally by Ground-type attacks and be affected by Spikes, Toxic Spikes, and Sticky Web, even if the user is a Flying type or has the Ability Levitate.",
		shortDesc: "User recovers 1/8 max HP per turn. Traps user.",
		effect: {
			onStart: function (pokemon) {
				this.add('-start', pokemon, 'move: Ingrain');
			},
			onResidualOrder: 7,
			onResidual: function (pokemon) {
				this.heal(pokemon.maxhp / 8);
			},
			onTrapPokemon: function (pokemon) {
				pokemon.tryTrap();
			},
			// groundedness implemented in battle.engine.js:BattlePokemon#isGrounded
			onDragOut: function (pokemon) {
				this.add('-activate', pokemon, 'move: Ingrain');
				return null;
			},
		},
	},
	
	// Leech Seed
	// Strength Sap
	//		Descriptions updated, due to Big Root changes
	"leechseed": {
		inherit: true,
		desc: "The Pokemon at the user's position steals 1/8 of the target's maximum HP, rounded down, at the end of each turn. If Big Root is held by the recipient, the HP recovered is 1.5x normal, rounded half down. If the target uses Baton Pass, the replacement will continue being leeched. If the target switches out or uses Rapid Spin, the effect ends. Grass-type Pokemon are immune to this move on use, but not its effect.",
	},
	"strengthsap": {
		inherit: true,
		desc: "The user restores its HP equal to the target's Attack stat, calculated with its stat stage, then lowers the target's Attack by 1 stage. If Big Root is held by the user, the HP recovered is 1.5x normal, rounded half down.",
	},
	
	// Astonish
	//		Now a Ghost-type Fake Out
	"astonish": {
		inherit: true,
		basePower: 40,
		desc: "Has a 100% chance to flinch the target. Fails unless it is the user's first turn on the field.",
		shortDesc: "Hits first. First turn out only. 100% flinch chance.",
		isViable: true,
		pp: 10,
		priority: 3,
		onTry: function (pokemon, target) {
			if (pokemon.activeTurns > 1) {
				this.add('-fail', pokemon);
				this.add('-hint', "Astonish only works on your first turn out.");
				return null;
			}
		},
		secondary: {
			chance: 100,
			volatileStatus: 'flinch',
		},
		zMovePower: 100,
	},
	
	// Spite
	//		Reduces PP from the target's last used move by 10
	"spite": {
		inherit: true,
		desc: "Causes the target's last move used to lose 10 PP. Fails if the target has not made a move, if the move has 0 PP, or if it no longer knows the move.",
		shortDesc: "Lowers the PP of the target's last move by 10.",
		onHit: function (target) {
			if (target.deductPP(target.lastMove, 10)) {
				this.add("-activate", target, 'move: Spite', this.getMove(target.lastMove).name, 10);
				return;
			}
			return false;
		},
	},
	
	// Grudge
	//		Until the next turn, if an opponent knocks the user out, they lose half of all their remaining PP, rounded up
	"grudge": {
		inherit: true,
		desc: "Until the user's next turn, if a foe's attack knocks the user out, that foe loses half of the remaining PP for all of its moves, rounded up.",
		shortDesc: "If the user faints, the attacker loses half of all its PP.",
		effect: {
			onStart: function (pokemon) {
				this.add('-singlemove', pokemon, 'Grudge');
			},
			onFaint: function (target, source, effect) {
				if (!source || !effect) return;
				if (effect.effectType === 'Move' && !effect.isFutureMove) {
					let worked = false;
					for (let i in source.moveset) {
						if (source.moveset[i].pp > 0) {
							source.moveset[i].pp -= Math.ceil(source.moveset[i].pp / 2);
							worked = true;
						}
					}
					if (worked) this.add('-message', source.name + " lost half of its PP due to the grudge!");
				}
			},
			onBeforeMovePriority: 100,
			onBeforeMove: function (pokemon) {
				this.debug('removing Grudge before attack');
				pokemon.removeVolatile('grudge');
			},
		},
	},
	
	// Knock Off
	//		70 Base Power, no longer deals increased damage when removing an item
	//		Attempts to remove the target's item regardless of whether the user has fainted or not
	"knockoff": {
		inherit: true,
		basePower: 70,
		desc: "If the target is holding an item that can be removed from it, it loses its held item. This move cannot cause Pokemon with the Ability Sticky Hold to lose their held item, cause Pokemon that can Mega Evolve to lose the Mega Stone for their species, or cause a Kyogre, a Groudon, a Giratina, an Arceus, or a Genesect to lose their Blue Orb, Red Orb, Griseous Orb, Plate, or Drive, respectively. Items lost to this move cannot be regained with Recycle or the Ability Harvest.",
		shortDesc: "Removes the target's item if posible.",
		onBasePowerPriority: null,
		onBasePower: function () {},
		onAfterHit: function (target, source) {
			let item = target.takeItem();
			if (item) {
				this.add('-enditem', target, item.name, '[from] move: Knock Off', '[of] ' + source);
			}
		},
		zMovePower: 140,
	},
	
	// Covet
	// Thief
	//		70 Base Power, 10 PP
	//		deals 50% increased damage if foe has an item and user doesn't, then steals it if possible
	//		Can steal the target's item after using a Gem item
	"covet": {
		inherit: true,
		basePower: 70,
		desc: "If the target is holding an item that can be removed from it, ignoring the Ability Sticky Hold, and the user is not holding any item, this move's power is multiplied by 1.5. If the user has not fainted, the user steals the target's item. This move cannot cause Pokemon with the Ability Sticky Hold to lose their held item, cause Pokemon that can Mega Evolve to lose the Mega Stone for their species, or cause a Giratina, an Arceus, or a Genesect to lose their Griseous Orb, Plate, or Drive, respectively. Items lost to this move cannot be regained with Recycle or the Ability Harvest.",
		shortDesc: "Foe has item, user doesn't: 1.5x power, Steals it.",
		isViable: true,
		pp: 10,
		onBasePowerPriority: 4,
		onBasePower: function (basePower, pokemon, target) {
			var item = target.getItem();
			var noThief = (item.onTakeItem && item.onTakeItem(item, target) === false) || pokemon.item;
			if (item.id && !noThief) {
				return this.chainModify(1.5);
			}
		},
		onHit: function (target, source) {
			if (source.item) {
				return;
			}
			let yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (!source.setItem(yourItem)) {
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-item', source, yourItem, '[from] move: Covet', '[of] ' + target);
		},
		zMovePower: 140,
	},
	"thief": {
		inherit: true,
		basePower: 70,
		desc: "If the target is holding an item that can be removed from it, ignoring the Ability Sticky Hold, and the user is not holding any item, this move's power is multiplied by 1.5. If the user has not fainted, the user steals the target's item. This move cannot cause Pokemon with the Ability Sticky Hold to lose their held item, cause Pokemon that can Mega Evolve to lose the Mega Stone for their species, or cause a Giratina, an Arceus, or a Genesect to lose their Griseous Orb, Plate, or Drive, respectively. Items lost to this move cannot be regained with Recycle or the Ability Harvest.",
		shortDesc: "Foe has item, user doesn't: 1.5x power, Steals it.",
		isViable: true,
		pp: 10,
		onBasePowerPriority: 4,
		onBasePower: function (basePower, pokemon, target) {
			var item = target.getItem();
			var noThief = (item.onTakeItem && item.onTakeItem(item, target) === false) || pokemon.item;
			if (item.id && !noThief) {
				return this.chainModify(1.5);
			}
		},
		onHit: function (target, source) {
			if (source.item) {
				return;
			}
			let yourItem = target.takeItem(source);
			if (!yourItem) {
				return;
			}
			if (!source.setItem(yourItem)) {
				target.item = yourItem.id; // bypass setItem so we don't break choicelock or anything
				return;
			}
			this.add('-item', source, yourItem, '[from] move: Thief', '[of] ' + target);
		},
		zMovePower: 140,
	},
	
	// Perfect Accuracy Moves
	//		80 Base Power, except Clear Smog due to secondary effect
	"aerialace": {
		inherit: true,
		isViable: true,
		basePower: 80,
		zMovePower: 160,
	},
	"feintattack": {
		inherit: true,
		isViable: true,
		basePower: 80,
		zMovePower: 160,
	},
	"shadowpunch": {
		inherit: true,
		isViable: true,
		basePower: 80,
		zMovePower: 160,
	},
	"magnetbomb": {
		inherit: true,
		isViable: true,
		basePower: 80,
		zMovePower: 160,
	},
	"magicalleaf": {
		inherit: true,
		isViable: true,
		basePower: 80,
		zMovePower: 160,
	},
	"shockwave": {
		inherit: true,
		isViable: true,
		basePower: 80,
		zMovePower: 160,
	},
	"smartstrike": {
		inherit: true,
		isViable: true,
		basePower: 80,
		zMovePower: 160,
	},
	"swift": {
		inherit: true,
		isViable: true,
		basePower: 80,
		zMovePower: 160,
	},
	"disarmingvoice": {
		inherit: true,
		isViable: true,
		basePower: 80,
		zMovePower: 160,
	},
	"aurasphere": {
		inherit: true,
		isViable: true,
		basePower: 80,
		zMovePower: 160,
	},
	
	// Clear Smog
	//		65 Base Power
	"clearsmog": {
		inherit: true,
		isViable: true,
		basePower: 65,
		zMovePower: 120,
	},
	
	// Status-inducing Moves
	//		Multiple changes
	
	// Toxic
	//		Fix, due to scripts.js changes
	"toxic": {
		inherit: true,
		desc: "Badly poisons the target. If a Poison-type Pokemon uses this move, the target cannot avoid the attack.",
		onModifyMove: function (move, source) {
			if (source.hasType('Poison')) {
				move.accuracy = true;
			}
		},
	},
	
	// Thunder Wave
	//		Perfect accuracy when used by Electric-type Pokemon
	"thunderwave": {
		inherit: true,
		desc: "Paralyzes the target. If an Electric-type Pokemon uses this move, the target cannot avoid the attack.",
		onModifyMove: function (move, source) {
			if (source.hasType('Electric')) {
				move.accuracy = true;
			}
		},
	},
	
	// Will-o-Wisp
	//		Is now a Ghost-type Move
	//		90% Accuracy, perfect accuracy when used by Ghost-type Pokemon
	"willowisp": {
		inherit: true,
		desc: "Burns the target. If a Ghost-type Pokemon uses this move, the target cannot avoid the attack.",
		accuracy: 90,
		type: "Ghost",
		onModifyMove: function (move, source) {
			if (source.hasType('Ghost')) {
				move.accuracy = true;
			}
		},
	},
	
	// Dark Void
	// Hypnosis
	//		60% Accuracy
	"darkvoid": {
		inherit: true,
		accuracy: 60,
	},
	"hypnosis": {
		inherit: true,
		accuracy: 60,
	},
	
	// Sing
	//		70% Accuracy
	"sing": {
		inherit: true,
		accuracy: 70,
	},
	
	// Lovely Kiss
	//		80% Accuracy
	"lovelykiss": {
		inherit: true,
		accuracy: 80,
	},
	
	// Grass Whistle
	// Spore
	//		90% Accuracy
	
	"grasswhistle": {
		inherit: true,
		accuracy: 90,
	},
	"spore": {
		inherit: true,
		accuracy: 90,
	},
	
	// Poison Powder
	// Sleep Powder
	// Stun Spore
	//		70% Accuracy, 10 PP, +1 Priority, fails if the user isn't a Grass- or Bug-type Pokemon
	//		Poison Powder is now a Grass-type Move
	//		Indirect buff to Overcoat and Safety Goggles
	"poisonpowder": {
		inherit: true,
		desc: "Poisons the target. Usually goes first. Fails if the user isn't a Grass- or Bug-type Pokemon.",
		shortDesc: "Poisons the target. Fails if user isn't Grass or Bug.",
		accuracy: 70,
		pp: 10,
		type: "Grass",
		priority: 1,
		onTryHit: function (target, source) {
			if (!source.hasType('Grass') && !source.hasType('Bug')) return false;
		},
		isViable: true,
	},
	"sleeppowder": {
		inherit: true,
		desc: "Causes the target to fall asleep. Usually goes first. Fails if the user isn't a Grass- or Bug-type Pokemon.",
		shortDesc: "Puts the target to sleep. Fails if user isn't Grass or Bug.",
		accuracy: 70,
		pp: 10,
		priority: 1,
		onTryHit: function (target, source) {
			if (!source.hasType('Grass') && !source.hasType('Bug')) return false;
		},
		isViable: true,
	},
	"stunspore": {
		inherit: true,
		desc: "Paralyzes the target. Usually goes first. Fails if the user isn't a Grass- or Bug-type Pokemon.",
		shortDesc: "Paralyzes the target. Fails if user isn't Grass or Bug.",
		accuracy: 70,
		pp: 10,
		priority: 1,
		onTryHit: function (target, source) {
			if (!source.hasType('Grass') && !source.hasType('Bug')) return false;
		},
		isViable: true,
	},
	
	// Supersonic
	//		70% Accuracy
	"supersonic": {
		inherit: true,
		accuracy: 70,
	},
	
	// Sweet Kiss
	//		80% Accuracy
	"sweetkiss": {
		inherit: true,
		accuracy: 80,
	},
	
	// Confuse Ray
	//		90% Accuracy
	"confuseray": {
		inherit: true,
		accuracy: 90,
	},
	
	// Flatter
	// Swagger
	//		100% Accuracy
	"flatter": {
		inherit: true,
		accuracy: 100,
	},
	"swagger": {
		inherit: true,
		accuracy: 100,
	},
	
	// Medium-sized Changes
	//		Quite a few of them
	
	// Charge Beam
	//		40 Base Power, 100% Accuracy, 100% Chance to increase the user's Special Attack by 1 Stage (Basically a Special Power-up Punch)
	"chargebeam": {
		inherit: true,
		accuracy: 100,
		basePower: 40,
		desc: "Has a 100% chance to raise the user's Special Attack by 1 stage.",
		shortDesc: "100% chance to raise the user's Sp. Atk by 1.",
		secondary: {
			chance: 100,
			self: {
				boosts: {
					spa: 1,
				},
			},
		},
		zMovePower: 100,
	},
	// Power-Up Punch
	//		10 PP
	"poweruppunch": {
		inherit: true,
		pp: 10,
	},
	
	// Water Sport
	// Mud Sport
	//		+2 Priority
	"watersport": {
		inherit: true,
		isViable: true,
		priority: 2,
	},
	"mudsport": {
		inherit: true,
		isViable: true,
		priority: 2,
	},
	
	// Dizzy Punch
	//		50% Chance to cause Confusion
	"dizzypunch": {
		inherit: true,
		basePower: 80,
		secondary: {
			chance: 50,
			volatileStatus: 'confusion',
		},
		zMovePower: 160,
	},
	
	// Relic Song
	//		80 Base Power, 30% Sleep Chance
	"relicsong": {
		inherit: true,
		basePower: 80,
		secondary: {
			chance: 30,
			status: 'slp',
		},
		zMovePower: 160,
	},
	
	// Cut
	//		60 Base Power, 50% Chance to decrease the target's Defense by 1 Stage
	"cut": {
		inherit: true,
		basePower: 60,
		accuracy: 100,
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
		zMovePower: 120,
	},
	
	// Rock Smash
	//		60 Base Power
	"rocksmash": {
		inherit: true,
		basePower: 60,
		zMovePower: 120,
	},
	
	// Strength
	//		30% Chance to increase the user's Attack by 1 Stage
	"strength": {
		inherit: true,
		secondary: {
			chance: 30,
			self: {
				boosts: {
					atk: 1,
				},
			},
		},
	},
	
	// Smaller Changes
	//		A lot of them
	
	// Snore
	//		90 Base Power
	"snore": {
		inherit: true,
		basePower: 90,
		zMovePower: 175,
	},
	
	// Blizzard
	//		30% Freeze Chance
	"blizzard": {
		inherit: true,
		secondary: {
			chance: 30,
			status: 'frz',
		},
	},
	
	// Minimize
	//		Increases Evasion by only 1 Stage
	"minimize": {
		inherit: true,
		boosts: {
			evasion: 1,
		},
	},
	
	// Aeroblast
	// Air Cutter
	// Air Slash
	// Crush Claw
	// Diamond Storm
	// Drill Run
	// Flying Press
	// Metal Claw
	// Razor Leaf
	// Razor Shell
	// Rock Slide
	// Rock Tomb
	// Sacred Fire
	// Snarl
	// Spacial Rend
	// String Shot
	// V-Create
	//		100% Accuracy
	"aeroblast": {
		inherit: true,
		accuracy: 100,
	},
	"aircutter": {
		inherit: true,
		accuracy: 100,
	},
	"airslash": {
		inherit: true,
		accuracy: 100,
	},
	"crushclaw": {
		inherit: true,
		accuracy: 100,
	},
	"diamondstorm": {
		inherit: true,
		accuracy: 100,
	},
	"drillrun": {
		inherit: true,
		accuracy: 100,
	},
	"flyingpress": {
		inherit: true,
		accuracy: 100,
	},
	"metalclaw": {
		inherit: true,
		accuracy: 100,
	},
	"razorleaf": {
		inherit: true,
		accuracy: 100,
	},
	"razorshell": {
		inherit: true,
		accuracy: 100,
	},
	"rockslide": {
		inherit: true,
		accuracy: 100,
	},
	"rocktomb": {
		inherit: true,
		accuracy: 100,
	},
	"sacredfire": {
		inherit: true,
		accuracy: 100,
	},
	"snarl": {
		inherit: true,
		accuracy: 100,
	},
	"spacialrend": {
		inherit: true,
		accuracy: 100,
	},
	"stringshot": {
		inherit: true,
		accuracy: 100,
	},
	"vcreate": {
		inherit: true,
		accuracy: 100,
	},
	
	// Bind
	// Blue Flare
	// Bolt Strike
	// Bone Club
	// Clamp
	// Fire Spin
	// Fury Cutter
	// Jump Kick
	// Megahorn
	// Mega Punch
	// Metal Sound
	// Meteor Mash
	// Mirror Shot
	// Mud Bomb
	// Origin Pulse
	// Power Whip
	// Precipice Blades
	// Rock Climb
	// Rolling Kick
	// Sand Tomb
	// Screech
	// Seed Flare
	// Takedown
	// Whirlpool
	//		90% Accuracy
	"bind": {
		inherit: true,
		accuracy: 90,
	},
	"blueflare": {
		inherit: true,
		accuracy: 90,
	},
	"boltstrike": {
		inherit: true,
		accuracy: 90,
	},
	"boneclub": {
		inherit: true,
		accuracy: 90,
	},
	"clamp": {
		inherit: true,
		accuracy: 90,
	},
	"firespin": {
		inherit: true,
		accuracy: 90,
	},
	"furycutter": {
		inherit: true,
		accuracy: 90,
	},
	"jumpkick": {
		inherit: true,
		accuracy: 90,
	},
	"megahorn": {
		inherit: true,
		accuracy: 90,
	},
	"megapunch": {
		inherit: true,
		accuracy: 90,
	},
	"metalsound": {
		inherit: true,
		accuracy: 90,
	},
	"meteormash": {
		inherit: true,
		accuracy: 90,
	},
	"mirrorshot": {
		inherit: true,
		accuracy: 90,
	},
	"mudbomb": {
		inherit: true,
		accuracy: 90,
	},
	"originpulse": {
		inherit: true,
		accuracy: 90,
	},
	"powerwhip": {
		inherit: true,
		accuracy: 90,
	},
	"precipiceblades": {
		inherit: true,
		accuracy: 90,
	},
	"rockclimb": {
		inherit: true,
		accuracy: 90,
	},
	"rollingkick": {
		inherit: true,
		accuracy: 90,
	},
	"sandtomb": {
		inherit: true,
		accuracy: 90,
	},
	"screech": {
		inherit: true,
		accuracy: 90,
	},
	"seedflare": {
		inherit: true,
		accuracy: 90,
	},
	"takedown": {
		inherit: true,
		accuracy: 90,
	},
	"whirlpool": {
		inherit: true,
		accuracy: 90,
	},
	
	// Dragon Rush
	// Fire Blast
	// High Jump Kick
	// Iron Tail
	// Magma Storm
	// Mega Kick
	// Slam
	//		80% Accuracy
	"dragonrush": {
		inherit: true,
		accuracy: 80,
	},
	"fireblast": {
		inherit: true,
		accuracy: 80,
	},
	"highjumpkick": {
		inherit: true,
		accuracy: 80,
	},
	"irontail": {
		inherit: true,
		accuracy: 80,
	},
	"magmastorm": {
		inherit: true,
		accuracy: 80,
	},
	"megakick": {
		inherit: true,
		accuracy: 80,
	},
	"slam": {
		inherit: true,
		accuracy: 80,
	},
};
