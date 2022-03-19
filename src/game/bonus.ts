import { Stat } from './stat';
import { chainable, TypeSafe } from '../util/itertools';
import { allOf, hasBonusLevel, noOp, Requirement } from './requirements';

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
    Skins = 'Skins',
    Other = 'Other'
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
    levels: BonusProviderLevel[];
}

export type BonusProviderLevel = SimpleBonusSource & {
    provider: LeveledBonusProvider;
    name: string;
    level: number;
    tierLevel: TierLevel | null;
    bonuses: Bonus[];
}

export type BonusProviderLevelWithReqs<TState> = BonusProviderLevel & {
    requirements: Requirement<TState>;
}

type LevelConstructor<
    TState,
    TProvider,
    TLevel extends BonusProviderLevelWithReqs<TState>
> = new (provider: TProvider, level: number, stats: Stat[], bonusValues: number[], reqs?: Requirement<TState>) => TLevel;

export type LevelData<TState> = {
    bonusValues: number[];
    requirements?: Requirement<TState>;
};

export abstract class LeveledBonusProviderImpl<
    TState,
    TName extends string,
    TLevel extends BonusProviderLevelWithReqs<TState>,
    TLevelData extends LevelData<TState>
> implements LeveledBonusProvider {
    readonly name: TName;
    readonly levels: TLevel[];
    constructor(name: TName, stats: Stat[], levelData: TLevelData[], prereqs?: Requirement<TState>) {
        this.name = name;
        this.levels = levelData.map((ld, i) => {
            let requirements = (i === 0 ? prereqs : undefined);
            if (ld.requirements) {
                requirements = (requirements
                    ? allOf(requirements, ld.requirements)
                    : ld.requirements
                );
            }
            const data = Object.assign({}, ld, {requirements});
            return this.createLevel(this, i + 1, stats, data);
        });
    }

    abstract get category(): SourceCategory;
    abstract createLevel(provider: this, level: number, stats: Stat[], levelData: TLevelData): TLevel;
}

export abstract class StatLeveledBonusProviderImpl<
    TState,
    TName extends string,
    TLevel extends BonusProviderLevelWithReqs<TState>
> extends LeveledBonusProviderImpl<TState, TName, TLevel, LevelData<TState>> {
    createLevel(provider: this, level: number, stats: Stat[], levelData: LevelData<TState>) {
        return new this.levelClass(provider, level, stats, levelData.bonusValues, levelData.requirements || undefined);
    }

    abstract get levelClass(): LevelConstructor<TState, this, TLevel>;
}

export abstract class BonusProviderLevelImpl<
    TProvider extends LeveledBonusProvider
> implements BonusProviderLevel {
    readonly provider: TProvider;
    readonly level: number;
    readonly tier: Tier;
    readonly bonuses: Bonus[];
    tierLevel: TierLevel;

    constructor(provider: TProvider, level: number, tier?: Tier) {
        this.provider = provider;
        this.level = level;
        this.tier = tier || Tiers.Common;
        this.tierLevel = {tier: this.tier, level: this.level};
        this.bonuses = [];
    }

    get name() {
        return this.provider.name + ' – Level ' + String(this.level);
    }

    get category() {
        return this.provider.category;
    }
}

export abstract class BonusProviderLevelWithReqsImpl<
    TState,
    TProvider extends LeveledBonusProvider
> extends BonusProviderLevelImpl<TProvider> {
    readonly requirements: Requirement<TState>;

    constructor(provider: TProvider, level: number, requirements?: Requirement<TState>, tier?: Tier) {
        super(provider, level, tier);
        if (this.level > 1) {
            const prevLevelReq = hasBonusLevel(provider.name, level - 1, this.selectLevels);
            this.requirements = requirements ? allOf(prevLevelReq, requirements) : prevLevelReq;
        } else {
            this.requirements = requirements || noOp;
        }
    }

    abstract selectLevels(state: TState): Record<string, number>;
}

export abstract class StatBonusProviderLevelImpl<
    TState,
    TProvider extends LeveledBonusProvider
> extends BonusProviderLevelWithReqsImpl<TState, TProvider> {
    constructor(provider: TProvider, level: number, stats: Stat[], levelData: number[], requirements?: Requirement<TState>, tier?: Tier) {
        super(provider, level, requirements, tier);
        this.bonuses.push(...stats.map((stat, i) => new Bonus(stat, levelData[i], this)));
    }
}

export type TierLevel = {tier: Tier, level: number};

export function getBonusesFrom(source: LeveledBonusProvider, startLevel: number, endLevel?: number): Bonus[] {
    if (!(source && ('levels' in source) && source.levels)) {
        return [];
    }
    const resolvedEndLevel = (endLevel === undefined ? startLevel : endLevel);
    const levels = source.levels.slice(startLevel - 1, resolvedEndLevel);
    const leveledSource = {source, startLevel, endLevel: resolvedEndLevel};
    const statBonuses = levels.flatMap(l => l.bonuses)
        .reduce((bonusValues, bonus) => {
            if (!bonusValues.has(bonus.stat)) {
                bonusValues.set(bonus.stat, 0);
            }
            const currentValue = bonusValues.get(bonus.stat) as number;
            bonusValues.set(bonus.stat, currentValue + bonus.value);
            return bonusValues;
        }, new Map<Stat, number>());
    return chainable(() => statBonuses.entries())
        .map(([stat, value]) => new Bonus(stat, value, leveledSource))
        .asArray();
}

export function aggregateSimpleBonuses<T extends string>(state: Record<T, boolean>, sources: Record<T, SimpleBonusSource>) {
    return TypeSafe.keys(state)
        .filter(key => !!state[key])
        .map(key => sources[key].bonuses)
        .reduce((result, bonuses) => {
            return [...result, ...bonuses];
        }, [] as Bonus[]);
}

export function aggregateBonuses<T extends string>(levels: Record<T, number>, sources: Partial<Record<T, LeveledBonusProvider>>): Bonus[] {
    return TypeSafe.entries<T, LeveledBonusProvider>(sources)
            .reduce((result, [key, source]) => {
                const level = (key in levels ? levels[key] : 0);
                if (level > 0) {
                    return [...result, ...getBonusesFrom(source, 1, level)];
                }
                return result;
            }, [] as Bonus[]);
}
