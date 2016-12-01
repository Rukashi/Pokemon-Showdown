'use strict';

exports.BattleMovedex = {
	// Stealth Rock
	//		25% Max HP Damage to Flying-types, 12.5% Otherwise
	stealthrock: {
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
	rapidspin: {
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
		desc: "For 5 turns, the user and its party members cannot be struck by a critical hit. Fails if this move is already in effect for the user's side. Lasts for 8 turns if the user is holding Light Clay.",
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
			onCriticalHit: false,
			onResidualOrder: 21,
			onResidualSubOrder: 5,
			onEnd: function (side) {
				this.add('-sideend', side, 'move: Lucky Chant'); // "[side.name]'s team's Lucky Chant wore off!"
			},
		},
	},
	
	// Substitute
	//		Substitute is hit before Protect, Detect, King's Shield, Spiky Shield, Baneful Bunker, Quick Guard, Wide Guard
	//		Attacks against a Substitute always Hit
	substitute: {
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
	protect: {
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
	detect: {
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
	kingsshield: {
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
	spikyshield: {
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
	banefulbunker: {
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
	quickguard: {
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
	wideguard: {
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
	
	// Crafty Shield
	//		Substitute is hit before Crafty Shield
	//		Infiltrator ignores Crafty Shield
	craftyshield: {
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
	
	// Solar Beam
	// Solar Blade
	//		160 Base Power
	solarbeam: {
		inherit: true,
		isViable: true,
		basePower: 160,
	},
	solarblade: {
		inherit: true,
		isViable: true,
		basePower: 160,
	},
	
	// Sky Attack
	//		160 Base Power, 100% Accuracy, 10 PP, No Secondary Effect
	skyattack: {
		inherit: true,
		isViable: true,
		basePower: 160,
		accuracy: 100,
		pp: 10,
		secondary: null,
	},
	
	// Skull Bash
	//		160 Base Power
	skullbash: {
		inherit: true,
		isViable: true,
		basePower: 160,
	},
	
	// Freeze Shock
	// Ice Burn
	//		160 Base Power, 100% Accuracy
	freezeshock: {
		inherit: true,
		isViable: true,
		basePower: 160,
		accuracy: 100,
	},
	iceburn: {
		inherit: true,
		isViable: true,
		basePower: 160,
		accuracy: 100,
	},
	
	// Razor Wind
	//		Flying-type, 100 Base Power, No High Crit rate
	razorwind: {
		inherit: true,
		isViable: true,
		basePower: 100,
		critRatio: 1,
		type: "Flying",
	},
	
	// Bounce
	//		120 Base Power, 100% Accuracy
	bounce: {
		inherit: true,
		isViable: true,
		basePower: 120,
		accuracy: 100,
	},
	
	// Fly
	// Dig
	// Dive
	//		120 Base Power, 100% Accuracy
	fly: {
		inherit: true,
		isViable: true,
		basePower: 120,
		accuracy: 100,
	},
	dig: {
		inherit: true,
		isViable: true,
		basePower: 120,
		accuracy: 100,
	},
	dive: {
		inherit: true,
		isViable: true,
		basePower: 120,
		accuracy: 100,
	},
	
	// Shadow Force
	//		100 Base Power
	shadowforce: {
		inherit: true,
		isViable: true,
		basePower: 100,
		accuracy: 100,
	},
	
	// Sky Drop
	//		80 Base Power
	skydrop: {
		inherit: true,
		basePower: 80,
	},
	
	// Hyper Beam
	// Giga Impact
	// Blast Burn
	// Frenzy Plant
	// Hydro Cannon
	// Rock Wrecker
	// Roar of Time
	//		160 Base Power, 100% Accuracy
	hyperbeam: {
		inherit: true,
		basePower: 160,
		accuracy: 100,
	},
	gigaimpact: {
		inherit: true,
		basePower: 160,
		accuracy: 100,
	},
	blastburn: {
		inherit: true,
		basePower: 160,
		accuracy: 100,
	},
	frenzyplant: {
		inherit: true,
		basePower: 160,
		accuracy: 100,
	},
	hydrocannon: {
		inherit: true,
		basePower: 160,
		accuracy: 100,
	},
	rockwrecker: {
		inherit: true,
		basePower: 160,
		accuracy: 100,
	},
	roaroftime: {
		inherit: true,
		basePower: 160,
		accuracy: 100,
	},
	
	// Roar
	// Whirlwind
	//		Perfect Accuracy
	roar: {
		inherit: true,
		accuracy: true,
	},
	whirlwind: {
		inherit: true,
		accuracy: true,
	},
	
	// Double Hit
	// Double Kick
	// Double Slap
	// Dual Chop
	// Gear Grind
	// Wing Attack
	//		Hits 2 Times, 40 Base Power, 100% Accuracy, 15 PP
	doublehit: {
		inherit: true,
		basePower: 40,
		accuracy: 100,
		pp: 15,
	},
	doublekick: {
		inherit: true,
		basePower: 40,
		accuracy: 100,
		pp: 15,
	},
	doubleslap: {
		inherit: true,
		basePower: 40,
		accuracy: 100,
		pp: 15,
	},
	dualchop: {
		inherit: true,
		basePower: 40,
		accuracy: 100,
		pp: 15,
	},
	geargrind: {
		inherit: true,
		basePower: 40,
		accuracy: 100,
		pp: 15,
	},
	wingattack: {
		inherit: true,
		basePower: 40,
		accuracy: 100,
		pp: 15,
		multihit: [2, 2],
	},
	
	// Twineedle
	//		Hits 2 Times, 30 Base Power, 100% Accuracy, 10 PP, 30% Poison Chance per Hit
	twineedle: {
		inherit: true,
		basePower: 30,
		accuracy: 100,
		pp: 10,
		secondary: {
			chance: 30,
			status: 'psn',
		},
	},
	
	// Arm Thrust
	// Barrage
	// Bullet Seed
	// Comet Punch
	// Icicle Spear
	// Pin Missile
	// Rock Blast
	// Spike Cannon
	// Tail Slap
	// Water Shuriken
	// Fury Attack
	// Fury Swipes
	//		Hits 2 to 5 Times, 25 Base Power, 100% Accuracy, 10 PP
	armthrust: {
		inherit: true,
		basePower: 25,
		accuracy: 100,
		pp: 10,
	},
	barrage: {
		inherit: true,
		basePower: 25,
		accuracy: 100,
		pp: 10,
	},
	bulletseed: {
		inherit: true,
		basePower: 25,
		accuracy: 100,
		pp: 10,
	},
	cometpunch: {
		inherit: true,
		basePower: 25,
		accuracy: 100,
		pp: 10,
	},
	furyattack: {
		inherit: true,
		basePower: 25,
		accuracy: 100,
		pp: 10,
	},
	furyswipes: {
		inherit: true,
		basePower: 25,
		accuracy: 100,
		pp: 10,
	},
	iciclespear: {
		inherit: true,
		basePower: 25,
		accuracy: 100,
		pp: 10,
	},
	pinmissile: {
		inherit: true,
		basePower: 25,
		accuracy: 100,
		pp: 10,
	},
	rockblast: {
		inherit: true,
		basePower: 25,
		accuracy: 100,
		pp: 10,
	},
	spikecannon: {
		inherit: true,
		basePower: 25,
		accuracy: 100,
		pp: 10,
	},
	tailslap: {
		inherit: true,
		basePower: 25,
		accuracy: 100,
		pp: 10,
	},
	watershuriken: {
		inherit: true,
		basePower: 25,
		accuracy: 100,
		pp: 10,
	},
	
	// Triple Kick
	//		15 Base Power
	"triplekick": {
		inherit: true,
		basePower: 15,
		basePowerCallback: function (pokemon) {
			pokemon.addVolatile('triplekick');
			return 15 * pokemon.volatiles['triplekick'].hit;
		},
		desc: "Hits three times. Power increases to 30 for the second hit and 45 for the third. This move checks accuracy for each hit, and the attack ends if the target avoids any of the hits. If one of the hits breaks the target's substitute, it will take damage for the remaining hits. If the user has the Ability Skill Link, this move will always hit three times.",
	},
	
	// Beat Up
	//		Base Power Increased, 5 PP
	beatup: {
		inherit: true,
		basePowerCallback: function (pokemon, target) {
			pokemon.addVolatile('beatup');
			if (!pokemon.side.pokemon[pokemon.volatiles.beatup.index]) return null;
			return 5 + Math.floor(pokemon.side.pokemon[pokemon.volatiles.beatup.index].template.baseStats.atk / 5);
		},
		pp: 5,
	},
	
	// Charge Beam
	//		40 Base Power, 100% Accuracy, 100% Chance to increase the user's Special Attack by 1 Stage
	chargebeam: {
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
	},
	// Power-Up Punch
	//		10 PP
	poweruppunch: {
		inherit: true,
		pp: 10,
	},
	
	// Jump Kick
	//		90% Accuracy
	jumpkick: {
		inherit: true,
		accuracy: 90,
	},
	
	// High Jump Kick
	//		80% Accuracy
	highjumpkick: {
		inherit: true,
		accuracy: 80,
	},
	
	// Close Combat
	// Focus Blast
	//		100 Base Power
	closecombat: {
		inherit: true,
		basePower: 100,
	},
	focusblast: {
		inherit: true,
		basePower: 100,
	},
	
	// Parabolic Charge
	//		75 Base Power
	paraboliccharge: {
		inherit: true,
		basePower: 75,
	},
	
	// Draining Kiss
	//		75 Base Power, Drains 50% of Damage Dealt
	drainingkiss: {
		inherit: true,
		basePower: 75,
		drain: [1, 2],
	},
	
	// Astonish
	//		Now a Ghost-type Fake Out
	astonish: {
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
	},
	
	// Dizzy Punch
	//		50% Chance to cause Confusion
	dizzypunch: {
		inherit: true,
		basePower: 80,
		secondary: {
			chance: 50,
			volatileStatus: 'confusion',
		},
	},
	
	// Relic Song
	//		80 Base Power, 30% Sleep Chance
	relicsong: {
		inherit: true,
		basePower: 80,
		secondary: {
			chance: 30,
			status: 'slp',
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
	},
	
	// Covet
	// Thief
	//		70 Base Power, 10 PP
	//		deals 50% increased damage if foe has an item and user doesn't, then steals it if possible
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
	},
	
	// Snore
	//		90 Base Power
	snore: {
		inherit: true,
		basePower: 90,
	},
	
	// Aerial Ace
	// Feint Attack
	// Shadow Punch
	// Magnet Bomb
	// Magical Leaf
	// Shock Wave
	// Swift
	// Disarming Voice
	// Aura Sphere
	//		80 Base Power
	aerialace: {
		inherit: true,
		isViable: true,
		basePower: 80,
	},
	feintattack: {
		inherit: true,
		isViable: true,
		basePower: 80,
	},
	shadowpunch: {
		inherit: true,
		isViable: true,
		basePower: 80,
	},
	magnetbomb: {
		inherit: true,
		isViable: true,
		basePower: 80,
	},
	magicalleaf: {
		inherit: true,
		isViable: true,
		basePower: 80,
	},
	shockwave: {
		inherit: true,
		isViable: true,
		basePower: 80,
	},
	swift: {
		inherit: true,
		isViable: true,
		basePower: 80,
	},
	disarmingvoice: {
		inherit: true,
		isViable: true,
		basePower: 80,
	},
	aurasphere: {
		inherit: true,
		isViable: true,
		basePower: 80,
	},
	
	// Clear Smog
	//		65 Base Power
	clearsmog: {
		inherit: true,
		isViable: true,
		basePower: 65,
	},
	
	// Water Sport
	// Mud Sport
	//		+1 Priority
	watersport: {
		inherit: true,
		isViable: true,
		priority: 1,
	},
	mudsport: {
		inherit: true,
		isViable: true,
		priority: 1,
	},
	
	// Blizzard
	//		30% Freeze Chance
	blizzard: {
		inherit: true,
		secondary: {
			chance: 30,
			status: 'frz',
		},
	},
	
	// Minimize
	//		Increases Evasion by only 1 Stage
	minimize: {
		inherit: true,
		boosts: {
			evasion: 1,
		},
	},
	
	// Cut
	//		60 Base Power, 50% Chance to decrease the target's Defense by 1 Stage
	cut: {
		inherit: true,
		basePower: 60,
		accuracy: 100,
		secondary: {
			chance: 50,
			boosts: {
				def: -1,
			},
		},
	},
	
	// Rock Smash
	//		60 Base Power
	rocksmash: {
		inherit: true,
		basePower: 60,
	},
	
	// Strength
	//		30% Chance to increase the user's Attack by 1 Stage
	strength: {
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
	
	// Grass Whistle
	// Sing
	//		70% Accuracy
	grasswhistle: {
		inherit: true,
		accuracy: 70,
	},
	sing: {
		inherit: true,
		accuracy: 70,
	},
	
	// Supersonic
	// Confuse Ray
	//		90% Accuracy
	supersonic: {
		inherit: true,
		accuracy: 90,
	},
	confuseray: {
		inherit: true,
		accuracy: 90,
	},
	
	// Many Moves
	//		Accuracy Rounded up to multiples of 10%
	boneclub: {
		inherit: true,
		accuracy: 90,
	},
	razorshell: {
		inherit: true,
		accuracy: 100,
	},
	drillrun: {
		inherit: true,
		accuracy: 100,
	},
	vcreate: {
		inherit: true,
		accuracy: 100,
	},
	aeroblast: {
		inherit: true,
		accuracy: 100,
	},
	sacredfire: {
		inherit: true,
		accuracy: 100,
	},
	spacialrend: {
		inherit: true,
		accuracy: 100,
	},
	originpulse: {
		inherit: true,
		accuracy: 90,
	},
	precipiceblades: {
		inherit: true,
		accuracy: 90,
	},
	airslash: {
		inherit: true,
		accuracy: 100,
	},
	rockslide: {
		inherit: true,
		accuracy: 100,
	},
	aircutter: {
		inherit: true,
		accuracy: 100,
	},
	furycutter: {
		inherit: true,
		accuracy: 100,
	},
	flyingpress: {
		inherit: true,
		accuracy: 100,
	},
	crushclaw: {
		inherit: true,
		accuracy: 100,
	},
	razorleaf: {
		inherit: true,
		accuracy: 100,
	},
	stringshot: {
		inherit: true,
		accuracy: 100,
	},
	metalclaw: {
		inherit: true,
		accuracy: 100,
	},
	diamondstorm: {
		inherit: true,
		accuracy: 100,
	},
	snarl: {
		inherit: true,
		accuracy: 100,
	},
	powerwhip: {
		inherit: true,
		accuracy: 90,
	},
	seedflare: {
		inherit: true,
		accuracy: 90,
	},
	willowisp: {
		inherit: true,
		accuracy: 90,
	},
	meteormash: {
		inherit: true,
		accuracy: 90,
	},
	boltstrike: {
		inherit: true,
		accuracy: 90,
	},
	blueflare: {
		inherit: true,
		accuracy: 90,
	},
	dragonrush: {
		inherit: true,
		accuracy: 80,
	},
	rocktomb: {
		inherit: true,
		accuracy: 100,
	},
	fireblast: {
		inherit: true,
		accuracy: 80,
	},
	irontail: {
		inherit: true,
		accuracy: 80,
	},
	magmastorm: {
		inherit: true,
		accuracy: 80,
	},
	megahorn: {
		inherit: true,
		accuracy: 90,
	},
	megapunch: {
		inherit: true,
		accuracy: 90,
	},
	megakick: {
		inherit: true,
		accuracy: 80,
	},
	slam: {
		inherit: true,
		accuracy: 80,
	},
	rollingkick: {
		inherit: true,
		accuracy: 90,
	},
	takedown: {
		inherit: true,
		accuracy: 90,
	},
	mudbomb: {
		inherit: true,
		accuracy: 90,
	},
	mirrorshot: {
		inherit: true,
		accuracy: 90,
	},
	rockclimb: {
		inherit: true,
		accuracy: 90,
	},
	poisonpowder: {
		inherit: true,
		accuracy: 80,
	},
	stunspore: {
		inherit: true,
		accuracy: 80,
	},
	sleeppowder: {
		inherit: true,
		accuracy: 80,
	},
	sweetkiss: {
		inherit: true,
		accuracy: 80,
	},
	lovelykiss: {
		inherit: true,
		accuracy: 80,
	},
	whirlpool: {
		inherit: true,
		accuracy: 90,
	},
	firespin: {
		inherit: true,
		accuracy: 90,
	},
	clamp: {
		inherit: true,
		accuracy: 90,
	},
	sandtomb: {
		inherit: true,
		accuracy: 90,
	},
	bind: {
		inherit: true,
		accuracy: 90,
	},
	screech: {
		inherit: true,
		accuracy: 90,
	},
	metalsound: {
		inherit: true,
		accuracy: 90,
	},
};
