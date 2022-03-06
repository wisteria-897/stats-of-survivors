import React, { useEffect, useState } from 'react';
import styles from './Troops.module.css';

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
}

const ratios: TroopRatio[] = [
    new TroopRatio(34, 33, 33, 'Default'),
    new TroopRatio(60, 15, 25, 'Generally Optimal'),
    new TroopRatio(5, 25, 70, 'Influencer Trap')
];

const TroopRatioOption = (props: {selected: boolean, ratio: TroopRatio, onChange: (ratio: TroopRatio) => any}) => {
    const {selected, ratio, onChange} = props;
    return (
        <label className={styles.troopRatioOption} key={ratio.key}>
            <input type="radio" name="troopRatio" checked={selected} onChange={(e) => onChange(ratio)}/>
            <span>{ratio.infantryLabel}</span>
            <span>{ratio.riderLabel}</span>
            <span>{ratio.hunterLabel}</span>
            {ratio.name && <span className={styles.troopRatioName}> – {ratio.name}</span>}
        </label>
    );
}


const storageKeyBase = 'sos:troopFormationCalculator'
function createPersister<T>(key: string, initialValue: T) {
    const fullKey = storageKeyBase + ':' + key;
    return {
        load: () => {
            const json = localStorage.getItem(fullKey);
            return json ? JSON.parse(json) : initialValue;
        },
        save: (value: T) => {
            localStorage.setItem(fullKey, JSON.stringify(value));
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

function CustomTroopRatio(props: {ratio: TroopRatio, onChange: (infantry: number, riders: number, hunters: number) => any}) {
    const {ratio, onChange} = props;
    const {infantry, riders, hunters} = ratio;
    return (
        <div className={styles.customTroopRatio}>
            <label>
                <span>Infantry:</span>
                <TroopRatioInput value={infantry} max={100 - (riders + hunters)}
                    onChange={(value) => onChange(value, riders, hunters)} />
                %
            </label>
            <label>
                <span>Riders:</span>
                <TroopRatioInput value={riders} max={100 - (infantry + hunters)}
                    onChange={(value) => onChange(infantry, value, hunters)} />
                %
            </label>
            <label>
                <span>Hunters:</span>
                <TroopRatioInput value={hunters} max={100 - (infantry + riders)}
                    onChange={(value) => onChange(infantry, riders, value)} />
                %
            </label>
        </div>
    );
}

export function TroopFormationPlanner() {
    const marchCapacityPersister = createPersister('marchCapacity', 10000);
    const troopRatioKeyPersister = createPersister('troopRatioKey', ratios[0].key);
    const [marchCapacity, setMarchCapacity] = useState(marchCapacityPersister.load);
    const [troopRatioKey, setTroopRatioKey] = useState(troopRatioKeyPersister.load);

    useEffect(() => marchCapacityPersister.save(marchCapacity), [marchCapacityPersister, marchCapacity]);
    useEffect(() => troopRatioKeyPersister.save(troopRatioKey), [troopRatioKeyPersister, troopRatioKey]);

    const [customRatio, setCustomRatio] = useState(new TroopRatio(34, 33, 33));

    const ratioOptions = ratios.map(ratio => {
        return <TroopRatioOption key={ratio.key} selected={ratio.key === troopRatioKey} ratio={ratio}
            onChange={ratio => setTroopRatioKey(ratio.key)}/>;
    });

    let ratio: TroopRatio;
    if (troopRatioKey === 'custom') {
        ratio = customRatio;
    } else {
        ratio = ratios.find(r => r.key === troopRatioKey) || ratios[0];
    }
    const {infantryCount, riderCount, hunterCount} = ratio.getTroopCounts(marchCapacity);
    return (
        <fieldset className={styles.formationCalculator}>
            <legend>Troop Formation Calculator</legend>
            <div className={styles.marchCapacityPanel}>
                <label className={styles.inputHeader} htmlFor="marchCapacity">March Capacity:</label>
                <input id="marchCapacity" type="number" min="0" value={marchCapacity}
                    onChange={(e) => setMarchCapacity(parseInt(e.target.value))}
                />
                <button onClick={(e) => setMarchCapacity(48000)}>48k - Horde HQ marches</button>
                <label className={styles.inputHeader}>Target Ratio:</label>
                {ratioOptions}
                <label className={styles.troopRatioOption}>
                    <input type="radio" name="troopRatio" checked={troopRatioKey === 'custom'}
                        onChange={(e) => setTroopRatioKey('custom')}
                    />
                    Custom
                </label>
                <CustomTroopRatio ratio={customRatio}
                    onChange={(...percentages) => setCustomRatio(new TroopRatio(...percentages))}/>
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
