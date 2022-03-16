import { Stat, Stats } from './stat';
import { Bonus, SourceCategory, Tiers } from './bonus';

export enum ChiefBadgeSlot {
    Infantry1 = 'Infantry #1',
    Infantry2 = 'Infantry #2',
    Infantry3 = 'Infantry #3',
    Infantry4 = 'Infantry #4',
    Infantry5 = 'Infantry #5',
    Infantry6 = 'Infantry #6',
    Rider1    = 'Rider #1',
    Rider2    = 'Rider #2',
    Rider3    = 'Rider #3',
    Rider4    = 'Rider #4',
    Rider5    = 'Rider #5',
    Rider6    = 'Rider #6',
    Hunter1   = 'Hunter #1',
    Hunter2   = 'Hunter #2',
    Hunter3   = 'Hunter #3',
    Hunter4   = 'Hunter #4',
    Hunter5   = 'Hunter #5',
    Hunter6   = 'Hunter #6'
}

export enum BadgeTier {
    Mercenary = 'Mercenary',
    Officer   = 'Officer',
    Commander = 'Commander'
}

type BadgeLevelData = {bonusValue: number, tier: BadgeTier, tierLevel: number}

const allLevelData: BadgeLevelData[] = [
    {bonusValue: 8850, tier: BadgeTier.Mercenary, tierLevel: 1},
    {bonusValue: 3540, tier: BadgeTier.Mercenary, tierLevel: 2},
    {bonusValue: 3540, tier: BadgeTier.Officer, tierLevel: 1},
    {bonusValue: 5310, tier: BadgeTier.Officer, tierLevel: 2},
    {bonusValue: 3540, tier: BadgeTier.Commander, tierLevel: 1},
    {bonusValue: 5310, tier: BadgeTier.Commander, tierLevel: 2},
    {bonusValue: 5300, tier: BadgeTier.Commander, tierLevel: 3}
];

export class ChiefBadge {
    readonly slot: ChiefBadgeSlot;
    readonly stats: Stat[];
    readonly levels: ChiefBadgeLevel[];

    constructor(slot: ChiefBadgeSlot, stats: Stat[]) {
        this.slot = slot;
        this.stats = stats;
        this.levels = allLevelData.map((levelData, i) => new ChiefBadgeLevel(this, i + 1, levelData));
    }

    get name() {
        return this.slot + ' Badge';
    }

    get category() {
        return SourceCategory.ChiefBadges;
    }
}

export class ChiefBadgeLevel {
    readonly badge: ChiefBadge;
    readonly level: number;
    readonly badgeTier: BadgeTier;
    readonly badgeTierLevel: number;
    readonly bonuses: Bonus[];

    constructor(badge: ChiefBadge, level: number, levelData: BadgeLevelData) {
        this.badge = badge;
        this.level = level;
        this.badgeTier = levelData.tier;
        this.badgeTierLevel = levelData.tierLevel;
        this.bonuses = badge.stats.map(stat => new Bonus(stat, levelData.bonusValue, this));
    }

    get name() {
        return this.badge.slot.split(' ')[0] + ' ' + this.badgeTier + ' Badge ' + 'I'.repeat(this.badgeTierLevel);
    }

    get category() {
        return SourceCategory.ChiefBadges;
    }

    get tier() {
        return Tiers.Common;
    }

    get tierLevel() {
        return null;
    }

    get provider() {
        return this.badge;
    }
}

export const ChiefBadges = {
    [ChiefBadgeSlot.Infantry1]: new ChiefBadge(ChiefBadgeSlot.Infantry1, [Stats.InfantryLethality, Stats.InfantryHealth]),
    [ChiefBadgeSlot.Infantry2]: new ChiefBadge(ChiefBadgeSlot.Infantry2, [Stats.InfantryLethality, Stats.InfantryHealth]),
    [ChiefBadgeSlot.Infantry3]: new ChiefBadge(ChiefBadgeSlot.Infantry3, [Stats.InfantryLethality, Stats.InfantryHealth]),
    [ChiefBadgeSlot.Infantry4]: new ChiefBadge(ChiefBadgeSlot.Infantry4, [Stats.InfantryLethality, Stats.InfantryHealth]),
    [ChiefBadgeSlot.Infantry5]: new ChiefBadge(ChiefBadgeSlot.Infantry5, [Stats.InfantryLethality, Stats.InfantryHealth]),
    [ChiefBadgeSlot.Infantry6]: new ChiefBadge(ChiefBadgeSlot.Infantry6, [Stats.InfantryLethality, Stats.InfantryHealth]),
    [ChiefBadgeSlot.Rider1]: new ChiefBadge(ChiefBadgeSlot.Rider1, [Stats.RiderLethality, Stats.RiderHealth]),
    [ChiefBadgeSlot.Rider2]: new ChiefBadge(ChiefBadgeSlot.Rider2, [Stats.RiderLethality, Stats.RiderHealth]),
    [ChiefBadgeSlot.Rider3]: new ChiefBadge(ChiefBadgeSlot.Rider3, [Stats.RiderLethality, Stats.RiderHealth]),
    [ChiefBadgeSlot.Rider4]: new ChiefBadge(ChiefBadgeSlot.Rider4, [Stats.RiderLethality, Stats.RiderHealth]),
    [ChiefBadgeSlot.Rider5]: new ChiefBadge(ChiefBadgeSlot.Rider5, [Stats.RiderLethality, Stats.RiderHealth]),
    [ChiefBadgeSlot.Rider6]: new ChiefBadge(ChiefBadgeSlot.Rider6, [Stats.RiderLethality, Stats.RiderHealth]),
    [ChiefBadgeSlot.Hunter1]: new ChiefBadge(ChiefBadgeSlot.Hunter1, [Stats.HunterLethality, Stats.HunterHealth]),
    [ChiefBadgeSlot.Hunter2]: new ChiefBadge(ChiefBadgeSlot.Hunter2, [Stats.HunterLethality, Stats.HunterHealth]),
    [ChiefBadgeSlot.Hunter3]: new ChiefBadge(ChiefBadgeSlot.Hunter3, [Stats.HunterLethality, Stats.HunterHealth]),
    [ChiefBadgeSlot.Hunter4]: new ChiefBadge(ChiefBadgeSlot.Hunter4, [Stats.HunterLethality, Stats.HunterHealth]),
    [ChiefBadgeSlot.Hunter5]: new ChiefBadge(ChiefBadgeSlot.Hunter5, [Stats.HunterLethality, Stats.HunterHealth]),
    [ChiefBadgeSlot.Hunter6]: new ChiefBadge(ChiefBadgeSlot.Hunter6, [Stats.HunterLethality, Stats.HunterHealth])
} as const;
