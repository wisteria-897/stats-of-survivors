import Registry from './registry';
import { Bonus, SourceCategory, Tiers } from './bonus';
import { Stat, Stats } from './stat';

const vipLevels = new Registry((vipLevel: VIPLevel) => vipLevel.level);

type BonusData = [stat: Stat, value: number];

export class VIPLevel {
    readonly level: number;
    readonly bonuses: Bonus[];

    constructor(level: number, ...bonusData: BonusData[]) {
        this.level = level;
        this.bonuses = bonusData.map(([stat, value]) => new Bonus(stat, value, this));
        vipLevels.register(this);
    }

    get tier() {
        return Tiers.Common;
    }

    get name() {
        return "VIP" + String(this.level);
    }

    get category() {
        return SourceCategory.VIP;
    }
}

export const getVipLevel = (level: number): VIPLevel => {
    const vipLevel = vipLevels.getById(level);
    return vipLevel || VIPLevels.VIP0;
}

export const VIPLevels = {
    VIP0: new VIPLevel(0),
    VIP1: new VIPLevel(1, [Stats.TimerReduction,60]),
    VIP2: new VIPLevel(2, [Stats.TimerReduction,120],[Stats.FoodProductionSpeed,10],[Stats.WoodProductionSpeed,10],[Stats.MetalProductionSpeed,10],[Stats.GasProductionSpeed,10]),
    VIP3: new VIPLevel(3, [Stats.TimerReduction,180],[Stats.FoodProductionSpeed,16],[Stats.WoodProductionSpeed,16],[Stats.MetalProductionSpeed,16],[Stats.GasProductionSpeed,16],[Stats.FoodCapacity,200000],[Stats.WoodCapacity,200000],[Stats.MetalCapacity,200000],[Stats.GasCapacity,200000]),
    VIP4: new VIPLevel(4, [Stats.TimerReduction,240],[Stats.FoodProductionSpeed,20],[Stats.WoodProductionSpeed,20],[Stats.MetalProductionSpeed,20],[Stats.GasProductionSpeed,20],[Stats.FoodCapacity,300000],[Stats.WoodCapacity,300000],[Stats.MetalCapacity,300000],[Stats.GasCapacity,300000],[Stats.ConstructionSpeed,10]),
    VIP5: new VIPLevel(5, [Stats.TimerReduction,300],[Stats.FoodProductionSpeed,22],[Stats.WoodProductionSpeed,22],[Stats.MetalProductionSpeed,22],[Stats.GasProductionSpeed,22],[Stats.FoodCapacity,400000],[Stats.WoodCapacity,400000],[Stats.MetalCapacity,400000],[Stats.GasCapacity,400000],[Stats.ConstructionSpeed,10]),
    VIP6: new VIPLevel(6, [Stats.TimerReduction,360],[Stats.FoodProductionSpeed,24],[Stats.WoodProductionSpeed,24],[Stats.MetalProductionSpeed,24],[Stats.GasProductionSpeed,24],[Stats.FoodCapacity,500000],[Stats.WoodCapacity,500000],[Stats.MetalCapacity,500000],[Stats.GasCapacity,500000],[Stats.ConstructionSpeed,10]),
    VIP7: new VIPLevel(7, [Stats.TimerReduction,420],[Stats.FoodProductionSpeed,26],[Stats.WoodProductionSpeed,26],[Stats.MetalProductionSpeed,26],[Stats.GasProductionSpeed,26],[Stats.FoodCapacity,600000],[Stats.WoodCapacity,600000],[Stats.MetalCapacity,600000],[Stats.GasCapacity,600000],[Stats.ConstructionSpeed,10],[Stats.FormationCount,1]),
    VIP8: new VIPLevel(8, [Stats.TimerReduction,480],[Stats.FoodProductionSpeed,28],[Stats.WoodProductionSpeed,28],[Stats.MetalProductionSpeed,28],[Stats.GasProductionSpeed,28],[Stats.FoodCapacity,700000],[Stats.WoodCapacity,700000],[Stats.MetalCapacity,700000],[Stats.GasCapacity,700000],[Stats.ConstructionSpeed,10],[Stats.FormationCount,1],[Stats.MarchCount,1]),
    VIP9: new VIPLevel(9, [Stats.TimerReduction,540],[Stats.FoodProductionSpeed,30],[Stats.WoodProductionSpeed,30],[Stats.MetalProductionSpeed,30],[Stats.GasProductionSpeed,30],[Stats.FoodCapacity,800000],[Stats.WoodCapacity,800000],[Stats.MetalCapacity,800000],[Stats.GasCapacity,800000],[Stats.ConstructionSpeed,20],[Stats.FormationCount,1],[Stats.MarchCount,1],[Stats.TroopDefense,10]),
    VIP10: new VIPLevel(10, [Stats.TimerReduction,600],[Stats.FoodProductionSpeed,32],[Stats.WoodProductionSpeed,32],[Stats.MetalProductionSpeed,32],[Stats.GasProductionSpeed,32],[Stats.FoodCapacity,900000],[Stats.WoodCapacity,900000],[Stats.MetalCapacity,900000],[Stats.GasCapacity,900000],[Stats.ConstructionSpeed,20],[Stats.FormationCount,1],[Stats.MarchCount,1],[Stats.TroopDefense,12],[Stats.TroopAttack,12]),
    VIP11: new VIPLevel(11, [Stats.TimerReduction,660],[Stats.FoodProductionSpeed,34],[Stats.WoodProductionSpeed,34],[Stats.MetalProductionSpeed,34],[Stats.GasProductionSpeed,34],[Stats.FoodCapacity,1000000],[Stats.WoodCapacity,1000000],[Stats.MetalCapacity,1000000],[Stats.GasCapacity,1000000],[Stats.ConstructionSpeed,20],[Stats.FormationCount,1],[Stats.MarchCount,1],[Stats.TroopDefense,14],[Stats.TroopAttack,14],[Stats.TroopHealth,14]),
    VIP12: new VIPLevel(12, [Stats.TimerReduction,720],[Stats.FoodProductionSpeed,36],[Stats.WoodProductionSpeed,36],[Stats.MetalProductionSpeed,36],[Stats.GasProductionSpeed,36],[Stats.FoodCapacity,1100000],[Stats.WoodCapacity,1100000],[Stats.MetalCapacity,1100000],[Stats.GasCapacity,1100000],[Stats.ConstructionSpeed,20],[Stats.FormationCount,1],[Stats.MarchCount,1],[Stats.TroopDefense,16],[Stats.TroopAttack,16],[Stats.TroopHealth,16])
};

