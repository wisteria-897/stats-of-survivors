import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EnumMap } from '../../util/types';
import { PayloadActionWithId } from '../../util/payload';
import { RootState } from '../../app/store';
import { createPersister } from '../../util/persistence';
import { ChiefGearSlot } from '../../game/chiefGear';
import { HeroGearSlot } from '../../game/heroGear';
import { ResearchTech, ResearchTechName, ResearchTechs } from '../../game/research';
import { Talent, TalentName, Talents } from '../../game/talents';
import { Building, BuildingName, Buildings } from '../../game/buildings';
import { ChiefBadge, ChiefBadgeSlot, ChiefBadges } from '../../game/badges';
const uuid = require('uuid');

export type ChiefId = string;
export interface Chief {
    id: ChiefId;
    name: string;
    level: number;
    allianceTag: string | null;
    vipLevel: number;
    chiefGear: { [key in ChiefGearSlot]: number };
    heroGear: { [key in HeroGearSlot]: number };
    research: { [key in ResearchTechName]: number };
    talents: { [key in TalentName]: number };
    buildings: { [key in BuildingName]: number };
    badges: { [key in ChiefBadgeSlot]: number };
}

export interface ChiefState {
    chiefs: Chief[];
    selectedId: ChiefId | null;
}

const initialState: ChiefState = {
    chiefs: [],
    selectedId: null,
};

const maybeUpgradeEntry = <T>(o: {[key: string]: T}, defaultValue: T, ...keys: string[]) => {
    for (const key of keys) {
        if (key in o) {
            return o[key];
        }
    }
    return defaultValue;
}

export const chiefStatePersister = createPersister('chief', initialState, undefined, data => {
    const state = JSON.parse(data);
    console.log('Persister load', state);
    state.chiefs = state.chiefs.map((chief: Chief) => {
        chief.heroGear = {
            [HeroGearSlot.BrawlerHead]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.BrawlerHead, 'Brawler/Head'),
            [HeroGearSlot.BrawlerBody]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.BrawlerBody, 'Brawler/Body'),
            [HeroGearSlot.BrawlerFoot]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.BrawlerFoot, 'Brawler/Foot'),
            [HeroGearSlot.MarksmanHead]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.MarksmanHead, 'Marksman/Head'),
            [HeroGearSlot.MarksmanBody]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.MarksmanBody, 'Marksman/Body'),
            [HeroGearSlot.MarksmanFoot]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.MarksmanFoot, 'Marksman/Foot'),
            [HeroGearSlot.ScoutHead]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.ScoutHead, 'Scout/Head'),
            [HeroGearSlot.ScoutBody]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.ScoutBody, 'Scout/Body'),
            [HeroGearSlot.ScoutFoot]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.ScoutFoot, 'Scout/Foot')
        };
        return chief;
    });
    return state;
});

export const createChief = () => {
    const research = Object.entries(ResearchTechs).map(([k, v]) => v as ResearchTech).reduce((result, tech) => {
        result[tech.name] = 0;
        return result;
    }, EnumMap.empty<number>(ResearchTechName)) as {[key in ResearchTechName]: number}

    const talents = Object.entries(Talents).map(([k, v]) => v as Talent).reduce((result, talent) => {
        result[talent.name] = 0;
        return result;
    }, EnumMap.empty<number>(TalentName)) as {[key in TalentName]: number}

    const buildings = Object.entries(Buildings).map(([k, v]) => v as Building).reduce((result, building) => {
        result[building.name] = 0;
        return result;
    }, EnumMap.empty<number>(BuildingName)) as {[key in BuildingName]: number}

    const badges = Object.entries(ChiefBadges).map(([k, v]) => v as ChiefBadge).reduce((result, badge) => {
        result[badge.slot] = 0;
        return result;
    }, EnumMap.empty<number>(ChiefBadgeSlot)) as {[key in ChiefBadgeSlot]: number}

    return {
        id: uuid.v4(),
        name: 'Survivor',
        level: 1,
        vipLevel: 0,
        allianceTag: null,
        chiefGear: {
            [ChiefGearSlot.Helmet]:       0, [ChiefGearSlot.Armor]: 0, [ChiefGearSlot.Kneepads]:     0,
            [ChiefGearSlot.AssaultRifle]: 0, [ChiefGearSlot.Boots]: 0, [ChiefGearSlot.Communicator]: 0
        },
        heroGear: {
            [HeroGearSlot.BrawlerHead]:  0, [HeroGearSlot.BrawlerBody]:  0, [HeroGearSlot.BrawlerFoot]:  0,
            [HeroGearSlot.MarksmanHead]: 0, [HeroGearSlot.MarksmanBody]: 0, [HeroGearSlot.MarksmanFoot]: 0,
            [HeroGearSlot.ScoutHead]:    0, [HeroGearSlot.ScoutBody]:    0, [HeroGearSlot.ScoutFoot]:    0
        },
        research,
        talents,
        buildings,
        badges
    };
};

const getById = (state: ChiefState, id: ChiefId): Chief | null => {
    return state.chiefs.find(c => c.id === id) || null;
};

type ChiefFunction<T> = (chief: Chief) => T;
const withChief = <T>(state: ChiefState, id: ChiefId, fn: ChiefFunction<T>): T | null => {
    const chief = getById(state, id);
    if (chief) {
        return fn(chief);
    }
    return null;
};

export const chiefSlice = createSlice({
    name: 'chief',
    initialState: chiefStatePersister.load(),
    reducers: {
        setChief: (state, action: PayloadAction<ChiefId | null>) => {
            state.selectedId = action.payload;
        },

        addChief: (state, action: PayloadAction<Chief>) => {
            state.chiefs = [...state.chiefs, action.payload];
        },

        copyChief: (state, action: PayloadAction<ChiefId>) => {
            withChief(state, action.payload, chief => {
                const newChief = Object.assign({}, chief, {
                    id: uuid.v4(),
                    name: 'Copy of ' + chief.name
                });
                state.chiefs = [...state.chiefs, newChief];
                state.selectedId = newChief.id;
            });
        },

        updateChief: (state, action: PayloadAction<Chief>) => {
            const index = state.chiefs.findIndex((c: Chief) => c.id === action.payload.id);
            if (index >= 0) {
                const updated = [...state.chiefs];
                updated[index] = action.payload;
                state.chiefs = updated;
            }
        },

        partialUpdateChief: (state, action: PayloadActionWithId<ChiefId, any>) => {
            const index = state.chiefs.findIndex((c: Chief) => c.id === action.payload.id);
            if (index >= 0) {
                const updated = [...state.chiefs];
                updated[index] = Object.assign({}, updated[index], action.payload.value);
                state.chiefs = updated;
            }
        }
    }
});

export const { setChief, addChief, copyChief, updateChief, partialUpdateChief } = chiefSlice.actions;

export const selectChief = (state: RootState, id?: ChiefId): Chief | null => {
    let chiefId;
    if (id === undefined) {
        if (state.chief.selectedId == null) {
            return null;
        }
        chiefId = state.chief.selectedId;
    } else {
        chiefId = id;
    }

    return getById(state.chief, chiefId);
};

export const selectChiefs = (state: RootState): Chief[] => state.chief.chiefs;

export default chiefSlice.reducer;
