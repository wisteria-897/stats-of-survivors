import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { EnumMap } from '../../util/types';
import { Bonus } from '../../game/bonus';
import LevelPicker from '../../ui/level/LevelPicker';
import { BonusList } from '../bonus/BonusList';
import { AllianceTech, AllianceTechName, AllianceTechs, StatAllianceTech } from '../../game/allianceTech';
import {
    Alliance,
    AllianceTag,
    createAlliance,
    addAlliance,
    updateAlliance,
    setSelectedAlliance,
    selectAlliances,
    selectSelectedAlliance
} from './allianceSlice';
import styles from './Alliance.module.css';

type SubComponentProps = {alliance: Alliance}

const AllianceBonusList = ({alliance}: SubComponentProps) => {
    const allianceTechLevelBonuses = (!alliance || !alliance.allianceTech) ? []
        : Object.entries(alliance.allianceTech)
            .filter(([k, v]) => v > 0)
            .reduce((result, entry) => {
                const [techName, level] = entry as [AllianceTechName, number];
                const tech = AllianceTechs[techName];
                if (tech instanceof StatAllianceTech) {
                    for (let i = 0; i < level; i++) {
                        result = result.concat(tech.levels[i].bonuses);
                    }
                }
                return result;
            }, [] as Bonus[]);

    const bonuses: Bonus[] = ([] as Bonus[]).concat(
        ...allianceTechLevelBonuses
    );

    return (
        <div>
            <h3>Bonuses</h3>
            <BonusList bonuses={bonuses} />
        </div>
    );
}
const AllianceTechLevelList = ({alliance}: SubComponentProps) => {
    const listItems = (!alliance || !alliance.allianceTech) ? []
        : Object.entries(alliance.allianceTech)
            .filter(([k, v]) => v != 0)
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
    const emptyAllianceTech = Object.entries(AllianceTechs).map(([k, v]) => v as AllianceTech).reduce((result, tech) => {
        result[tech.name] = 0;
        return result;
    }, EnumMap.empty<number>(AllianceTechName)) as {[key in AllianceTechName]: number};

    const {alliance, onComplete} = props;
    const [allianceName, setAllianceName] = useState(alliance.name);
    const [allianceTag, setAllianceTag] = useState(alliance.tag);
    const [allianceLevel, setAllianceLevel] = useState(alliance.level);
    const [allianceTech, setAllianceTech] = useState(alliance.allianceTech || emptyAllianceTech);

    const onSave = () => {
        const updatedAlliance = Object.assign({}, alliance, {
            name: allianceName,
            tag: allianceTag,
            level: allianceLevel,
            allianceTech: allianceTech
        });
        console.log('AllianceEditor', updatedAlliance);
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


const AllianceDisplayPanel = ({alliance}: SubComponentProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const dispatch = useAppDispatch();

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
                <button className={styles.allianceAction} onClick={(e) => dispatch(setSelectedAlliance(null))}>👥 Select Alliance</button>
            </header>
            <section className={styles.detailSections}>
                <div>
                    <AllianceTechLevelList alliance={alliance}/>
                </div>
                <div>
                    <AllianceBonusList alliance={alliance}/>
                </div>
            </section>
        </section>
    );
}

const AllianceList = () => {
    const dispatch = useAppDispatch();
    const [newAlliance, setNewAlliance] = useState(null as Alliance | null);
    const alliances = useAppSelector((state) => selectAlliances(state));

    const onSelectAlliance = (tag: AllianceTag) => {
        dispatch(setSelectedAlliance(tag));
    }

    const onAddComplete = (alliance: Alliance | null) => {
        console.log('onAddComplete', alliance);
        if (alliance != null) {
            dispatch(addAlliance(alliance));
            onSelectAlliance(alliance.tag);
        }
        setNewAlliance(null);
    }

    if (newAlliance) {
        return <AllianceEditor alliance={newAlliance} onComplete={onAddComplete}/>;
    }

    const allianceItems = alliances.map((alliance: Alliance) => {
        return (
            <li key={alliance.tag}>
                <a href="#" onClick={(e) => onSelectAlliance(alliance.tag)}>{alliance.name}</a>
            </li>
        );
    });

    return (
        <section>
            <button onClick={(e) => setNewAlliance(createAlliance())}>➕ Add Alliance</button>
            <ul>
                {allianceItems}
            </ul>
        </section>
    );
}

export default function AlliancePanel() {
    const alliance = useAppSelector(state => selectSelectedAlliance(state));
    if (alliance) {
        return <AllianceDisplayPanel alliance={alliance} />;
    } else {
        return (
            <section>
                <AllianceList />
            </section>
        );
    }
}
