import React from 'react';
import { Link } from 'react-router-dom';
import { ActionButton, FunctionButton } from '../button/Button';
import styles from './ItemList.module.css';

type ListableItem = {
    id: string,
    name: string
};

type ItemActionCallback<T extends ListableItem> = (item: T) => void;

type ItemActionProps<T extends ListableItem> = {
    onClick: ItemActionCallback<T>,
    children: string
};
export const ItemAction = <T extends ListableItem>(props: ItemActionProps<T>) => {
    return null;
}

type ItemListProps<T extends ListableItem> = {
    items: T[],
    onAdd?: () => void,
    addLabel?: string,
    children?: React.ReactElement<ItemActionProps<T>>[],
    path: string,
    className?: string
};

export const ItemList = <T extends ListableItem>(props: ItemListProps<T>) => {
    const {items, onAdd, addLabel, children, path, className} = props;
    const sortedItems = [...items];
    sortedItems.sort((a: T, b: T) => {
        let nameResult = a.name.localeCompare(b.name);
        return (nameResult !== 0) ? nameResult : a.id.localeCompare(b.id);
    });

    const actionCallbacks = children ?
        React.Children.map(children, child => child.props.onClick) :
        [];

    return (
        <div className={styles.itemList + (className || '')}>
            <div className={styles.listActions}>
                {onAdd &&
                    <ActionButton onClick={onAdd}>{addLabel || '＋ Add'}</ActionButton>
                }
            </div>
            <ul>
                {sortedItems.map(item => (
                    <li key={item.id}>
                        <Link to={`${path}${item.id}`}>{item.name}</Link>
                        <span className={styles.itemActions}>
                            {React.Children.map(children, (child, i) => {
                                if (!child) {
                                    return null;
                                }
                                return (
                                    <FunctionButton key={i} value={item}
                                        onClick={actionCallbacks[i]}
                                    >
                                        {child.props.children}
                                    </FunctionButton>
                                );
                            })}
                        </span>
                    </li>
                ))}
            </ul>
        </div>
    );
}
