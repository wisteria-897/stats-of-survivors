import Registry from './registry';
import { Bonus, SourceCategory } from './bonus';
import { Stat, Stats } from './stat';

const families = new Registry((family: TalentFamily) => family.name);

export enum TalentTree {
    War,
    Economy
};

export class TalentFamily {
    readonly name: string;
    readonly tree: TalentTree;
    readonly stat: Stat;
    readonly tiers: TalentTier[];

    constructor(name: string, tree: TalentTree, stat: Stat, ...tierData: number[][]) {
        this.name = name;
        this.tree = tree;
        this.stat = stat;
        this.tiers = tierData.map(([maxLevel, bonusValue], i) => new TalentTier(this, maxLevel, bonusValue));
        families.register(this);
    }
}

export class TalentTier {
    readonly family: TalentFamily;
    readonly levels: TalentLevel[];

    constructor(family: TalentFamily, maxLevel: number, bonusValue: number) {
        this.family = family;
        this.levels = [];
        for (let i = 1; i <= maxLevel; i++) {
            this.levels.push(new TalentLevel(this, i, bonusValue));
        }
    }

    get name() {
        return this.family.name + ' x' + String(this.levels.length);
    }
}

export class TalentLevel {
    readonly tier: TalentTier;
    readonly level: number;
    readonly bonuses: Bonus[];

    constructor(tier: TalentTier, level: number, bonusValue: number) {
        this.tier = tier;
        this.level = level;
        this.bonuses = [ new Bonus(tier.family.stat, bonusValue, this) ];
    }

    get name() {
        return this.tier.name + ' ' + String(this.level);
    }

    get category() {
        return SourceCategory.Talents;
    }
}

export const TalentFamilies = {
    BattleDressing: new TalentFamily("Battle Dressing",TalentTree.Economy,Stats.HealingSpeed,[3,80],[5,100],[10,120],[20,0]),
    FertilizerTech: new TalentFamily("Fertilizer Tech",TalentTree.Economy,Stats.FoodProductionSpeed,[3,12],[5,50],[10,60],[20,0]),
    FoodHaulage: new TalentFamily("Food Haulage",TalentTree.Economy,Stats.FoodGatheringSpeed,[3,20],[5,0],[10,50],[20,0]),
    HospitalCapacity: new TalentFamily("Hospital Capacity",TalentTree.Economy,Stats.HealingCapacity,[3,20],[5,60],[10,0],[20,0]),
    LoggingTech: new TalentFamily("Logging Tech",TalentTree.Economy,Stats.WoodProductionSpeed,[3,20],[5,0],[10,0],[20,0]),
    SortingTech: new TalentFamily("Sorting Tech",TalentTree.Economy,Stats.MetalProductionSpeed,[3,60],[10,0],[20,0]),
    TechImprovement: new TalentFamily("Tech Improvement",TalentTree.Economy,Stats.ResearchSpeed,[3,50],[5,50],[10,0],[20,0]),
    ToolImprovement: new TalentFamily("Tool Improvement",TalentTree.Economy,Stats.ConstructionSpeed,[3,40],[5,0],[10,0],[20,0]),
    WoodHaulage: new TalentFamily("Wood Haulage",TalentTree.Economy,Stats.WoodGatheringSpeed,[3,25],[5,0],[10,0],[20,0]),
    MetalHaulage: new TalentFamily("Metal Haulage",TalentTree.Economy,Stats.MetalGatheringSpeed,[5,50],[10,0],[20,0]),
    OilDrums: new TalentFamily("Oil Drums",TalentTree.Economy,Stats.GasProductionSpeed,[5,0],[20,0]),
    GasHaulage: new TalentFamily("Gas Haulage",TalentTree.Economy,Stats.GasGatheringSpeed,[10,0],[20,0]),
    ChargeStrategy: new TalentFamily("Charge Strategy",TalentTree.Economy,Stats.RiderLethality,[3,6],[5,10],[10,12],[20,0]),
    CloseCombat: new TalentFamily("Close Combat",TalentTree.Economy,Stats.InfantryLethality,[3,8],[5,12],[10,0],[20,0]),
    GunsBlazing: new TalentFamily("Guns Blazing",TalentTree.Economy,Stats.InfantryAttack,[3,300],[5,350],[10,0],[20,0]),
    HunterDefense: new TalentFamily("Hunter Defense",TalentTree.Economy,Stats.HunterDefense,[3,6],[5,10],[10,12],[20,0]),
    HunterProtection: new TalentFamily("Hunter Protection",TalentTree.Economy,Stats.HunterHealth,[3,6],[5,12],[10,12],[20,0]),
    InfantryHealth: new TalentFamily("Infantry Health",TalentTree.Economy,Stats.InfantryHealth,[3,8],[5,12],[10,0],[20,0]),
    MarchCapacity: new TalentFamily("March Capacity",TalentTree.Economy,Stats.MarchCapacity,[3,12],[5,0],[10,0]),
    MarchSpeed: new TalentFamily("March Speed",TalentTree.Economy,Stats.MarchSpeed,[3,10]),
    MasterMechanic: new TalentFamily("Master Mechanic",TalentTree.Economy,Stats.RiderHealth,[3,12],[5,12],[10,0],[20,0]),
    MeleeDefense: new TalentFamily("Melee Defense",TalentTree.Economy,Stats.InfantryDefense,[3,350],[5,0],[10,0],[20,0]),
    MobileAssault: new TalentFamily("Mobile Assault",TalentTree.Economy,Stats.RiderAttack,[3,10],[5,12],[10,0],[20,0]),
    PrecisionStrike: new TalentFamily("Precision Strike",TalentTree.Economy,Stats.HunterAttack,[3,12],[5,12],[10,0],[20,0]),
    RiderDefense: new TalentFamily("Rider Defense",TalentTree.Economy,Stats.RiderDefense,[3,12],[5,0],[10,0],[20,0]),
    SteadyShot: new TalentFamily("Steady Shot",TalentTree.Economy,Stats.HunterLethality,[3,0],[5,0],[10,0],[20,0]),
    TrainingCapacity: new TalentFamily("Training Capacity",TalentTree.Economy,Stats.TrainingCapacity,[5,0],[10,0]),
    TrainingSpeed: new TalentFamily("Training Speed",TalentTree.Economy,Stats.TrainingSpeed,[20,0])
};

