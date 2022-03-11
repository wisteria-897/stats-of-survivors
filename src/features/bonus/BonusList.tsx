import React, { useState } from 'react';
import { chainable } from '../../util/itertools';
import { Stat, StatUnit, Stats } from '../../game/stat';
import { SourceCategory, Tier, groupBonuses, getBonusesFrom, Bonus, BonusSource } from '../../game/bonus';
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

const getCategory = (bonus: Bonus): string => {
    let category = null;
    if (bonus.source) {
        if ('category' in bonus.source) {
            category = bonus.source.category;
        } else {
            category = bonus.source.source.category;
        }
    }
    return category || 'Unknown';
}

const getSource = (bonus: Bonus) => {
    if (bonus.source) {
        return ('source' in bonus.source) ? {mapKey: bonus.source.source, groupKey: bonus.source} : bonus.source;
    }
    return 'Unknown';
}

function BonusListItem(props: {bonus: Bonus}) {
    const {bonus} = props;
    return (
        <li>
            <div className={styles.bonusContainer}>
                {bonus.source ? <BonusSourceDisplay source={bonus.source}/> : <span>Unknown</span>}
                <BonusValue value={bonus.value} stat={bonus.stat}/>
            </div>
        </li>
    );
}

function BonusGroupListItem(props: {label: string, bonuses: Bonus[], children?: React.ReactNode}) {
    const {label, bonuses, children} = props;
    const [showChildren, setShowChildren] = useState(false);

    const total = bonuses.reduce((total, bonus) => total + bonus.value, 0);

    let extendedChildren = null;
    if (children && showChildren) {
        extendedChildren = React.Children.map(children, child => {
            return React.isValidElement(child) ? React.cloneElement(child, {bonuses: bonuses}) : child;
        });
    }

    return (
        <li>
            <div className={styles.bonusContainer} onClick={(e) => setShowChildren(!showChildren)}>
                <span>{String(label)}</span>
                <BonusValue stat={bonuses[0].stat} value={total}/>
            </div>
            {extendedChildren}
        </li>
    );
}

export function BonusList(props: {bonuses?: Bonus[], children?: React.ReactNode, groupBy?: (bonus: Bonus) => any}) {
    const {children, groupBy} = props;
    let bonuses = props.bonuses || [];

    let items = null;
    if (groupBy) {
        const groups = groupBonuses(bonuses, groupBy);
        items = chainable(() => groups.entries())
            .map(([groupKey, groupBonuses]) => (
                <BonusGroupListItem key={groupKey} label={groupKey} bonuses={groupBonuses}>
                    {children}
                </BonusGroupListItem>
            ))
            .asArray();
    } else {
        items = bonuses.map(b => {
            let name = 'Unknown';
            let category = 'Unknown';
            if (b.source) {
                name = ('name' in b.source) ? b.source.name : b.source.source.name;
                category = ('category' in b.source) ? b.source.category : b.source.source.category;
            }
            const key = category + ':' + name + ':' + b.stat.name;
            return <BonusListItem key={key} bonus={b} />;
        });
    }

    return <ul className={styles.bonusList}>{items}</ul>;
}

const BonusValue = (props: { stat: Stat, value: number }) => {
    const {stat, value} = props;
    return <span className={styles.bonusValue + (value < 0 ? styles.penaltyValue : '')}>{getDisplayValue(stat, value)}</span>;
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

    const name = 'name' in source ? source.name : source.source.levels[source.endLevel - 1].name;
    return (
        <span className={styles.sourceDisplay} onMouseOver={showBonuses} onMouseOut={hideBonuses}>
            {name}
            <BonusPopOver source={source} x={popoverData.x} y={popoverData.y} show={popoverData.show}/>
        </span>
    );
}

export const BonusPopOver = (props: { x: number, y: number, source: BonusSource, show: boolean }) => {
    const { x, y, source, show } = props;
    if (!show) {
        return null;
    }

    const bonuses = 'bonuses' in source ? source.bonuses : getBonusesFrom(source.source, source.startLevel, source.endLevel);
    const bonusItems = bonuses.map(b => {
        return (
            <li key={b.stat.name}>
                <span className={styles.statName}>{b.stat.name}:</span>
                <BonusValue stat={b.stat} value={b.value}/>
            </li>
        );
    });

    let tier: Tier | null;
    if ('tier' in source) {
        tier = source.tier;
    } else {
        const tierLevel = source.source.levels[source.endLevel - 1].tierLevel;
        tier = tierLevel && tierLevel.tier;
    }
    const name = 'name' in source ? source.name : source.source.levels[source.endLevel - 1].name;
    return (
        <aside className={styles.popOver} style={{top: y, left: x}}>
            <h4 className={tier ? styles[tier.name] : ''}>{name}</h4>
            <ul>
                {bonusItems}
            </ul>
        </aside>
    );
}
