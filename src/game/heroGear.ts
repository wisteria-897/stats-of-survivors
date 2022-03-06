import { Tiers, Bonus } from './bonus';
import { SourceCategory, Tier } from './bonus';
import { Stat, Stats } from './stat';
import Registry from './registry';

export enum HeroType {
    Brawler = 'Brawler',
    Scout = 'Scout',
    Marksman = 'Marksman'
}

const slotRegistry: Registry<string, HeroGearSlot> = new Registry(item => item.slot);
type SlotName = 'Head' | 'Body' | 'Foot';
class HeroGearSlot {
    readonly slot: SlotName;
    readonly brawlerName: string;
    readonly scoutName: string;
    readonly marksmanName: string;

    constructor(slot: SlotName, brawlerName: string, scoutName: string, marksmanName: string) {
        this.slot = slot;
        this.brawlerName = brawlerName;
        this.scoutName = scoutName;
        this.marksmanName = marksmanName;
        slotRegistry.register(this);
    }

    getName(heroType: HeroType): string {
        switch (heroType) {
            case HeroType.Brawler:
                return this.brawlerName;
            case HeroType.Scout:
                return this.scoutName;
        }

        return this.marksmanName;
    }
}

const slots = {
    Head: new HeroGearSlot("Head", "Goggles", "Scope", "Night-vision Goggles"),
    Body: new HeroGearSlot("Body", "Protective Clothing", "Camouflage", "Top"),
    Foot: new HeroGearSlot("Foot", "Boots", "Boots", "Slippers"),
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

const gearRegistry: Registry<string, HeroGear> = new Registry(item => item.heroType + '/' + item.slot.slot);
export class HeroGear {
    readonly heroType: HeroType;
    readonly slot: HeroGearSlot;
    readonly stats: Stat[];
    readonly levels: HeroGearLevel[];

    constructor(heroType: HeroType, slot: HeroGearSlot, stats: Stat[], ...levelData: LevelData[]) {
        this.heroType = heroType;
        this.slot = slot;
        this.stats = stats;
        this.levels = levelData.map(({tier, tierLevel, bonusValues}, i) => {
            return new HeroGearLevel(this, i + 1, tier, tierLevel, ...bonusValues);
        });
        gearRegistry.register(this);
    }

    get name() {
        return this.slot.getName(this.heroType);
    }
}

export class HeroGearLevel {
    readonly gear: HeroGear;
    readonly tier: Tier;
    readonly level: number;
    readonly tierLevel: number;
    readonly bonuses: Bonus[];

    constructor(gear: HeroGear, level: number, tier: Tier, tierLevel: number, ...bonusValues: number[]) {
        this.gear = gear;
        this.level = level;
        this.tier = tier;
        this.tierLevel = tierLevel;
        this.bonuses = gear.stats.map((stat, i) => new Bonus(stat, bonusValues[i], this));
    }

    get name() {
        return tierNames[this.gear.heroType][this.tier.name] + ' ' + this.gear.name + ' ' + "⭐️".repeat(this.tierLevel);
    }

    get category() {
        return SourceCategory.HeroGear;
    }
}

export const HeroGears = {
    BrawlerHead: new HeroGear(HeroType.Brawler, slots.Head,
        [Stats.ExplorerAttack, Stats.ExplorerDefense, Stats.InfantryHealth, Stats.InfantryLethality],
        {tier: Tiers.Common, tierLevel: 1, bonusValues: [23,35,1350,3050]},
        {tier: Tiers.Common, tierLevel: 2, bonusValues: [35,52,1950,5040]},
        {tier: Tiers.Common, tierLevel: 3, bonusValues: [49,71,2850,7550]},
        {tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [69,98,4100,1046]},
        {tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [90,125,5300,13370]},
        {tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [105,143,6500,16340]},
        {tier: Tiers.Rare, tierLevel: 1, bonusValues: [120,160,7700,19360]},
        {tier: Tiers.Rare, tierLevel: 2, bonusValues: [179,205,9170,22750]},
        {tier: Tiers.Rare, tierLevel: 3, bonusValues: [237,249,11300,26920]},
        {tier: Tiers.Rare, tierLevel: 4, bonusValues: [263,277,14050,30620]},
        {tier: Tiers.Epic, tierLevel: 1, bonusValues: [290,304,16800,34320]},
        {tier: Tiers.Epic, tierLevel: 2, bonusValues: [307,323,19550,38020]},
        {tier: Tiers.Epic, tierLevel: 3, bonusValues: [325,341,22350,41720]},
        {tier: Tiers.Epic, tierLevel: 4, bonusValues: [343,360,25180,45500]},
        {tier: Tiers.Epic, tierLevel: 5, bonusValues: [358,375,28020,49280]},
        {tier: Tiers.Legendary, tierLevel: 1, bonusValues: [372,390,30850,53060]},
        {tier: Tiers.Legendary, tierLevel: 2, bonusValues: [387,405,33690,56840]},
        {tier: Tiers.Legendary, tierLevel: 3, bonusValues: [401,421,36520,60620]},
        {tier: Tiers.Legendary, tierLevel: 4, bonusValues: [415,436,39360,64400]},
        {tier: Tiers.Legendary, tierLevel: 5, bonusValues: [434,455,43000,69220]}),
    BrawlerBody: new HeroGear(HeroType.Brawler, slots.Body,
        [Stats.ExplorerAttack, Stats.ExplorerHealth, Stats.InfantryHealth],
        {tier: Tiers.Common, tierLevel: 1, bonusValues: [23,944,3610]},
        {tier: Tiers.Common, tierLevel: 2, bonusValues: [35,1380,6000]},
        {tier: Tiers.Common, tierLevel: 3, bonusValues: [49,1900,8920]},
        {tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [69,2640,12360]},
        {tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [90,3350,15850]},
        {tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [105,3820,19360]},
        {tier: Tiers.Rare, tierLevel: 1, bonusValues: [120,4300,22870]},
        {tier: Tiers.Rare, tierLevel: 2, bonusValues: [179,5500,26870]},
        {tier: Tiers.Rare, tierLevel: 3, bonusValues: [237,6700,31650]},
        {tier: Tiers.Rare, tierLevel: 4, bonusValues: [263,7450,35830]},
        {tier: Tiers.Epic, tierLevel: 1, bonusValues: [290,8200,40020]},
        {tier: Tiers.Epic, tierLevel: 2, bonusValues: [307,8700,44200]},
        {tier: Tiers.Epic, tierLevel: 3, bonusValues: [325,9200,48450]},
        {tier: Tiers.Epic, tierLevel: 4, bonusValues: [352,9950,52710]},
        {tier: Tiers.Epic, tierLevel: 5, bonusValues: [365,10320,56960]},
        {tier: Tiers.Legendary, tierLevel: 1, bonusValues: [378,10690,61220]},
        {tier: Tiers.Legendary, tierLevel: 2, bonusValues: [391,11060,65470]},
        {tier: Tiers.Legendary, tierLevel: 3, bonusValues: [404,11430,69730]},
        {tier: Tiers.Legendary, tierLevel: 4, bonusValues: [417,11810,73980]},
        {tier: Tiers.Legendary, tierLevel: 5, bonusValues: [434,12280,79410]}),
    BrawlerFoot: new HeroGear(HeroType.Brawler, slots.Foot,
        [Stats.ExplorerDefense, Stats.ExplorerHealth, Stats.InfantryHealth, Stats.InfantryLethality],
        {tier: Tiers.Common, tierLevel: 1, bonusValues: [24,2200,1150,3010]},
        {tier: Tiers.Common, tierLevel: 2, bonusValues: [35,3220,1650,4560]},
        {tier: Tiers.Common, tierLevel: 3, bonusValues: [48,4440,2400,6670]},
        {tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [66,6160,3400,9400]},
        {tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [83,7810,4400,12180]},
        {tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [95,8930,5400,14930]},
        {tier: Tiers.Rare, tierLevel: 1, bonusValues: [107,10050,6450,17860]},
        {tier: Tiers.Rare, tierLevel: 2, bonusValues: [137,12850,7680,21200]},
        {tier: Tiers.Rare, tierLevel: 3, bonusValues: [166,15650,9300,25980]},
        {tier: Tiers.Rare, tierLevel: 4, bonusValues: [185,17400,11620,31380]},
        {tier: Tiers.Epic, tierLevel: 1, bonusValues: [203,19150,13950,36780]},
        {tier: Tiers.Epic, tierLevel: 2, bonusValues: [216,20310,16270,42180]},
        {tier: Tiers.Epic, tierLevel: 3, bonusValues: [228,21480,18650,47730]},
        {tier: Tiers.Epic, tierLevel: 4, bonusValues: [235,22140,21020,53410]},
        {tier: Tiers.Epic, tierLevel: 5, bonusValues: [246,23180,23380,59080]},
        {tier: Tiers.Legendary, tierLevel: 1, bonusValues: [257,24220,25750,64760]},
        {tier: Tiers.Legendary, tierLevel: 2, bonusValues: [268,25260,28110,70430]},
        {tier: Tiers.Legendary, tierLevel: 3, bonusValues: [279,26300,30480,76110]},
        {tier: Tiers.Legendary, tierLevel: 4, bonusValues: [290,27340,32840,81780]},
        {tier: Tiers.Legendary, tierLevel: 5, bonusValues: [304,28650,35840,88930]}),
    MarksmanHead: new HeroGear(HeroType.Marksman, slots.Head,
        [Stats.ExplorerAttack, Stats.ExplorerDefense, Stats.HunterHealth, Stats.HunterLethality],
        {tier: Tiers.Common, tierLevel: 1, bonusValues: [46,15,3130,850]},
        {tier: Tiers.Common, tierLevel: 2, bonusValues: [69,22,4820,1250]},
        {tier: Tiers.Common, tierLevel: 3, bonusValues: [97,30,7100,1800]},
        {tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [138,41,1000,2600]},
        {tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [180,52,12860,3400]},
        {tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [210,60,15740,4170]},
        {tier: Tiers.Rare, tierLevel: 1, bonusValues: [239,67,18680,4960]},
        {tier: Tiers.Rare, tierLevel: 2, bonusValues: [357,86,22090,5910]},
        {tier: Tiers.Rare, tierLevel: 3, bonusValues: [474,104,26460,7190]},
        {tier: Tiers.Rare, tierLevel: 4, bonusValues: [527,116,31580,8920]},
        {tier: Tiers.Epic, tierLevel: 1, bonusValues: [580,127,36700,10650]},
        {tier: Tiers.Epic, tierLevel: 2, bonusValues: [615,135,41820,12380]},
        {tier: Tiers.Epic, tierLevel: 3, bonusValues: [650,143,46960,14150]},
        {tier: Tiers.Epic, tierLevel: 4, bonusValues: [676,149,52160,15940]},
        {tier: Tiers.Epic, tierLevel: 5, bonusValues: [706,155,57360,17740]},
        {tier: Tiers.Legendary, tierLevel: 1, bonusValues: [737,162,62560,19530]},
        {tier: Tiers.Legendary, tierLevel: 2, bonusValues: [767,168,67760,21330]},
        {tier: Tiers.Legendary, tierLevel: 3, bonusValues: [798,175,72960,23120]},
        {tier: Tiers.Legendary, tierLevel: 4, bonusValues: [828,182,78160,24920]},
        {tier: Tiers.Legendary, tierLevel: 5, bonusValues: [867,190,84800,27200]}),
    MarksmanBody: new HeroGear(HeroType.Marksman, slots.Body,
        [Stats.ExplorerAttack, Stats.ExplorerHealth, Stats.HunterLethality],
        {tier: Tiers.Common, tierLevel: 1, bonusValues: [46,350,4110]},
        {tier: Tiers.Common, tierLevel: 2, bonusValues: [69,513,6700]},
        {tier: Tiers.Common, tierLevel: 3, bonusValues: [97,707,9970]},
        {tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [138,980,13860]},
        {tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [180,1240,17800]},
        {tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [210,1410,21760]},
        {tier: Tiers.Rare, tierLevel: 1, bonusValues: [239,1590,26070]},
        {tier: Tiers.Rare, tierLevel: 2, bonusValues: [357,2040,30680]},
        {tier: Tiers.Rare, tierLevel: 3, bonusValues: [474,2480,35750]},
        {tier: Tiers.Rare, tierLevel: 4, bonusValues: [527,2760,41000]},
        {tier: Tiers.Epic, tierLevel: 1, bonusValues: [580,3040,46250]},
        {tier: Tiers.Epic, tierLevel: 2, bonusValues: [615,3220,51500]},
        {tier: Tiers.Epic, tierLevel: 3, bonusValues: [650,3410,56650]},
        {tier: Tiers.Epic, tierLevel: 4, bonusValues: [697,3650,61950]},
        {tier: Tiers.Epic, tierLevel: 5, bonusValues: [724,3790,67240]},
        {tier: Tiers.Legendary, tierLevel: 1, bonusValues: [751,3940,72540]},
        {tier: Tiers.Legendary, tierLevel: 2, bonusValues: [778,4080,77830]},
        {tier: Tiers.Legendary, tierLevel: 3, bonusValues: [806,4220,83130]},
        {tier: Tiers.Legendary, tierLevel: 4, bonusValues: [833,4370,88420]},
        {tier: Tiers.Legendary, tierLevel: 5, bonusValues: [867,4540,95070]}),
    MarksmanFoot: new HeroGear(HeroType.Marksman, slots.Foot,
        [Stats.ExplorerDefense, Stats.ExplorerHealth, Stats.HunterHealth, Stats.HunterLethality],
        {tier: Tiers.Common, tierLevel: 1, bonusValues: [44,1390,2990,1150]},
        {tier: Tiers.Common, tierLevel: 2, bonusValues: [65,2050,4780,1650]},
        {tier: Tiers.Common, tierLevel: 3, bonusValues: [89,2820,7070,2400]},
        {tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [123,3910,9850,3400]},
        {tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [156,4960,12640,4400]},
        {tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [178,5670,15470,5400]},
        {tier: Tiers.Rare, tierLevel: 1, bonusValues: [200,6380,18340,6450]},
        {tier: Tiers.Rare, tierLevel: 2, bonusValues: [256,8160,21620,7680]},
        {tier: Tiers.Rare, tierLevel: 3, bonusValues: [311,9940,25690,9400]},
        {tier: Tiers.Rare, tierLevel: 4, bonusValues: [346,11050,29870,11700]},
        {tier: Tiers.Epic, tierLevel: 1, bonusValues: [381,12150,34060,14000]},
        {tier: Tiers.Epic, tierLevel: 2, bonusValues: [404,12890,38240,16300]},
        {tier: Tiers.Epic, tierLevel: 3, bonusValues: [427,13630,42490,18650]},
        {tier: Tiers.Epic, tierLevel: 4, bonusValues: [448,14300,46750,21020]},
        {tier: Tiers.Epic, tierLevel: 5, bonusValues: [467,14920,51000,23380]},
        {tier: Tiers.Legendary, tierLevel: 1, bonusValues: [486,15540,55260,25750]},
        {tier: Tiers.Legendary, tierLevel: 2, bonusValues: [506,16160,59510,28110]},
        {tier: Tiers.Legendary, tierLevel: 3, bonusValues: [525,16780,63770,30480]},
        {tier: Tiers.Legendary, tierLevel: 4, bonusValues: [544,17410,68020,32840]},
        {tier: Tiers.Legendary, tierLevel: 5, bonusValues: [569,18190,73450,35790]}),
    ScoutHead: new HeroGear(HeroType.Scout, slots.Head,
        [Stats.ExplorerAttack, Stats.ExplorerDefense, Stats.RiderHealth, Stats.RiderLethality],
        {tier: Tiers.Common, tierLevel: 1, bonusValues: [19,30,3130,1350]},
        {tier: Tiers.Common, tierLevel: 2, bonusValues: [28,43,5200,1950]},
        {tier: Tiers.Common, tierLevel: 3, bonusValues: [39,59,7780,2850]},
        {tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [56,82,10770,4100]},
        {tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [72,104,13760,5300]},
        {tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [84,119,16820,6500]},
        {tier: Tiers.Rare, tierLevel: 1, bonusValues: [96,133,19930,7700]},
        {tier: Tiers.Rare, tierLevel: 2, bonusValues: [143,171,23410,9170]},
        {tier: Tiers.Rare, tierLevel: 3, bonusValues: [190,208,27870,11300]},
        {tier: Tiers.Rare, tierLevel: 4, bonusValues: [211,231,31490,14050]},
        {tier: Tiers.Epic, tierLevel: 1, bonusValues: [232,254,35110,16800]},
        {tier: Tiers.Epic, tierLevel: 2, bonusValues: [246,270,38730,19550]},
        {tier: Tiers.Epic, tierLevel: 3, bonusValues: [260,285,42470,22350]},
        {tier: Tiers.Epic, tierLevel: 4, bonusValues: [275,301,46240,25180]},
        {tier: Tiers.Epic, tierLevel: 5, bonusValues: [286,314,50020,28020]},
        {tier: Tiers.Legendary, tierLevel: 1, bonusValues: [298,326,53800,30850]},
        {tier: Tiers.Legendary, tierLevel: 2, bonusValues: [309,339,57580,33690]},
        {tier: Tiers.Legendary, tierLevel: 3, bonusValues: [321,351,61360,36520]},
        {tier: Tiers.Legendary, tierLevel: 4, bonusValues: [332,364,65140,39360]},
        {tier: Tiers.Legendary, tierLevel: 5, bonusValues: [347,380,70010,43000]}),
    ScoutBody: new HeroGear(HeroType.Scout, slots.Body,
        [Stats.ExplorerAttack, Stats.ExplorerHealth, Stats.RiderLethality],
        {tier: Tiers.Common, tierLevel: 1, bonusValues: [19,857,3810]},
        {tier: Tiers.Common, tierLevel: 2, bonusValues: [28,1250,6350]},
        {tier: Tiers.Common, tierLevel: 3, bonusValues: [39,1730,9420]},
        {tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [56,2390,13060]},
        {tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [72,3040,16700]},
        {tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [84,3470,20410]},
        {tier: Tiers.Rare, tierLevel: 1, bonusValues: [96,3900,24170]},
        {tier: Tiers.Rare, tierLevel: 2, bonusValues: [143,4990,28410]},
        {tier: Tiers.Rare, tierLevel: 3, bonusValues: [190,6080,33550]},
        {tier: Tiers.Rare, tierLevel: 4, bonusValues: [211,6760,38210]},
        {tier: Tiers.Epic, tierLevel: 1, bonusValues: [232,7440,42870]},
        {tier: Tiers.Epic, tierLevel: 2, bonusValues: [246,7900,47520]},
        {tier: Tiers.Epic, tierLevel: 3, bonusValues: [260,8350,52150]},
        {tier: Tiers.Epic, tierLevel: 4, bonusValues: [280,8990,56870]},
        {tier: Tiers.Epic, tierLevel: 5, bonusValues: [291,9330,61600]},
        {tier: Tiers.Legendary, tierLevel: 1, bonusValues: [301,9670,66320]},
        {tier: Tiers.Legendary, tierLevel: 2, bonusValues: [312,10010,71050]},
        {tier: Tiers.Legendary, tierLevel: 3, bonusValues: [323,10360,75770]},
        {tier: Tiers.Legendary, tierLevel: 4, bonusValues: [333,10700,80500]},
        {tier: Tiers.Legendary, tierLevel: 5, bonusValues: [347,11140,86570]}),
    ScoutFoot: new HeroGear(HeroType.Scout, slots.Foot,
        [Stats.ExplorerDefense, Stats.ExplorerHealth, Stats.RiderHealth, Stats.RiderLethality],
        {tier: Tiers.Common, tierLevel: 1, bonusValues: [30,1590,29300,900]},
        {tier: Tiers.Common, tierLevel: 2, bonusValues: [43,2330,4410,1300]},
        {tier: Tiers.Common, tierLevel: 3, bonusValues: [59,3210,6440,1900]},
        {tier: Tiers.Uncommon, tierLevel: 1, bonusValues: [82,4450,9090,2700]},
        {tier: Tiers.Uncommon, tierLevel: 2, bonusValues: [104,5640,11780,3550]},
        {tier: Tiers.Uncommon, tierLevel: 3, bonusValues: [119,6450,14450,4360]},
        {tier: Tiers.Rare, tierLevel: 1, bonusValues: [133,7250,17700,5150]},
        {tier: Tiers.Rare, tierLevel: 2, bonusValues: [171,9280,21020,6130]},
        {tier: Tiers.Rare, tierLevel: 3, bonusValues: [208,11300,24590,7450]},
        {tier: Tiers.Rare, tierLevel: 4, bonusValues: [231,12560,30210,9310]},
        {tier: Tiers.Epic, tierLevel: 1, bonusValues: [254,13830,35840,11170]},
        {tier: Tiers.Epic, tierLevel: 2, bonusValues: [270,14670,41470,13030]},
        {tier: Tiers.Epic, tierLevel: 3, bonusValues: [285,15510,46990,14900]},
        {tier: Tiers.Epic, tierLevel: 4, bonusValues: [293,15960,52660,16790]},
        {tier: Tiers.Epic, tierLevel: 5, bonusValues: [307,16710,58340,18680]},
        {tier: Tiers.Legendary, tierLevel: 1, bonusValues: [301,9670,66320]},
        {tier: Tiers.Legendary, tierLevel: 2, bonusValues: [301,9670,66320]},
        {tier: Tiers.Legendary, tierLevel: 3, bonusValues: [301,9670,66320]},
        {tier: Tiers.Legendary, tierLevel: 4, bonusValues: [301,9670,66320]},
        {tier: Tiers.Legendary, tierLevel: 5, bonusValues: []}),
} as const;
