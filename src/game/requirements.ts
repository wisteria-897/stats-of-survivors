import { Keyable } from '../util/itertools';

export type Requirement<T> = (state: T) => boolean;

export const noOp = (state: any) => true;

type RequiredLevelFunction<T extends Keyable> = (key: T) => number;

export const hasLevel = <T extends {level: number}>(levelRequired: number): Requirement<T> => {
    return (state: T) => state.level >= levelRequired;
}

export const hasBonusLevel = <T, U extends Keyable>(
    providerKey: U,
    levelRequired: number | RequiredLevelFunction<U>,
    selector: (state: T) => Partial<Record<U, number>>
): Requirement<T> => {
    return (state: T) => {
        const level = selector(state)[providerKey];
        const target = (typeof(levelRequired) === 'number' ? levelRequired : levelRequired(providerKey));
        return level !== undefined && level >= target;
    };
}

export const anyOf = <T>(...prerequisites: Requirement<T>[]): Requirement<T> => {
    return (state: T) => prerequisites.find(prereq => prereq(state)) !== undefined;
}

export const allOf = <T>(...prerequisites: Requirement<T>[]): Requirement<T> => {
    return (state: T) => prerequisites.every(prereq => prereq(state));
}
