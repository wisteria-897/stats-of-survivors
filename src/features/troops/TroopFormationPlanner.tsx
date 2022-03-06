import React, { useEffect, useState } from 'react';
import styles from './Troops.module.css';

class MarchCapacity {
    readonly capacity: number;
    readonly name: string | null;

    constructor(capacity: number, name?: string) {
        this.capacity = capacity;
        this.name = name || null;
    }

    get key() {
        return String(this.capacity);
    }

    get label() {
        return this.capacity + (this.name ? ' – ' + this.name : '');
    }

    toSerializable() {
        return [this.capacity, this.name];
    }

    static fromSerializable(data: any) {
        const values = data as (number | string)[];
        return new MarchCapacity(values[0] as number, (values[1] || undefined) as string | undefined);
    }
}

class TroopRatio {
    readonly infantry: number;
    readonly riders: number;
    readonly hunters: number;
    readonly name: string | null;

    constructor(infantry: number, riders: number, hunters: number, name?: string) {
        this.infantry = Math.floor(infantry);
        this.riders = Math.floor(riders);
        this.hunters = Math.floor(hunters);
        this.name = name || null;
    }

    get key() {
        return this.infantry + '/' + this.riders + '/' + this.hunters;
    }

    get label() {
        const percentages = [this.infantryLabel, this.riderLabel, this.hunterLabel].join(', ');
        return (this.name ? percentages + ' – ' + this.name : percentages);
    }

    get infantryLabel() {
        return this.infantry + '%';
    }

    get riderLabel() {
        return this.riders + '%';
    }

    get hunterLabel() {
        return this.hunters + '%';
    }

    getTroopCounts(marchCapacity: number) {
        let infantryCount = Math.floor(marchCapacity * this.infantry / 100);
        let riderCount = Math.floor(marchCapacity * this.riders / 100);
        let hunterCount = Math.floor(marchCapacity * this.hunters / 100);
        const remainder = marchCapacity - (infantryCount + riderCount + hunterCount);
        if (remainder > 0) {
            infantryCount += 1;
            if (remainder > 1) {
                hunterCount += 1;
            }
        }

        return {infantryCount, riderCount, hunterCount};
    }

    toSerializable() {
        return [this.infantry, this.riders, this.hunters, this.name];
    }

    static fromSerializable(data: any) {
        const values = data as (number | string)[];
        return new TroopRatio(values[0] as number, values[1] as number, values[2] as number, (values[3] || undefined) as string | undefined);
    }
}

const fixedRatios: TroopRatio[] = [
    new TroopRatio(34, 33, 33, 'Default'),
    new TroopRatio(60, 15, 25, 'Generally Optimal'),
    new TroopRatio(5, 25, 70, 'Influencer Trap')
];

const defaultMarchCapacity: MarchCapacity[] = [
    new MarchCapacity(48000, 'HQ reinforcement during Horde')
];

type OptionItem<T> = {
    key: string;
    item: T;
    editable: boolean;
}

function Option<T>(props: {children: React.ReactNode, name: string, checked: boolean, item: T, onChange: (item: T) => any}) {
    const {children, name, checked, item, onChange} = props;
    return (
        <label className={styles.listOption}>
            <input type="radio" name={name} checked={checked} onChange={(e) => onChange(item)}/>
            {children}
        </label>
    );
}

type EditableOptionListProps<T> = {
    children: React.ReactNode,
    name: string,
    value: T,
    items: OptionItem<T>[],
    customItem: T,
    labelBuilder: (item: T) => React.ReactNode,
    onChange: (item: string) => any,
    onAddToList: (item: T) => any,
    onRemoveFromList: (item: T) => any
};
function EditableOptionList<T>(props: EditableOptionListProps<T>) {
    const {children, name, value, items, customItem, labelBuilder, onChange, onAddToList, onRemoveFromList} = props;
    const options = items.map(item => {
        return (
            <Option key={item.key} name={name} checked={value === item.item} item={item.key} onChange={onChange}>
                {labelBuilder(item.item)}
                {item.editable &&
                    <button aria-label="remove" className={styles.optionListDeleteButton}
                        onClick={(e) => onRemoveFromList(item.item)}
                    >
                        ❌
                    </button>
                }
            </Option>
        );
    });
    return (
        <div className={styles.editableOptionList}>
            {options}
            <Option key="custom" name={name} checked={value === customItem} item="custom" onChange={onChange}>
                Custom
            </Option>
            {children}
            <button onClick={(e) => onAddToList(customItem)}>Add to List</button>
        </div>
    );
}

const storageKeyBase = 'sos:troopFormationCalculator';
function createPersister<T>(key: string, initialValue: T, serialize?: (value: T) => string, deserialize?: (data: string) => T) {
    const fullKey = storageKeyBase + ':' + key;
    return {
        load: () => {
            const json = localStorage.getItem(fullKey);
            if (json) {
                return deserialize ? deserialize(json) : JSON.parse(json);
            } else {
                return initialValue;
            }
        },
        save: (value: T) => {
            const serialized = serialize ? serialize(value) : JSON.stringify(value);
            localStorage.setItem(fullKey, serialized);
        }
    };
}

function safeParseInt(input: string, max: number) {
    const value = parseInt(input);
    return isNaN(value) ? 0 : Math.min(value, max);
}

function TroopRatioInput(props: {value: number, max: number, onChange: (value: number) => void}) {
    const {value, max, onChange} = props;
    return (
        <input type="number" min="0" max={max} value={value}
            onChange={(e) => onChange(safeParseInt(e.target.value, max))}
        />
    );
}

function CustomTroopRatio(props: {ratio: TroopRatio, onChange: (newRatio: TroopRatio) => any}) {
    const {ratio, onChange} = props;
    const {infantry, riders, hunters, name} = ratio;
    return (
        <div className={styles.customTroopRatio}>
            <label>
                <span>Infantry:</span>
                <TroopRatioInput value={infantry} max={100 - (riders + hunters)}
                    onChange={(value) => onChange(new TroopRatio(value, riders, hunters, name || undefined))} />
                %
            </label>
            <label>
                <span>Riders:</span>
                <TroopRatioInput value={riders} max={100 - (infantry + hunters)}
                    onChange={(value) => onChange(new TroopRatio(infantry, value, hunters, name || undefined))} />
                %
            </label>
            <label>
                <span>Hunters:</span>
                <TroopRatioInput value={hunters} max={100 - (infantry + riders)}
                    onChange={(value) => onChange(new TroopRatio(infantry, riders, value, name || undefined))} />
                %
            </label>
            <label>
                <span>Name:</span>
                <input type="text" placeholder="optional" value={name || ''}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value != null) {
                            console.log(value);
                            onChange(new TroopRatio(infantry, riders, hunters, value));
                        }
                    }} />
            </label>
        </div>
    );
}

function CustomMarchCapacity(props: {capacity: MarchCapacity, onChange: (newCapacity: MarchCapacity) => any}) {
    const {capacity, onChange} = props;
    return (
        <div className={styles.customMarchCapacity}>
            <label>
                <span>Capacity:</span>
                <input type="number" min="0" value={capacity.capacity}
                    onChange={(e) => onChange(new MarchCapacity(safeParseInt(e.target.value, Infinity), capacity.name || undefined))}/>
            </label>
            <label>
                <span>Name:</span>
                <input type="text" placeholder="optional" value={capacity.name || ''}
                    onChange={(e) => {
                        const value = e.target.value;
                        if (value != null) {
                            console.log(value);
                            onChange(new MarchCapacity(capacity.capacity, value));
                        }
                    }} />
            </label>
        </div>
    );
}

const TroopRatioOptionLabel = (props: {ratio: TroopRatio}) => {
    const {ratio} = props;
    return (
        <span className={styles.troopRatioOptionLabel}>
            <span>{ratio.infantryLabel}</span>
            <span>{ratio.riderLabel}</span>
            <span>{ratio.hunterLabel}</span>
            {ratio.name && <span className={styles.troopRatioName}> – {ratio.name}</span>}
        </span>
    );
}

export function TroopFormationPlanner() {
    const savedRatiosPersister = createPersister('savedRatios', [] as TroopRatio[],
        list => JSON.stringify(list.map((v: any) => v.toSerializable())),
        json => JSON.parse(json).map((v: any) => TroopRatio.fromSerializable(v)));
    const [savedRatios, setSavedRatios] = useState(savedRatiosPersister.load);

    const troopRatioKeyPersister = createPersister('troopRatioKey', fixedRatios[0].key);
    const [troopRatioKey, setTroopRatioKey] = useState(troopRatioKeyPersister.load);

    const savedCapacitiesPersister = createPersister('savedCapacities', defaultMarchCapacity,
        list => JSON.stringify(list.map((v: any) => v.toSerializable())),
        json => JSON.parse(json).map((v: any) => MarchCapacity.fromSerializable(v)));
    const [savedCapacities, setSavedCapacities] = useState(savedCapacitiesPersister.load);

    const capacityKeyPersister = createPersister('capacityKey', 'custom');
    const [capacityKey, setCapacityKey] = useState(capacityKeyPersister.load);


    useEffect(() => troopRatioKeyPersister.save(troopRatioKey), [troopRatioKeyPersister, troopRatioKey]);
    useEffect(() => savedRatiosPersister.save(savedRatios), [savedRatiosPersister, savedRatios]);
    useEffect(() => capacityKeyPersister.save(capacityKey), [capacityKeyPersister, capacityKey]);
    useEffect(() => savedCapacitiesPersister.save(savedCapacities), [savedCapacitiesPersister, savedCapacities]);

    const [customRatio, setCustomRatio] = useState(new TroopRatio(34, 33, 33));
    const [customCapacity, setCustomCapacity] = useState(new MarchCapacity(1000000));

    const addRatioToList = (ratio: TroopRatio) => {
        if (ratios.find(r => r.key == ratio.key)) {
            return;
        }

        setSavedRatios([...savedRatios, new TroopRatio(ratio.infantry, ratio.riders, ratio.hunters, ratio.name || undefined)]);
    }

    const removeRatioFromList = (ratio: TroopRatio) => {
        const index = savedRatios.findIndex((r: TroopRatio) => r === ratio);
        if (index >= 0) {
            const updated = [...savedRatios];
            updated.splice(index, 1);
            setSavedRatios(updated);
        }
    }

    let ratio: TroopRatio;
    const ratios: OptionItem<TroopRatio>[] = [
        ...fixedRatios.map((r: TroopRatio) => { return {key: r.key, item: r, editable: false}; }),
        ...savedRatios.map((r: TroopRatio) => { return {key: r.key, item: r, editable: true}; })
    ];
    if (troopRatioKey === 'custom') {
        ratio = customRatio;
    } else {
        const ratioItem = ratios.find(r => r.key === troopRatioKey) || ratios[0];
        ratio = ratioItem.item;
    }

    const addCapacityToList = (capacity: MarchCapacity) => {
        if (savedCapacities.find((c: MarchCapacity) => c.key == capacity.key)) {
            return;
        }

        setSavedCapacities([...savedCapacities, new MarchCapacity(capacity.capacity, capacity.name || undefined)]);
    }

    const removeCapacityFromList = (capacity: MarchCapacity) => {
        const index = savedCapacities.findIndex((c: MarchCapacity) => c === capacity);
        if (index >= 0) {
            const updated = [...savedCapacities];
            updated.splice(index, 1);
            setSavedCapacities(updated);
        }
    }

    let marchCapacity: MarchCapacity;
    if (capacityKey === 'custom') {
        marchCapacity = customCapacity;
    } else {
        marchCapacity = savedCapacities.find((c: MarchCapacity) => c.key === capacityKey) || savedCapacities[0];
    }
    const capacityItems = savedCapacities.map((c: MarchCapacity) => { return {key: c.key, item: c, editable: true}; });

    const {infantryCount, riderCount, hunterCount} = ratio.getTroopCounts(marchCapacity.capacity);

    return (
        <fieldset className={styles.formationCalculator}>
            <legend>Troop Formation Calculator</legend>
            <div className={styles.marchCapacityPanel}>
                <label className={styles.inputHeader} htmlFor="marchCapacity">March Capacity:</label>
                <EditableOptionList name="marchCapacity" items={capacityItems} customItem={customCapacity} value={marchCapacity}
                    onChange={(k) => setCapacityKey(k)}
                    onAddToList={addCapacityToList}
                    onRemoveFromList={removeCapacityFromList}
                    labelBuilder={(c) => <span>{c.label}</span>}
                >
                    <CustomMarchCapacity capacity={customCapacity}
                        onChange={(newCapacity) => setCustomCapacity(newCapacity)}/>
                </EditableOptionList>
                <label className={styles.inputHeader}>Target Ratio:</label>
                <EditableOptionList name="troopRatio" items={ratios} customItem={customRatio} value={ratio}
                        onChange={(k) => setTroopRatioKey(k)}
                        onAddToList={addRatioToList}
                        onRemoveFromList={removeRatioFromList}
                        labelBuilder={(r) => <TroopRatioOptionLabel ratio={r} />}
                >
                    <CustomTroopRatio ratio={customRatio}
                        onChange={(newRatio) => setCustomRatio(newRatio)}/>
                </EditableOptionList>
            </div>
            <table className={styles.troopFormation}>
                <tbody>
                    <tr>
                        <td>Infantry</td>
                        <td className={styles.troopPercent}>{ratio.infantryLabel}</td>
                        <td className={styles.troopCount}>{infantryCount}</td>
                    </tr>
                    <tr>
                        <td>Riders</td>
                        <td className={styles.troopPercent}>{ratio.riderLabel}</td>
                        <td className={styles.troopCount}>{riderCount}</td>
                    </tr>
                    <tr>
                        <td>Hunters</td>
                        <td className={styles.troopPercent}>{ratio.hunterLabel}</td>
                        <td className={styles.troopCount}>{hunterCount}</td>
                    </tr>
                </tbody>
            </table>
        </fieldset>
    );
}
