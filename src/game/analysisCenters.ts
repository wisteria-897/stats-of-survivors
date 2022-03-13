import { Stat, Stats } from './stat';
import { Bonus, SimpleBonusSource, SourceCategory, Tiers } from './bonus';

export enum ACType {
    ArmorLevel2         = 'Lv.2 Armor AC',
    ArmorLevel4         = 'Lv.4 Armor AC',
    BattleLevel2        = 'Lv.2 Battle AC',
    ConstructionLevel1  = 'Lv.1 Construction AC',
    ConstructionLevel3  = 'Lv.3 Construction AC',
    GatheringLevel1     = 'Lv.1 Gathering AC',
    ProductionLevel1    = 'Lv.1 Production AC',
    ResearchLevel1      = 'Lv.1 Research AC',
    ResearchLevel3      = 'Lv.3 Research AC',
    VehicleLevel3       = 'Lv.3 Vehicle AC',
    WeaponsLevel2       = 'Lv.2 Weapons AC',
    WeaponsLevel4       = 'Lv.4 Weapons AC'
}

const buildAC = (name: ACType, stats: Stat[], value: number): SimpleBonusSource => {
    const ac = {
        name,
        tier: Tiers.Common,
        category: SourceCategory.AnalysisCenters,
        bonuses: [] as Bonus[]
    };
    ac.bonuses.push(...stats.map(stat => new Bonus(stat, value, ac)));
    return ac;
}

export const AnalysisCenters: Record<ACType, SimpleBonusSource> = {
    [ACType.ArmorLevel2]: buildAC(ACType.ArmorLevel2, [Stats.TroopDefense], 5000),
    [ACType.ArmorLevel4]: buildAC(ACType.ArmorLevel4, [Stats.TroopDefense], 8000),
    [ACType.BattleLevel2]: buildAC(ACType.BattleLevel2, [Stats.TrainingSpeed], 5000),
    [ACType.ConstructionLevel1]:
        buildAC(ACType.ConstructionLevel1, [Stats.ConstructionSpeed], 5000),
    [ACType.ConstructionLevel3]:
        buildAC(ACType.ConstructionLevel3, [Stats.ConstructionSpeed], 8000),
    [ACType.GatheringLevel1]: buildAC(ACType.GatheringLevel1,
        [
            Stats.FoodGatheringSpeed,
            Stats.WoodGatheringSpeed,
            Stats.MetalGatheringSpeed,
            Stats.GasGatheringSpeed
        ], 5000),
    [ACType.ProductionLevel1]: buildAC(ACType.ProductionLevel1,
        [
            Stats.FoodProductionSpeed,
            Stats.WoodProductionSpeed,
            Stats.MetalProductionSpeed,
            Stats.GasProductionSpeed
        ], 5000),
    [ACType.ResearchLevel1]: buildAC(ACType.ResearchLevel1, [Stats.ResearchSpeed], 5000),
    [ACType.ResearchLevel3]: buildAC(ACType.ResearchLevel3, [Stats.ResearchSpeed], 8000),
    [ACType.VehicleLevel3]: buildAC(ACType.VehicleLevel3, [Stats.MarchSpeed], 15000),
    [ACType.WeaponsLevel2]: buildAC(ACType.WeaponsLevel2, [Stats.TroopAttack], 5000),
    [ACType.WeaponsLevel4]: buildAC(ACType.WeaponsLevel4, [Stats.TroopAttack], 8000)
};
console.log('Analysis Centers', AnalysisCenters);
