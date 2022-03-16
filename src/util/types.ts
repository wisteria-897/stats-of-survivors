import { TypeSafe } from './itertools';

export type EnumMap<TKey extends string, TValue> = {[key in TKey]: TValue};
export type PartialEnumMap<TKey extends string, TValue> = {[key in TKey]?: TValue};

type ValueFunction<TKey extends string, TValue, TResult> = (k: TKey, v: TValue) => TResult;
export function enumMapOf<
    T extends string,
    U extends any,
    V extends Exclude<any, Function>
>(source: EnumMap<T, U>, value: V | ValueFunction<T, U, V>): EnumMap<T, V> {
    let valueFn: ValueFunction<T, U, V>;
    if (typeof value === 'function') {
        valueFn = value as ValueFunction<T, U, V>;
    } else {
        valueFn = (k: T, v: U): V => value;
    }

    const entries = TypeSafe.entries<T, U>(source).map(([k, v]) => {
        return [k, valueFn(k, v)];
    });
    return Object.fromEntries(entries) as EnumMap<T, V>;
}
