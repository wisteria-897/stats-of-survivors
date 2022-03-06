import React, { Dispatch, SetStateAction, useState } from 'react';
import { HeroGear, HeroGears } from '../../game/heroGear';

type GearState = { current: string, reducer: Dispatch<SetStateAction<string>>};
const makeGearState = (current: string, reducer: Dispatch<SetStateAction<string>>): GearState  => {
    return { current, reducer };
}

const makeHeroGearOptions = (heroGear: HeroGear, start: number) => {
    return heroGear.levels.map((level, i) =>
        <option key={level.name} value={level.name}>{level.name}</option>
    );
}

const HeroGearSelector = (props: {heroGear: HeroGear, gearState: GearState}) => {
    const {heroGear, gearState} = props;
    return (
        <select value={gearState.current} onChange={(e) => gearState.reducer(e.target.value)}>
            {makeHeroGearOptions(heroGear, 0)}
        </select>
    );
}

export function HeroGearPlanner() {
    const brawlerHead = makeGearState(...useState(HeroGears.BrawlerHead.levels[0].name));
    const brawlerBody = makeGearState(...useState(HeroGears.BrawlerBody.levels[0].name));
    const brawlerFoot = makeGearState(...useState(HeroGears.BrawlerFoot.levels[0].name));
    const marksmanHead = makeGearState(...useState(HeroGears.MarksmanHead.levels[0].name));
    const marksmanBody = makeGearState(...useState(HeroGears.MarksmanBody.levels[0].name));
    const marksmanFoot = makeGearState(...useState(HeroGears.MarksmanFoot.levels[0].name));
    const scoutHead = makeGearState(...useState(HeroGears.ScoutHead.levels[0].name));
    const scoutBody = makeGearState(...useState(HeroGears.ScoutBody.levels[0].name));
    const scoutFoot = makeGearState(...useState(HeroGears.ScoutFoot.levels[0].name));
    return (
        <div>
            <section>
                <h3>Current Gear</h3>
                <div>
                    <HeroGearSelector heroGear={HeroGears.BrawlerHead} gearState={brawlerHead} />
                    <HeroGearSelector heroGear={HeroGears.BrawlerBody} gearState={brawlerBody} />
                    <HeroGearSelector heroGear={HeroGears.BrawlerFoot} gearState={brawlerFoot} />
                </div>
                <div>
                    <HeroGearSelector heroGear={HeroGears.MarksmanHead} gearState={marksmanHead} />
                    <HeroGearSelector heroGear={HeroGears.MarksmanBody} gearState={marksmanBody} />
                    <HeroGearSelector heroGear={HeroGears.MarksmanFoot} gearState={marksmanFoot} />
                </div>
                <div>
                    <HeroGearSelector heroGear={HeroGears.ScoutHead} gearState={scoutHead} />
                    <HeroGearSelector heroGear={HeroGears.ScoutBody} gearState={scoutBody} />
                    <HeroGearSelector heroGear={HeroGears.ScoutFoot} gearState={scoutFoot} />
                </div>
            </section>
            <section>
                <h3>Upgrades</h3>
                <span>{HeroGears.BrawlerHead.name} - {HeroGears.BrawlerHead.levels.length}</span>
            </section>
        </div>
    );
}
