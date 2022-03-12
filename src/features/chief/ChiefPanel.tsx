import React, { useState } from 'react';
import { Subtract } from 'utility-types';
import { useNavigate, useParams, Link, NavLink, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import LevelPicker from '../../ui/level/LevelPicker';
import { aggregateBonuses } from '../../game/bonus';
import { getVipLevel } from '../../game/vip';
import { HeroGears } from '../../game/heroGear';
import { ChiefGears } from '../../game/chiefGear';
import { ResearchTech, ResearchTechs, ResearchTechName } from '../../game/research';
import { StatTalent, Talent, Talents, TalentName } from '../../game/talents';
import { AllianceTechs } from '../../game/allianceTech';
import { Building, Buildings, BuildingName } from '../../game/buildings';
import { ChiefBadges } from '../../game/badges';
import { Alliance, selectAllianceByTag } from '../alliance/allianceSlice';
import {
    Chief,
    ChiefId,
    createChief,
    addChief,
    updateChief,
    partialUpdateChief,
    selectChief,
    selectChiefs
} from './chiefSlice';
import { LeveledBonusProviderList, StatBonusList } from '../bonus/BonusList';
import styles from './Chief.module.css';

const getChiefDisplayName = (chief: Chief): string => {
    return (chief.allianceTag ? '[' + chief.allianceTag + '] ' : '') + chief.name;
};


type SubComponentProps = {
    chief: Chief,
    alliance: Alliance | null,
    dispatch: ReturnType<typeof useAppDispatch>
}

const ResearchLevelList = ({chief}: SubComponentProps) => {
    const listItems = (!chief || !chief.research) ? <li key="none">&lt;None&gt;</li>
        : Object.entries(chief.research)
            .filter(([k, v]) => v !== 0)
            .map(([k, v]) => <li key={k}><span>{k}: </span><span>{v}</span></li>);

    return (
        <section>
            <h2>Chief Research</h2>
            <ul>
                {listItems}
            </ul>
        </section>
    );
}

const TalentLevelList = ({chief}: SubComponentProps) => {
    const listItems = (!chief || !chief.talents) ? <li key="none">&lt;None&gt;</li>
        : Object.entries(chief.talents)
            .filter(([k, v]) => v !== 0)
            .map(([k, v]) => <li key={k}><span>{k}: </span><span>{v}</span></li>);

    return (
        <section>
            <h2>Talents</h2>
            <ul>
                {listItems}
            </ul>
        </section>
    );
}

const BuildingLevelList = ({chief}: SubComponentProps) => {
    const listItems = (!chief || !chief.buildings) ? <li key="none">&lt;None&gt;</li>
        : Object.entries(chief.buildings)
            .filter(([k, v]) => v !== 0)
            .map(entry => {
                const [k, v] = entry as [BuildingName, number];
                return <li key={k}><span>{Buildings[k].levels[v - 1].name}</span></li>;
            });

    return (
        <section>
            <h2>Buildings</h2>
            <ul>
                {listItems}
            </ul>
        </section>
    );
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

const ResearchLevelEditor = (props: {tech: ResearchTech, level: number, onChange: (tech: ResearchTech, level: number) => any}) => {
    const {tech, level, onChange} = props;
    return (
        <LevelPicker key={tech.name} label={tech.name} level={level} min={0} max={tech.levels.length}
            onChange={(value: number) => onChange(tech, value)} />
    );
}

const TalentLevelEditor = (props: {talent: Talent, level: number, onChange: (talent: Talent, level: number) => any}) => {
    const {talent, level, onChange} = props;
    const max = (talent instanceof StatTalent) ? talent.levels.length : 1;
    return (
        <LevelPicker key={talent.name} label={talent.name} level={level} min={0} max={max}
            onChange={(value: number) => onChange(talent, value)} />
    );
}

const BuildingLevelEditor = (props: {building: Building, level: number, onChange: (building: Building, level: number) => any}) => {
    const {building, level, onChange} = props;
    return (
        <LevelPicker key={building.name} label={building.name} level={level} min={0} max={building.levels.length}
            onChange={(value: number) => onChange(building, value)} />
    );
}

const ChiefEditor = (props: {chief: Chief, onComplete: (update: Chief | null) => any}) => {
    const {chief, onComplete} = props;
    const [chiefName, setChiefName] = useState(chief.name);
    const [allianceTag, setAllianceTag] = useState(chief.allianceTag);
    const [vipLevel, setVipLevel] = useState(chief.vipLevel);
    const [chiefLevel, setChiefLevel] = useState(chief.level);
    const [research, setResearch] = useState(chief.research);
    const [talents, setTalents] = useState(chief.talents);
    const [buildings, setBuildings] = useState(chief.buildings);

    const onSave = () => {
        const updatedChief = Object.assign({}, chief, {
            name: chiefName,
            level: chiefLevel,
            allianceTag, vipLevel, research, talents, buildings
        });
        onComplete(updatedChief);
    }

    const researchEditors = Object.entries(research).map(entry => {
        const [techName, level] = entry as [techName: ResearchTechName, level: number];
        const onChange = (tech: ResearchTech, value: number) => {
            const update = {[tech.name]: value} as {[key in ResearchTechName]: number};
            setResearch(Object.assign({}, research, update));
        }
        return <ResearchLevelEditor key={techName} tech={ResearchTechs[techName]} level={level} onChange={onChange} />;
    });

    const talentEditors = Object.entries(talents).map(entry => {
        const [talentName, level] = entry as [talentName: TalentName, level: number];
        const onChange = (talent: Talent, value: number) => {
            const update = {[talent.name]: value} as {[key in TalentName]: number};
            setTalents(Object.assign({}, talents, update));
        }
        return <TalentLevelEditor key={talentName} talent={Talents[talentName]} level={level} onChange={onChange} />;
    });

    const buildingEditors = Object.entries(buildings).map(entry => {
        const [buildingName, level] = entry as [buildingName: BuildingName, level: number];
        const onChange = (building: Building, value: number) => {
            const update = {[building.name]: value} as {[key in BuildingName]: number};
            setBuildings(Object.assign({}, buildings, update));
        }
        return <BuildingLevelEditor key={buildingName} building={Buildings[buildingName]} level={level} onChange={onChange} />;
    });

    return (
        <div className={styles.chiefEditor}>
            <h2>Edit Chief</h2>
            <label>
                <span>Name:</span>
                <input type="text" placeholder="Chief name" value={chiefName} onChange={(e) => setChiefName(e.target.value)} />
            </label>
            <label>
                <span>Alliance:</span>
                <input type="text" placeholder="Tag" minLength={3} maxLength={3} value={allianceTag || ''} onChange={(e) => setAllianceTag(e.target.value)} />
            </label>
            <LevelPicker label="Chief level:" min={0} max={60} level={chiefLevel} onChange={setChiefLevel} />
            <LevelPicker label="VIP level:" min={0} max={12} level={vipLevel} onChange={setVipLevel} />
            <h2>Chief Tech</h2>
            <ul>
                {researchEditors}
            </ul>
            <h2>Talents</h2>
            <ul>
                {talentEditors}
            </ul>
            <h2>Buildings</h2>
            <ul>
                {buildingEditors}
            </ul>
            <button onClick={(e) => onSave()}>💾 Save</button>
            <button onClick={(e) => onComplete(null)}>❌ Cancel</button>
        </div>
    );
}

function subPanelOf<T extends SubComponentProps>(Component: React.ComponentType<T>) {
    return function SPO(props: Subtract<T, SubComponentProps>) {
        const dispatch = useAppDispatch();
        const params = useParams();
        const chief = useAppSelector(state => selectChief(state, params.chiefId || ''));
        const alliance = useAppSelector(state => selectAllianceByTag(state, (chief && chief.allianceTag) || ''));
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
    if (!alliance) {
        return <p>Not found</p>;
    }
    const statBonuses = [...getChiefBonuses(chief), ...getAllianceBonuses(alliance)];
    return (
        <section>
            <h2>Stat Bonuses</h2>
            <StatBonusList bonuses={statBonuses}/>
        </section>
    );
});

export const BuildingsPanel = subPanelOf(props => (
    <BuildingLevelList {...props}/>
));

export const TalentsPanel = subPanelOf(props => (
    <TalentLevelList {...props}/>
));

export const ChiefResearchPanel = subPanelOf(props => (
    <ResearchLevelList {...props}/>
));

export const HeroGearPanel = subPanelOf(({chief, alliance, dispatch}) => {
    return (
        <section>
            <h2>Hero Gear</h2>
            <LeveledBonusProviderList providers={HeroGears} levels={chief.heroGear}
                onChange={update => dispatch(partialUpdateChief({id: chief.id, value: {heroGear: update}}))}/>
        </section>
    );
});

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

export const ChiefDisplayPanel = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const params = useParams();
    const [isEditing, setIsEditing] = useState(false);
    const chief = useAppSelector(state => selectChief(state, params.chiefId || ''));
    if (chief == null) {
        return <p>Not found</p>;
    }
    const vipLevel = getVipLevel(chief.vipLevel);


    const onEditComplete = (update: Chief | null) => {
        if (update) {
            dispatch(updateChief(update));
        }
        setIsEditing(false);
    }

    if (isEditing) {
        return <ChiefEditor chief={chief} onComplete={onEditComplete} />;
    }

    const onCopyChief = () => {
        const newChief = createChief();
        newChief.name = 'Copy of ' + chief.name;
        dispatch(addChief(newChief));
        navigate(`/chiefs/${newChief.id}`);
    }

    return (
        <section className={styles.chiefPanel}>
            <header>
                <h1 className={styles.name}>{getChiefDisplayName(chief)}</h1>
                <span className={styles.keyStats}>
                    <span className={styles.keyStat}>{vipLevel.name}</span>
                    <span className={styles.keyStat}>Level {chief.level}</span>
                </span>
                <nav className={styles.subNav}>
                    <ul>
                        <li>
                            <NavLink to={`/chiefs/${chief.id}`}>Stats</NavLink>
                        </li>
                        <li>
                            <NavLink to={`/chiefs/${chief.id}/chiefGear`}>Chief Gear</NavLink>
                        </li>
                        <li>
                            <NavLink to={`/chiefs/${chief.id}/heroGear`}>Hero Gear</NavLink>
                        </li>
                        <li>
                            <NavLink to={`/chiefs/${chief.id}/research`}>Research</NavLink>
                        </li>
                        <li>
                            <NavLink to={`/chiefs/${chief.id}/talents`}>talents</NavLink>
                        </li>
                    </ul>
                </nav>
            </header>
            <Outlet/>
        </section>
    );
}

export const ChiefList = () => {
    const chiefs = useAppSelector((state) => selectChiefs(state));

    const chiefItems = chiefs.map(chief => {
        return (
            <li key={chief.id}>
                <Link to={`/chiefs/${chief.id}`}>{chief.name}</Link>
            </li>
        );
    });

    return (
        <section className={styles.chiefList}>
            <Link to="/chiefs/new" className={styles.listAction}>＋ Add Chief</Link>
            <ul>
                {chiefItems}
            </ul>
        </section>
    );
}

export function AddChiefPanel() {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const [newChief, setNewChief] = useState(createChief())

    const onAddComplete = (chief: Chief | null) => {
        if (chief != null) {
            dispatch(addChief(chief));
            navigate(`/chiefs/${chief.id}`);
        } else {
            navigate("/chiefs");
        }
    }
    return (
        <section className={styles.addChiefPanel}>
            <ChiefEditor chief={newChief} onComplete={onAddComplete}/>
        </section>
    );
}

export function ChiefPanel() {
    return (
        <section className={styles.chiefPanel}>
            <Outlet />
        </section>
    );
}
