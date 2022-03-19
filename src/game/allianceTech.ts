import {
    StatBonusProviderLevelImpl,
    LeveledBonusProviderImpl,
    LevelData,
    SourceCategory,
} from './bonus';
import { Stat, Stats } from './stat';
import { allOf, hasBonusLevel } from './requirements';
import { Alliance } from '../features/alliance/allianceSlice';

export enum AllianceTechTree {
    Development = 'Development',
    Territory   = 'Territory',
    Battle      = 'Battle'
}

export enum AllianceTechName {
    AllianceConstructionI   = 'Alliance Construction I',
    AllianceConstructionII  = 'Alliance Construction II',
    AllianceConstructionIII = 'Alliance Construction III',
    AllianceMembersI        = 'Alliance Members I',
    AllianceMembersII       = 'Alliance Members II',
    AllianceMembersIII      = 'Alliance Members III',
    AllianceTowerI          = 'Alliance Tower I',
    AllianceTowerII         = 'Alliance Tower II',
    AllianceTowerIII        = 'Alliance Tower III',
    BuildingDurabilityI     = 'Building Durability I',
    BuildingDurabilityII    = 'Building Durability II',
    BuildingDurabilityIII   = 'Building Durability III',
    BurningSpeedI           = 'Burning Speed I',
    BurningSpeedII          = 'Burning Speed II',
    BurningSpeedIII         = 'Burning Speed III',
    ConstructionI           = 'Construction I',
    ConstructionII          = 'Construction II',
    FoodGatheringI          = 'Food Gathering I',
    FoodGatheringII         = 'Food Gathering II',
    GasGatheringI           = 'Gas Gathering I',
    GasGatheringII          = 'Gas Gathering II',
    HealingSpeedupI         = 'Healing Speedup I',
    HunterDefenseI          = 'Hunter Defense I',
    HunterLethalityI        = 'Hunter Lethality I',
    InfantryAttackI         = 'Infantry Attack I',
    InfantryDefenseI        = 'Infantry Defense I',
    InfantryHealthI         = 'Infantry Health I',
    InfantryLethalityI      = 'Infantry Lethality I',
    MarchSpeed              = 'March Speed ',
    MetalGatheringI         = 'Metal Gathering I',
    MetalGatheringII        = 'Metal Gathering II',
    OasisMarch              = 'Oasis March ',
    PlainsMarch             = 'Plains March ',
    RallySlotsI             = 'Rally Slots I',
    RallySlotsII            = 'Rally Slots II',
    RallySlotsIII           = 'Rally Slots III',
    RangedAttackI           = 'Ranged Attack I',
    RangedHealthI           = 'Ranged Health I',
    RiderAttackI            = 'Rider Attack I',
    RiderDefenseI           = 'Rider Defense I',
    RiderHealthI            = 'Rider Health I',
    RiderLethalityI         = 'Rider Lethality I',
    SoloMarchSpeedI         = 'Solo March Speed I',
    SoloMarchSpeedII        = 'Solo March Speed II',
    SoloMarchSpeedIII       = 'Solo March Speed III',
    Sustainability          = 'Sustainability ',
    TechSpeedupI            = 'Tech Speedup I',
    TechSpeedupII           = 'Tech Speedup II',
    TimerHelpDurationI      = 'Timer Help Duration I',
    TimerHelpsI             = 'Timer Helps I',
    TimerHelpsII            = 'Timer Helps II',
    TrainingSpeedupI        = 'Training Speedup I',
    TrainingSpeedupII       = 'Training Speedup II',
    TroopAttackI            = 'Troop Attack I',
    TroopDefenseI           = 'Troop Defense I',
    TroopHealthI            = 'Troop Health I',
    TroopLethalityI         = 'Troop Lethality I',
    WarehouseExpansionI     = 'Warehouse Expansion I',
    WarehouseExpansionII    = 'Warehouse Expansion II',
    WarehouseExpansionIII   = 'Warehouse Expansion III',
    WoodGatheringI          = 'Wood Gathering I',
    WoodGatheringII         = 'Wood Gathering II'
}

const hasTech = (techName: AllianceTechName, level: number) => {
    return hasBonusLevel(techName, level, (alliance: Alliance) => alliance.allianceTech);
}

type LevelInfo = {
    maxLevel: number,
    stat: Stat,
    bonusValue: number
}

export class AllianceTech extends LeveledBonusProviderImpl<
    Alliance,
    AllianceTechName,
    AllianceTechLevel,
    LevelData<Alliance>
> {
    readonly tree: AllianceTechTree;

    constructor(name: AllianceTechName, tree: AllianceTechTree, prereqs: AllianceTechName[], levelInfo?: LevelInfo) {
        const stats = levelInfo ? [levelInfo.stat] : [];

        let levelData: LevelData<Alliance>[] = [];
        if (levelInfo) {
            const {maxLevel, bonusValue} = levelInfo;
            for (let i = 0; i < maxLevel; i++) {
                levelData.push({
                    bonusValues: [bonusValue],
                    requirements: (prereqs
                        ? allOf(...prereqs.map(techName => hasTech(techName, i + 1)))
                        : undefined
                    )
                });
            }
        } else {
            levelData.push({
                bonusValues: [],
                requirements: (prereqs
                    ? allOf(...prereqs.map(techName => hasTech(techName, 1)))
                    : undefined
                )
            });
        }
        super(name, stats, levelData);
        this.tree = tree;
    }

    get category() {
        return SourceCategory.AllianceTech;
    }

    createLevel(provider: AllianceTech, level: number, stats: Stat[], levelData: LevelData<Alliance>) {
        const {bonusValues, requirements} = levelData;
        return new AllianceTechLevel(provider, level, stats, bonusValues, requirements);
    }
}

export class StatAllianceTech extends AllianceTech {
    constructor(name: AllianceTechName, tree: AllianceTechTree, stat: Stat, maxLevel: number, bonusValue: number, requirements: AllianceTechName[]) {
        super(name, tree, requirements, {maxLevel, stat, bonusValue});
    }
}

export class AllianceTechLevel extends StatBonusProviderLevelImpl<Alliance, AllianceTech> {
    selectLevels(alliance: Alliance) {
        return alliance.allianceTech;
    }
}

export const AllianceTechs = {
    [AllianceTechName.AllianceConstructionI]: new StatAllianceTech(AllianceTechName.AllianceConstructionI, AllianceTechTree.Territory, Stats.AllianceConstructionSpeed, 5, 2000, [AllianceTechName.MarchSpeed]),
    [AllianceTechName.AllianceConstructionII]: new StatAllianceTech(AllianceTechName.AllianceConstructionII, AllianceTechTree.Territory, Stats.AllianceConstructionSpeed, 5, 2000, [AllianceTechName.AllianceTowerII]),
    [AllianceTechName.AllianceConstructionIII]: new StatAllianceTech(AllianceTechName.AllianceConstructionIII, AllianceTechTree.Territory, Stats.AllianceConstructionSpeed, 5, 2000, [AllianceTechName.AllianceTowerIII]),
    [AllianceTechName.AllianceMembersI]: new StatAllianceTech(AllianceTechName.AllianceMembersI, AllianceTechTree.Development, Stats.AllianceMembershipCapacity, 5, 2, []),
    [AllianceTechName.AllianceMembersII]: new StatAllianceTech(AllianceTechName.AllianceMembersII, AllianceTechTree.Development, Stats.AllianceMembershipCapacity, 5, 4, [AllianceTechName.ConstructionI,AllianceTechName.TechSpeedupI,AllianceTechName.TimerHelpsI,AllianceTechName.TrainingSpeedupI]),
    [AllianceTechName.AllianceMembersIII]: new StatAllianceTech(AllianceTechName.AllianceMembersIII, AllianceTechTree.Development, Stats.AllianceMembershipCapacity, 5, 4, [AllianceTechName.FoodGatheringI,AllianceTechName.WoodGatheringI,AllianceTechName.MetalGatheringI,AllianceTechName.GasGatheringI]),
    [AllianceTechName.AllianceTowerI]: new StatAllianceTech(AllianceTechName.AllianceTowerI, AllianceTechTree.Territory, Stats.AllianceTowerCapacity, 5, 18, []),
    [AllianceTechName.AllianceTowerII]: new StatAllianceTech(AllianceTechName.AllianceTowerII, AllianceTechTree.Territory, Stats.AllianceTowerCapacity, 5, 30, [AllianceTechName.BuildingDurabilityI,AllianceTechName.BurningSpeedI,AllianceTechName.WarehouseExpansionI,AllianceTechName.AllianceConstructionI]),
    [AllianceTechName.AllianceTowerIII]: new StatAllianceTech(AllianceTechName.AllianceTowerIII, AllianceTechTree.Territory, Stats.AllianceTowerCapacity, 5, 30, [AllianceTechName.BuildingDurabilityII,AllianceTechName.BurningSpeedII,AllianceTechName.WarehouseExpansionII,AllianceTechName.AllianceConstructionII]),
    [AllianceTechName.BuildingDurabilityI]: new StatAllianceTech(AllianceTechName.BuildingDurabilityI, AllianceTechTree.Territory, Stats.AllianceBuildingDurability, 5, 1000, [AllianceTechName.AllianceTowerI]),
    [AllianceTechName.BuildingDurabilityII]: new StatAllianceTech(AllianceTechName.BuildingDurabilityII, AllianceTechTree.Territory, Stats.AllianceBuildingDurability, 5, 1000, [AllianceTechName.AllianceTowerII]),
    [AllianceTechName.BuildingDurabilityIII]: new StatAllianceTech(AllianceTechName.BuildingDurabilityIII, AllianceTechTree.Territory, Stats.AllianceBuildingDurability, 5, 1000, [AllianceTechName.AllianceTowerIII]),
    [AllianceTechName.BurningSpeedI]: new StatAllianceTech(AllianceTechName.BurningSpeedI, AllianceTechTree.Territory, Stats.EnemyBuildingBurningSpeed, 5, 2000, [AllianceTechName.AllianceTowerI]),
    [AllianceTechName.BurningSpeedII]: new StatAllianceTech(AllianceTechName.BurningSpeedII, AllianceTechTree.Territory, Stats.EnemyBuildingBurningSpeed, 5, 2000, [AllianceTechName.AllianceTowerII]),
    [AllianceTechName.BurningSpeedIII]: new StatAllianceTech(AllianceTechName.BurningSpeedIII, AllianceTechTree.Territory, Stats.EnemyBuildingBurningSpeed, 5, 2000, [AllianceTechName.AllianceTowerIII]),
    [AllianceTechName.ConstructionI]: new StatAllianceTech(AllianceTechName.ConstructionI, AllianceTechTree.Development, Stats.ConstructionSpeed, 5, 1000, [AllianceTechName.AllianceMembersI]),
    [AllianceTechName.ConstructionII]: new StatAllianceTech(AllianceTechName.ConstructionII, AllianceTechTree.Development, Stats.ConstructionSpeed, 5, 1000, [AllianceTechName.AllianceMembersIII]),
    [AllianceTechName.FoodGatheringI]: new StatAllianceTech(AllianceTechName.FoodGatheringI, AllianceTechTree.Development, Stats.FoodGatheringSpeed, 5, 1000, [AllianceTechName.AllianceMembersII]),
    [AllianceTechName.FoodGatheringII]: new StatAllianceTech(AllianceTechName.FoodGatheringII, AllianceTechTree.Development, Stats.FoodGatheringSpeed, 5, 1000, [AllianceTechName.HealingSpeedupI]),
    [AllianceTechName.GasGatheringI]: new StatAllianceTech(AllianceTechName.GasGatheringI, AllianceTechTree.Development, Stats.GasGatheringSpeed, 5, 1000, [AllianceTechName.AllianceMembersII]),
    [AllianceTechName.GasGatheringII]: new StatAllianceTech(AllianceTechName.GasGatheringII, AllianceTechTree.Development, Stats.GasGatheringSpeed, 5, 1000, [AllianceTechName.HealingSpeedupI]),
    [AllianceTechName.HealingSpeedupI]: new StatAllianceTech(AllianceTechName.HealingSpeedupI, AllianceTechTree.Development, Stats.HealingSpeed, 5, 4000, [AllianceTechName.ConstructionI,AllianceTechName.TechSpeedupI,AllianceTechName.TimerHelpsI,AllianceTechName.TrainingSpeedupI]),
    [AllianceTechName.HunterDefenseI]: new StatAllianceTech(AllianceTechName.HunterDefenseI, AllianceTechTree.Battle, Stats.HunterDefense, 5, 1000, [AllianceTechName.RallySlotsI]),
    [AllianceTechName.HunterLethalityI]: new StatAllianceTech(AllianceTechName.HunterLethalityI, AllianceTechTree.Battle, Stats.HunterLethality, 5, 1000, [AllianceTechName.RallySlotsII]),
    [AllianceTechName.InfantryAttackI]: new StatAllianceTech(AllianceTechName.InfantryAttackI, AllianceTechTree.Battle, Stats.InfantryAttack, 5, 1000, []),
    [AllianceTechName.InfantryDefenseI]: new StatAllianceTech(AllianceTechName.InfantryDefenseI, AllianceTechTree.Battle, Stats.InfantryDefense, 5, 1000, [AllianceTechName.RallySlotsI]),
    [AllianceTechName.InfantryHealthI]: new StatAllianceTech(AllianceTechName.InfantryHealthI, AllianceTechTree.Battle, Stats.InfantryHealth, 5, 1000, [AllianceTechName.RallySlotsIII]),
    [AllianceTechName.InfantryLethalityI]: new StatAllianceTech(AllianceTechName.InfantryLethalityI, AllianceTechTree.Battle, Stats.InfantryLethality, 5, 1000, [AllianceTechName.RallySlotsII]),
    [AllianceTechName.MarchSpeed]: new StatAllianceTech(AllianceTechName.MarchSpeed, AllianceTechTree.Territory, Stats.MarchSpeed, 5, 1000, []),
    [AllianceTechName.MetalGatheringI]: new StatAllianceTech(AllianceTechName.MetalGatheringI, AllianceTechTree.Development, Stats.MetalGatheringSpeed, 5, 1000, [AllianceTechName.AllianceMembersII]),
    [AllianceTechName.MetalGatheringII]: new StatAllianceTech(AllianceTechName.MetalGatheringII, AllianceTechTree.Development, Stats.MetalGatheringSpeed, 5, 1000, [AllianceTechName.HealingSpeedupI]),
    [AllianceTechName.OasisMarch]: new AllianceTech(AllianceTechName.OasisMarch, AllianceTechTree.Development, [AllianceTechName.AllianceMembersIII]),
    [AllianceTechName.PlainsMarch]: new AllianceTech(AllianceTechName.PlainsMarch, AllianceTechTree.Development, [AllianceTechName.AllianceMembersII]),
    [AllianceTechName.RallySlotsI]: new StatAllianceTech(AllianceTechName.RallySlotsI, AllianceTechTree.Battle, Stats.RallyChiefCapacity, 3, 1, [AllianceTechName.InfantryAttackI,AllianceTechName.RiderAttackI,AllianceTechName.RangedAttackI,AllianceTechName.TroopAttackI]),
    [AllianceTechName.RallySlotsII]: new StatAllianceTech(AllianceTechName.RallySlotsII, AllianceTechTree.Battle, Stats.RallyChiefCapacity, 3, 1, [AllianceTechName.InfantryDefenseI,AllianceTechName.RiderDefenseI,AllianceTechName.HunterDefenseI,AllianceTechName.TroopDefenseI]),
    [AllianceTechName.RallySlotsIII]: new StatAllianceTech(AllianceTechName.RallySlotsIII, AllianceTechTree.Battle, Stats.RallyChiefCapacity, 4, 1, [AllianceTechName.InfantryLethalityI,AllianceTechName.RiderLethalityI,AllianceTechName.HunterLethalityI,AllianceTechName.TroopLethalityI]),
    [AllianceTechName.RangedAttackI]: new StatAllianceTech(AllianceTechName.RangedAttackI, AllianceTechTree.Battle, Stats.HunterAttack, 5, 1000, []),
    [AllianceTechName.RangedHealthI]: new StatAllianceTech(AllianceTechName.RangedHealthI, AllianceTechTree.Battle, Stats.HunterHealth, 5, 1000, [AllianceTechName.RallySlotsIII]),
    [AllianceTechName.RiderAttackI]: new StatAllianceTech(AllianceTechName.RiderAttackI, AllianceTechTree.Battle, Stats.RiderAttack, 5, 1000, []),
    [AllianceTechName.RiderDefenseI]: new StatAllianceTech(AllianceTechName.RiderDefenseI, AllianceTechTree.Battle, Stats.RiderDefense, 5, 1000, [AllianceTechName.RallySlotsI]),
    [AllianceTechName.RiderHealthI]: new StatAllianceTech(AllianceTechName.RiderHealthI, AllianceTechTree.Battle, Stats.RiderHealth, 5, 1000, [AllianceTechName.RallySlotsIII]),
    [AllianceTechName.RiderLethalityI]: new StatAllianceTech(AllianceTechName.RiderLethalityI, AllianceTechTree.Battle, Stats.RiderLethality, 5, 1000, [AllianceTechName.RallySlotsII]),
    [AllianceTechName.SoloMarchSpeedI]: new StatAllianceTech(AllianceTechName.SoloMarchSpeedI, AllianceTechTree.Battle, Stats.MarchSpeed, 1, 1000, [AllianceTechName.RallySlotsI]),
    [AllianceTechName.SoloMarchSpeedII]: new StatAllianceTech(AllianceTechName.SoloMarchSpeedII, AllianceTechTree.Battle, Stats.MarchSpeed, 1, 1000, [AllianceTechName.RallySlotsII]),
    [AllianceTechName.SoloMarchSpeedIII]: new StatAllianceTech(AllianceTechName.SoloMarchSpeedIII, AllianceTechTree.Battle, Stats.MarchSpeed, 1, 1000, [AllianceTechName.RallySlotsIII]),
    [AllianceTechName.Sustainability]: new AllianceTech(AllianceTechName.Sustainability, AllianceTechTree.Battle, [AllianceTechName.InfantryHealthI,AllianceTechName.RiderHealthI,AllianceTechName.RangedHealthI,AllianceTechName.TroopHealthI]),
    [AllianceTechName.TechSpeedupI]: new StatAllianceTech(AllianceTechName.TechSpeedupI, AllianceTechTree.Development, Stats.ResearchSpeed, 5, 1000, [AllianceTechName.AllianceMembersI]),
    [AllianceTechName.TechSpeedupII]: new StatAllianceTech(AllianceTechName.TechSpeedupII, AllianceTechTree.Development, Stats.ResearchSpeed, 5, 1000, [AllianceTechName.AllianceMembersIII]),
    [AllianceTechName.TimerHelpDurationI]: new StatAllianceTech(AllianceTechName.TimerHelpDurationI, AllianceTechTree.Development, Stats.TimerHelpDuration, 5, 30, []),
    [AllianceTechName.TimerHelpsI]: new StatAllianceTech(AllianceTechName.TimerHelpsI, AllianceTechTree.Development, Stats.TimerHelpCapacity, 5, 1, [AllianceTechName.TimerHelpDurationI]),
    [AllianceTechName.TimerHelpsII]: new StatAllianceTech(AllianceTechName.TimerHelpsII, AllianceTechTree.Development, Stats.TimerHelpCapacity, 5, 2, [AllianceTechName.AllianceMembersIII]),
    [AllianceTechName.TrainingSpeedupI]: new StatAllianceTech(AllianceTechName.TrainingSpeedupI, AllianceTechTree.Development, Stats.TrainingSpeed, 5, 1000, [AllianceTechName.TimerHelpDurationI]),
    [AllianceTechName.TrainingSpeedupII]: new StatAllianceTech(AllianceTechName.TrainingSpeedupII, AllianceTechTree.Development, Stats.TrainingSpeed, 5, 1000, [AllianceTechName.AllianceMembersIII]),
    [AllianceTechName.TroopAttackI]: new StatAllianceTech(AllianceTechName.TroopAttackI, AllianceTechTree.Battle, Stats.TroopAttack, 5, 1000, []),
    [AllianceTechName.TroopDefenseI]: new StatAllianceTech(AllianceTechName.TroopDefenseI, AllianceTechTree.Battle, Stats.TroopDefense, 5, 1000, [AllianceTechName.RallySlotsI]),
    [AllianceTechName.TroopHealthI]: new StatAllianceTech(AllianceTechName.TroopHealthI, AllianceTechTree.Battle, Stats.TroopHealth, 5, 1000, [AllianceTechName.RallySlotsIII]),
    [AllianceTechName.TroopLethalityI]: new StatAllianceTech(AllianceTechName.TroopLethalityI, AllianceTechTree.Battle, Stats.TroopLethality, 5, 1000, [AllianceTechName.RallySlotsII]),
    [AllianceTechName.WarehouseExpansionI]: new AllianceTech(AllianceTechName.WarehouseExpansionI, AllianceTechTree.Territory, [AllianceTechName.MarchSpeed]),// Stats.Alliance warehouse capacity, 5, 5000),
    [AllianceTechName.WarehouseExpansionII]: new AllianceTech(AllianceTechName.WarehouseExpansionII, AllianceTechTree.Territory, [AllianceTechName.AllianceTowerII]),// Stats.Alliance warehouse capacity, 5, 2),
    [AllianceTechName.WarehouseExpansionIII]: new AllianceTech(AllianceTechName.WarehouseExpansionIII, AllianceTechTree.Territory, [AllianceTechName.AllianceTowerIII]),// Stats.Alliance warehouse capacity, 5, 4),
    [AllianceTechName.WoodGatheringI]: new StatAllianceTech(AllianceTechName.WoodGatheringI, AllianceTechTree.Development, Stats.WoodGatheringSpeed, 5, 1000, [AllianceTechName.AllianceMembersII]),
    [AllianceTechName.WoodGatheringII]: new StatAllianceTech(AllianceTechName.WoodGatheringII, AllianceTechTree.Development, Stats.WoodGatheringSpeed, 5, 1000, [AllianceTechName.HealingSpeedupI])
} as const;
