const empty = <TValue>(enumObject: any) => {
    return {} as {[key in typeof enumObject]?: TValue};
}

const full = <TValue>(enumObject: any, map: any) => {
    return map as {[key in typeof enumObject]: TValue};
}

export const EnumMap = {
    empty,
    full
};
