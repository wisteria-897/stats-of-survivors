import React, { useState } from 'react';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { EnumMap } from '../../util/types';
import { chainable } from '../../util/itertools';
import { safeParseInt } from '../../util/parse';
import LevelPicker from '../../ui/level/LevelPicker';
import { Bonus } from '../../game/bonus';
import { getVipLevel } from '../../game/vip';
import { HeroGear, HeroGears } from '../../game/heroGear';
import { ChiefGears, ChiefGearSlot } from '../../game/chiefGear';
import { ResearchTech, ResearchTechs, ResearchTechName } from '../../game/research';
import { StatTalent, Talent, Talents, TalentName } from '../../game/talents';
import { AllianceTech, AllianceTechs, AllianceTechName, StatAllianceTech } from '../../game/allianceTech';
import { Building, Buildings, BuildingName } from '../../game/buildings';
import { ChiefBadge, ChiefBadges, ChiefBadgeSlot } from '../../game/badges';
import { selectAllianceByTag } from '../alliance/allianceSlice';
import {
    Chief,
    ChiefId,
    createChief,
    setChief,
    addChief,
    copyChief,
    updateChief,
    selectChief,
    selectChiefs,
    selectChiefGear,
    selectChiefGearList,
    selectChiefHeroGear,
    selectChiefHeroGearList
} from './chiefSlice';
import { BonusSourceDisplay, BonusList } from '../bonus/BonusList';
import styles from './Chief.module.css';

const getChiefDisplayName = (chief: Chief): string => {
    return (chief.allianceTag ? '[' + chief.allianceTag + '] ' : '') + chief.name;
};


const getChiefGearListItems = (chief: Chief): JSX.Element[] => {
    return [
        ChiefGears.Helmet, ChiefGears.Armor, ChiefGears.Kneepads,
        ChiefGears['Assault Rifle'], ChiefGears.Boots, ChiefGears.Communicator
    ].map(cg => {
        const gl = useAppSelector(state => selectChiefGear(state, chief.id, cg));
        const glContent = gl ? <BonusSourceDisplay source={gl}/> : '<None>';
        return <li key={cg.name}>{glContent}</li>;
    });
};

type SubComponentProps = { chief: Chief }

const ChiefGearDisplayPanel = (props: { chief: Chief }) => {
    const { chief } = props;

    return (
        <section>
            <h3>Chief Gear</h3>
            <ul>
                {getChiefGearListItems(chief)}
            </ul>
        </section>
    );
};

const getHeroGearListItems = (chief: Chief): JSX.Element[] => {
    return [
        HeroGears.BrawlerHead, HeroGears.BrawlerBody, HeroGears.BrawlerFoot,
        HeroGears.MarksmanHead, HeroGears.MarksmanBody, HeroGears.MarksmanFoot,
        HeroGears.ScoutHead, HeroGears.ScoutBody, HeroGears.ScoutFoot,
    ].map(hg => {
        const gearLevel = useAppSelector(state => selectChiefHeroGear(state, chief.id, hg));
        const glContent = gearLevel ? <BonusSourceDisplay source={gearLevel}/> : '<None>';
        return <li key={hg.heroType+'/'+hg.name}>{glContent}</li>;
    });
};

const ResearchLevelList = ({chief}: SubComponentProps) => {
    const listItems = (!chief || !chief.research) ? <li key="none">&lt;None&gt;</li>
        : Object.entries(chief.research)
            .filter(([k, v]) => v != 0)
            .map(([k, v]) => <li key={k}><span>{k}: </span><span>{v}</span></li>);

    return (
        <section>
            <h3>Chief Research</h3>
            <ul>
                {listItems}
            </ul>
        </section>
    );
}

const TalentLevelList = ({chief}: SubComponentProps) => {
    const listItems = (!chief || !chief.talents) ? <li key="none">&lt;None&gt;</li>
        : Object.entries(chief.talents)
            .filter(([k, v]) => v != 0)
            .map(([k, v]) => <li key={k}><span>{k}: </span><span>{v}</span></li>);

    return (
        <section>
            <h3>Talents</h3>
            <ul>
                {listItems}
            </ul>
        </section>
    );
}

const BuildingLevelList = ({chief}: SubComponentProps) => {
    const listItems = (!chief || !chief.buildings) ? <li key="none">&lt;None&gt;</li>
        : Object.entries(chief.buildings)
            .filter(([k, v]) => v != 0)
            .map(entry => {
                const [k, v] = entry as [BuildingName, number];
                return <li key={k}><span>{Buildings[k].levels[v - 1].name}</span></li>;
            });

    return (
        <section>
            <h3>Buildings</h3>
            <ul>
                {listItems}
            </ul>
        </section>
    );
}

const ChiefBadgeLevelList = ({chief}: SubComponentProps) => {
    const listItems = (!chief || !chief.badges) ? <li key="none">&lt;None&gt;</li>
        : Object.entries(chief.badges)
            .filter(([k, v]) => v != 0)
            .map(entry => {
                const [k, v] = entry as [ChiefBadgeSlot, number];
                return <li key={k}><span>{ChiefBadges[k].levels[v - 1].name}</span></li>;
            });

    return (
        <section>
            <h3>Chief Badges</h3>
            <ul>
                {listItems}
            </ul>
        </section>
    );
}

const HeroGearDisplayPanel = (props: { chief: Chief }) => {
    const { chief } = props;
    return (
        <section>
            <h3>Hero Gear</h3>
            <ul>
                {getHeroGearListItems(chief)}
            </ul>
        </section>
    );
};

const ChiefBonusList = (props: {chief: Chief}) => {
    const {chief} = props;
    const vipLevel = getVipLevel(chief.vipLevel);
    const chiefGearList = [
        ChiefGears.Helmet, ChiefGears.Armor, ChiefGears.Kneepads,
        ChiefGears['Assault Rifle'], ChiefGears.Boots, ChiefGears.Communicator
    ];
    const chiefGearLevels = useAppSelector(state => selectChiefGearList(state, chief.id, ...chiefGearList));
    const heroGearList = [
        HeroGears.BrawlerHead, HeroGears.BrawlerBody, HeroGears.BrawlerFoot,
        HeroGears.MarksmanHead, HeroGears.MarksmanBody, HeroGears.MarksmanFoot,
        HeroGears.ScoutHead, HeroGears.ScoutBody, HeroGears.ScoutFoot
    ];
    const heroGearLevels = useAppSelector(state => selectChiefHeroGearList(state, chief.id, ...heroGearList));

    const researchLevelBonuses = (!chief || !chief.research) ? []
        : Object.entries(chief.research)
            .filter(([k, v]) => v > 0)
            .reduce((result, entry) => {
                const [techName, level] = entry as [ResearchTechName, number];
                for (let i = 0; i < level; i++) {
                    result = result.concat(ResearchTechs[techName].levels[i].bonuses);
                }
                return result;
            }, [] as Bonus[]);

    const talentLevelBonuses = (!chief || !chief.talents) ? []
        : Object.entries(chief.talents)
            .filter(([k, v]) => v > 0)
            .reduce((result, entry) => {
                const [talentName, level] = entry as [TalentName, number];
                const talent = Talents[talentName];
                if (talent instanceof StatTalent) {
                    for (let i = 0; i < level; i++) {
                        result = result.concat(talent.levels[i].bonuses);
                    }
                }
                return result;
            }, [] as Bonus[]);

    const buildingLevelBonuses = (!chief || !chief.buildings) ? []
        : Object.entries(chief.buildings)
            .filter(([k, v]) => v > 0)
            .reduce((result, entry) => {
                const [buildingName, level] = entry as [BuildingName, number];
                const building = Buildings[buildingName];
                for (let i = 0; i < level; i++) {
                    result = result.concat(building.levels[i].bonuses);
                }
                return result;
            }, [] as Bonus[]);

    const badgeLevelBonuses = (!chief || !chief.badges) ? []
        : Object.entries(chief.badges)
            .filter(([k, v]) => v > 0)
            .reduce((result, entry) => {
                const [badgeSlot, level] = entry as [ChiefBadgeSlot, number];
                const badge = ChiefBadges[badgeSlot];
                for (let i = 0; i < level; i++) {
                    result = result.concat(badge.levels[i].bonuses);
                }
                return result;
            }, [] as Bonus[]);

    const alliance = useAppSelector(state => selectAllianceByTag(state, chief.allianceTag || ''));
    console.log('bonuses', chief.allianceTag, alliance);
    let allianceTechBonuses: Bonus[] = [];
    if (alliance && alliance.allianceTech) {
        console.log('bonuses', alliance.allianceTech);
        allianceTechBonuses = Object.entries(alliance.allianceTech)
            .filter(entry => {
                const [k, v] = entry as [AllianceTechName, number];
                return v > 0;
            })
            .reduce((result, entry) => {
                const [techName, level] = entry as [AllianceTechName, number];
                const tech = AllianceTechs[techName];
                if (tech instanceof StatAllianceTech) {
                    for (let i = 0; i < level; i++) {
                        result = result.concat(tech.levels[i].bonuses);
                    }
                }
                return result;
            }, [] as Bonus[]);
    }

    console.log('bonuses', allianceTechBonuses);
    const bonuses: Bonus[] = ([] as Bonus[]).concat(
        vipLevel.bonuses,
        ...chainable(() => chiefGearLevels).notNull().map(gl => gl.bonuses).asArray(),
        ...chainable(() => heroGearLevels).notNull().map(gl => gl.bonuses).asArray(),
        ...researchLevelBonuses,
        ...talentLevelBonuses,
        ...buildingLevelBonuses,
        ...badgeLevelBonuses,
        ...allianceTechBonuses
    );

    return (
        <div>
            <h3>Bonuses</h3>
            <BonusList bonuses={bonuses} />
        </div>
    );
}

const ChiefGearSelector = (props: {level: number, slot: ChiefGearSlot, onChange: (level: number) => any}) => {
    const {level, slot, onChange} = props;
    const options = ChiefGears[slot].levels.map(gl => <option key={gl.level} value={gl.level}>{gl.name}</option>);
    return (
        <label className={styles.chiefGearSelector}>
            <span>{slot}:</span>
            <select value={level} onChange={(e) => onChange(safeParseInt(e.target.value))}>
                <option value="0">&lt;None&gt;</option>
                {options}
            </select>
        </label>
    );
}

const HeroGearSelector = (props: {level: number, gear: HeroGear, onChange: (level: number) => any}) => {
    const {level, gear, onChange} = props;
    const options = gear.levels.map(gl => <option key={gl.level} value={gl.level}>{gl.name}</option>);
    return (
        <label className={styles.chiefGearSelector}>
            <span>{gear.heroType} {gear.name}:</span>
            <select value={level} onChange={(e) => onChange(safeParseInt(e.target.value))}>
                <option value="0">&lt;None&gt;</option>
                {options}
            </select>
        </label>
    );
}

const ResearchLevelEditor = (props: {tech: ResearchTech, level: number, onChange: (tech: ResearchTech, level: number) => any}) => {
    const {tech, level, onChange} = props;
    return (
        <LevelPicker key={tech.name} label={tech.name} level={level} min={0} max={tech.levels.length}
            onChange={(value: number) => onChange(tech, value)} />
    );
}

const TalentLevelEditor = (props: {talent: Talent, level: number, onChange: (talent: Talent, level: number) => any}) => {
    const {talent, level, onChange} = props;
    const max = (talent instanceof StatTalent) ? talent.levels.length : 1;
    return (
        <LevelPicker key={talent.name} label={talent.name} level={level} min={0} max={max}
            onChange={(value: number) => onChange(talent, value)} />
    );
}

const BuildingLevelEditor = (props: {building: Building, level: number, onChange: (building: Building, level: number) => any}) => {
    const {building, level, onChange} = props;
    return (
        <LevelPicker key={building.name} label={building.name} level={level} min={0} max={building.levels.length}
            onChange={(value: number) => onChange(building, value)} />
    );
}

const ChiefBadgeLevelEditor = (props: {badge: ChiefBadge, level: number, onChange: (badge: ChiefBadge, level: number) => any}) => {
    const {badge, level, onChange} = props;
    const options = badge.levels.map(bl => <option key={bl.level} value={bl.level}>{bl.badgeTier} {bl.badgeTierLevel}</option>);
    return (
        <label className={styles.badgeLevelSelector}>
            <span>{badge.name}:</span>
            <select value={level} onChange={(e) => onChange(badge, safeParseInt(e.target.value))}>
                <option value="0">&lt;None&gt;</option>
                {options}
            </select>
        </label>
    );
}

const ChiefEditor = (props: {chief: Chief, onComplete: (update: Chief | null) => any}) => {
    const emptyResearch: {[key in ResearchTechName]?: number} = {};
    for (const techName in ResearchTechs) {
        emptyResearch[techName as ResearchTechName] = 0;
    }

    const emptyTalents = Object.entries(Talents).map(([k, v]) => v as Talent).reduce((result, talent) => {
        result[talent.name] = 0;
        return result;
    }, EnumMap.empty<number>(TalentName)) as {[key in TalentName]: number}

    const emptyBuildings = Object.entries(Buildings).map(([k, v]) => v as Building).reduce((result, building) => {
        result[building.name] = 0;
        return result;
    }, EnumMap.empty<number>(BuildingName)) as {[key in BuildingName]: number}

    const emptyBadges = Object.entries(ChiefBadges).map(([k, v]) => v as ChiefBadge).reduce((result, badge) => {
        result[badge.slot] = 0;
        return result;
    }, EnumMap.empty<number>(ChiefBadgeSlot)) as {[key in ChiefBadgeSlot]: number}

    const {chief, onComplete} = props;
    const [chiefName, setChiefName] = useState(chief.name);
    const [allianceTag, setAllianceTag] = useState(chief.allianceTag);
    const [vipLevel, setVipLevel] = useState(chief.vipLevel);
    const [chiefLevel, setChiefLevel] = useState(chief.level);
    const [chiefGear, setChiefGear] = useState(chief.chiefGear);
    const [heroGear, setHeroGear] = useState(chief.heroGear);
    const [research, setResearch] = useState(chief.research || emptyResearch);
    const [talents, setTalents] = useState(chief.talents || emptyTalents);
    const [buildings, setBuildings] = useState(chief.buildings || emptyBuildings);
    const [badges, setBadges] = useState(chief.badges || emptyBadges);

    const onSave = () => {
        const updatedChief = Object.assign({}, chief, {
            name: chiefName,
            level: chiefLevel,
            allianceTag, vipLevel, chiefGear, heroGear, research, talents, buildings, badges
        });
        onComplete(updatedChief);
    }

    const setChiefGearSlot = (slot: ChiefGearSlot, level: number) => {
        setChiefGear(Object.assign({}, chiefGear, {[slot]: level}));
    }

    const setHeroGearSlot = (gear: HeroGear, level: number) => {
        setHeroGear(Object.assign({}, heroGear, {[gear.key]: level}));
    }

    const researchEditors = Object.entries(research).map(entry => {
        const [techName, level] = entry as [techName: ResearchTechName, level: number];
        const onChange = (tech: ResearchTech, value: number) => {
            const update = {[tech.name]: value} as {[key in ResearchTechName]: number};
            setResearch(Object.assign({}, research, update));
        }
        return <ResearchLevelEditor key={techName} tech={ResearchTechs[techName]} level={level} onChange={onChange} />;
    });

    const talentEditors = Object.entries(talents).map(entry => {
        const [talentName, level] = entry as [talentName: TalentName, level: number];
        const onChange = (talent: Talent, value: number) => {
            const update = {[talent.name]: value} as {[key in TalentName]: number};
            setTalents(Object.assign({}, talents, update));
        }
        return <TalentLevelEditor key={talentName} talent={Talents[talentName]} level={level} onChange={onChange} />;
    });

    const buildingEditors = Object.entries(buildings).map(entry => {
        const [buildingName, level] = entry as [buildingName: BuildingName, level: number];
        const onChange = (building: Building, value: number) => {
            const update = {[building.name]: value} as {[key in BuildingName]: number};
            setBuildings(Object.assign({}, buildings, update));
        }
        return <BuildingLevelEditor key={buildingName} building={Buildings[buildingName]} level={level} onChange={onChange} />;
    });

    const badgeEditors = Object.entries(badges).map(entry => {
        const [badgeSlot, level] = entry as [badgeSlot: ChiefBadgeSlot, level: number];
        const onChange = (badge: ChiefBadge, value: number) => {
            const update = {[badge.slot]: value} as {[key in ChiefBadgeSlot]: number};
            setBadges(Object.assign({}, badges, update));
        }
        return <ChiefBadgeLevelEditor key={badgeSlot} badge={ChiefBadges[badgeSlot]} level={level} onChange={onChange} />;
    });

    return (
        <div className={styles.chiefEditor}>
            <h2>Edit Chief</h2>
            <label>
                <span>Name:</span>
                <input type="text" placeholder="Chief name" value={chiefName} onChange={(e) => setChiefName(e.target.value)} />
            </label>
            <label>
                <span>Alliance:</span>
                <input type="text" placeholder="Tag" minLength={3} maxLength={3} value={allianceTag || ''} onChange={(e) => setAllianceTag(e.target.value)} />
            </label>
            <LevelPicker label="Chief level:" min={0} max={60} level={chiefLevel} onChange={setChiefLevel} />
            <LevelPicker label="VIP level:" min={0} max={12} level={vipLevel} onChange={setVipLevel} />
            <h3>Chief Gear</h3>
            <ul className={styles.chiefEditorGearList}>
                <li>
                    <ChiefGearSelector slot={ChiefGearSlot.Helmet} level={chiefGear[ChiefGearSlot.Helmet]}
                        onChange={(level: number) => setChiefGearSlot(ChiefGearSlot.Helmet, level)} />
                </li>
                <li>
                    <ChiefGearSelector slot={ChiefGearSlot.Armor} level={chiefGear[ChiefGearSlot.Armor]}
                        onChange={(level: number) => setChiefGearSlot(ChiefGearSlot.Armor, level)} />
                </li>
                <li>
                    <ChiefGearSelector slot={ChiefGearSlot.Kneepads} level={chiefGear[ChiefGearSlot.Kneepads]}
                        onChange={(level: number) => setChiefGearSlot(ChiefGearSlot.Kneepads, level)} />
                </li>
                <li>
                    <ChiefGearSelector slot={ChiefGearSlot.AssaultRifle} level={chiefGear[ChiefGearSlot.AssaultRifle]}
                        onChange={(level: number) => setChiefGearSlot(ChiefGearSlot.AssaultRifle, level)} />
                </li>
                <li>
                    <ChiefGearSelector slot={ChiefGearSlot.Boots} level={chiefGear[ChiefGearSlot.Boots]}
                        onChange={(level: number) => setChiefGearSlot(ChiefGearSlot.Boots, level)} />
                </li>
                <li>
                    <ChiefGearSelector slot={ChiefGearSlot.Communicator} level={chiefGear[ChiefGearSlot.Communicator]}
                        onChange={(level: number) => setChiefGearSlot(ChiefGearSlot.Communicator, level)} />
                </li>
            </ul>
            <h3>Chief Badges</h3>
            <ul>
                {badgeEditors}
            </ul>
            <h3>Hero Gear</h3>
            <ul className={styles.chiefEditorHeroGearList}>
                <li>
                    <HeroGearSelector gear={HeroGears.BrawlerHead} level={heroGear[HeroGears.BrawlerHead.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.BrawlerHead, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.BrawlerBody} level={heroGear[HeroGears.BrawlerBody.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.BrawlerBody, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.BrawlerFoot} level={heroGear[HeroGears.BrawlerFoot.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.BrawlerFoot, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.MarksmanHead} level={heroGear[HeroGears.MarksmanHead.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.MarksmanHead, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.MarksmanBody} level={heroGear[HeroGears.MarksmanBody.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.MarksmanBody, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.MarksmanFoot} level={heroGear[HeroGears.MarksmanFoot.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.MarksmanFoot, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.ScoutHead} level={heroGear[HeroGears.ScoutHead.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.ScoutHead, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.ScoutBody} level={heroGear[HeroGears.ScoutBody.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.ScoutBody, level)} />
                </li>
                <li>
                    <HeroGearSelector gear={HeroGears.ScoutFoot} level={heroGear[HeroGears.ScoutFoot.key]}
                        onChange={(level: number) => setHeroGearSlot(HeroGears.ScoutFoot, level)} />
                </li>
            </ul>
            <h3>Chief Tech</h3>
            <ul>
                {researchEditors}
            </ul>
            <h3>Talents</h3>
            <ul>
                {talentEditors}
            </ul>
            <h3>Buildings</h3>
            <ul>
                {buildingEditors}
            </ul>
            <button onClick={(e) => onSave()}>💾 Save</button>
            <button onClick={(e) => onComplete(null)}>❌ Cancel</button>
        </div>
    );
}


const ChiefDisplayPanel = (props: {chief: Chief}) => {
    const {chief} = props;
    const [isEditing, setIsEditing] = useState(false);
    const vipLevel = getVipLevel(chief.vipLevel);
    const dispatch = useAppDispatch();

    const onEditComplete = (update: Chief | null) => {
        if (update) {
            dispatch(updateChief(update));
        }
        setIsEditing(false);
    }

    if (isEditing) {
        return <ChiefEditor chief={chief} onComplete={onEditComplete} />;
    }

    return (
        <section className={styles.chiefPanel}>
            <header>
                <h2 className={styles.name}>{getChiefDisplayName(chief)}</h2>
                <span className={styles.keyStats}>
                    <span className={styles.keyStat}>{vipLevel.name}</span>
                    <span className={styles.keyStat}>Level {chief.level}</span>
                </span>
                <button className={styles.chiefAction} onClick={(e) => setIsEditing(true)}>✏️  Edit Chief</button>
                <button className={styles.chiefAction} onClick={(e) => dispatch(copyChief(chief.id))}>📋 Copy Chief</button>
                <button className={styles.chiefAction} onClick={(e) => dispatch(setChief(null))}>👥 Select Chief</button>
            </header>
            <section className={styles.detailSections}>
                <div>
                    <ChiefGearDisplayPanel chief={chief}/>
                    <ChiefBadgeLevelList chief={chief}/>
                    <HeroGearDisplayPanel chief={chief}/>
                </div>
                <div>
                    <ResearchLevelList chief={chief}/>
                    <TalentLevelList chief={chief}/>
                    <BuildingLevelList chief={chief}/>
                </div>
                <div>
                    <ChiefBonusList chief={chief}/>
                </div>
            </section>
        </section>
    );
}

const ChiefList = () => {
    const dispatch = useAppDispatch();
    const [newChief, setNewChief] = useState(null as Chief | null);
    const chiefs = useAppSelector((state) => selectChiefs(state));

    const onSelectChief = (id: ChiefId) => {
        dispatch(setChief(id));
    }

    const onAddComplete = (chief: Chief | null) => {
        if (chief != null) {
            dispatch(addChief(chief));
            onSelectChief(chief.id);
        }
        setNewChief(null);
    }

    if (newChief) {
        return <ChiefEditor chief={newChief} onComplete={onAddComplete}/>;
    }

    const chiefItems = chiefs.map(chief => {
        return (
            <li key={chief.id}>
                <a href="#" onClick={(e) => onSelectChief(chief.id)}>{chief.name}</a>
            </li>
        );
    });

    return (
        <section className={styles.chiefList}>
            <button onClick={(e) => setNewChief(createChief())}>➕ Add Chief</button>
            <ul>
                {chiefItems}
            </ul>
        </section>
    );
}

export function ChiefPanel() {
    const chief: Chief | null = useAppSelector((state) => selectChief(state));

    if (chief) {
        return <ChiefDisplayPanel chief={chief} />
    }
    return <ChiefList />;
}
