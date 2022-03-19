import { Stat, Stats } from './stat';
import { Bonus, BonusProviderLevel, LeveledBonusProvider, SourceCategory, Tier, Tiers } from './bonus';

export enum HeroType {
    Brawler  = 'Brawler',
    Marksman = 'Marksman',
    Scout    = 'Scout'
}

export enum HeroName {
    Basel    = 'Basel',
    //Becca    = 'Becca',
    Candy    = 'Candy',
    Chef     = 'Chef',
    Eunjoo   = 'Eunjoo',
    Eva      = 'Eva',
    Jane     = 'Jane',
    Jeb      = 'Jeb',
    Ghost    = 'Ghost',
    Lucky    = 'Lucky',
    Maddie   = 'Maddie & Frank',
    Mike     = 'Mike',
    //Mikoto   = 'Mikoto',
    //Nanami   = 'Nanami',
    Nikola   = 'Nikola',
    Ray      = 'Ray & Rolex',
    Rusty    = 'Rusty',
    Sarge    = 'Sarge',
    //TheJoker = 'The Joker',
    Tony     = 'Tony',
    Travis   = 'Travis',
    Trish    = 'Trish',
    //Wacko    = 'Wacko',
    Wolfe    = 'Wolfe'
}

const RankNames = [
    'Cadet I', 'Cadet II', 'Cadet III', 'Cadet IV', 'Cadet V',
    'Second Lieutenant I', 'Second Lieutenant II', 'Second Lieutenant III', 'Second Lieutenant IV', 'Second Lieutenant V',
    'First Lieutenant I', 'First Lieutenant II', 'First Lieutenant III', 'First Lieutenant IV', 'First Lieutenant V',
    'Captain I', 'Captain II', 'Captain III', 'Captain IV', 'Captain V',
    'Major I', 'Major II', 'Major III', 'Major IV', 'Major V',
    'Lieutenant Colonel I', 'Lieutenant Colonel II', 'Lieutenant Colonel III', 'Lieutenant Colonel IV', 'Lieutenant Colonel V',
    'Colonel I', 'Colonel II', 'Colonel III', 'Colonel IV', 'Colonel V',
    'General'
];

export type HeroRank = LeveledBonusProvider & {
    type: HeroType
}

const buildHeroRanks = (name: HeroName, type: HeroType, tier: Tier, stats: Stat[], rankValues: number[][]): HeroRank => {
    let provider: HeroRank = {
        name,
        type,
        category: SourceCategory.Heroes,
        levels: []
    };
    provider.levels.push(...rankValues.map((bonusValues, i): BonusProviderLevel => {
        let rank: BonusProviderLevel = {
            provider,
            tier,
            level: i + 1,
            tierLevel: {tier: tier, level: 1},
            category: SourceCategory.Heroes,
            name: provider.name + ': ' + RankNames[i],
            bonuses: []
        }
        rank.bonuses.push(...stats.map((stat, j) => new Bonus(stat, bonusValues[j], rank)));
        return rank;
    }));
    return provider;
}

export const HeroRanks: Record<HeroName, HeroRank> = {
    //[HeroName.Becca]: buildHeroRanks(HeroName.Becca,[],[]),
    //[HeroName.Mikoto]: buildHeroRanks(HeroName.Mikoto,[],[]),
    //[HeroName.Nanami]: buildHeroRanks(HeroName.Nanami,[],[]),
    //[HeroName.TheJoker]: buildHeroRanks(HeroName.TheJoker,[],[]),
    //[HeroName.Wacko]: buildHeroRanks(HeroName.Wacko,[],[]),
    [HeroName.Basel]: buildHeroRanks(HeroName.Basel,HeroType.Scout,Tiers.Epic,[Stats.RiderAttack,Stats.RiderDefense,Stats.TroopInfectedHealth], [[10400,10400,5200],[2350,2350,1200],[2350,2350,1200],[2350,2350,1100],[2350,2350,1200],[2350,2350,1200],[2600,2600,1300],[2600,2600,1300],[2600,2600,1300],[2650,2650,1300],[2600,2600,1300],[2850,2850,1400],[2850,2850,1500],[2900,2900,1400],[2850,2850,1400],[2850,2850,1500],[3150,3150,1500],[3100,3100,1600],[3150,3150,1500],[3100,3100,1600],[3150,3150,1600],[3900,3900,1900],[3900,3900,2000],[3950,3950,1900],[3900,3900,2000],[3900,3900,1900],[4150,4150,2100],[4200,4200,2100],[4150,4150,2100],[4150,4150,2100],[4200,4200,2100],[4950,4950,2400],[4950,4950,2500],[4950,4950,2500],[4950,4950,2500],[4950,4950,2500]]),
    [HeroName.Candy]: buildHeroRanks(HeroName.Candy,HeroType.Scout,Tiers.Epic,[Stats.RiderAttack,Stats.RiderDefense,Stats.TroopInfectedDefense], [[10400,10400,5200],[2350,2350,1200],[2350,2350,1200],[2350,2350,1100],[2350,2350,1200],[2350,2350,1200],[2600,2600,1300],[2600,2600,1300],[2600,2600,1300],[2650,2650,1300],[2600,2600,1300],[2850,2850,1400],[2850,2850,1500],[2900,2900,1400],[2850,2850,1400],[2850,2850,1500],[3150,3150,1500],[3100,3100,1600],[3150,3150,1500],[3100,3100,1600],[3150,3150,1600],[3900,3900,1900],[3900,3900,2000],[3950,3950,1900],[3900,3900,2000],[3900,3900,1900],[4150,4150,2100],[4200,4200,2100],[4150,4150,2100],[4150,4150,2100],[4200,4200,2100],[4950,4950,2400],[4950,4950,2500],[4950,4950,2500],[4950,4950,2500],[4950,4950,2500]]),
    [HeroName.Chef]: buildHeroRanks(HeroName.Chef,HeroType.Brawler,Tiers.Epic,[Stats.InfantryAttack,Stats.InfantryDefense,Stats.WoodGatheringSpeed], [[10400,10400,1600],[2350,2350,400],[2350,2350,300],[2350,2350,400],[2350,2350,300],[2350,2350,400],[2600,2600,400],[2600,2600,400],[2600,2600,400],[2650,2650,400],[2600,2600,400],[2850,2850,400],[2850,2850,500],[2900,2900,400],[2850,2850,500],[2850,2850,400],[3150,3150,500],[3100,3100,500],[3150,3150,400],[3100,3100,500],[3150,3150,500],[3900,3900,600],[3900,3900,600],[3950,3950,600],[3900,3900,600],[3900,3900,600],[4150,4150,600],[4200,4200,700],[4150,4150,600],[4150,4150,700],[4200,4200,600],[4950,4950,800],[4950,4950,700],[4950,4950,800],[4950,4950,700],[4950,4950,800]]),
    [HeroName.Eva]: buildHeroRanks(HeroName.Eva,HeroType.Marksman,Tiers.Epic,[Stats.HunterAttack,Stats.HunterDefense,Stats.EnemySettlementTroopHealth], [[10400,10400,-1600],[2350,2350,-300],[2350,2350,-400],[2350,2350,-300],[2350,2350,-400],[2350,2350,-300],[2600,2600,-400],[2600,2600,-400],[2600,2600,-400],[2650,2650,-400],[2600,2600,-400],[2850,2850,-400],[2850,2850,-400],[2900,2900,-500],[2850,2850,-400],[2850,2850,-400],[3150,3150,-500],[3100,3100,-500],[3150,3150,-400],[3100,3100,-500],[3150,3150,-500],[3900,3900,-600],[3900,3900,-500],[3950,3950,-600],[3900,3900,-600],[3900,3900,-600],[4150,4150,-600],[4200,4200,-700],[4150,4150,-600],[4150,4150,-600],[4200,4200,-600],[4950,4950,-800],[4950,4950,-700],[4950,4950,-800],[4950,4950,-700],[4950,4950,-700]]),
    [HeroName.Ghost]: buildHeroRanks(HeroName.Ghost,HeroType.Scout,Tiers.Rare,[Stats.RiderAttack,Stats.RiderDefense,Stats.GasGatheringSpeed], [[7800,7800,1200],[1800,1800,300],[1750,1750,200],[1750,1750,300],[1750,1750,300],[1750,1750,300],[1950,1950,300],[1950,1950,300],[2000,2000,300],[1950,1950,300],[1950,1950,300],[2150,2150,300],[2150,2150,300],[2150,2150,300],[2150,2150,400],[2150,2150,300],[2350,2350,400],[2350,2350,300],[2300,2300,400],[2350,2350,300],[2350,2350,400],[2950,2950,500],[2950,2950,400],[2900,2900,500],[2950,2950,400],[2900,2900,500],[3150,3150,400],[3150,3150,500],[3100,3100,500],[3150,3150,500],[3100,3100,500],[3700,3700,500],[3750,3750,600],[3700,3700,600],[3700,3700,500],[3750,3750,600]]),
    [HeroName.Jane]: buildHeroRanks(HeroName.Jane,HeroType.Scout,Tiers.Epic,[Stats.RiderAttack,Stats.RiderDefense,Stats.TroopInfectedHealth], [[10400,10400,5200],[2350,2350,1200],[2350,2350,1200],[2350,2350,1100],[2350,2350,1200],[2350,2350,1200],[2600,2600,1300],[2600,2600,1300],[2600,2600,1300],[2650,2650,1300],[2600,2600,1300],[2850,2850,1400],[2850,2850,1500],[2900,2900,1400],[2850,2850,1400],[2850,2850,1500],[3150,3150,1500],[3100,3100,1600],[3150,3150,1500],[3100,3100,1600],[3150,3150,1600],[3900,3900,1900],[3900,3900,2000],[3950,3950,1900],[3900,3900,2000],[3900,3900,1900],[4150,4150,2100],[4200,4200,2100],[4150,4150,2100],[4150,4150,2100],[4200,4200,2100],[4950,4950,2400],[4950,4950,2500],[4950,4950,2500],[4950,4950,2500],[4950,4950,2500]]),
    [HeroName.Jeb]: buildHeroRanks(HeroName.Jeb,HeroType.Marksman,Tiers.Legendary,[Stats.HunterAttack,Stats.HunterDefense,Stats.EnemySettlementTroopLethality], [[25700,25700,-3500],[3700,3700,-500],[3750,3750,-500],[3750,3750,-500],[3700,3700,-500],[3750,3750,-500],[4200,4200,-600],[4200,4200,-600],[4200,4200,-500],[4200,4200,-600],[4200,4200,-600],[4700,4700,-600],[4650,4650,-700],[4650,4650,-600],[4700,4700,-600],[4650,4650,-700],[5600,5600,-700],[5600,5600,-800],[5600,5600,-800],[5600,5600,-700],[5600,5600,-800],[7050,7050,-900],[7000,7000,-1000],[7000,7000,-900],[7000,7000,-1000],[7000,7000,-900],[7450,7450,-1100],[7500,7500,-1000],[7450,7450,-1000],[7450,7450,-1000],[7500,7500,-1000],[8850,8850,-1200],[8900,8900,-1200],[8850,8850,-1200],[8850,8850,-1300],[8900,8900,-1200]]),
    [HeroName.Eunjoo]: buildHeroRanks(HeroName.Eunjoo,HeroType.Scout,Tiers.Epic,[Stats.RiderAttack,Stats.RiderDefense,Stats.TroopInfectedHealth], [[10400,10400,5200],[2350,2350,1200],[2350,2350,1200],[2350,2350,1100],[2350,2350,1200],[2350,2350,1200],[2600,2600,1300],[2600,2600,1300],[2600,2600,1300],[2650,2650,1300],[2600,2600,1300],[2850,2850,1400],[2850,2850,1500],[2900,2900,1400],[2850,2850,1400],[2850,2850,1500],[3150,3150,1500],[3100,3100,1600],[3150,3150,1500],[3100,3100,1600],[3150,3150,1600],[3900,3900,1900],[3900,3900,2000],[3950,3950,1900],[3900,3900,2000],[3900,3900,1900],[4150,4150,2100],[4200,4200,2100],[4150,4150,2100],[4150,4150,2100],[4200,4200,2100],[4950,4950,2400],[4950,4950,2500],[4950,4950,2500],[4950,4950,2500],[4950,4950,2500]]),
    [HeroName.Lucky]: buildHeroRanks(HeroName.Lucky,HeroType.Marksman,Tiers.Legendary,[Stats.HunterAttack,Stats.HunterDefense,Stats.EnemySettlementTroopDefense], [[22150,22150,-3500],[3200,3200,-500],[3200,3200,-500],[3250,3250,-500],[3200,3200,-500],[3200,3200,-500],[3650,3650,-600],[3600,3600,-600],[3650,3650,-500],[3600,3600,-600],[3600,3600,-600],[4050,4050,-600],[4000,4000,-700],[4050,4050,-600],[4000,4000,-600],[4050,4050,-700],[4800,4800,-700],[4850,4850,-800],[4800,4800,-800],[4850,4850,-700],[4850,4850,-800],[6000,6000,-900],[6050,6050,-1000],[6050,6050,-900],[6000,6000,-1000],[6050,6050,-900],[6450,6450,-1100],[6400,6400,-1000],[6450,6450,-1000],[6450,6450,-1000],[6450,6450,-1000],[7650,7650,-1200],[7600,7600,-1200],[7650,7650,-1200],[7650,7650,-1300],[7650,7650,-1200]]),
    [HeroName.Maddie]: buildHeroRanks(HeroName.Maddie,HeroType.Scout,Tiers.Legendary,[Stats.RiderAttack,Stats.RiderDefense,Stats.SettlementTroopAttack], [[23300,23300,7000],[3400,3400,1000],[3350,3350,1000],[3400,3400,1000],[3400,3400,1100],[3400,3400,1000],[3800,3800,1100],[3800,3800,1200],[3800,3800,1100],[3850,3850,1100],[3800,3800,1200],[4200,4200,1300],[4250,4250,1200],[4250,4250,1300],[4250,4250,1300],[4200,4200,1200],[5100,5100,1600],[5050,5050,1500],[5100,5100,1500],[5100,5100,1500],[5050,5050,1600],[6350,6350,1900],[6350,6350,1900],[6400,6400,1900],[6350,6350,1900],[6350,6350,1900],[6750,6750,2000],[6800,6800,2100],[6750,6750,2000],[6800,6800,2000],[6750,6750,2100],[8050,8050,2400],[8050,8050,2400],[8050,8050,2400],[8050,8050,2400],[8050,8050,2400]]),
    [HeroName.Mike]: buildHeroRanks(HeroName.Mike,HeroType.Marksman,Tiers.Epic,[Stats.HunterAttack,Stats.HunterDefense,Stats.FoodGatheringSpeed], [[10400,10400,1600],[2350,2350,400],[2350,2350,300],[2350,2350,400],[2350,2350,300],[2350,2350,400],[2600,2600,400],[2600,2600,400],[2600,2600,400],[2650,2650,400],[2600,2600,400],[2850,2850,400],[2850,2850,500],[2900,2900,400],[2850,2850,500],[2850,2850,400],[3150,3150,500],[3100,3100,500],[3150,3150,400],[3100,3100,500],[3150,3150,500],[3900,3900,600],[3900,3900,600],[3950,3950,600],[3900,3900,600],[3900,3900,600],[4150,4150,600],[4200,4200,700],[4150,4150,600],[4150,4150,700],[4200,4200,600],[4950,4950,800],[4950,4950,700],[4950,4950,800],[4950,4950,700],[4950,4950,800]]),
    [HeroName.Nikola]: buildHeroRanks(HeroName.Nikola,HeroType.Brawler,Tiers.Legendary,[Stats.InfantryAttack,Stats.InfantryDefense,Stats.TroopInfectedAttack], [[23300,23300,11600],[3400,3400,1700],[3350,3350,1700],[3400,3400,1700],[3400,3400,1700],[3400,3400,1700],[3800,3800,1900],[3800,3800,1900],[3800,3800,1900],[3850,3850,1900],[3800,3800,1900],[4200,4200,2200],[4250,4250,2100],[4250,4250,2100],[4250,4250,2100],[4200,4200,2100],[5100,5100,2600],[5050,5050,2500],[5100,5100,2600],[5100,5100,2500],[5050,5050,2500],[6350,6350,3200],[6350,6350,3200],[6400,6400,3200],[6350,6350,3100],[6350,6350,3200],[6750,6750,3400],[6800,6800,3400],[6750,6750,3400],[6800,6800,3400],[6750,6750,3400],[8050,8050,4000],[8050,8050,4000],[8050,8050,4000],[8050,8050,4000],[8050,8050,4100]]),
    [HeroName.Ray]: buildHeroRanks(HeroName.Ray,HeroType.Brawler,Tiers.Legendary,[Stats.InfantryAttack,Stats.InfantryDefense,Stats.EnemySettlementTroopAttack], [[24450,24450,-3500],[3550,3550,-500],[3550,3550,-500],[3600,3600,-500],[3550,3550,-500],[3550,3550,-500],[4000,4000,-600],[4000,4000,-600],[4000,4000,-500],[4000,4000,-600],[4000,4000,-600],[4450,4450,-600],[4450,4450,-700],[4450,4450,-600],[4450,4450,-600],[4450,4450,-700],[5300,5300,-700],[5350,5350,-800],[5350,5350,-800],[5350,5350,-700],[5300,5300,-800],[6700,6700,-900],[6650,6650,-1000],[6650,6650,-900],[6700,6700,-1000],[6650,6650,-900],[7150,7150,-1100],[7100,7100,-1000],[7100,7100,-1000],[7100,7100,-1000],[7150,7150,-1000],[8450,8450,-1200],[8450,8450,-1200],[8450,8450,-1200],[8450,8450,-1300],[8450,8450,-1200]]),
    [HeroName.Rusty]: buildHeroRanks(HeroName.Rusty,HeroType.Brawler,Tiers.Rare,[Stats.InfantryAttack,Stats.InfantryDefense,Stats.MetalGatheringSpeed], [[7800,7800,1200],[1800,1800,300],[1750,1750,200],[1750,1750,300],[1750,1750,300],[1750,1750,300],[1950,1950,300],[1950,1950,300],[2000,2000,300],[1950,1950,300],[1950,1950,300],[2150,2150,300],[2150,2150,300],[2150,2150,300],[2150,2150,400],[2150,2150,300],[2350,2350,400],[2350,2350,300],[2300,2300,400],[2350,2350,300],[2350,2350,400],[2950,2950,500],[2950,2950,400],[2900,2900,500],[2950,2950,400],[2900,2900,500],[3150,3150,400],[3150,3150,500],[3100,3100,500],[3150,3150,500],[3100,3100,500],[3700,3700,500],[3750,3750,600],[3700,3700,600],[3700,3700,500],[3750,3750,600]]),
    [HeroName.Sarge]: buildHeroRanks(HeroName.Sarge,HeroType.Marksman,Tiers.Epic,[Stats.HunterAttack,Stats.HunterDefense,Stats.TroopInfectedDefense], [[10400,10400,5200],[2350,2350,1200],[2350,2350,1200],[2350,2350,1100],[2350,2350,1200],[2350,2350,1200],[2600,2600,1300],[2600,2600,1300],[2600,2600,1300],[2650,2650,1300],[2600,2600,1300],[2850,2850,1400],[2850,2850,1500],[2900,2900,1400],[2850,2850,1400],[2850,2850,1500],[3150,3150,1500],[3100,3100,1600],[3150,3150,1500],[3100,3100,1600],[3150,3150,1600],[3900,3900,1900],[3900,3900,2000],[3950,3950,1900],[3900,3900,2000],[3900,3900,1900],[4150,4150,2100],[4200,4200,2100],[4150,4150,2100],[4150,4150,2100],[4200,4200,2100],[4950,4950,2400],[4950,4950,2500],[4950,4950,2500],[4950,4950,2500],[4950,4950,2500]]),
    [HeroName.Tony]: buildHeroRanks(HeroName.Tony,HeroType.Marksman,Tiers.Epic,[Stats.HunterAttack,Stats.HunterDefense,Stats.TroopInfectedDefense], [[10400,10400,5200],[2350,2350,1200],[2350,2350,1200],[2350,2350,1100],[2350,2350,1200],[2350,2350,1200],[2600,2600,1300],[2600,2600,1300],[2600,2600,1300],[2650,2650,1300],[2600,2600,1300],[2850,2850,1400],[2850,2850,1500],[2900,2900,1400],[2850,2850,1400],[2850,2850,1500],[3150,3150,1500],[3100,3100,1600],[3150,3150,1500],[3100,3100,1600],[3150,3150,1600],[3900,3900,1900],[3900,3900,2000],[3950,3950,1900],[3900,3900,2000],[3900,3900,1900],[4150,4150,2100],[4200,4200,2100],[4150,4150,2100],[4150,4150,2100],[4200,4200,2100],[4950,4950,2400],[4950,4950,2500],[4950,4950,2500],[4950,4950,2500],[4950,4950,2500]]),
    [HeroName.Travis]: buildHeroRanks(HeroName.Travis,HeroType.Scout,Tiers.Epic,[Stats.RiderAttack,Stats.RiderDefense,Stats.TroopInfectedLethality], [[8350,8350,5200],[1850,1850,1200],[1900,1900,1200],[1850,1850,1100],[1900,1900,1200],[1850,1850,1200],[2100,2100,1300],[2100,2100,1300],[2100,2100,1300],[2050,2050,1300],[2100,2100,1300],[2300,2300,1400],[2300,2300,1500],[2300,2300,1400],[2250,2250,1400],[2300,2300,1500],[2500,2500,1500],[2500,2500,1600],[2500,2500,1500],[2500,2500,1600],[2500,2500,1600],[3150,3150,1900],[3150,3150,2000],[3100,3100,1900],[3150,3150,2000],[3100,3100,1900],[3350,3350,2100],[3350,3350,2100],[3300,3300,2100],[3350,3350,2100],[3350,3350,2100],[3950,3950,2400],[3950,3950,2500],[3950,3950,2500],[4000,4000,2500],[3950,3950,2500]]),
    [HeroName.Trish]: buildHeroRanks(HeroName.Trish,HeroType.Scout,Tiers.Legendary,[Stats.RiderAttack,Stats.RiderDefense,Stats.EnemySettlementTroopAttack], [[23750,23750,-3500],[3450,3450,-500],[3450,3450,-500],[3450,3450,-500],[3500,3500,-500],[3450,3450,-500],[3850,3850,-600],[3900,3900,-600],[3900,3900,-500],[3900,3900,-600],[3850,3850,-600],[4350,4350,-600],[4300,4300,-700],[4350,4350,-600],[4300,4300,-600],[4300,4300,-700],[5200,5200,-700],[5200,5200,-800],[5150,5150,-800],[5200,5200,-700],[5200,5200,-800],[6450,6450,-900],[6500,6500,-1000],[6500,6500,-900],[6450,6450,-1000],[6500,6500,-900],[6900,6900,-1100],[6900,6900,-1000],[6900,6900,-1000],[6950,6950,-1000],[6900,6900,-1000],[8200,8200,-1200],[8200,8200,-1200],[8200,8200,-1200],[8200,8200,-1300],[8250,8250,-1200]]),
    [HeroName.Wolfe]: buildHeroRanks(HeroName.Wolfe,HeroType.Brawler,Tiers.Legendary,[Stats.InfantryAttack,Stats.InfantryDefense,Stats.SettlementTroopHealth], [[24450,24450,7000],[3550,3550,1000],[3550,3550,1000],[3600,3600,1000],[3550,3550,1100],[3550,3550,1000],[4000,4000,1100],[4000,4000,1200],[4000,4000,1100],[4000,4000,1100],[4000,4000,1200],[4450,4450,1300],[4450,4450,1200],[4450,4450,1300],[4450,4450,1300],[4450,4450,1200],[5300,5300,1600],[5350,5350,1500],[5350,5350,1500],[5350,5350,1500],[5300,5300,1600],[6700,6700,1900],[6650,6650,1900],[6650,6650,1900],[6700,6700,1900],[6650,6650,1900],[7150,7150,2000],[7100,7100,2100],[7100,7100,2000],[7100,7100,2000],[7150,7150,2100],[8450,8450,2400],[8450,8450,2400],[8450,8450,2400],[8450,8450,2400],[8450,8450,2400]])
} as const;
