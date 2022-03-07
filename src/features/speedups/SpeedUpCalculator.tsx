import React, { useState, useEffect } from 'react';
import { createPersister } from '../../util/persistence';
import styles from './Speedups.module.css';

enum SpeedUpType {
    Construction = 'Construction',
    Healing = 'Healing',
    Research = 'Research',
    Training = 'Training'
}

const safeParseInt = (value: string) => {
    const number = parseInt(value);
    return isNaN(number) ? 0 : number;
}

const Counter = (props: {label: string, value: number, onChange: (value: number) => any}) => {
    const {label, value, onChange} = props;
    return (
        <label>
            <span>{label}</span>
            <input type="number" min="0" value={value} onChange={(e) => onChange(safeParseInt(e.target.value))}/>
        </label>
    );
}

const minuteFormatter = Intl.NumberFormat('en-US', { useGrouping: true, style: 'unit', unit: 'minute' });
const zeroPad = Intl.NumberFormat('en-US', { minimumIntegerDigits: 2 });
const pretty = Intl.NumberFormat('en-US', { useGrouping: true });

export function SpeedUpCalculator() {
    const oneMinutePersister = createPersister('speedUpCalculator:oneMinute', 0);
    const [oneMinutes, setOneMinutes] = useState(oneMinutePersister.load);

    const fiveMinutePersister = createPersister('speedUpCalculator:fiveMinute', 0);
    const [fiveMinutes, setFiveMinutes] = useState(fiveMinutePersister.load);

    const oneHourPersister = createPersister('speedUpCalculator:oneHour', 0);
    const [oneHours, setOneHours] = useState(oneHourPersister.load);

    const threeHourPersister = createPersister('speedUpCalculator:threeHour', 0);
    const [threeHours, setThreeHours] = useState(threeHourPersister.load);

    const eightHourPersister = createPersister('speedUpCalculator:eightHour', 0);
    const [eightHours, setEightHours] = useState(eightHourPersister.load);

    useEffect(() => oneMinutePersister.save(oneMinutes), [oneMinutePersister, oneMinutes]);
    useEffect(() => fiveMinutePersister.save(fiveMinutes), [fiveMinutePersister, fiveMinutes]);
    useEffect(() => oneHourPersister.save(oneHours), [oneHourPersister, oneHours]);
    useEffect(() => threeHourPersister.save(threeHours), [threeHourPersister, threeHours]);
    useEffect(() => eightHourPersister.save(eightHours), [eightHourPersister, eightHours]);

    const totalMinutes = ((eightHours * 8 + threeHours * 3 + oneHours) * 60) + fiveMinutes * 5 + oneMinutes;
    const wholeHours = Math.floor(totalMinutes / 60);
    const remainderMinutes = totalMinutes % 60;
    const wholeDays = Math.floor(wholeHours / 24);
    const remainderHours = wholeHours % 24;
    const hms = zeroPad.format(wholeHours) + ':' + zeroPad.format(remainderMinutes) + ':00';
    const dhms = pretty.format(wholeDays) + 'd ' + zeroPad.format(remainderHours) + ':' + zeroPad.format(remainderMinutes) + ':00';

    return (
        <section className={styles.speedUpCalculator}>
            <h2>Speed Up Calculator</h2>
            <div>
                <div className={styles.speedUpCounters}>
                    <Counter label="One minute:" value={oneMinutes} onChange={v => setOneMinutes(v)}/>
                    <Counter label="Five minute:" value={fiveMinutes} onChange={v => setFiveMinutes(v)}/>
                    <Counter label="One hour:" value={oneHours} onChange={v => setOneHours(v)}/>
                    <Counter label="Three hour:" value={threeHours} onChange={v => setThreeHours(v)}/>
                    <Counter label="Eight hour:" value={eightHours} onChange={v => setEightHours(v)}/>
                </div>
                <div className={styles.speedUpTotal}>
                    <span className={styles.totalValue}>{minuteFormatter.format(totalMinutes)}</span>
                    <span>OR</span>
                    <span className={styles.totalValue}>{hms}</span>
                    {wholeDays > 0 &&
                        <span>
                            OR
                            <span className={styles.totalValue}>{dhms}</span>
                        </span>
                    }
                </div>
            </div>
        </section>
    );
}
