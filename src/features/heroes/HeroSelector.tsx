import { useState } from 'react';
import { HeroName, HeroRanks } from '../../game/heroes';

type HeroSelectorProps = {
    value?: HeroName | null,
    filter: (hero: HeroName) => boolean,
    onChange: (hero: HeroName | null) => void
}

const NONE_VALUE = 'None';
export default function HeroSelector({value, filter, onChange}: HeroSelectorProps) {
    const [selectedId, setSelectedId] = useState(value || NONE_VALUE);

    const onSelectChange = (value: string) => {
        setSelectedId(value);
        onChange(value === NONE_VALUE ? null : value as HeroName);
    }

    return (
        <select value={selectedId} onChange={(e) => onSelectChange(e.target.value)}>
            <option value={NONE_VALUE}>&lt;None&gt;</option>
            {Object.keys(HeroRanks).filter(name => filter(name as HeroName)).map(name => (
                <option key={name} value={name}>{name}</option>
            ))}
        </select>
    );
}
