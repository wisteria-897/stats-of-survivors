import Registry from './registry';

const registry = new Registry((stat: Stat) => stat.name);

export enum StatUnit {
    Percent,
    Seconds,
    Units
}

export class Stat {
    readonly name: string;
    readonly type: StatUnit;

    constructor(name: string, type=StatUnit.Percent) {
        this.name = name;
        this.type = type;
        registry.register(this);
    }
}

export const getStatByName = registry.getById.bind(registry);

export const Stats = {
    Food: new Stat('Food'),
    Wood: new Stat('Wood'),
    Metal: new Stat('Metal'),
    Gas: new Stat('Gas'),
    Prosperity: new Stat('Prosperity'),
    BattlePower: new Stat('Battle Power'),
    TroopAttack: new Stat('Troop Attack'),
    TroopDefense: new Stat('Troop Defense'),
    TroopHealth: new Stat('Troop Health'),
    TroopLethality: new Stat('Troop Lethality'),
    InfantryAttack: new Stat('Infantry Attack'),
    InfantryDefense: new Stat('Infantry Defense'),
    InfantryHealth: new Stat('Infantry Health'),
    InfantryLethality: new Stat('Infantry Lethality'),
    RiderAttack: new Stat('Rider Attack'),
    RiderDefense: new Stat('Rider Defense'),
    RiderHealth: new Stat('Rider Health'),
    RiderLethality: new Stat('Rider Lethality'),
    HunterAttack: new Stat('Hunter Attack'),
    HunterDefense: new Stat('Hunter Defense'),
    HunterHealth: new Stat('Hunter Health'),
    HunterLethality: new Stat('Hunter Lethality'),
    ConstructionSpeed: new Stat('Construction Speed'),
    ResearchSpeed: new Stat('Research Speed'),
    HealingSpeed: new Stat('Healing Speed'),
    TrainingSpeed: new Stat('Training Speed'),
    MarchSpeed: new Stat('March Speed'),
    RallySpeed: new Stat('Rally Speed'),
    HealingCapacity: new Stat('Healing Capacity', StatUnit.Units),
    TrainingCapacity: new Stat('Training Capacity', StatUnit.Units),
    MarchCapacity: new Stat('March Capacity', StatUnit.Units),
    RallyCapacity: new Stat('Rally Capacity', StatUnit.Units),
    MarchCount: new Stat('March Count', StatUnit.Units),
    FoodGatheringSpeed: new Stat('Food Gathering Speed'),
    WoodGatheringSpeed: new Stat('Wood Gathering Speed'),
    MetalGatheringSpeed: new Stat('Metal Gathering Speed'),
    GasGatheringSpeed: new Stat('Gas Gathering Speed'),
    FoodProductionSpeed: new Stat('Food Production Speed'),
    WoodProductionSpeed: new Stat('Wood Production Speed'),
    MetalProductionSpeed: new Stat('Metal Production Speed'),
    GasProductionSpeed: new Stat('Gas Production Speed'),
    TimerReduction: new Stat('Timer Reduction', StatUnit.Seconds),
    MaxDonationHonor: new Stat('Max Donation Honor', StatUnit.Units),
    AllianceConstructionSpeed: new Stat('Alliance Construction Speed'),
    AllianceMembershipCapacity: new Stat('Alliance Membership Capacity', StatUnit.Units),
    AllianceTowerCapacity: new Stat('Alliance Tower Capacity', StatUnit.Units),
    AllianceBuildingDurability: new Stat('Alliance Building Durability'),
    EnemyBuildingBurningSpeed: new Stat('Enemy Building Burning Speed'),
    RallyChiefCapacity: new Stat('Rally Chief Capacity', StatUnit.Units),
    TimerHelpDuration: new Stat('Timer Help Duration', StatUnit.Seconds),
    TimerHelpCapacity: new Stat('Timer Help Capacity', StatUnit.Units),
    AllianceFoodCapacity: new Stat('Alliance Food Capacity'),
    AllianceWoodCapacity: new Stat('Alliance Wood Capacity'),
    AllianceMetalCapacity: new Stat('Alliance Metal Capacity'),
    AllianceGasCapacity: new Stat('Alliance Gas Capacity'),
    FoodCapacity: new Stat('Food Capacity', StatUnit.Units),
    WoodCapacity: new Stat('Wood Capacity', StatUnit.Units),
    MetalCapacity: new Stat('Metal Capacity', StatUnit.Units),
    GasCapacity: new Stat('Gas Capacity', StatUnit.Units),
    FormationCount: new Stat('Troop Formation Count', StatUnit.Units),
    ExplorerAttack: new Stat('Explorer Attack', StatUnit.Units),
    ExplorerDefense: new Stat('Explorer Defense', StatUnit.Units),
    ExplorerHealth: new Stat('Explorer Health', StatUnit.Units),
    ExplorerLethality: new Stat('Explorer Lethality', StatUnit.Units)
};
