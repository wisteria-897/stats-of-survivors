import { Stat, Stats } from './stat';
import { Bonus, SourceCategory, Tier, Tiers } from './bonus';

type TierData = { tier: Tier, levels: number[] }

export class ChiefGear {
    readonly slot: ChiefGearSlot;
    readonly stats: Stat[];
    readonly levels: ChiefGearLevel[];

    constructor(slot: ChiefGearSlot, stats: Stat[], ...tierData: TierData[]) {
        this.slot = slot;
        this.stats = stats;
        this.levels = tierData.reduce((levels: ChiefGearLevel[], { tier, levels: levelData }) => {
            const tierLevels = levelData.map((value, j) => new ChiefGearLevel(this, tier, levels.length + j + 1, j + 1, value));
            return levels.concat(tierLevels);
        }, []);
    }

    get name() {
        return this.slot;
    }

    get category() {
        return SourceCategory.ChiefGear;
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
    readonly tierLevel: {tier: Tier, level: number};
    readonly bonuses: Bonus[];

    constructor(gear: ChiefGear, tier: Tier, level: number, tierLevel: number, bonusValue: number) {
        this.gear = gear;
        this.level = level;
        this.tier = tier;
        this.tierLevel = {tier, level: tierLevel};
        this.bonuses = gear.stats.map((stat, i) => new Bonus(stat, bonusValue, this));
    }

    get name() {
        return ChiefGearLevel.levelNames[this.level - 1] + ' ' + this.gear.name;
    }

    get category() {
        return SourceCategory.ChiefGear;
    }

    get bonusValues() {
        return this.bonuses.map(b => b.value);
    }

    get provider() {
        return this.gear;
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
    [ChiefGearSlot.Helmet]: new ChiefGear(ChiefGearSlot.Helmet, [Stats.InfantryAttack, Stats.InfantryDefense],
                              {tier: Tiers.Uncommon, levels: [9320,3610]},
                              {tier: Tiers.Rare, levels: [4810,4810,5000,5000]},
                              {tier: Tiers.Epic, levels: [5450,6000,6000,6000]},
                              {tier: Tiers.Legendary, levels: [6500,6500,7000,9850]}),
    [ChiefGearSlot.Armor]: new ChiefGear(ChiefGearSlot.Armor, [Stats.RiderAttack, Stats.RiderDefense],
                              {tier: Tiers.Uncommon, levels: [9320,3610]},
                              {tier: Tiers.Rare, levels: [4810,4810,5000,5000]},
                              {tier: Tiers.Epic, levels: [5450,6000,6000,6000]},
                              {tier: Tiers.Legendary, levels: [6500,6500,7000,9850]}),
    [ChiefGearSlot.AssaultRifle]: new ChiefGear(ChiefGearSlot.AssaultRifle, [Stats.RiderAttack, Stats.RiderDefense],
                              {tier: Tiers.Uncommon, levels: [9320,3610]},
                              {tier: Tiers.Rare, levels: [4810,4810,5000,5000]},
                              {tier: Tiers.Epic, levels: [5450,6000,6000,6000]},
                              {tier: Tiers.Legendary, levels: [6500,6500,7000,9850]}),
    [ChiefGearSlot.Kneepads]: new ChiefGear(ChiefGearSlot.Kneepads, [Stats.HunterAttack, Stats.HunterDefense],
                              {tier: Tiers.Uncommon, levels: [9320,3610]},
                              {tier: Tiers.Rare, levels: [4810,4810,5000,5000]},
                              {tier: Tiers.Epic, levels: [5450,6000,6000,6000]},
                              {tier: Tiers.Legendary, levels: [6500,6500,7000,9850]}),
    [ChiefGearSlot.Boots]: new ChiefGear(ChiefGearSlot.Boots, [Stats.InfantryAttack, Stats.InfantryDefense],
                              {tier: Tiers.Uncommon, levels: [9320,3610]},
                              {tier: Tiers.Rare, levels: [4810,4810,5000,5000]},
                              {tier: Tiers.Epic, levels: [5450,6000,6000,6000]},
                              {tier: Tiers.Legendary, levels: [6500,6500,7000,9850]}),
    [ChiefGearSlot.Communicator]: new ChiefGear(ChiefGearSlot.Communicator, [Stats.HunterAttack, Stats.HunterDefense],
                              {tier: Tiers.Uncommon, levels: [9320,3610]},
                              {tier: Tiers.Rare, levels: [4810,4810,5000,5000]},
                              {tier: Tiers.Epic, levels: [5450,6000,6000,6000]},
                              {tier: Tiers.Legendary, levels: [6500,6500,7000,9850]})
} as const;
