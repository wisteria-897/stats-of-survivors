import styles from './Button.module.css';

type CoreButtonProps = {
    className?: string,
    children: string
};

type ActionButtonProps = CoreButtonProps & {
    onClick: () => void
};
export function ActionButton({className, onClick, children}: ActionButtonProps) {
    return (
        <button className={styles.button + ' ' + (className || '')}
            onClick={(e) => onClick()}
        >
            {children}
        </button>
    );
}

type FunctionButtonProps<T> = CoreButtonProps & {
    value: T,
    onClick: (value: T) => void
};
export function FunctionButton<T>({className, value, onClick, children}: FunctionButtonProps<T>) {
    return (
        <ActionButton {...{className}} onClick={() => onClick(value)}>
            {children}
        </ActionButton>
    );
}
