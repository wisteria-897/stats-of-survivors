import { Bonus, SourceCategory, Tiers } from './bonus';
import { Stat, Stats } from './stat';

export enum ResearchTechName {
    AttackTacticsI       = 'Attack Tactics I',
    AttackTacticsII      = 'Attack Tactics II',
    AttackTacticsIII     = 'Attack Tactics III',
    AttackTacticsIV      = 'Attack Tactics IV',
    AttackTacticsV       = 'Attack Tactics V',
    AttackTacticsVI      = 'Attack Tactics VI',
    BattleDressingI      = 'Battle Dressing I',
    BattleDressingII     = 'Battle Dressing II',
    BattleDressingIII    = 'Battle Dressing III',
    BattleDressingIV     = 'Battle Dressing IV',
    BattleDressingV      = 'Battle Dressing V',
    BattleDressingVI     = 'Battle Dressing VI',
    BattleDressingVII    = 'Battle Dressing VII',
    ChargeStrategyI      = 'Charge Strategy I',
    ChargeStrategyII     = 'Charge Strategy II',
    ChargeStrategyIII    = 'Charge Strategy III',
    ChargeStrategyIV     = 'Charge Strategy IV',
    ChargeStrategyV      = 'Charge Strategy V',
    ChargeStrategyVI     = 'Charge Strategy VI',
    CloseCombatI         = 'Close Combat I',
    CloseCombatII        = 'Close Combat II',
    CloseCombatIII       = 'Close Combat III',
    CloseCombatIV        = 'Close Combat IV',
    CloseCombatV         = 'Close Combat V',
    CloseCombatVI        = 'Close Combat VI',
    DefenseFormationsI   = 'Defense Formations I',
    DefenseFormationsII  = 'Defense Formations II',
    DefenseFormationsIII = 'Defense Formations III',
    DefenseFormationsIV  = 'Defense Formations IV',
    DefenseFormationsV   = 'Defense Formations V',
    DefenseFormationsVI  = 'Defense Formations VI',
    FertilizerTechI      = 'Fertilizer Tech I',
    FertilizerTechII     = 'Fertilizer Tech II',
    FertilizerTechIII    = 'Fertilizer Tech III',
    FertilizerTechIV     = 'Fertilizer Tech IV',
    FertilizerTechV      = 'Fertilizer Tech V',
    FertilizerTechVI     = 'Fertilizer Tech VI',
    FoodHaulageI         = 'Food Haulage I',
    FoodHaulageII        = 'Food Haulage II',
    FoodHaulageIII       = 'Food Haulage III',
    FoodHaulageIV        = 'Food Haulage IV',
    FoodHaulageV         = 'Food Haulage V',
    FoodHaulageVI        = 'Food Haulage VI',
    GasHaulageI          = 'Gas Haulage I',
    GasHaulageII         = 'Gas Haulage II',
    GasHaulageIII        = 'Gas Haulage III',
    GasHaulageIV         = 'Gas Haulage IV',
    GasHaulageV          = 'Gas Haulage V',
    GunsBlazingI         = 'Guns Blazing I',
    GunsBlazingII        = 'Guns Blazing II',
    GunsBlazingIII       = 'Guns Blazing III',
    GunsBlazingIV        = 'Guns Blazing IV',
    GunsBlazingV         = 'Guns Blazing V',
    GunsBlazingVI        = 'Guns Blazing VI',
    HunterDefenseI       = 'Hunter Defense I',
    HunterDefenseII      = 'Hunter Defense II',
    HunterDefenseIII     = 'Hunter Defense III',
    HunterDefenseIV      = 'Hunter Defense IV',
    HunterDefenseV       = 'Hunter Defense V',
    HunterDefenseVI      = 'Hunter Defense VI',
    HunterProtectionI    = 'Hunter Protection I',
    HunterProtectionII   = 'Hunter Protection II',
    HunterProtectionIII  = 'Hunter Protection III',
    HunterProtectionIV   = 'Hunter Protection IV',
    HunterProtectionV    = 'Hunter Protection V',
    HunterProtectionVI   = 'Hunter Protection VI',
    LeadershipI          = 'Leadership I',
    LeadershipII         = 'Leadership II',
    LeadershipIII        = 'Leadership III',
    LeadershipIV         = 'Leadership IV',
    LoggingTechI         = 'Logging Tech I',
    LoggingTechII        = 'Logging Tech II',
    LoggingTechIII       = 'Logging Tech III',
    LoggingTechIV        = 'Logging Tech IV',
    LoggingTechV         = 'Logging Tech V',
    LoggingTechVI        = 'Logging Tech VI',
    MarchCapacityI       = 'March Capacity I',
    MarchCapacityII      = 'March Capacity II',
    MarchCapacityIII     = 'March Capacity III',
    MarchCapacityIV      = 'March Capacity IV',
    MarchCapacityV       = 'March Capacity V',
    MarchCapacityVI      = 'March Capacity VI',
    MasterMechanicI      = 'Master Mechanic I',
    MasterMechanicII     = 'Master Mechanic II',
    MasterMechanicIII    = 'Master Mechanic III',
    MasterMechanicIV     = 'Master Mechanic IV',
    MasterMechanicV      = 'Master Mechanic V',
    MasterMechanicVI     = 'Master Mechanic VI',
    MeleeDefenseI        = 'Melee Defense I',
    MeleeDefenseII       = 'Melee Defense II',
    MeleeDefenseIII      = 'Melee Defense III',
    MeleeDefenseIV       = 'Melee Defense IV',
    MeleeDefenseV        = 'Melee Defense V',
    MeleeDefenseVI       = 'Melee Defense VI',
    MetalHaulageI        = 'Metal Haulage I',
    MetalHaulageII       = 'Metal Haulage II',
    MetalHaulageIII      = 'Metal Haulage III',
    MetalHaulageIV       = 'Metal Haulage IV',
    MetalHaulageV        = 'Metal Haulage V',
    MobileAssaultI       = 'Mobile Assault I',
    MobileAssaultII      = 'Mobile Assault II',
    MobileAssaultIII     = 'Mobile Assault III',
    MobileAssaultIV      = 'Mobile Assault IV',
    MobileAssaultV       = 'Mobile Assault V',
    MobileAssaultVI      = 'Mobile Assault VI',
    MoreBedsI            = 'More Beds I',
    MoreBedsII           = 'More Beds II',
    MoreBedsIII          = 'More Beds III',
    MoreBedsIV           = 'More Beds IV',
    MoreBedsV            = 'More Beds V',
    MoreBedsVI           = 'More Beds VI',
    MoreBedsVII          = 'More Beds VII',
    OilDrumsI            = 'Oil Drums I',
    OilDrumsII           = 'Oil Drums II',
    OilDrumsIII          = 'Oil Drums III',
    OilDrumsIV           = 'Oil Drums IV',
    OilDrumsV            = 'Oil Drums V',
    PrecisionStrikeI     = 'Precision Strike I',
    PrecisionStrikeII    = 'Precision Strike II',
    PrecisionStrikeIII   = 'Precision Strike III',
    PrecisionStrikeIV    = 'Precision Strike IV',
    PrecisionStrikeV     = 'Precision Strike V',
    PrecisionStrikeVI    = 'Precision Strike VI',
    RiderDefenseI        = 'Rider Defense I',
    RiderDefenseII       = 'Rider Defense II',
    RiderDefenseIII      = 'Rider Defense III',
    RiderDefenseIV       = 'Rider Defense IV',
    RiderDefenseV        = 'Rider Defense V',
    RiderDefenseVI       = 'Rider Defense VI',
    ShieldImprovementI   = 'Shield Improvement I',
    ShieldImprovementII  = 'Shield Improvement II',
    ShieldImprovementIII = 'Shield Improvement III',
    ShieldImprovementIV  = 'Shield Improvement IV',
    ShieldImprovementV   = 'Shield Improvement V',
    ShieldImprovementVI  = 'Shield Improvement VI',
    ShoottoKillI         = 'Shoot to Kill I',
    ShoottoKillII        = 'Shoot to Kill II',
    ShoottoKillIII       = 'Shoot to Kill III',
    ShoottoKillIV        = 'Shoot to Kill IV',
    ShoottoKillV         = 'Shoot to Kill V',
    ShoottoKillVI        = 'Shoot to Kill VI',
    SortingTechI         = 'Sorting Tech I',
    SortingTechII        = 'Sorting Tech II',
    SortingTechIII       = 'Sorting Tech III',
    SortingTechIV        = 'Sorting Tech IV',
    SortingTechV         = 'Sorting Tech V',
    SteadyShotI          = 'Steady Shot I',
    SteadyShotII         = 'Steady Shot II',
    SteadyShotIII        = 'Steady Shot III',
    SteadyShotIV         = 'Steady Shot IV',
    SteadyShotV          = 'Steady Shot V',
    SteadyShotVI         = 'Steady Shot VI',
    SupplyConvoyI        = 'Supply Convoy I',
    SupplyConvoyII       = 'Supply Convoy II',
    SupplyConvoyIII      = 'Supply Convoy III',
    SupplyConvoyIV       = 'Supply Convoy IV',
    SupplyConvoyV        = 'Supply Convoy V',
    SurvivalTrainingI    = 'Survival Training I',
    SurvivalTrainingII   = 'Survival Training II',
    SurvivalTrainingIII  = 'Survival Training III',
    SurvivalTrainingIV   = 'Survival Training IV',
    SurvivalTrainingV    = 'Survival Training V',
    SurvivalTrainingVI   = 'Survival Training VI',
    TechImprovementI     = 'Tech Improvement I',
    TechImprovementII    = 'Tech Improvement II',
    TechImprovementIII   = 'Tech Improvement III',
    TechImprovementIV    = 'Tech Improvement IV',
    TechImprovementV     = 'Tech Improvement V',
    TechImprovementVI    = 'Tech Improvement VI',
    TechImprovementVII   = 'Tech Improvement VII',
    ToolImprovementI     = 'Tool Improvement I',
    ToolImprovementII    = 'Tool Improvement II',
    ToolImprovementIII   = 'Tool Improvement III',
    ToolImprovementIV    = 'Tool Improvement IV',
    ToolImprovementV     = 'Tool Improvement V',
    ToolImprovementVI    = 'Tool Improvement VI',
    ToolImprovementVII   = 'Tool Improvement VII',
    TrainingRoutinesI    = 'Training Routines I',
    TrainingRoutinesII   = 'Training Routines II',
    TrainingRoutinesIII  = 'Training Routines III',
    TrainingRoutinesIV   = 'Training Routines IV',
    TrainingRoutinesV    = 'Training Routines V',
    TrainingRoutinesVI   = 'Training Routines VI',
    TrainingRoutinesVII  = 'Training Routines VII',
    TrainingYardI        = 'Training Yard I',
    TrainingYardII       = 'Training Yard II',
    TrainingYardIII      = 'Training Yard III',
    TrainingYardIV       = 'Training Yard IV',
    TrainingYardV        = 'Training Yard V',
    TrainingYardVI       = 'Training Yard VI',
    TrainingYardVII      = 'Training Yard VII',
    WoodHaulageI         = 'Wood Haulage I',
    WoodHaulageII        = 'Wood Haulage II',
    WoodHaulageIII       = 'Wood Haulage III',
    WoodHaulageIV        = 'Wood Haulage IV',
    WoodHaulageV         = 'Wood Haulage V',
    WoodHaulageVI        = 'Wood Haulage VI'
}

export class ResearchTech {
    readonly name: ResearchTechName;
    readonly stat: Stat;
    readonly levels: ResearchTechLevel[];

    constructor(name: ResearchTechName, stat: Stat, ...levelData: number[]) {
        this.name = name;
        this.stat = stat;
        this.levels = levelData.map((bonusValue, i) => new ResearchTechLevel(this, i + 1, bonusValue));
    }

    get category() {
        return SourceCategory.Research;
    }

    get stats() {
        return [this.stat];
    }
}

export class ResearchTechLevel {
    readonly tech: ResearchTech;
    readonly level: number;
    readonly bonuses: Bonus[];

    constructor(tech: ResearchTech, level: number, bonusValue: number) {
        this.tech = tech;
        this.level = level;
        this.bonuses = [ new Bonus(tech.stat, bonusValue, this) ];
    }

    get name() {
        return this.tech.name + ' ' + String(this.level);
    }

    get category() {
        return SourceCategory.Research;
    }

    get tier() {
        return Tiers.Common;
    }

    get provider() {
        return this.tech;
    }

    get tierLevel() {
        return null;
    }

    get bonusValues() {
        return this.bonuses.map(b => b.value);
    }
}

export const ResearchTechs = {
    [ResearchTechName.AttackTacticsI]: new ResearchTech(ResearchTechName.AttackTacticsI, Stats.TroopAttack, 500,500,500),
    [ResearchTechName.AttackTacticsII]: new ResearchTech(ResearchTechName.AttackTacticsII, Stats.TroopAttack, 750,750,1000),
    [ResearchTechName.AttackTacticsIII]: new ResearchTech(ResearchTechName.AttackTacticsIII, Stats.TroopAttack, 1000,1000,1000,1500),
    [ResearchTechName.AttackTacticsIV]: new ResearchTech(ResearchTechName.AttackTacticsIV, Stats.TroopAttack, 1750,1750,1750,1750,3000),
    [ResearchTechName.AttackTacticsV]: new ResearchTech(ResearchTechName.AttackTacticsV, Stats.TroopAttack, 2000,2000,2000,2000,2000,3500),
    [ResearchTechName.AttackTacticsVI]: new ResearchTech(ResearchTechName.AttackTacticsVI, Stats.TroopAttack, 1270,1270,1270,1270,1270,1280,1270,1270,1270,1270,1270,1270),
    [ResearchTechName.BattleDressingI]: new ResearchTech(ResearchTechName.BattleDressingI, Stats.HealingSpeed, 4600,4600,6000),
    [ResearchTechName.BattleDressingII]: new ResearchTech(ResearchTechName.BattleDressingII, Stats.HealingSpeed, 9000,9000,12000),
    [ResearchTechName.BattleDressingIII]: new ResearchTech(ResearchTechName.BattleDressingIII, Stats.HealingSpeed, 13400,13400,18000),
    [ResearchTechName.BattleDressingIV]: new ResearchTech(ResearchTechName.BattleDressingIV, Stats.HealingSpeed, 18000,18000,24000),
    [ResearchTechName.BattleDressingV]: new ResearchTech(ResearchTechName.BattleDressingV, Stats.HealingSpeed, 22400,22400,30000),
    [ResearchTechName.BattleDressingVI]: new ResearchTech(ResearchTechName.BattleDressingVI, Stats.HealingSpeed, 27000,27000,36000),
    [ResearchTechName.BattleDressingVII]: new ResearchTech(ResearchTechName.BattleDressingVII, Stats.HealingSpeed, 27000,27000,36000),
    [ResearchTechName.ChargeStrategyI]: new ResearchTech(ResearchTechName.ChargeStrategyI, Stats.RiderLethality, 1250,1250,1500),
    [ResearchTechName.ChargeStrategyII]: new ResearchTech(ResearchTechName.ChargeStrategyII, Stats.RiderLethality, 1750,1750,2000),
    [ResearchTechName.ChargeStrategyIII]: new ResearchTech(ResearchTechName.ChargeStrategyIII, Stats.RiderLethality, 2500,2500,2500,4000),
    [ResearchTechName.ChargeStrategyIV]: new ResearchTech(ResearchTechName.ChargeStrategyIV, Stats.RiderLethality, 4000,4000,4000,4000,6500),
    [ResearchTechName.ChargeStrategyV]: new ResearchTech(ResearchTechName.ChargeStrategyV, Stats.RiderLethality, 4750,4750,4750,4750,4750,8000),
    [ResearchTechName.ChargeStrategyVI]: new ResearchTech(ResearchTechName.ChargeStrategyVI, Stats.RiderLethality, 3040,3040,3050,3040,3040,3040,3040,3040,3050,3040,3040,3040),
    [ResearchTechName.CloseCombatI]: new ResearchTech(ResearchTechName.CloseCombatI, Stats.InfantryLethality, 1250,1250,1500),
    [ResearchTechName.CloseCombatII]: new ResearchTech(ResearchTechName.CloseCombatII, Stats.InfantryLethality, 1750,1750,2000),
    [ResearchTechName.CloseCombatIII]: new ResearchTech(ResearchTechName.CloseCombatIII, Stats.InfantryLethality, 2500,2500,2500,4000),
    [ResearchTechName.CloseCombatIV]: new ResearchTech(ResearchTechName.CloseCombatIV, Stats.InfantryLethality, 4000,4000,4000,4000,6500),
    [ResearchTechName.CloseCombatV]: new ResearchTech(ResearchTechName.CloseCombatV, Stats.InfantryLethality, 4750,4750,4750,4750,4750,8000),
    [ResearchTechName.CloseCombatVI]: new ResearchTech(ResearchTechName.CloseCombatVI, Stats.InfantryLethality, 3040,3040,3050,3040,3040,3040,3040,3040,3050,3040,3040,3040),
    [ResearchTechName.DefenseFormationsI]: new ResearchTech(ResearchTechName.DefenseFormationsI, Stats.TroopDefense, 500,500,500),
    [ResearchTechName.DefenseFormationsII]: new ResearchTech(ResearchTechName.DefenseFormationsII, Stats.TroopDefense, 750,750,1000),
    [ResearchTechName.DefenseFormationsIII]: new ResearchTech(ResearchTechName.DefenseFormationsIII, Stats.TroopDefense, 1000,1000,1000,1500),
    [ResearchTechName.DefenseFormationsIV]: new ResearchTech(ResearchTechName.DefenseFormationsIV, Stats.TroopDefense, 1750,1750,1750,1750,3000),
    [ResearchTechName.DefenseFormationsV]: new ResearchTech(ResearchTechName.DefenseFormationsV, Stats.TroopDefense, 2000,2000,2000,2000,2000,3500),
    [ResearchTechName.DefenseFormationsVI]: new ResearchTech(ResearchTechName.DefenseFormationsVI, Stats.TroopDefense, 1270,1270,1270,1270,1270,1280,1270,1270,1270,1270,1270,1270),
    [ResearchTechName.FertilizerTechI]: new ResearchTech(ResearchTechName.FertilizerTechI, Stats.FoodProductionSpeed, 8000,8000,11000),
    [ResearchTechName.FertilizerTechII]: new ResearchTech(ResearchTechName.FertilizerTechII, Stats.FoodProductionSpeed, 8000,8000,11000),
    [ResearchTechName.FertilizerTechIII]: new ResearchTech(ResearchTechName.FertilizerTechIII, Stats.FoodProductionSpeed, 11000,11000,14500),
    [ResearchTechName.FertilizerTechIV]: new ResearchTech(ResearchTechName.FertilizerTechIV, Stats.FoodProductionSpeed, 13500,13500,18000),
    [ResearchTechName.FertilizerTechV]: new ResearchTech(ResearchTechName.FertilizerTechV, Stats.FoodProductionSpeed, 16000,16000,21500),
    [ResearchTechName.FertilizerTechVI]: new ResearchTech(ResearchTechName.FertilizerTechVI, Stats.FoodProductionSpeed, 16000,16000,21500),
    [ResearchTechName.FoodHaulageI]: new ResearchTech(ResearchTechName.FoodHaulageI, Stats.FoodGatheringSpeed, 8000,8000,11000),
    [ResearchTechName.FoodHaulageII]: new ResearchTech(ResearchTechName.FoodHaulageII, Stats.FoodGatheringSpeed, 8000,8000,11000),
    [ResearchTechName.FoodHaulageIII]: new ResearchTech(ResearchTechName.FoodHaulageIII, Stats.FoodGatheringSpeed, 11000,11000,14500),
    [ResearchTechName.FoodHaulageIV]: new ResearchTech(ResearchTechName.FoodHaulageIV, Stats.FoodGatheringSpeed, 13500,13500,18000),
    [ResearchTechName.FoodHaulageV]: new ResearchTech(ResearchTechName.FoodHaulageV, Stats.FoodGatheringSpeed, 16000,16000,21500),
    [ResearchTechName.FoodHaulageVI]: new ResearchTech(ResearchTechName.FoodHaulageVI, Stats.FoodGatheringSpeed, 16000,16000,21500),
    [ResearchTechName.GasHaulageI]: new ResearchTech(ResearchTechName.GasHaulageI, Stats.GasGatheringSpeed, 16000,16000,21500),
    [ResearchTechName.GasHaulageII]: new ResearchTech(ResearchTechName.GasHaulageII, Stats.GasGatheringSpeed, 11000,11000,14500),
    [ResearchTechName.GasHaulageIII]: new ResearchTech(ResearchTechName.GasHaulageIII, Stats.GasGatheringSpeed, 13500,13500,18000),
    [ResearchTechName.GasHaulageIV]: new ResearchTech(ResearchTechName.GasHaulageIV, Stats.GasGatheringSpeed, 16000,16000,21500),
    [ResearchTechName.GasHaulageV]: new ResearchTech(ResearchTechName.GasHaulageV, Stats.GasGatheringSpeed, 16000,16000,21500),
    [ResearchTechName.GunsBlazingI]: new ResearchTech(ResearchTechName.GunsBlazingI, Stats.InfantryAttack, 1250,1250,1500),
    [ResearchTechName.GunsBlazingII]: new ResearchTech(ResearchTechName.GunsBlazingII, Stats.InfantryAttack, 1750,1750,2000),
    [ResearchTechName.GunsBlazingIII]: new ResearchTech(ResearchTechName.GunsBlazingIII, Stats.InfantryAttack, 2500,2500,2500,4000),
    [ResearchTechName.GunsBlazingIV]: new ResearchTech(ResearchTechName.GunsBlazingIV, Stats.InfantryAttack, 4000,4000,4000,4000,6500),
    [ResearchTechName.GunsBlazingV]: new ResearchTech(ResearchTechName.GunsBlazingV, Stats.InfantryAttack, 4750,4750,4750,4750,4750,8000),
    [ResearchTechName.GunsBlazingVI]: new ResearchTech(ResearchTechName.GunsBlazingVI, Stats.InfantryAttack, 3040,3040,3050,3040,3040,3040,3040,3040,3050,3040,3040,3040),
    [ResearchTechName.HunterDefenseI]: new ResearchTech(ResearchTechName.HunterDefenseI, Stats.HunterDefense, 1250,1250,1500),
    [ResearchTechName.HunterDefenseII]: new ResearchTech(ResearchTechName.HunterDefenseII, Stats.HunterDefense, 1750,1750,2000),
    [ResearchTechName.HunterDefenseIII]: new ResearchTech(ResearchTechName.HunterDefenseIII, Stats.HunterDefense, 2500,2500,2500,4000),
    [ResearchTechName.HunterDefenseIV]: new ResearchTech(ResearchTechName.HunterDefenseIV, Stats.HunterDefense, 4000,4000,4000,4000,6500),
    [ResearchTechName.HunterDefenseV]: new ResearchTech(ResearchTechName.HunterDefenseV, Stats.HunterDefense, 4750,4750,4750,4750,4750,8000),
    [ResearchTechName.HunterDefenseVI]: new ResearchTech(ResearchTechName.HunterDefenseVI, Stats.HunterDefense, 3040,3040,3050,3040,3040,3040,3040,3040,3050,3040,3040,3040),
    [ResearchTechName.HunterProtectionI]: new ResearchTech(ResearchTechName.HunterProtectionI, Stats.HunterHealth, 1250,1250,1500),
    [ResearchTechName.HunterProtectionII]: new ResearchTech(ResearchTechName.HunterProtectionII, Stats.HunterHealth, 1750,1750,2000),
    [ResearchTechName.HunterProtectionIII]: new ResearchTech(ResearchTechName.HunterProtectionIII, Stats.HunterHealth, 2500,2500,2500,4000),
    [ResearchTechName.HunterProtectionIV]: new ResearchTech(ResearchTechName.HunterProtectionIV, Stats.HunterHealth, 4000,4000,4000,4000,6500),
    [ResearchTechName.HunterProtectionV]: new ResearchTech(ResearchTechName.HunterProtectionV, Stats.HunterHealth, 4750,4750,4750,4750,4750,8000),
    [ResearchTechName.HunterProtectionVI]: new ResearchTech(ResearchTechName.HunterProtectionVI, Stats.HunterHealth, 3040,3040,3050,3040,3040,3040,3040,3040,3050,3040,3040,3040),
    [ResearchTechName.LeadershipI]: new ResearchTech(ResearchTechName.LeadershipI, Stats.MarchCount, 1),
    [ResearchTechName.LeadershipII]: new ResearchTech(ResearchTechName.LeadershipII, Stats.MarchCount, 1),
    [ResearchTechName.LeadershipIII]: new ResearchTech(ResearchTechName.LeadershipIII, Stats.MarchCount, 1),
    [ResearchTechName.LeadershipIV]: new ResearchTech(ResearchTechName.LeadershipIV, Stats.MarchCount, 1),
    [ResearchTechName.LoggingTechI]: new ResearchTech(ResearchTechName.LoggingTechI, Stats.WoodProductionSpeed, 8000,8000,11000),
    [ResearchTechName.LoggingTechII]: new ResearchTech(ResearchTechName.LoggingTechII, Stats.WoodProductionSpeed, 8000,8000,11000),
    [ResearchTechName.LoggingTechIII]: new ResearchTech(ResearchTechName.LoggingTechIII, Stats.WoodProductionSpeed, 11000,11000,14500),
    [ResearchTechName.LoggingTechIV]: new ResearchTech(ResearchTechName.LoggingTechIV, Stats.WoodProductionSpeed, 13500,13500,18000),
    [ResearchTechName.LoggingTechV]: new ResearchTech(ResearchTechName.LoggingTechV, Stats.WoodProductionSpeed, 16000,16000,21500),
    [ResearchTechName.LoggingTechVI]: new ResearchTech(ResearchTechName.LoggingTechVI, Stats.WoodProductionSpeed, 16000,16000,21500),
    [ResearchTechName.MarchCapacityI]: new ResearchTech(ResearchTechName.MarchCapacityI, Stats.MarchCapacity, 320,320,430),
    [ResearchTechName.MarchCapacityII]: new ResearchTech(ResearchTechName.MarchCapacityII, Stats.MarchCapacity, 430,430,570),
    [ResearchTechName.MarchCapacityIII]: new ResearchTech(ResearchTechName.MarchCapacityIII, Stats.MarchCapacity, 620,620,620,990),
    [ResearchTechName.MarchCapacityIV]: new ResearchTech(ResearchTechName.MarchCapacityIV, Stats.MarchCapacity, 990,990,990,990,1700),
    [ResearchTechName.MarchCapacityV]: new ResearchTech(ResearchTechName.MarchCapacityV, Stats.MarchCapacity, 1200,1200,1200,1200,1200,2000),
    [ResearchTechName.MarchCapacityVI]: new ResearchTech(ResearchTechName.MarchCapacityVI, Stats.MarchCapacity, 1000,1000,1000,1000,1000,1000,1000,1000,1000,1000,1700,1700),
    [ResearchTechName.MasterMechanicI]: new ResearchTech(ResearchTechName.MasterMechanicI, Stats.RiderHealth, 1250,1250,1500),
    [ResearchTechName.MasterMechanicII]: new ResearchTech(ResearchTechName.MasterMechanicII, Stats.RiderHealth, 1750,1750,2000),
    [ResearchTechName.MasterMechanicIII]: new ResearchTech(ResearchTechName.MasterMechanicIII, Stats.RiderHealth, 2500,2500,2500,4000),
    [ResearchTechName.MasterMechanicIV]: new ResearchTech(ResearchTechName.MasterMechanicIV, Stats.RiderHealth, 4000,4000,4000,4000,6500),
    [ResearchTechName.MasterMechanicV]: new ResearchTech(ResearchTechName.MasterMechanicV, Stats.RiderHealth, 4750,4750,4750,4750,4750,8000),
    [ResearchTechName.MasterMechanicVI]: new ResearchTech(ResearchTechName.MasterMechanicVI, Stats.RiderHealth, 3040,3040,3050,3040,3040,3040,3040,3040,3050,3040,3040,3040),
    [ResearchTechName.MeleeDefenseI]: new ResearchTech(ResearchTechName.MeleeDefenseI, Stats.InfantryDefense, 1250,1250,1500),
    [ResearchTechName.MeleeDefenseII]: new ResearchTech(ResearchTechName.MeleeDefenseII, Stats.InfantryDefense, 1750,1750,2000),
    [ResearchTechName.MeleeDefenseIII]: new ResearchTech(ResearchTechName.MeleeDefenseIII, Stats.InfantryDefense, 2500,2500,2500,4000),
    [ResearchTechName.MeleeDefenseIV]: new ResearchTech(ResearchTechName.MeleeDefenseIV, Stats.InfantryDefense, 4000,4000,4000,4000,6500),
    [ResearchTechName.MeleeDefenseV]: new ResearchTech(ResearchTechName.MeleeDefenseV, Stats.InfantryDefense, 4750,4750,4750,4750,4750,8000),
    [ResearchTechName.MeleeDefenseVI]: new ResearchTech(ResearchTechName.MeleeDefenseVI, Stats.InfantryDefense, 3040,3040,3050,3040,3040,3040,3040,3040,3050,3040,3040,3040),
    [ResearchTechName.MetalHaulageI]: new ResearchTech(ResearchTechName.MetalHaulageI, Stats.MetalGatheringSpeed, 16000,16000,21500),
    [ResearchTechName.MetalHaulageII]: new ResearchTech(ResearchTechName.MetalHaulageII, Stats.MetalGatheringSpeed, 11000,11000,14500),
    [ResearchTechName.MetalHaulageIII]: new ResearchTech(ResearchTechName.MetalHaulageIII, Stats.MetalGatheringSpeed, 13500,13500,18000),
    [ResearchTechName.MetalHaulageIV]: new ResearchTech(ResearchTechName.MetalHaulageIV, Stats.MetalGatheringSpeed, 16000,16000,21500),
    [ResearchTechName.MetalHaulageV]: new ResearchTech(ResearchTechName.MetalHaulageV, Stats.MetalGatheringSpeed, 16000,16000,21500),
    [ResearchTechName.MobileAssaultI]: new ResearchTech(ResearchTechName.MobileAssaultI, Stats.RiderAttack, 1250,1250,1500),
    [ResearchTechName.MobileAssaultII]: new ResearchTech(ResearchTechName.MobileAssaultII, Stats.RiderAttack, 1750,1750,2000),
    [ResearchTechName.MobileAssaultIII]: new ResearchTech(ResearchTechName.MobileAssaultIII, Stats.RiderAttack, 2500,2500,2500,4000),
    [ResearchTechName.MobileAssaultIV]: new ResearchTech(ResearchTechName.MobileAssaultIV, Stats.RiderAttack, 4000,4000,4000,4000,6500),
    [ResearchTechName.MobileAssaultV]: new ResearchTech(ResearchTechName.MobileAssaultV, Stats.RiderAttack, 4750,4750,4750,4750,4750,8000),
    [ResearchTechName.MobileAssaultVI]: new ResearchTech(ResearchTechName.MobileAssaultVI, Stats.RiderAttack, 3040,3040,3050,3040,3040,3040,3040,3040,3050,3040,3040,3040),
    [ResearchTechName.MoreBedsI]: new ResearchTech(ResearchTechName.MoreBedsI, Stats.HealingCapacity, 540,540,720),
    [ResearchTechName.MoreBedsII]: new ResearchTech(ResearchTechName.MoreBedsII, Stats.HealingCapacity, 1100,1100,1400),
    [ResearchTechName.MoreBedsIII]: new ResearchTech(ResearchTechName.MoreBedsIII, Stats.HealingCapacity, 2200,2200,2900),
    [ResearchTechName.MoreBedsIV]: new ResearchTech(ResearchTechName.MoreBedsIV, Stats.HealingCapacity, 4300,4300,5800),
    [ResearchTechName.MoreBedsV]: new ResearchTech(ResearchTechName.MoreBedsV, Stats.HealingCapacity, 8600,8600,12000),
    [ResearchTechName.MoreBedsVI]: new ResearchTech(ResearchTechName.MoreBedsVI, Stats.HealingCapacity, 12000,12000,16000),
    [ResearchTechName.MoreBedsVII]: new ResearchTech(ResearchTechName.MoreBedsVII, Stats.HealingCapacity, 20000,20000,27000),
    [ResearchTechName.OilDrumsI]: new ResearchTech(ResearchTechName.OilDrumsI, Stats.GasProductionSpeed, 16000,16000,21500),
    [ResearchTechName.OilDrumsII]: new ResearchTech(ResearchTechName.OilDrumsII, Stats.GasProductionSpeed, 11000,11000,14500),
    [ResearchTechName.OilDrumsIII]: new ResearchTech(ResearchTechName.OilDrumsIII, Stats.GasProductionSpeed, 13500,13500,18000),
    [ResearchTechName.OilDrumsIV]: new ResearchTech(ResearchTechName.OilDrumsIV, Stats.GasProductionSpeed, 16000,16000,21500),
    [ResearchTechName.OilDrumsV]: new ResearchTech(ResearchTechName.OilDrumsV, Stats.GasProductionSpeed, 16000,16000,21500),
    [ResearchTechName.PrecisionStrikeI]: new ResearchTech(ResearchTechName.PrecisionStrikeI, Stats.HunterAttack, 1250,1250,1500),
    [ResearchTechName.PrecisionStrikeII]: new ResearchTech(ResearchTechName.PrecisionStrikeII, Stats.HunterAttack, 1750,1750,2000),
    [ResearchTechName.PrecisionStrikeIII]: new ResearchTech(ResearchTechName.PrecisionStrikeIII, Stats.HunterAttack, 2500,2500,2500,4000),
    [ResearchTechName.PrecisionStrikeIV]: new ResearchTech(ResearchTechName.PrecisionStrikeIV, Stats.HunterAttack, 4000,4000,4000,4000,6500),
    [ResearchTechName.PrecisionStrikeV]: new ResearchTech(ResearchTechName.PrecisionStrikeV, Stats.HunterAttack, 4750,4750,4750,4750,4750,8000),
    [ResearchTechName.PrecisionStrikeVI]: new ResearchTech(ResearchTechName.PrecisionStrikeVI, Stats.HunterAttack, 3040,3040,3050,3040,3040,3040,3040,3040,3050,3040,3040,3040),
    [ResearchTechName.RiderDefenseI]: new ResearchTech(ResearchTechName.RiderDefenseI, Stats.RiderDefense, 1250,1250,1500),
    [ResearchTechName.RiderDefenseII]: new ResearchTech(ResearchTechName.RiderDefenseII, Stats.RiderDefense, 1750,1750,2000),
    [ResearchTechName.RiderDefenseIII]: new ResearchTech(ResearchTechName.RiderDefenseIII, Stats.RiderDefense, 2500,2500,2500,4000),
    [ResearchTechName.RiderDefenseIV]: new ResearchTech(ResearchTechName.RiderDefenseIV, Stats.RiderDefense, 4000,4000,4000,4000,6500),
    [ResearchTechName.RiderDefenseV]: new ResearchTech(ResearchTechName.RiderDefenseV, Stats.RiderDefense, 4750,4750,4750,4750,4750,8000),
    [ResearchTechName.RiderDefenseVI]: new ResearchTech(ResearchTechName.RiderDefenseVI, Stats.RiderDefense, 3040,3040,3050,3040,3040,3040,3040,3040,3050,3040,3040,3040),
    [ResearchTechName.ShieldImprovementI]: new ResearchTech(ResearchTechName.ShieldImprovementI, Stats.InfantryHealth, 1250,1250,1500),
    [ResearchTechName.ShieldImprovementII]: new ResearchTech(ResearchTechName.ShieldImprovementII, Stats.InfantryHealth, 1750,1750,2000),
    [ResearchTechName.ShieldImprovementIII]: new ResearchTech(ResearchTechName.ShieldImprovementIII, Stats.InfantryHealth, 2500,2500,2500,4000),
    [ResearchTechName.ShieldImprovementIV]: new ResearchTech(ResearchTechName.ShieldImprovementIV, Stats.InfantryHealth, 4000,4000,4000,4000,6500),
    [ResearchTechName.ShieldImprovementV]: new ResearchTech(ResearchTechName.ShieldImprovementV, Stats.InfantryHealth, 4750,4750,4750,4750,4750,8000),
    [ResearchTechName.ShieldImprovementVI]: new ResearchTech(ResearchTechName.ShieldImprovementVI, Stats.InfantryHealth, 3040,3040,3050,3040,3040,3040,3040,3040,3050,3040,3040,3040),
    [ResearchTechName.ShoottoKillI]: new ResearchTech(ResearchTechName.ShoottoKillI, Stats.TroopLethality, 500,500,500),
    [ResearchTechName.ShoottoKillII]: new ResearchTech(ResearchTechName.ShoottoKillII, Stats.TroopLethality, 750,750,1000),
    [ResearchTechName.ShoottoKillIII]: new ResearchTech(ResearchTechName.ShoottoKillIII, Stats.TroopLethality, 1000,1000,1000,1500),
    [ResearchTechName.ShoottoKillIV]: new ResearchTech(ResearchTechName.ShoottoKillIV, Stats.TroopLethality, 1750,1750,1750,1750,3000),
    [ResearchTechName.ShoottoKillV]: new ResearchTech(ResearchTechName.ShoottoKillV, Stats.TroopLethality, 2000,2000,2000,2000,2000,3500),
    [ResearchTechName.ShoottoKillVI]: new ResearchTech(ResearchTechName.ShoottoKillVI, Stats.TroopLethality, 1270,1270,1270,1270,1270,1280,1270,1270,1270,1270,1270,1270),
    [ResearchTechName.SortingTechI]: new ResearchTech(ResearchTechName.SortingTechI, Stats.MetalProductionSpeed, 16000,16000,21500),
    [ResearchTechName.SortingTechII]: new ResearchTech(ResearchTechName.SortingTechII, Stats.MetalProductionSpeed, 11000,11000,14500),
    [ResearchTechName.SortingTechIII]: new ResearchTech(ResearchTechName.SortingTechIII, Stats.MetalProductionSpeed, 13500,13500,18000),
    [ResearchTechName.SortingTechIV]: new ResearchTech(ResearchTechName.SortingTechIV, Stats.MetalProductionSpeed, 16000,16000,21500),
    [ResearchTechName.SortingTechV]: new ResearchTech(ResearchTechName.SortingTechV, Stats.MetalProductionSpeed, 16000,16000,21500),
    [ResearchTechName.SteadyShotI]: new ResearchTech(ResearchTechName.SteadyShotI, Stats.HunterLethality, 1250,1250,1500),
    [ResearchTechName.SteadyShotII]: new ResearchTech(ResearchTechName.SteadyShotII, Stats.HunterLethality, 1750,1750,2000),
    [ResearchTechName.SteadyShotIII]: new ResearchTech(ResearchTechName.SteadyShotIII, Stats.HunterLethality, 2500,2500,2500,4000),
    [ResearchTechName.SteadyShotIV]: new ResearchTech(ResearchTechName.SteadyShotIV, Stats.HunterLethality, 4000,4000,4000,4000,6500),
    [ResearchTechName.SteadyShotV]: new ResearchTech(ResearchTechName.SteadyShotV, Stats.HunterLethality, 4750,4750,4750,4750,4750,8000),
    [ResearchTechName.SteadyShotVI]: new ResearchTech(ResearchTechName.SteadyShotVI, Stats.HunterLethality, 3040,3040,3050,3040,3040,3040,3040,3040,3050,3040,3040,3040),
    [ResearchTechName.SupplyConvoyI]: new ResearchTech(ResearchTechName.SupplyConvoyI, Stats.MaxDonationHonor, 4,4,4),
    [ResearchTechName.SupplyConvoyII]: new ResearchTech(ResearchTechName.SupplyConvoyII, Stats.MaxDonationHonor, 4,4,4),
    [ResearchTechName.SupplyConvoyIII]: new ResearchTech(ResearchTechName.SupplyConvoyIII, Stats.MaxDonationHonor, 4,4,4),
    [ResearchTechName.SupplyConvoyIV]: new ResearchTech(ResearchTechName.SupplyConvoyIV, Stats.MaxDonationHonor, 4,4,4),
    [ResearchTechName.SupplyConvoyV]: new ResearchTech(ResearchTechName.SupplyConvoyV, Stats.MaxDonationHonor, 4,4,4),
    [ResearchTechName.SurvivalTrainingI]: new ResearchTech(ResearchTechName.SurvivalTrainingI, Stats.TroopHealth, 500,500,500),
    [ResearchTechName.SurvivalTrainingII]: new ResearchTech(ResearchTechName.SurvivalTrainingII, Stats.TroopHealth, 750,750,1000),
    [ResearchTechName.SurvivalTrainingIII]: new ResearchTech(ResearchTechName.SurvivalTrainingIII, Stats.TroopHealth, 1000,1000,1000,1500),
    [ResearchTechName.SurvivalTrainingIV]: new ResearchTech(ResearchTechName.SurvivalTrainingIV, Stats.TroopHealth, 1750,1750,1750,1750,3000),
    [ResearchTechName.SurvivalTrainingV]: new ResearchTech(ResearchTechName.SurvivalTrainingV, Stats.TroopHealth, 2000,2000,2000,2000,2000,3500),
    [ResearchTechName.SurvivalTrainingVI]: new ResearchTech(ResearchTechName.SurvivalTrainingVI, Stats.TroopHealth, 1270,1270,1270,1270,1270,1280,1270,1270,1270,1270,1270,1270),
    [ResearchTechName.TechImprovementI]: new ResearchTech(ResearchTechName.TechImprovementI, Stats.ResearchSpeed, 400,400,500),
    [ResearchTechName.TechImprovementII]: new ResearchTech(ResearchTechName.TechImprovementII, Stats.ResearchSpeed, 600,600,1000),
    [ResearchTechName.TechImprovementIII]: new ResearchTech(ResearchTechName.TechImprovementIII, Stats.ResearchSpeed, 1000,1000,1000),
    [ResearchTechName.TechImprovementIV]: new ResearchTech(ResearchTechName.TechImprovementIV, Stats.ResearchSpeed, 1200,1200,1500),
    [ResearchTechName.TechImprovementV]: new ResearchTech(ResearchTechName.TechImprovementV, Stats.ResearchSpeed, 1600,1600,2000),
    [ResearchTechName.TechImprovementVI]: new ResearchTech(ResearchTechName.TechImprovementVI, Stats.ResearchSpeed, 1800,1800,2500),
    [ResearchTechName.TechImprovementVII]: new ResearchTech(ResearchTechName.TechImprovementVII, Stats.ResearchSpeed, 1800,1800,2500),
    [ResearchTechName.ToolImprovementI]: new ResearchTech(ResearchTechName.ToolImprovementI, Stats.ConstructionSpeed, 400,400,500),
    [ResearchTechName.ToolImprovementII]: new ResearchTech(ResearchTechName.ToolImprovementII, Stats.ConstructionSpeed, 600,600,1000),
    [ResearchTechName.ToolImprovementIII]: new ResearchTech(ResearchTechName.ToolImprovementIII, Stats.ConstructionSpeed, 1000,1000,1000),
    [ResearchTechName.ToolImprovementIV]: new ResearchTech(ResearchTechName.ToolImprovementIV, Stats.ConstructionSpeed, 1200,1200,1500),
    [ResearchTechName.ToolImprovementV]: new ResearchTech(ResearchTechName.ToolImprovementV, Stats.ConstructionSpeed, 1600,1600,2000),
    [ResearchTechName.ToolImprovementVI]: new ResearchTech(ResearchTechName.ToolImprovementVI, Stats.ConstructionSpeed, 1800,1800,2500),
    [ResearchTechName.ToolImprovementVII]: new ResearchTech(ResearchTechName.ToolImprovementVII, Stats.ConstructionSpeed, 1800,1800,2500),
    [ResearchTechName.TrainingRoutinesI]: new ResearchTech(ResearchTechName.TrainingRoutinesI, Stats.TrainingSpeed, 2200,2200,3000),
    [ResearchTechName.TrainingRoutinesII]: new ResearchTech(ResearchTechName.TrainingRoutinesII, Stats.TrainingSpeed, 4600,4600,6000),
    [ResearchTechName.TrainingRoutinesIII]: new ResearchTech(ResearchTechName.TrainingRoutinesIII, Stats.TrainingSpeed, 6800,6800,9000),
    [ResearchTechName.TrainingRoutinesIV]: new ResearchTech(ResearchTechName.TrainingRoutinesIV, Stats.TrainingSpeed, 9000,9000,12000),
    [ResearchTechName.TrainingRoutinesV]: new ResearchTech(ResearchTechName.TrainingRoutinesV, Stats.TrainingSpeed, 11200,11200,15000),
    [ResearchTechName.TrainingRoutinesVI]: new ResearchTech(ResearchTechName.TrainingRoutinesVI, Stats.TrainingSpeed, 13400,13400,18000),
    [ResearchTechName.TrainingRoutinesVII]: new ResearchTech(ResearchTechName.TrainingRoutinesVII, Stats.TrainingSpeed, 13400,13400,18000),
    [ResearchTechName.TrainingYardI]: new ResearchTech(ResearchTechName.TrainingYardI, Stats.TrainingCapacity, 2,2,3),
    [ResearchTechName.TrainingYardII]: new ResearchTech(ResearchTechName.TrainingYardII, Stats.TrainingCapacity, 4,5,6),
    [ResearchTechName.TrainingYardIII]: new ResearchTech(ResearchTechName.TrainingYardIII, Stats.TrainingCapacity, 7,7,9),
    [ResearchTechName.TrainingYardIV]: new ResearchTech(ResearchTechName.TrainingYardIV, Stats.TrainingCapacity, 9,9,12),
    [ResearchTechName.TrainingYardV]: new ResearchTech(ResearchTechName.TrainingYardV, Stats.TrainingCapacity, 11,11,15),
    [ResearchTechName.TrainingYardVI]: new ResearchTech(ResearchTechName.TrainingYardVI, Stats.TrainingCapacity, 14,14,18),
    [ResearchTechName.TrainingYardVII]: new ResearchTech(ResearchTechName.TrainingYardVII, Stats.TrainingCapacity, 14,14,18),
    [ResearchTechName.WoodHaulageI]: new ResearchTech(ResearchTechName.WoodHaulageI, Stats.WoodGatheringSpeed, 8000,8000,11000),
    [ResearchTechName.WoodHaulageII]: new ResearchTech(ResearchTechName.WoodHaulageII, Stats.WoodGatheringSpeed, 8000,8000,11000),
    [ResearchTechName.WoodHaulageIII]: new ResearchTech(ResearchTechName.WoodHaulageIII, Stats.WoodGatheringSpeed, 11000,11000,14500),
    [ResearchTechName.WoodHaulageIV]: new ResearchTech(ResearchTechName.WoodHaulageIV, Stats.WoodGatheringSpeed, 13500,13500,18000),
    [ResearchTechName.WoodHaulageV]: new ResearchTech(ResearchTechName.WoodHaulageV, Stats.WoodGatheringSpeed, 16000,16000,21500),
    [ResearchTechName.WoodHaulageVI]: new ResearchTech(ResearchTechName.WoodHaulageVI, Stats.WoodGatheringSpeed, 16000,16000,21500)
} as const;
