import { TypeSafe } from '../util/itertools';
import { enumMapOf } from '../util/types';
import { Stat, Stats } from './stat';
import { sortByTier, Bonus, SimpleBonusSource, SourceCategory, Tier, TierName, Tiers } from './bonus';

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

const SetBonusValues = [6230,5010,3940,2870,2070]
export function getSetBonuses(chiefGear: Record<ChiefGearSlot, number>): Bonus[] {
    const bonusLevelCounts = [0,0,0,0,0];
    const tierCounts = enumMapOf(Tiers, 0);
    TypeSafe.entries(chiefGear).forEach(([slot, level]) => {
        if (level > 0) {
            const gear = ChiefGears[slot].levels[level - 1];
            tierCounts[gear.tier.name] += 1;
            switch (gear.tier) {
                //@ts-ignore
                case Tiers.Legendary:
                    tierCounts[TierName.Legendary] += 1;
                //@ts-ignore
                case Tiers.Epic:
                    bonusLevelCounts[0] += 1;
                    tierCounts[TierName.Epic] += 1;
                //@ts-ignore
                case Tiers.Rare:
                    tierCounts[TierName.Rare] += 1;
                    if (gear.tier !== Tiers.Rare || gear.tierLevel.level >= 2) {
                        bonusLevelCounts[1] += 1;
                    }
                    bonusLevelCounts[2] += 1;
                case Tiers.Uncommon:
                    tierCounts[TierName.Uncommon] += 1;
                    if (gear.tier !== Tiers.Uncommon || gear.tierLevel.level >= 2) {
                        bonusLevelCounts[3] += 1;
                    }
                    bonusLevelCounts[4] += 1;
            }
        }
    });

    const setBonuses = [];
    const threePieceLevel = bonusLevelCounts.findIndex(count => count >= 3);
    const orderedTierCounts = TypeSafe.entries(tierCounts).sort((a, b) => sortByTier(a[0], b[0]));
    if (threePieceLevel >= 0) {
        const sourceTierEntry = orderedTierCounts.find(entry => entry[1] > 3) as [TierName, number];
        const source: SimpleBonusSource = {
            name: 'Three Piece Set Bonus',
            tier: Tiers[sourceTierEntry[0]],
            category: SourceCategory.ChiefGear,
            bonuses: []
        };
        source.bonuses.push(
            new Bonus(Stats.InfantryAttack, SetBonusValues[threePieceLevel], source),
            new Bonus(Stats.RiderAttack, SetBonusValues[threePieceLevel], source),
            new Bonus(Stats.HunterAttack, SetBonusValues[threePieceLevel], source)
        );

        setBonuses.push(...source.bonuses);
    }

    const sixPieceLevel = bonusLevelCounts.findIndex(count => count >= 6);
    if (sixPieceLevel >= 0) {
        const sourceTierEntry = orderedTierCounts.find(entry => entry[1] >= 6) as [TierName, number];
        const source: SimpleBonusSource = {
            name: 'Six Piece Set Bonus',
            tier: Tiers[sourceTierEntry[0]],
            category: SourceCategory.ChiefGear,
            bonuses: []
        };
        source.bonuses.push(
            new Bonus(Stats.InfantryDefense, SetBonusValues[sixPieceLevel], source),
            new Bonus(Stats.RiderDefense, SetBonusValues[sixPieceLevel], source),
            new Bonus(Stats.HunterDefense, SetBonusValues[sixPieceLevel], source)
        );
        setBonuses.push(...source.bonuses);
    }

    return setBonuses;
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
