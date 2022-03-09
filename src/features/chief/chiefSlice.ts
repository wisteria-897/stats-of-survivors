import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EnumMap } from '../../util/types';
import { PayloadActionWithId } from '../../util/payload';
import { RootState } from '../../app/store';
import { createPersister } from '../../util/persistence';
import { ChiefGear } from '../../game/chiefGear';
import { HeroGear } from '../../game/heroGear';
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
    chiefGear: { [key: string]: number };
    heroGear: { [key: string]: number };
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

export const chiefStatePersister = createPersister('chief', initialState);

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
        chiefGear: {'Helmet': 0, 'Armor': 0, 'Kneepads': 0, 'Assault Rifle': 0, 'Boots': 0, 'Communicator': 0},
        heroGear: {
            'Brawler/Head': 0, 'Brawler/Body': 0, 'Brawler/Foot': 0,
            'Marksman/Head': 0, 'Marksman/Body': 0, 'Marksman/Foot': 0,
            'Scout/Head': 0, 'Scout/Body': 0, 'Scout/Foot': 0
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
            const index = state.chiefs.findIndex((c: Chief) => c.id == action.payload.id);
            if (index >= 0) {
                const updated = [...state.chiefs];
                updated[index] = action.payload;
                state.chiefs = updated;
            }
        }
    }
});

export const { setChief, addChief, copyChief, updateChief } = chiefSlice.actions;

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

export const selectChiefGear = (state: RootState, id: ChiefId, chiefGear: ChiefGear) => {
    return withChief(state.chief, id, chief => {
        const level = chief.chiefGear[chiefGear.name];
        return chiefGear.levels[level - 1] || null;
    });
}

export const selectChiefGearList = (state: RootState, id: ChiefId, ...chiefGear: ChiefGear[]) => {
    return chiefGear.map(cg => selectChiefGear(state, id, cg));
}

export const selectChiefHeroGear = (state: RootState, id: ChiefId, heroGear: HeroGear) => {
    return withChief(state.chief, id, chief => {
        const level = chief.heroGear[heroGear.heroType + '/' + heroGear.slot.slot];
        return heroGear.levels[level - 1] || null;
    });
}

export const selectChiefHeroGearList = (state: RootState, id: ChiefId, ...heroGear: HeroGear[]) => {
    return heroGear.map(hg => selectChiefHeroGear(state, id, hg));
}

export default chiefSlice.reducer;
