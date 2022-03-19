import Registry from './registry';

const registry = new Registry((stat: Stat) => stat.name);

export enum StatUnit {
    Percent,
    Seconds,
    Units
}

export enum StatCategory {
    Military = 'Military',
    SettlementDefense = 'Settlement Defense',
    Development = 'Development',
    Resources = 'Resources',
    Alliance = 'Alliance',
    Exploration = 'Exploration'
}

export const StatCategorySort = {
    byUsefulness: (a: any, b: any) => {
        const orderMap: {[key in StatCategory]: number} = {
            [StatCategory.Military]: 0,
            [StatCategory.SettlementDefense]: 1,
            [StatCategory.Development]: 2,
            [StatCategory.Resources]: 3,
            [StatCategory.Alliance]: 4,
            [StatCategory.Exploration]: 5
        };
        if (a === b || !(a in orderMap) || !(b in orderMap)) {
            return 0;
        }
        return orderMap[a as StatCategory] < orderMap[b as StatCategory] ? -1 : 1;
    }
}

export class Stat {
    readonly name: string;
    readonly category: StatCategory;
    readonly type: StatUnit;

    constructor(name: string, category: StatCategory, type=StatUnit.Percent) {
        this.name = name;
        this.category = category;
        this.type = type;
        registry.register(this);
    }

    toString() {
        return this.name;
    }
}

export const getStatByName = registry.getById.bind(registry);

export const Stats = {
    TroopAttack: new Stat('Troop Attack', StatCategory.Military),
    TroopDefense: new Stat('Troop Defense', StatCategory.Military),
    TroopHealth: new Stat('Troop Health', StatCategory.Military),
    TroopLethality: new Stat('Troop Lethality', StatCategory.Military),
    InfantryAttack: new Stat('Infantry Attack', StatCategory.Military),
    InfantryDefense: new Stat('Infantry Defense', StatCategory.Military),
    InfantryHealth: new Stat('Infantry Health', StatCategory.Military),
    InfantryLethality: new Stat('Infantry Lethality', StatCategory.Military),
    RiderAttack: new Stat('Rider Attack', StatCategory.Military),
    RiderDefense: new Stat('Rider Defense', StatCategory.Military),
    RiderHealth: new Stat('Rider Health', StatCategory.Military),
    RiderLethality: new Stat('Rider Lethality', StatCategory.Military),
    HunterAttack: new Stat('Hunter Attack', StatCategory.Military),
    HunterDefense: new Stat('Hunter Defense', StatCategory.Military),
    HunterHealth: new Stat('Hunter Health', StatCategory.Military),
    HunterLethality: new Stat('Hunter Lethality', StatCategory.Military),
    ConstructionSpeed: new Stat('Construction Speed', StatCategory.Development),
    ResearchSpeed: new Stat('Research Speed', StatCategory.Development),
    HealingSpeed: new Stat('Healing Speed', StatCategory.Military),
    TrainingSpeed: new Stat('Training Speed', StatCategory.Military),
    MarchSpeed: new Stat('March Speed', StatCategory.Military),
    RallySpeed: new Stat('Rally Speed', StatCategory.Military),
    HealingCapacity: new Stat('Healing Capacity', StatCategory.Military, StatUnit.Units),
    TrainingCapacity: new Stat('Training Capacity', StatCategory.Military, StatUnit.Units),
    MarchCapacity: new Stat('March Capacity', StatCategory.Military, StatUnit.Units),
    RallyCapacity: new Stat('Rally Capacity', StatCategory.Military, StatUnit.Units),
    MarchCount: new Stat('March Count', StatCategory.Military, StatUnit.Units),
    FoodGatheringSpeed: new Stat('Food Gathering Speed', StatCategory.Resources),
    WoodGatheringSpeed: new Stat('Wood Gathering Speed', StatCategory.Resources),
    MetalGatheringSpeed: new Stat('Metal Gathering Speed', StatCategory.Resources),
    GasGatheringSpeed: new Stat('Gas Gathering Speed', StatCategory.Resources),
    FoodProductionSpeed: new Stat('Food Production Speed', StatCategory.Resources),
    WoodProductionSpeed: new Stat('Wood Production Speed', StatCategory.Resources),
    MetalProductionSpeed: new Stat('Metal Production Speed', StatCategory.Resources),
    GasProductionSpeed: new Stat('Gas Production Speed', StatCategory.Resources),
    TimerReduction: new Stat('Timer Reduction', StatCategory.Development, StatUnit.Seconds),
    MaxDonationHonor: new Stat('Max Donation Honor', StatCategory.Development, StatUnit.Units),
    AllianceConstructionSpeed: new Stat('Alliance Construction Speed', StatCategory.Alliance),
    AllianceMembershipCapacity: new Stat('Alliance Membership Capacity', StatCategory.Alliance, StatUnit.Units),
    AllianceTowerCapacity: new Stat('Alliance Tower Capacity', StatCategory.Alliance, StatUnit.Units),
    AllianceBuildingDurability: new Stat('Alliance Building Durability', StatCategory.Alliance),
    EnemyBuildingBurningSpeed: new Stat('Enemy Building Burning Speed', StatCategory.Alliance),
    RallyChiefCapacity: new Stat('Rally Chief Capacity', StatCategory.Military, StatUnit.Units),
    TimerHelpDuration: new Stat('Timer Help Duration', StatCategory.Development, StatUnit.Seconds),
    TimerHelpCapacity: new Stat('Timer Help Capacity', StatCategory.Development, StatUnit.Units),
    AllianceFoodCapacity: new Stat('Alliance Food Capacity', StatCategory.Alliance),
    AllianceWoodCapacity: new Stat('Alliance Wood Capacity', StatCategory.Alliance),
    AllianceMetalCapacity: new Stat('Alliance Metal Capacity', StatCategory.Alliance),
    AllianceGasCapacity: new Stat('Alliance Gas Capacity', StatCategory.Alliance),
    FoodCapacity: new Stat('Food Capacity', StatCategory.Resources, StatUnit.Units),
    WoodCapacity: new Stat('Wood Capacity', StatCategory.Resources, StatUnit.Units),
    MetalCapacity: new Stat('Metal Capacity', StatCategory.Resources, StatUnit.Units),
    GasCapacity: new Stat('Gas Capacity', StatCategory.Resources, StatUnit.Units),
    FormationCount: new Stat('Troop Formation Count', StatCategory.Military, StatUnit.Units),
    ExplorerAttack: new Stat('Explorer Attack', StatCategory.Exploration, StatUnit.Units),
    ExplorerDefense: new Stat('Explorer Defense', StatCategory.Exploration, StatUnit.Units),
    ExplorerHealth: new Stat('Explorer Health', StatCategory.Exploration, StatUnit.Units),
    ExplorerLethality: new Stat('Explorer Lethality', StatCategory.Exploration, StatUnit.Units),
    ReinforcementCapacity: new Stat('Reinforcement Capacity', StatCategory.Military, StatUnit.Units),
    SettlementTroopAttack: new Stat('Settlement Troop Attack', StatCategory.Military),
    SettlementTroopDefense: new Stat('Settlement Troop Defense', StatCategory.Military),
    SettlementTroopHealth: new Stat('Settlement Troop Health', StatCategory.Military),
    SettlementTroopLethality: new Stat('Settlement Troop Lethality', StatCategory.Military),
    EnemySettlementTroopAttack: new Stat('Enemy Settlement Troop Attack', StatCategory.Military),
    EnemySettlementTroopDefense: new Stat('Enemy Settlement Troop Defense', StatCategory.Military),
    EnemySettlementTroopHealth: new Stat('Enemy Settlement Troop Health', StatCategory.Military),
    EnemySettlementTroopLethality: new Stat('Enemy Settlement Troop Lethality', StatCategory.Military),
    TroopInfectedAttack: new Stat('Troop Infected Attack', StatCategory.Military),
    TroopInfectedDefense: new Stat('Troop Infected Defense', StatCategory.Military),
    TroopInfectedHealth: new Stat('Troop Infected Health', StatCategory.Military),
    TroopInfectedLethality: new Stat('Troop Infected Lethality', StatCategory.Military),
    RallyTroopAttack: new Stat('Rally Troop Attack', StatCategory.Military),
    RallyTroopDefense: new Stat('Rally Troop Defense', StatCategory.Military),
    RallyTroopHealth: new Stat('Rally Troop Health', StatCategory.Military),
    RallyTroopLethality: new Stat('Rally Troop Lethality', StatCategory.Military)
};
