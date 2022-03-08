import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { EnumMap } from '../../util/types';
import { PayloadActionWithId } from '../../util/payload';
import { RootState } from '../../app/store';
import { createPersister } from '../../util/persistence';
import { ChiefGear } from '../../game/chiefGear';
import { HeroGear } from '../../game/heroGear';
import { ResearchTechName, ResearchTechs } from '../../game/research';
import { Talent, TalentName, Talents } from '../../game/talents';
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
    const research: {[key in ResearchTechName]?: number} = {};
    for (const techName in ResearchTechs) {
        research[techName as ResearchTechName] = 0;
    }

    const talents = Object.entries(Talents).map(([k, v]) => v as Talent).reduce((result, talent) => {
        result[talent.name] = 0;
        return result;
    }, EnumMap.empty<number>(TalentName)) as {[key in TalentName]: number}

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
        research: research as {[key in ResearchTechName]: number},
        talents: talents
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

        setChiefName: (state, action: PayloadActionWithId<ChiefId, string>) => {
            withChief(state, action.payload.id,
                chief => chief.name = action.payload.value
            );
        },

        setChiefLevel: (state, action: PayloadActionWithId<ChiefId, number>) => {
            withChief(state, action.payload.id,
                chief => chief.level = action.payload.value
            );
        },

        addChief: (state, action: PayloadAction<Chief>) => {
            state.chiefs = [...state.chiefs, action.payload];
        },

        updateChief: (state, action: PayloadAction<Chief>) => {
            const index = state.chiefs.findIndex((c: Chief) => c.id == action.payload.id);
            if (index >= 0) {
                const updated = [...state.chiefs];
                updated[index] = action.payload;
                state.chiefs = updated;
            }
        },

        incrementVipLevel: (state, action: PayloadAction<ChiefId>) => {
            withChief(state, action.payload, chief => {
                chief.vipLevel = (chief.vipLevel + 1) % 13;
            });
        }
    }
});

export const { setChief, setChiefName, setChiefLevel, incrementVipLevel, addChief, updateChief } = chiefSlice.actions;

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
