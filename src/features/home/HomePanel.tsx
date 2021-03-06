import styles from './Home.module.css';

export default function HomePanel() {
    return (
        <main className={styles.homePanel}>
            <section className={styles.subPanel}>
                <p>
                This is Wisteria's collection of tools that may or may not be useful to players of the game State of Survival. Wisteria offers zero guarantees as to the accuracy of any of these tools, use at your own risk, etc.
                </p>
                <h2>Currently Supported Features</h2>
                <ul>
                    <li>Stat calculator for chiefs/alliances. Saves chief and alliance information in your browser so you can continue to update it to match in-game improvements. The following bonus sources are currently supported:
                        <ul>
                            <li>Talents</li>
                            <li>Research</li>
                            <li>Settlement buildings up to level 30 (up to P5 for HQ and Hero Precinct)</li>
                            <li>HQ, march, and frame skins, including bonus caps</li>
                            <li>VIP level</li>
                            <li>Chief gear, including set bonuses</li>
                            <li>Badges</li>
                            <li>Hero ranks (note: secondary hero rank bonuses like Rally Troop Attack are mostly missing, since I don't have good data for them)</li>
                            <li>Hero gear; only applies in stats calculations if you select a hero of the appropriate type</li>
                            <li>Alliance tech</li>
                            <li>Analysis Centers</li>
                        </ul>
                    </li>
                    <li>Troop formation calculator: tells you how many troops of each type you need to meet a target ratio, given a march capacity. Saves custom march capcities and formation ratios in your browser for reuse.</li>
                    <li>Speed up calculator: calculates total time of speed ups, in minutes, hours:minutes:seconds, and days, hours:minutes:seconds. Saves speed up counts in your browser for reuse.</li>
                </ul>
                <h2>Wisteria's Unordered To Do List</h2>
                <ul>
                    <li>
                        Add more bonus sources:
                        <ul>
                            <li>hero levels</li>
                            <li>alliance level</li>
                            <li>alliance buildings</li>
                            <li>settlement buffs</li>
                            <li>activated skills</li>
                            <li>state and governor buffs</li>
                            <li>event buffs</li>
                        </ul>
                    </li>
                    <li>Side-by-side chief bonus comparison</li>
                    <li>Advanced formation calculator that accounts for how many troops you have in each tier</li>
                    <li>Building and research planners: calculate requirements, costs, actual time given bonuses</li>
                    <li>Upgrade guide: show available upgrades and their cost/value</li>
                    <li>Better UI for research talents, and alliance tech</li>
                    <li>Better UI for chief gear badges</li>
                    <li>Calculators for events like SOTF</li>
                </ul>
            </section>
        </main>
    );
}
