import { useAppSelector, useAppDispatch } from '../../app/hooks';
import {
    setCurrentPage,
    selectCurrentPage,
    Page
} from './navigationSlice';
import styles from './Navigation.module.css';

export function Navigation() {
    const currentPage = useAppSelector(selectCurrentPage);
    const dispatch = useAppDispatch();

    return (
        <nav className={styles.navBar}>
            <ul>
                <li className={styles.appName}>
                    Stats of Survivors
                    <span className={styles.byline}>~ by 897.Wisteria</span>
                </li>
                <li className={styles.navItem + ' ' + (currentPage === Page.Troops ? styles.active : '')}
                    onClick={() => dispatch(setCurrentPage(Page.Troops))}>Formations</li>
                <li className={styles.navItem + ' ' + (currentPage === Page.Chief ? styles.active : '')}
                    onClick={() => dispatch(setCurrentPage(Page.Chief))}>Chief</li>
                <li className={styles.navItem + ' ' + (currentPage === Page.Alliance ? styles.active : '')}
                    onClick={() => dispatch(setCurrentPage(Page.Alliance))}>Alliance</li>
                <li className={styles.navItem + ' ' + (currentPage === Page.CustomChestPlanner ? styles.active : '')}
                    onClick={() => dispatch(setCurrentPage(Page.CustomChestPlanner))}>Custom Chests</li>
            </ul>
        </nav>
    );
}
