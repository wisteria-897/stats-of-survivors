import React, { Dispatch, SetStateAction, useState } from 'react';
import { HeroGear, HeroGearSlot, HeroGears } from '../../game/heroGear';

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
    const brawlerHead = makeGearState(...useState(HeroGears[HeroGearSlot.BrawlerHead].levels[0].name));
    const brawlerBody = makeGearState(...useState(HeroGears[HeroGearSlot.BrawlerBody].levels[0].name));
    const brawlerFoot = makeGearState(...useState(HeroGears[HeroGearSlot.BrawlerFoot].levels[0].name));
    const marksmanHead = makeGearState(...useState(HeroGears[HeroGearSlot.MarksmanHead].levels[0].name));
    const marksmanBody = makeGearState(...useState(HeroGears[HeroGearSlot.MarksmanBody].levels[0].name));
    const marksmanFoot = makeGearState(...useState(HeroGears[HeroGearSlot.MarksmanFoot].levels[0].name));
    const scoutHead = makeGearState(...useState(HeroGears[HeroGearSlot.ScoutHead].levels[0].name));
    const scoutBody = makeGearState(...useState(HeroGears[HeroGearSlot.ScoutBody].levels[0].name));
    const scoutFoot = makeGearState(...useState(HeroGears[HeroGearSlot.ScoutFoot].levels[0].name));
    return (
        <div>
            <section>
                <h3>Current Gear</h3>
                <div>
                    <HeroGearSelector heroGear={HeroGears[HeroGearSlot.BrawlerHead]} gearState={brawlerHead} />
                    <HeroGearSelector heroGear={HeroGears[HeroGearSlot.BrawlerBody]} gearState={brawlerBody} />
                    <HeroGearSelector heroGear={HeroGears[HeroGearSlot.BrawlerFoot]} gearState={brawlerFoot} />
                </div>
                <div>
                    <HeroGearSelector heroGear={HeroGears[HeroGearSlot.MarksmanHead]} gearState={marksmanHead} />
                    <HeroGearSelector heroGear={HeroGears[HeroGearSlot.MarksmanBody]} gearState={marksmanBody} />
                    <HeroGearSelector heroGear={HeroGears[HeroGearSlot.MarksmanFoot]} gearState={marksmanFoot} />
                </div>
                <div>
                    <HeroGearSelector heroGear={HeroGears[HeroGearSlot.ScoutHead]} gearState={scoutHead} />
                    <HeroGearSelector heroGear={HeroGears[HeroGearSlot.ScoutBody]} gearState={scoutBody} />
                    <HeroGearSelector heroGear={HeroGears[HeroGearSlot.ScoutFoot]} gearState={scoutFoot} />
                </div>
            </section>
            <section>
                <h3>Upgrades</h3>
                <span>{HeroGears[HeroGearSlot.BrawlerHead].name} - {HeroGears[HeroGearSlot.BrawlerHead].levels.length}</span>
            </section>
        </div>
    );
}
