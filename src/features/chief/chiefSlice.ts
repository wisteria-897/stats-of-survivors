import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { enumMapOf } from '../../util/types';
import { PayloadActionWithId } from '../../util/payload';
import { RootState } from '../../app/store';
import { createPersister } from '../../util/persistence';
import { ChiefGears, ChiefGearSlot } from '../../game/chiefGear';
import { HeroGears, HeroGearSlot } from '../../game/heroGear';
import { ResearchTechName, ResearchTechs } from '../../game/research';
import { TalentName, Talents } from '../../game/talents';
import { BuildingName, Buildings } from '../../game/buildings';
import { ChiefBadgeSlot, ChiefBadges } from '../../game/badges';
import { HeroName, HeroRanks, HeroType } from '../../game/heroes';
const uuid = require('uuid');

console.log(HeroRanks);
export type ChiefId = string;
export interface Chief {
    id: ChiefId;
    name: string;
    level: number;
    allianceId: string | null;
    vipLevel: number;
    chiefGear: { [key in ChiefGearSlot]: number };
    heroGear: { [key in HeroGearSlot]: number };
    research: { [key in ResearchTechName]: number };
    talents: { [key in TalentName]: number };
    buildings: { [key in BuildingName]: number };
    badges: { [key in ChiefBadgeSlot]: number };
    heroRanks: Record<HeroName, number>;
    statsHeroes: Record<HeroType, HeroName | null>;
    frameSkins: Record<string, boolean>;
    hqSkins: Record<string, boolean>;
    marchSkins: Record<string, boolean>;
}

export interface ChiefState {
    chiefs: Chief[];
    selectedId: ChiefId | null;
}

const initialState: ChiefState = {
    chiefs: [],
    selectedId: null
};

const defaultChief: Chief = {
    id: uuid.v4(),
    name: 'Survivor',
    level: 1,
    vipLevel: 0,
    allianceId: null,
    chiefGear: enumMapOf(ChiefGears, 0),
    heroGear: enumMapOf(HeroGears, 0),
    badges: enumMapOf(ChiefBadges, 0),
    research: enumMapOf(ResearchTechs, 0),
    talents: enumMapOf(Talents, 0),
    buildings: enumMapOf(Buildings, 0),
    heroRanks: enumMapOf(HeroRanks, 0),
    statsHeroes: enumMapOf(HeroType, null),
    frameSkins: {} as Record<string, boolean>,
    hqSkins: {} as Record<string, boolean>,
    marchSkins: {} as Record<string, boolean>
}

const maybeUpgradeEntry = <T>(o: {[key: string]: T} | undefined, defaultValue: T, ...keys: string[]) => {
    if (o) {
        for (const key of keys) {
            if (key in o) {
                return o[key];
            }
        }
    }
    return defaultValue;
}

type PartialLegacyChief = Partial<Chief> & {
    allianceTag?: string
};

export const chiefStatePersister = createPersister('chief', initialState, undefined, data => {
    const state = JSON.parse(data);
    state.chiefs = state.chiefs.map((chief: PartialLegacyChief) => {
        chief.heroGear = {
            [HeroGearSlot.BrawlerHead]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.BrawlerHead, 'Brawler/Head'),
            [HeroGearSlot.BrawlerBody]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.BrawlerBody, 'Brawler/Body'),
            [HeroGearSlot.BrawlerFoot]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.BrawlerFoot, 'Brawler/Foot'),
            [HeroGearSlot.MarksmanHead]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.MarksmanHead, 'Marksman/Head'),
            [HeroGearSlot.MarksmanBody]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.MarksmanBody, 'Marksman/Body'),
            [HeroGearSlot.MarksmanFoot]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.MarksmanFoot, 'marksman boots', 'Marksman/Foot'),
            [HeroGearSlot.ScoutHead]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.ScoutHead, 'Scout/Head'),
            [HeroGearSlot.ScoutBody]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.ScoutBody, 'Scout/Body'),
            [HeroGearSlot.ScoutFoot]: maybeUpgradeEntry(chief.heroGear, 0, HeroGearSlot.ScoutFoot, 'Scout/Foot')
        };
        if (chief.allianceId === undefined && ('allianceTag' in chief)) {
            chief.allianceId = chief.allianceTag;
            delete chief.allianceTag;
        }
        return Object.assign({}, defaultChief, chief, {
            buildings: Object.assign({}, defaultChief.buildings, chief.buildings),
            heroRanks: Object.assign({}, defaultChief.heroRanks, chief.heroRanks),
            frameSkins: Object.assign({}, defaultChief.frameSkins, chief.frameSkins),
            hqSkins: Object.assign({}, defaultChief.hqSkins, chief.hqSkins),
            marchSkins: Object.assign({}, defaultChief.marchSkins, chief.marchSkins)
        });
    });
    return state;
});

export function createChief(...sources: Partial<Chief>[]) {
    return Object.assign({}, defaultChief, ...sources, {id: uuid.v4()});
}

const getById = (state: ChiefState, id: ChiefId): Chief | null => {
    return state.chiefs.find(c => c.id === id) || null;
};

export const chiefSlice = createSlice({
    name: 'chief',
    initialState: chiefStatePersister.load(),
    reducers: {
        addChief: (state, action: PayloadAction<Chief>) => {
            state.chiefs = [...state.chiefs, action.payload];
        },

        deleteChief: (state, action: PayloadAction<Chief>) => {
            const index = state.chiefs.findIndex((c: Chief) => c.id === action.payload.id);
            if (index >= 0) {
                const updated = [...state.chiefs];
                updated.splice(index, 1);
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

export const { addChief, deleteChief, partialUpdateChief } = chiefSlice.actions;

export const selectChief = (state: RootState, id: ChiefId): Chief | null => {
    return getById(state.chief, id);
};

export const selectChiefs = (state: RootState): Chief[] => state.chief.chiefs;

export default chiefSlice.reducer;
