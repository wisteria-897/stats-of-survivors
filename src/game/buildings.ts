import {
    StatBonusProviderLevelImpl,
    StatLeveledBonusProviderImpl,
    SourceCategory
} from './bonus';
import { Stat, Stats } from './stat';
import { Chief } from '../features/chief/chiefSlice';

export enum BuildingName {
    Headquarters   = 'Headquarters',
    HeroPrecinct   = 'Hero Precinct',
    Barracks       = 'Barracks',
    Range          = 'Range',
    Garage         = 'Garage',
    Farm1          = 'Farm #1',
    Farm2          = 'Farm #2',
    Farm3          = 'Farm #3',
    Farm4          = 'Farm #4',
    Lumberyard1    = 'Lumberyard #1',
    Lumberyard2    = 'Lumberyard #2',
    Lumberyard3    = 'Lumberyard #3',
    Lumberyard4    = 'Lumberyard #4',
    Furnace1       = 'Furnace #1',
    Furnace2       = 'Furnace #2',
    Furnace3       = 'Furnace #3',
    Furnace4       = 'Furnace #4',
    GasTank1       = 'Gas Tank #1',
    GasTank2       = 'Gas Tank #2',
    GasTank3       = 'Gas Tank #3',
    GasTank4       = 'Gas Tank #4',
    TrainingCamp1  = 'Training Camp #1',
    TrainingCamp2  = 'Training Camp #2',
    TrainingCamp3  = 'Training Camp #3',
    TrainingCamp4  = 'Training Camp #4',
    Hospital       = 'Hospital',
    LookoutTower   = 'Lookout Tower',
    ResearchLab    = 'Research Lab',
    AssemblyPoint  = 'Assembly Point',
    CommandStation = 'Command Station',
    TradingPost    = 'Trading Post',
    Barricade      = 'Barricade',
    Nanami         = 'Nanami Statue'
}

export class Building extends StatLeveledBonusProviderImpl<
    Chief,
    BuildingName,
    BuildingLevel
> {
    constructor(name: BuildingName, stats: Stat[], ...levelData: number[][]) {
        super(name, stats, levelData.map(bonusValues => ({bonusValues})));
    }

    get category() {
        return SourceCategory.Buildings;
    }

    get levelClass() {
        return BuildingLevel;
    }
}

export class BuildingLevel extends StatBonusProviderLevelImpl<Chief, Building> {
    selectLevels(chief: Chief) {
        return chief.buildings;
    }
}

export const Buildings = {
    [BuildingName.Headquarters]: new Building(BuildingName.Headquarters, [Stats.MarchCapacity], [350],[300],[350],[400],[450],[1005],[1105],[1205],[1255],[1305],[2715],[2815],[2915],[3015],[3015],[5025],[4775],[2000],[2000],[2000],[2250],[2750],[2750],[2750],[2750],[2750],[3250],[3250],[3250],[3250],[670],[670],[670],[670],[670],[704],[703],[704],[703],[704],[739],[738],[739],[738],[739],[768],[768],[767],[768],[768],[820],[820],[820],[820],[820]),
    [BuildingName.HeroPrecinct]: new Building(BuildingName.HeroPrecinct, [Stats.TroopAttack], [1000],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[0],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000],[1000]),
    [BuildingName.TrainingCamp1]: new Building(BuildingName.TrainingCamp1, [Stats.TrainingCapacity,Stats.TrainingSpeed], [2,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200]),
    [BuildingName.TrainingCamp2]: new Building(BuildingName.TrainingCamp2, [Stats.TrainingCapacity,Stats.TrainingSpeed], [2,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200]),
    [BuildingName.TrainingCamp3]: new Building(BuildingName.TrainingCamp3, [Stats.TrainingCapacity,Stats.TrainingSpeed], [2,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200]),
    [BuildingName.TrainingCamp4]: new Building(BuildingName.TrainingCamp4, [Stats.TrainingCapacity,Stats.TrainingSpeed], [2,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200],[1,200]),
    [BuildingName.AssemblyPoint]: new Building(BuildingName.AssemblyPoint, [Stats.ReinforcementCapacity,Stats.TimerHelpDuration,Stats.TimerHelpCapacity], [1600,7,1],[1900,3,1],[2200,3,1],[2600,3,1],[3000,3,1],[3500,3,1],[4100,3,1],[4800,3,1],[5600,3,1],[6500,3,1],[7500,3,1],[8700,3,1],[10100,3,1],[11700,3,1],[13500,3,1],[15600,3,1],[18000,3,1],[20700,3,1],[23900,3,1],[27500,3,1],[31700,3,1],[36500,3,1],[42000,3,1],[48300,3,1],[55600,3,1],[64000,3,1],[73600,3,1],[84700,3,1],[97500,3,1],[112200,3,1]),
    [BuildingName.Hospital]: new Building(BuildingName.Hospital, [Stats.HealingCapacity], [250],[50],[100],[100],[100],[150],[150],[200],[250],[300],[350],[400],[500],[600],[700],[850],[1050],[1250],[1500],[1800],[2150],[2600],[3100],[3700],[4450],[5350],[6400],[7700],[9250],[11100]),
    [BuildingName.Barracks]: new Building(BuildingName.Barracks, [Stats.TrainingCapacity], [5],[2],[2],[2],[2],[2],[2],[2],[2],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[4],[5],[5],[5],[5],[5],[5],[5],[5],[5],[5],[5],[5],[5],[5]),
    [BuildingName.Range]: new Building(BuildingName.Range, [Stats.TrainingCapacity], [5],[2],[2],[2],[2],[2],[2],[2],[2],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[4],[5],[5],[5],[5],[5],[5],[5],[5],[5],[5],[5],[5],[5],[5]),
    [BuildingName.Garage]: new Building(BuildingName.Garage, [Stats.TrainingCapacity], [5],[2],[2],[2],[2],[2],[2],[2],[2],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[7],[4],[5],[5],[5],[5],[5],[5],[5],[5],[5],[5],[5],[5],[5],[5]),
    [BuildingName.Farm1]: new Building(BuildingName.Farm1, [Stats.FoodProductionSpeed], [500],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166]),
    [BuildingName.Farm2]: new Building(BuildingName.Farm2, [Stats.FoodProductionSpeed], [500],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166]),
    [BuildingName.Farm3]: new Building(BuildingName.Farm3, [Stats.FoodProductionSpeed], [500],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166]),
    [BuildingName.Farm4]: new Building(BuildingName.Farm4, [Stats.FoodProductionSpeed], [500],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166]),
    [BuildingName.Lumberyard1]: new Building(BuildingName.Lumberyard1, [Stats.FoodProductionSpeed], [500],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166]),
    [BuildingName.Lumberyard2]: new Building(BuildingName.Lumberyard2, [Stats.FoodProductionSpeed], [500],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166]),
    [BuildingName.Lumberyard3]: new Building(BuildingName.Lumberyard3, [Stats.FoodProductionSpeed], [500],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166]),
    [BuildingName.Lumberyard4]: new Building(BuildingName.Lumberyard4, [Stats.FoodProductionSpeed], [500],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166],[167],[167],[166]),
    [BuildingName.Furnace1]: new Building(BuildingName.Furnace1, [Stats.FoodProductionSpeed], [100],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34]),
    [BuildingName.Furnace2]: new Building(BuildingName.Furnace2, [Stats.FoodProductionSpeed], [100],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34]),
    [BuildingName.Furnace3]: new Building(BuildingName.Furnace3, [Stats.FoodProductionSpeed], [100],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34]),
    [BuildingName.Furnace4]: new Building(BuildingName.Furnace4, [Stats.FoodProductionSpeed], [100],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34],[33],[33],[34]),
    [BuildingName.GasTank1]: new Building(BuildingName.GasTank1, [Stats.FoodProductionSpeed], [25],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9]),
    [BuildingName.GasTank2]: new Building(BuildingName.GasTank2, [Stats.FoodProductionSpeed], [25],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9]),
    [BuildingName.GasTank3]: new Building(BuildingName.GasTank3, [Stats.FoodProductionSpeed], [25],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9]),
    [BuildingName.GasTank4]: new Building(BuildingName.GasTank4, [Stats.FoodProductionSpeed], [25],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9],[8],[8],[9]),
    [BuildingName.LookoutTower]: new Building(BuildingName.LookoutTower, [], [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]),
    [BuildingName.ResearchLab]: new Building(BuildingName.ResearchLab, [], [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]),
    [BuildingName.Barricade]: new Building(BuildingName.Barricade, [], [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]),
    [BuildingName.CommandStation]: new Building(BuildingName.CommandStation, [], [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]),
    [BuildingName.TradingPost]: new Building(BuildingName.TradingPost, [], [],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[],[]),
    [BuildingName.Nanami]: new Building(BuildingName.Nanami, [Stats.MarchCapacity,Stats.TroopLethality,Stats.TroopHealth], [250,0,0],[250,0,0],[250,0,0],[250,0,0],[250,0,0],[250,0,0],[0,1000,1000],[250,0,0],[250,0,0],[0,1000,1000])
} as const;
