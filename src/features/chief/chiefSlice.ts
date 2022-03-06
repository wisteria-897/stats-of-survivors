import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PayloadActionWithId } from '../../util/payload';
import { RootState } from '../../app/store';
import { ChiefGear } from '../../game/chiefGear';
import { HeroGear } from '../../game/heroGear';

export interface Chief {
    id: number;
    name: string;
    level: number;
    allianceTag: string | null;
    vipLevel: number;
    chiefGear: { [key: string]: number };
    heroGear: { [key: string]: number };
}

export interface ChiefState {
    chiefs: Chief[];
    selectedId: number;
}

const defaultChief: Chief = {
    id: 1,
    name: 'Wisteria',
    level: 1,
    allianceTag: null,
    vipLevel: 0,
    chiefGear: {'Helmet': 12, 'Armor': 1, 'Kneepads': 1, 'Assault Rifle': 1, 'Boots': 1, 'Communicator': 1},
    heroGear: {
        'Brawler/Head': 13, 'Brawler/Body': 15, 'Brawler/Foot': 12,
        'Marksman/Head': 12, 'Marksman/Body': 11, 'Marksman/Foot': 11,
        'Scout/Head': 11, 'Scout/Body': 10, 'Scout/Foot': 10
    }
};

const initialState: ChiefState = {
    chiefs: [defaultChief],
    selectedId: defaultChief.id
};

const getById = (state: ChiefState, id: number): Chief | null => {
    return state.chiefs.find(c => c.id === id) || null;
};

type ChiefFunction<T> = (chief: Chief) => T;
const withChief = <T>(state: ChiefState, id: number, fn: ChiefFunction<T>): T | null => {
    const chief = getById(state, id);
    if (chief) {
        return fn(chief);
    }
    return null;
};

export const chiefSlice = createSlice({
    name: 'chief',
    initialState,
    reducers: {
        setChiefName: (state, action: PayloadActionWithId<string>) => {
            withChief(state, action.payload.id,
                chief => chief.name = action.payload.value
            );
        },

        setChiefLevel: (state, action: PayloadActionWithId<number>) => {
            withChief(state, action.payload.id,
                chief => chief.level = action.payload.value
            );
        },

        incrementVipLevel: (state, action: PayloadAction<number>) => {
            withChief(state, action.payload, chief => {
                chief.vipLevel = (chief.vipLevel + 1) % 13;
            });
        }
    }
});

export const { setChiefName, setChiefLevel, incrementVipLevel } = chiefSlice.actions;

export const selectChief = (state: RootState, id: number): Chief | null => {
    return getById(state.chief, id);
};

export const selectChiefs = (state: RootState): Chief[] => state.chief.chiefs;

export const selectChiefGear = (state: RootState, id: number, chiefGear: ChiefGear) => {
    return withChief(state.chief, id, chief => {
        const level = chief.chiefGear[chiefGear.name];
        return chiefGear.levels[level - 1] || null;
    });
}

export const selectChiefGearList = (state: RootState, id: number, ...chiefGear: ChiefGear[]) => {
    return chiefGear.map(cg => selectChiefGear(state, id, cg));
}

export const selectChiefHeroGear = (state: RootState, id: number, heroGear: HeroGear) => {
    return withChief(state.chief, id, chief => {
        const level = chief.heroGear[heroGear.heroType + '/' + heroGear.slot.slot];
        return heroGear.levels[level - 1] || null;
    });
}

export const selectChiefHeroGearList = (state: RootState, id: number, ...heroGear: HeroGear[]) => {
    return heroGear.map(hg => selectChiefHeroGear(state, id, hg));
}

export default chiefSlice.reducer;
