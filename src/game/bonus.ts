import { Stat } from './stat';

export interface Tier {
    name: string;
}

export const Tiers: { [key: string]: Tier } = {
    Common: { name: 'Common' } as Tier,
    Uncommon: { name: 'Uncommon' } as Tier,
    Rare: { name: 'Rare' } as Tier,
    Epic: { name: 'Epic' } as Tier,
    Legendary: { name: 'Legendary' } as Tier
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
    Heros = 'Heros',
    ChiefBuffs = 'Chief Buffs',
    StateBuffs = 'State Buffs'
}

export interface SimpleBonusSource {
    name: string;
    tier: Tier;
    category: SourceCategory;
    bonuses: Bonus[];
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

export type BonusProviderLevel = {
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
    const bonuses = [];
    const resolvedEndLevel = (endLevel === undefined ? startLevel : endLevel);
    const levels = source.levels.slice(startLevel - 1, resolvedEndLevel);
    return source.stats.map((stat, index) => {
        const value = levels.reduce((total, level) => {
            return total + level.bonusValues[index];
        }, 0);
        return {stat, value, source: {source, startLevel, endLevel: resolvedEndLevel}};
    });
}

export function aggregateBonuses<T extends string>(levels: {[key in T]: number}, sources: {[key in T]: LeveledBonusProvider}): Bonus[] {
    return Object.entries(levels)
            .filter(entry => {
                const [k, v] = entry as [T, number];
                return v > 0;
            })
            .reduce((result, entry) => {
                const [name, level] = entry as [T, number];
                return [...result, ...getBonusesFrom(sources[name], 1, level)];
            }, [] as Bonus[]);
}
