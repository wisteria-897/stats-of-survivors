import Registry from './registry';
import { toRoman } from '../util/roman';
import { Bonus, SourceCategory } from './bonus';
import { Stat, Stats } from './stat';

const families = new Registry((family: AllianceTechFamily) => family.name);

export enum AllianceTechTree {
    Development,
    Territory,
    Battle
};

export class AllianceTechFamily {
    readonly name: string;
    readonly tree: AllianceTechTree;
    readonly stat: Stat;
    readonly tiers: AllianceTechTier[];

    constructor(name: string, tree: AllianceTechTree, stat: Stat, ...tierData: number[][]) {
        this.name = name;
        this.tree = tree;
        this.stat = stat;
        this.tiers = tierData.map(([maxLevel, bonusValue], i) => new AllianceTechTier(this, maxLevel, bonusValue));
        families.register(this);
    }
}

export class AllianceTechTier {
    readonly family: AllianceTechFamily;
    readonly levels: AllianceTechLevel[];

    constructor(family: AllianceTechFamily, maxLevel: number, bonusValue: number) {
        this.family = family;
        this.levels = [];
        for (let i = 1; i <= maxLevel; i++) {
            this.levels.push(new AllianceTechLevel(this, i, bonusValue));
        }
    }

    get name() {
        return this.family.name + ' x' + toRoman(this.levels.length);
    }
}

export class AllianceTechLevel {
    readonly tier: AllianceTechTier;
    readonly level: number;
    readonly bonuses: Bonus[];

    constructor(tier: AllianceTechTier, level: number, bonusValue: number) {
        this.tier = tier;
        this.level = level;
        this.bonuses = [ new Bonus(tier.family.stat, bonusValue, this) ];
    }

    get name() {
        return this.tier.name + ' ' + String(this.level);
    }

    get category() {
        return SourceCategory.AllianceTech;
    }
}

export const AllianceTechFamilies = {
    AllianceConstruction: new AllianceTechFamily("Alliance Construction",AllianceTechTree.Territory,Stats.AllianceConstructionSpeed,[5,20],[5,20],[5,20]),
    AllianceMembers: new AllianceTechFamily("Alliance Members",AllianceTechTree.Development,Stats.AllianceMembershipCapacity,[5,2],[5,4],[5,4]),
    AllianceTower: new AllianceTechFamily("Alliance Tower",AllianceTechTree.Territory,Stats.AllianceTowerCapacity,[5,18],[5,30],[5,30]),
    BuildingDurability: new AllianceTechFamily("Building Durability",AllianceTechTree.Territory,Stats.AllianceBuildingDurability,[5,1000],[5,1000],[5,1000]),
    BurningSpeed: new AllianceTechFamily("Burning Speed",AllianceTechTree.Territory,Stats.EnemyBuildingBurningSpeed,[5,20],[5,20],[5,20]),
    Construction: new AllianceTechFamily("Construction",AllianceTechTree.Development,Stats.ConstructionSpeed,[5,10],[5,10]),
    FoodGathering: new AllianceTechFamily("Food Gathering",AllianceTechTree.Development,Stats.FoodGatheringSpeed,[5,10],[5,10]),
    GasGathering: new AllianceTechFamily("Gas Gathering",AllianceTechTree.Development,Stats.GasGatheringSpeed,[5,10],[5,10]),
    HealingSpeedup: new AllianceTechFamily("Healing Speedup",AllianceTechTree.Development,Stats.HealingSpeed,[5,40]),
    HunterDefense: new AllianceTechFamily("Hunter Defense",AllianceTechTree.Battle,Stats.HunterDefense,[5,10]),
    HunterLethality: new AllianceTechFamily("Hunter Lethality",AllianceTechTree.Battle,Stats.HunterLethality,[5,10]),
    InfantryAttack: new AllianceTechFamily("Infantry Attack",AllianceTechTree.Battle,Stats.InfantryAttack,[5,10]),
    InfantryDefense: new AllianceTechFamily("Infantry Defense",AllianceTechTree.Battle,Stats.InfantryDefense,[5,10]),
    InfantryHealth: new AllianceTechFamily("Infantry Health",AllianceTechTree.Battle,Stats.InfantryHealth,[5,10]),
    InfrantryLethality: new AllianceTechFamily("Infrantry Lethality",AllianceTechTree.Battle,Stats.InfantryLethality,[5,10]),
    MarchSpeed: new AllianceTechFamily("March Speed",AllianceTechTree.Territory,Stats.MarchSpeed,[5,10]),
    MetalGathering: new AllianceTechFamily("Metal Gathering",AllianceTechTree.Development,Stats.MetalGatheringSpeed,[5,10],[5,10]),
    //OasisMarch: new AllianceTechFamily("Oasis March",AllianceTechTree.Development,[1,0]),
    //PlainsMarch: new AllianceTechFamily("Plains March",AllianceTechTree.Development,[1,0]),
    RallySlots: new AllianceTechFamily("Rally Slots",AllianceTechTree.Battle,Stats.RallyChiefCapacity,[3,1],[3,1],[4,1]),
    RangedAttack: new AllianceTechFamily("Ranged Attack",AllianceTechTree.Battle,Stats.HunterAttack,[5,10]),
    RangedHealth: new AllianceTechFamily("Ranged Health",AllianceTechTree.Battle,Stats.HunterHealth,[5,10]),
    RiderAttack: new AllianceTechFamily("Rider Attack",AllianceTechTree.Battle,Stats.RiderAttack,[5,10]),
    RiderDefense: new AllianceTechFamily("Rider Defense",AllianceTechTree.Battle,Stats.RiderDefense,[5,10]),
    RiderHealth: new AllianceTechFamily("Rider Health",AllianceTechTree.Battle,Stats.RiderHealth,[5,10]),
    RiderLethality: new AllianceTechFamily("Rider Lethality",AllianceTechTree.Battle,Stats.RiderLethality,[5,10]),
    SoloMarchSpeed: new AllianceTechFamily("Solo March Speed",AllianceTechTree.Battle,Stats.MarchSpeed,[1,10],[1,10],[1,10]),
    //Sustainability: new AllianceTechFamily("Sustainability",AllianceTechTree.Battle,[1,0]),
    TechSpeedup: new AllianceTechFamily("Tech Speedup",AllianceTechTree.Development,Stats.ResearchSpeed,[5,10],[5,10]),
    TimerHelpDuration: new AllianceTechFamily("Timer Help Duration",AllianceTechTree.Development,Stats.TimerHelpDuration,[5,30]),
    TimerHelps: new AllianceTechFamily("Timer Helps",AllianceTechTree.Development,Stats.TimerHelpCapacity,[5,1],[5,2]),
    TrainingSpeedup: new AllianceTechFamily("Training Speedup",AllianceTechTree.Development,Stats.TrainingSpeed,[5,10],[5,10]),
    TroopAttack: new AllianceTechFamily("Troop Attack",AllianceTechTree.Battle,Stats.TroopAttack,[5,10]),
    TroopDefense: new AllianceTechFamily("Troop Defense",AllianceTechTree.Battle,Stats.TroopDefense,[5,10]),
    TroopHealth: new AllianceTechFamily("Troop Health",AllianceTechTree.Battle,Stats.TroopHealth,[5,10]),
    TroopLethality: new AllianceTechFamily("Troop Lethality",AllianceTechTree.Battle,Stats.TroopLethality,[5,10]),
    //WarehouseExpansion: new AllianceTechFamily("Warehouse Expansion",AllianceTechTree.Territory,[Stats.AllianceFoodCapacity,Stats.AllianceWoodCapacity,Stats.AllianceMetalCapacity,Stats.AllianceGasCapacity],[5,500],[5,2],[5,4]),
    WoodGathering: new AllianceTechFamily("Wood Gathering",AllianceTechTree.Development,Stats.WoodGatheringSpeed,[5,10],[5,10])
};

