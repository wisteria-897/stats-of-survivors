import React from 'react';
import { Subtract } from 'utility-types';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import LevelPicker from '../../ui/level/LevelPicker';
import { ItemAction, ItemList } from '../../ui/list/ItemList';
import { NavItem, SubNavigation } from '../navigation/Navigation';
import { aggregateBonuses, aggregateSimpleBonuses, getBonusesFrom } from '../../game/bonus';
import { getVipLevel } from '../../game/vip';
import { HeroGearSlot, HeroGears } from '../../game/heroGear';
import { ChiefGears } from '../../game/chiefGear';
import { ResearchTechs } from '../../game/research';
import { Talents } from '../../game/talents';
import { AllianceTechs } from '../../game/allianceTech';
import { AnalysisCenters } from '../../game/analysisCenters';
import { BuildingName, Buildings } from '../../game/buildings';
import { ChiefBadges } from '../../game/badges';
import { HeroName, HeroRanks, HeroType } from '../../game/heroes';
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
import HeroSelector from '../heroes/HeroSelector';
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
    return [
        ...aggregateBonuses(alliance.allianceTech, AllianceTechs),
        ...aggregateSimpleBonuses(alliance.analysisCenters, AnalysisCenters)
    ];
}

function getChiefBonuses(chief: Chief) {
    const vipLevel = getVipLevel(chief.vipLevel);
    const heroBonuses = [];
    const brawlerHero = chief.statsHeroes[HeroType.Brawler];
    if (brawlerHero) {
        heroBonuses.push(...getBonusesFrom(HeroRanks[brawlerHero], 1, chief.heroRanks[brawlerHero]));
        heroBonuses.push(...aggregateBonuses(chief.heroGear, {
            [HeroGearSlot.BrawlerHead]: HeroGears[HeroGearSlot.BrawlerHead],
            [HeroGearSlot.BrawlerBody]: HeroGears[HeroGearSlot.BrawlerBody],
            [HeroGearSlot.BrawlerFoot]: HeroGears[HeroGearSlot.BrawlerFoot]
        }));
    }
    const marksmanHero = chief.statsHeroes[HeroType.Marksman];
    if (marksmanHero) {
        heroBonuses.push(...getBonusesFrom(HeroRanks[marksmanHero], 1, chief.heroRanks[marksmanHero]));
        heroBonuses.push(...aggregateBonuses(chief.heroGear, {
            [HeroGearSlot.MarksmanHead]: HeroGears[HeroGearSlot.MarksmanHead],
            [HeroGearSlot.MarksmanBody]: HeroGears[HeroGearSlot.MarksmanBody],
            [HeroGearSlot.MarksmanFoot]: HeroGears[HeroGearSlot.MarksmanFoot]
        }));
    }
    const scoutHero = chief.statsHeroes[HeroType.Scout];
    if (scoutHero) {
        heroBonuses.push(...getBonusesFrom(HeroRanks[scoutHero], 1, chief.heroRanks[scoutHero]));
        heroBonuses.push(...aggregateBonuses(chief.heroGear, {
            [HeroGearSlot.ScoutHead]: HeroGears[HeroGearSlot.ScoutHead],
            [HeroGearSlot.ScoutBody]: HeroGears[HeroGearSlot.ScoutBody],
            [HeroGearSlot.ScoutFoot]: HeroGears[HeroGearSlot.ScoutFoot]
        }));
    }
    return [
        ...vipLevel.bonuses,
        ...heroBonuses,
        ...aggregateBonuses(chief.chiefGear, ChiefGears),
        ...aggregateBonuses(chief.research, ResearchTechs),
        ...aggregateBonuses(chief.talents, Talents),
        ...aggregateBonuses(chief.buildings, Buildings),
        ...aggregateBonuses(chief.badges, ChiefBadges)
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

export const ChiefStatsPanel = subPanelOf(({chief, alliance, dispatch}) => {
    const allianceBonuses = alliance ? getAllianceBonuses(alliance) : [];
    const statBonuses = [...getChiefBonuses(chief), ...allianceBonuses];
    const heroFilter = (type: HeroType) => {
        return (name: HeroName) => HeroRanks[name].type === type && chief.heroRanks[name] > 0;
    }

    const onSelectHero = (type: HeroType) => {
        return (name: HeroName | null) => {
            const update = {statsHeroes: Object.assign({}, chief.statsHeroes, {[type]: name})};
            dispatch(partialUpdateChief({id: chief.id, value: update}));
        }
    }

    return (
        <section>
            <h2>Stat Bonuses</h2>
            <section>
                <h3>Options</h3>
                <label>
                    <span>Brawler</span>
                    <HeroSelector value={chief.statsHeroes[HeroType.Brawler]}
                        filter={heroFilter(HeroType.Brawler)}
                        onChange={onSelectHero(HeroType.Brawler)}/>
                </label>
                <label>
                    <span>Marksman</span>
                    <HeroSelector value={chief.statsHeroes[HeroType.Marksman]}
                        filter={heroFilter(HeroType.Marksman)}
                        onChange={onSelectHero(HeroType.Marksman)}/>
                </label>
                <label>
                    <span>Scout</span>
                    <HeroSelector value={chief.statsHeroes[HeroType.Scout]}
                        filter={heroFilter(HeroType.Scout)}
                        onChange={onSelectHero(HeroType.Scout)}/>
                </label>
            </section>
            <StatBonusList bonuses={statBonuses}/>
        </section>
    );
});

export const HeroesPanel = subPanelOf(({chief, dispatch}) => (
    <section>
        <h2>Hero Ranks</h2>
        <LeveledBonusProviderList providers={HeroRanks} levels={chief.heroRanks}
            onChange={heroRanks => dispatch(partialUpdateChief({id: chief.id, value: {heroRanks}}))}/>
    </section>
));

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

export const ChiefGearPanel = subPanelOf(({chief, alliance, dispatch}) => (
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
));

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
        <main className={styles.chiefPanel}>
            <header>
                <div className={styles.chiefInfo}>
                    <h1>{getChiefDisplayName(chief, alliance)}</h1>
                    <span className={styles.keyStats}>
                        <span className={styles.keyStat}>{vipLevel.name}</span>
                        <span className={styles.keyStat}>Level {chief.level}</span>
                        <span className={styles.keyStat}>HQ{chief.buildings[BuildingName.Headquarters]}</span>
                    </span>
                </div>
                <SubNavigation>
                    <NavItem end to={`/chiefs/${chief.id}`}>Stats</NavItem>
                    <NavItem to={`/chiefs/${chief.id}/basics`}>Basics</NavItem>
                    <NavItem to={`/chiefs/${chief.id}/heroes`}>Heroes</NavItem>
                    <NavItem to={`/chiefs/${chief.id}/heroGear`}>Hero Gear</NavItem>
                    <NavItem to={`/chiefs/${chief.id}/chiefGear`}>Chief Gear</NavItem>
                    <NavItem to={`/chiefs/${chief.id}/research`}>Research</NavItem>
                    <NavItem to={`/chiefs/${chief.id}/talents`}>Talents</NavItem>
                    <NavItem to={`/chiefs/${chief.id}/buildings`}>Buildings</NavItem>
                </SubNavigation>
            </header>
            <Outlet/>
        </main>
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
        <main className={styles.chiefPanel}>
            <section className={styles.subPanel}>
                <section>
                    <ItemList className={styles.chiefList} items={chiefs} path="/chiefs/"
                        addLabel="＋ Add Chief" onAdd={onAddChief}
                    >
                        <ItemAction onClick={onCopyChief}>👥 Copy</ItemAction>
                        <ItemAction onClick={onDeleteChief}>❌ Delete</ItemAction>
                    </ItemList>
                </section>
            </section>
        </main>
    );
}
