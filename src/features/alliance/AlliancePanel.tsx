import React, { useState } from 'react';
import { useNavigate, useParams, Link, Outlet } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { aggregateBonuses } from '../../game/bonus';
import LevelPicker from '../../ui/level/LevelPicker';
import { StatBonusList } from '../bonus/BonusList';
import { AllianceTech, AllianceTechName, AllianceTechs, StatAllianceTech } from '../../game/allianceTech';
import {
    Alliance,
    createAlliance,
    addAlliance,
    updateAlliance,
    selectAlliances,
    selectAllianceByTag,
} from './allianceSlice';
import styles from './Alliance.module.css';

type SubComponentProps = {alliance: Alliance}

const AllianceTechLevelList = ({alliance}: SubComponentProps) => {
    const listItems = (!alliance || !alliance.allianceTech) ? []
        : Object.entries(alliance.allianceTech)
            .filter(([k, v]) => v !== 0)
            .map(([k, v]) => <li key={k}><span>{k}: </span><span>{v}</span></li>);

    let techList;
    if (listItems.length > 0) {
        techList = (
            <ul>
               {listItems}
            </ul>
        );
    } else {
        techList = <span>&lt;None&gt;</span>;
    }

    return (
        <section>
            <h3>Alliance Tech</h3>
            {techList}
        </section>
    );
}

const AllianceTechLevelEditor = (props: {tech: AllianceTech, level: number, onChange: (tech: AllianceTech, level: number) => any}) => {
    const {tech, level, onChange} = props;
    const max = (tech instanceof StatAllianceTech) ? tech.levels.length : 1;
    return (
        <LevelPicker key={tech.name} label={tech.name} level={level} min={0} max={max}
            onChange={(value: number) => onChange(tech, value)} />
    );
}

const AllianceEditor = (props: {alliance: Alliance, onComplete: (update: Alliance | null) => any}) => {
    const {alliance, onComplete} = props;
    const [allianceName, setAllianceName] = useState(alliance.name);
    const [allianceTag, setAllianceTag] = useState(alliance.tag);
    const [allianceLevel, setAllianceLevel] = useState(alliance.level);
    const [allianceTech, setAllianceTech] = useState(alliance.allianceTech);

    const onSave = () => {
        const updatedAlliance = Object.assign({}, alliance, {
            name: allianceName,
            tag: allianceTag,
            level: allianceLevel,
            allianceTech: allianceTech
        });
        onComplete(updatedAlliance);
    }

    const allianceTechEditors = Object.entries(allianceTech).map(entry => {
        const [techName, level] = entry as [techName: AllianceTechName, level: number];
        const onChange = (tech: AllianceTech, value: number) => {
            const update = {[tech.name]: value} as {[key in AllianceTechName]: number};
            setAllianceTech(Object.assign({}, allianceTech, update));
        }
        return <AllianceTechLevelEditor key={techName} tech={AllianceTechs[techName]} level={level} onChange={onChange} />;
    });

    return (
        <div className={styles.allianceEditor}>
            <h2>Edit Alliance</h2>
            <label>
                <span>Name:</span>
                <input type="text" placeholder="Alliance name" value={allianceName} onChange={(e) => setAllianceName(e.target.value)} />
            </label>
            <label>
                <span>Tag:</span>
                <input type="text" placeholder="Tag" minLength={3} maxLength={3} value={allianceTag}
                    onChange={(e) => setAllianceTag(e.target.value)} />
            </label>
            <LevelPicker label="Alliance level:" min={0} max={60} level={allianceLevel} onChange={setAllianceLevel} />
            <h3>Alliance Tech</h3>
            <ul>
                {allianceTechEditors}
            </ul>
            <button onClick={(e) => onSave()}>💾 Save</button>
            <button onClick={(e) => onComplete(null)}>❌ Cancel</button>
        </div>
    );
}

function getStatBonuses(alliance: Alliance) {
    return (!alliance || !alliance.allianceTech) ? []
        : aggregateBonuses(alliance.allianceTech, AllianceTechs);
}

export const AllianceDisplayPanel = () => {
    const params = useParams();
    const dispatch = useAppDispatch();
    const [isEditing, setIsEditing] = useState(false);
    const alliance = useAppSelector(state => selectAllianceByTag(state, params.allianceTag || ''));
    if (alliance == null) {
        return <p>Not found</p>;
    }

    const statBonuses = getStatBonuses(alliance);

    const onEditComplete = (update: Alliance | null) => {
        if (update) {
            dispatch(updateAlliance(update));
        }
        setIsEditing(false);
    }

    if (isEditing) {
        return <AllianceEditor alliance={alliance} onComplete={onEditComplete} />;
    }

    return (
        <section className={styles.alliancePanel}>
            <header>
                <h2 className={styles.name}>[{alliance.tag}] - {alliance.name}</h2>
                <span className={styles.keyStats}>
                    <span className={styles.keyStat}>Level {alliance.level}</span>
                </span>
                <button className={styles.allianceAction} onClick={(e) => setIsEditing(true)}>✏️  Edit Alliance</button>
            </header>
            <section className={styles.detailSections}>
                <div>
                    <AllianceTechLevelList alliance={alliance}/>
                </div>
                <div>
                    <div>
                        <h2>Bonuses</h2>
                        <StatBonusList bonuses={statBonuses}/>
                    </div>
                </div>
            </section>
        </section>
    );
}

export const AddAlliancePanel = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const onAddComplete = (alliance: Alliance | null) => {
        if (alliance != null) {
            dispatch(addAlliance(alliance));
            navigate(`/alliances/${alliance.tag}`);
        } else {
            navigate(`/alliances`);
        }
    }

    return <AllianceEditor alliance={createAlliance()} onComplete={onAddComplete}/>;
}

export const AllianceList = () => {
    const alliances = useAppSelector((state) => selectAlliances(state));

    const allianceItems = alliances.map((alliance: Alliance) => {
        return (
            <li key={alliance.tag}>
                <Link to={`/alliances/${alliance.tag}`}>{alliance.name}</Link>
            </li>
        );
    });

    return (
        <section className={styles.allianceList}>
            <Link to={`/alliances/new`} className={styles.listAction}>＋ Add Alliance</Link>
            <ul>
                {allianceItems}
            </ul>
        </section>
    );
}

export function AlliancePanel() {
    return <Outlet/>;
}
