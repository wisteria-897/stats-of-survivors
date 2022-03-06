import React, { Dispatch, SetStateAction, useState } from 'react';
import { HeroGearPlanner } from '../heroGear/heroGearPlanner';

type ChestContents = { [key: string]: number };
const contents = {
    Uncommon:   {parts: 117, designs: 20} as ChestContents,
    Rare:       {parts: 233, designs: 40} as ChestContents,
    Epic:       {parts: 467, designs: 80} as ChestContents,
    Legendary:  {parts: 1167, designs: 200} as ChestContents
};

type ChestState = { selection: string, reducer: Dispatch<SetStateAction<string>>};
const makeChestState = (selection: string, reducer: Dispatch<SetStateAction<string>>): ChestState  => {
    return { selection, reducer };
}

const createContentSelectors = (chestState: ChestState[]) => {
    return chestState.map((cs, i) => 
        <select key={i} value={cs.selection} onChange={(e) => cs.reducer(e.target.value)}>
            <option value="parts">Parts</option>
            <option value="designs">Designs</option>
        </select>
    );
}

export function CustomChestPlanner() {
    const uncommon = [makeChestState(...useState('parts')),makeChestState(...useState('parts')),
        makeChestState(...useState('parts')),makeChestState(...useState('parts')),makeChestState(...useState('parts'))];
    const rare = [makeChestState(...useState('parts')),makeChestState(...useState('parts')),
        makeChestState(...useState('parts')),makeChestState(...useState('parts')),makeChestState(...useState('parts'))];
    const epic = [makeChestState(...useState('parts')),makeChestState(...useState('parts')),
        makeChestState(...useState('parts')),makeChestState(...useState('parts')),makeChestState(...useState('parts'))];
    const legendary = [makeChestState(...useState('parts')),makeChestState(...useState('parts')),
        makeChestState(...useState('parts')),makeChestState(...useState('parts')),makeChestState(...useState('parts'))];

    const totals: Map<string, number> = new Map();
    totals.set('parts', 0);
    totals.set('designs', 0);
    uncommon.forEach((chestState) => {
        const currentTotal = totals.get(chestState.selection) || 0;
        totals.set(chestState.selection, currentTotal + contents.Uncommon[chestState.selection]);
    });
    rare.forEach((chestState) => {
        const currentTotal = totals.get(chestState.selection) || 0;
        totals.set(chestState.selection, currentTotal + contents.Rare[chestState.selection]);
    });
    epic.forEach((chestState) => {
        const currentTotal = totals.get(chestState.selection) || 0;
        totals.set(chestState.selection, currentTotal + contents.Epic[chestState.selection]);
    });
    legendary.forEach((chestState) => {
        const currentTotal = totals.get(chestState.selection) || 0;
        totals.set(chestState.selection, currentTotal + contents.Legendary[chestState.selection]);
    });
    return (
        <div>
            <div>Parts: {totals.get('parts')}</div>
            <div>Designs: {totals.get('designs')}</div>
            <section>
                <fieldset>
                    <legend>Uncommon</legend>
                    {createContentSelectors(uncommon)}
                </fieldset>
                <fieldset>
                    <legend>Rare</legend>
                    {createContentSelectors(rare)}
                </fieldset>
                <fieldset>
                    <legend>Epic</legend>
                    {createContentSelectors(epic)}
                </fieldset>
                <fieldset>
                    <legend>Legendary</legend>
                    {createContentSelectors(legendary)}
                </fieldset>
            </section>
            <HeroGearPlanner/>
        </div>
    );
}
