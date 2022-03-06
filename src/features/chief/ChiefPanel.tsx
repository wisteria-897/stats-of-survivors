import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { chainable } from '../../util/itertools';
import { Bonus } from '../../game/bonus';
import { getVipLevel } from '../../game/vip';
import { HeroGears } from '../../game/heroGear';
import { ChiefGears } from '../../game/chiefGear';
import {
    Chief,
    incrementVipLevel,
    selectChief,
    selectChiefGear,
    selectChiefGearList,
    selectChiefHeroGear,
    selectChiefHeroGearList
} from './chiefSlice';
import { BonusSourceDisplay, BonusList } from '../bonus/BonusList';
import styles from './Chief.module.css';

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
        <BonusList bonuses={bonuses} />
    );
}

const ChiefDisplayPanel = (props: { chief: Chief }) => {
    const { chief } = props;
    const vipLevel = getVipLevel(chief.vipLevel);
    const dispatch = useAppDispatch();

    return (
        <section className={styles.chiefPanel}>
            <header>
                <h2 className={styles.name}>{getChiefDisplayName(chief)}</h2>
                <span className={styles.keyStat} onClick={(e) => dispatch(incrementVipLevel(chief.id))}>{vipLevel.name}</span>
                <span className={styles.keyStat}>Level {chief.level}</span>
            </header>
            <section className={styles.detailSections}>
                <ChiefBonusList chief={chief}/>
                <ChiefGearDisplayPanel chief={chief}/>
                <HeroGearDisplayPanel chief={chief}/>
            </section>
        </section>
    );
};

export function ChiefPanel() {
    const [chiefId, setChiefId] = useState(1);
    const chief: Chief | null = useAppSelector((state) => selectChief(state, chiefId));

    if (chief) {
        return <ChiefDisplayPanel chief={chief} />
    }
    return (
        <section>
            <span>No chief selected</span>
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
