import { Stat, Stats } from './stat';
import { Bonus, SourceCategory, Tier, Tiers } from './bonus';
import Registry from './registry';

type TierData = { tier: Tier, levels: number[] }

export const chiefGears: Registry<string, ChiefGear> = new Registry(item => item.name);
export class ChiefGear {
    readonly name: string;
    readonly stats: Stat[];
    readonly levels: ChiefGearLevel[];

    constructor(name: string, stats: Stat[], ...tierData: TierData[]) {
        this.name = name;
        this.stats = stats;
        this.levels = tierData.reduce((levels: ChiefGearLevel[], { tier, levels: levelData }) => {
            const tierLevels = levelData.map((value, j) => new ChiefGearLevel(this, tier, levels.length + j + 1, j + 1, value));
            return levels.concat(tierLevels);
        }, []);
        chiefGears.register(this);
    }
}

export class ChiefGearLevel {
    private static readonly levelNames: string[] = [
        'Rookie', 'Riot',
        'Blast', 'Frontline', 'Sturdy', 'Resistant',
        'Tactical', 'Assault', 'Intrepid', 'Daredevil',
        'Strategic', 'Vanguard', 'Unyielding', 'Dominator'
    ];
    readonly gear: ChiefGear;
    readonly tier: Tier;
    readonly level: number;
    readonly tierLevel: number;
    readonly bonuses: Bonus[];

    constructor(gear: ChiefGear, tier: Tier, level: number, tierLevel: number, bonusValue: number) {
        this.gear = gear;
        this.level = level;
        this.tier = tier;
        this.tierLevel = tierLevel;
        this.bonuses = gear.stats.map((stat, i) => new Bonus(stat, bonusValue, this));
    }

    get name() {
        return ChiefGearLevel.levelNames[this.level - 1] + ' ' + this.gear.name;
    }

    get category() {
        return SourceCategory.ChiefGear;
    }
}

export enum ChiefGearSlot {
    Helmet = 'Helmet',
    Armor = 'Armor',
    Kneepads = 'Kneepads',
    AssaultRifle = 'Assault Rifle',
    Boots = 'Boots',
    Communicator = 'Communicator'
}

export const ChiefGears = {
    [ChiefGearSlot.Helmet as ChiefGearSlot]: new ChiefGear(ChiefGearSlot.Helmet, [Stats.InfantryAttack, Stats.InfantryDefense],
                              {tier: Tiers.Uncommon, levels: [9320,12930]},
                              {tier: Tiers.Rare, levels: [17740,22550,27550,32550]},
                              {tier: Tiers.Epic, levels: [38000,44000,50000,56000]},
                              {tier: Tiers.Legendary, levels: [62500,69000,76000,85850]}),
    [ChiefGearSlot.Armor as ChiefGearSlot]: new ChiefGear(ChiefGearSlot.Armor, [Stats.RiderAttack, Stats.RiderDefense],
                              {tier: Tiers.Uncommon, levels: [9320,12930]},
                              {tier: Tiers.Rare, levels: [17740,22550,27550,32550]},
                              {tier: Tiers.Epic, levels: [38000,44000,50000,56000]},
                              {tier: Tiers.Legendary, levels: [62500,69000,76000,85850]}),
    [ChiefGearSlot.AssaultRifle as ChiefGearSlot]: new ChiefGear(ChiefGearSlot.AssaultRifle, [Stats.RiderAttack, Stats.RiderDefense],
                              {tier: Tiers.Uncommon, levels: [9320,12930]},
                              {tier: Tiers.Rare, levels: [17740,22550,27550,32550]},
                              {tier: Tiers.Epic, levels: [38000,44000,50000,56000]},
                              {tier: Tiers.Legendary, levels: [62500,69000,76000,85850]}),
    [ChiefGearSlot.Kneepads as ChiefGearSlot]: new ChiefGear(ChiefGearSlot.Kneepads, [Stats.HunterAttack, Stats.HunterDefense],
                              {tier: Tiers.Uncommon, levels: [9320,12930]},
                              {tier: Tiers.Rare, levels: [17740,22550,27550,32550]},
                              {tier: Tiers.Epic, levels: [38000,44000,50000,56000]},
                              {tier: Tiers.Legendary, levels: [62500,69000,76000,85850]}),
    [ChiefGearSlot.Boots as ChiefGearSlot]: new ChiefGear(ChiefGearSlot.Boots, [Stats.InfantryAttack, Stats.InfantryDefense],
                              {tier: Tiers.Uncommon, levels: [9320,12930]},
                              {tier: Tiers.Rare, levels: [17740,22550,27550,32550]},
                              {tier: Tiers.Epic, levels: [38000,44000,50000,56000]},
                              {tier: Tiers.Legendary, levels: [62500,69000,76000,85850]}),
    [ChiefGearSlot.Communicator as ChiefGearSlot]: new ChiefGear(ChiefGearSlot.Communicator, [Stats.HunterAttack, Stats.HunterDefense],
                              {tier: Tiers.Uncommon, levels: [9320,12930]},
                              {tier: Tiers.Rare, levels: [17740,22550,27550,32550]},
                              {tier: Tiers.Epic, levels: [38000,44000,50000,56000]},
                              {tier: Tiers.Legendary, levels: [62500,69000,76000,85850]})
} as const;

export const getChiefGear = (name: string): ChiefGear | null => {
    return chiefGears.getById(name);
};
