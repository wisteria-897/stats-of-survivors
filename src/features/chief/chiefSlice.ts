import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { PayloadActionWithId } from '../../util/payload';
import { RootState } from '../../app/store';
import { createPersister } from '../../util/persistence';
import { ChiefGear } from '../../game/chiefGear';
import { HeroGear } from '../../game/heroGear';

export type ChiefId = string;
export interface Chief {
    id: ChiefId;
    name: string;
    level: number;
    allianceTag: string | null;
    vipLevel: number;
    chiefGear: { [key: string]: number };
    heroGear: { [key: string]: number };
}

export interface ChiefState {
    chiefs: Chief[];
    selectedId: ChiefId | null;
}

const initialState: ChiefState = {
    chiefs: [],
    selectedId: null
};

export const chiefStatePersister = createPersister('chief', initialState);

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
