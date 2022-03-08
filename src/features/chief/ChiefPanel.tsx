import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { chainable } from '../../util/itertools';
import { safeParseInt } from '../../util/parse';
import { Bonus } from '../../game/bonus';
import { getVipLevel } from '../../game/vip';
import { HeroGear, HeroGears } from '../../game/heroGear';
import { ChiefGears, ChiefGearSlot } from '../../game/chiefGear';
import {
    Chief,
    ChiefId,
    incrementVipLevel,
    setChief,
    addChief,
    updateChief,
    selectChief,
    selectChiefs,
    selectChiefGear,
    selectChiefGearList,
    selectChiefHeroGear,
    selectChiefHeroGearList
} from './chiefSlice';
import { BonusSourceDisplay, BonusList } from '../bonus/BonusList';
import styles from './Chief.module.css';
const uuid = require('uuid');

const getChiefDisplayName = (chief: Chief): string => {
    return (chief.allianceTag ? '[' + chief.allianceTag + '] ' : '') + chief.name;
};


const getChiefGearListItems = (chief: Chief): JSX.Element[] => {
    return [
        ChiefGears.Helmet, ChiefGears.Armor, ChiefGears.Kneepads,
        ChiefGears['Assault Rifle'], ChiefGears.Boots, ChiefGears.Communicator
    ].map(cg => {
        const gl = useAppSelector(state => selectChiefGear(state, chief.id, cg));
        const glContent = gl ? <BonusSourceDisplay source={gl}/> : '<None>';
        return <li key={cg.name}>{glContent}</li>;
    });
};

const ChiefGearDisplayPanel = (props: { chief: Chief }) => {
    const { chief } = props;

    return (
        <section>
            <h3>Chief Gear</h3>
            <ul>
                {getChiefGearListItems(chief)}
            </ul>
        </section>
    );
};

const getHeroGearListItems = (chief: Chief): JSX.Element[] => {
    return [
        HeroGears.BrawlerHead, HeroGears.BrawlerBody, HeroGears.BrawlerFoot,
        HeroGears.MarksmanHead, HeroGears.MarksmanBody, HeroGears.MarksmanFoot,
        HeroGears.ScoutHead, HeroGears.ScoutBody, HeroGears.ScoutFoot,
    ].map(hg => {
        const gearLevel = useAppSelector(state => selectChiefHeroGear(state, chief.id, hg));
        const glContent = gearLevel ? <BonusSourceDisplay source={gearLevel}/> : '<None>';
        return <li key={hg.heroType+'/'+hg.name}>{glContent}</li>;
    });
};

const HeroGearDisplayPanel = (props: { chief: Chief }) => {
    const { chief } = props;
    return (
        <section>
            <h3>Hero Gear</h3>
            <ul>
                {getHeroGearListItems(chief)}
            </ul>
        </section>
    );
};

const ChiefBonusList = (props: { chief: Chief }) => {
    const { chief } = props;
    const vipLevel = getVipLevel(chief.vipLevel);
    const chiefGearList = [
        ChiefGears.Helmet, ChiefGears.Armor, ChiefGears.Kneepads,
        ChiefGears['Assault Rifle'], ChiefGears.Boots, ChiefGears.Communicator
    ];
    const chiefGearLevels = useAppSelector(state => selectChiefGearList(state, chief.id, ...chiefGearList));
    const heroGearList = [
        HeroGears.BrawlerHead, HeroGears.BrawlerBody, HeroGears.BrawlerFoot,
        HeroGears.MarksmanHead, HeroGears.MarksmanBody, HeroGears.MarksmanFoot,
        HeroGears.ScoutHead, HeroGears.ScoutBody, HeroGears.ScoutFoot
    ];
    const heroGearLevels = useAppSelector(state => selectChiefHeroGearList(state, chief.id, ...heroGearList));

    const bonuses: Bonus[] = ([] as Bonus[]).concat(
        vipLevel.bonuses,
        ...chainable(() => chiefGearLevels).notNull().map(gl => gl.bonuses).asArray(),
        ...chainable(() => heroGearLevels).notNull().map(gl => gl.bonuses).asArray()
    );

    return (
        <div>
            <h3>Bonuses</h3>
            <BonusList bonuses={bonuses} />
        </div>
    );
}

const ChiefGearSelector = (props: {level: number, slot: ChiefGearSlot, onChange: (level: number) => any}) => {
    const {level, slot, onChange} = props;
    const options = ChiefGears[slot].levels.map(gl => <option key={gl.level} value={gl.level}>{gl.name}</option>);
    return (
        <label className={styles.chiefGearSelector}>
            <span>{slot}:</span>
            <select value={level} onChange={(e) => onChange(safeParseInt(e.target.value))}>
                <option value="0">&lt;None&gt;</option>
                {options}
            </select>
        </label>
    );
}

const HeroGearSelector = (props: {level: number, gear: HeroGear, onChange: (level: number) => any}) => {
    const {level, gear, onChange} = props;
    const options = gear.levels.map(gl => <option key={gl.level} value={gl.level}>{gl.name}</option>);
    return (
        <label className={styles.chiefGearSelector}>
            <span>{gear.heroType} {gear.name}:</span>
            <select value={level} onChange={(e) => onChange(safeParseInt(e.target.value))}>
                <option value="0">&lt;None&gt;</option>
                {options}
            </select>
        </label>
    );
}
const ChiefEditor = (props: {chief: Chief, onComplete: (update: Chief | null) => any}) => {
    const {chief, onComplete} = props;
    const [chiefName, setChiefName] = useState(chief.name);
    const [vipLevel, setVipLevel] = useState(chief.vipLevel);
    const [chiefLevel, setChiefLevel] = useState(chief.level);
    const [chiefGear, setChiefGear] = useState(chief.chiefGear);
    const [heroGear, setHeroGear] = useState(chief.heroGear);

    const onSave = () => {
        const updatedChief = Object.assign({}, chief, {
            name: chiefName,
            level: chiefLevel,
            vipLevel: vipLevel,
            chiefGear: chiefGear,
            heroGear: heroGear
        });
        onComplete(updatedChief);
    }

    const setChiefGearSlot = (slot: ChiefGearSlot, level: number) => {
        setChiefGear(Object.assign({}, chiefGear, {[slot]: level}));
    }

    const setHeroGearSlot = (gear: HeroGear, level: number) => {
        setHeroGear(Object.assign({}, heroGear, {[gear.key]: level}));
    }

    return (
        <div className={styles.chiefEditor}>
            <h2>Edit Chief</h2>
            <label>
                <span>Name:</span>
                <input type="text" placeholder="Chief name" value={chiefName} onChange={(e) => setChiefName(e.target.value)} />
            </label>
            <label>
                <span>Chief level:</span>
                <input type="number" min="0" max="60" step="1" value={chiefLevel}
                    onChange={(e) => setChiefLevel(safeParseInt(e.target.value, {min: 1, max: 60}))} />
            </label>
            <label>
                <span>VIP level:</span>
                <input type="number" min="0" max="12" step="1" value={vipLevel}
                    onChange={(e) => setVipLevel(safeParseInt(e.target.value, {min: 0, max: 12}))} />
            </label>
            <h3>Chief Gear</h3>
            <ul className={styles.chiefEditorGearList}>
                <li>
                    <ChiefGearSelector slot={ChiefGearSlot.Helmet} level={chiefGear[ChiefGearSlot.Helmet]}
                        onChange={(level: number) => setChiefGearSlot(ChiefGearSlot.Helmet, level)} />
                </li>
                <li>
                    <ChiefGearSelector slot={ChiefGearSlot.Armor} level={chiefGear[ChiefGearSlot.Armor]}
                        onChange={(level: number) => setChiefGearSlot(ChiefGearSlot.Armor, level)} />
                </li>
                <li>
                    <ChiefGearSelector slot={ChiefGearSlot.Kneepads} level={chiefGear[ChiefGearSlot.Kneepads]}
                        onChange={(level: number) => setChiefGearSlot(ChiefGearSlot.Kneepads, level)} />
                </li>
                <li>
                    <ChiefGearSelector slot={ChiefGearSlot.AssaultRifle} level={chiefGear[ChiefGearSlot.AssaultRifle]}
                        onChange={(level: number) => setChiefGearSlot(ChiefGearSlot.AssaultRifle, level)} />
                </li>
                <li>
                    <ChiefGearSelector slot={ChiefGearSlot.Boots} level={chiefGear[ChiefGearSlot.Boots]}
                        onChange={(level: number) => setChiefGearSlot(ChiefGearSlot.Boots, level)} />
                </li>
                <li>
                    <ChiefGearSelector slot={ChiefGearSlot.Communicator} level={chiefGear[ChiefGearSlot.Communicator]}
                        onChange={(level: number) => setChiefGearSlot(ChiefGearSlot.Communicator, level)} />
                </li>
            </ul>
            <h3>Hero Gear</h3>
            <ul className={styles.chiefEditorHeroGearList}>
                <li>
                    <HeroGearSelector gear={HeroGears.BrawlerHead} level={heroGear[HeroGears.BrawlerHead.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.BrawlerHead, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.BrawlerBody} level={heroGear[HeroGears.BrawlerBody.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.BrawlerBody, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.BrawlerFoot} level={heroGear[HeroGears.BrawlerFoot.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.BrawlerFoot, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.MarksmanHead} level={heroGear[HeroGears.MarksmanHead.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.MarksmanHead, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.MarksmanBody} level={heroGear[HeroGears.MarksmanBody.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.MarksmanBody, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.MarksmanFoot} level={heroGear[HeroGears.MarksmanFoot.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.MarksmanFoot, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.ScoutHead} level={heroGear[HeroGears.ScoutHead.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.ScoutHead, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.ScoutBody} level={heroGear[HeroGears.ScoutBody.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.ScoutBody, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.ScoutFoot} level={heroGear[HeroGears.ScoutFoot.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.ScoutFoot, level)} />
                </li>
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
                <h2 className={styles.name}>{getChiefDisplayName(chief)}</h2>
                <span className={styles.keyStats}>
                    <span className={styles.keyStat} onClick={(e) => dispatch(incrementVipLevel(chief.id))}>{vipLevel.name}</span>
                    <span className={styles.keyStat}>Level {chief.level}</span>
                </span>
                <button className={styles.chiefAction} onClick={(e) => setIsEditing(true)}>✏️  Edit Chief</button>
                <button className={styles.chiefAction} onClick={(e) => dispatch(setChief(null))}>👥 Select Chief</button>
            </header>
            <section className={styles.detailSections}>
                <div>
                    <ChiefGearDisplayPanel chief={chief}/>
                    <HeroGearDisplayPanel chief={chief}/>
                </div>
                <div>
                    <ChiefBonusList chief={chief}/>
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
        console.log('onSelectChief', id);
        dispatch(setChief(id));
    }

    const onAddChief = () => {
        setNewChief({
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
            }
        });
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
        <section>
            <button onClick={(e) => onAddChief()}>➕ Add Chief</button>
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
    return (
        <section>
            <ChiefList />
        </section>
    );
    /*
            <h2 className={styles.name}>{getChiefDisplayName(chief)}</h2>
            <div className={styles.editor}>
                <label htmlFor="chiefName">Name:</label>
                <input 
                    type="text"
                    name="chiefName"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                />
                <button
                    aria-label="Update chief name"
                    onClick={(e) => dispatch(setChiefName({id: chief.id, name: newName}))}
                >
                    Save
                </button>
            </div>
        </section>
    );
    */
}
