export type EnumMap<TKey extends string, TValue> = {[key in TKey]: TValue};
export type PartialEnumMap<TKey extends string, TValue> = {[key in TKey]?: TValue};

export function enumMapOf<
    T extends string,
    U extends any
>(source: EnumMap<T, any>, emptyValue: U): EnumMap<T, U> {
    const o = Object.fromEntries(Object.keys(source).map(k => [k as T, emptyValue]));
    return o as EnumMap<T, U>;
}
