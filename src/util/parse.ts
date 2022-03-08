type ParseIntOptions = {
    min?: number,
    max?: number
}

export const safeParseInt = (value: string, options?: ParseIntOptions) => {
    const opts = Object.assign({}, {min: -Infinity, max: Infinity}, options);

    let number = parseInt(value);
    if (isNaN(number)) {
        number = 0;
    }

    return Math.min(Math.max(opts.min, number), opts.max);
}
