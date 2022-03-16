import { Stat } from './stat';

export type Tier = {
    name: TierName;
}

export enum TierName {
    Common    = 'Common',
    Uncommon  = 'Uncommon',
    Rare      = 'Rare',
    Epic      = 'Epic',
    Legendary = 'Legendary'
}

export const Tiers: Record<TierName, Tier> = {
    [TierName.Common]: { name: TierName.Common } as Tier,
    [TierName.Uncommon]: { name: TierName.Uncommon } as Tier,
    [TierName.Rare]: { name: TierName.Rare } as Tier,
    [TierName.Epic]: { name: TierName.Epic } as Tier,
    [TierName.Legendary]: { name: TierName.Legendary } as Tier
} as const;

export enum SourceCategory {
    Research = 'Research',
    Talents = 'Talents',
    ChiefGear = 'Chief Gear',
    ChiefBadges = 'Chief Gear Badges',
    HeroGear = 'Hero Gear',
    VIP = 'VIP',
    Buildings = 'Buildings',
    AllianceLevel = 'Alliance Level',
    AllianceTech = 'Alliance Tech',
    Heroes = 'Heroes',
    ChiefBuffs = 'Chief Buffs',
    StateBuffs = 'State Buffs',
    AnalysisCenters = 'Analysis Centers',
    Skins = 'Skins'
}

export interface SimpleBonusSource {
    name: string;
    tier: Tier;
    category: SourceCategory;
    bonuses: Bonus[];
}

const OrderedTiers: string[] = [TierName.Legendary, TierName.Epic, TierName.Rare, TierName.Uncommon, TierName.Common];
export const sortByTier = (a: any, b: any) => {
    const aIndex = OrderedTiers.findIndex(x => x === String(a));
    const bIndex = OrderedTiers.findIndex(x => x === String(b));
    if (aIndex < 0 || bIndex < 0 || aIndex === bIndex) {
        return 0;
    }
    return aIndex < bIndex ? 1 : -1;
}

export class Bonus {
    readonly stat: Stat;
    readonly value: number;
    readonly source: BonusSource | undefined;

    constructor(stat: Stat, value: number, source?: BonusSource) {
        this.stat = stat;
        this.value = value;
        this.source = source;
    }
}

export const groupBonuses = <T, U>(items: T[], getGroupFn: (item: T) => U): Map<U, T[]> => {
    return items.reduce((map, item) => {
        const group = getGroupFn(item);
        if (group) {
            if (!map.has(group)) {
                map.set(group, []);
            }
            map.get(group).push(item);
        }
        return map;
    }, new Map());
}

export type BonusSourceLevelRange = {
    source: LeveledBonusProvider;
    startLevel: number;
    endLevel: number;
}

export type BonusSource = SimpleBonusSource | BonusSourceLevelRange;

export type LeveledBonusProvider = {
    name: string;
    category: SourceCategory;
    stats: Stat[];
    levels: BonusProviderLevel[];
}

export type BonusProviderLevel = SimpleBonusSource & {
    provider: LeveledBonusProvider;
    name: string;
    level: number;
    tierLevel: TierLevel | null;
    bonusValues: number[];
    bonuses: Bonus[];
}

export type TierLevel = {tier: Tier, level: number};

export function getBonusesFrom(source: LeveledBonusProvider, startLevel: number, endLevel?: number): Bonus[] {
    if (!(source && ('levels' in source) && source.levels)) {
        return [];
    }
    const resolvedEndLevel = (endLevel === undefined ? startLevel : endLevel);
    const levels = source.levels.slice(startLevel - 1, resolvedEndLevel);
    return source.stats.map((stat, index) => {
        const value = levels.reduce((total, level) => {
            return total + level.bonusValues[index];
        }, 0);
        return {stat, value, source: {source, startLevel, endLevel: resolvedEndLevel}};
    });
}

export function aggregateSimpleBonuses<T extends string>(state: Record<T, boolean>, sources: Record<T, SimpleBonusSource>) {
    return Object.keys(state)
        .filter(key => !!state[key as T])
        .map(key => sources[key as T].bonuses)
        .reduce((result, bonuses) => {
            return [...result, ...bonuses];
    }, [] as Bonus[]);
}

export function aggregateBonuses<T extends string>(levels: Partial<Record<T, number>>, sources: Partial<Record<T, LeveledBonusProvider>>): Bonus[] {
    return Object.entries(sources)
            .reduce((result, entry) => {
                const [key, source] = entry as [T, LeveledBonusProvider];
                const level = (key in levels ? levels[key] : 0);
                if (level > 0) {
                    return [...result, ...getBonusesFrom(source, 1, level)];
                }
                return result;
            }, [] as Bonus[]);
}
