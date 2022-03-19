import {
    SourceCategory,
    StatBonusProviderLevelImpl,
    StatLeveledBonusProviderImpl
} from './bonus';
import { Stat, Stats } from './stat';
import { anyOf, hasBonusLevel, noOp } from './requirements';
import { Chief } from '../features/chief/chiefSlice';

export enum TalentTree {
    War     = 'War',
    Economy = 'Economy'
};

export enum TalentName {
    BattleDressing3    = 'Battle Dressing x3',
    BattleDressing5    = 'Battle Dressing x5',
    BattleDressing10   = 'Battle Dressing x10',
    BattleDressing20   = 'Battle Dressing x20',
    ChargeStrategy3    = 'Charge Strategy x3',
    ChargeStrategy5    = 'Charge Strategy x5',
    ChargeStrategy10   = 'Charge Strategy x10',
    ChargeStrategy20   = 'Charge Strategy x20',
    CloseCombat3       = 'Close Combat x3',
    CloseCombat5       = 'Close Combat x5',
    CloseCombat10      = 'Close Combat x10',
    CloseCombat20      = 'Close Combat x20',
    EmergencyDressing  = 'Emergency Dressing',
    FertilizerTech3    = 'Fertilizer Tech x3',
    FertilizerTech5    = 'Fertilizer Tech x5',
    FertilizerTech10   = 'Fertilizer Tech x10',
    FertilizerTech20   = 'Fertilizer Tech x20',
    FoodHaulage3       = 'Food Haulage x3',
    FoodHaulage5       = 'Food Haulage x5',
    FoodHaulage10      = 'Food Haulage x10',
    FoodHaulage20      = 'Food Haulage x20',
    GasHaulage10       = 'Gas Haulage x10',
    GasHaulage20       = 'Gas Haulage x20',
    GunsBlazing3       = 'Guns Blazing x3',
    GunsBlazing5       = 'Guns Blazing x5',
    GunsBlazing10      = 'Guns Blazing x10',
    GunsBlazing20      = 'Guns Blazing x20',
    HospitalCapacity3  = 'Hospital Capacity x3',
    HospitalCapacity5  = 'Hospital Capacity x5',
    HospitalCapacity10 = 'Hospital Capacity x10',
    HospitalCapacity20 = 'Hospital Capacity x20',
    HunterDefense3     = 'Hunter Defense x3',
    HunterDefense5     = 'Hunter Defense x5',
    HunterDefense10    = 'Hunter Defense x10',
    HunterDefense20    = 'Hunter Defense x20',
    HunterProtection3  = 'Hunter Protection x3',
    HunterProtection5  = 'Hunter Protection x5',
    HunterProtection10 = 'Hunter Protection x10',
    HunterProtection20 = 'Hunter Protection x20',
    InfantryHealth3    = 'Infantry Health x3',
    InfantryHealth5    = 'Infantry Health x5',
    InfantryHealth10   = 'Infantry Health x10',
    InfantryHealth20   = 'Infantry Health x20',
    InstantCollect     = 'Instant Collect',
    InstantHealing     = 'Instant Healing',
    LoggingTech3       = 'Logging Tech x3',
    LoggingTech5       = 'Logging Tech x5',
    LoggingTech10      = 'Logging Tech x10',
    LoggingTech20      = 'Logging Tech x20',
    MarchCapacity3     = 'March Capacity x3',
    MarchCapacity5     = 'March Capacity x5',
    MarchCapacity10    = 'March Capacity x10',
    MarchSpeed3        = 'March Speed x3',
    MassiveMarch       = 'Massive March',
    MasterMechanic3    = 'Master Mechanic x3',
    MasterMechanic5    = 'Master Mechanic x5',
    MasterMechanic10   = 'Master Mechanic x10',
    MasterMechanic20   = 'Master Mechanic x20',
    MeleeDefense3      = 'Melee Defense x3',
    MeleeDefense5      = 'Melee Defense x5',
    MeleeDefense10     = 'Melee Defense x10',
    MeleeDefense20     = 'Melee Defense x20',
    MetalHaulage5      = 'Metal Haulage x5',
    MetalHaulage10     = 'Metal Haulage x10',
    MetalHaulage20     = 'Metal Haulage x20',
    MobileAssault3     = 'Mobile Assault x3',
    MobileAssault5     = 'Mobile Assault x5',
    MobileAssault10    = 'Mobile Assault x10',
    MobileAssault20    = 'Mobile Assault x20',
    OilDrums5          = 'Oil Drums x5',
    OilDrums20         = 'Oil Drums x20',
    PrecisionStrike3   = 'Precision Strike x3',
    PrecisionStrike5   = 'Precision Strike x5',
    PrecisionStrike10  = 'Precision Strike x10',
    PrecisionStrike20  = 'Precision Strike x20',
    RapidDevelopment   = 'Rapid Development',
    RiderDefense3      = 'Rider Defense x3',
    RiderDefense5      = 'Rider Defense x5',
    RiderDefense10     = 'Rider Defense x10',
    RiderDefense20     = 'Rider Defense x20',
    SortingTech3       = 'Sorting Tech x3',
    SortingTech10      = 'Sorting Tech x10',
    SortingTech20      = 'Sorting Tech x20',
    SteadyShot3        = 'Steady Shot x3',
    SteadyShot5        = 'Steady Shot x5',
    SteadyShot10       = 'Steady Shot x10',
    SteadyShot20       = 'Steady Shot x20',
    TechImprovement3   = 'Tech Improvement x3',
    TechImprovement5   = 'Tech Improvement x5',
    TechImprovement10  = 'Tech Improvement x10',
    TechImprovement20  = 'Tech Improvement x20',
    ToolImprovement3   = 'Tool Improvement x3',
    ToolImprovement5   = 'Tool Improvement x5',
    ToolImprovement10  = 'Tool Improvement x10',
    ToolImprovement20  = 'Tool Improvement x20',
    TrainingCapacity5  = 'Training Capacity x5',
    TrainingCapacity10 = 'Training Capacity x10',
    TrainingSpeed20    = 'Training Speed x20',
    UrgentRecall       = 'Urgent Recall',
    WoodHaulage3       = 'Wood Haulage x3',
    WoodHaulage5       = 'Wood Haulage x5',
    WoodHaulage10      = 'Wood Haulage x10',
    WoodHaulage20      = 'Wood Haulage x20'
}

const getMaxLevel = (talentName: TalentName) => Talents[talentName].levels.length;
const getChiefTalents = (chief: Chief) => chief.talents;

type LevelData = {
    maxLevel: number;
    stat: Stat;
    bonusValue: number;
}

export class Talent extends StatLeveledBonusProviderImpl<Chief, TalentName, TalentLevel> {
    readonly tree: TalentTree;

    constructor(name: TalentName, tree: TalentTree, requirements: TalentName[], levelData?: LevelData) {
        const bonusValues = (!!levelData
            ? 'a'.repeat(levelData.maxLevel).split('').map(_ => [levelData.bonusValue])
            : [[]]
        );
        const stats = (!!levelData ? [levelData.stat] : []);
        const reqs = (requirements.length === 0 
            ? noOp
            : anyOf(...requirements.map(talentName => hasBonusLevel(talentName, getMaxLevel, getChiefTalents)))
        );
        super(name, stats, bonusValues.map(bv => ({bonusValues: bv})), reqs);
        this.tree = tree;
    }

    get category() {
        return SourceCategory.Talents;
    }

    get levelClass() {
        return TalentLevel;
    }
}

export class StatTalent extends Talent {
    constructor(name: TalentName, tree: TalentTree, stat: Stat, maxLevel: number, bonusValue: number, requirements: TalentName[]) {
        super(name, tree, requirements, {maxLevel, stat, bonusValue});
    }
}

export class TalentLevel extends StatBonusProviderLevelImpl<Chief, Talent> {
    selectLevels(chief: Chief) {
        return chief.talents;
    }
}

export const Talents = {
    [TalentName.BattleDressing3]: new StatTalent(TalentName.BattleDressing3, TalentTree.Economy, Stats.HealingSpeed, 3, 8000, [TalentName.TechImprovement3]),
    [TalentName.BattleDressing5]: new StatTalent(TalentName.BattleDressing5, TalentTree.Economy, Stats.HealingSpeed, 5, 10000, [TalentName.OilDrums5]),
    [TalentName.BattleDressing10]: new StatTalent(TalentName.BattleDressing10, TalentTree.Economy, Stats.HealingSpeed, 10, 12000, [TalentName.RapidDevelopment]),
    [TalentName.BattleDressing20]: new StatTalent(TalentName.BattleDressing20, TalentTree.Economy, Stats.HealingSpeed, 20, 15000, [TalentName.InstantHealing]),
    [TalentName.ChargeStrategy3]: new StatTalent(TalentName.ChargeStrategy3, TalentTree.War, Stats.RiderLethality, 3, 400, [TalentName.MarchCapacity3]),
    [TalentName.ChargeStrategy5]: new StatTalent(TalentName.ChargeStrategy5, TalentTree.War, Stats.RiderLethality, 5, 800, [TalentName.MarchCapacity5]),
    [TalentName.ChargeStrategy10]: new StatTalent(TalentName.ChargeStrategy10, TalentTree.War, Stats.RiderLethality, 10, 1200, [TalentName.MarchCapacity10]),
    [TalentName.ChargeStrategy20]: new StatTalent(TalentName.ChargeStrategy20, TalentTree.War, Stats.RiderLethality, 20, 1200, [TalentName.TrainingSpeed20]),
    [TalentName.CloseCombat3]: new StatTalent(TalentName.CloseCombat3, TalentTree.War, Stats.InfantryLethality, 3, 300, [TalentName.MarchSpeed3]),
    [TalentName.CloseCombat5]: new StatTalent(TalentName.CloseCombat5, TalentTree.War, Stats.InfantryLethality, 5, 800, [TalentName.MarchCapacity5]),
    [TalentName.CloseCombat10]: new StatTalent(TalentName.CloseCombat10, TalentTree.War, Stats.InfantryLethality, 10, 1000, [TalentName.MassiveMarch]),
    [TalentName.CloseCombat20]: new StatTalent(TalentName.CloseCombat20, TalentTree.War, Stats.InfantryLethality, 20, 1200, [TalentName.TrainingSpeed20]),
    [TalentName.EmergencyDressing]: new Talent(TalentName.EmergencyDressing, TalentTree.War, [TalentName.HunterDefense10,TalentName.HunterProtection10]),
    [TalentName.FertilizerTech3]: new StatTalent(TalentName.FertilizerTech3, TalentTree.Economy, Stats.FoodProductionSpeed, 3, 2000, [TalentName.ToolImprovement3]),
    [TalentName.FertilizerTech5]: new StatTalent(TalentName.FertilizerTech5, TalentTree.Economy, Stats.FoodProductionSpeed, 5, 6000, [TalentName.ToolImprovement5]),
    [TalentName.FertilizerTech10]: new StatTalent(TalentName.FertilizerTech10, TalentTree.Economy, Stats.FoodProductionSpeed, 10, 8000, [TalentName.ToolImprovement10]),
    [TalentName.FertilizerTech20]: new StatTalent(TalentName.FertilizerTech20, TalentTree.Economy, Stats.FoodProductionSpeed, 20, 10000, [TalentName.ToolImprovement20]),
    [TalentName.FoodHaulage3]: new StatTalent(TalentName.FoodHaulage3, TalentTree.Economy, Stats.FoodGatheringSpeed, 3, 1200, [TalentName.FertilizerTech3,TalentName.LoggingTech3]),
    [TalentName.FoodHaulage5]: new StatTalent(TalentName.FoodHaulage5, TalentTree.Economy, Stats.FoodGatheringSpeed, 5, 5000, [TalentName.ToolImprovement5]),
    [TalentName.FoodHaulage10]: new StatTalent(TalentName.FoodHaulage10, TalentTree.Economy, Stats.FoodGatheringSpeed, 10, 6000, [TalentName.ToolImprovement10]),
    [TalentName.FoodHaulage20]: new StatTalent(TalentName.FoodHaulage20, TalentTree.Economy, Stats.FoodGatheringSpeed, 20, 8000, [TalentName.FertilizerTech20]),
    [TalentName.GasHaulage10]: new StatTalent(TalentName.GasHaulage10, TalentTree.Economy, Stats.GasGatheringSpeed, 10, 5000, [TalentName.LoggingTech10,TalentName.WoodHaulage10]),
    [TalentName.GasHaulage20]: new StatTalent(TalentName.GasHaulage20, TalentTree.Economy, Stats.GasGatheringSpeed, 20, 8000, [TalentName.TechImprovement20]),
    [TalentName.GunsBlazing3]: new StatTalent(TalentName.GunsBlazing3, TalentTree.War, Stats.InfantryAttack, 3, 300, [TalentName.MarchSpeed3]),
    [TalentName.GunsBlazing5]: new StatTalent(TalentName.GunsBlazing5, TalentTree.War, Stats.InfantryAttack, 5, 600, [TalentName.TrainingCapacity5]),
    [TalentName.GunsBlazing10]: new StatTalent(TalentName.GunsBlazing10, TalentTree.War, Stats.InfantryAttack, 10, 1000, [TalentName.MassiveMarch]),
    [TalentName.GunsBlazing20]: new StatTalent(TalentName.GunsBlazing20, TalentTree.War, Stats.InfantryAttack, 20, 1200, [TalentName.EmergencyDressing]),
    [TalentName.HospitalCapacity3]: new StatTalent(TalentName.HospitalCapacity3, TalentTree.Economy, Stats.HealingCapacity, 3, 50, [TalentName.TechImprovement3]),
    [TalentName.HospitalCapacity5]: new StatTalent(TalentName.HospitalCapacity5, TalentTree.Economy, Stats.HealingCapacity, 5, 50, [TalentName.OilDrums5]),
    [TalentName.HospitalCapacity10]: new StatTalent(TalentName.HospitalCapacity10, TalentTree.Economy, Stats.HealingCapacity, 10, 50, [TalentName.RapidDevelopment]),
    [TalentName.HospitalCapacity20]: new StatTalent(TalentName.HospitalCapacity20, TalentTree.Economy, Stats.HealingCapacity, 20, 50, [TalentName.InstantHealing]),
    [TalentName.HunterDefense3]: new StatTalent(TalentName.HunterDefense3, TalentTree.War, Stats.HunterDefense, 3, 500, [TalentName.PrecisionStrike3]),
    [TalentName.HunterDefense5]: new StatTalent(TalentName.HunterDefense5, TalentTree.War, Stats.HunterDefense, 5, 600, [TalentName.PrecisionStrike5]),
    [TalentName.HunterDefense10]: new StatTalent(TalentName.HunterDefense10, TalentTree.War, Stats.HunterDefense, 10, 1200, [TalentName.PrecisionStrike10]),
    [TalentName.HunterDefense20]: new StatTalent(TalentName.HunterDefense20, TalentTree.War, Stats.HunterDefense, 20, 1200, [TalentName.PrecisionStrike20]),
    [TalentName.HunterProtection3]: new StatTalent(TalentName.HunterProtection3, TalentTree.War, Stats.HunterHealth, 3, 500, [TalentName.SteadyShot3]),
    [TalentName.HunterProtection5]: new StatTalent(TalentName.HunterProtection5, TalentTree.War, Stats.HunterHealth, 5, 800, [TalentName.SteadyShot5]),
    [TalentName.HunterProtection10]: new StatTalent(TalentName.HunterProtection10, TalentTree.War, Stats.HunterHealth, 10, 1200, [TalentName.SteadyShot10]),
    [TalentName.HunterProtection20]: new StatTalent(TalentName.HunterProtection20, TalentTree.War, Stats.HunterHealth, 20, 1200, [TalentName.SteadyShot20]),
    [TalentName.InfantryHealth3]: new StatTalent(TalentName.InfantryHealth3, TalentTree.War, Stats.InfantryHealth, 3, 300, [TalentName.CloseCombat3]),
    [TalentName.InfantryHealth5]: new StatTalent(TalentName.InfantryHealth5, TalentTree.War, Stats.InfantryHealth, 5, 800, [TalentName.CloseCombat5]),
    [TalentName.InfantryHealth10]: new StatTalent(TalentName.InfantryHealth10, TalentTree.War, Stats.InfantryHealth, 10, 1000, [TalentName.CloseCombat10]),
    [TalentName.InfantryHealth20]: new StatTalent(TalentName.InfantryHealth20, TalentTree.War, Stats.InfantryHealth, 20, 1200, [TalentName.CloseCombat20]),
    [TalentName.InstantCollect]: new Talent(TalentName.InstantCollect, TalentTree.Economy, [TalentName.HospitalCapacity3,TalentName.BattleDressing3]),
    [TalentName.InstantHealing]: new Talent(TalentName.InstantHealing, TalentTree.Economy, [TalentName.TechImprovement10]),
    [TalentName.LoggingTech3]: new StatTalent(TalentName.LoggingTech3, TalentTree.Economy, Stats.WoodProductionSpeed, 3, 2000, [TalentName.ToolImprovement3]),
    [TalentName.LoggingTech5]: new StatTalent(TalentName.LoggingTech5, TalentTree.Economy, Stats.WoodProductionSpeed, 5, 6000, [TalentName.FertilizerTech5]),
    [TalentName.LoggingTech10]: new StatTalent(TalentName.LoggingTech10, TalentTree.Economy, Stats.WoodProductionSpeed, 10, 8000, [TalentName.FertilizerTech10]),
    [TalentName.LoggingTech20]: new StatTalent(TalentName.LoggingTech20, TalentTree.Economy, Stats.WoodProductionSpeed, 20, 10000, [TalentName.ToolImprovement20]),
    [TalentName.MarchCapacity3]: new StatTalent(TalentName.MarchCapacity3, TalentTree.War, Stats.MarchCapacity, 3, 200, [TalentName.MeleeDefense3,TalentName.InfantryHealth3]),
    [TalentName.MarchCapacity5]: new StatTalent(TalentName.MarchCapacity5, TalentTree.War, Stats.MarchCapacity, 5, 300, [TalentName.MeleeDefense5,TalentName.RiderDefense5,TalentName.HunterDefense5]),
    [TalentName.MarchCapacity10]: new StatTalent(TalentName.MarchCapacity10, TalentTree.War, Stats.MarchCapacity, 10, 350, [TalentName.MeleeDefense10,TalentName.InfantryHealth10]),
    [TalentName.MarchSpeed3]: new StatTalent(TalentName.MarchSpeed3, TalentTree.War, Stats.MarchSpeed, 3, 1000, []),
    [TalentName.MassiveMarch]: new Talent(TalentName.MassiveMarch, TalentTree.War, [TalentName.InfantryHealth5,TalentName.MasterMechanic5,TalentName.HunterProtection5]),
    [TalentName.MasterMechanic3]: new StatTalent(TalentName.MasterMechanic3, TalentTree.War, Stats.RiderHealth, 3, 400, [TalentName.ChargeStrategy3]),
    [TalentName.MasterMechanic5]: new StatTalent(TalentName.MasterMechanic5, TalentTree.War, Stats.RiderHealth, 5, 800, [TalentName.ChargeStrategy5]),
    [TalentName.MasterMechanic10]: new StatTalent(TalentName.MasterMechanic10, TalentTree.War, Stats.RiderHealth, 10, 1200, [TalentName.ChargeStrategy10]),
    [TalentName.MasterMechanic20]: new StatTalent(TalentName.MasterMechanic20, TalentTree.War, Stats.RiderHealth, 20, 1200, [TalentName.ChargeStrategy20]),
    [TalentName.MeleeDefense3]: new StatTalent(TalentName.MeleeDefense3, TalentTree.War, Stats.InfantryDefense, 3, 300, [TalentName.GunsBlazing3]),
    [TalentName.MeleeDefense5]: new StatTalent(TalentName.MeleeDefense5, TalentTree.War, Stats.InfantryDefense, 5, 600, [TalentName.GunsBlazing5]),
    [TalentName.MeleeDefense10]: new StatTalent(TalentName.MeleeDefense10, TalentTree.War, Stats.InfantryDefense, 10, 1000, [TalentName.GunsBlazing10]),
    [TalentName.MeleeDefense20]: new StatTalent(TalentName.MeleeDefense20, TalentTree.War, Stats.InfantryDefense, 20, 1200, [TalentName.GunsBlazing20]),
    [TalentName.MetalHaulage5]: new StatTalent(TalentName.MetalHaulage5, TalentTree.Economy, Stats.MetalGatheringSpeed, 5, 4000, [TalentName.LoggingTech5,TalentName.WoodHaulage5]),
    [TalentName.MetalHaulage10]: new StatTalent(TalentName.MetalHaulage10, TalentTree.Economy, Stats.MetalGatheringSpeed, 10, 8000, [TalentName.GasHaulage10]),
    [TalentName.MetalHaulage20]: new StatTalent(TalentName.MetalHaulage20, TalentTree.Economy, Stats.MetalGatheringSpeed, 20, 8000, [TalentName.SortingTech20]),
    [TalentName.MobileAssault3]: new StatTalent(TalentName.MobileAssault3, TalentTree.War, Stats.RiderAttack, 3, 400, [TalentName.MarchCapacity3]),
    [TalentName.MobileAssault5]: new StatTalent(TalentName.MobileAssault5, TalentTree.War, Stats.RiderAttack, 5, 600, [TalentName.TrainingCapacity5]),
    [TalentName.MobileAssault10]: new StatTalent(TalentName.MobileAssault10, TalentTree.War, Stats.RiderAttack, 10, 1200, [TalentName.MarchCapacity10]),
    [TalentName.MobileAssault20]: new StatTalent(TalentName.MobileAssault20, TalentTree.War, Stats.RiderAttack, 20, 1200, [TalentName.EmergencyDressing]),
    [TalentName.OilDrums5]: new StatTalent(TalentName.OilDrums5, TalentTree.Economy, Stats.GasProductionSpeed, 5, 6000, [TalentName.MetalHaulage5]),
    [TalentName.OilDrums20]: new StatTalent(TalentName.OilDrums20, TalentTree.Economy, Stats.GasProductionSpeed, 20, 10000, [TalentName.TechImprovement20]),
    [TalentName.PrecisionStrike3]: new StatTalent(TalentName.PrecisionStrike3, TalentTree.War, Stats.HunterAttack, 3, 500, [TalentName.UrgentRecall]),
    [TalentName.PrecisionStrike5]: new StatTalent(TalentName.PrecisionStrike5, TalentTree.War, Stats.HunterAttack, 5, 600, [TalentName.TrainingCapacity5]),
    [TalentName.PrecisionStrike10]: new StatTalent(TalentName.PrecisionStrike10, TalentTree.War, Stats.HunterAttack, 10, 1200, [TalentName.TrainingCapacity10]),
    [TalentName.PrecisionStrike20]: new StatTalent(TalentName.PrecisionStrike20, TalentTree.War, Stats.HunterAttack, 20, 1200, [TalentName.EmergencyDressing]),
    [TalentName.RapidDevelopment]: new Talent(TalentName.RapidDevelopment, TalentTree.Economy, [TalentName.TechImprovement5]),
    [TalentName.RiderDefense3]: new StatTalent(TalentName.RiderDefense3, TalentTree.War, Stats.RiderDefense, 3, 400, [TalentName.MobileAssault3]),
    [TalentName.RiderDefense5]: new StatTalent(TalentName.RiderDefense5, TalentTree.War, Stats.RiderDefense, 5, 600, [TalentName.MobileAssault5]),
    [TalentName.RiderDefense10]: new StatTalent(TalentName.RiderDefense10, TalentTree.War, Stats.RiderDefense, 10, 1200, [TalentName.MobileAssault10]),
    [TalentName.RiderDefense20]: new StatTalent(TalentName.RiderDefense20, TalentTree.War, Stats.RiderDefense, 20, 1200, [TalentName.MobileAssault20]),
    [TalentName.SortingTech3]: new StatTalent(TalentName.SortingTech3, TalentTree.Economy, Stats.MetalProductionSpeed, 3, 4000, [TalentName.InstantCollect]),
    [TalentName.SortingTech10]: new StatTalent(TalentName.SortingTech10, TalentTree.Economy, Stats.MetalProductionSpeed, 10, 10000, [TalentName.GasHaulage10]),
    [TalentName.SortingTech20]: new StatTalent(TalentName.SortingTech20, TalentTree.Economy, Stats.MetalProductionSpeed, 20, 10000, [TalentName.ToolImprovement20]),
    [TalentName.SteadyShot3]: new StatTalent(TalentName.SteadyShot3, TalentTree.War, Stats.HunterLethality, 3, 500, [TalentName.UrgentRecall]),
    [TalentName.SteadyShot5]: new StatTalent(TalentName.SteadyShot5, TalentTree.War, Stats.HunterLethality, 5, 800, [TalentName.MarchCapacity5]),
    [TalentName.SteadyShot10]: new StatTalent(TalentName.SteadyShot10, TalentTree.War, Stats.HunterLethality, 10, 1200, [TalentName.TrainingCapacity10]),
    [TalentName.SteadyShot20]: new StatTalent(TalentName.SteadyShot20, TalentTree.War, Stats.HunterLethality, 20, 1200, [TalentName.TrainingSpeed20]),
    [TalentName.TechImprovement3]: new StatTalent(TalentName.TechImprovement3, TalentTree.Economy, Stats.ResearchSpeed, 3, 2000, [TalentName.WoodHaulage3]),
    [TalentName.TechImprovement5]: new StatTalent(TalentName.TechImprovement5, TalentTree.Economy, Stats.ResearchSpeed, 5, 2500, [TalentName.HospitalCapacity5,TalentName.BattleDressing5]),
    [TalentName.TechImprovement10]: new StatTalent(TalentName.TechImprovement10, TalentTree.Economy, Stats.ResearchSpeed, 10, 3000, [TalentName.SortingTech10,TalentName.MetalHaulage10]),
    [TalentName.TechImprovement20]: new StatTalent(TalentName.TechImprovement20, TalentTree.Economy, Stats.ResearchSpeed, 20, 3500, [TalentName.FoodHaulage20,TalentName.WoodHaulage20,TalentName.MetalHaulage20]),
    [TalentName.ToolImprovement3]: new StatTalent(TalentName.ToolImprovement3, TalentTree.Economy, Stats.ConstructionSpeed, 3, 500, []),
    [TalentName.ToolImprovement5]: new StatTalent(TalentName.ToolImprovement5, TalentTree.Economy, Stats.ConstructionSpeed, 5, 1500, [TalentName.SortingTech3]),
    [TalentName.ToolImprovement10]: new StatTalent(TalentName.ToolImprovement10, TalentTree.Economy, Stats.ConstructionSpeed, 10, 2000, [TalentName.HospitalCapacity10,TalentName.BattleDressing10]),
    [TalentName.ToolImprovement20]: new StatTalent(TalentName.ToolImprovement20, TalentTree.Economy, Stats.ConstructionSpeed, 20, 2500, [TalentName.HospitalCapacity20,TalentName.BattleDressing20]),
    [TalentName.TrainingCapacity5]: new StatTalent(TalentName.TrainingCapacity5, TalentTree.War, Stats.TrainingCapacity, 5, 5, [TalentName.HunterDefense3,TalentName.HunterProtection3]),
    [TalentName.TrainingCapacity10]: new StatTalent(TalentName.TrainingCapacity10, TalentTree.War, Stats.TrainingCapacity, 10, 8, [TalentName.RiderDefense10,TalentName.MasterMechanic10]),
    [TalentName.TrainingSpeed20]: new StatTalent(TalentName.TrainingSpeed20, TalentTree.War, Stats.TrainingSpeed, 20, 8000, [TalentName.MeleeDefense20,TalentName.RiderDefense20,TalentName.HunterDefense20]),
    [TalentName.UrgentRecall]: new Talent(TalentName.UrgentRecall, TalentTree.War, [TalentName.RiderDefense3,TalentName.MasterMechanic3]),
    [TalentName.WoodHaulage3]: new StatTalent(TalentName.WoodHaulage3, TalentTree.Economy, Stats.WoodGatheringSpeed, 3, 2000, [TalentName.FoodHaulage3]),
    [TalentName.WoodHaulage5]: new StatTalent(TalentName.WoodHaulage5, TalentTree.Economy, Stats.WoodGatheringSpeed, 5, 5000, [TalentName.FoodHaulage5]),
    [TalentName.WoodHaulage10]: new StatTalent(TalentName.WoodHaulage10, TalentTree.Economy, Stats.WoodGatheringSpeed, 10, 6000, [TalentName.FoodHaulage10]),
    [TalentName.WoodHaulage20]: new StatTalent(TalentName.WoodHaulage20, TalentTree.Economy, Stats.WoodGatheringSpeed, 20, 8000, [TalentName.LoggingTech20]),
};

