import React, { useState } from 'react';
import { chainable } from '../../util/itertools';
import { Stat, StatUnit, Stats } from '../../game/stat';
import { groupBonuses, Bonus, BonusGroupKey, BonusGroupValue, BonusGroup, BonusSource } from '../../game/bonus';
import styles from './Bonus.module.css';

const percentFormatter = new Intl.NumberFormat('en-US', {
    style: 'percent',
    useGrouping: true,
    signDisplay: 'always',
    minimumFractionDigits: 2
});

const secondsFormatter = new Intl.NumberFormat('en-US', {
    style: 'unit',
    unit: 'second',
    unitDisplay: 'narrow',
    useGrouping: true,
    signDisplay: 'always'
});

const defaultFormatter = new Intl.NumberFormat('en-US', {
    style: 'decimal',
    useGrouping: true,
    signDisplay: 'always',
    notation: 'compact',
    compactDisplay: 'short'
});

const getDisplayValue = (stat: Stat, value: number) => {
    switch (stat.type) {
        case StatUnit.Percent:
            return percentFormatter.format(value / 100000);
        case StatUnit.Seconds:
            return secondsFormatter.format(value);
        default:
            return defaultFormatter.format(value);
    }
}

function BonusGroupListItem(props: {groupKey: BonusGroupKey, stat: Stat, item: BonusGroupValue}) {
    const {groupKey, item, stat} = props;
    const [showSubGroups, setShowSubGroups] = useState(false);
    let keyName: string;
    let keyElement;
    if (groupKey instanceof Stat) {
        keyName = groupKey.name;
        keyElement = <span>{groupKey.name}</span>;
    } else if (typeof groupKey == 'string') {
        keyName = groupKey;
        keyElement = <span>{groupKey}</span>;
    } else {
        keyName = groupKey.name;
        keyElement = <BonusSourceDisplay source={groupKey as BonusSource}/>;
    }

    let subgroupList = null;
    if (showSubGroups && item.items != null) {
        subgroupList = <BonusGroupList stat={stat} bonusGroup={item.items}/>;
    }
    return (
        <li key={keyName}>
            <div className={styles.bonusContainer} onClick={(e) => setShowSubGroups(!showSubGroups)}>
                {keyElement}
                <BonusValue stat={stat} value={item.total}/>
            </div>
            {subgroupList}
        </li>
    );
}

export function BonusGroupList(props: {stat: Stat, bonusGroup: BonusGroup<any>} | {className: string, bonusGroup: BonusGroup<Stat>}) {
    const {bonusGroup} = props;

    const listItems = chainable(() => bonusGroup.entries()).map(([key, group]) => {
        const stat = 'stat' in props ? props.stat : key;
        const keyName = (typeof(key) == 'object' && 'name' in key) ? key.name : String(key);
        return <BonusGroupListItem key={keyName} groupKey={key} stat={stat} item={group}/>;
    });

    return (
        <ul className={'className' in props ? props.className : ''}>
            {listItems}
        </ul>
    );
}

const supportedStats = [
    Stats.InfantryAttack, Stats.InfantryDefense, Stats.InfantryHealth, Stats.InfantryLethality,
    Stats.RiderAttack, Stats.RiderDefense, Stats.RiderHealth, Stats.RiderLethality,
    Stats.HunterAttack, Stats.HunterDefense, Stats.HunterHealth, Stats.HunterLethality,
    Stats.TroopAttack, Stats.TroopDefense, Stats.TroopHealth, Stats.TroopLethality,
    Stats.TrainingSpeed, Stats.TrainingCapacity, Stats.HealingSpeed, Stats.HealingCapacity,
    Stats.MarchCapacity
];
export function BonusList(props: { bonuses: Bonus[] }) {
    const filteredBonuses = props.bonuses.filter(b => supportedStats.find(s => s == b.stat));
    const bonusGroup: BonusGroup<Stat> = groupBonuses(filteredBonuses, b => b.stat,
        x => groupBonuses(x, b => b.source ? b.source.category : 'Unknown',
            y => groupBonuses(y, b => b.source || 'Unknown')));
    return <BonusGroupList className={styles.bonusList} bonusGroup={bonusGroup}/>;
}

const BonusValue = (props: { stat: Stat, value: number }) => {
    const {stat, value} = props;
    return <span className={styles.bonusValue + (value < 0 ? styles.penaltyValue : '')}>{getDisplayValue(stat, value)}</span>;
}

export const BonusDisplay = (props: { bonus: Bonus }) => {
    const { bonus } = props;
    return <div><span>{bonus.stat.name}</span>: <span>{bonus.value}</span></div>;
}

type PopoverData = { x: number, y: number, show: boolean, timeoutId: number | null };
export const BonusSourceDisplay = (props: { source: BonusSource }) => {
    const { source } = props;
    const [ popoverData, setPopoverData ] = useState({x: 0, y: 0, show: false, timeoutId: null} as PopoverData);

    const showBonuses = (event: React.MouseEvent<HTMLElement>) => {
        if (popoverData.show === false && popoverData.timeoutId == null) {
            const target = event.target as HTMLElement;
            const timeoutId = window.setTimeout(() => {
                setPopoverData({x: target.clientWidth + 5, y: 0, show: true, timeoutId: null});
            }, 250) as number;
            setPopoverData({x: target.clientWidth + 5, y: 0, show: false, timeoutId: timeoutId});
        }
    }

    const hideBonuses = (e: React.MouseEvent<HTMLElement>) => {
        if (popoverData.timeoutId != null) {
            clearTimeout(popoverData.timeoutId);
        }
        setPopoverData({x: 0, y: 0, show: false, timeoutId: null});
    }

    return (
        <span className={styles.sourceDisplay} onMouseOver={showBonuses} onMouseOut={hideBonuses}>
            {source.name}
            <BonusPopOver source={source} x={popoverData.x} y={popoverData.y} show={popoverData.show}/>
        </span>
    );
}

export const BonusPopOver = (props: { x: number, y: number, source: BonusSource, show: boolean }) => {
    const { x, y, source, show } = props;
    if (!show) {
        return null;
    }

    const bonusItems = source.bonuses.map(b => {
        return (
            <li key={b.stat.name}>
                <span className={styles.statName}>{b.stat.name}:</span>
                <BonusValue stat={b.stat} value={b.value}/>
            </li>
        );
    });

    return (
        <aside className={styles.popOver} style={{top: y, left: x}}>
            <h4 className={styles[source.tier.name]}>{source.name}</h4>
            <ul>
                {bonusItems}
            </ul>
        </aside>
    );
}
