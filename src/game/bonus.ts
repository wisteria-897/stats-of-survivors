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

export interface BonusSource {
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

const groupBy = <T, U>(items: T[], getGroupFn: (item: T) => U): Map<U, T[]> => {
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


export type BonusGroupKey = BonusSource | {name: string} | string;
export type BonusGroupValue = {key: BonusGroupKey, total: number, items: BonusGroup<any> | null};
export type BonusGroup<TKey extends BonusGroupKey> = Map<TKey, BonusGroupValue>;
type GetSubGroupFunction = (bonuses: Bonus[]) => BonusGroup<any>;
export const groupBonuses = <TKey extends BonusGroupKey>(bonuses: Bonus[], getKey: (bonus: Bonus) => TKey,
                             getSubGroups: GetSubGroupFunction | null=null): BonusGroup<TKey> => {
    const bonusMap: Map<TKey, {key: BonusGroupKey, total: number, bonuses: Bonus[]}> = new Map();
    bonuses.forEach(b => {
        const key = getKey(b);
        const item = bonusMap.get(key) || {key: key, total: 0, bonuses: []};
        item.total += b.value;
        item.bonuses.push(b);
        bonusMap.set(key, item);
    });

    const bonusGroup: BonusGroup<TKey> = new Map();
    for (const [key, item] of bonusMap) {
        const value: BonusGroupValue = {key, total: item.total, items: null};
        if (getSubGroups) {
            value.items = getSubGroups(item.bonuses);
        }
        bonusGroup.set(key, value);
    }

    return bonusGroup;
}
