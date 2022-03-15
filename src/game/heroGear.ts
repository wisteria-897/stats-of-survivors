import { Tiers, Bonus } from './bonus';
import { SourceCategory, Tier } from './bonus';
import { Stat, Stats } from './stat';

export enum HeroType {
    Brawler = 'Brawler',
    Scout = 'Scout',
    Marksman = 'Marksman'
}

export enum HeroGearSlot {
    BrawlerHead = 'Brawler Goggles',
    BrawlerBody = 'Brawler Protective Clothing',
    BrawlerFoot = 'Brawler Boots',
    MarksmanHead = 'Marksman Scope',
    MarksmanBody = 'Marksman Camouflage',
    MarksmanFoot = 'Marksman Boots',
    ScoutHead = 'Scout Night-vision Goggles',
    ScoutBody = 'Scout Top',
    ScoutFoot = 'Scout Slippers'
}

const slotHeroTypes = {
    [HeroGearSlot.BrawlerHead]: HeroType.Brawler,
    [HeroGearSlot.BrawlerBody]: HeroType.Brawler,
    [HeroGearSlot.BrawlerFoot]: HeroType.Brawler,
    [HeroGearSlot.MarksmanHead]: HeroType.Marksman,
    [HeroGearSlot.MarksmanBody]: HeroType.Marksman,
    [HeroGearSlot.MarksmanFoot]: HeroType.Marksman,
    [HeroGearSlot.ScoutHead]: HeroType.Scout,
    [HeroGearSlot.ScoutBody]: HeroType.Scout,
    [HeroGearSlot.ScoutFoot]: HeroType.Scout
} as const;

const tierNames = {
    [HeroType.Brawler]: {
        [Tiers.Common.name]: 'Strong',
        [Tiers.Uncommon.name]: 'Firm',
        [Tiers.Rare.name]: 'Iron Wall',
        [Tiers.Epic.name]: 'Fanatic',
        [Tiers.Legendary.name]: 'Domineering'
    },
    [HeroType.Marksman]: {
        [Tiers.Common.name]: 'Steady',
        [Tiers.Uncommon.name]: 'Sprint',
        [Tiers.Rare.name]: 'Armor Break',
        [Tiers.Epic.name]: 'Troop Break',
        [Tiers.Legendary.name]: 'Blast'
    },
    [HeroType.Scout]: {
        [Tiers.Common.name]: 'Light',
        [Tiers.Uncommon.name]: 'Swift',
        [Tiers.Rare.name]: 'Rapid',
        [Tiers.Epic.name]: 'Thunder',
        [Tiers.Legendary.name]: 'Lightning'
    }
} as const;

type LevelData = { tier: Tier, tierLevel: number, bonusValues: number[] };

export class HeroGear {
    readonly slot: HeroGearSlot;
    readonly stats: Stat[];
    readonly levels: HeroGearLevel[];

    constructor(slot: HeroGearSlot, stats: Stat[], ...levelData: LevelData[]) {
        this.slot = slot;
        this.stats = stats;
        this.levels = levelData.map(({tier, tierLevel, bonusValues}, i) => {
            return new HeroGearLevel(this, i + 1, tier, tierLevel, ...bonusValues);
        });
    }

    get heroType() {
        return slotHeroTypes[this.slot];
    }

    get key() {
        return this.slot;
    }

    get name() {
        return this.slot;
    }

    get category() {
        return SourceCategory.HeroGear;
    }
}

export class HeroGearLevel {
    readonly gear: HeroGear;
    readonly tier: Tier;
    readonly level: number;
    readonly tierLevel: {tier: Tier, level: number};
    readonly bonuses: Bonus[];

    constructor(gear: HeroGear, level: number, tier: Tier, tierLevel: number, ...bonusValues: number[]) {
        this.gear = gear;
        this.level = level;
        this.tier = tier;
        this.tierLevel = {tier, level: tierLevel};
        this.bonuses = gear.stats.map((stat, i) => new Bonus(stat, bonusValues[i], this));
    }

    get name() {
        return tierNames[this.gear.heroType][this.tierLevel.tier.name] + ' ' + this.gear.name + ' ' + "⭐️".repeat(this.tierLevel.level);
    }

    get category() {
        return SourceCategory.HeroGear;
    }

    get bonusValues() {
        return this.bonuses.map(b => b.value);
    }

    get provider() {
        return this.gear;
    }
}

export const HeroGears = {
    [HeroGearSlot.BrawlerHead]: new HeroGear(HeroGearSlot.BrawlerHead,
        [Stats.ExplorerAttack, Stats.ExplorerDefense, Stats.InfantryHealth, Stats.InfantryLethality],
        { tier: Tiers.Common, tierLevel: 1, bonusValues: [ 23, 35, 1350, 3050 ] },
        { tier: Tiers.Common, tierLevel: 2, bonusValues: [ 12, 17, 600, 1990 ] },
        { tier: Tiers.Common, tierLevel: 3, bonusValues: [ 14, 19, 900, 2510 ] },
        { tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [ 20, 27, 1250, 2910 ] },
        { tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [ 21, 27, 1200, 2910 ] },
        { tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [ 15, 18, 1200, 2970 ] },
        { tier: Tiers.Rare, tierLevel: 1, bonusValues: [ 15, 17, 1200, 3020 ] },
        { tier: Tiers.Rare, tierLevel: 2, bonusValues: [ 59, 45, 1470, 3390 ] },
        { tier: Tiers.Rare, tierLevel: 3, bonusValues: [ 58, 44, 2130, 4170 ] },
        { tier: Tiers.Rare, tierLevel: 4, bonusValues: [ 26, 28, 2750, 3700 ] },
        { tier: Tiers.Epic, tierLevel: 1, bonusValues: [ 27, 27, 2750, 3700 ] },
        { tier: Tiers.Epic, tierLevel: 2, bonusValues: [ 17, 19, 2750, 3700 ] },
        { tier: Tiers.Epic, tierLevel: 3, bonusValues: [ 18, 18, 2800, 3700 ] },
        { tier: Tiers.Epic, tierLevel: 4, bonusValues: [ 18, 19, 2830, 3780 ] },
        { tier: Tiers.Epic, tierLevel: 5, bonusValues: [ 15, 15, 2840, 3780 ] },
        { tier: Tiers.Legendary, tierLevel: 1, bonusValues: [ 14, 15, 2830, 3780 ] },
        { tier: Tiers.Legendary, tierLevel: 2, bonusValues: [ 15, 15, 2840, 3780 ] },
        { tier: Tiers.Legendary, tierLevel: 3, bonusValues: [ 14, 16, 2830, 3780 ] },
        { tier: Tiers.Legendary, tierLevel: 4, bonusValues: [ 14, 15, 2840, 3780 ] },
        { tier: Tiers.Legendary, tierLevel: 5, bonusValues: [ 19, 19, 3640, 4820 ] }),
    [HeroGearSlot.BrawlerBody]: new HeroGear(HeroGearSlot.BrawlerBody,
        [Stats.ExplorerAttack, Stats.ExplorerHealth, Stats.InfantryHealth],
        { tier: Tiers.Common, tierLevel: 1, bonusValues: [ 23, 944, 3610 ] },
        { tier: Tiers.Common, tierLevel: 2, bonusValues: [ 12, 436, 2390 ] },
        { tier: Tiers.Common, tierLevel: 3, bonusValues: [ 14, 520, 2920 ] },
        { tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [ 20, 740, 3440 ] },
        { tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [ 21, 710, 3490 ] },
        { tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [ 15, 470, 3510 ] },
        { tier: Tiers.Rare, tierLevel: 1, bonusValues: [ 15, 480, 3510 ] },
        { tier: Tiers.Rare, tierLevel: 2, bonusValues: [ 59, 1200, 4000 ] },
        { tier: Tiers.Rare, tierLevel: 3, bonusValues: [ 58, 1200, 4780 ] },
        { tier: Tiers.Rare, tierLevel: 4, bonusValues: [ 26, 750, 4180 ] },
        { tier: Tiers.Epic, tierLevel: 1, bonusValues: [ 27, 750, 4190 ] },
        { tier: Tiers.Epic, tierLevel: 2, bonusValues: [ 17, 500, 4180 ] },
        { tier: Tiers.Epic, tierLevel: 3, bonusValues: [ 18, 500, 4250 ] },
        { tier: Tiers.Epic, tierLevel: 4, bonusValues: [ 27, 750, 4260 ] },
        { tier: Tiers.Epic, tierLevel: 5, bonusValues: [ 13, 370, 4250 ] },
        { tier: Tiers.Legendary, tierLevel: 1, bonusValues: [ 13, 370, 4260 ] },
        { tier: Tiers.Legendary, tierLevel: 2, bonusValues: [ 13, 370, 4250 ] },
        { tier: Tiers.Legendary, tierLevel: 3, bonusValues: [ 13, 370, 4260 ] },
        { tier: Tiers.Legendary, tierLevel: 4, bonusValues: [ 13, 380, 4250 ] },
        { tier: Tiers.Legendary, tierLevel: 5, bonusValues: [ 17, 470, 5430 ] }),
    [HeroGearSlot.BrawlerFoot]: new HeroGear(HeroGearSlot.BrawlerFoot,
        [Stats.ExplorerDefense, Stats.ExplorerHealth, Stats.InfantryHealth, Stats.InfantryLethality],
        { tier: Tiers.Common, tierLevel: 1, bonusValues: [ 24, 2200, 1150, 3010 ] },
        { tier: Tiers.Common, tierLevel: 2, bonusValues: [ 11, 1020, 500, 1550 ] },
        { tier: Tiers.Common, tierLevel: 3, bonusValues: [ 13, 1220, 750, 2110 ] },
        { tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [ 18, 1720, 1000, 2730 ] },
        { tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [ 17, 1650, 1000, 2780 ] },
        { tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [ 12, 1120, 1000, 2750 ] },
        { tier: Tiers.Rare, tierLevel: 1, bonusValues: [ 12, 1120, 1050, 2930 ] },
        { tier: Tiers.Rare, tierLevel: 2, bonusValues: [ 30, 2800, 1230, 3340 ] },
        { tier: Tiers.Rare, tierLevel: 3, bonusValues: [ 29, 2800, 1620, 4780 ] },
        { tier: Tiers.Rare, tierLevel: 4, bonusValues: [ 19, 1750, 2320, 5400 ] },
        { tier: Tiers.Epic, tierLevel: 1, bonusValues: [ 18, 1750, 2330, 5400 ] },
        { tier: Tiers.Epic, tierLevel: 2, bonusValues: [ 13, 1160, 2320, 5400 ] },
        { tier: Tiers.Epic, tierLevel: 3, bonusValues: [ 12, 1170, 2380, 5550 ] },
        { tier: Tiers.Epic, tierLevel: 4, bonusValues: [ 7, 660, 2370, 5680 ] },
        { tier: Tiers.Epic, tierLevel: 5, bonusValues: [ 11, 1040, 2360, 5670 ] },
        { tier: Tiers.Legendary, tierLevel: 1, bonusValues: [ 11, 1040, 2370, 5680 ] },
        { tier: Tiers.Legendary, tierLevel: 2, bonusValues: [ 11, 1040, 2360, 5670 ] },
        { tier: Tiers.Legendary, tierLevel: 3, bonusValues: [ 11, 1040, 2370, 5680 ] },
        { tier: Tiers.Legendary, tierLevel: 4, bonusValues: [ 11, 1040, 2360, 5670 ] },
        { tier: Tiers.Legendary, tierLevel: 5, bonusValues: [ 14, 1310, 3000, 7150 ] }),
    [HeroGearSlot.MarksmanHead]: new HeroGear(HeroGearSlot.MarksmanHead,
        [Stats.ExplorerAttack, Stats.ExplorerDefense, Stats.HunterHealth, Stats.HunterLethality],
        { tier: Tiers.Common, tierLevel: 1, bonusValues: [ 46, 15, 3130, 850 ] },
        { tier: Tiers.Common, tierLevel: 2, bonusValues: [ 23, 7, 1690, 400 ] },
        { tier: Tiers.Common, tierLevel: 3, bonusValues: [ 28, 8, 2280, 550 ] },
        { tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [ 41, 11, 2900, 800 ] },
        { tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [ 42, 11, 2860, 800 ] },
        { tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [ 30, 8, 2880, 770 ] },
        { tier: Tiers.Rare, tierLevel: 1, bonusValues: [ 29, 7, 2940, 790 ] },
        { tier: Tiers.Rare, tierLevel: 2, bonusValues: [ 118, 19, 3410, 950 ] },
        { tier: Tiers.Rare, tierLevel: 3, bonusValues: [ 117, 18, 4370, 1280 ] },
        { tier: Tiers.Rare, tierLevel: 4, bonusValues: [ 53, 12, 5120, 1730 ] },
        { tier: Tiers.Epic, tierLevel: 1, bonusValues: [ 53, 11, 5120, 1730 ] },
        { tier: Tiers.Epic, tierLevel: 2, bonusValues: [ 35, 8, 5120, 1730 ] },
        { tier: Tiers.Epic, tierLevel: 3, bonusValues: [ 35, 8, 5140, 1770 ] },
        { tier: Tiers.Epic, tierLevel: 4, bonusValues: [ 26, 6, 5200, 1790 ] },
        { tier: Tiers.Epic, tierLevel: 5, bonusValues: [ 30, 6, 5200, 1800 ] },
        { tier: Tiers.Legendary, tierLevel: 1, bonusValues: [ 31, 7, 5200, 1790 ] },
        { tier: Tiers.Legendary, tierLevel: 2, bonusValues: [ 30, 6, 5200, 1800 ] },
        { tier: Tiers.Legendary, tierLevel: 3, bonusValues: [ 31, 7, 5200, 1790 ] },
        { tier: Tiers.Legendary, tierLevel: 4, bonusValues: [ 30, 7, 5200, 1800 ] },
        { tier: Tiers.Legendary, tierLevel: 5, bonusValues: [ 39, 8, 6640, 2280 ] }),
    [HeroGearSlot.MarksmanBody]: new HeroGear(HeroGearSlot.MarksmanBody,
        [Stats.ExplorerAttack, Stats.ExplorerHealth, Stats.HunterLethality],
        { tier: Tiers.Common, tierLevel: 1, bonusValues: [ 46, 350, 4110 ] },
        { tier: Tiers.Common, tierLevel: 2, bonusValues: [ 23, 163, 2590 ] },
        { tier: Tiers.Common, tierLevel: 3, bonusValues: [ 28, 194, 3270 ] },
        { tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [ 41, 273, 3890 ] },
        { tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [ 42, 260, 3940 ] },
        { tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [ 30, 170, 3960 ] },
        { tier: Tiers.Rare, tierLevel: 1, bonusValues: [ 29, 180, 4310 ] },
        { tier: Tiers.Rare, tierLevel: 2, bonusValues: [ 118, 450, 4610 ] },
        { tier: Tiers.Rare, tierLevel: 3, bonusValues: [ 117, 440, 5070 ] },
        { tier: Tiers.Rare, tierLevel: 4, bonusValues: [ 53, 280, 5250 ] },
        { tier: Tiers.Epic, tierLevel: 1, bonusValues: [ 53, 280, 5250 ] },
        { tier: Tiers.Epic, tierLevel: 2, bonusValues: [ 35, 180, 5250 ] },
        { tier: Tiers.Epic, tierLevel: 3, bonusValues: [ 35, 190, 5150 ] },
        { tier: Tiers.Epic, tierLevel: 4, bonusValues: [ 47, 240, 5300 ] },
        { tier: Tiers.Epic, tierLevel: 5, bonusValues: [ 27, 140, 5290 ] },
        { tier: Tiers.Legendary, tierLevel: 1, bonusValues: [ 27, 150, 5300 ] },
        { tier: Tiers.Legendary, tierLevel: 2, bonusValues: [ 27, 140, 5290 ] },
        { tier: Tiers.Legendary, tierLevel: 3, bonusValues: [ 28, 140, 5300 ] },
        { tier: Tiers.Legendary, tierLevel: 4, bonusValues: [ 27, 150, 5290 ] },
        { tier: Tiers.Legendary, tierLevel: 5, bonusValues: [ 34, 170, 6650 ] }),
    [HeroGearSlot.MarksmanFoot]: new HeroGear(HeroGearSlot.MarksmanFoot,
        [Stats.ExplorerDefense, Stats.ExplorerHealth, Stats.HunterHealth, Stats.HunterLethality],
        { tier: Tiers.Common, tierLevel: 1, bonusValues: [ 44, 1390, 2990, 1150 ] },
        { tier: Tiers.Common, tierLevel: 2, bonusValues: [ 21, 660, 1790, 500 ] },
        { tier: Tiers.Common, tierLevel: 3, bonusValues: [ 24, 770, 2290, 750 ] },
        { tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [ 34, 1090, 2780, 1000 ] },
        { tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [ 33, 1050, 2790, 1000 ] },
        { tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [ 22, 710, 2830, 1000 ] },
        { tier: Tiers.Rare, tierLevel: 1, bonusValues: [ 22, 710, 2870, 1050 ] },
        { tier: Tiers.Rare, tierLevel: 2, bonusValues: [ 56, 1780, 3280, 1230 ] },
        { tier: Tiers.Rare, tierLevel: 3, bonusValues: [ 55, 1780, 4070, 1720 ] },
        { tier: Tiers.Rare, tierLevel: 4, bonusValues: [ 35, 1110, 4180, 2300 ] },
        { tier: Tiers.Epic, tierLevel: 1, bonusValues: [ 35, 1100, 4190, 2300 ] },
        { tier: Tiers.Epic, tierLevel: 2, bonusValues: [ 23, 740, 4180, 2300 ] },
        { tier: Tiers.Epic, tierLevel: 3, bonusValues: [ 23, 740, 4250, 2350 ] },
        { tier: Tiers.Epic, tierLevel: 4, bonusValues: [ 21, 670, 4260, 2370 ] },
        { tier: Tiers.Epic, tierLevel: 5, bonusValues: [ 19, 620, 4250, 2360 ] },
        { tier: Tiers.Legendary, tierLevel: 1, bonusValues: [ 19, 620, 4260, 2370 ] },
        { tier: Tiers.Legendary, tierLevel: 2, bonusValues: [ 20, 620, 4250, 2360 ] },
        { tier: Tiers.Legendary, tierLevel: 3, bonusValues: [ 19, 620, 4260, 2370 ] },
        { tier: Tiers.Legendary, tierLevel: 4, bonusValues: [ 19, 630, 4250, 2360 ] },
        { tier: Tiers.Legendary, tierLevel: 5, bonusValues: [ 25, 780, 5430, 2950 ] }),
    [HeroGearSlot.ScoutHead]: new HeroGear(HeroGearSlot.ScoutHead,
        [Stats.ExplorerAttack, Stats.ExplorerDefense, Stats.RiderHealth, Stats.RiderLethality],
        { tier: Tiers.Common, tierLevel: 1, bonusValues: [ 19, 30, 3130, 1350 ] },
        { tier: Tiers.Common, tierLevel: 2, bonusValues: [ 9, 13, 2070, 600 ] },
        { tier: Tiers.Common, tierLevel: 3, bonusValues: [ 11, 16, 2580, 900 ] },
        { tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [ 17, 23, 2990, 1250 ] },
        { tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [ 16, 22, 2990, 1200 ] },
        { tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [ 12, 15, 3060, 1200 ] },
        { tier: Tiers.Rare, tierLevel: 1, bonusValues: [ 12, 14, 3110, 1200 ] },
        { tier: Tiers.Rare, tierLevel: 2, bonusValues: [ 47, 38, 3480, 1470 ] },
        { tier: Tiers.Rare, tierLevel: 3, bonusValues: [ 47, 37, 4460, 2130 ] },
        { tier: Tiers.Rare, tierLevel: 4, bonusValues: [ 21, 23, 3620, 2750 ] },
        { tier: Tiers.Epic, tierLevel: 1, bonusValues: [ 21, 23, 3620, 2750 ] },
        { tier: Tiers.Epic, tierLevel: 2, bonusValues: [ 14, 16, 3620, 2750 ] },
        { tier: Tiers.Epic, tierLevel: 3, bonusValues: [ 14, 15, 3740, 2800 ] },
        { tier: Tiers.Epic, tierLevel: 4, bonusValues: [ 15, 16, 3770, 2830 ] },
        { tier: Tiers.Epic, tierLevel: 5, bonusValues: [ 11, 13, 3780, 2840 ] },
        { tier: Tiers.Legendary, tierLevel: 1, bonusValues: [ 12, 12, 3780, 2830 ] },
        { tier: Tiers.Legendary, tierLevel: 2, bonusValues: [ 11, 13, 3780, 2840 ] },
        { tier: Tiers.Legendary, tierLevel: 3, bonusValues: [ 12, 12, 3780, 2830 ] },
        { tier: Tiers.Legendary, tierLevel: 4, bonusValues: [ 11, 13, 3780, 2840 ] },
        { tier: Tiers.Legendary, tierLevel: 5, bonusValues: [ 15, 16, 4870, 3640 ] }),
    [HeroGearSlot.ScoutBody]: new HeroGear(HeroGearSlot.ScoutBody,
        [Stats.ExplorerAttack, Stats.ExplorerHealth, Stats.RiderLethality],
        { tier: Tiers.Common, tierLevel: 1, bonusValues: [ 19, 857, 3810 ] },
        { tier: Tiers.Common, tierLevel: 2, bonusValues: [ 9, 393, 2540 ] },
        { tier: Tiers.Common, tierLevel: 3, bonusValues: [ 11, 480, 3070 ] },
        { tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [ 17, 660, 3640 ] },
        { tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [ 16, 650, 3640 ] },
        { tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [ 12, 430, 3710 ] },
        { tier: Tiers.Rare, tierLevel: 1, bonusValues: [ 12, 430, 3760 ] },
        { tier: Tiers.Rare, tierLevel: 2, bonusValues: [ 47, 1090, 4240 ] },
        { tier: Tiers.Rare, tierLevel: 3, bonusValues: [ 47, 1090, 5140 ] },
        { tier: Tiers.Rare, tierLevel: 4, bonusValues: [ 21, 680, 4660 ] },
        { tier: Tiers.Epic, tierLevel: 1, bonusValues: [ 21, 680, 4660 ] },
        { tier: Tiers.Epic, tierLevel: 2, bonusValues: [ 14, 460, 4650 ] },
        { tier: Tiers.Epic, tierLevel: 3, bonusValues: [ 14, 450, 4630 ] },
        { tier: Tiers.Epic, tierLevel: 4, bonusValues: [ 20, 640, 4720 ] },
        { tier: Tiers.Epic, tierLevel: 5, bonusValues: [ 11, 340, 4730 ] },
        { tier: Tiers.Legendary, tierLevel: 1, bonusValues: [ 10, 340, 4720 ] },
        { tier: Tiers.Legendary, tierLevel: 2, bonusValues: [ 11, 340, 4730 ] },
        { tier: Tiers.Legendary, tierLevel: 3, bonusValues: [ 11, 350, 4720 ] },
        { tier: Tiers.Legendary, tierLevel: 4, bonusValues: [ 10, 340, 4730 ] },
        { tier: Tiers.Legendary, tierLevel: 5, bonusValues: [ 14, 440, 6070 ] }),
    [HeroGearSlot.ScoutFoot]: new HeroGear(HeroGearSlot.ScoutFoot,
        [Stats.ExplorerDefense, Stats.ExplorerHealth, Stats.RiderHealth, Stats.RiderLethality],
        { tier: Tiers.Common, tierLevel: 1, bonusValues: [ 30, 1590, 2930, 900 ] },
        { tier: Tiers.Common, tierLevel: 2, bonusValues: [ 13, 740, 1480, 400 ] },
        { tier: Tiers.Common, tierLevel: 3, bonusValues: [ 16, 880, 2030, 600 ] },
        { tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [ 23, 1240, 2650, 800 ] },
        { tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [ 22, 1190, 2690, 850 ] },
        { tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [ 15, 810, 2670, 810 ] },
        { tier: Tiers.Rare, tierLevel: 1, bonusValues: [ 14, 800, 3250, 790 ] },
        { tier: Tiers.Rare, tierLevel: 2, bonusValues: [ 38, 2030, 3320, 980 ] },
        { tier: Tiers.Rare, tierLevel: 3, bonusValues: [ 37, 2020, 3570, 1320 ] },
        { tier: Tiers.Rare, tierLevel: 4, bonusValues: [ 23, 1260, 5620, 1860 ] },
        { tier: Tiers.Epic, tierLevel: 1, bonusValues: [ 23, 1270, 5630, 1860 ] },
        { tier: Tiers.Epic, tierLevel: 2, bonusValues: [ 16, 840, 5630, 1860 ] },
        { tier: Tiers.Epic, tierLevel: 3, bonusValues: [ 15, 840, 5520, 1870 ] },
        { tier: Tiers.Epic, tierLevel: 4, bonusValues: [ 8, 450, 5670, 1890 ] },
        { tier: Tiers.Epic, tierLevel: 5, bonusValues: [ 14, 750, 5680, 1890 ] },
        { tier: Tiers.Legendary, tierLevel: 1, bonusValues: [ 14, 760, 5680, 1890 ] },
        { tier: Tiers.Legendary, tierLevel: 2, bonusValues: [ 14, 750, 5670, 1890 ] },
        { tier: Tiers.Legendary, tierLevel: 3, bonusValues: [ 14, 760, 5680, 1890 ] },
        { tier: Tiers.Legendary, tierLevel: 4, bonusValues: [ 13, 750, 5670, 1890 ] },
        { tier: Tiers.Legendary, tierLevel: 5, bonusValues: [ 18, 760, 7210, 2430 ] })
} as const;
