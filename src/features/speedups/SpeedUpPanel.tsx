import React, { useEffect, useState } from 'react';
import { createPersister, migrate } from '../../util/persistence';
import TimeSpan from '../../util/timespan';
import { SpeedUpSet, SpeedUpType } from '../../game/speedUps';
import { SpeedUpCalculator } from './SpeedUpCalculator';
import styles from './Speedups.module.css';

const minuteFormatter = Intl.NumberFormat('en-US', { useGrouping: true, style: 'unit', unit: 'minute' });

migrate('speedUpCalculator:speedUps',
    ['speedUpCalculator:oneMinute','speedUpCalculator:fiveMinute',
        'speedUpCalculator:oneHour','speedUpCalculator:threeHour','speedUpCalculator:eightHour'],
    (maybeJson) => {
        const values = maybeJson.map(json => (json ? JSON.parse(json) as number : 0));
        return JSON.stringify([SpeedUpType.Construction, ...values]);
    }
);

export default function SpeedUpPanel() {
    const speedupsPersister = createPersister('speedUpCalculator:speedUps', new SpeedUpSet(SpeedUpType.Construction),
        set => JSON.stringify(set.toSerializable()),
        json => SpeedUpSet.fromSerializable(JSON.parse(json)));
    const [speedups, setSpeedups] = useState(speedupsPersister.load);
    useEffect(() => speedupsPersister.save(speedups), [speedupsPersister, speedups]);

    const timespan = speedups.toTimeSpan();

    return (
        <section className={styles.speedUpCalculator}>
            <h2>Speed Up Calculator</h2>
            <div>
                <SpeedUpCalculator speedups={speedups} onChange={(set) => setSpeedups(set)}/>
                <div className={styles.speedUpTotal}>
                    <span className={styles.totalValue}>{minuteFormatter.format(timespan.duration / 60)}</span>
                    <span>OR</span>
                    <span className={styles.totalValue}>{timespan.format()}</span>
                    <span>
                        OR
                        <span className={styles.totalValue}>{timespan.format({withDays: true})}</span>
                    </span>
                </div>
            </div>
        </section>
    );
}

