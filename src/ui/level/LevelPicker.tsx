import { safeParseInt } from '../../util/parse';
type LevelPickerProps = {
    label: string,
    level: number,
    min: number,
    max: number,
    onChange: (level: number) => any
}
export default function LevelPicker({label, level, min, max, onChange}: LevelPickerProps) {
    return (
        <label>
            <span>{label}</span>
            <input type="number" min={min} max={max} step="1" value={level}
                onChange={(e) => onChange(safeParseInt(e.target.value, {min, max}))} />
        </label>
    );
}
