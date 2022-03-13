import { NavLink } from 'react-router-dom';
import styles from './Navigation.module.css';

export function Navigation() {
    type LinkClassNameFunction = (x: {isActive: boolean}) => string;
    const linkClassNameFn: LinkClassNameFunction = ({isActive}) => (isActive) ? styles.active : '';
    return (
        <nav className={styles.navBar}>
            <ul>
                <li className={styles.appName}>
                    Stats of Survivors
                    <span className={styles.byline}>~ by <a href="https://github.com/wisteria-897" target="_blank" rel="noreferrer noopener">wisteria-897</a></span>
                </li>
                <li className={styles.navItem}>
                    <NavLink to="/chiefs" className={linkClassNameFn}>Chiefs</NavLink>
                </li>
                <li className={styles.navItem}>
                    <NavLink to="/alliances" className={linkClassNameFn}>Alliances</NavLink>
                </li>
                <li className={styles.navItem}>
                    <NavLink to="/formations" className={linkClassNameFn}>Formations</NavLink>
                </li>
                <li className={styles.navItem}>
                    <NavLink to="/speedups" className={linkClassNameFn}>SpeedUps</NavLink>
                </li>
            </ul>
        </nav>
    );
}

type LinkClassNameFunction = (x: {isActive: boolean}) => string;
const linkClassNameFn: LinkClassNameFunction = ({isActive}) => (isActive) ? styles.active : '';

type NavItemProps = {
    to: string,
    end?: boolean,
    children: React.ReactNode
};
export function NavItem({to, end, children}: NavItemProps) {
    return (
        <li>
            <NavLink {...{to, end}} className={linkClassNameFn}>
                {children}
            </NavLink>
        </li>
    );
}

type SubNavigationProps = {
    children: React.ReactElement<typeof NavItem>[]
};
export function SubNavigation({children}: SubNavigationProps) {
    return (
        <nav className={styles.subNav}>
            <ul>
                {children}
            </ul>
        </nav>
    );
}
