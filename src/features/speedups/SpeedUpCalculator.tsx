import { SpeedUpSet } from '../../game/speedUps';
import styles from './Speedups.module.css';

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

export function SpeedUpCalculator(props: {speedups: SpeedUpSet, onChange: (speedups: SpeedUpSet) => any}) {
    const {speedups, onChange} = props;

    const setSpeedupCount = (fn: (set: SpeedUpSet) => void) => {
        const newSet = speedups.copy();
        fn(newSet);
        console.log('new set', newSet);
        onChange(newSet);
    }

    return (
        <div className={styles.speedUpCounters}>
            <Counter label="One minute:" value={speedups.oneMinute}
                onChange={v => setSpeedupCount(set => set.oneMinute = v)}/>
            <Counter label="Five minute:" value={speedups.fiveMinute}
                onChange={v => setSpeedupCount(set => set.fiveMinute = v)}/>
            <Counter label="One hour:" value={speedups.oneHour}
                onChange={v => setSpeedupCount(set => set.oneHour = v)}/>
            <Counter label="Three hour:" value={speedups.threeHour}
                onChange={v => setSpeedupCount(set => set.threeHour = v)}/>
            <Counter label="Eight hour:" value={speedups.eightHour}
                onChange={v => setSpeedupCount(set => set.eightHour = v)}/>
        </div>
    );
}
