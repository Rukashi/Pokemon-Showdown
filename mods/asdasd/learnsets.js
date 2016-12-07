'use strict';

		// Technical Machines
		
		// Moves that, with a few exceptions, every Pokemon can learn, if they can learn TMs at all:
		// Toxic, Hidden Power, Protect, Frustration, Return, Double Team, Facade,
		// Rest, Attract, Round, Swagger, SleepTalk, Substitute, and Confide
		
		/*
		// TM Moves
		//workup: ["7M"],
		//dragonclaw: ["7M"],
		//psyshock: ["7M"],
		//calmmind: ["7M"],
		//roar: ["7M"],
		toxic: ["7M"],
		//hail: ["7M"],
		//bulkup: ["7M"],
		//venoshock: ["7M"],
		hiddenpower: ["7M"],
		//sunnyday: ["7M"],
		//taunt: ["7M"],
		//icebeam: ["7M"],
		//blizzard: ["7M"],
		//hyperbeam: ["7M"],
		//lightscreen: ["7M"],
		protect: ["7M"],
		//raindance: ["7M"],
		//roost: ["7M"],
		//safeguard: ["7M"],
		frustration: ["7M"],
		//solarbeam: ["7M"],
		//smackdown: ["7M"],
		//thunderbolt: ["7M"],
		//thunder: ["7M"],
		//earthquake: ["7M"],
		return: ["7M"],
		//leechlife: ["7M"],
		//psychic: ["7M"],
		//shadowball: ["7M"],
		//brickbreak: ["7M"],
		doubleteam: ["7M"],
		//reflect: ["7M"],
		//sludgewave: ["7M"],
		//flamethrower: ["7M"],
		//sludgebomb: ["7M"],
		//sandstorm: ["7M"],
		//fireblast: ["7M"],
		//rocktomb: ["7M"],
		//aerialace: ["7M"],
		//torment: ["7M"],
		facade: ["7M"],
		//flamecharge: ["7M"],
		rest: ["7M"],
		attract: ["7M"],
		//thief: ["7M"],
		//lowsweep: ["7M"],
		round: ["7M"],
		//echoedvoice: ["7M"],
		//overheat: ["7M"],
		//steelwing: ["7M"],
		//focusblast: ["7M"],
		//energyball: ["7M"],
		//falseswipe: ["7M"],
		//scald: ["7M"],
		//fling: ["7M"],
		//chargebeam: ["7M"],
		//skydrop: ["7M"],
		//brutalswing: ["7M"],
		//quash: ["7M"],
		//willowisp: ["7M"],
		//acrobatics: ["7M"],
		//embargo: ["7M"],
		//explosion: ["7M"],
		//shadowclaw: ["7M"],
		//payback: ["7M"],
		//smartstrike: ["7M"],
		//gigaimpact: ["7M"],
		//rockpolish: ["7M"],
		//auroraveil: ["7M"],
		//stoneedge: ["7M"],
		//voltswitch: ["7M"],
		//thunderwave: ["7M"],
		//gyroball: ["7M"],
		//swordsdance: ["7M"],
		//fly: ["7M"],
		//psychup: ["7M"],
		//bulldoze: ["7M"],
		//frostbreath: ["7M"],
		//rockslide: ["7M"],
		//xscissor: ["7M"],
		//dragontail: ["7M"],
		//infestation: ["7M"],
		//poisonjab: ["7M"],
		//dreameater: ["7M"],
		//grassknot: ["7M"],
		swagger: ["7M"],
		sleeptalk: ["7M"],
		//uturn: ["7M"],
		substitute: ["7M"],
		//flashcannon: ["7M"],
		//trickroom: ["7M"],
		//wildcharge: ["7M"],
		//surf: ["7M"],
		//snarl: ["7M"],
		//naturepower: ["7M"],
		//darkpulse: ["7M"],
		//waterfall: ["7M"],
		//dazzlinggleam: ["7M"],
		confide: ["7M"],
		*/

		// Tutor Moves
		
		//grasspledge: ["7T"], // Grass-type Starters and Evolutions only
		//firepledge: ["7T"], // Fire-type Starters and Evolutions only
		//waterpledge: ["7T"], // Water-type Starters and Evolutions only
		
		//frenzyplant: ["7T"], // Fully Evolved Grass-type Starters only
		//blastburn: ["7T"], // Fully Evolved Fire-type Starters only
		//hydrocannon: ["7T"], // Fully Evolved Water-type Starters only
		
		//dracometeor: ["7T"], // All Dragon-type Pokemon
		
		//relicsong: ["7T"], // Meloetta only
		//secretsword: ["7T"], // Keldeo only
		//dragonascent: ["7T"], // Rayquaza only
		
		// Gen 6 Tutor Moves
		
		//afteryou: ["7T"],
		//aquatail: ["7T"],
		//bind: ["7T"],
		//block: ["7T"],
		//bounce: ["7T"],
		//bugbite: ["7T"],
		//covet: ["7T"],
		//dragonpulse: ["7T"],
		//drainpunch: ["7T"],
		//drillrun: ["7T"],
		//dualchop: ["7T"],
		//earthpower: ["7T"],
		//electroweb: ["7T"],
		//endeavor: ["7T"],
		//firepunch: ["7T"],
		//focuspunch: ["7T"],
		//foulplay: ["7T"],
		//gastroacid: ["7T"],
		//gigadrain: ["7T"],
		//gravity: ["7T"],
		//gunkshot: ["7T"],
		//healbell: ["7T"],
		//heatwave: ["7T"],
		//helpinghand: ["7T"],
		//hypervoice: ["7T"],
		//icepunch: ["7T"],
		//icywind: ["7T"],
		//irondefense: ["7T"],
		//ironhead: ["7T"],
		//irontail: ["7T"],
		//knockoff: ["7T"],
		//lastresort: ["7T"],
		//lowkick: ["7T"],
		//magiccoat: ["7T"],
		//magicroom: ["7T"],
		//magnetrise: ["7T"],
		//outrage: ["7T"],
		//painsplit: ["7T"],
		//recycle: ["7T"],
		//roleplay: ["7T"],
		//seedbomb: ["7T"],
		//shockwave: ["7T"],
		//signalbeam: ["7T"],
		//skillswap: ["7T"],
		//skyattack: ["7T"],
		//snatch: ["7T"],
		//snore: ["7T"],
		//spite: ["7T"],
		//stealthrock: ["7T"],
		//superfang: ["7T"],
		//superpower: ["7T"],
		//synthesis: ["7T"],
		//tailwind: ["7T"],
		//thunderpunch: ["7T"],
		//trick: ["7T"],
		//uproar: ["7T"],
		//waterpulse: ["7T"],
		//wonderroom: ["7T"],
		//worryseed: ["7T"],
		//zenheadbutt: ["7T"],
		
		// Replaced gen 6 TMs
		
		//honeclaws: ["7T"],
		//dig: ["7T"],
		//incinerate: ["7T"],
		//retaliate: ["7T"],
		//flash: ["7T"],
		//strugglebug: ["7T"],
		//rocksmash: ["7T"],
		//secretpower: ["7T"],
		//poweruppunch: ["7T"],
		
		// HMs
		
		//cut: ["7T"],
		//strengh: ["7T"],
		//whirlpool: ["7T"],
		//defog: ["7T"],
		//rockclimb: ["7T"],
		
		// Pre-gen 7 Tutor Moves
		
		//aircutter: ["7T"],
		//ancientpower: ["7T"],
		//bodyslam: ["7T"],
		//counter: ["7T"],
		//defensecurl: ["7T"],
		//dive: ["7T"],
		//doubleedge: ["7T"],
		//dynamicpunch: ["7T"],
		//endure: ["7T"],
		//furycutter: ["7T"],
		//headbutt: ["7T"],
		//megakick: ["7T"],
		//megapunch: ["7T"],
		//metronome: ["7T"],
		//mimic: ["7T"],
		//mudslap: ["7T"],
		//nightmare: ["7T"],
		//ominouswind: ["7T"],
		//rollout: ["7T"],
		//seismictoss: ["7T"],
		//selfdestruct: ["7T"],
		//softboiled: ["7T"],
		//stringshot: ["7T"],
		//suckerpunch: ["7T"],
		//swift: ["7T"],
		//twister: ["7T"],
		//vacuumwave: ["7T"],
		
		// Added on ASDASD
		
		//firefang: ["7T"],
		//icefang: ["7T"],
		//thunderfang: ["7T"],

exports.BattleLearnsets = {
	ditto: {learnset: {
		// Ditto
		transform: ["7L1"],
	}},
	eevee: {learnset: {
		// Eevee
		// Removed Moves: Sing
		// Added Moves: Bide, Encore, Endeavor, Fire Fang, Foresight, Ice Fang, Recycle, Safeguard, Thunder Fang
		
		// Level-up Moves
		helpinghand: ["7L1"],
		growl: ["7L1"],
		tackle: ["7L1"],
		tailwhip: ["7L1"],
		sandattack: ["7L4"],
		quickattack: ["7L7"],
		babydolleyes: ["7L10"],
		bite: ["7L13"],
		refresh: ["7L16"],
		swift: ["7L19"],
		batonpass: ["7L22"],
		covet: ["7L25"],
		charm: ["7L28"],
		takedown: ["7L31"],
		foresight: ["7L34"],
		lastresort: ["7L37"],
		encore: ["7L40"],
		trumpcard: ["7L43"],
		
		// Egg Moves
		bide: ["7E"],
		captivate: ["7E"],
		charm: ["7E"],
		covet: ["7E"],
		curse: ["7E"],
		detect: ["7E"],
		endure: ["7E"],
		faketears: ["7E"],
		flail: ["7E"],
		naturalgift: ["7E"],
		storedpower: ["7E"],
		synchronoise: ["7E"],
		tickle: ["7E"],
		wish: ["7E"],
		yawn: ["7E"],
		
		// TM Moves
		workup: ["7M"],
		toxic: ["7M"],
		hiddenpower: ["7M"],
		sunnyday: ["7M"],
		protect: ["7M"],
		raindance: ["7M"],
		safeguard: ["7M"],
		frustration: ["7M"],
		return: ["7M"],
		shadowball: ["7M"],
		doubleteam: ["7M"],
		facade: ["7M"],
		rest: ["7M"],
		attract: ["7M"],
		round: ["7M"],
		swagger: ["7M"],
		sleeptalk: ["7M"],
		substitute: ["7M"],
		confide: ["7M"],
		
		// Tutor Moves
		covet: ["7T"],
		endeavor: ["7T"],
		healbell: ["7T"],
		helpinghand: ["7T"],
		hypervoice: ["7T"],
		irontail: ["7T"],
		lastresort: ["7T"],
		recycle: ["7T"],
		snore: ["7T"],
		
		dig: ["7T"],
		retaliate: ["7T"],
		secretpower: ["7T"],
		
		bodyslam: ["7T"],
		doubleedge: ["7T"],
		endure: ["7T"],
		headbutt: ["7T"],
		mimic: ["7T"],
		mudslap: ["7T"],
		swift: ["7T"],
		
		firefang: ["7T"],
		icefang: ["7T"],
		thunderfang: ["7T"],
		
		// Special
		celebrate: ["7S1"],
	}},
	vaporeon: {learnset: {
		// Vaporeon
		// Removed Moves: Sing
		// Added Moves: Aqua Jet, Bide, Clear Smog, Encore, Endeavor, Fire Fang, Foresight, Ice Fang, Mud Sport, Recycle, Safeguard, Thunder Fang
		
		// Level-up Moves
		watergun: ["7L0"],
		helpinghand: ["7L1"],
		tackle: ["7L1"],
		tailwhip: ["7L1"],
		sandattack: ["7L5"],
		aquajet: ["7L9"],
		babydolleyes: ["7L13"],
		clearsmog: ["7L17"],
		raindance: ["7L21"],
		brine: ["7L25"],
		aquaring: ["7L29"],
		aurorabeam: ["7L33"],
		acidarmor: ["7L37"],
		muddywater: ["7L41"],
		mudsport: ["7L45"],
		lastresort: ["7L49"],
		haze: ["7L53"],
		hydropump: ["7L57"],
		
		// TM Moves
		workup: ["7M"],
		roar: ["7M"],
		toxic: ["7M"],
		hail: ["7M"],
		hiddenpower: ["7M"],
		sunnyday: ["7M"],
		icebeam: ["7M"],
		blizzard: ["7M"],
		hyperbeam: ["7M"],
		protect: ["7M"],
		raindance: ["7M"],
		safeguard: ["7M"],
		frustration: ["7M"],
		return: ["7M"],
		shadowball: ["7M"],
		doubleteam: ["7M"],
		facade: ["7M"],
		rest: ["7M"],
		attract: ["7M"],
		round: ["7M"],
		echoedvoice: ["7M"],
		scald: ["7M"],
		gigaimpact: ["7M"],
		swagger: ["7M"],
		sleeptalk: ["7M"],
		substitute: ["7M"],
		surf: ["7M"],
		waterfall: ["7M"],
		confide: ["7M"],
		
		// Tutor Moves
		aquatail: ["7T"],
		covet: ["7T"],
		endeavor: ["7T"],
		healbell: ["7T"],
		helpinghand: ["7T"],
		hypervoice: ["7T"],
		icywind: ["7T"],
		irontail: ["7T"],
		lastresort: ["7T"],
		recycle: ["7T"],
		signalbeam: ["7T"],
		snore: ["7T"],
		
		dig: ["7T"],
		retaliate: ["7T"],
		rocksmash: ["7T"],
		secretpower: ["7T"],
		
		strengh: ["7T"],
		whirlpool: ["7T"],
		
		bodyslam: ["7T"],
		dive: ["7T"],
		doubleedge: ["7T"],
		endure: ["7T"],
		headbutt: ["7T"],
		mimic: ["7T"],
		mudslap: ["7T"],
		swift: ["7T"],
		
		firefang: ["7T"],
		icefang: ["7T"],
		thunderfang: ["7T"],
	}},
	jolteon: {learnset: {
		// Jolteon
		// Removed Moves: Sing
		// Added Moves: Bide, Encore, Endeavor, Fire Fang, Foresight, Ice Fang, Recycle, Safeguard, Taunt
		
		// Level-up Moves
		thundershock: ["7L0"],
		helpinghand: ["7L1"],
		tackle: ["7L1"],
		tailwhip: ["7L1"],
		sandattack: ["7L5"],
		spark: ["7L9"],
		babydolleyes: ["7L13"],
		doublekick: ["7L17"],
		electricterrain: ["7L21"],
		shockwave: ["7L25"],
		thunderwave: ["7L29"],
		pinmissile: ["7L33"],
		agility: ["7L37"],
		discharge: ["7L41"],
		charge: ["7L45"],
		lastresort: ["7L49"],
		electrify: ["7L53"],
		zapcannon: ["7L57"],
		
		// TM Moves
		workup: ["7M"],
		roar: ["7M"],
		toxic: ["7M"],
		hiddenpower: ["7M"],
		sunnyday: ["7M"],
		taunt: ["7M"],
		hyperbeam: ["7M"],
		lightscreen: ["7M"],
		protect: ["7M"],
		raindance: ["7M"],
		safeguard: ["7M"],
		frustration: ["7M"],
		thunderbolt: ["7M"],
		thunder: ["7M"],
		return: ["7M"],
		shadowball: ["7M"],
		doubleteam: ["7M"],
		facade: ["7M"],
		rest: ["7M"],
		attract: ["7M"],
		round: ["7M"],
		echoedvoice: ["7M"],
		chargebeam: ["7M"],
		gigaimpact: ["7M"],
		voltswitch: ["7M"],
		thunderwave: ["7M"],
		swagger: ["7M"],
		sleeptalk: ["7M"],
		substitute: ["7M"],
		wildcharge: ["7M"],
		confide: ["7M"],
		
		// Tutor Moves
		covet: ["7T"],
		endeavor: ["7T"],
		healbell: ["7T"],
		helpinghand: ["7T"],
		hypervoice: ["7T"],
		irontail: ["7T"],
		lastresort: ["7T"],
		magnetrise: ["7T"],
		recycle: ["7T"],
		shockwave: ["7T"],
		signalbeam: ["7T"],
		snore: ["7T"],
		
		dig: ["7T"],
		retaliate: ["7T"],
		flash: ["7T"],
		rocksmash: ["7T"],
		secretpower: ["7T"],
		
		strengh: ["7T"],
		
		bodyslam: ["7T"],
		doubleedge: ["7T"],
		endure: ["7T"],
		headbutt: ["7T"],
		mimic: ["7T"],
		mudslap: ["7T"],
		swift: ["7T"],
		
		firefang: ["7T"],
		icefang: ["7T"],
		thunderfang: ["7T"],
	}},
	flareon: {learnset: {
		// Flareon
		// Removed Moves: Sing
		// Added Moves: Bide, Encore, Endeavor, Foresight, Ice Fang, Recycle, Safeguard, Solar Beam, Thunder Fang
		
		// Level-up Moves
		ember: ["7L0"],
		helpinghand: ["7L1"],
		tackle: ["7L1"],
		tailwhip: ["7L1"],
		sandattack: ["7L5"],
		flamecharge: ["7L9"],
		babydolleyes: ["7L13"],
		knockoff: ["7L17"],
		sunnyday: ["7L21"],
		incinerate: ["7L25"],
		willowisp: ["7L29"],
		superpower: ["7L33"],
		bulkup: ["7L37"],
		lavaplume: ["7L41"],
		partingshot: ["7L45"],
		lastresort: ["7L49"],
		wideguard: ["7L53"],
		flareblitz: ["7L57"],
		
		// TM Moves
		workup: ["7M"],
		roar: ["7M"],
		toxic: ["7M"],
		hiddenpower: ["7M"],
		sunnyday: ["7M"],
		hyperbeam: ["7M"],
		protect: ["7M"],
		raindance: ["7M"],
		safeguard: ["7M"],
		frustration: ["7M"],
		solarbeam: ["7M"],
		return: ["7M"],
		shadowball: ["7M"],
		doubleteam: ["7M"],
		flamethrower: ["7M"],
		fireblast: ["7M"],
		facade: ["7M"],
		flamecharge: ["7M"],
		rest: ["7M"],
		attract: ["7M"],
		round: ["7M"],
		echoedvoice: ["7M"],
		overheat: ["7M"],
		willowisp: ["7M"],
		gigaimpact: ["7M"],
		swagger: ["7M"],
		sleeptalk: ["7M"],
		substitute: ["7M"],
		confide: ["7M"],
		
		// Tutor Moves
		covet: ["7T"],
		endeavor: ["7T"],
		healbell: ["7T"],
		heatwave: ["7T"],
		helpinghand: ["7T"],
		hypervoice: ["7T"],
		irontail: ["7T"],
		lastresort: ["7T"],
		recycle: ["7T"],
		snore: ["7T"],
		superpower: ["7T"],
		
		dig: ["7T"],
		incinerate: ["7T"],
		retaliate: ["7T"],
		rocksmash: ["7T"],
		secretpower: ["7T"],
		
		strengh: ["7T"],
		
		bodyslam: ["7T"],
		doubleedge: ["7T"],
		endure: ["7T"],
		headbutt: ["7T"],
		mimic: ["7T"],
		mudslap: ["7T"],
		swift: ["7T"],
		
		firefang: ["7T"],
		icefang: ["7T"],
		thunderfang: ["7T"],
	}},
	espeon: {learnset: {
		// Espeon
		// Removed Moves: Cut, Sing, Telekinesis
		// Added Moves: Bide, Encore, Endeavor, Fire Fang, Foresight, Ice Fang, Recycle, Safeguard, Thunder Fang
		
		// Level-up Moves
		confusion: ["7L0"],
		helpinghand: ["7L1"],
		tackle: ["7L1"],
		tailwhip: ["7L1"],
		sandattack: ["7L5"],
		psybeam: ["7L9"],
		babydolleyes: ["7L13"],
		signalbeam: ["7L17"],
		psychicterrain: ["7L21"],
		psyshock: ["7L25"],
		psychoshift: ["7L29"],
		hex: ["7L33"],
		psychup: ["7L37"],
		psychic: ["7L41"],
		morningsun: ["7L45"],
		lastresort: ["7L49"],
		powerswap: ["7L53"],
		futuresight: ["7L57"],
		
		// TM Moves
		workup: ["7M"],
		psyshock: ["7M"],
		calmmind: ["7M"],
		toxic: ["7M"],
		hiddenpower: ["7M"],
		sunnyday: ["7M"],
		hyperbeam: ["7M"],
		lightscreen: ["7M"],
		protect: ["7M"],
		raindance: ["7M"],
		safeguard: ["7M"],
		frustration: ["7M"],
		return: ["7M"],
		psychic: ["7M"],
		shadowball: ["7M"],
		doubleteam: ["7M"],
		reflect: ["7M"],
		facade: ["7M"],
		rest: ["7M"],
		attract: ["7M"],
		round: ["7M"],
		echoedvoice: ["7M"],
		gigaimpact: ["7M"],
		psychup: ["7M"],
		dreameater: ["7M"],
		grassknot: ["7M"],
		swagger: ["7M"],
		sleeptalk: ["7M"],
		substitute: ["7M"],
		trickroom: ["7M"],
		dazzlinggleam: ["7M"],
		confide: ["7M"],
		
		// Tutor Moves
		covet: ["7T"],
		endeavor: ["7T"],
		healbell: ["7T"],
		helpinghand: ["7T"],
		hypervoice: ["7T"],
		irontail: ["7T"],
		lastresort: ["7T"],
		magiccoat: ["7T"],
		magicroom: ["7T"],
		recycle: ["7T"],
		signalbeam: ["7T"],
		skillswap: ["7T"],
		snore: ["7T"],
		trick: ["7T"],
		zenheadbutt: ["7T"],
		
		dig: ["7T"],
		retaliate: ["7T"],
		flash: ["7T"],
		secretpower: ["7T"],
		
		bodyslam: ["7T"],
		doubleedge: ["7T"],
		endure: ["7T"],
		headbutt: ["7T"],
		mimic: ["7T"],
		mudslap: ["7T"],
		nightmare: ["7T"],
		swift: ["7T"],
		
		// Added on ASDASD
		
		firefang: ["7T"],
		icefang: ["7T"],
		thunderfang: ["7T"],
	}},
	umbreon: {learnset: {
		// Umbreon
		// Removed Moves: Cut, Sing
		// Added Moves: Bide, Embargo, Encore, Endeavor, Fire Fang, Foresight, Ice Fang, Recycle, Safeguard, Thunder Fang
		
		// Level-up Moves
		pursuit: ["7L0"],
		helpinghand: ["7L1"],
		tackle: ["7L1"],
		tailwhip: ["7L1"],
		sandattack: ["7L5"],
		feintattack: ["7L9"],
		babydolleyes: ["7L13"],
		poisonfang: ["7L17"],
		meanlook: ["7L21"],
		assurance: ["7L25"],
		confuseray: ["7L29"],
		counter: ["7L33"],
		screech: ["7L37"],
		payback: ["7L41"],
		moonlight: ["7L45"],
		lastresort: ["7L49"],
		guardswap: ["7L53"],
		foulplay: ["7L57"],
		
		// TM Moves
		workup: ["7M"],
		toxic: ["7M"],
		hiddenpower: ["7M"],
		sunnyday: ["7M"],
		taunt: ["7M"],
		hyperbeam: ["7M"],
		protect: ["7M"],
		raindance: ["7M"],
		safeguard: ["7M"],
		frustration: ["7M"],
		return: ["7M"],
		psychic: ["7M"],
		shadowball: ["7M"],
		doubleteam: ["7M"],
		torment: ["7M"],
		facade: ["7M"],
		rest: ["7M"],
		attract: ["7M"],
		round: ["7M"],
		echoedvoice: ["7M"],
		embargo: ["7M"],
		payback: ["7M"],
		gigaimpact: ["7M"],
		psychup: ["7M"],
		dreameater: ["7M"],
		swagger: ["7M"],
		sleeptalk: ["7M"],
		substitute: ["7M"],
		snarl: ["7M"],
		darkpulse: ["7M"],
		confide: ["7M"],
		
		// Tutor Moves
		covet: ["7T"],
		endeavor: ["7T"],
		foulplay: ["7T"],
		healbell: ["7T"],
		helpinghand: ["7T"],
		hypervoice: ["7T"],
		irontail: ["7T"],
		lastresort: ["7T"],
		recycle: ["7T"],
		snatch: ["7T"],
		snore: ["7T"],
		spite: ["7T"],
		wonderroom: ["7T"],
		
		dig: ["7T"],
		retaliate: ["7T"],
		flash: ["7T"],
		secretpower: ["7T"],
		
		bodyslam: ["7T"],
		doubleedge: ["7T"],
		endure: ["7T"],
		headbutt: ["7T"],
		mimic: ["7T"],
		mudslap: ["7T"],
		nightmare: ["7T"],
		swift: ["7T"],
		
		firefang: ["7T"],
		icefang: ["7T"],
		thunderfang: ["7T"],
	}},
	leafeon: {learnset: {
		// Leafeon
		// Removed Moves: Bullet Seed, Sing
		// Added Moves: Bide, Cut, Encore, Endeavor, Fire Fang, Foresight, Ice Fang, Recycle, Safeguard, Thunder Fang, U-turn
		
		// Level-up Moves
		absorb: ["7L0"],
		helpinghand: ["7L1"],
		tackle: ["7L1"],
		tailwhip: ["7L1"],
		sandattack: ["7L5"],
		magicalleaf: ["7L9"],
		babydolleyes: ["7L13"],
		furycutter: ["7L17"],
		grassyterrain: ["7L21"],
		razorleaf: ["7L25"],
		grasswhistle: ["7L29"],
		nightslash: ["7L33"],
		swordsdance: ["7L37"],
		leafblade: ["7L41"],
		synthesis: ["7L45"],
		lastresort: ["7L49"],
		leechseed: ["7L53"],
		solarblade: ["7L57"],
		
		// TM Moves
		workup: ["7M"],
		roar: ["7M"],
		toxic: ["7M"],
		hiddenpower: ["7M"],
		sunnyday: ["7M"],
		hyperbeam: ["7M"],
		protect: ["7M"],
		raindance: ["7M"],
		safeguard: ["7M"],
		frustration: ["7M"],
		solarbeam: ["7M"],
		return: ["7M"],
		shadowball: ["7M"],
		doubleteam: ["7M"],
		aerialace: ["7M"],
		facade: ["7M"],
		rest: ["7M"],
		attract: ["7M"],
		round: ["7M"],
		echoedvoice: ["7M"],
		energyball: ["7M"],
		gigaimpact: ["7M"],
		swordsdance: ["7M"],
		xscissor: ["7M"],
		grassknot: ["7M"],
		swagger: ["7M"],
		sleeptalk: ["7M"],
		uturn: ["7M"],
		substitute: ["7M"],
		naturepower: ["7M"],
		confide: ["7M"],
		
		// Tutor Moves
		covet: ["7T"],
		endeavor: ["7T"],
		healbell: ["7T"],
		helpinghand: ["7T"],
		hypervoice: ["7T"],
		irontail: ["7T"],
		knockoff: ["7T"],
		lastresort: ["7T"],
		recycle: ["7T"],
		seedbomb: ["7T"],
		snore: ["7T"],
		worryseed: ["7T"],
		
		dig: ["7T"],
		retaliate: ["7T"],
		flash: ["7T"],
		rocksmash: ["7T"],
		secretpower: ["7T"],
		
		cut: ["7T"],
		strengh: ["7T"],
		
		bodyslam: ["7T"],
		doubleedge: ["7T"],
		endure: ["7T"],
		furycutter: ["7T"],
		headbutt: ["7T"],
		mimic: ["7T"],
		mudslap: ["7T"],
		swift: ["7T"],
		
		firefang: ["7T"],
		icefang: ["7T"],
		thunderfang: ["7T"],
	}},
	glaceon: {learnset: {
		// Glaceon
		// Removed Moves: Sing
		// Added Moves: Bide, Encore, Endeavor, Fire Fang, Foresight, Recycle, Safeguard, Thunder Fang
		
		// Level-up Moves
		icywind: ["7L0"],
		helpinghand: ["7L1"],
		tackle: ["7L1"],
		tailwhip: ["7L1"],
		sandattack: ["7L5"],
		iceshard: ["7L9"],
		babydolleyes: ["7L13"],
		waterpulse: ["7L17"],
		hail: ["7L21"],
		avalanche: ["7L25"],
		mist: ["7L29"],
		mirrorcoat: ["7L33"],
		barrier: ["7L37"],
		frostbreath: ["7L41"],
		watersport: ["7L45"],
		lastresort: ["7L49"],
		auroraveil: ["7L53"],
		blizzard: ["7L57"],
		
		// TM Moves
		workup: ["7M"],
		roar: ["7M"],
		toxic: ["7M"],
		hail: ["7M"],
		hiddenpower: ["7M"],
		sunnyday: ["7M"],
		icebeam: ["7M"],
		blizzard: ["7M"],
		hyperbeam: ["7M"],
		protect: ["7M"],
		raindance: ["7M"],
		safeguard: ["7M"],
		frustration: ["7M"],
		return: ["7M"],
		shadowball: ["7M"],
		doubleteam: ["7M"],
		facade: ["7M"],
		rest: ["7M"],
		attract: ["7M"],
		round: ["7M"],
		echoedvoice: ["7M"],
		gigaimpact: ["7M"],
		auroraveil: ["7M"],
		frostbreath: ["7M"],
		swagger: ["7M"],
		sleeptalk: ["7M"],
		substitute: ["7M"],
		confide: ["7M"],
		
		// Tutor Moves
		aquatail: ["7T"],
		covet: ["7T"],
		endeavor: ["7T"],
		healbell: ["7T"],
		helpinghand: ["7T"],
		hypervoice: ["7T"],
		irontail: ["7T"],
		lastresort: ["7T"],
		recycle: ["7T"],
		signalbeam: ["7T"],
		snore: ["7T"],
		waterpulse: ["7T"],
		
		dig: ["7T"],
		retaliate: ["7T"],
		rocksmash: ["7T"],
		secretpower: ["7T"],
		
		strengh: ["7T"],
		
		bodyslam: ["7T"],
		doubleedge: ["7T"],
		endure: ["7T"],
		headbutt: ["7T"],
		mimic: ["7T"],
		mudslap: ["7T"],
		swift: ["7T"],
		
		firefang: ["7T"],
		icefang: ["7T"],
		thunderfang: ["7T"],
	}},
	sylveon: {learnset: {
		// Sylveon
		// Removed Moves: Cut, Sing
		// Added Moves: Bide, Encore, Endeavor, Fire Fang, Foresight, Ice Fang, Recycle, Safeguard, Thunder Fang
		
		// Level-up Moves
		fairywind: ["7L0"],
		helpinghand: ["7L1"],
		tackle: ["7L1"],
		tailwhip: ["7L1"],
		sandattack: ["7L5"],
		disarmingvoice: ["7L9"],
		babydolleyes: ["7L13"],
		zenheadbutt: ["7L17"],
		mistyterrain: ["7L21"],
		drainingkiss: ["7L25"],
		sweetkiss: ["7L29"],
		aurasphere: ["7L33"],
		calmmind: ["7L37"],
		dazzlinggleam: ["7L41"],
		afteryou: ["7L45"],
		lastresort: ["7L49"],
		skillswap: ["7L53"],
		moonblast: ["7L57"],
		
		// TM Moves
		workup: ["7M"],
		psyshock: ["7M"],
		calmmind: ["7M"],
		toxic: ["7M"],
		hiddenpower: ["7M"],
		sunnyday: ["7M"],
		hyperbeam: ["7M"],
		lightscreen: ["7M"],
		protect: ["7M"],
		raindance: ["7M"],
		safeguard: ["7M"],
		frustration: ["7M"],
		return: ["7M"],
		shadowball: ["7M"],
		doubleteam: ["7M"],
		reflect: ["7M"],
		facade: ["7M"],
		rest: ["7M"],
		attract: ["7M"],
		round: ["7M"],
		echoedvoice: ["7M"],
		gigaimpact: ["7M"],
		psychup: ["7M"],
		swagger: ["7M"],
		sleeptalk: ["7M"],
		substitute: ["7M"],
		dazzlinggleam: ["7M"],
		confide: ["7M"],
		
		// Tutor Moves
		covet: ["7T"],
		endeavor: ["7T"],
		healbell: ["7T"],
		helpinghand: ["7T"],
		hypervoice: ["7T"],
		irontail: ["7T"],
		lastresort: ["7T"],
		magiccoat: ["7T"],
		recycle: ["7T"],
		snore: ["7T"],
		
		dig: ["7T"],
		retaliate: ["7T"],
		flash: ["7T"],
		secretpower: ["7T"],
		
		bodyslam: ["7T"],
		doubleedge: ["7T"],
		endure: ["7T"],
		headbutt: ["7T"],
		mimic: ["7T"],
		mudslap: ["7T"],
		swift: ["7T"],
		
		firefang: ["7T"],
		icefang: ["7T"],
		thunderfang: ["7T"],
	}},
	sentret: {learnset: {
		// Sentret
		// Removed Moves: Brutal Swing, Solarbeam, Trick
		// Added Moves: After You, Bestow, Heal Bell, Lucky Chant, Play Nice, Recycle, Safeguard, Tail Whip, Wish, Yawn
		
		// Level-up Moves
		scratch: ["7L1"],
		tailwhip: ["7L1"],
		foresight: ["7L1"],
		defensecurl: ["7L4"],
		quickattack: ["7L7"],
		playnice: ["7L10"],
		furyswipes: ["7L13"],
		helpinghand: ["7L16"],
		batonpass: ["7L19"],
		swift: ["7L22"],
		recycle: ["7L25"],
		slam: ["7L28"],
		luckychant: ["7L31"],
		followme: ["7L34"],
		tailslap: ["7L37"],
		mefirst: ["7L40"],
		bestow: ["7L43"],
		hypervoice: ["7L46"],
		
		// Egg Moves
		amnesia: ["7E"],
		assist: ["7E"],
		captivate: ["7E"],
		charm: ["7E"],
		covet: ["7E"],
		doubleedge: ["7E"],
		focusenergy: ["7E"],
		irontail: ["7E"],
		lastresort: ["7E"],
		naturalgift: ["7E"],
		pursuit: ["7E"],
		reversal: ["7E"],
		slash: ["7E"],
		wish: ["7E"],
		yawn: ["7E"],
		
		// TM Moves
		workup: ["7M"],
		toxic: ["7M"],
		hiddenpower: ["7M"],
		sunnyday: ["7M"],
		taunt: ["7M"],
		icebeam: ["7M"],
		protect: ["7M"],
		raindance: ["7M"],
		safeguard: ["7M"],
		frustration: ["7M"],
		thunderbolt: ["7M"],
		return: ["7M"],
		shadowball: ["7M"],
		brickbreak: ["7M"],
		doubleteam: ["7M"],
		flamethrower: ["7M"],
		facade: ["7M"],
		rest: ["7M"],
		attract: ["7M"],
		thief: ["7M"],
		round: ["7M"],
		echoedvoice: ["7M"],
		fling: ["7M"],
		chargebeam: ["7M"],
		shadowclaw: ["7M"],
		grassknot: ["7M"],
		swagger: ["7M"],
		sleeptalk: ["7M"],
		uturn: ["7M"],
		substitute: ["7M"],
		surf: ["7M"],
		confide: ["7M"],
		
		// Tutor Moves
		afteryou: ["7T"],
		aquatail: ["7T"],
		covet: ["7T"],
		drainpunch: ["7T"],
		endeavor: ["7T"],
		firepunch: ["7T"],
		focuspunch: ["7T"],
		healbell: ["7T"],
		helpinghand: ["7T"],
		hypervoice: ["7T"],
		icepunch: ["7T"],
		irontail: ["7T"],
		knockoff: ["7T"],
		lastresort: ["7T"],
		recycle: ["7T"],
		shockwave: ["7T"],
		snore: ["7T"],
		superfang: ["7T"],
		thunderpunch: ["7T"],
		uproar: ["7T"],
		waterpulse: ["7T"],
		
		honeclaws: ["7T"],
		dig: ["7T"],
		retaliate: ["7T"],
		secretpower: ["7T"],
		poweruppunch: ["7T"],
		
		cut: ["7T"],
		whirlpool: ["7T"],
		
		bodyslam: ["7T"],
		defensecurl: ["7T"],
		doubleedge: ["7T"],
		dynamicpunch: ["7T"],
		endure: ["7T"],
		furycutter: ["7T"],
		headbutt: ["7T"],
		mimic: ["7T"],
		mudslap: ["7T"],
		rollout: ["7T"],
		suckerpunch: ["7T"],
		swift: ["7T"],
	}},
	furret: {learnset: {
		// Furret
		// Removed Moves: Brutal Swing, Trick
		// Added Moves: After You, Bestow, Dizzy Punch, Encore, Fake Out, Heal Bell, Lucky Chant, Play Nice, Recycle, Safeguard, Tail Whip, Sing, Sweet Kiss, Switcheroo, Wish, Yawn
		
		// Level-up Moves
		agility: ["7L0"],
		batonpass: ["7L1"],
		scratch: ["7L1"],
		tailwhip: ["7L1"],
		foresight: ["7L1"],
		defensecurl: ["7L5"],
		quickattack: ["7L9"],
		playnice: ["7L13"],
		fakeout: ["7L17"],
		helpinghand: ["7L21"],
		coil: ["7L25"],
		slam: ["7L29"],
		encore: ["7L33"],
		tailslap: ["7L37"],
		sing: ["7L41"],
		followme: ["7L45"],
		hypervoice: ["7L49"],
		mefirst: ["7L53"],
		sweetkiss: ["7L57"],
		dizzypunch: ["7L61"],
		switcheroo: ["7L65"],
		
		// Egg Moves
		amnesia: ["7E"],
		assist: ["7E"],
		captivate: ["7E"],
		charm: ["7E"],
		covet: ["7E"],
		doubleedge: ["7E"],
		focusenergy: ["7E"],
		irontail: ["7E"],
		lastresort: ["7E"],
		naturalgift: ["7E"],
		pursuit: ["7E"],
		reversal: ["7E"],
		slash: ["7E"],
		wish: ["7E"],
		yawn: ["7E"],
		
		// TM Moves
		workup: ["7M"],
		toxic: ["7M"],
		hiddenpower: ["7M"],
		sunnyday: ["7M"],
		taunt: ["7M"],
		icebeam: ["7M"],
		blizzard: ["7M"],
		hyperbeam: ["7M"],
		protect: ["7M"],
		raindance: ["7M"],
		safeguard: ["7M"],
		frustration: ["7M"],
		solarbeam: ["7M"],
		thunderbolt: ["7M"],
		thunder: ["7M"],
		return: ["7M"],
		shadowball: ["7M"],
		brickbreak: ["7M"],
		doubleteam: ["7M"],
		flamethrower: ["7M"],
		fireblast: ["7M"],
		facade: ["7M"],
		rest: ["7M"],
		attract: ["7M"],
		thief: ["7M"],
		round: ["7M"],
		echoedvoice: ["7M"],
		focusblast: ["7M"],
		fling: ["7M"],
		chargebeam: ["7M"],
		shadowclaw: ["7M"],
		gigaimpact: ["7M"],
		grassknot: ["7M"],
		swagger: ["7M"],
		sleeptalk: ["7M"],
		uturn: ["7M"],
		substitute: ["7M"],
		surf: ["7M"],
		confide: ["7M"],
		
		// Tutor Moves
		afteryou: ["7T"],
		aquatail: ["7T"],
		covet: ["7T"],
		drainpunch: ["7T"],
		endeavor: ["7T"],
		firepunch: ["7T"],
		focuspunch: ["7T"],
		healbell: ["7T"],
		helpinghand: ["7T"],
		hypervoice: ["7T"],
		icepunch: ["7T"],
		irontail: ["7T"],
		knockoff: ["7T"],
		lastresort: ["7T"],
		recycle: ["7T"],
		shockwave: ["7T"],
		snore: ["7T"],
		superfang: ["7T"],
		thunderpunch: ["7T"],
		uproar: ["7T"],
		waterpulse: ["7T"],
		
		honeclaws: ["7T"],
		dig: ["7T"],
		retaliate: ["7T"],
		rocksmash: ["7T"],
		secretpower: ["7T"],
		poweruppunch: ["7T"],
		
		cut: ["7T"],
		strengh: ["7T"],
		whirlpool: ["7T"],
		
		bodyslam: ["7T"],
		defensecurl: ["7T"],
		doubleedge: ["7T"],
		dynamicpunch: ["7T"],
		endure: ["7T"],
		furycutter: ["7T"],
		headbutt: ["7T"],
		mimic: ["7T"],
		mudslap: ["7T"],
		rollout: ["7T"],
		suckerpunch: ["7T"],
		swift: ["7T"],
	}},
};
