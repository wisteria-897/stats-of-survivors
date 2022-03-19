import { Stat, Stats } from './stat';
import {
    SourceCategory,
    StatBonusProviderLevelImpl,
    StatLeveledBonusProviderImpl
} from './bonus';
import { Chief } from '../features/chief/chiefSlice';

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

const badgeLevelData = [[8850,8850], [3540,3540], [3540,3540], [5310,5310], [3540,3540], [5310,5310], [5300,5300]];

export class ChiefBadge extends StatLeveledBonusProviderImpl<Chief, ChiefBadgeSlot, ChiefBadgeLevel> {
    constructor(slot: ChiefBadgeSlot, stats: Stat[]) {
        super(slot, stats, badgeLevelData.map(bonusValues => { return {bonusValues}; }));
    }

    get slot() {
        return this.name;
    }

    get category() {
        return SourceCategory.ChiefBadges;
    }

    get levelClass() {
        return ChiefBadgeLevel;
    }
}

export class ChiefBadgeLevel extends StatBonusProviderLevelImpl<Chief, ChiefBadge> {
    selectLevels(chief: Chief) {
        return chief.badges;
    }

    get badgeTier() {
        if (this.level > 4) {
            return BadgeTier.Commander;
        } else if (this.level > 2) {
            return BadgeTier.Officer;
        } else {
            return BadgeTier.Mercenary;
        }
    }

    get badgeTierLevel() {
        if (this.level === 7) {
            return 3;
        } else {
            return ((this.level - 1) % 2) + 1;
        }
    }

    get name() {
        return this.provider.slot.split(' ')[0] + ' ' + this.badgeTier + ' Badge ' + 'I'.repeat(this.badgeTierLevel);
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
