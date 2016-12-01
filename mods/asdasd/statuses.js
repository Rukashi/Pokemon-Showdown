'use strict';

exports.BattleStatuses = {
	
	// Freeze
	//		Always lasts 2 turns
	frz: {
		effectType: 'Status',
		onStart: function (target) {
			this.add('-status', target, 'frz');
		},
		duration: 2,
		onBeforeMovePriority: 2,
		onBeforeMove: function (pokemon, target, move) {
			if (move.flags['defrost']) {
				pokemon.cureStatus();
				return;
			}
			this.add('cant', pokemon, 'frz');
			return false;
		},
		onHit: function (target, source, move) {
			if (move.type === 'Fire' && move.category !== 'Status' || move.flags['defrost']) {
				target.cureStatus();
			}
		},
		onEnd: function (target) {
			this.battle.add('-curestatus', target, 'frz');
		},
	},
	
	// Gems
	//		Increase damage by 50%
	gem: {
		inherit: true,
		onBasePower: function (basePower, user, target, move) {
			this.debug('Gem Boost');
			return this.chainModify(1.5);
		},
	},
	
	// Hail
	//		Increases Defense of Ice-type Pokemon by 50%
	hail: {
		inherit: true,
		// This should be applied directly to the stat before any of the other modifiers are chained
		// So we give it increased priority.
		onModifyDefPriority: 10,
		onModifyDef: function (def, pokemon) {
			if (pokemon.hasType('Ice') && this.isWeather('hail')) {
				return this.modify(def, 1.5);
			}
		},
	},
};
