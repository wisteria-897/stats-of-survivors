import React from 'react';
import { useNavigate, useParams, Outlet } from 'react-router-dom';
import { Subtract } from 'utility-types';
import { useAppSelector, useAppDispatch } from '../../app/hooks';
import { aggregateBonuses } from '../../game/bonus';
import { NavItem, SubNavigation } from '../navigation/Navigation';
import LevelPicker from '../../ui/level/LevelPicker';
import { ItemAction, ItemList } from '../../ui/list/ItemList';
import { LeveledBonusProviderList, StatBonusList } from '../bonus/BonusList';
import { AllianceTechs } from '../../game/allianceTech';
import {
    Alliance,
    createAlliance,
    addAlliance,
    deleteAlliance,
    partialUpdateAlliance,
    selectAlliance,
    selectAlliances
} from './allianceSlice';
import styles from './Alliance.module.css';

type SubComponentProps = {alliance: Alliance, dispatch: ReturnType<typeof useAppDispatch>}

function getStatBonuses(alliance: Alliance) {
    return (!alliance || !alliance.allianceTech) ? []
        : aggregateBonuses(alliance.allianceTech, AllianceTechs);
}

function subPanelOf<T extends SubComponentProps>(Component: React.ComponentType<T>) {
    return function SPO(props: Subtract<T, SubComponentProps>) {
        const dispatch = useAppDispatch();
        const params = useParams();
        const alliance = useAppSelector(state => selectAlliance(state, params.allianceId || ''));
        if (!alliance) {
            return <p>Alliance not Found</p>;
        }

        return (
            <section className={styles.subPanel}>
                <Component {...props as T} {...{alliance, dispatch}}/>
            </section>
        );
    }
}

export const AllianceStatsPanel = subPanelOf(({alliance}) => (
    <section>
        <h2>Bonuses</h2>
        <StatBonusList bonuses={getStatBonuses(alliance)}/>
    </section>
));

export const AllianceTechPanel = subPanelOf(({alliance, dispatch}) => (
    <section>
        <LeveledBonusProviderList providers={AllianceTechs} levels={alliance.allianceTech}
            onChange={allianceTech => dispatch(partialUpdateAlliance({id: alliance.tag, value: {allianceTech}}))}
        />
    </section>
));

export const AllianceBasicsPanel = subPanelOf(({alliance, dispatch}) => {
    const partialUpdate = (partial: Partial<Alliance>) => {
        dispatch(partialUpdateAlliance({id: alliance.id, value: partial}));
    }

    return (
        <section>
            <label>
                <span>Name:</span>
                <input type="text" placeholder="Alliance name" value={alliance.name}
                    onChange={(e) => partialUpdate({name: e.target.value})} />
            </label>
            <label>
                <span>Tag:</span>
                <input type="text" placeholder="Tag" minLength={3} maxLength={3} value={alliance.tag}
                    onChange={(e) => partialUpdate({tag: e.target.value})} />
            </label>
            <LevelPicker label="Alliance level:" min={1} max={11} level={alliance.level}
                onChange={level => partialUpdate({level})} />
        </section>
    );
});

export const AllianceDisplayPanel = () => {
    const params = useParams();
    const alliance = useAppSelector(state => selectAlliance(state, params.allianceId || ''));
    if (alliance == null) {
        return <p>Not found</p>;
    }

    return (
        <section className={styles.alliancePanel}>
            <header>
                <h1 className={styles.name}>[{alliance.tag}] - {alliance.name}</h1>
                <span className={styles.keyStats}>
                    <span className={styles.keyStat}>Level {alliance.level}</span>
                </span>
                <SubNavigation>
                    <NavItem end to={`/alliances/${alliance.id}`}>Stats</NavItem>
                    <NavItem to={`/alliances/${alliance.id}/basics`}>Basics</NavItem>
                    <NavItem to={`/alliances/${alliance.id}/tech`}>Alliance Tech</NavItem>
                </SubNavigation>
            </header>
            <Outlet/>
        </section>
    );
}

export const AllianceList = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();
    const alliances = useAppSelector((state) => selectAlliances(state));

    const onAdd = () => {
        const newAlliance = createAlliance();
        dispatch(addAlliance(newAlliance));
        navigate(`/alliances/${newAlliance.id}/basics`);
    }

    const onCopy = (alliance: Alliance) => {
        const copy = createAlliance(alliance, {name: `Copy of ${alliance.name}`});
        dispatch(addAlliance(copy));
        navigate(`/alliances/${copy.id}/basics`);
    }

    const onDelete = (alliance: Alliance) => {
        dispatch(deleteAlliance(alliance));
    }

    return (
        <ItemList items={alliances} path="/alliances/"
            addLabel="＋ Add Alliance" onAdd={onAdd}
        >
            <ItemAction onClick={onCopy}>👥 Copy</ItemAction>
            <ItemAction onClick={onDelete}>❌ Delete</ItemAction>
        </ItemList>
    );
}

export function AlliancePanel() {
    return <Outlet/>;
}
