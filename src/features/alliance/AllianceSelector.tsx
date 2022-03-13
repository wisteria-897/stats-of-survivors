import { useState, SyntheticEvent } from 'react';
import { useAppSelector } from '../../app/hooks';
import { selectAlliances, Alliance, AllianceId } from './allianceSlice';
import styles from './Alliance.module.css';

type AllianceSelectorProps = {
    value?: AllianceId,
    onChange: (allianceId: AllianceId) => void
}

export default function AllianceSelector({value, onChange}: AllianceSelectorProps) {
    const [selectedId, setSelectedId] = useState(value || '');
    const alliances = useAppSelector(state => selectAlliances(state));

    const onSelectChange = (value: string) => {
        setSelectedId(value);
        onChange(value);
    }

    return (
        <select value={selectedId} onChange={(e) => onSelectChange(e.target.value)}
            className={styles.allianceSelector}
        >
            {alliances.map((a: Alliance) => (
                <option value={a.id}>{`[${a.tag}] - ${a.name}`}</option>
            ))}
        </select>
    );
}
