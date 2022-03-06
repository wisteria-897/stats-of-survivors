import Registry from './registry';
import { toRoman } from '../util/roman';
import { Bonus, SourceCategory } from './bonus';
import { Stat, Stats } from './stat';

const families = new Registry((family: ResearchFamily) => family.name);

export class ResearchFamily {
    readonly name: string;
    readonly stat: Stat;
    readonly tiers: ResearchTier[];

    constructor(name: string, stat: Stat, ...tierData: number[][]) {
        this.name = name;
        this.stat = stat;
        this.tiers = tierData.map((data, i) => new ResearchTier(this, i + 1, ...data));
        families.register(this);
    }
}

export class ResearchTier {
    readonly family: ResearchFamily;
    readonly tier: number;
    readonly levels: ResearchLevel[];

    constructor(family: ResearchFamily, tier: number, ...levelData: number[]) {
        this.family = family;
        this.tier = tier;
        this.levels = levelData.map((bonusValue, i) => new ResearchLevel(this, i + 1, bonusValue));
    }

    get name() {
        return this.family.name + ' ' + toRoman(this.tier);
    }
}

export class ResearchLevel {
    readonly tier: ResearchTier;
    readonly level: number;
    readonly bonuses: Bonus[];

    constructor(tier: ResearchTier, level: number, bonusValue: number) {
        this.tier = tier;
        this.level = level;
        this.bonuses = [ new Bonus(tier.family.stat, bonusValue, this) ];
    }

    get name() {
        return this.tier.name + ' ' + String(this.level);
    }

    get category() {
        return SourceCategory.Research;
    }
}

export const ResearchFamilies = {
    AttackTactics: new ResearchFamily('Attack Tactics',Stats.TroopAttack,[0.005,0.005,0.005],[0.0075,0.0075,0.01],[0.01,0.01,0.01,0.015],[0.0175,0.0175,0.0175,0.0175,0.03],[0.02,0.02,0.02,0.02,0.02,0.035],[0.0127,0.0127,0.0127,0.0127,0.0127,0.0128,0.0127,0.0127,0.0127,0.0127,0.0127,0.0127]),
    BattleDressing: new ResearchFamily('Battle Dressing',Stats.HealingSpeed,[0.046,0.092,0.152],[0.09,0.18,0.3],[0.134,0.268,0.448],[0.18,0.36,0.6],[0.224,0.448,0.748],[0.27,0.54,0.9],[0.27,0.54,0.9]),
    ChargeStrategy: new ResearchFamily('Charge Strategy',Stats.RiderLethality,[0.0125,0.0125,0.015],[0.0175,0.0175,0.02],[0.025,0.025,0.025,0.04],[0.04,0.04,0.04,0.04,0.065],[0.0475,0.0475,0.0475,0.0475,0.0475,0.08],[0.0304,0.0304,0.0305,0.0304,0.0304,0.0304,0.0304,0.0304,0.0305,0.0304,0.0304,0.0304]),
    CloseCombat: new ResearchFamily('Close Combat',Stats.InfantryLethality,[0.0125,0.0125,0.015],[0.0175,0.0175,0.02],[0.025,0.025,0.025,0.04],[0.04,0.04,0.04,0.04,0.065],[0.0475,0.0475,0.0475,0.0475,0.0475,0.08],[0.0304,0.0304,0.0305,0.0304,0.0304,0.0304,0.0304,0.0304,0.0305,0.0304,0.0304,0.0304]),
    DefenseFormations: new ResearchFamily('Defense Formations',Stats.TroopDefense,[0.005,0.005,0.005],[0.0075,0.0075,0.01],[0.01,0.01,0.01,0.015],[0.0175,0.0175,0.0175,0.0175,0.03],[0.02,0.02,0.02,0.02,0.02,0.035],[0.0127,0.0127,0.0127,0.0127,0.0127,0.0128,0.0127,0.0127,0.0127,0.0127,0.0127,0.0127]),
    FertilizerTech: new ResearchFamily('Fertilizer Tech',Stats.FoodProductionSpeed,[0.08,0.16,0.27],[0.08,0.16,0.27],[0.11,0.22,0.365],[0.135,0.27,0.45],[0.16,0.32,0.535],[0.16,0.32,0.535]),
    FoodHaulage: new ResearchFamily('Food Haulage',Stats.FoodGatheringSpeed,[0.08,0.16,0.27],[0.08,0.16,0.27],[0.11,0.22,0.365],[0.135,0.27,0.45],[0.16,0.32,0.535],[0.16,0.32,0.535]),
    GasHaulage: new ResearchFamily('Gas Haulage',Stats.GasGatheringSpeed,[0.16,0.32,0.535],[0.11,0.22,0.365],[0.135,0.27,0.45],[0.16,0.32,0.535],[0.16,0.32,0.535]),
    GunsBlazing: new ResearchFamily('Guns Blazing',Stats.InfantryAttack,[0.0125,0.0125,0.015],[0.0175,0.0175,0.02],[0.025,0.025,0.025,0.04],[0.04,0.04,0.04,0.04,0.065],[0.0475,0.0475,0.0475,0.0475,0.0475,0.08],[0.0304,0.0304,0.0305,0.0304,0.0304,0.0304,0.0304,0.0304,0.0305,0.0304,0.0304,0.0304]),
    HunterDefense: new ResearchFamily('Hunter Defense',Stats.HunterDefense,[0.0125,0.0125,0.015],[0.0175,0.0175,0.02],[0.025,0.025,0.025,0.04],[0.04,0.04,0.04,0.04,0.065],[0.0475,0.0475,0.0475,0.0475,0.0475,0.08],[0.0304,0.0304,0.0305,0.0304,0.0304,0.0304,0.0304,0.0304,0.0305,0.0304,0.0304,0.0304]),
    HunterProtection: new ResearchFamily('Hunter Protection',Stats.HunterHealth,[0.0125,0.0125,0.015],[0.0175,0.0175,0.02],[0.025,0.025,0.025,0.04],[0.04,0.04,0.04,0.04,0.065],[0.0475,0.0475,0.0475,0.0475,0.0475,0.08],[0.0304,0.0304,0.0305,0.0304,0.0304,0.0304,0.0304,0.0304,0.0305,0.0304,0.0304,0.0304]),
    Leadership: new ResearchFamily('Leadership',Stats.MarchCount,[1],[1],[1],[1]),
    LoggingTech: new ResearchFamily('Logging Tech',Stats.WoodProductionSpeed,[0.08,0.16,0.27],[0.08,0.16,0.27],[0.11,0.22,0.365],[0.135,0.27,0.45],[0.16,0.32,0.535],[0.16,0.32,0.535]),
    MarchCapacity: new ResearchFamily('March Capacity',Stats.MarchCapacity,[320,320,430],[430,430,570],[620,620,620,990],[990,990,990,990,1700],[1200,1200,1200,1200,1200,2000],[2000,2000,2000,2000,2000,3400]),
    MasterMechanic: new ResearchFamily('Master Mechanic',Stats.RiderHealth,[0.0125,0.0125,0.015],[0.0175,0.0175,0.02],[0.025,0.025,0.025,0.04],[0.04,0.04,0.04,0.04,0.065],[0.0475,0.0475,0.0475,0.0475,0.0475,0.08],[0.0304,0.0304,0.0305,0.0304,0.0304,0.0304,0.0304,0.0304,0.0305,0.0304,0.0304,0.0304]),
    MeleeDefense: new ResearchFamily('Melee Defense',Stats.InfantryDefense,[0.0125,0.0125,0.015],[0.0175,0.0175,0.02],[0.025,0.025,0.025,0.04],[0.04,0.04,0.04,0.04,0.065],[0.0475,0.0475,0.0475,0.0475,0.0475,0.08],[0.0304,0.0304,0.0305,0.0304,0.0304,0.0304,0.0304,0.0304,0.0305,0.0304,0.0304,0.0304]),
    MetalHaulage: new ResearchFamily('Metal Haulage',Stats.MetalGatheringSpeed,[0.16,0.32,0.535],[0.11,0.22,0.365],[0.135,0.27,0.45],[0.16,0.32,0.535],[0,0,0]),
    MobileAssault: new ResearchFamily('Mobile Assault',Stats.RiderAttack,[0.0125,0.0125,0.015],[0.0175,0.0175,0.02],[0.025,0.025,0.025,0.04],[0.04,0.04,0.04,0.04,0.065],[0.0475,0.0475,0.0475,0.0475,0.0475,0.08],[0.0304,0.0304,0.0305,0.0304,0.0304,0.0304,0.0304,0.0304,0.0305,0.0304,0.0304,0.0304]),
    MoreBeds: new ResearchFamily('More Beds',Stats.HealingCapacity,[540,1000,1800],[1100,2200,3600],[2200,4400,7300],[4300,8600,14400],[8600,17200,29200],[12000,24000,4000],[2000,4000,67000]),
    OilDrums: new ResearchFamily('Oil Drums',Stats.GasProductionSpeed,[0.16,0.32,0.535],[0.11,0.22,0.365],[0.135,0.27,0.45],[0.16,0.32,0.535],[0.16,0.32,0.535]),
    PrecisionStrike: new ResearchFamily('Precision Strike',Stats.HunterAttack,[0.0125,0.0125,0.015],[0.0175,0.0175,0.02],[0.025,0.025,0.025,0.04],[0.04,0.04,0.04,0.04,0.065],[0.0475,0.0475,0.0475,0.0475,0.0475,0.08],[0.0304,0.0304,0.0305,0.0304,0.0304,0.0304,0.0304,0.0304,0.0305,0.0304,0.0304,0.0304]),
    RiderDefense: new ResearchFamily('Rider Defense',Stats.RiderDefense,[0.0125,0.0125,0.015],[0.0175,0.0175,0.02],[0.025,0.025,0.025,0.04],[0.04,0.04,0.04,0.04,0.065],[0.0475,0.0475,0.0475,0.0475,0.0475,0.08],[0.0304,0.0304,0.0305,0.0304,0.0304,0.0304,0.0304,0.0304,0.0305,0.0304,0.0304,0.0304]),
    ShieldImprovement: new ResearchFamily('Shield Improvement',Stats.InfantryHealth,[0.0125,0.0125,0.015],[0.0175,0.0175,0.02],[0.025,0.025,0.025,0.04],[0.04,0.04,0.04,0.04,0.065],[0.0475,0.0475,0.0475,0.0475,0.0475,0.08],[0.0304,0.0304,0.0305,0.0304,0.0304,0.0304,0.0304,0.0304,0.0305,0.0304,0.0304,0.0304]),
    ShootToKill: new ResearchFamily('Shoot to Kill',Stats.TroopLethality,[0.005,0.005,0.005],[0.0075,0.0075,0.01],[0.01,0.01,0.01,0.015],[0.0175,0.0175,0.0175,0.0175,0.03],[0.02,0.02,0.02,0.02,0.02,0.035],[0.0127,0.0127,0.0127,0.0127,0.0127,0.0128,0.0127,0.0127,0.0127,0.0127,0.0127,0.0127]),
    SortingTech: new ResearchFamily('Sorting Tech',Stats.MetalProductionSpeed,[0.16,0.32,0.535],[0.11,0.22,0.365],[0.135,0.27,0.45],[0.16,0.32,0.535],[0.16,0.32,0.535]),
    SteadyShot: new ResearchFamily('Steady Shot',Stats.HunterLethality,[0.0125,0.0125,0.015],[0.0175,0.0175,0.02],[0.025,0.025,0.025,0.04],[0.04,0.04,0.04,0.04,0.065],[0.0475,0.0475,0.0475,0.0475,0.0475,0.08],[0.0304,0.0304,0.0305,0.0304,0.0304,0.0304,0.0304,0.0304,0.0305,0.0304,0.0304,0.0304]),
    SupplyConvoy: new ResearchFamily('Supply Convoy',Stats.MaxDonationHonor,[4,4,4],[4,4,4],[4,4,4],[4,4,4],[4,4,4]),
    SurvivalTraining: new ResearchFamily('Survival Training',Stats.TroopHealth,[0.005,0.005,0.005],[0.0075,0.0075,0.01],[0.01,0.01,0.01,0.015],[0.0175,0.0175,0.0175,0.0175,0.03],[0.02,0.02,0.02,0.02,0.02,0.035],[0.0127,0.0127,0.0127,0.0127,0.0127,0.0128,0.0127,0.0127,0.0127,0.0127,0.0127,0.0127]),
    TechImprovement: new ResearchFamily('Tech Improvement',Stats.ConstructionSpeed,[0.004,0.008,0.013],[0.006,0.012,0.022],[0.01,0.02,0.03],[0.012,0.024,0.039],[0.016,0.032,0.052],[0.018,0.036,0.061],[0.018,0.036,0.061]),
    ToolImprovement: new ResearchFamily('Tool Improvement',Stats.ResearchSpeed,[0.004,0.008,0.013],[0.006,0.012,0.022],[0.01,0.02,0.03],[0.012,0.024,0.039],[0.016,0.032,0.052],[0.018,0.036,0.061],[0.018,0.036,0.061]),
    //TradeCaravan: new ResearchFamily('Trade Caravan',Stats.TradeCaravan,[27000,54000,90000],[18000,36000,60000],[23000,46000,76000],[27000,54000,90000],[27000,54000,90000]),
    TrainingRoutines: new ResearchFamily('Training Routines',Stats.TrainingSpeed,[0.022,0.044,0.074],[0.046,0.092,0.152],[0.068,0.136,0.226],[0.09,0.18,0.3],[0.112,0.224,0.374],[0.134,0.268,0.448],[0.134,0.268,0.448]),
    TrainingYard: new ResearchFamily('Training Yard',Stats.TrainingCapacity,[2,4,7],[4,9,15],[7,14,23],[9,18,30],[11,22,37],[14,28,46],[14,28,46]),
    WoodHaulage: new ResearchFamily('Wood Haulage',Stats.WoodGatheringSpeed,[0.08,0.16,0.27],[0.08,0.16,0.27],[0.11,0.22,0.365],[0.135,0.27,0.45],[0.16,0.32,0.535],[0.16,0.32,0.535])
};
