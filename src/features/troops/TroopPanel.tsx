import React from 'react';
import { TroopFormationPlanner } from './TroopFormationPlanner';
import styles from './Troops.module.css';

export function TroopPanel() {
    return (
        <section className={styles.troopPanel}>
            <TroopFormationPlanner/>
        </section>
    );
}
