import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { EnumMap } from '../../util/types';
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
    setChief,
    addChief,
    copyChief,
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


type SubComponentProps = { chief: Chief }

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
    const emptyResearch: {[key in ResearchTechName]?: number} = {};
    for (const techName in ResearchTechs) {
        emptyResearch[techName as ResearchTechName] = 0;
    }

    const emptyTalents = Object.entries(Talents).map(([k, v]) => v as Talent).reduce((result, talent) => {
        result[talent.name] = 0;
        return result;
    }, EnumMap.empty<number>(TalentName)) as {[key in TalentName]: number}

    const emptyBuildings = Object.entries(Buildings).map(([k, v]) => v as Building).reduce((result, building) => {
        result[building.name] = 0;
        return result;
    }, EnumMap.empty<number>(BuildingName)) as {[key in BuildingName]: number}

    const {chief, onComplete} = props;
    const [chiefName, setChiefName] = useState(chief.name);
    const [allianceTag, setAllianceTag] = useState(chief.allianceTag);
    const [vipLevel, setVipLevel] = useState(chief.vipLevel);
    const [chiefLevel, setChiefLevel] = useState(chief.level);
    const [research, setResearch] = useState(chief.research || emptyResearch);
    const [talents, setTalents] = useState(chief.talents || emptyTalents);
    const [buildings, setBuildings] = useState(chief.buildings || emptyBuildings);

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


const ChiefDisplayPanel = (props: {chief: Chief}) => {
    const {chief} = props;
    const [isEditing, setIsEditing] = useState(false);
    const vipLevel = getVipLevel(chief.vipLevel);
    const alliance = useAppSelector(state => selectAllianceByTag(state, chief.allianceTag || ''));
    const statBonuses = [...getChiefBonuses(chief), ...getAllianceBonuses(alliance)];

    const dispatch = useAppDispatch();

    const onEditComplete = (update: Chief | null) => {
        if (update) {
            dispatch(updateChief(update));
        }
        setIsEditing(false);
    }

    if (isEditing) {
        return <ChiefEditor chief={chief} onComplete={onEditComplete} />;
    }

    return (
        <section className={styles.chiefPanel}>
            <header>
                <h1 className={styles.name}>{getChiefDisplayName(chief)}</h1>
                <span className={styles.keyStats}>
                    <span className={styles.keyStat}>{vipLevel.name}</span>
                    <span className={styles.keyStat}>Level {chief.level}</span>
                </span>
                <button className={styles.chiefAction} onClick={(e) => setIsEditing(true)}>✏️  Edit Chief</button>
                <button className={styles.chiefAction} onClick={(e) => dispatch(copyChief(chief.id))}>📋 Copy Chief</button>
                <button className={styles.chiefAction} onClick={(e) => dispatch(setChief(null))}>👥 Select Chief</button>
            </header>
            <section className={styles.detailSections}>
                <div>
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
                    <section>
                        <h2>Hero Gear</h2>
                        <LeveledBonusProviderList providers={HeroGears} levels={chief.heroGear}
                            onChange={update => dispatch(partialUpdateChief({id: chief.id, value: {heroGear: update}}))}/>
                    </section>
                </div>
                <div>
                    <ResearchLevelList chief={chief}/>
                    <TalentLevelList chief={chief}/>
                    <BuildingLevelList chief={chief}/>
                </div>
                <div>
                    <section>
                        <h2>Stat Bonuses</h2>
                        <StatBonusList bonuses={statBonuses}/>
                    </section>
                </div>
            </section>
        </section>
    );
}

const ChiefList = () => {
    const dispatch = useAppDispatch();
    const [newChief, setNewChief] = useState(null as Chief | null);
    const chiefs = useAppSelector((state) => selectChiefs(state));

    const onSelectChief = (id: ChiefId) => {
        dispatch(setChief(id));
    }

    const onAddComplete = (chief: Chief | null) => {
        if (chief != null) {
            dispatch(addChief(chief));
            onSelectChief(chief.id);
        }
        setNewChief(null);
    }

    if (newChief) {
        return <ChiefEditor chief={newChief} onComplete={onAddComplete}/>;
    }

    const chiefItems = chiefs.map(chief => {
        return (
            <li key={chief.id}>
                <a href="#" onClick={(e) => onSelectChief(chief.id)}>{chief.name}</a>
            </li>
        );
    });

    return (
        <section className={styles.chiefList}>
            <button onClick={(e) => setNewChief(createChief())}>➕ Add Chief</button>
            <ul>
                {chiefItems}
            </ul>
        </section>
    );
}

export function ChiefPanel() {
    const chief: Chief | null = useAppSelector((state) => selectChief(state));

    if (chief) {
        return <ChiefDisplayPanel chief={chief} />
    }
    return <ChiefList />;
}
