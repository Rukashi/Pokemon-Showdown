'use strict';

exports.BattleScripts = {
	inherit: 'gen7',
	gen: 7,
	
	tryMoveHit: function (target, pokemon, move, spreadHit) {
		if (move.selfdestruct && spreadHit) pokemon.hp = 0;

		this.setActiveMove(move, pokemon, target);
		let hitResult = true;

		hitResult = this.singleEvent('PrepareHit', move, {}, target, pokemon, move);
		if (!hitResult) {
			if (hitResult === false) this.add('-fail', target);
			return false;
		}
		this.runEvent('PrepareHit', pokemon, target, move);

		if (!this.singleEvent('Try', move, null, pokemon, target, move)) {
			return false;
		}

		if (move.target === 'all' || move.target === 'foeSide' || move.target === 'allySide' || move.target === 'allyTeam') {
			if (move.target === 'all') {
				hitResult = this.runEvent('TryHitField', target, pokemon, move);
			} else {
				hitResult = this.runEvent('TryHitSide', target, pokemon, move);
			}
			if (!hitResult) {
				if (hitResult === false) this.add('-fail', target);
				return true;
			}
			return this.moveHit(target, pokemon, move);
		}

		if (move.ignoreImmunity === undefined) {
			move.ignoreImmunity = (move.category === 'Status');
		}

		if (move.ignoreImmunity !== true && !move.ignoreImmunity[move.type] && !target.runImmunity(move.type, true)) {
			return false;
		}

		hitResult = this.runEvent('TryHit', target, pokemon, move);
		if (!hitResult) {
			if (hitResult === false) this.add('-fail', target);
			return false;
		}

		if (move.flags['powder'] && target !== pokemon && !this.getImmunity('powder', target)) {
			this.debug('natural powder immunity');
			this.add('-immune', target, '[msg]');
			return false;
		}
		if (this.gen >= 7 && move.pranksterBoosted && target.side !== pokemon.side && !this.getImmunity('prankster', target)) {
			this.debug('natural prankster immunity');
			this.add('-immune', target, '[msg]');
			return false;
		}

		let boostTable = [1, 4 / 3, 5 / 3, 2, 7 / 3, 8 / 3, 3];
		
		let hits = 1;
		if (move.multihit) {
			hits = move.multihit;
			if (hits.length) {
				// yes, it's hardcoded... meh
				if (hits[0] === 2 && hits[1] === 5) {
					if (this.gen >= 5) {
						hits = [2, 2, 3, 3, 4, 5][this.random(6)];
					} else {
						hits = [2, 2, 2, 3, 3, 3, 4, 5][this.random(8)];
					}
				} else {
					hits = this.random(hits[0], hits[1] + 1);
				}
			}
			hits = Math.floor(hits);
		}
		// calculate true accuracy
		let accuracy = move.accuracy;
		let boosts, boost;
		
		move.totalDamage = 0;
		let moveDamage;
		let damage = 0;
		pokemon.lastDamage = 0;
		let nullDamage = true;
		
		let hitCount = 0;
		let i;
		for (i = 0; i < hits && target.hp && pokemon.hp; i++) {
			if (pokemon.status === 'slp' && !(move.sleepUsable || this.getMove(move.sourceEffect).sleepUsable)) break;

			if (move.multiaccuracy || i === 0) {
				accuracy = move.accuracy;
				if (accuracy !== true) {
					if (!move.ignoreAccuracy) {
						boosts = this.runEvent('ModifyBoost', pokemon, null, null, Object.assign({}, pokemon.boosts));
						boost = this.clampIntRange(boosts['accuracy'], -6, 6);
						if (boost > 0) {
							accuracy *= boostTable[boost];
						} else {
							accuracy /= boostTable[-boost];
						}
					}
					if (!move.ignoreEvasion) {
						boosts = this.runEvent('ModifyBoost', target, null, null, Object.assign({}, target.boosts));
						boost = this.clampIntRange(boosts['evasion'], -6, 6);
						if (boost > 0) {
							accuracy /= boostTable[boost];
						} else if (boost < 0) {
							accuracy *= boostTable[-boost];
						}
					}
				}
				
				if (move.ohko) { // bypasses accuracy modifiers
					if (!target.isSemiInvulnerable()) {
						accuracy = 30;
						if (pokemon.level >= target.level && (move.ohko === true || !target.hasType(move.ohko))) {
							// TODO: Research dependency of accuracy on user typing
							accuracy += (pokemon.level - target.level);
						} else {
							this.add('-immune', target, '[ohko]');
							return false;
						}
					}
				} else {
					accuracy = this.runEvent('ModifyAccuracy', target, pokemon, move, accuracy);
				}
				
				if (move.alwaysHit) {
					accuracy = true; // bypasses ohko accuracy modifiers
				} else {
					accuracy = this.runEvent('Accuracy', target, pokemon, move, accuracy);
				}
				
				if (accuracy !== true && this.random(100) >= accuracy) {
					if (move.tryAllHits) { // tryAllHits makes multihit moves with multiaccuracy attempt all hits, even if some fail
						continue;
					}
					break;
				}
			}
			
			if (move.breaksProtect) {
				let broke = false;
				for (let i in {banefulbunker:1, kingsshield:1, protect:1, spikyshield:1}) {
					if (target.removeVolatile(i)) broke = true;
				}
				if (this.gen >= 6 || target.side !== pokemon.side) {
					for (let i in {craftyshield:1, matblock:1, quickguard:1, wideguard:1}) {
						if (target.side.removeSideCondition(i)) broke = true;
					}
				}
				if (broke) {
					if (move.id === 'feint') {
						this.add('-activate', target, 'move: Feint');
					} else {
						this.add('-activate', target, 'move: ' + move.name, '[broken]');
					}
				}
			}

			if (move.stealsBoosts) {
				let boosts = {};
				for (let statName in target.boosts) {
					let stage = target.boosts[statName];
					if (stage > 0) boosts[statName] = stage;
				}
				this.boost(boosts, pokemon);

				for (let statName in boosts) {
					boosts[statName] = 0;
				}
				target.setBoost(boosts);
				this.add('-clearpositiveboost', target, pokemon, 'move: ' + move.name);
			}
			
			moveDamage = this.moveHit(target, pokemon, move);
			if (moveDamage === false) {
				if (move.tryAllHits) {
					continue;
				}
				break;
			}
			
			if (nullDamage && (moveDamage || moveDamage === 0 || moveDamage === undefined)) nullDamage = false;
			// Damage from each hit is individually counted for the
			// purposes of Counter, Metal Burst, and Mirror Coat.
			damage = (moveDamage || 0);
			// Total damage dealt is accumulated for the purposes of recoil (Parental Bond).
			move.totalDamage += damage;
			hitCount++;
			this.eachEvent('Update');
		}
		if (accuracy !== true && hitCount === 0) {
			if (!move.spreadHit) this.attrLastMove('[miss]');
			this.add('-miss', pokemon, target);
			return false;
		}
		
		if (nullDamage) damage = false;
		if (move.multihit) {
			this.add('-hitcount', target, hitCount);
		}

		if (move.recoil && move.totalDamage) {
			this.damage(this.calcRecoilDamage(move.totalDamage, move), pokemon, target, 'recoil');
		}

		if (move.struggleRecoil) {
			this.directDamage(this.clampIntRange(Math.round(pokemon.maxhp / 4), 1), pokemon, pokemon, {id: 'strugglerecoil'});
		}

		if (target && pokemon !== target) target.gotAttacked(move, damage, pokemon);

		if (move.ohko) this.add('-ohko');

		if (!damage && damage !== 0) return damage;

		if (target && !move.negateSecondary && !(pokemon.hasAbility('sheerforce') && pokemon.volatiles['sheerforce'])) {
			this.singleEvent('AfterMoveSecondary', move, null, target, pokemon, move);
			this.runEvent('AfterMoveSecondary', target, pokemon, move);
		}

		return damage;
	},
};