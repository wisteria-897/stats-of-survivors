import React from 'react';
import { Subtract } from 'utility-types';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import LevelPicker from '../../ui/level/LevelPicker';
import { ItemAction, ItemList } from '../../ui/list/ItemList';
import { NavItem, SubNavigation } from '../navigation/Navigation';
import { aggregateBonuses } from '../../game/bonus';
import { getVipLevel } from '../../game/vip';
import { HeroGears } from '../../game/heroGear';
import { ChiefGears } from '../../game/chiefGear';
import { ResearchTechs } from '../../game/research';
import { Talents } from '../../game/talents';
import { AllianceTechs } from '../../game/allianceTech';
import { Buildings } from '../../game/buildings';
import { ChiefBadges } from '../../game/badges';
import { Alliance, selectAllianceByIdOrTag } from '../alliance/allianceSlice';
import {
    Chief,
    createChief,
    addChief,
    deleteChief,
    partialUpdateChief,
    selectChief,
    selectChiefs
} from './chiefSlice';
import { LeveledBonusProviderList, StatBonusList } from '../bonus/BonusList';
import styles from './Chief.module.css';

const getChiefDisplayName = (chief: Chief, alliance: Alliance | null): string => {
    return (alliance ? '[' + alliance.tag + '] ' : '') + chief.name;
};


type SubComponentProps = {
    chief: Chief,
    alliance: Alliance | null,
    dispatch: ReturnType<typeof useAppDispatch>
}

function getAllianceBonuses(alliance: Alliance) {
    return (!alliance || !alliance.allianceTech) ? [] : aggregateBonuses(alliance.allianceTech, AllianceTechs);
}

function getChiefBonuses(chief: Chief) {
    const vipLevel = getVipLevel(chief.vipLevel);
    const researchBonuses = (!chief || !chief.research) ? [] : aggregateBonuses(chief.research, ResearchTechs);
    const buildingBonuses = (!chief || !chief.buildings) ? [] : aggregateBonuses(chief.buildings, Buildings);
    const talentBonuses = (!chief || !chief.talents) ? [] : aggregateBonuses(chief.talents, Talents);
    const badgeBonuses = (!chief || !chief.badges) ? [] : aggregateBonuses(chief.badges, ChiefBadges);
    const chiefGearBonuses = (!chief || !chief.chiefGear) ? [] : aggregateBonuses(chief.chiefGear, ChiefGears);
    const heroGearBonuses = (!chief || !chief.heroGear) ? [] : aggregateBonuses(chief.heroGear, HeroGears);


    return [
        ...vipLevel.bonuses,
        ...chiefGearBonuses,
        ...heroGearBonuses,
        ...researchBonuses,
        ...talentBonuses,
        ...buildingBonuses,
        ...badgeBonuses
    ];
}

function subPanelOf<T extends SubComponentProps>(Component: React.ComponentType<T>) {
    return function SPO(props: Subtract<T, SubComponentProps>) {
        const dispatch = useAppDispatch();
        const params = useParams();
        const chief = useAppSelector(state => selectChief(state, params.chiefId || ''));
        const alliance = useAppSelector(state => selectAllianceByIdOrTag(state, (chief && chief.allianceId) || ''));
        if (!chief) {
            return <p>Not Found</p>;
        }

        return (
            <section className={styles.subPanel}>
                <Component {...props as T} chief={chief} alliance={alliance} dispatch={dispatch}/>
            </section>
        );
    }
}

export const ChiefStatsPanel = subPanelOf(({chief, alliance}) => {
    const allianceBonuses = alliance ? getAllianceBonuses(alliance) : [];
    const statBonuses = [...getChiefBonuses(chief), ...allianceBonuses];
    return (
        <section>
            <h2>Stat Bonuses</h2>
            <StatBonusList bonuses={statBonuses}/>
        </section>
    );
});

export const BuildingsPanel = subPanelOf(({chief, dispatch}) => (
    <section>
        <h2>Buildings</h2>
        <LeveledBonusProviderList providers={Buildings} levels={chief.buildings}
            onChange={update => dispatch(partialUpdateChief({id: chief.id, value: {buildings: update}}))}/>
    </section>
));

export const TalentsPanel = subPanelOf(({chief, dispatch}) => (
    <section>
        <h2>Talents</h2>
        <LeveledBonusProviderList providers={Talents} levels={chief.talents}
            onChange={update => dispatch(partialUpdateChief({id: chief.id, value: {talents: update}}))}/>
    </section>
));

export const ChiefResearchPanel = subPanelOf(({chief, dispatch}) => (
    <section>
        <h2>Research</h2>
        <LeveledBonusProviderList providers={ResearchTechs} levels={chief.research}
            onChange={update => dispatch(partialUpdateChief({id: chief.id, value: {research: update}}))}/>
    </section>
));

export const HeroGearPanel = subPanelOf(({chief, alliance, dispatch}) => (
    <section>
        <h2>Hero Gear</h2>
        <LeveledBonusProviderList providers={HeroGears} levels={chief.heroGear}
            onChange={update => dispatch(partialUpdateChief({id: chief.id, value: {heroGear: update}}))}/>
    </section>
));

export const ChiefGearPanel = subPanelOf(({chief, alliance}) => {
    const dispatch = useAppDispatch();
    return (
        <>
            <section>
                <h2>Chief Gear</h2>
                <LeveledBonusProviderList providers={ChiefGears} levels={chief.chiefGear}
                    onChange={update => dispatch(partialUpdateChief({id: chief.id, value: {chiefGear: update}}))}/>
            </section>
            <section>
                <h2>Chief Gear Badges</h2>
                <LeveledBonusProviderList providers={ChiefBadges} levels={chief.badges}
                    onChange={update => dispatch(partialUpdateChief({id: chief.id, value: {badges: update}}))}/>
            </section>
        </>
    );
});

export const ChiefBasicsPanel = subPanelOf(({chief, dispatch}) => {
    const partialUpdate = (update: any) => {
        dispatch(partialUpdateChief({id: chief.id, value: update}));
    }

    return (
        <section>
            <label>
                <span>Name:</span>
                <input type="text" placeholder="Chief name" value={chief.name} onChange={(e) => partialUpdate({name: e.target.value})}/>
            </label>
            <label>
                <span>Alliance:</span>
                <input type="text" placeholder="Tag" minLength={3} maxLength={3} value={chief.allianceId || ''} onChange={(e) => partialUpdate({allianceId: e.target.value})}/>
            </label>
            <LevelPicker label="Chief level:" min={0} max={60} level={chief.level} onChange={value => partialUpdate({level: value})}/>
            <LevelPicker label="VIP level:" min={0} max={12} level={chief.vipLevel} onChange={value => partialUpdate({vipLevel: value})}/>
        </section>
    );
});

export const ChiefDisplayPanel = () => {
    const params = useParams();
    const chief = useAppSelector(state => selectChief(state, params.chiefId || ''));
    const alliance = useAppSelector(state => selectAllianceByIdOrTag(state, (chief && chief.allianceId) || ''));
    if (chief == null) {
        return <p>Not found</p>;
    }
    const vipLevel = getVipLevel(chief.vipLevel);

    return (
        <section className={styles.chiefPanel}>
            <header>
                <h1 className={styles.name}>{getChiefDisplayName(chief, alliance)}</h1>
                <span className={styles.keyStats}>
                    <span className={styles.keyStat}>{vipLevel.name}</span>
                    <span className={styles.keyStat}>Level {chief.level}</span>
                </span>
                <SubNavigation>
                    <NavItem end to={`/chiefs/${chief.id}`}>Stats</NavItem>
                    <NavItem to={`/chiefs/${chief.id}/basics`}>Basics</NavItem>
                    <NavItem to={`/chiefs/${chief.id}/chiefGear`}>Chief Gear</NavItem>
                    <NavItem to={`/chiefs/${chief.id}/heroGear`}>Hero Gear</NavItem>
                    <NavItem to={`/chiefs/${chief.id}/research`}>Research</NavItem>
                    <NavItem to={`/chiefs/${chief.id}/talents`}>Talents</NavItem>
                    <NavItem to={`/chiefs/${chief.id}/buildings`}>Buildings</NavItem>
                </SubNavigation>
            </header>
            <Outlet/>
        </section>
    );
}

export const ChiefList = () => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const chiefs = useAppSelector((state) => selectChiefs(state));

    const onAddChief = () => {
        const newChief = createChief();
        dispatch(addChief(newChief));
        navigate(`/chiefs/${newChief.id}/basics`);
    }

    const onDeleteChief = (chief: Chief) => {
        dispatch(deleteChief(chief));
    }

    const onCopyChief = (chief: Chief) => {
        const copy = createChief(chief, {name: `Copy of ${chief.name}`});
        dispatch(addChief(copy));
        navigate(`/chiefs/${copy.id}/basics`);
    }

    return (
        <ItemList className={styles.chiefList} items={chiefs} path="/chiefs/"
            addLabel="＋ Add Chief" onAdd={onAddChief}
        >
            <ItemAction onClick={onCopyChief}>👥 Copy</ItemAction>
            <ItemAction onClick={onDeleteChief}>❌ Delete</ItemAction>
        </ItemList>
    );
}

export function ChiefPanel() {
    return (
        <section className={styles.chiefPanel}>
            <Outlet />
        </section>
    );
}
