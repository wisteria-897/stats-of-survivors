import React, { useState } from 'react';
import { TypeSafe } from '../../util/itertools';
import { FunctionButton } from '../../ui/button/Button';
import { Stat, StatUnit, StatCategorySort } from '../../game/stat';
import { SimpleBonusSource, LeveledBonusProvider, Tier, groupBonuses, getBonusesFrom, Bonus, BonusSource } from '../../game/bonus';
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

function BonusListItem(props: {bonus: Bonus, className?: string, hideValue?: boolean}) {
    const {bonus} = props;
    const hideValue = !!props.hideValue;
    const itemClassName = props.className || '';
    return (
        <li className={itemClassName}>
            <div className={styles.bonusContainer}>
                {bonus.source ? <BonusSourceDisplay source={bonus.source}/> : <span>Unknown</span>}
                {hideValue || <BonusValue value={bonus.value} stat={bonus.stat}/>}
            </div>
        </li>
    );
}

function BonusGroupListItem(props: {label: string, bonuses: Bonus[], hideValue?: boolean, className?: string, children?: React.ReactNode}) {
    const {label, bonuses, children} = props;
    const [showChildren, setShowChildren] = useState(false);
    const hideValue = !!props.hideValue;
    const itemClassName = props.className || '';

    const total = bonuses.reduce((total, bonus) => total + bonus.value, 0);

    let extendedChildren = null;
    if (children && showChildren) {
        extendedChildren = React.Children.map(children, child => {
            return React.isValidElement(child) ? React.cloneElement(child, {bonuses: bonuses}) : child;
        });
    }

    return (
        <li className={itemClassName}>
            <div className={styles.bonusContainer} onClick={(e) => setShowChildren(!showChildren)}>
                <span>{String(label)}</span>
                {hideValue || <BonusValue stat={bonuses[0].stat} value={total}/>}
            </div>
            {extendedChildren}
        </li>
    );
}

type BonusListClassNames = {
    list?: string,
    groupItem?: string,
    bonusItem?: string
}

type BonusListProps = {
    bonuses?: Bonus[];
    hideValue?: boolean;
    classNames?: BonusListClassNames;
    children?: React.ReactNode;
    groupBy?: (bonus: Bonus) => any;
    orderBy?: (a: any, b: any) => number;
}
export function BonusList({bonuses, classNames, hideValue, children, groupBy, orderBy}: BonusListProps) {
    bonuses = bonuses || [];
    hideValue = !!hideValue;
    const callerClassNames = Object.assign({}, {list: '', groupItem: '', bonusItem: ''}, classNames);

    let items = null;
    if (groupBy) {
        const groups = groupBonuses(bonuses, groupBy);
        const groupEntries = [...groups.entries()];
        if (orderBy) {
            groupEntries.sort((a, b) => orderBy(a[0], b[0]));
        }
        items = groupEntries.map(([groupKey, groupBonuses]) => (
            <BonusGroupListItem key={groupKey} className={callerClassNames.groupItem} label={groupKey}
                bonuses={groupBonuses} hideValue={hideValue}
            >
                {children}
            </BonusGroupListItem>
        ));
    } else {
        items = bonuses.map(b => {
            let name = 'Unknown';
            let category = 'Unknown';
            if (b.source) {
                name = ('name' in b.source) ? b.source.name : b.source.source.name;
                category = ('category' in b.source) ? b.source.category : b.source.source.category;
            }
            const key = category + ':' + name + ':' + b.stat.name;
            return <BonusListItem key={key} className={callerClassNames.bonusItem} bonus={b} hideValue={hideValue}/>;
        });
    }

    return <ul className={styles.bonusList + ' ' + callerClassNames.list}>{items}</ul>;
}

const BonusValue = (props: { stat: Stat, value: number }) => {
    const {stat, value} = props;
    return <span className={styles.bonusValue}>{getDisplayValue(stat, value)}</span>;
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

type BonusTableProps = {
    columns: {bonuses: Bonus[] | string, title: string}[];
}
export function BonusTable({columns}: BonusTableProps) {
    const statSet = new Set<Stat>();
    const columnData = columns.map(c => {
        if (typeof(c.bonuses) === 'string') {
            return c.bonuses;
        }
        c.bonuses.forEach(b => statSet.add(b.stat));
        return c.bonuses.reduce((result, b) => result.set(b.stat, b.value), new Map<Stat, number>());
    });
    columns.forEach(c => {
        if (typeof(c.bonuses) !== 'string') {
            c.bonuses.forEach(b => statSet.add(b.stat));
        }
    });
    const stats = [...statSet.values()].sort((a, b) => a.name.localeCompare(b.name));

    const headers = columns.map((c, i) => <th key={c.title + ':' + i}>{c.title}</th>);

    const rows = stats.map((stat, rowNumber) => {
        const rowKey = stat.name;
        const cells = columnData.map((c, i) => {
            const cellKey = rowKey + ':' + columns[i].title + ':' + i;
            if (typeof(c) === 'string') {
                if (rowNumber === 0) {
                    return <td key={cellKey} rowSpan={stats.length} className={styles.noColumnData}>{c}</td>;
                } else {
                    return null;
                }
            } else if (c.has(stat)) {
                return <td key={cellKey}>{getDisplayValue(stat, c.get(stat) as number)}</td>;
            } else {
                return <td key={cellKey} className={styles.noCellData}></td>;
            }
        });
        return <tr key={rowKey}><td>{stat.name}</td>{cells}</tr>;
    });
    return (
        <table className={styles.bonusTable}>
            <thead>
                <tr><th>Stats</th>{headers}</tr>
            </thead>
            <tbody>
                {rows}
            </tbody>
        </table>
    );
}

export function StatBonusList(props: {bonuses: Bonus[]}) {
    const {bonuses} = props;
    const classNames = {groupItem: styles.bonusListStatCategory};
    return (
        <BonusList bonuses={bonuses} classNames={classNames} hideValue={true}
            groupBy={(b) => b.stat.category}
            orderBy={StatCategorySort.byUsefulness}
        >
            <BonusList groupBy={(b) => b.stat} orderBy={(a, b) => a.name.localeCompare(b.name)}>
                <BonusList groupBy={getCategory}>
                    <BonusList/>
                </BonusList>
            </BonusList>
        </BonusList>
    );
}

type BonusSourceCheckboxProps = {
    title?: string,
    source: SimpleBonusSource,
    checked: boolean,
    onChange: (source: SimpleBonusSource, checked: boolean) => void
};
export function BonusSourceCheckbox({title, source, checked, onChange}: BonusSourceCheckboxProps) {
    const [showStatTable, setShowStatTable] = useState(false);
    const statColumns = !showStatTable ? [] : [{
        title: checked ? 'Provides' : 'If Active',
        bonuses: source.bonuses
    }];

    const checkboxStyle = styles.bonusSourceCheckbox +
        (checked ? ' ' + styles.bonusSourceChecked : '');
    return (
        <div className={styles.bonusLevelSelector}>
            {title && <h3>{title}</h3>}
            <div className={styles.levelSelectorControls}>
                <button className={styles.expander} onClick={(e) => setShowStatTable(!showStatTable)}>
                    {showStatTable ? '▿' : '▹'}
                </button>
                <span className={styles.bonusLevelLabel} onClick={(e) => setShowStatTable(!showStatTable)}>{source.name}</span>
                <div>
                    <FunctionButton value={source} className={checkboxStyle}
                        onClick={(source) => onChange(source, !checked)}
                    >
                        {checked ? 'Yes' : 'No'}
                    </FunctionButton>
                </div>
            </div>
            {showStatTable && <BonusTable columns={statColumns} />}
        </div>
    );
}

type BonusProviderLevelSelectorProps = {
    title?: string,
    provider: LeveledBonusProvider,
    level: number,
    onChange: (provider: LeveledBonusProvider, level: number) => any
};
export function BonusProviderLevelSelector({title, provider, level, onChange}: BonusProviderLevelSelectorProps) {
    const [showStatTable, setShowStatTable] = useState(false);

    const providerLevel = level > 0 ? provider.levels[level - 1] : null;
    const levelLabel = providerLevel ? providerLevel.name : provider.name + ': <None>';
    const canDecrement = level > 0;
    const canIncrement = level < provider.levels.length;

    const statColumns = !showStatTable ? [] : [
        {title: 'Current', bonuses: canDecrement ? getBonusesFrom(provider, 1, level) : 'None'},
        {title: 'Next', bonuses: canIncrement ? getBonusesFrom(provider, level + 1) : 'Max'}
    ];

    const tierStyle = (providerLevel && providerLevel.tierLevel) ? styles[providerLevel.tierLevel.tier.name + 'Inverse'] : '';
    return (
        <div className={styles.bonusLevelSelector}>
            {title && <h3>{title}</h3>}
            <div className={styles.levelSelectorControls}>
                <button className={styles.expander} onClick={(e) => setShowStatTable(!showStatTable)}>
                    {showStatTable ? '▿' : '▹'}
                </button>
                <span className={styles.bonusLevelLabel + ' ' + tierStyle} onClick={(e) => setShowStatTable(!showStatTable)}>{levelLabel}</span>
                <div>
                    <button disabled={!canIncrement} onClick={(e) => onChange(provider, level + 1)}>▲</button>
                    <button disabled={!canDecrement} onClick={(e) => onChange(provider, level - 1)}>▼</button>
                </div>
                <div>
                    <button disabled={!canIncrement} onClick={(e) => onChange(provider, provider.levels.length)}>Max</button>
                    <button disabled={!canDecrement} onClick={(e) => onChange(provider, 0)}>None</button>
                </div>
            </div>
            {showStatTable && <BonusTable columns={statColumns} />}
        </div>
    );
}

type SimpleBonusSourceListProps<T extends string, U extends SimpleBonusSource> = {
    sources: Record<T, U>;
    state: Record<T, boolean>;
    onChange: (update: Record<T, boolean>) => void;
};
export function SimpleBonusSourceList<T extends string, U extends SimpleBonusSource>(
    {sources, state, onChange}: SimpleBonusSourceListProps<T, U>
) {
    const checkboxes = TypeSafe.keys(sources).map(key => {
        return (
            <li key={key}>
                <BonusSourceCheckbox source={sources[key]} checked={key in state && state[key]}
                    onChange={(source, checked) => {
                        onChange(Object.assign({}, state, {[key]: checked}));
                    }}
                />
            </li>
        );
    });

    return <ul className={styles.leveledBonusProviderList}>{checkboxes}</ul>;
}

type LeveledBonusProviderListProps<T extends string, U extends LeveledBonusProvider> = {
    providers: {[key in T]: U};
    levels: {[key in T]: number};
    onChange: (update: {[key in T]: number}) => any;
}
export function LeveledBonusProviderList<T extends string, U extends LeveledBonusProvider>(
    {providers, levels, onChange}: LeveledBonusProviderListProps<T, U>
) {
    const selectors = TypeSafe.keys(levels).map(slot => {
        return (
            <li key={slot}>
                <BonusProviderLevelSelector provider={providers[slot]} level={levels[slot]}
                    onChange={(provider, level) => {
                        onChange(Object.assign({}, levels, {[slot]: level}));
                    }}
                />
            </li>
        );
    });

    return <ul className={styles.leveledBonusProviderList}>{selectors}</ul>;
}

