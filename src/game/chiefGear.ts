import { TypeSafe } from '../util/itertools';
import { enumMapOf } from '../util/types';
import {
    sortByTier,
    Bonus,
    LeveledBonusProviderImpl,
    LevelData,
    SimpleBonusSource,
    SourceCategory,
    StatBonusProviderLevelImpl,
    Tier,
    TierName,
    Tiers
} from './bonus';
import { Stat, Stats } from './stat';
import { Requirement } from './requirements';
import { Chief } from '../features/chief/chiefSlice';

type TierData = { tier: Tier, levels: number[] }

type TierLevelData = LevelData<Chief> & {
    tier: Tier,
    tierLevel: number
}

export class ChiefGear extends LeveledBonusProviderImpl<
    Chief,
    ChiefGearSlot,
    ChiefGearLevel,
    TierLevelData
> {
    constructor(slot: ChiefGearSlot, stats: Stat[], ...tierData: TierData[]) {
        const levelData: TierLevelData[] = tierData.flatMap(td => {
            return td.levels.map((bonusValue, i) => {
                return {
                    tier: td.tier,
                    tierLevel: i + 1,
                    bonusValues: stats.map(_ => bonusValue)
                };
            });
        });
        super(slot, stats, levelData);
    }

    createLevel(provider: ChiefGear, level: number, stats: Stat[], levelData: TierLevelData) {
        return new ChiefGearLevel(this, level, levelData.tier, levelData.tierLevel, stats, levelData.bonusValues, levelData.requirements || undefined);
    }

    get category() {
        return SourceCategory.ChiefGear;
    }
}

const LevelNames: string[] = [
    'Rookie', 'Riot',
    'Blast', 'Frontline', 'Sturdy', 'Resistant',
    'Tactical', 'Assault', 'Intrepid', 'Daredevil',
    'Strategic', 'Vanguard', 'Unyielding', 'Dominator'
];
export class ChiefGearLevel extends StatBonusProviderLevelImpl<Chief, ChiefGear> {
    constructor(gear: ChiefGear, level: number, tier: Tier, tierLevel: number, stats: Stat[], bonusValues: number[], requirements?: Requirement<Chief>) {
        super(gear, level, stats, bonusValues, requirements, tier);
        this.tierLevel = {tier, level: tierLevel};
    }

    selectLevels(chief: Chief) {
        return chief.chiefGear;
    }

    get name() {
        return LevelNames[this.level - 1] + ' ' + this.provider.name;
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
            tierCounts[Tiers.Uncommon.name] += 1;
            bonusLevelCounts[4] += 1;
            if (level > 1) {
                bonusLevelCounts[3] += 1;
                if (level > 2) {
                    tierCounts[Tiers.Rare.name] += 1;
                    bonusLevelCounts[2] += 1;
                    if (level > 3) {
                        bonusLevelCounts[1] += 1;
                        if (level > 6) {
                            tierCounts[Tiers.Epic.name] += 1;
                            bonusLevelCounts[0] += 1;
                            if (level > 10) {
                                tierCounts[Tiers.Legendary.name] += 1;
                            }
                        }
                    }
                }
            }
        }
    });

    const setBonuses = [];
    const threePieceLevel = bonusLevelCounts.findIndex(count => count >= 3);
    const orderedTierCounts = TypeSafe.entries(tierCounts).sort((a, b) => -sortByTier(a[0], b[0]));
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
