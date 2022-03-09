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
    VIP2: new VIPLevel(2, [Stats.TimerReduction,120],[Stats.FoodProductionSpeed,10000],[Stats.WoodProductionSpeed,10000],[Stats.MetalProductionSpeed,10000],[Stats.GasProductionSpeed,10000]),
    VIP3: new VIPLevel(3, [Stats.TimerReduction,180],[Stats.FoodProductionSpeed,16000],[Stats.WoodProductionSpeed,16000],[Stats.MetalProductionSpeed,16000],[Stats.GasProductionSpeed,16000],[Stats.FoodCapacity,200000],[Stats.WoodCapacity,200000],[Stats.MetalCapacity,200000],[Stats.GasCapacity,200000]),
    VIP4: new VIPLevel(4, [Stats.TimerReduction,240],[Stats.FoodProductionSpeed,20000],[Stats.WoodProductionSpeed,20000],[Stats.MetalProductionSpeed,20000],[Stats.GasProductionSpeed,20000],[Stats.FoodCapacity,300000],[Stats.WoodCapacity,300000],[Stats.MetalCapacity,300000],[Stats.GasCapacity,300000],[Stats.ConstructionSpeed,10000]),
    VIP5: new VIPLevel(5, [Stats.TimerReduction,300],[Stats.FoodProductionSpeed,22000],[Stats.WoodProductionSpeed,22000],[Stats.MetalProductionSpeed,22000],[Stats.GasProductionSpeed,22000],[Stats.FoodCapacity,400000],[Stats.WoodCapacity,400000],[Stats.MetalCapacity,400000],[Stats.GasCapacity,400000],[Stats.ConstructionSpeed,10000]),
    VIP6: new VIPLevel(6, [Stats.TimerReduction,360],[Stats.FoodProductionSpeed,24000],[Stats.WoodProductionSpeed,24000],[Stats.MetalProductionSpeed,24000],[Stats.GasProductionSpeed,24000],[Stats.FoodCapacity,500000],[Stats.WoodCapacity,500000],[Stats.MetalCapacity,500000],[Stats.GasCapacity,500000],[Stats.ConstructionSpeed,10000]),
    VIP7: new VIPLevel(7, [Stats.TimerReduction,420],[Stats.FoodProductionSpeed,26000],[Stats.WoodProductionSpeed,26000],[Stats.MetalProductionSpeed,26000],[Stats.GasProductionSpeed,26000],[Stats.FoodCapacity,600000],[Stats.WoodCapacity,600000],[Stats.MetalCapacity,600000],[Stats.GasCapacity,600000],[Stats.ConstructionSpeed,10000],[Stats.FormationCount,1]),
    VIP8: new VIPLevel(8, [Stats.TimerReduction,480],[Stats.FoodProductionSpeed,28000],[Stats.WoodProductionSpeed,28000],[Stats.MetalProductionSpeed,28000],[Stats.GasProductionSpeed,28000],[Stats.FoodCapacity,700000],[Stats.WoodCapacity,700000],[Stats.MetalCapacity,700000],[Stats.GasCapacity,700000],[Stats.ConstructionSpeed,10000],[Stats.FormationCount,1],[Stats.MarchCount,1]),
    VIP9: new VIPLevel(9, [Stats.TimerReduction,540],[Stats.FoodProductionSpeed,30000],[Stats.WoodProductionSpeed,30000],[Stats.MetalProductionSpeed,30000],[Stats.GasProductionSpeed,30000],[Stats.FoodCapacity,800000],[Stats.WoodCapacity,800000],[Stats.MetalCapacity,800000],[Stats.GasCapacity,800000],[Stats.ConstructionSpeed,20000],[Stats.FormationCount,1],[Stats.MarchCount,1],[Stats.TroopDefense,10000]),
    VIP10: new VIPLevel(10, [Stats.TimerReduction,600],[Stats.FoodProductionSpeed,32000],[Stats.WoodProductionSpeed,32000],[Stats.MetalProductionSpeed,32000],[Stats.GasProductionSpeed,32000],[Stats.FoodCapacity,900000],[Stats.WoodCapacity,900000],[Stats.MetalCapacity,900000],[Stats.GasCapacity,900000],[Stats.ConstructionSpeed,20000],[Stats.FormationCount,1],[Stats.MarchCount,1],[Stats.TroopDefense,12000],[Stats.TroopAttack,12000]),
    VIP11: new VIPLevel(11, [Stats.TimerReduction,660],[Stats.FoodProductionSpeed,34000],[Stats.WoodProductionSpeed,34000],[Stats.MetalProductionSpeed,34000],[Stats.GasProductionSpeed,34000],[Stats.FoodCapacity,1000000],[Stats.WoodCapacity,1000000],[Stats.MetalCapacity,1000000],[Stats.GasCapacity,1000000],[Stats.ConstructionSpeed,20000],[Stats.FormationCount,1],[Stats.MarchCount,1],[Stats.TroopDefense,14000],[Stats.TroopAttack,14000],[Stats.TroopHealth,14000]),
    VIP12: new VIPLevel(12, [Stats.TimerReduction,720],[Stats.FoodProductionSpeed,36000],[Stats.WoodProductionSpeed,36000],[Stats.MetalProductionSpeed,36000],[Stats.GasProductionSpeed,36000],[Stats.FoodCapacity,1100000],[Stats.WoodCapacity,1100000],[Stats.MetalCapacity,1100000],[Stats.GasCapacity,1100000],[Stats.ConstructionSpeed,20000],[Stats.FormationCount,1],[Stats.MarchCount,1],[Stats.TroopDefense,16000],[Stats.TroopAttack,16000],[Stats.TroopHealth,16000])
};

