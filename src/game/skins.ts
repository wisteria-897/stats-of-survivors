import { Stat, Stats } from './stat';
import { aggregateSimpleBonuses, Bonus, SimpleBonusSource, SourceCategory, Tiers } from './bonus';

export enum SkinType {
    Frame = 'Frame',
    HQ    = 'HQ',
    March = 'March'
}

export type Skin = SimpleBonusSource & {
    type: SkinType
}

const mapify = (list: Skin[]): Record<string, Skin> => {
    return list.reduce((map, item) => {
        map[item.name] = item;
        return map;
    }, {} as Record<string, Skin>);
}

const buildSkin = (name: string, type: SkinType, stat: Stat, value: number): Skin => {
    const skin = {name, type, tier: Tiers.Common, category: SourceCategory.Skins, bonuses: []} as Skin;
    skin.bonuses.push(new Bonus(stat, value, skin));
    return skin;
}

const buildFrameSkin = (name: string, stat: Stat, value: number): Skin => {
    return buildSkin(name, SkinType.Frame, stat, value);
}

const buildMarchSkin = (name: string, stat: Stat, value: number): Skin => {
    return buildSkin(name, SkinType.March, stat, value);
}

const buildHQSkin = (name: string, stat: Stat, value: number): Skin => {
    return buildSkin(name, SkinType.HQ, stat, value);
}

const frameSkinData: [string, Stat, number][] = [
    ['Advanced Fortress Fight Frame', Stats.TroopAttack, 1000],
    ['Crazy Carnival Frame', Stats.TroopDefense, 2000],
    ['Elite Fortress Fight Frame', Stats.TroopAttack, 1000],
    ['Epic Fortress Fight Frame', Stats.TroopAttack, 2000],
    ['Fire Fury', Stats.TroopAttack, 1500],
    ['Glory of Survivors', Stats.MarchCapacity, 700],
    ['Heartbeat Stage', Stats.TroopDefense, 2000],
    ['Light of Survivors', Stats.MarchCapacity, 1000],
    ['Lunar New Year Frame', Stats.TroopDefense, 2000],
    ['March Festival', Stats.TroopDefense, 2000],
    ['Screaming Pumpkin Head', Stats.TroopDefense, 2000],
    ['Springtime Wishes', Stats.TroopDefense, 2000],
    ['Spirit of Competition', Stats.TroopDefense, 1500],
    ['Spirit of Competition (Advanced)', Stats.TroopDefense, 2000]
];
export const FrameSkins: Record<string, Skin> = mapify(frameSkinData.map(args => buildFrameSkin(...args)));

const hqSkinData: [string, Stat, number][] = [
    ['City of Love', Stats.TroopAttack, 2500],
    ['City of Roses', Stats.TroopAttack, 2000],
    ['Dragon City (Happiness)', Stats.TroopAttack, 2500],
    ['Dragon City (Luck)', Stats.TroopAttack, 2000],
    ['Fire Fury', Stats.FoodProductionSpeed, 5000],
    ['Golden Pavilion', Stats.TroopAttack, 2500],
    ['Haunted HQ', Stats.TroopAttack, 2000],
    ['Lunar New Year Dragon HQ', Stats.TroopAttack, 2000],
    ['Party Stage', Stats.TroopAttack, 2000],
    ['Sakura Garden', Stats.TroopAttack, 2000],
    ['Thanksgiving HQ', Stats.TroopAttack, 2000],
    ['Valentine\'s HQ', Stats.TroopAttack, 2000],
    ['Vibrant New Year', Stats.TroopAttack, 2000]
];
export const HQSkins: Record<string, Skin> = mapify(hqSkinData.map(args => buildHQSkin(...args)));

const marchSkinData: [string, Stat, number][] = [
    ['Crazy Carnival March', Stats.MarchSpeed, 5000],
    ['General Shiba Inu', Stats.MarchSpeed, 5000],
    ['Haunted March', Stats.MarchSpeed, 5000],
    ['Lunar New Year Lion March', Stats.MarchSpeed, 5000],
    ['Nanami-themed Car', Stats.MarchSpeed, 5000],
    ['Soaring Dragon', Stats.MarchSpeed, 5000],
    ['Witching Hour', Stats.MarchSpeed, 5000]
];
export const MarchSkins: Record<string, Skin> = mapify(marchSkinData.map(args => buildMarchSkin(...args)));

const bonusCaps = {
    [Stats.TroopAttack.name]: 150000,
    [Stats.TroopDefense.name]: 150000,
    [Stats.FoodProductionSpeed.name]: 20000,
    [Stats.MarchSpeed.name]: 125000
};

export const aggregateSkinBonuses = (
    hqSkinState: Record<string, boolean>,
    marchSkinState: Record<string, boolean>,
    frameSkinState: Record<string, boolean>
): Bonus[] => {
    const totals: Record<string, number> = {};
    const bonuses = [
        ...aggregateSimpleBonuses(hqSkinState, HQSkins),
        ...aggregateSimpleBonuses(marchSkinState, MarchSkins),
        ...aggregateSimpleBonuses(frameSkinState, FrameSkins)
    ];
    return bonuses.map(bonus => {
        const statName = bonus.stat.name;
        if (!(statName in totals)) {
            totals[statName] = 0;
        }
        totals[statName] += bonus.value;
        if (statName in bonusCaps && totals[statName] > bonusCaps[statName]) {
            const cappedValue = Math.max(0, bonus.value + bonusCaps[statName] - totals[statName]);
            return new Bonus(bonus.stat, cappedValue, bonus.source);
        }
        return bonus;
    });
}
